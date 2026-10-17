import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";
import { levelForScore } from "./levels";
import { summarize, type Skills } from "./level-test";

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
      finished_at: new Date().toISOString(),
    })
    .eq("id", testId);
  return { listening, grammar, speaking, total, skills, level };
}
