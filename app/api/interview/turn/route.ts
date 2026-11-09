import { NextResponse, type NextRequest } from "next/server";
import { getVerifiedStudent } from "@/lib/classroom/dal";
import { createServerSupabaseClient } from "@/lib/supabase";
import { scenario } from "@/lib/classroom/interview-scenarios";
import { interviewerReply, type Turn } from "@/lib/classroom/interview-ai";
import { transcribe } from "@/lib/classroom/azure-speech";

export const maxDuration = 60;
/** 면접 한 번에 '다시 시도'(마지막 답 바꾸기) 횟수 */
const MAX_RETRIES = 3;

/**
 * 학생 한 마디 → 면접관 대답.
 * 녹음(audio)이면 받아쓰기, 글(text)이면 그대로 쓴다 (받아쓰기 비용도 안 든다).
 * retry=1이면 마지막 답과 그 대답을 지우고 같은 질문에 다시 답한다 (면접 한 번에 3번까지).
 */
export async function POST(request: NextRequest) {
  const student = await getVerifiedStudent();
  if (!student) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  const form = await request.formData();
  const sessionId = String(form.get("sessionId") ?? "");
  const audio = form.get("audio");
  const typed = typeof form.get("text") === "string" ? String(form.get("text")).replace(/\s+/g, " ").trim().slice(0, 300) : "";
  const retry = form.get("retry") === "1";
  const hasAudio = audio instanceof Blob && audio.size > 0;
  if (!/^[0-9a-f-]{36}$/.test(sessionId) || (!hasAudio && !typed) || (hasAudio && (audio as Blob).size > 5_000_000)) {
    return NextResponse.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }
  const supabase = createServerSupabaseClient();
  const { data: session } = await supabase
    .from("interview_sessions")
    .select("id, scenario, transcript, finished_at")
    .eq("id", sessionId)
    .eq("student_id", student.id)
    .maybeSingle();
  const s = session && scenario(session.scenario as string);
  if (!session || !s || session.finished_at) return NextResponse.json({ error: "끝난 대화예요." }, { status: 400 });

  let base = [...((session.transcript as Turn[]) ?? [])];
  // 다시 시도 횟수는 따로 읽는다 (칸이 아직 없는 DB에서도 보통 대화는 되게)
  let used = 0;
  if (retry) {
    const n = base.length;
    const { data: r, error: rErr } = await supabase.from("interview_sessions").select("retries").eq("id", sessionId).maybeSingle();
    if (rErr) return NextResponse.json({ error: "지금은 다시 시도를 할 수 없어요." }, { status: 503 });
    used = (r?.retries as number | null) ?? 0;
    if (used >= MAX_RETRIES) return NextResponse.json({ error: `다시 시도는 면접 한 번에 ${MAX_RETRIES}번까지예요.` }, { status: 429 });
    if (n < 3 || base[n - 1].role !== "ai" || base[n - 2].role !== "me") return NextResponse.json({ error: "다시 할 답이 없어요." }, { status: 400 });
    // 같은 값일 때만 올라가서 동시에 보내도 한도를 못 넘는다
    const { data: claimed } = await supabase
      .from("interview_sessions")
      .update({ retries: used + 1 })
      .eq("id", sessionId)
      .eq("retries", used)
      .select("id");
    if (!claimed?.length) return NextResponse.json({ error: "잠깐 뒤에 다시 해 주세요." }, { status: 429 });
    base = base.slice(0, n - 2);
  }

  let heard = typed;
  if (!heard) {
    try {
      heard = await transcribe(new Uint8Array(await (audio as Blob).arrayBuffer()));
    } catch (e) {
      console.error("면접 받아쓰기 실패:", e);
      return NextResponse.json({ error: "목소리를 알아듣지 못했어요. 다시 말해 주세요." }, { status: 502 });
    }
  }
  if (!heard) return NextResponse.json({ heard: "", retry: true });

  const turns = [...base, { role: "me" as const, text: heard }];
  try {
    const next = await interviewerReply(s, turns, sessionId);
    turns.push({ role: "ai", text: next.reply });
    await supabase.from("interview_sessions").update({ transcript: turns }).eq("id", sessionId);
    return NextResponse.json({ heard, ...next, ...(retry ? { retriesLeft: MAX_RETRIES - used - 1 } : {}) });
  } catch (e) {
    console.error("면접관 대답 실패:", e);
    return NextResponse.json({ error: "면접관이 잠깐 생각 중이에요… 다시 말해 주세요." }, { status: 502 });
  }
}
