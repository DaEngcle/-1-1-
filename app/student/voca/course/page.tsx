import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { getVocaCourses } from "@/lib/classroom/course-voca";

export default async function CourseVocaPage() {
  const student = await requireStudent();
  const supabase = createServerSupabaseClient();
  const [courses, { data }] = await Promise.all([
    getVocaCourses(student),
    supabase.from("voca_progress").select("deck, stars").eq("student_id", student.id).like("deck", "course-%"),
  ]);
  const stars = new Map((data ?? []).map((r) => [r.deck as string, r.stars as number]));

  return (
    <>
      <Link href="/student/voca" className="text-sm text-zinc-600 underline">
        ← 보카
      </Link>
      <div>
        <h1 className="text-xl font-extrabold text-zinc-900">📚 과정별 단어</h1>
        <p className="text-sm text-zinc-500">수업에서 쉐도잉한 문장으로 복습해요. 주차를 골라 10문제씩!</p>
      </div>
      {courses.map((c) => (
        <section key={c.id} className="flex flex-col gap-2">
          <h2 className="font-bold text-zinc-900">{c.title}</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {c.weeks.map((w) => {
              const s = stars.get(`course-${c.id}-w${w.week}`) ?? 0;
              const label = (
                <>
                  <span className="font-extrabold text-zinc-900">{w.week}주차</span>
                  {w.title && <span className="truncate text-xs text-zinc-500">{w.title}</span>}
                  <span className="text-sm tracking-tight">
                    {[1, 2, 3].map((n) => (
                      <span key={n} className={n <= s ? "" : "opacity-20 grayscale"}>
                        ⭐
                      </span>
                    ))}
                  </span>
                </>
              );
              return w.open && w.sentences >= 4 ? (
                <Link
                  key={w.week}
                  href={`/student/voca/course/${c.id}/${w.week}`}
                  className="flex flex-col gap-0.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm hover:border-violet-300"
                >
                  {label}
                  <span className="text-[11px] text-violet-600">문장 {w.sentences}개</span>
                </Link>
              ) : (
                <div key={w.week} className="flex flex-col gap-0.5 rounded-2xl border border-slate-200 bg-slate-50 p-3 opacity-60">
                  {label}
                  <span className="text-[11px] text-zinc-500">🔒 수강생 전용</span>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
