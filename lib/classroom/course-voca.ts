import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";
import { canOpenLesson } from "./preview";
import { fetchAll } from "./progress";

/**
 * 과정별 단어 복습: 각 주차 쉐도잉 문장(영어 + 해석)으로 게임 덱을 만든다.
 * 학생이 열 수 있는 레슨(수강권·맛보기·미리 열어준 과정)의 문장만 쓴다.
 */

type StudentAccess = { courses: string[]; earlyCourses: string[] };
type LessonRow = {
  id: string;
  course_id: string;
  week_number: number;
  week_title: string | null;
  kind: string;
  day_number: number | null;
};

export type VocaWeek = { week: number; title: string | null; sentences: number; open: boolean };
export type VocaCourse = { id: string; title: string; weeks: VocaWeek[] };
export type VocaSentence = { sentence: string; translation: string };

async function load() {
  const supabase = createServerSupabaseClient();
  const [{ data: courses }, { data: lessons }, items] = await Promise.all([
    supabase.from("courses").select("id, title, status").order("sort_order"),
    supabase
      .from("lessons")
      .select("id, course_id, week_number, week_title, kind, day_number")
      .eq("is_published", true),
    fetchAll<{ lesson_id: string; sentence: string; translation: string | null }>((from, to) =>
      supabase.from("lesson_items").select("lesson_id, sentence, translation").order("item_order").range(from, to),
    ),
  ]);
  return { courses: courses ?? [], lessons: (lessons ?? []) as LessonRow[], items };
}

/** 과정·주차 목록 (문장이 있는 주차만) */
export async function getVocaCourses(student: StudentAccess): Promise<VocaCourse[]> {
  const { courses, lessons, items } = await load();
  const count = new Map<string, number>();
  for (const it of items) if (it.translation) count.set(it.lesson_id, (count.get(it.lesson_id) ?? 0) + 1);
  return courses
    .map((c) => {
      const weeks = new Map<number, VocaWeek>();
      for (const l of lessons.filter((x) => x.course_id === c.id)) {
        const n = count.get(l.id) ?? 0;
        if (!n) continue;
        const w = weeks.get(l.week_number) ?? { week: l.week_number, title: l.week_title, sentences: 0, open: false };
        const open = canOpenLesson(student.courses, l, c.status as string, student.earlyCourses);
        if (open) w.sentences += n;
        w.open ||= open;
        weeks.set(l.week_number, w);
      }
      return { id: c.id as string, title: c.title as string, weeks: [...weeks.values()].sort((a, b) => a.week - b.week) };
    })
    .filter((c) => c.weeks.length > 0);
}

/** 한 주차에서 학생이 열 수 있는 문장들 */
export async function getVocaWeek(student: StudentAccess, courseId: string, week: number) {
  const { courses, lessons, items } = await load();
  const course = courses.find((c) => c.id === courseId);
  if (!course) return null;
  const open = new Set(
    lessons
      .filter((l) => l.course_id === courseId && l.week_number === week)
      .filter((l) => canOpenLesson(student.courses, l, course.status as string, student.earlyCourses))
      .map((l) => l.id),
  );
  const sentences: VocaSentence[] = items
    .filter((it) => open.has(it.lesson_id) && it.translation)
    .map((it) => ({ sentence: it.sentence.trim(), translation: (it.translation as string).trim() }));
  return { title: course.title as string, sentences };
}
