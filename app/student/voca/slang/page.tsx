import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { SLANG_SETS } from "@/lib/classroom/slang";
import { FREE_VERB_SETS } from "@/lib/classroom/verbs";

export default async function SlangSetsPage() {
  const student = await requireStudent();
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("voca_progress").select("deck, stars").eq("student_id", student.id).like("deck", "slang-%");
  const stars = new Map((data ?? []).map((r) => [r.deck as string, r.stars as number]));
  const free = student.courses.length === 0;

  return (
    <>
      <Link href="/student/voca" className="text-sm text-zinc-600 underline">
        ← 보카
      </Link>
      <div>
        <h1 className="text-xl font-extrabold text-zinc-900">🦘 호주 슬랭</h1>
        <p className="text-sm text-zinc-500">arvo, servo, no worries… 호주 사람들이 진짜 매일 쓰는 말 60개.</p>
      </div>
      <section className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SLANG_SETS.map((set) => {
          const locked = free && set.id > FREE_VERB_SETS;
          const s = stars.get(`slang-${set.id}`) ?? 0;
          const body = (
            <>
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${locked ? "bg-slate-200" : "bg-teal-100"}`}>
                {locked ? "🔒" : set.emoji}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="font-bold text-zinc-900">
                  세트 {set.id} · {set.title}
                </span>
                <span className="truncate text-xs text-zinc-500">{set.items.slice(0, 4).map((x) => x.term).join(", ")} …</span>
                {locked && <span className="text-xs font-semibold text-amber-700">수강생 전용이에요</span>}
              </span>
              <span className="ml-auto shrink-0 text-lg tracking-tight">
                {[1, 2, 3].map((n) => (
                  <span key={n} className={n <= s ? "" : "opacity-20 grayscale"}>
                    ⭐
                  </span>
                ))}
              </span>
            </>
          );
          return locked ? (
            <div key={set.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 opacity-80">
              {body}
            </div>
          ) : (
            <Link
              key={set.id}
              href={`/student/voca/slang/${set.id}`}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm hover:border-teal-300"
            >
              {body}
            </Link>
          );
        })}
      </section>
    </>
  );
}
