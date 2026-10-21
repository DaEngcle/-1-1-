import { NextResponse, type NextRequest } from "next/server";
import { getVerifiedStudent } from "@/lib/classroom/dal";
import { createServerSupabaseClient } from "@/lib/supabase";
import { scenario } from "@/lib/classroom/interview-scenarios";
import { interviewerReply, type Turn } from "@/lib/classroom/interview-ai";
import { transcribe } from "@/lib/classroom/azure-speech";

export const maxDuration = 60;

/** 학생 한 마디(녹음) → 받아쓰기 → 면접관 대답 */
export async function POST(request: NextRequest) {
  const student = await getVerifiedStudent();
  if (!student) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  const form = await request.formData();
  const sessionId = String(form.get("sessionId") ?? "");
  const audio = form.get("audio");
  if (!/^[0-9a-f-]{36}$/.test(sessionId) || !(audio instanceof Blob) || audio.size > 5_000_000) {
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

  let heard = "";
  try {
    heard = await transcribe(new Uint8Array(await audio.arrayBuffer()));
  } catch (e) {
    console.error("면접 받아쓰기 실패:", e);
    return NextResponse.json({ error: "목소리를 알아듣지 못했어요. 다시 말해 주세요." }, { status: 502 });
  }
  if (!heard) return NextResponse.json({ heard: "", retry: true });

  const turns = [...((session.transcript as Turn[]) ?? []), { role: "me" as const, text: heard }];
  try {
    const next = await interviewerReply(s, turns);
    turns.push({ role: "ai", text: next.reply });
    await supabase.from("interview_sessions").update({ transcript: turns }).eq("id", sessionId);
    return NextResponse.json({ heard, reply: next.reply, done: next.done, mood: next.mood });
  } catch (e) {
    console.error("면접관 대답 실패:", e);
    return NextResponse.json({ error: "면접관이 잠깐 생각 중이에요… 다시 말해 주세요." }, { status: 502 });
  }
}
