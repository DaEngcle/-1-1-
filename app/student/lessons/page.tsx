import Link from "next/link";
import { createServerSupabaseClient, type Lesson } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";

export default async function StudentLessonsPage() {
  const student = await requireStudent();
  const supabase = createServerSupabaseClient();

  const [{ data: lessonRows }, { data: itemRows }, { data: subRows }, { data: progressRows }] = await Promise.all([
    supabase
      .from("lessons")
      .select("id, sort_order, week_number, week_title, kind, day_number, title, video_url")
      .eq("is_published", true)
      .order("sort_order"),
    supabase.from("lesson_items").select("id, lesson_id"),
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
      <p className="text-sm text-zinc-500">
        아직 공개된 레슨이 없어요. 수업이 시작되면 여기서 복습할 수 있어요!
      </p>
    );
  }

  return (
    <>
      <h1 className="text-xl font-bold text-zinc-900">📘 60일 워홀영어 부트캠프</h1>
      {[...weeks.entries()].map(([weekNumber, week]) => (
        <section key={weekNumber} className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-zinc-500">
            Week {weekNumber} · {week.title}
          </h2>
          <div className="flex flex-col divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white">
            {week.lessons.map((l) => {
              const items = itemsByLesson.get(l.id) ?? [];
              const done = items.filter((id) => practiced.has(id)).length;
              return (
                <Link
                  key={l.id}
                  href={`/student/lessons/${l.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-yellow-50"
                >
                  <span className="flex flex-col">
                    <span className="text-xs text-zinc-500">
                      {l.kind === "day" ? `Day ${String(l.day_number).padStart(2, "0")}` : "Drill"}
                    </span>
                    <span className="font-medium text-zinc-900">
                      {l.kind === "day" ? l.title : "주간 복습 드릴"}
                    </span>
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
