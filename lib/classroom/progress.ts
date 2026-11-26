import "server-only";
import { cache } from "react";
import { createServerSupabaseClient, type Lesson } from "@/lib/supabase";
import { SEGMENT_SECONDS, COMPLETE_PERCENT } from "./progress-rules";
import { isTrialPlan, studentCourses } from "./plans";
import { isTrialLesson } from "./preview";

export { SEGMENT_SECONDS, COMPLETE_PERCENT };

export function segmentCount(durationSeconds: number) {
  return Math.max(1, Math.ceil(durationSeconds / SEGMENT_SECONDS));
}

export function watchPercent(segments: number[], durationSeconds: number) {
  const total = segmentCount(durationSeconds);
  const watched = new Set(segments.filter((s) => s >= 0 && s < total)).size;
  return Math.min(100, Math.floor((watched / total) * 100));
}


/** Supabase는 한 번에 1000행까지만 주므로 끝까지 나눠서 가져온다 */
export async function fetchAll<T>(
  build: (from: number, to: number) => PromiseLike<{ data: T[] | null }>,
): Promise<T[]> {
  const PAGE = 1000;
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data } = await build(from, from + PAGE - 1);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) return rows;
  }
}

export type StudentSubmission = { lesson_item_id: string; status: string; overall_score: number | null; created_at: string };

/**
 * 학생 한 명의 쉐도잉 제출 기록 전체 (오래된 순).
 * 홈 한 번 그릴 때 진도·통계·연속 기록·고양이 단계가 모두 쓰므로, 한 요청 안에서는 한 번만 읽는다 (React cache).
 */
export const studentSubmissions = cache(async (studentId: string) =>
  fetchAll<StudentSubmission>((from, to) =>
    createServerSupabaseClient()
      .from("submissions")
      .select("lesson_item_id, status, overall_score, created_at")
      .eq("student_id", studentId)
      .order("created_at")
      .order("id")
      .range(from, to),
  ),
);

export type StudentActivity = { day: string; watched_seconds: number; voca_plays: number | null; voca_points: number | null };

/** 학생 한 명의 날짜별 학습 기록 (시청 초·보카) — 한 요청 안에서는 한 번만 읽는다 */
export const studentActivity = cache(async (studentId: string) =>
  fetchAll<StudentActivity>((from, to) =>
    createServerSupabaseClient()
      .from("daily_activity")
      .select("day, watched_seconds, voca_plays, voca_points")
      .eq("student_id", studentId)
      .order("day")
      .range(from, to),
  ),
);

type PublishedLesson = Pick<
  Lesson,
  "id" | "course_id" | "sort_order" | "week_number" | "week_title" | "kind" | "day_number" | "title" | "video_url"
>;

// 공개 레슨·문장 목록 (문장 1,700여 줄) — 진도 계산 두 곳이 같이 쓰므로 한 요청 안에서는 한 번만 읽는다
const loadPublished = cache(async () => {
  const supabase = createServerSupabaseClient();
  // 레슨과 문장을 동시에 조회 (문장은 공개 레슨 것만)
  const [{ data: lessonRows }, items] = await Promise.all([
    supabase
      .from("lessons")
      .select("id, course_id, sort_order, week_number, week_title, kind, day_number, title, video_url")
      .eq("is_published", true)
      .order("course_id")
      .order("sort_order"),
    fetchAll<{ id: string; lesson_id: string }>((from, to) =>
      supabase
        .from("lesson_items")
        .select("id, lesson_id, lessons!inner(is_published, course_id)")
        .eq("lessons.is_published", true)
        .range(from, to),
    ),
  ]);
  return {
    lessons: (lessonRows ?? []) as PublishedLesson[],
    items: items as { id: string; lesson_id: string; lessons?: { course_id: string } }[],
  };
});

export interface CourseProgress {
  /** 영상이 있는 공개 레슨 수 */
  videoLessons: number;
  /** 그중 90% 이상 시청한 레슨 수 */
  completedVideos: number;
  videoPercent: number;
  /** 공개 레슨의 쉐도잉 문장 수 */
  sentences: number;
  /** 한 번이라도 제출한 문장 수 */
  submittedSentences: number;
  submitPercent: number;
}

/** 학생별 전체 진도 (공개된 레슨 중 그 학생 수강권에 포함된 과정만) */
export async function getCourseProgress(studentIds: string[]): Promise<Map<string, CourseProgress>> {
  const result = new Map<string, CourseProgress>();
  if (studentIds.length === 0) return result;

  const supabase = createServerSupabaseClient();
  const [{ lessons, items }, { data: planRows }, progressRows, submissionRows] = await Promise.all([
    loadPublished(),
    supabase.from("students").select("id, plan, courses").in("id", studentIds),
    fetchAll<{ student_id: string; lesson_id: string }>((from, to) =>
      supabase
        .from("video_progress")
        .select("student_id, lesson_id")
        .in("student_id", studentIds)
        .not("completed_at", "is", null)
        .range(from, to),
    ),
    // 학생 한 명(학생 홈)이면 다른 곳과 같이 쓰는 제출 기록을 쓴다
    studentIds.length === 1
      ? studentSubmissions(studentIds[0]).then((rows) =>
          rows.map((r) => ({ student_id: studentIds[0], lesson_item_id: r.lesson_item_id })),
        )
      : fetchAll<{ student_id: string; lesson_item_id: string }>((from, to) =>
          supabase
            .from("submissions")
            .select("student_id, lesson_item_id")
            .in("student_id", studentIds)
            .range(from, to),
        ),
  ]);
  const courseOfLesson = new Map(lessons.map((l) => [l.id, l.course_id]));
  const videoLessonIds = new Set(lessons.filter((l) => l.video_url).map((l) => l.id));
  const itemCourse = new Map(items.map((i) => [i.id, courseOfLesson.get(i.lesson_id)]));
  const planOf = new Map((planRows ?? []).map((r) => [r.id as string, studentCourses(r.plan as string | null, r.courses as string[] | null)]));

  const completed = new Map<string, Set<string>>();
  for (const p of progressRows) {
    if (!videoLessonIds.has(p.lesson_id)) continue;
    completed.set(p.student_id, (completed.get(p.student_id) ?? new Set()).add(p.lesson_id));
  }
  const submitted = new Map<string, Set<string>>();
  for (const s of submissionRows) {
    if (!itemCourse.has(s.lesson_item_id)) continue;
    submitted.set(s.student_id, (submitted.get(s.student_id) ?? new Set()).add(s.lesson_item_id));
  }

  const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
  for (const id of studentIds) {
    const courses = new Set<string>(planOf.get(id) ?? []);
    const inPlan = (course: string | undefined) => course != null && courses.has(course);
    const videoTotal = [...videoLessonIds].filter((l) => inPlan(courseOfLesson.get(l))).length;
    const itemTotal = [...itemCourse.values()].filter(inPlan).length;
    const done = [...(completed.get(id) ?? [])].filter((l) => inPlan(courseOfLesson.get(l))).length;
    const sent = [...(submitted.get(id) ?? [])].filter((i) => inPlan(itemCourse.get(i))).length;
    result.set(id, {
      videoLessons: videoTotal,
      completedVideos: done,
      videoPercent: pct(done, videoTotal),
      sentences: itemTotal,
      submittedSentences: sent,
      submitPercent: pct(sent, itemTotal),
    });
  }
  return result;
}

export interface LessonProgressRow {
  lesson: PublishedLesson;
  /** 영상 시청률 (영상 없는 레슨은 null) */
  videoPercent: number | null;
  videoCompleted: boolean;
  sentences: number;
  submitted: number;
}

/** 한 학생의 레슨별 진도 (공개 레슨 순서대로) */
export async function getLessonProgress(studentId: string): Promise<LessonProgressRow[]> {
  const supabase = createServerSupabaseClient();
  const [{ lessons: allLessons, items }, { data: me }, { data: progressRows }, submissionRows] = await Promise.all([
    loadPublished(),
    supabase.from("students").select("plan, courses, early_courses").eq("id", studentId).maybeSingle(),
    supabase
      .from("video_progress")
      .select("lesson_id, percent, completed_at")
      .eq("student_id", studentId),
    studentSubmissions(studentId),
  ]);

  const courses = new Set<string>(studentCourses(me?.plan, me?.courses as string[] | null));
  // 무료 체험은 열린 앞부분만 (다음 공부 안내가 잠긴 강의를 가리키지 않게)
  const isTrial = isTrialPlan(me?.plan);
  const early = (me?.early_courses as string[] | null) ?? [];
  const lessons = allLessons.filter(
    (l) =>
      courses.has(l.course_id) &&
      // 선생님이 따로 열어준 과정·강의는 체험이어도 보인다
      (!isTrial || isTrialLesson(l) || early.includes(l.course_id) || early.includes(`lesson:${l.id}`)),
  );
  const progress = new Map((progressRows ?? []).map((p) => [p.lesson_id, p]));
  const submitted = new Set(submissionRows.map((s) => s.lesson_item_id));
  const itemsByLesson = new Map<string, string[]>();
  for (const i of items) itemsByLesson.set(i.lesson_id, [...(itemsByLesson.get(i.lesson_id) ?? []), i.id]);

  return lessons.map((lesson) => {
    const p = progress.get(lesson.id);
    const lessonItems = itemsByLesson.get(lesson.id) ?? [];
    return {
      lesson,
      videoPercent: lesson.video_url ? (p?.percent ?? 0) : null,
      videoCompleted: Boolean(p?.completed_at),
      sentences: lessonItems.length,
      submitted: lessonItems.filter((id) => submitted.has(id)).length,
    };
  });
}
