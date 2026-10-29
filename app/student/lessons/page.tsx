import Link from "next/link";
import { PREVIEW_DAYS, grantedLessonIds } from "@/lib/classroom/preview";
import { COURSE_INFO } from "@/lib/classroom/course-info";
import {
  createServerSupabaseClient,
  type Course,
  type Lesson,
} from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { COURSE_SHORT, upgradePlanFor } from "@/lib/classroom/plans";

/** 과정별 색 (Level 1.0은 교재 표지의 노란색) */
const THEME: Record<string, { tab: string; badge: string; icon: string }> = {
  level1: {
    tab: "border-[#f5c518] bg-[#ffd23f] text-zinc-900",
    badge: "bg-[#ffd23f] text-zinc-900",
    icon: "📒",
  },
  // Level 2.0은 교재(📗)처럼 초록색
  level2: {
    tab: "border-emerald-600 bg-emerald-500 text-white",
    badge: "bg-emerald-500 text-white",
    icon: "📗",
  },
  // Level 3.0은 빨간색
  level3: {
    tab: "border-red-600 bg-red-500 text-white",
    badge: "bg-red-500 text-white",
    icon: "📕",
  },
};
const DEFAULT_THEME = {
  tab: "border-brand-600 bg-brand-600 text-white",
  badge: "bg-brand-600 text-white",
  icon: "📘",
};

export default async function StudentLessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const student = await requireStudent();
  const supabase = createServerSupabaseClient();
  const { data: courseRows } = await supabase
    .from("courses")
    .select("*")
    .order("sort_order");
  const courses = (courseRows ?? []) as Course[];
  const allowed = new Set<string>(student.courses);
  const early = new Set<string>(student.earlyCourses);
  const requested = (await searchParams).course;
  const course =
    courses.find((c) => c.id === requested) ??
    courses.find((c) => allowed.has(c.id) && c.status === "open") ??
    courses[0];
  // 준비 중이어도 선생님이 미리 열어준 학생은 바로 볼 수 있다
  const canSee = early.has(course.id) || (allowed.has(course.id) && course.status === "open");
  const theme = THEME[course.id] ?? DEFAULT_THEME;
  const info = COURSE_INFO[course.id];
  const weekHeader = (weekNumber: number, title: string) => (
    <div className="flex flex-col gap-0.5">
      <h2 className="text-sm font-bold text-zinc-600">
        <span className={`mr-1.5 rounded-full px-2 py-0.5 ${theme.badge}`}>
          Week {weekNumber}
        </span>
        {title}
      </h2>
      {info?.weeks[weekNumber] && (
        <p className="pl-1 text-xs text-zinc-500">{info.weeks[weekNumber]}</p>
      )}
    </div>
  );

  const tabs = (
    <nav className="flex gap-1.5 overflow-x-auto">
      {courses.map((c) => (
        <Link
          key={c.id}
          href={`/student/lessons?course=${c.id}`}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold ${
            c.id === course.id
              ? (THEME[c.id] ?? DEFAULT_THEME).tab
              : "border-slate-200 bg-white text-slate-700"
          } ${allowed.has(c.id) || early.has(c.id) ? "" : "opacity-60"}`}
        >
          {allowed.has(c.id) || early.has(c.id) ? "" : "🔒 "}
          {COURSE_SHORT[c.id] ?? c.title}
        </Link>
      ))}
    </nav>
  );

  const upgrade = upgradePlanFor(course.id);
  const preparing = course.status !== "open";

  // 수강권이 없거나 준비 중인 과정은 한글 목차만 보여준다 (레슨 내용은 상세 페이지에서 막힘)
  if (!canSee) {
    const granted = grantedLessonIds(student.earlyCourses);
    const [{ data: tocRows }, { data: previewRows }, { count: sentenceCount }, { data: giftRows }] =
      await Promise.all([
        supabase
          .from("lessons")
          // 수강 전에는 영어 제목·문장을 보내지 않는다 (한글 목차만)
          .select(
            "id, sort_order, week_number, week_title, kind, day_number, title_ko",
          )
          .order("sort_order")
          .eq("is_published", true)
          .eq("course_id", course.id),
        // 맛보기(Day 1~3)는 영어 제목까지 보여준다
        supabase
          .from("lessons")
          .select("id, title")
          .eq("course_id", course.id)
          .eq("kind", "day")
          .eq("is_published", true)
          // 준비 중인 과정은 맛보기 없음
          .lte("day_number", preparing ? 0 : PREVIEW_DAYS),
        supabase
          .from("lesson_items")
          .select("id, lessons!inner(course_id, is_published)", {
            count: "exact",
            head: true,
          })
          .eq("lessons.course_id", course.id)
          .eq("lessons.is_published", true),
        // 선생님이 이 학생에게만 열어준 강의
        granted.length
          ? supabase.from("lessons").select("id, title").eq("course_id", course.id).eq("is_published", true).in("id", granted)
          : Promise.resolve({ data: [] as { id: string; title: string }[] }),
      ]);
    const gifts = new Set((giftRows ?? []).map((g) => g.id as string));
    const toc = (tocRows ?? []) as Lesson[];
    if (toc.length === 0) {
      return (
        <>
          {tabs}
          <section className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <span className="text-4xl">
              {allowed.has(course.id) ? "🎬" : "🔒"}
            </span>
            <h1 className="text-lg font-bold text-zinc-900">{course.title}</h1>
            <p className="text-sm text-zinc-600">
              지금 열심히 준비하고 있어요! ({course.subtitle ?? "준비 중"})
            </p>
          </section>
        </>
      );
    }
    const previewTitle = new Map(
      [...(previewRows ?? []), ...(giftRows ?? [])].map((p) => [p.id as string, p.title as string]),
    );
    const tocWeeks = new Map<number, { title: string; lessons: Lesson[] }>();
    for (const l of toc) {
      const w = tocWeeks.get(l.week_number) ?? {
        title: l.week_title,
        lessons: [],
      };
      w.lessons.push(l);
      tocWeeks.set(l.week_number, w);
    }
    return (
      <>
        {tabs}
        <h1 className="text-xl font-bold text-zinc-900">
          {theme.icon} {course.title}
        </h1>
        <section
          className={`flex flex-col gap-2 rounded-2xl p-4 ${theme.badge}`}
        >
          <p className="font-bold">
            {preparing
              ? `🛠 지금 열심히 준비 중이에요! 목차 먼저 공개해요 (${course.subtitle ?? "곧 오픈"})`
              : `🔒 ${upgrade ? upgrade.name : "상위 과정"} 수강생에게 열리는 과정이에요`}
          </p>
          {info && (
            <p className="text-sm leading-relaxed opacity-90">{info.intro}</p>
          )}
          <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
            {[
              `${toc.filter((l) => l.kind === "day").length}일 과정`,
              ...(sentenceCount ? [`쉐도잉 문장 ${sentenceCount}개`] : []),
              ...(info?.points ?? []),
            ].map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/70 px-2.5 py-1 text-zinc-800"
              >
                {t}
              </span>
            ))}
          </div>
          {previewTitle.size > 0 && (
            <p className="text-sm font-semibold">
              🎁 Day 1~{PREVIEW_DAYS}은 맛보기로 무료 공개! 영상 보고 쉐도잉까지
              해보세요.
            </p>
          )}
        </section>
        {[...tocWeeks.entries()].map(([weekNumber, week]) => (
          <section key={weekNumber} className="flex flex-col gap-2">
            {weekHeader(weekNumber, week.title)}
            <ul className="flex flex-col divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-brand-900/5">
              {week.lessons.map((l) =>
                previewTitle.has(l.id) ? (
                  <li key={l.id}>
                    <Link
                      href={`/student/lessons/${l.id}`}
                      className="flex items-center justify-between gap-3 bg-[#fff8db] px-4 py-2.5 hover:bg-[#fff1b8]"
                    >
                      <span className="flex items-baseline gap-2">
                        <span className="w-12 shrink-0 text-xs text-zinc-500">
                          Day {String(l.day_number).padStart(2, "0")}
                        </span>
                        <span className="flex flex-col">
                          <span className="font-medium text-zinc-900">
                            {previewTitle.get(l.id)}
                          </span>
                          {l.title_ko && (
                            <span className="text-xs text-zinc-500">
                              {l.title_ko}
                            </span>
                          )}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-[#ffd23f] px-2 py-0.5 text-xs font-bold text-zinc-900">
                        {gifts.has(l.id) ? "🎁 선물 강의" : "🎁 맛보기"}
                      </span>
                    </Link>
                  </li>
                ) : (
                  <li
                    key={l.id}
                    className="flex items-center justify-between gap-3 px-4 py-2.5"
                  >
                    <span className="flex items-baseline gap-2">
                      <span className="w-12 shrink-0 text-xs text-zinc-400">
                        {l.kind === "day"
                          ? `Day ${String(l.day_number).padStart(2, "0")}`
                          : l.title_ko?.includes("특강")
                            ? "특강"
                            : "복습"}
                      </span>
                      <span className="font-medium text-zinc-700">
                        {l.title_ko ?? "주간 복습 드릴"}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm opacity-40">🔒</span>
                  </li>
                ),
              )}
            </ul>
          </section>
        ))}
      </>
    );
  }

  const [
    { data: lessonRows },
    { data: itemRows },
    { data: subRows },
    { data: progressRows },
  ] = await Promise.all([
    supabase
      .from("lessons")
      .select(
        "id, course_id, sort_order, week_number, week_title, kind, day_number, title, title_ko, video_url, video_live, is_published",
      )
      // 아직 공개 안 한 레슨도 '공개 예정'으로 목록에 보여준다
      .eq("course_id", course.id)
      .order("sort_order"),
    supabase
      .from("lesson_items")
      .select("id, lesson_id, lessons!inner(course_id)")
      .eq("lessons.course_id", course.id),
    supabase
      .from("submissions")
      .select("lesson_item_id")
      .eq("student_id", student.id),
    supabase
      .from("video_progress")
      .select("lesson_id, percent, completed_at")
      .eq("student_id", student.id),
  ]);
  const watch = new Map((progressRows ?? []).map((p) => [p.lesson_id, p]));

  const lessons = (lessonRows ?? []) as Lesson[];
  const openIds = new Set(lessons.filter((l) => l.is_published).map((l) => l.id));
  const openItems = (itemRows ?? []).filter((i) => openIds.has(i.lesson_id));
  const practiced = new Set((subRows ?? []).map((s) => s.lesson_item_id));
  const itemsByLesson = new Map<string, string[]>();
  for (const item of itemRows ?? []) {
    itemsByLesson.set(item.lesson_id, [
      ...(itemsByLesson.get(item.lesson_id) ?? []),
      item.id,
    ]);
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
        <p className="text-sm text-zinc-500">
          아직 공개된 레슨이 없어요. 수업이 시작되면 여기서 복습할 수 있어요!
        </p>
      </>
    );
  }

  return (
    <>
      {tabs}
      <h1 className="text-xl font-bold text-zinc-900">
        {theme.icon} {course.title}
      </h1>
      {info && (
        <section
          className={`flex flex-col gap-2 rounded-2xl p-4 ${theme.badge}`}
        >
          <p className="font-bold">
            🎓 수강 중인 과정이에요 · 쉐도잉{" "}
            {openItems.filter((i) => practiced.has(i.id)).length}/
            {openItems.length}문장 완료
          </p>
          <p className="text-sm leading-relaxed opacity-90">{info.intro}</p>
          <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
            {[
              `${lessons.filter((l) => l.kind === "day").length}일 과정`,
              ...(openItems.length
                ? [`쉐도잉 문장 ${openItems.length}개`]
                : []),
              ...info.points,
            ].map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/70 px-2.5 py-1 text-zinc-800"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      )}
      {lessons.some((l) => l.video_live) && (
        <p className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-zinc-600">
          📼 Live 표시가 있는 강의는 수업 녹화본이에요. VOD 강의가 준비되면
          교체될 예정입니다.
        </p>
      )}
      {[...weeks.entries()].map(([weekNumber, week]) => (
        <section key={weekNumber} className="flex flex-col gap-2">
          {weekHeader(weekNumber, week.title)}
          <div className="flex flex-col divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-brand-900/5">
            {week.lessons.map((l) => {
              const items = itemsByLesson.get(l.id) ?? [];
              const done = items.filter((id) => practiced.has(id)).length;
              if (!l.is_published) {
                return (
                  <div key={l.id} className="flex items-center justify-between gap-3 px-4 py-3 opacity-60">
                    <span className="flex flex-col">
                      <span className="text-xs text-zinc-500">
                        {l.kind === "day" ? `Day ${String(l.day_number).padStart(2, "0")}` : l.title}
                      </span>
                      <span className="font-medium text-zinc-700">{l.title_ko ?? "주간 복습 드릴"}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">🔜 공개 예정</span>
                  </div>
                );
              }
              return (
                <Link
                  key={l.id}
                  href={`/student/lessons/${l.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-brand-50"
                >
                  <span className="flex flex-col">
                    <span className="text-xs text-zinc-500">
                      {l.kind === "day"
                        ? `Day ${String(l.day_number).padStart(2, "0")}`
                        : l.title}
                    </span>
                    <span className="font-medium text-zinc-900">
                      {l.kind === "day"
                        ? l.title
                        : (l.title_ko ?? "주간 복습 드릴")}
                    </span>
                    {l.kind === "day" && l.title_ko && (
                      <span className="text-xs text-zinc-500">
                        {l.title_ko}
                      </span>
                    )}
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    {l.video_url && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          watch.get(l.id)?.completed_at
                            ? "bg-green-100 text-green-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {l.video_live ? "📼 Live " : "🎬 "}
                        {watch.get(l.id)?.completed_at
                          ? "수강 완료"
                          : `${watch.get(l.id)?.percent ?? 0}%`}
                      </span>
                    )}
                    {items.length > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          done === items.length
                            ? "bg-green-100 text-green-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        🎤{" "}
                        {done === items.length
                          ? "제출 완료"
                          : `${done}/${items.length}`}
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
