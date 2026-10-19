import Link from "next/link";
import { after } from "next/server";
import { syncCourseVideos } from "@/lib/classroom/video-sheet";
import { createServerSupabaseClient, type Course, type Lesson } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { COURSE_SHORT, PLANS } from "@/lib/classroom/plans";

/** 과정별 색 (Level 1.0은 교재 표지의 노란색) */
const THEME: Record<string, { tab: string; badge: string; icon: string }> = {
  level1: { tab: "border-[#f5c518] bg-[#ffd23f] text-zinc-900", badge: "bg-[#ffd23f] text-zinc-900", icon: "📒" },
};
const DEFAULT_THEME = { tab: "border-brand-600 bg-brand-600 text-white", badge: "", icon: "📘" };

export default async function StudentLessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const student = await requireStudent();
  const supabase = createServerSupabaseClient();
  const { data: courseRows } = await supabase.from("courses").select("*").order("sort_order");
  const courses = (courseRows ?? []) as Course[];
  const allowed = new Set<string>(student.courses);
  const requested = (await searchParams).course;
  const course =
    courses.find((c) => c.id === requested) ?? courses.find((c) => allowed.has(c.id) && c.status === "open") ?? courses[0];
  const canSee = allowed.has(course.id) && course.status === "open";
  const theme = THEME[course.id] ?? DEFAULT_THEME;
  // 강의 링크 시트에 새 VOD가 있으면 응답을 보낸 뒤 조용히 반영 (시트는 1시간 캐시)
  if (course.video_sheet) after(() => syncCourseVideos(course.id).catch(() => undefined));

  const tabs = (
    <nav className="flex gap-1.5 overflow-x-auto">
      {courses.map((c) => (
        <Link
          key={c.id}
          href={`/student/lessons?course=${c.id}`}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold ${
            c.id === course.id ? (THEME[c.id] ?? DEFAULT_THEME).tab : "border-slate-200 bg-white text-slate-700"
          } ${allowed.has(c.id) ? "" : "opacity-60"}`}
        >
          {allowed.has(c.id) ? "" : "🔒 "}
          {COURSE_SHORT[c.id] ?? c.title}
        </Link>
      ))}
    </nav>
  );

  const upgrade = Object.values(PLANS).find((p) => p.courses.includes(course.id as never));
  if (course.status !== "open") {
    return (
      <>
        {tabs}
        <section className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="text-4xl">{allowed.has(course.id) ? "🎬" : "🔒"}</span>
          <h1 className="text-lg font-bold text-zinc-900">{course.title}</h1>
          <p className="text-sm text-zinc-600">지금 열심히 준비하고 있어요! ({course.subtitle ?? "준비 중"})</p>
        </section>
      </>
    );
  }

  // 수강권이 없어도 열린 과정의 목차는 보여준다 (레슨 내용은 상세 페이지에서 막힘)
  if (!canSee) {
    const [{ data: tocRows }, { count: sentenceCount }] = await Promise.all([
      supabase
        .from("lessons")
        .select("id, sort_order, week_number, week_title, kind, day_number, title, title_ko, video_url")
        .eq("is_published", true)
        .eq("course_id", course.id)
        .order("sort_order"),
      supabase
        .from("lesson_items")
        .select("id, lessons!inner(course_id, is_published)", { count: "exact", head: true })
        .eq("lessons.course_id", course.id)
        .eq("lessons.is_published", true),
    ]);
    const toc = (tocRows ?? []) as Lesson[];
    const tocWeeks = new Map<number, { title: string; lessons: Lesson[] }>();
    for (const l of toc) {
      const w = tocWeeks.get(l.week_number) ?? { title: l.week_title, lessons: [] };
      w.lessons.push(l);
      tocWeeks.set(l.week_number, w);
    }
    return (
      <>
        {tabs}
        <h1 className="text-xl font-bold text-zinc-900">
          {theme.icon} {course.title}
        </h1>
        <section className={`flex flex-col gap-1 rounded-2xl p-4 ${theme.badge || "bg-brand-50"}`}>
          <p className="font-bold">
            🔒 {upgrade ? `${upgrade.name} 수강생에게 열리는 과정이에요` : "상위 과정 수강생에게 열리는 과정이에요"}
          </p>
          <p className="text-sm opacity-80">
            {toc.filter((l) => l.kind === "day").length}일 과정 · 쉐도잉 문장 {sentenceCount ?? 0}개 · AI 발음 채점.
            어떤 걸 배우는지 목차를 미리 둘러보세요!
          </p>
        </section>
        {[...tocWeeks.entries()].map(([weekNumber, week]) => (
          <section key={weekNumber} className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-zinc-500">
              Week {weekNumber} · {week.title}
            </h2>
            <ul className="flex flex-col divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-brand-900/5">
              {week.lessons.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="flex flex-col">
                    <span className="text-xs text-zinc-500">
                      {l.kind === "day" ? `Day ${String(l.day_number).padStart(2, "0")}` : l.title}
                    </span>
                    <span className="font-medium text-zinc-700">{l.kind === "day" ? l.title : (l.title_ko ?? "주간 복습 드릴")}</span>
                    {l.kind === "day" && l.title_ko && <span className="text-xs text-zinc-500">{l.title_ko}</span>}
                  </span>
                  <span className="shrink-0 text-sm opacity-50">🔒</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </>
    );
  }

  const [{ data: lessonRows }, { data: itemRows }, { data: subRows }, { data: progressRows }] = await Promise.all([
    supabase
      .from("lessons")
      .select("id, course_id, sort_order, week_number, week_title, kind, day_number, title, title_ko, video_url")
      .eq("is_published", true)
      .eq("course_id", course.id)
      .order("sort_order"),
    supabase.from("lesson_items").select("id, lesson_id, lessons!inner(course_id)").eq("lessons.course_id", course.id),
    supabase.from("submissions").select("lesson_item_id").eq("student_id", student.id),
    supabase.from("video_progress").select("lesson_id, percent, completed_at").eq("student_id", student.id),
  ]);
  const watch = new Map((progressRows ?? []).map((p) => [p.lesson_id, p]));

  const lessons = (lessonRows ?? []) as Lesson[];
  const practiced = new Set((subRows ?? []).map((s) => s.lesson_item_id));
  const itemsByLesson = new Map<string, string[]>();
  for (const item of itemRows ?? []) {
    itemsByLesson.set(item.lesson_id, [...(itemsByLesson.get(item.lesson_id) ?? []), item.id]);
  }

  const weeks = new Map<number, { title: string; lessons: Lesson[] }>();
  for (const l of lessons) {
    const w = weeks.get(l.week_number) ?? { title: l.week_title, lessons: [] };
    w.lessons.push(l);
    weeks.set(l.week_number, w);
  }

  if (lessons.length === 0) {
    return (
      <>
        {tabs}
        <p className="text-sm text-zinc-500">아직 공개된 레슨이 없어요. 수업이 시작되면 여기서 복습할 수 있어요!</p>
      </>
    );
  }

  return (
    <>
      {tabs}
      <h1 className="text-xl font-bold text-zinc-900">
        {theme.icon} {course.title}
      </h1>
      {[...weeks.entries()].map(([weekNumber, week]) => (
        <section key={weekNumber} className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-zinc-500">
            <span className={theme.badge ? `mr-1 rounded-full px-2 py-0.5 ${theme.badge}` : ""}>Week {weekNumber}</span>
            {theme.badge ? "" : " · "}
            {week.title}
          </h2>
          <div className="flex flex-col divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-brand-900/5">
            {week.lessons.map((l) => {
              const items = itemsByLesson.get(l.id) ?? [];
              const done = items.filter((id) => practiced.has(id)).length;
              return (
                <Link
                  key={l.id}
                  href={`/student/lessons/${l.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-brand-50"
                >
                  <span className="flex flex-col">
                    <span className="text-xs text-zinc-500">
                      {l.kind === "day" ? `Day ${String(l.day_number).padStart(2, "0")}` : l.title}
                    </span>
                    <span className="font-medium text-zinc-900">
                      {l.kind === "day" ? l.title : (l.title_ko ?? "주간 복습 드릴")}
                    </span>
                    {l.kind === "day" && l.title_ko && <span className="text-xs text-zinc-500">{l.title_ko}</span>}
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    {l.video_url && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          watch.get(l.id)?.completed_at ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        🎬 {watch.get(l.id)?.completed_at ? "수강 완료" : `${watch.get(l.id)?.percent ?? 0}%`}
                      </span>
                    )}
                    {items.length > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          done === items.length ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        🎤 {done === items.length ? "제출 완료" : `${done}/${items.length}`}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
