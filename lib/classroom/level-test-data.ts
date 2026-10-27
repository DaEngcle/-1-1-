import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";
import { levelForScore } from "./levels";
import { DICTATION, SCORING_VERSION, SPEAKING, dictationScore, speakingDetail, summarize, type Skills, type SpeakingDetail } from "./level-test";
import { gradeSpeakingLanguage } from "./level-test-ai";

export type TestKind = "pre" | "post";

export interface LevelTestRow {
  id: string;
  student_id: string;
  kind: TestKind;
  speaking_score: number | null;
  listening_score: number | null;
  grammar_score: number | null;
  skills: Skills | null;
  version: number;
  total_score: number | null;
  level: number | null;
  started_at: string;
  finished_at: string | null;
}

const POST_TEST_KEY = "post_test_open";

export async function isPostTestOpen() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("classroom_settings").select("value").eq("key", POST_TEST_KEY).maybeSingle();
  return data?.value === true;
}

export async function setPostTestOpen(open: boolean) {
  const supabase = createServerSupabaseClient();
  await supabase
    .from("classroom_settings")
    .upsert({ key: POST_TEST_KEY, value: open, updated_at: new Date().toISOString() });
}

export async function getTests(studentId: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("level_tests").select("*").eq("student_id", studentId);
  const rows = (data ?? []) as LevelTestRow[];
  return { pre: rows.find((r) => r.kind === "pre") ?? null, post: rows.find((r) => r.kind === "post") ?? null };
}

/** 지금 이 학생이 이 시험을 볼 수 있는지. 볼 수 없으면 이유를 돌려준다 */
export async function canTakeTest(studentId: string, kind: TestKind) {
  const { pre, post } = await getTests(studentId);
  if (kind === "pre") {
    return pre?.finished_at ? { ok: false as const, reason: "이미 수강 전 테스트를 봤어요." } : { ok: true as const };
  }
  if (!pre?.finished_at) return { ok: false as const, reason: "수강 전 테스트를 먼저 봐야 해요." };
  if (post?.finished_at) return { ok: false as const, reason: "이미 수강 후 테스트를 봤어요." };
  if (!(await isPostTestOpen())) return { ok: false as const, reason: "선생님이 아직 수강 후 테스트를 열지 않았어요." };
  return { ok: true as const };
}

/** 진행 중인 시험 행을 가져오거나 새로 만든다 */
export async function getOrCreateTest(studentId: string, kind: TestKind) {
  const supabase = createServerSupabaseClient();
  const { data: existing } = await supabase
    .from("level_tests")
    .select("id")
    .eq("student_id", studentId)
    .eq("kind", kind)
    .maybeSingle();
  if (existing) return existing.id as string;
  const { data, error } = await supabase
    .from("level_tests")
    .insert({ student_id: studentId, kind })
    .select("id")
    .single();
  if (error?.code === "23505") return getOrCreateTest(studentId, kind); // 동시에 두 번 시작한 경우
  if (error || !data) throw new Error(error?.message ?? "레벨테스트 생성 실패");
  return data.id as string;
}

export interface AnswerRow {
  question_id: string;
  score: number;
  audio_path: string | null;
  choice: number | null;
  text_answer: string | null;
  detail: unknown;
}

export async function getAnswers(testId: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("level_test_answers")
    .select("question_id, score, audio_path, choice, text_answer, detail")
    .eq("test_id", testId);
  return (data ?? []) as AnswerRow[];
}

/** 답을 모아 점수·레벨을 확정한다 */
export async function finishTest(testId: string) {
  const supabase = createServerSupabaseClient();
  const { listening, grammar, speaking, total, skills } = summarize(await getAnswers(testId));
  const level = levelForScore(total).level;
  await supabase
    .from("level_tests")
    .update({
      speaking_score: speaking,
      listening_score: listening,
      grammar_score: grammar,
      total_score: total,
      skills,
      level,
      scoring_version: SCORING_VERSION,
      finished_at: new Date().toISOString(),
    })
    .eq("id", testId);
  return { listening, grammar, speaking, total, skills, level };
}

/**
 * 예전 기준으로 채점된 결과를 지금 기준으로 다시 채점한다 (수강 전·후 비교를 같은 기준으로).
 * 저장된 받아쓰기 답과 말하기 기록(문장·발음 점수)으로 다시 계산하고, 끝난 날짜는 그대로 둔다.
 */
/** 다시 채점하는 동안 잠깐 넣어 두는 표시 (지금 기준보다 커서 다른 재채점이 건드리지 않는다) */
const REGRADING = 900;

export async function regradeTest(testId: string) {
  const supabase = createServerSupabaseClient();
  const { data: test } = await supabase
    .from("level_tests")
    .select("finished_at, scoring_version")
    .eq("id", testId)
    .maybeSingle();
  const before = (test?.scoring_version as number | undefined) ?? 2;
  if (!test?.finished_at || before >= SCORING_VERSION) return false;
  // 동시에 두 번 돌지 않게 먼저 '채점 중'(REGRADING)으로 잡는다. 이미 누가 잡았으면 그만
  const { data: claimed } = await supabase
    .from("level_tests")
    .update({ scoring_version: REGRADING })
    .eq("id", testId)
    .eq("scoring_version", before)
    .select("id");
  if (!claimed?.length) return false;
  const release = () => supabase.from("level_tests").update({ scoring_version: before }).eq("id", testId);
  const answers = await getAnswers(testId);
  const updates: { test_id: string; question_id: string; score: number; detail?: unknown }[] = [];
  for (const a of answers) {
    if (DICTATION.some((q) => q.id === a.question_id)) {
      updates.push({ test_id: testId, question_id: a.question_id, score: dictationScore(a.question_id, a.text_answer ?? "") ?? 0 });
    }
  }
  // 말하기 4문항은 AI 채점을 한꺼번에
  const speakingUpdates = await Promise.all(
    answers.map(async (a) => {
      const q = SPEAKING.find((x) => x.id === a.question_id);
      const d = a.detail as SpeakingDetail | null;
      if (!q || !d) return null;
      const result = d.transcript
        ? { transcript: d.transcript, overall: d.pron, accuracy: d.accuracy, fluency: d.fluency, prosody: d.prosody }
        : null;
      const ai = result ? await gradeSpeakingLanguage(q.question, result.transcript) : null;
      const { score, detail } = speakingDetail(q.id, result, ai);
      return { test_id: testId, question_id: q.id, score, detail };
    }),
  );
  for (const u of speakingUpdates) if (u) updates.push(u);
  for (const u of updates) {
    const { test_id, question_id, ...rest } = u;
    const { error } = await supabase.from("level_test_answers").update(rest).eq("test_id", test_id).eq("question_id", question_id);
    if (error) {
      console.error("레벨테스트 다시 채점 실패:", error.message);
      await release();
      return false;
    }
  }
  // 중간에 실패해도 다시 돌리면 저장된 원본(받아쓰기 답·말하기 문장·발음 점수)에서 똑같이 다시 계산된다
  const { listening, grammar, speaking, total, skills } = summarize(await getAnswers(testId));
  const { error: finalError } = await supabase
    .from("level_tests")
    .update({
      speaking_score: speaking,
      listening_score: listening,
      grammar_score: grammar,
      total_score: total,
      skills,
      level: levelForScore(total).level,
      scoring_version: SCORING_VERSION,
    })
    .eq("id", testId)
    .eq("scoring_version", REGRADING);
  if (finalError) {
    console.error("레벨테스트 다시 채점 저장 실패:", finalError.message);
    await release();
    return false;
  }
  return true;
}
