import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";
import { addDays, kstDate } from "./stats";
import { VILLAGE_TALKS } from "./village-talk";
import {
  QUEST_KINDS,
  isComplete,
  pickLessonSentence,
  questChuru,
  questStreak,
  shopForDay,
  type QuestKind,
} from "./village-quest";

export type QuestLesson = { sentence: string; translation: string; label: string };

export type QuestState = {
  day: string;
  shopId: string;
  /** 어제 가게 첫 마디 (힌트는 한국어만) */
  review: { shopId: string; ko: string; answers: string[] };
  lesson: QuestLesson | null;
  done: QuestKind[];
  streak: number;
  churuToday: number;
};

/** 오늘 강의 문장: 가장 최근에 영상을 본 강의(없으면 내 첫 과정 Day 1)의 쉐도잉 문장 중 하나 */
async function lessonSentence(studentId: string, courses: string[], day: string): Promise<QuestLesson | null> {
  if (!courses.length) return null;
  const supabase = createServerSupabaseClient();
  const { data: recent } = await supabase
    .from("video_progress")
    .select("lesson_id, last_viewed_at, lessons!inner(course_id, is_published)")
    .eq("student_id", studentId)
    .eq("lessons.is_published", true)
    .in("lessons.course_id", courses)
    .not("last_viewed_at", "is", null)
    .order("last_viewed_at", { ascending: false })
    .limit(1);
  let lessonId = (recent?.[0]?.lesson_id as string | undefined) ?? null;
  if (!lessonId) {
    const { data: first } = await supabase
      .from("lessons")
      .select("id")
      .eq("course_id", courses[0])
      .eq("is_published", true)
      .eq("kind", "day")
      .order("sort_order")
      .limit(1);
    lessonId = (first?.[0]?.id as string | undefined) ?? null;
  }
  if (!lessonId) return null;
  const [{ data: lesson }, { data: items }] = await Promise.all([
    supabase.from("lessons").select("day_number, title").eq("id", lessonId).maybeSingle(),
    supabase.from("lesson_items").select("sentence, translation").eq("lesson_id", lessonId).order("item_order"),
  ]);
  const pick = pickLessonSentence((items ?? []) as { sentence: string; translation: string | null }[], day);
  if (!pick) return null;
  const label = lesson?.day_number ? `Day ${lesson.day_number}` : String(lesson?.title ?? "강의");
  return { sentence: pick.sentence, translation: pick.translation ?? "", label };
}

export async function getQuestState(student: { id: string; courses: string[] }): Promise<QuestState> {
  const supabase = createServerSupabaseClient();
  const day = kstDate(new Date());
  const yesterday = addDays(day, -1);
  const [{ data: rows }, lesson] = await Promise.all([
    supabase
      .from("village_quests")
      .select("day, done")
      .eq("student_id", student.id)
      .gte("day", addDays(day, -400))
      .order("day", { ascending: false }),
    lessonSentence(student.id, student.courses, day),
  ]);
  const list = (rows ?? []) as { day: string; done: string[] }[];
  const today = list.find((r) => r.day === day);
  const completeDays = new Set(list.filter((r) => isComplete(r.done)).map((r) => r.day));
  const reviewShop = shopForDay(yesterday);
  const first = VILLAGE_TALKS[reviewShop][0];
  const done = (today?.done ?? []).filter((d): d is QuestKind => (QUEST_KINDS as readonly string[]).includes(d));
  return {
    day,
    shopId: shopForDay(day),
    review: { shopId: reviewShop, ko: first.ko, answers: first.answers },
    lesson,
    done,
    streak: questStreak(completeDays, day, addDays),
    churuToday: questChuru(done),
  };
}

/** 의뢰 하나 끝냄. 이미 한 건 그대로 둔다 */
export async function completeQuest(studentId: string, kind: QuestKind) {
  const supabase = createServerSupabaseClient();
  const day = kstDate(new Date());
  const { data: row } = await supabase
    .from("village_quests")
    .select("done")
    .eq("student_id", studentId)
    .eq("day", day)
    .maybeSingle();
  const done = (row?.done as string[] | undefined) ?? [];
  if (done.includes(kind)) return { ok: true as const };
  const { error } = await supabase
    .from("village_quests")
    .upsert({ student_id: studentId, day, done: [...done, kind] }, { onConflict: "student_id,day" });
  return { ok: !error };
}
