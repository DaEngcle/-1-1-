"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { kstDate } from "@/lib/classroom/stats";
import { maskName, addVocaPlay } from "@/lib/classroom/engagement";
import { parseCourseAnswers } from "@/lib/classroom/course-questions";
import { COURSE_TOPICS, courseTopic, phraseByKey, recommendTopics, requiredTopics, topicPhrases, type ChosenTopic } from "@/lib/classroom/course-topics";
import { FREE_NEW_PER_DAY, courseAccess, getCourseRow, markGuideSeen, parseTopics } from "@/lib/classroom/course-data";
import { phraseSetLocked } from "@/lib/classroom/verbs";
import { recordPhraseResult } from "@/lib/classroom/course-data";
import {
  AI_CALLS_PER_DAY,
  AI_ONBOARDING_PER_DAY,
  MAX_ANSWER_CHARS,
  MAX_CHAT_TURNS,
  aiCourse,
  aiReady,
  catFollowUp,
  type ChatTurn,
} from "@/lib/classroom/course-ai";

/** 화면에서 온 대화를 믿을 수 있는 모양으로 (고양이 3번, 학생 3번, 글자 수 제한) */
function cleanTurns(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return [];
  const out: ChatTurn[] = [];
  for (const t of raw.slice(0, MAX_CHAT_TURNS * 2)) {
    const r = t as Partial<ChatTurn> | null;
    if (!r || (r.role !== "cat" && r.role !== "me") || typeof r.text !== "string") continue;
    const text = r.text.trim().slice(0, r.role === "me" ? MAX_ANSWER_CHARS : 150);
    if (text) out.push({ role: r.role, text });
  }
  return out;
}

/** 오늘 AI를 부를 수 있으면 횟수를 올리고 true. start=true면 '대화 시작' 횟수도 센다.
 *  동시에 여러 번 불러도 한도를 넘지 않게, 읽은 값이 그대로일 때만 올린다 */
async function takeAiQuota(studentId: string, start: boolean) {
  if (!aiReady()) return false;
  const day = kstDate(new Date());
  const supabase = createServerSupabaseClient();
  const { data: raw } = await supabase
    .from("student_course")
    .select("ai_day, ai_count, ai_calls")
    .eq("student_id", studentId)
    .maybeSingle();
  const sameDay = raw?.ai_day === day;
  const count = sameDay ? raw!.ai_count : 0;
  const calls = sameDay ? raw!.ai_calls : 0;
  if (calls >= AI_CALLS_PER_DAY) return false;
  if (start && count >= AI_ONBOARDING_PER_DAY) return false;
  if (!start && count === 0) return false; // 대화를 시작하지 않고 바로 부르는 것은 막는다
  const next = { ai_day: day, ai_count: count + (start ? 1 : 0), ai_calls: calls + 1 };
  if (!raw) {
    const { error } = await supabase.from("student_course").insert({ student_id: studentId, ...next });
    if (error) {
      console.error("코스 AI 횟수 저장 실패:", error.message);
      return false;
    }
    return true;
  }
  const { data: updated, error } = await supabase
    .from("student_course")
    .update(next)
    .eq("student_id", studentId)
    .eq("ai_calls", raw.ai_calls)
    .eq("ai_count", raw.ai_count)
    .select("student_id");
  if (error) {
    console.error("코스 AI 횟수 저장 실패:", error.message);
    return false;
  }
  return (updated ?? []).length === 1;
}

export type ChatStep = { question: string } | { done: true };

/** 고양이 되묻기 시작/이어 가기. AI를 못 쓰면 { done } → 화면은 바로 코스 짜기로 넘어간다 */
export async function courseChat(rawAnswers: unknown, rawTurns: unknown): Promise<ChatStep> {
  const student = await requireStudent();
  const answers = parseCourseAnswers(rawAnswers);
  if (!answers) return { done: true };
  const turns = cleanTurns(rawTurns);
  if (turns.filter((t) => t.role === "cat").length >= MAX_CHAT_TURNS) return { done: true };
  if (!(await takeAiQuota(student.id, turns.length === 0))) return { done: true };
  try {
    const q = await catFollowUp(answers, turns);
    return q ? { question: q } : { done: true };
  } catch (e) {
    console.error("코스 고양이 질문 실패:", e instanceof Error ? e.message : e);
    return { done: true };
  }
}

export type Recommendation = { summary: string; topics: ChosenTopic[]; source: "ai" | "rule"; required: string[] };

/** 빠진 필수 토픽을 뒤에 붙인다 */
function withRequired(topics: ChosenTopic[], required: string[], allowed: string[]): ChosenTopic[] {
  const out = [...topics];
  for (const id of required) {
    const t = courseTopic(id);
    if (t && allowed.includes(id) && !out.some((x) => x.id === id)) out.push({ id, title: t.title, desc: t.desc });
  }
  return out;
}

/** 토픽 추천: AI(대화를 했을 때) → 실패하면 규칙 */
export async function recommendCourse(rawAnswers: unknown, rawTurns: unknown): Promise<Recommendation | null> {
  const student = await requireStudent();
  const answers = parseCourseAnswers(rawAnswers);
  if (!answers) return null;
  const access = courseAccess(student);
  const name = student.nickname ?? maskName(student.name);
  const allowed = COURSE_TOPICS.filter((t) => topicPhrases(t, access).length > 0).map((t) => t.id);
  const required = requiredTopics(answers).filter((id) => allowed.includes(id));
  const turns = cleanTurns(rawTurns);
  if (turns.some((t) => t.role === "me") && (await takeAiQuota(student.id, false))) {
    try {
      const ai = await aiCourse(answers, turns, allowed, name);
      if (ai) return { ...ai, topics: withRequired(ai.topics, required, allowed), source: "ai", required };
    } catch (e) {
      console.error("코스 AI 추천 실패:", e instanceof Error ? e.message : e);
    }
  }
  const ids = recommendTopics(answers, access);
  const first = courseTopic(ids[0]);
  return {
    summary: first ? `${name}님은 '${first.title}'부터 하면 좋아요` : `${name}님 상황에 맞춰 골랐어요`,
    topics: ids.map((id) => {
      const t = courseTopic(id)!;
      return { id, title: t.title, desc: t.desc };
    }),
    source: "rule",
    required,
  };
}

/** 질문 답 + 넣기로 고른 토픽 저장 (다시 하면 덮어쓴다. 표현 연습 기록은 그대로) */
export async function saveCourse(
  rawAnswers: unknown,
  rawTopics: unknown,
  rawTurns: unknown,
  meta: { summary: string; source: "ai" | "rule"; suggested: string[] },
) {
  const student = await requireStudent();
  const answers = parseCourseAnswers(rawAnswers);
  const access = courseAccess(student);
  if (!answers) return { ok: false as const };
  const allowed = COURSE_TOPICS.filter((t) => topicPhrases(t, access).length > 0).map((t) => t.id);
  const topics = withRequired(
    parseTopics(rawTopics).filter((t) => allowed.includes(t.id)),
    requiredTopics(answers),
    allowed,
  ).slice(0, 14);
  if (topics.length === 0) return { ok: false as const };
  const { error } = await createServerSupabaseClient()
    .from("student_course")
    .upsert({
      student_id: student.id,
      answers,
      topics,
      ai: {
        turns: cleanTurns(rawTurns),
        summary: String(meta?.summary ?? "").slice(0, 80),
        source: meta?.source === "ai" ? "ai" : "rule",
        suggested: Array.isArray(meta?.suggested) ? meta.suggested.filter((x) => typeof x === "string").slice(0, 6) : [],
        at: new Date().toISOString(),
      },
      today: null,
      updated_at: new Date().toISOString(),
    });
  if (error) {
    console.error("코스 저장 실패:", error.message);
    return { ok: false as const };
  }
  revalidatePath("/student");
  revalidatePath("/student/course", "layout");
  return { ok: true as const };
}

/** 코스 화면에서 토픽 넣기/빼기 */
export async function toggleTopic(formData: FormData) {
  const student = await requireStudent();
  const id = String(formData.get("topic") ?? "");
  const add = formData.get("op") === "add";
  const def = courseTopic(id);
  const row = await getCourseRow(student.id);
  if (!def || !row?.answers) return;
  const has = row.topics.some((t) => t.id === id);
  if (add === has) return;
  if (add && topicPhrases(def, courseAccess(student)).length === 0) return;
  const topics = add ? [...row.topics, { id, title: def.title, desc: def.desc }] : row.topics.filter((t) => t.id !== id);
  if (topics.length === 0) return; // 하나는 남겨 둔다
  await createServerSupabaseClient()
    .from("student_course")
    .update({ topics, today: null, updated_at: new Date().toISOString() })
    .eq("student_id", student.id);
  revalidatePath("/student/course", "layout");
}

/** 표현 하나 답했을 때 복습 일정 저장 */
export async function recordPhrase(key: string, correct: boolean) {
  const student = await requireStudent();
  if (typeof key !== "string" || key.length > 40 || !phraseByKey(key)) return;
  const [deck, setId] = key.split(":");
  const access = courseAccess(student);
  if (phraseSetLocked(access.fullVoca, deck, Number(setId))) return;
  if (!access.fullVoca) {
    // 무료회원: 오늘 처음 보는 표현은 하루 FREE_NEW_PER_DAY개까지만 기록한다
    const supabase = createServerSupabaseClient();
    const { data: existing } = await supabase
      .from("student_phrase")
      .select("phrase_key")
      .eq("student_id", student.id)
      .eq("phrase_key", key)
      .maybeSingle();
    if (!existing) {
      const dayStart = new Date(`${kstDate(new Date())}T00:00:00+09:00`).toISOString();
      const { count } = await supabase
        .from("student_phrase")
        .select("phrase_key", { count: "exact", head: true })
        .eq("student_id", student.id)
        .gte("created_at", dayStart);
      if ((count ?? 0) >= FREE_NEW_PER_DAY) return;
    }
  }
  await recordPhraseResult(student.id, key, correct === true);
}

/** 오늘의 연습 한 판 끝: 지난 지급 뒤 서버에 기록된 '맞힌 표현'당 2P (최대 30P).
 *  화면이 보낸 숫자는 믿지 않는다. 공부한 날·츄르에 들어간다 */
export async function finishPractice() {
  const student = await requireStudent();
  const supabase = createServerSupabaseClient();
  const { data: row } = await supabase
    .from("student_course")
    .select("practice_paid_at")
    .eq("student_id", student.id)
    .maybeSingle();
  if (!row) return;
  const now = new Date();
  const dayStart = new Date(`${kstDate(now)}T00:00:00+09:00`);
  const prev = row.practice_paid_at ? new Date(row.practice_paid_at) : null;
  const since = prev && prev > dayStart ? prev : dayStart;
  // 먼저 지급 시각을 옮겨서(읽은 값 그대로일 때만) 같은 기록으로 두 번 받지 못하게 한다
  let claim = supabase.from("student_course").update({ practice_paid_at: now.toISOString() }).eq("student_id", student.id);
  claim = row.practice_paid_at ? claim.eq("practice_paid_at", row.practice_paid_at) : claim.is("practice_paid_at", null);
  const { data: claimed } = await claim.select("student_id");
  if ((claimed ?? []).length !== 1) return;
  const { count } = await supabase
    .from("student_phrase")
    .select("phrase_key", { count: "exact", head: true })
    .eq("student_id", student.id)
    .eq("last_result", "right")
    .gt("updated_at", since.toISOString())
    .lte("updated_at", now.toISOString());
  const n = Math.min(15, count ?? 0);
  if (n > 0) await addVocaPlay(student.id, n * 2);
  revalidatePath("/student");
  revalidatePath("/student/course", "layout");
}

/** 처음 방문 안내를 봤다고 표시 (다시 안 뜬다) */
export async function dismissGuide() {
  const student = await requireStudent();
  await markGuideSeen(student.id);
  revalidatePath("/student");
}
