import { NextResponse, after, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getVerifiedStudent } from "@/lib/classroom/dal";
import { assessFreeSpeech, isAzureConfigured } from "@/lib/classroom/azure-speech";
import {
  BLANKS,
  DIALOGUES,
  DICTATION,
  RESPONSES,
  SPEAKING,
  audioFor,
  blankScore,
  choiceScore,
  dictationScore,
  speakingDetail,
} from "@/lib/classroom/level-test";
import { canTakeTest, finishTest, getOrCreateTest, regradeTest, type TestKind } from "@/lib/classroom/level-test-data";
import { gradeSpeakingLanguage } from "@/lib/classroom/level-test-ai";
import { getSpeechAudio, mp3Response } from "@/lib/classroom/speech-cache";

export const maxDuration = 60;

const MAX_AUDIO_BYTES = 2 * 1024 * 1024;
const MAX_TEXT = 300;

/** 문제 음성: GET /api/level-test?audio=d1 | l2:0 | s1 (대본은 서버에만 있음) */
export async function GET(request: NextRequest) {
  if (!(await getVerifiedStudent())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const item = audioFor(request.nextUrl.searchParams.get("audio") ?? "");
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  try {
    return mp3Response(await getSpeechAudio(item.text, "normal", item.voice));
  } catch (e) {
    console.error("레벨테스트 음성 실패:", e);
    return NextResponse.json({ error: "tts_failed" }, { status: 502 });
  }
}

/**
 * 레벨테스트 진행 (multipart)
 * - action=speaking: kind, questionId, audio(wav) → 자유 발화 평가 후 저장
 * - action=finish: kind, answers(JSON) → 듣기·문법 채점 후 결과 확정
 *   answers = { dictation: {d1: "..."}, dialogues: {l1: 0}, responses: {g1: 1}, blanks: {b1: "have"} }
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
    const question = SPEAKING.find((q) => q.id === form.get("questionId"));
    const audio = form.get("audio");
    const skip = form.get("skip") === "true";
    if (!question || (!skip && (!(audio instanceof Blob) || audio.size === 0 || audio.size > MAX_AUDIO_BYTES))) {
      return NextResponse.json({ error: "녹음을 다시 해주세요." }, { status: 400 });
    }

    let result = null;
    let audioPath: string | null = null;
    if (!skip && audio instanceof Blob) {
      const bytes = new Uint8Array(await audio.arrayBuffer());
      try {
        result = await assessFreeSpeech(bytes);
      } catch (e) {
        console.error("레벨테스트 말하기 평가 실패:", e);
        return NextResponse.json(
          { error: "음성을 잘 인식하지 못했어요. 조용한 곳에서 조금 더 크게 다시 녹음해주세요." },
          { status: 422 },
        );
      }
      if (!result) {
        return NextResponse.json(
          { error: "말소리가 들리지 않았어요. 마이크 가까이에서 다시 녹음해주세요." },
          { status: 422 },
        );
      }
      audioPath = `level-tests/${student.id}/${kind}/${question.id}.wav`;
      await supabase.storage.from("shadowing").upload(audioPath, bytes, { contentType: "audio/wav", upsert: true });
    }
    const ai = result ? await gradeSpeakingLanguage(question.question, result.transcript) : null;
    const { score, detail } = speakingDetail(question.id, result, ai);
    await supabase
      .from("level_test_answers")
      .upsert({ test_id: testId, question_id: question.id, score, audio_path: audioPath, detail });
    return NextResponse.json({ questionId: question.id, done: true });
  }

  if (form.get("action") === "finish") {
    let answers: Record<string, Record<string, unknown>> = {};
    try {
      answers = JSON.parse(String(form.get("answers") ?? "{}"));
    } catch {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }
    const text = (v: unknown) => (typeof v === "string" ? v.slice(0, MAX_TEXT) : "");
    const rows = [
      ...DICTATION.map((q) => {
        const typed = text(answers.dictation?.[q.id]);
        return { test_id: testId, question_id: q.id, score: dictationScore(q.id, typed) ?? 0, text_answer: typed };
      }),
      ...[...DIALOGUES, ...RESPONSES].map((q) => {
        const raw = (q.id.startsWith("l") ? answers.dialogues : answers.responses)?.[q.id];
        const choice = Number.isInteger(raw) ? (raw as number) : null;
        return { test_id: testId, question_id: q.id, score: choice == null ? 0 : (choiceScore(q.id, choice) ?? 0), choice };
      }),
      ...BLANKS.map((q) => {
        const typed = text(answers.blanks?.[q.id]);
        return { test_id: testId, question_id: q.id, score: blankScore(q.id, typed) ?? 0, text_answer: typed };
      }),
    ];
    const { error } = await supabase.from("level_test_answers").upsert(rows);
    if (error) {
      console.error("레벨테스트 답 저장 실패:", error.message);
      return NextResponse.json({ error: "제출 중 오류가 발생했어요." }, { status: 500 });
    }
    const finished = await finishTest(testId);
    if (kind === "post") {
      // 수강 전 결과가 예전 기준이면 같은 기준으로 다시 채점해서 전·후를 공정하게 비교한다
      const { data: pre } = await supabase.from("level_tests").select("id").eq("student_id", student.id).eq("kind", "pre").maybeSingle();
      if (pre) after(() => regradeTest(pre.id as string).then(() => undefined));
    }
    return NextResponse.json(finished);
  }

  return NextResponse.json({ error: "bad_request" }, { status: 400 });
}
