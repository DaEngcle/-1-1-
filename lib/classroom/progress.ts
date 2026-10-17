import "server-only";
import { createServerSupabaseClient, type Lesson } from "@/lib/supabase";
import { SEGMENT_SECONDS, COMPLETE_PERCENT } from "./progress-rules";

export { SEGMENT_SECONDS, COMPLETE_PERCENT };

export function segmentCount(durationSeconds: number) {
  return Math.max(1, Math.ceil(durationSeconds / SEGMENT_SECONDS));
}

export function watchPercent(segments: number[], durationSeconds: number) {
  const total = segmentCount(durationSeconds);
  const watched = new Set(segments.filter((s) => s >= 0 && s < total)).size;
  return Math.min(100, Math.floor((watched / total) * 100));
}

type Client = ReturnType<typeof createServerSupabaseClient>;

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

type PublishedLesson = Pick<Lesson, "id" | "sort_order" | "week_number" | "week_title" | "kind" | "day_number" | "title" | "video_url">;

async function loadPublished(supabase: Client) {
  // 레슨과 문장을 동시에 조회 (문장은 공개 레슨 것만)
  const [{ data: lessonRows }, items] = await Promise.all([
    supabase
      .from("lessons")
      .select("id, sort_order, week_number, week_title, kind, day_number, title, video_url")
      .eq("is_published", true)
      .order("sort_order"),
    fetchAll<{ id: string; lesson_id: string }>((from, to) =>
      supabase
        .from("lesson_items")
        .select("id, lesson_id, lessons!inner(is_published)")
        .eq("lessons.is_published", true)
        .range(from, to),
    ),
  ]);
  return { lessons: (lessonRows ?? []) as PublishedLesson[], items };
}

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

/** 학생별 전체 진도 (공개된 레슨 기준) */
export async function getCourseProgress(studentIds: string[]): Promise<Map<string, CourseProgress>> {
  const result = new Map<string, CourseProgress>();
  if (studentIds.length === 0) return result;

  const supabase = createServerSupabaseClient();
  const [{ lessons, items }, progressRows, submissionRows] = await Promise.all([
    loadPublished(supabase),
    fetchAll<{ student_id: string; lesson_id: string }>((from, to) =>
      supabase
        .from("video_progress")
        .select("student_id, lesson_id")
        .in("student_id", studentIds)
        .not("completed_at", "is", null)
        .range(from, to),
    ),
    fetchAll<{ student_id: string; lesson_item_id: string }>((from, to) =>
      supabase
        .from("submissions")
        .select("student_id, lesson_item_id")
        .in("student_id", studentIds)
        .range(from, to),
    ),
  ]);
  const videoLessonIds = new Set(lessons.filter((l) => l.video_url).map((l) => l.id));
  const itemIds = new Set(items.map((i) => i.id));

  const completed = new Map<string, Set<string>>();
  for (const p of progressRows) {
    if (!videoLessonIds.has(p.lesson_id)) continue;
    completed.set(p.student_id, (completed.get(p.student_id) ?? new Set()).add(p.lesson_id));
  }
  const submitted = new Map<string, Set<string>>();
  for (const s of submissionRows) {
    if (!itemIds.has(s.lesson_item_id)) continue;
    submitted.set(s.student_id, (submitted.get(s.student_id) ?? new Set()).add(s.lesson_item_id));
  }

  const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
  for (const id of studentIds) {
    const done = completed.get(id)?.size ?? 0;
    const sent = submitted.get(id)?.size ?? 0;
    result.set(id, {
      videoLessons: videoLessonIds.size,
      completedVideos: done,
      videoPercent: pct(done, videoLessonIds.size),
      sentences: itemIds.size,
      submittedSentences: sent,
      submitPercent: pct(sent, itemIds.size),
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
  const [{ lessons, items }, { data: progressRows }, submissionRows] = await Promise.all([
    loadPublished(supabase),
    supabase
      .from("video_progress")
      .select("lesson_id, percent, completed_at")
      .eq("student_id", studentId),
    fetchAll<{ lesson_item_id: string }>((from, to) =>
      supabase.from("submissions").select("lesson_item_id").eq("student_id", studentId).range(from, to),
    ),
  ]);

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
