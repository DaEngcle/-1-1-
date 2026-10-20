import { canOpenLesson } from "@/lib/classroom/preview";
import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getVerifiedStudent } from "@/lib/classroom/dal";
import {
  assessPronunciation,
  isAzureConfigured,
} from "@/lib/classroom/azure-speech";
import { generateCoachFeedback } from "@/lib/classroom/coach-feedback";

export const maxDuration = 60;

// 16kHz 모노 16bit WAV 기준 약 60초
const MAX_AUDIO_BYTES = 2 * 1024 * 1024;

/**
 * 쉐도잉 제출: multipart { lessonItemId, audio(wav) }
 * 녹음 저장 → 제출 기록 → (Azure 설정 시) 발음 평가 → Claude 코칭 피드백
 */
export async function POST(request: NextRequest) {
  const student = await getVerifiedStudent();
  if (!student) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const form = await request.formData();
  const lessonItemId = String(form.get("lessonItemId") ?? "");
  const audio = form.get("audio");
  if (!lessonItemId || !(audio instanceof Blob) || audio.size === 0) {
    return NextResponse.json({ error: "녹음 파일이 없어요." }, { status: 400 });
  }
  if (audio.size > MAX_AUDIO_BYTES) {
    return NextResponse.json(
      { error: "녹음이 너무 길어요. 1분 이내로 녹음해주세요." },
      { status: 400 },
    );
  }

  const supabase = createServerSupabaseClient();

  const { data: item } = await supabase
    .from("lesson_items")
    .select("id, sentence, lessons!inner(is_published, course_id, kind, day_number, courses!inner(status))")
    .eq("id", lessonItemId)
    .eq("lessons.is_published", true)
    .maybeSingle();
  const itemLesson = item?.lessons as unknown as
    | { course_id: string; kind: string; day_number: number | null; courses: { status: string } }
    | undefined;
  if (!item || !itemLesson || !canOpenLesson(student.courses, itemLesson, itemLesson.courses?.status, student.earlyCourses)) {
    return NextResponse.json({ error: "문장을 찾을 수 없어요." }, { status: 404 });
  }

  const bytes = new Uint8Array(await audio.arrayBuffer());
  const audioPath = `${student.id}/${lessonItemId}/${Date.now()}.wav`;
  const upload = await supabase.storage
    .from("shadowing")
    .upload(audioPath, bytes, { contentType: "audio/wav" });
  if (upload.error) {
    console.error("녹음 업로드 실패:", upload.error.message);
    return NextResponse.json({ error: "업로드에 실패했어요." }, { status: 500 });
  }

  const { data: submission, error: insertError } = await supabase
    .from("submissions")
    .insert({ student_id: student.id, lesson_item_id: lessonItemId, audio_path: audioPath })
    .select("id")
    .single();
  if (insertError || !submission) {
    console.error("제출 기록 실패:", insertError?.message);
    return NextResponse.json({ error: "제출에 실패했어요." }, { status: 500 });
  }

  if (!isAzureConfigured()) {
    return NextResponse.json({ id: submission.id, status: "pending" });
  }

  try {
    const result = await assessPronunciation(bytes, item.sentence);
    const feedback = await generateCoachFeedback(item.sentence, result);
    const update = {
      status: "scored" as const,
      overall_score: result.overall,
      accuracy_score: result.accuracy,
      fluency_score: result.fluency,
      completeness_score: result.completeness,
      prosody_score: result.prosody,
      word_details: result.words,
      feedback_text: feedback,
      scored_at: new Date().toISOString(),
    };
    await supabase.from("submissions").update(update).eq("id", submission.id);
    return NextResponse.json({ id: submission.id, ...update });
  } catch (error) {
    console.error("발음 평가 실패:", error);
    await supabase
      .from("submissions")
      .update({ status: "failed" })
      .eq("id", submission.id);
    return NextResponse.json({
      id: submission.id,
      status: "failed",
      error: "음성을 잘 인식하지 못했어요. 조용한 곳에서 문장 전체를 또박또박 다시 녹음해보세요.",
    });
  }
}
