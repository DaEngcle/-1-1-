import Link from "next/link";
import {
  createServerSupabaseClient,
  type ClassRecording,
  type Lesson,
} from "@/lib/supabase";
import {
  addRecording,
  deleteRecording,
  publishUntil,
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

export default async function TeacherLessonsPage() {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  const [{ data: lessonRows }, { data: itemRows }, { data: recRows }] = await Promise.all([
    supabase.from("lessons").select("*").order("sort_order"),
    supabase.from("lesson_items").select("lesson_id"),
    supabase.from("class_recordings").select("*").order("created_at"),
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

  if (lessons.length === 0) {
    return (
      <p className="text-sm text-zinc-600">
        레슨이 없어요. 터미널에서 <code className="rounded bg-zinc-100 px-1">npm run seed:bootcamp</code>를
        실행해 부트캠프 60일 커리큘럼을 불러오세요.
      </p>
    );
  }

  return (
    <>
      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">진도 공개</h2>
        <form action={publishUntil} className="flex flex-wrap items-center gap-2">
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
          <button type="submit" className={primaryButtonClass}>
            여기까지 공개
          </button>
        </form>
        <p className="mt-2 text-xs text-zinc-500">선택한 레슨까지 학생에게 보이고, 이후 레슨은 숨겨져요.</p>
      </section>

      {[...weeks.entries()].map(([weekNumber, week]) => (
        <section key={weekNumber} className="flex flex-col gap-2">
          <h2 className="font-bold text-zinc-900">
            Week {weekNumber} · {week.title}
          </h2>
          <div className="flex flex-col divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white">
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
                    <button type="submit" className="text-xs text-red-600">
                      삭제
                    </button>
                  </form>
                </div>
              ))}
            <PlaylistImportForm weekNumber={weekNumber} />
            <p className="my-2 text-xs text-zinc-500">또는 영상 하나씩 추가</p>
            <form action={addRecording} className="flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="week_number" value={weekNumber} />
              <input name="title" placeholder="제목 (예: 6기 Week1 라이브)" required className={`${inputClass} flex-1`} />
              <input name="video_url" type="url" placeholder="영상 링크 (유튜브/줌/드라이브)" required className={`${inputClass} flex-1`} />
              <button type="submit" className={secondaryButtonClass}>
                추가
              </button>
            </form>
          </div>
        </section>
      ))}
    </>
  );
}
