import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";

// 고양이 마을 채팅: 서버(service role)에서만 읽고 쓴다. 학생 확인은 부르는 쪽(dal.ts)에서.
export const CHAT_MAX_LENGTH = 80;
const HISTORY_LIMIT = 20;
const HISTORY_HOURS = 24;
const MIN_GAP_MS = 2000;
const PER_MINUTE = 20;

export type VillageChatMessage = {
  id: string;
  name: string;
  breed: string | null;
  text: string;
  mine: boolean;
  at: string;
};

/** 줄바꿈·제어 문자를 공백 하나로, 앞뒤 공백 제거, 80자(글자 단위)까지 */
export function cleanChatText(raw: unknown) {
  if (typeof raw !== "string") return "";
  const flat = raw.replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, " ").replace(/\s+/g, " ").trim();
  return [...flat].slice(0, CHAT_MAX_LENGTH).join("").trim();
}

type Row = { id: string; student_id: string; name: string; breed: string | null; text: string; created_at: string };

function toMessage(r: Row, viewerId: string): VillageChatMessage {
  return { id: r.id, name: r.name, breed: r.breed, text: r.text, mine: r.student_id === viewerId, at: r.created_at };
}

/**
 * 최근 메시지 (오래된 것부터). after가 있으면 그 시각 이후(같은 시각 포함 — 클라이언트가 id로 거른다)만.
 * 어느 쪽이든 최근 24시간, 최대 20개.
 */
export async function listVillageChat(viewerId: string, after?: string | null) {
  const since = new Date(Date.now() - HISTORY_HOURS * 60 * 60 * 1000);
  const afterDate = after ? new Date(after) : null;
  const from = afterDate && !Number.isNaN(afterDate.getTime()) && afterDate > since ? afterDate : since;
  const { data, error } = await createServerSupabaseClient()
    .from("village_chat")
    .select("id, student_id, name, breed, text, created_at")
    .gte("created_at", from.toISOString())
    // 처음엔 최근 20개, 이어 받을 때는 커서 다음부터 차례로 (밀려도 건너뛰지 않게)
    .order("created_at", { ascending: !!afterDate })
    .limit(afterDate ? 50 : HISTORY_LIMIT);
  if (error) {
    console.error("마을 채팅 조회 실패:", error.message);
    return [];
  }
  const rows = (data ?? []) as Row[];
  return (afterDate ? rows : rows.reverse()).map((r) => toMessage(r, viewerId));
}

/** 메시지 저장. 2초에 한 번, 1분에 20개까지 */
export async function sendVillageChat(sender: { id: string; name: string; breed: string | null }, raw: unknown) {
  const text = cleanChatText(raw);
  if (!text) return { ok: false as const, message: "할 말을 적어 주세요." };
  const supabase = createServerSupabaseClient();
  const { data: recent, count } = await supabase
    .from("village_chat")
    .select("created_at", { count: "exact" })
    .eq("student_id", sender.id)
    .gte("created_at", new Date(Date.now() - 60 * 1000).toISOString())
    .order("created_at", { ascending: false })
    .limit(1);
  const last = recent?.[0] ? new Date(recent[0].created_at as string).getTime() : 0;
  if (Date.now() - last < MIN_GAP_MS) return { ok: false as const, message: "조금만 천천히 말해 주세요 🐾" };
  if ((count ?? 0) >= PER_MINUTE) return { ok: false as const, message: "말을 너무 많이 했어요. 1분 뒤에 다시 해 주세요 🐾" };

  const { data, error } = await supabase
    .from("village_chat")
    .insert({ student_id: sender.id, name: sender.name, breed: sender.breed, text })
    .select("id, student_id, name, breed, text, created_at")
    .single();
  if (error || !data) {
    console.error("마을 채팅 저장 실패:", error?.message);
    return { ok: false as const, message: "보내지 못했어요. 다시 해 주세요." };
  }
  return { ok: true as const, message: toMessage(data as Row, sender.id) };
}
