import "server-only";
// 내 워홀 코스: DB 읽기·쓰기 (student_course, student_phrase) + 이미 있는 기록으로 완료 계산
import { createServerSupabaseClient } from "@/lib/supabase";
import { fetchAll } from "./progress";
import { addVocaPlay } from "./engagement";
import { kstDate } from "./stats";
import { FREE_VERB_SETS, hasFullVoca } from "./verbs";
import { OPEN_GRAMMAR_UNITS, grammarLock } from "./grammar";
import { parseCourseAnswers, type CourseAnswers } from "./course-questions";
import { buildCourse, doneSteps, pickToday, type CourseAccess, type CourseStep } from "./course";
import { courseTopic, topicPhrases, type ChosenTopic, type TopicPhrase } from "./course-topics";
import type { ChatTurn } from "./course-ai";

type AccessStudent = { plan: string | null; courses: readonly string[]; earlyCourses: readonly string[] };

export function courseAccess(student: AccessStudent): CourseAccess {
  let max = 0;
  while (max < OPEN_GRAMMAR_UNITS && grammarLock(student, max + 1) === null) max++;
  return { fullVoca: hasFullVoca(student), freePhraseSets: FREE_VERB_SETS, maxGrammarUnit: max };
}

export type CourseRow = {
  answers: CourseAnswers | null;
  topics: ChosenTopic[];
  ai: { turns?: ChatTurn[]; summary?: string; source?: "ai" | "rule" } | null;
  today: { day: string; ids: string[] } | null;
  bonusDay: string | null;
  createdAt: string;
  aiDay: string | null;
  aiCount: number;
  aiCalls: number;
};

export function parseTopics(raw: unknown): ChosenTopic[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  return raw.flatMap((t) => {
    const r = t as Partial<ChosenTopic> | null;
    if (!r || typeof r.id !== "string" || seen.has(r.id) || !courseTopic(r.id)) return [];
    seen.add(r.id);
    const def = courseTopic(r.id)!;
    return [{ id: r.id, title: typeof r.title === "string" ? r.title.slice(0, 30) : def.title, desc: typeof r.desc === "string" ? r.desc.slice(0, 60) : def.desc }];
  });
}

export async function getCourseRow(studentId: string): Promise<CourseRow | null> {
  const { data } = await createServerSupabaseClient()
    .from("student_course")
    .select("answers, topics, ai, today, bonus_day, created_at, ai_day, ai_count, ai_calls")
    .eq("student_id", studentId)
    .maybeSingle();
  if (!data) return null;
  const today = data.today as CourseRow["today"];
  return {
    answers: parseCourseAnswers(data.answers),
    topics: parseTopics(data.topics),
    ai: (data.ai as CourseRow["ai"]) ?? null,
    today: today && typeof today.day === "string" && Array.isArray(today.ids) ? today : null,
    bonusDay: (data.bonus_day as string | null) ?? null,
    createdAt: data.created_at as string,
    aiDay: (data.ai_day as string | null) ?? null,
    aiCount: (data.ai_count as number) ?? 0,
    aiCalls: (data.ai_calls as number) ?? 0,
  };
}

/** 홈용: 코스를 다 만들었는지, 앱 사용법 안내를 봤는지 */
export async function getHomeCourseState(studentId: string) {
  const { data } = await createServerSupabaseClient()
    .from("student_course")
    .select("answers, guide_seen_at")
    .eq("student_id", studentId)
    .maybeSingle();
  return { hasCourse: data?.answers != null, guideSeen: data?.guide_seen_at != null };
}

export async function markGuideSeen(studentId: string) {
  const { error } = await createServerSupabaseClient()
    .from("student_course")
    .upsert({ student_id: studentId, guide_seen_at: new Date().toISOString() });
  if (error) console.error("사용법 안내 저장 실패:", error.message);
}

type PhraseRow = { phrase_key: string; box: number; due_at: string; last_result: "right" | "wrong"; created_at: string; updated_at: string };

async function phraseRows(studentId: string) {
  const supabase = createServerSupabaseClient();
  return fetchAll<PhraseRow>((from, to) =>
    supabase
      .from("student_phrase")
      .select("phrase_key, box, due_at, last_result, created_at, updated_at")
      .eq("student_id", studentId)
      .range(from, to),
  );
}

/** 하루 새 표현 개수 (5분 3개 · 10분 5개 · 20분 10개) */
export const NEW_PER_DAY: Record<number, number> = { 5: 3, 10: 5, 20: 10 };
const MAX_REVIEW = 20;

export type PracticeItem = TopicPhrase & { kind: "new" | "review" | "wrong"; topic: string };
export type PracticeQueue = { items: PracticeItem[]; counts: { new: number; review: number; wrong: number } };

/** 오늘의 연습: 오늘 틀린 것 + 복습할 때가 된 것 + 새 표현 (고른 토픽 순서) */
/** 무료회원 하루 새 표현 개수 */
export const FREE_NEW_PER_DAY = 3;

export function practiceQueue(topics: ChosenTopic[], minutes: number, access: CourseAccess, rows: PhraseRow[], now = new Date()): PracticeQueue {
  const today = kstDate(now);
  const all = topics.flatMap((t) => {
    const def = courseTopic(t.id);
    return def ? topicPhrases(def, access).map((p) => ({ ...p, topic: t.title })) : [];
  });
  const byKey = new Map(all.map((p) => [p.key, p]));
  const seen = new Map(rows.map((r) => [r.phrase_key, r]));
  const wrong: PracticeItem[] = [];
  const review: PracticeItem[] = [];
  for (const r of rows) {
    const p = byKey.get(r.phrase_key);
    if (!p) continue;
    if (r.last_result === "wrong" && kstDate(r.updated_at) === today) wrong.push({ ...p, kind: "wrong" });
    else if (new Date(r.due_at) <= now && review.length < MAX_REVIEW) review.push({ ...p, kind: "review" });
  }
  const introducedToday = rows.filter((r) => kstDate(r.created_at) === today).length;
  // 무료회원은 하루 새 표현 FREE_NEW_PER_DAY개까지 (복습·틀린 것은 그대로)
  const perDay = access.fullVoca ? (NEW_PER_DAY[minutes] ?? 5) : Math.min(FREE_NEW_PER_DAY, NEW_PER_DAY[minutes] ?? 5);
  const newLeft = Math.max(0, perDay - introducedToday);
  const fresh: PracticeItem[] = all.filter((p) => !seen.has(p.key)).slice(0, newLeft).map((p) => ({ ...p, kind: "new" }));
  return { items: [...wrong, ...review, ...fresh], counts: { new: fresh.length, review: review.length, wrong: wrong.length } };
}

/** 토픽별 진도: 한 번이라도 맞힌 표현 / 전체 */
export function topicProgress(topics: ChosenTopic[], access: CourseAccess, rows: PhraseRow[]) {
  const right = new Set(rows.filter((r) => r.box > 0).map((r) => r.phrase_key));
  return topics.map((t) => {
    const def = courseTopic(t.id)!;
    const ps = topicPhrases(def, access);
    return { ...t, emoji: def.emoji, total: ps.length, done: ps.filter((p) => right.has(p.key)).length };
  });
}

export async function getPracticeQueue(studentId: string, course: CourseRow, access: CourseAccess) {
  return practiceQueue(course.topics, course.answers?.minutes ?? 10, access, await phraseRows(studentId));
}

/** 코스 화면에 필요한 것 전부. 오늘 할 것은 하루 동안 고정해서 저장한다 */
export async function getCourseView(studentId: string, course: CourseRow & { answers: CourseAnswers }, access: CourseAccess) {
  const supabase = createServerSupabaseClient();
  const [stars, interviews, { count: shadowSince }, { count: villageDays }, rows] = await Promise.all([
    fetchAll<{ deck: string; stars: number }>((from, to) =>
      supabase.from("voca_progress").select("deck, stars").eq("student_id", studentId).range(from, to),
    ),
    fetchAll<{ scenario: string }>((from, to) =>
      supabase.from("interview_sessions").select("scenario").eq("student_id", studentId).not("feedback", "is", null).range(from, to),
    ),
    supabase.from("submissions").select("id", { count: "exact", head: true }).eq("student_id", studentId).gte("created_at", course.createdAt),
    supabase.from("village_speak_usage").select("day", { count: "exact", head: true }).eq("student_id", studentId),
    phraseRows(studentId),
  ]);
  const steps: CourseStep[] = buildCourse(course.answers, course.topics, access);
  const done = doneSteps(steps, {
    stars: new Map(stars.map((r) => [r.deck, r.stars ?? 0])),
    interviews: new Set(interviews.map((r) => r.scenario)),
    shadowSince: shadowSince ?? 0,
    villageSpoke: (villageDays ?? 0) > 0,
    drilled: new Set(rows.filter((r) => r.box > 0).map((r) => r.phrase_key)),
  });

  const day = kstDate(new Date());
  const ids = new Set(steps.map((s) => s.id));
  let todayIds = course.today?.day === day ? course.today.ids.filter((id) => ids.has(id)) : [];
  if (todayIds.length === 0) {
    todayIds = pickToday(steps, done, course.answers.minutes);
    if (todayIds.length) await supabase.from("student_course").update({ today: { day, ids: todayIds } }).eq("student_id", studentId);
  }
  const todayDone = todayIds.length > 0 && todayIds.every((id) => done.has(id));

  // 오늘 할 것을 다 하면 하루 한 번 츄르 5개 (보카 포인트 10P = 츄르 5개, 기존 계산 그대로)
  let bonusNow = false;
  if (todayDone && course.bonusDay !== day) {
    const { data } = await supabase
      .from("student_course")
      .update({ bonus_day: day })
      .eq("student_id", studentId)
      .or(`bonus_day.is.null,bonus_day.lt.${day}`)
      .select("student_id");
    if (data && data.length > 0) {
      await addVocaPlay(studentId, COURSE_BONUS_POINTS);
      bonusNow = true;
    }
  }

  return {
    steps,
    done,
    todayIds,
    todayDone,
    bonusGot: todayDone && (bonusNow || course.bonusDay === day),
    practice: practiceQueue(course.topics, course.answers.minutes, access, rows),
    topics: topicProgress(course.topics, access, rows),
  };
}

export const COURSE_BONUS_POINTS = 10;

/** 맞힘/틀림 → 다음 복습일. 맞히면 1·3·7·14일, 틀리면 다음 날 */
const INTERVAL_DAYS = [1, 1, 3, 7, 14];

export async function recordPhraseResult(studentId: string, key: string, correct: boolean) {
  const supabase = createServerSupabaseClient();
  const { data: cur } = await supabase
    .from("student_phrase")
    .select("box, reps")
    .eq("student_id", studentId)
    .eq("phrase_key", key)
    .maybeSingle();
  const box = correct ? Math.min(4, (cur?.box ?? 0) + 1) : 0;
  const days = correct ? INTERVAL_DAYS[box] : 1;
  const now = new Date();
  await supabase.from("student_phrase").upsert({
    student_id: studentId,
    phrase_key: key,
    box,
    due_at: new Date(now.getTime() + days * 86400000).toISOString(),
    last_result: correct ? "right" : "wrong",
    reps: (cur?.reps ?? 0) + 1,
    updated_at: now.toISOString(),
  });
}
