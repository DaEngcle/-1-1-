import { NextResponse, type NextRequest } from "next/server";
import { getVerifiedStudent } from "@/lib/classroom/dal";
import { createServerSupabaseClient } from "@/lib/supabase";
import { assessPronunciation, isAzureConfigured } from "@/lib/classroom/azure-speech";
import type { InterviewFeedback } from "@/lib/classroom/interview-ai";

export const maxDuration = 30;

/** 리포트의 '더 좋은 답'·'모범 답안'을 따라 말하면 발음 점수를 준다 (그 면접 리포트에 있는 문장만) */
export async function POST(request: NextRequest) {
  const student = await getVerifiedStudent();
  if (!student) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  if (!isAzureConfigured()) return NextResponse.json({ error: "채점 준비 중이에요." }, { status: 503 });
  const form = await request.formData();
  const sessionId = String(form.get("sessionId") ?? "");
  const text = String(form.get("text") ?? "");
  const audio = form.get("audio");
  if (!/^[0-9a-f-]{36}$/.test(sessionId) || !text || !(audio instanceof Blob) || audio.size === 0 || audio.size > 3_000_000) {
    return NextResponse.json({ error: "다시 녹음해 주세요." }, { status: 400 });
  }
  const { data: session } = await createServerSupabaseClient()
    .from("interview_sessions")
    .select("feedback")
    .eq("id", sessionId)
    .eq("student_id", student.id)
    .maybeSingle();
  const fb = session?.feedback as InterviewFeedback | null;
  const allowed = new Set([...(fb?.fixes ?? []).map((f) => f.better), ...(fb?.model_answers ?? []).map((m) => m.answer)]);
  if (!allowed.has(text)) return NextResponse.json({ error: "연습할 문장을 찾지 못했어요." }, { status: 400 });
  try {
    const r = await assessPronunciation(new Uint8Array(await audio.arrayBuffer()), text);
    return NextResponse.json({
      score: Math.round(r.overall),
      completeness: Math.round(r.completeness),
      weak: r.words.filter((w) => w.errorType !== "None" || w.accuracy < 60).map((w) => w.word).slice(0, 6),
    });
  } catch (e) {
    console.error("면접 따라 말하기 채점 실패:", e);
    return NextResponse.json({ error: "잘 안 들렸어요. 조용한 곳에서 다시 해 주세요." }, { status: 422 });
  }
}
