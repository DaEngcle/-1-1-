import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getVerifiedStudent } from "@/lib/classroom/dal";
import { assessPronunciation, isAzureConfigured } from "@/lib/classroom/azure-speech";
import { SPEAKING_QUESTIONS, listeningScore } from "@/lib/classroom/level-test";
import { canTakeTest, finishTest, getOrCreateTest, type TestKind } from "@/lib/classroom/level-test-data";

export const maxDuration = 60;

const MAX_AUDIO_BYTES = 2 * 1024 * 1024;

/**
 * 레벨테스트 진행 (multipart)
 * - action=speaking: kind, questionId, audio(wav) → 발음 평가 점수 저장
 * - action=finish: kind, listening(JSON {questionId: 고른 보기}) → 듣기 채점 후 결과 확정
 */
export async function POST(request: NextRequest) {
  const student = await getVerifiedStudent();
  if (!student) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });

  const form = await request.formData();
  const kind = String(form.get("kind")) as TestKind;
  if (kind !== "pre" && kind !== "post") return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const allowed = await canTakeTest(student.id, kind);
  if (!allowed.ok) return NextResponse.json({ error: allowed.reason }, { status: 403 });

  const supabase = createServerSupabaseClient();
  const testId = await getOrCreateTest(student.id, kind);

  if (form.get("action") === "speaking") {
    if (!isAzureConfigured()) {
      return NextResponse.json({ error: "아직 말하기 채점이 준비되지 않았어요. 선생님께 알려주세요." }, { status: 503 });
    }
    const question = SPEAKING_QUESTIONS.find((q) => q.id === form.get("questionId"));
    const audio = form.get("audio");
    if (!question || !(audio instanceof Blob) || audio.size === 0 || audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json({ error: "녹음을 다시 해주세요." }, { status: 400 });
    }
    const bytes = new Uint8Array(await audio.arrayBuffer());
    let score: number;
    try {
      score = Math.round((await assessPronunciation(bytes, question.sentence)).overall);
    } catch (e) {
      console.error("레벨테스트 발음 평가 실패:", e);
      return NextResponse.json(
        { error: "음성을 잘 인식하지 못했어요. 조용한 곳에서 문장 전체를 다시 녹음해주세요." },
        { status: 422 },
      );
    }
    const audioPath = `level-tests/${student.id}/${kind}/${question.id}.wav`;
    await supabase.storage.from("shadowing").upload(audioPath, bytes, { contentType: "audio/wav", upsert: true });
    await supabase
      .from("level_test_answers")
      .upsert({ test_id: testId, question_id: question.id, score, audio_path: audioPath });
    return NextResponse.json({ questionId: question.id, score });
  }

  if (form.get("action") === "finish") {
    let choices: Record<string, unknown> = {};
    try {
      choices = JSON.parse(String(form.get("listening") ?? "{}"));
    } catch {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }
    const rows = Object.entries(choices).flatMap(([questionId, choice]) => {
      const score = Number.isInteger(choice) ? listeningScore(questionId, choice as number) : null;
      return score == null ? [] : [{ test_id: testId, question_id: questionId, score, choice: choice as number }];
    });
    if (rows.length > 0) await supabase.from("level_test_answers").upsert(rows);
    return NextResponse.json(await finishTest(testId));
  }

  return NextResponse.json({ error: "bad_request" }, { status: 400 });
}
