import { NextResponse, type NextRequest } from "next/server";
import { getVerifiedStudent } from "@/lib/classroom/dal";
import { createServerSupabaseClient } from "@/lib/supabase";
import { scenario } from "@/lib/classroom/interview-scenarios";
import { interviewFeedback, type Turn } from "@/lib/classroom/interview-ai";
import { addVocaPlay } from "@/lib/classroom/engagement";

export const maxDuration = 60;

/** 대화 끝: 코칭 리포트 만들기 (학생이 2번 이상 말했을 때만) */
export async function POST(request: NextRequest) {
  const student = await getVerifiedStudent();
  if (!student) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  const { sessionId } = (await request.json().catch(() => ({}))) as { sessionId?: string };
  const supabase = createServerSupabaseClient();
  const { data: session } = await supabase
    .from("interview_sessions")
    .select("id, scenario, transcript, feedback")
    .eq("id", String(sessionId))
    .eq("student_id", student.id)
    .maybeSingle();
  const s = session && scenario(session.scenario as string);
  if (!session || !s) return NextResponse.json({ error: "대화를 찾지 못했어요." }, { status: 404 });
  if (session.feedback) return NextResponse.json({ feedback: session.feedback });

  const turns = (session.transcript as Turn[]) ?? [];
  if (turns.filter((t) => t.role === "me").length < 2) {
    await supabase.from("interview_sessions").update({ finished_at: new Date().toISOString() }).eq("id", session.id);
    return NextResponse.json({ error: "두 번 이상 대답해야 리포트가 나와요." }, { status: 400 });
  }
  try {
    const feedback = await interviewFeedback(s, turns);
    await supabase
      .from("interview_sessions")
      .update({ feedback, finished_at: new Date().toISOString() })
      .eq("id", session.id);
    // 대화 연습도 오늘 공부로 (연속 학습일) + 리그 포인트 20P
    await addVocaPlay(student.id, 20);
    return NextResponse.json({ feedback });
  } catch (e) {
    console.error("면접 리포트 실패:", e);
    return NextResponse.json({ error: "리포트를 만들지 못했어요." }, { status: 502 });
  }
}
