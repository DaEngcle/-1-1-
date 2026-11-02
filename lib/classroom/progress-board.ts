import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";
import { isTrialPlan, planName, studentCourses } from "./plans";
import { isTrialLesson } from "./preview";
import { fetchAll } from "./progress";
import { kstDate } from "./stats";

/** 2 = 끝냄, 1 = 하는 중, 0 = 시작 전, -1 = 체험이라 잠김 */
export type BoardCell = { state: 2 | 1 | 0 | -1; label: string };

export interface BoardRow {
  id: string;
  name: string;
  nickname: string | null;
  planLabel: string;
  isTrial: boolean;
  ended: boolean;
  cells: BoardCell[];
  done: number;
  /** 이 학생이 들을 수 있는 Day 수 */
  total: number;
  percent: number;
  /** 가장 멀리 간 Day (시작 안 했으면 null) */
  furthest: number | null;
  lastActive: string | null;
  daysInactive: number | null;
}

export interface BoardCohort {
  id: string;
  name: string;
  count: number;
}

function daysBetween(from: string, to: string) {
  return Math.round((new Date(`${to}T00:00:00Z`).getTime() - new Date(`${from}T00:00:00Z`).getTime()) / 86400000);
}

/**
 * 진도표: 학생 × Day. 영상 시청 기록과 쉐도잉 제출로 자동으로 채운다.
 * cohort: 기수 id, "none"(기수 미지정), 없으면 전체
 */
export async function getProgressBoard(courseId: string, cohort: string | null) {
  const supabase = createServerSupabaseClient();
  const today = kstDate(new Date());
  const [{ data: lessonRows }, { data: cohortRows }, { data: studentRows }] = await Promise.all([
    supabase
      .from("lessons")
      .select("id, kind, day_number, week_number, video_url")
      .eq("course_id", courseId)
      .eq("is_published", true)
      .eq("kind", "day")
      .order("sort_order"),
    supabase.from("cohorts").select("id, name").order("name"),
    supabase
      .from("students")
      .select("id, name, nickname, plan, courses, access_until, cohort_id, early_courses")
      .eq("approval", "approved")
      .eq("stage", "enrolled")
      .eq("is_active", true)
      .order("name"),
  ]);
  const lessons = lessonRows ?? [];
  const allStudents = studentRows ?? [];
  const inCourse = (s: (typeof allStudents)[number]) =>
    studentCourses(s.plan as string | null, s.courses as string[] | null).includes(courseId as never);

  // 수강권이 없는 기수 학생은 기수 화면에서만 흐리게 보여준다 (평균에는 안 넣음)
  const noPlan = (s: (typeof allStudents)[number]) =>
    studentCourses(s.plan as string | null, s.courses as string[] | null).length === 0;
  const inCohortView = (s: (typeof allStudents)[number]) => inCourse(s) || noPlan(s);
  // 전체·미지정·기수 모두 이 과정을 듣는 학생만
  const cohorts: BoardCohort[] = (cohortRows ?? [])
    .map((c) => ({
      id: c.id as string,
      name: c.name as string,
      count: allStudents.filter((s) => s.cohort_id === c.id && inCohortView(s)).length,
    }))
    .filter((c) => c.count > 0);
  const unassigned = allStudents.filter((s) => !s.cohort_id && inCourse(s)).length;
  const students = allStudents.filter((s) =>
    cohort === "none" ? !s.cohort_id && inCourse(s) : cohort ? s.cohort_id === cohort && inCohortView(s) : inCourse(s),
  );
  const ids = students.map((s) => s.id as string);
  const lessonIds = lessons.map((l) => l.id as string);
  if (ids.length === 0 || lessonIds.length === 0) {
    return { days: lessons.map((l) => ({ id: l.id as string, day: l.day_number as number, week: l.week_number as number })), rows: [] as BoardRow[], cohorts, unassigned, allCount: allStudents.filter(inCourse).length };
  }

  const [items, watched, submitted] = await Promise.all([
    fetchAll<{ id: string; lesson_id: string }>((from, to) =>
      supabase.from("lesson_items").select("id, lesson_id").in("lesson_id", lessonIds).range(from, to),
    ),
    fetchAll<{ student_id: string; lesson_id: string; percent: number | null; completed_at: string | null; updated_at: string }>((from, to) =>
      supabase
        .from("video_progress")
        .select("student_id, lesson_id, percent, completed_at, updated_at")
        .in("student_id", ids)
        .range(from, to),
    ),
    fetchAll<{ student_id: string; lesson_item_id: string; created_at: string }>((from, to) =>
      supabase.from("submissions").select("student_id, lesson_item_id, created_at").in("student_id", ids).range(from, to),
    ),
  ]);

  const lessonOfItem = new Map(items.map((i) => [i.id, i.lesson_id]));
  const itemCount = new Map<string, number>();
  for (const i of items) itemCount.set(i.lesson_id, (itemCount.get(i.lesson_id) ?? 0) + 1);
  const watchKey = new Map(watched.map((w) => [`${w.student_id}:${w.lesson_id}`, w]));
  // 학생·레슨별로 제출한 문장 (같은 문장을 여러 번 내도 하나로)
  const sentByLesson = new Map<string, Set<string>>();
  const last = new Map<string, string>();
  const touch = (id: string, day: string) => {
    if (!last.has(id) || day > last.get(id)!) last.set(id, day);
  };
  // 마지막 공부일도 이 과정 안에서만 센다
  const courseLessons = new Set(lessonIds);
  for (const s of submitted) {
    const lessonId = lessonOfItem.get(s.lesson_item_id);
    if (!lessonId) continue;
    touch(s.student_id, kstDate(s.created_at));
    const key = `${s.student_id}:${lessonId}`;
    sentByLesson.set(key, (sentByLesson.get(key) ?? new Set()).add(s.lesson_item_id));
  }
  for (const w of watched) if (courseLessons.has(w.lesson_id)) touch(w.student_id, kstDate(w.updated_at));

  const rows: BoardRow[] = students.map((s) => {
    const id = s.id as string;
    const isTrial = isTrialPlan(s.plan as string | null);
    const early = (s.early_courses as string[] | null) ?? [];
    let done = 0;
    let total = 0;
    let furthest: number | null = null;
    const cells: BoardCell[] = lessons.map((l) => {
      const dayLabel = `Day ${String(l.day_number).padStart(2, "0")}`;
      const locked =
        isTrial &&
        !isTrialLesson({ kind: l.kind as string, day_number: l.day_number as number | null, week_number: l.week_number as number | null }) &&
        !early.includes(courseId) &&
        !early.includes(`lesson:${l.id}`);
      if (locked) return { state: -1, label: `${dayLabel} · 체험이라 잠김` };
      total++;
      const w = watchKey.get(`${id}:${l.id}`);
      const percent = w?.percent ?? 0;
      const sentences = itemCount.get(l.id as string) ?? 0;
      const sent = sentByLesson.get(`${id}:${l.id}`)?.size ?? 0;
      const videoDone = !l.video_url || Boolean(w?.completed_at);
      const shadowDone = sent >= sentences;
      const parts = [
        l.video_url ? `영상 ${w?.completed_at ? "완료" : `${percent}%`}` : null,
        sentences ? `쉐도잉 ${sent}/${sentences}` : null,
      ].filter(Boolean);
      const label = `${dayLabel} · ${parts.join(" · ") || "내용 없음"}`;
      const started = percent > 0 || sent > 0 || Boolean(w?.completed_at);
      if (started) furthest = l.day_number as number;
      if (started && videoDone && shadowDone) {
        done++;
        return { state: 2, label };
      }
      return { state: started ? 1 : 0, label };
    });
    const lastActive = last.get(id) ?? null;
    const until = s.access_until as string | null;
    return {
      id,
      name: s.name as string,
      nickname: (s.nickname as string | null) ?? null,
      planLabel: planName(s.plan as string | null, s.courses as string[] | null).replace("다잉클 ", ""),
      isTrial,
      ended: Boolean(until && until < today) || noPlan(s),
      cells,
      done,
      total,
      percent: total ? Math.round((done / total) * 100) : 0,
      furthest,
      lastActive,
      daysInactive: lastActive ? daysBetween(lastActive, today) : null,
    };
  });

  return {
    days: lessons.map((l) => ({ id: l.id as string, day: l.day_number as number, week: l.week_number as number })),
    rows,
    cohorts,
    unassigned,
    allCount: allStudents.filter(inCourse).length,
  };
}
