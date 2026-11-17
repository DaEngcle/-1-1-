"use server";

import { getVerifiedStudent } from "@/lib/classroom/dal";
import { maskName } from "@/lib/classroom/engagement";
import { sendVillageChat } from "@/lib/classroom/village-chat";
import { createServerSupabaseClient } from "@/lib/supabase";

/** 마을 채팅 보내기. 이름은 닉네임 또는 가린 이름만 저장한다 (실명 노출 금지) */
export async function sendVillageChatAction(text: string) {
  const student = await getVerifiedStudent();
  if (!student) return { ok: false as const, message: "로그인이 필요해요." };
  return sendVillageChat(
    { id: student.id, name: student.nickname ?? maskName(student.name), breed: student.catBreed },
    text,
  );
}

/**
 * 마을 말하기를 해 봤다고 기록한다 (코스의 "고양이 마을에서 말 걸어 보기" 완료 기준).
 * 하루 한 줄, 횟수만 늘린다.
 */
export async function recordVillageSpeakAction() {
  const student = await getVerifiedStudent();
  if (!student) return { ok: false as const };
  const supabase = createServerSupabaseClient();
  const day = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
  const { data: row } = await supabase
    .from("village_speak_usage")
    .select("count")
    .eq("student_id", student.id)
    .eq("day", day)
    .maybeSingle();
  const { error } = await supabase
    .from("village_speak_usage")
    .upsert({ student_id: student.id, day, count: ((row?.count as number | undefined) ?? 0) + 1 }, { onConflict: "student_id,day" });
  return { ok: !error };
}
