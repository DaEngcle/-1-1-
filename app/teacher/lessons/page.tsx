import Link from "next/link";
import { VideoSheetForm } from "./video-sheet-form";
import {
  createServerSupabaseClient,
  type ClassRecording,
  type Course,
  type Lesson,
} from "@/lib/supabase";
import {
  addLesson,
  addRecording,
  deleteRecording,
  publishUntil,
  setCourseStatus,
  setPublished,
} from "./actions";
import {
  cardClass,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/app/_ui/styles";
import { requireTeacher } from "@/lib/classroom/dal";
import { PlaylistImportForm } from "./playlist-form";
import { COURSE_SHORT } from "@/lib/classroom/plans";
import { SubmitButton } from "@/app/_ui/submit-button";

export default async function TeacherLessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  const { data: courseRows } = await supabase.from("courses").select("*").order("sort_order");
  const courses = (courseRows ?? []) as Course[];
  const requested = (await searchParams).course;
  const course = courses.find((c) => c.id === requested) ?? courses[0];
  const [{ data: lessonRows }, { data: itemRows }, { data: recRows }] = await Promise.all([
    supabase.from("lessons").select("*").eq("course_id", course.id).order("sort_order"),
    supabase.from("lesson_items").select("lesson_id, lessons!inner(course_id)").eq("lessons.course_id", course.id),
    supabase.from("class_recordings").select("*").eq("course_id", course.id).order("created_at"),
  ]);
  const lessons = (lessonRows ?? []) as Lesson[];
  const recordings = (recRows ?? []) as ClassRecording[];
  const itemCount = new Map<string, number>();
  for (const i of itemRows ?? []) itemCount.set(i.lesson_id, (itemCount.get(i.lesson_id) ?? 0) + 1);

  const weeks = new Map<number, { title: string; lessons: Lesson[] }>();
  for (const l of lessons) {
    const w = weeks.get(l.week_number) ?? { title: l.week_title, lessons: [] };
    w.lessons.push(l);
    weeks.set(l.week_number, w);
  }

  const nextWeek = Math.max(1, ...lessons.map((l) => l.week_number));

  const header = (
    <>
      <nav className="flex gap-1.5 overflow-x-auto">
        {courses.map((c) => (
          <Link
            key={c.id}
            href={`/teacher/lessons?course=${c.id}`}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold ${
              c.id === course.id ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            {COURSE_SHORT[c.id] ?? c.title}
            {c.status === "preparing" && <span className="ml-1 text-[10px] opacity-80">준비 중</span>}
          </Link>
        ))}
      </nav>
      <section className={`${cardClass} flex flex-wrap items-center justify-between gap-3`}>
        <div>
          <p className="font-bold text-zinc-900">{course.title}</p>
          <p className="text-xs text-zinc-500">
            {course.status === "open"
              ? "학생 화면에 열려 있어요. 공개한 레슨만 보여요."
              : "학생 화면에 '준비 중'으로 보여요. 레슨을 다 올린 뒤 열어주세요."}
          </p>
        </div>
        <form action={setCourseStatus}>
          <input type="hidden" name="course" value={course.id} />
          <input type="hidden" name="status" value={course.status === "open" ? "preparing" : "open"} />
          <SubmitButton className={course.status === "open" ? secondaryButtonClass : primaryButtonClass}>
            {course.status === "open" ? "준비 중으로 바꾸기" : "학생에게 열기"}
          </SubmitButton>
        </form>
      </section>
      <section className={cardClass}>
        <h2 className="mb-1 font-bold text-zinc-900">📄 강의 링크 시트</h2>
        <p className="mb-2 text-xs text-zinc-500">
          시트에 VOD 링크를 넣으면 1시간 안에 학생 화면 영상이 자동으로 바뀌어요 (VOD가 없으면 Live 녹화). 바로 바꾸려면
          &lsquo;지금 반영하기&rsquo;를 눌러주세요. 시트 공유는 &lsquo;링크가 있는 모든 사용자 · 뷰어&rsquo;여야 해요.
        </p>
        <VideoSheetForm course={course.id} sheet={course.video_sheet ?? null} />
      </section>
      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">레슨(Day) 추가</h2>
        <form action={addLesson} className="grid gap-2 sm:grid-cols-2">
          <input type="hidden" name="course" value={course.id} />
          <input name="title" placeholder="레슨 제목 (예: Nice to meet you)" required className={inputClass} />
          <input name="video_url" type="url" placeholder="강의 영상 링크 (유튜브)" className={inputClass} />
          <input
            name="week_number"
            type="number"
            min={1}
            defaultValue={nextWeek}
            placeholder="주차"
            required
            className={inputClass}
          />
          <input name="week_title" placeholder="주차 제목 (새 주차일 때만)" className={inputClass} />
          <SubmitButton className={`${primaryButtonClass} sm:col-span-2`}>
            레슨 추가
          </SubmitButton>
        </form>
        <p className="mt-2 text-xs text-zinc-500">
          맨 뒤에 다음 Day로 추가돼요. 추가한 뒤 레슨을 눌러 쉐도잉 문장을 넣고, &lsquo;공개&rsquo;를 눌러주세요.
        </p>
      </section>
    </>
  );

  if (lessons.length === 0) {
    return (
      <>
        {header}
        <p className="text-sm text-zinc-600">아직 이 과정에 레슨이 없어요. 위에서 첫 레슨을 추가해 보세요.</p>
      </>
    );
  }

  return (
    <>
      {header}
      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">진도 공개</h2>
        <form action={publishUntil} className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="course" value={course.id} />
          <select name="sort_order" className={inputClass} defaultValue="">
            <option value="" disabled>
              어디까지 공개할까요?
            </option>
            {lessons.map((l) => (
              <option key={l.id} value={l.sort_order}>
                Week {l.week_number} · {l.kind === "day" ? `Day ${l.day_number} ${l.title}` : l.title}
              </option>
            ))}
          </select>
          <SubmitButton className={primaryButtonClass}>
            여기까지 공개
          </SubmitButton>
        </form>
        <p className="mt-2 text-xs text-zinc-500">선택한 레슨까지 학생에게 보이고, 이후 레슨은 숨겨져요.</p>
      </section>

      {[...weeks.entries()].map(([weekNumber, week]) => (
        <section key={weekNumber} className="flex flex-col gap-2">
          <h2 className="font-bold text-zinc-900">
            Week {weekNumber} · {week.title}
          </h2>
          <div className="flex flex-col divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-brand-900/5">
            {week.lessons.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-2 px-4 py-2.5">
                <Link href={`/teacher/lessons/${l.id}`} className="flex flex-col hover:underline">
                  <span className="text-xs text-zinc-500">
                    {l.kind === "day" ? `Day ${String(l.day_number).padStart(2, "0")}` : "Drill"} · 문장{" "}
                    {itemCount.get(l.id) ?? 0}개
                  </span>
                  <span className="text-sm font-medium text-zinc-900">{l.title}</span>
                </Link>
                <form action={setPublished}>
                  <input type="hidden" name="id" value={l.id} />
                  <input type="hidden" name="publish" value={String(!l.is_published)} />
                  <button
                    type="submit"
                    className={`${secondaryButtonClass} ${l.is_published ? "border-green-300 text-green-700" : ""}`}
                  >
                    {l.is_published ? "공개중" : "비공개"}
                  </button>
                </form>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-dashed border-zinc-300 p-3">
            <p className="mb-2 text-sm font-semibold text-zinc-700">📹 Week {weekNumber} 수업 영상 (줌 녹화본)</p>
            {recordings
              .filter((r) => r.week_number === weekNumber)
              .map((r) => (
                <div key={r.id} className="mb-2 flex items-center justify-between gap-2 text-sm">
                  <a href={r.video_url} target="_blank" rel="noopener noreferrer" className="truncate underline">
                    {r.title}
                  </a>
                  <form action={deleteRecording}>
                    <input type="hidden" name="id" value={r.id} />
                    <SubmitButton className="text-xs text-red-600">
                      삭제
                    </SubmitButton>
                  </form>
                </div>
              ))}
            <PlaylistImportForm weekNumber={weekNumber} course={course.id} />
            <p className="my-2 text-xs text-zinc-500">또는 영상 하나씩 추가</p>
            <form action={addRecording} className="flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="week_number" value={weekNumber} />
              <input type="hidden" name="course" value={course.id} />
              <input name="title" placeholder="제목 (예: 6기 Week1 라이브)" required className={`${inputClass} flex-1`} />
              <input name="video_url" type="url" placeholder="영상 링크 (유튜브/줌/드라이브)" required className={`${inputClass} flex-1`} />
              <SubmitButton className={secondaryButtonClass}>
                추가
              </SubmitButton>
            </form>
          </div>
        </section>
      ))}
    </>
  );
}
