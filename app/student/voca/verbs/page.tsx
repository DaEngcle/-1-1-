import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { FREE_VERB_SETS, PATTERN_INFO, VERB_SETS } from "@/lib/classroom/verbs";

export default async function VerbSetsPage() {
  const student = await requireStudent();
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("voca_progress")
    .select("deck, stars, best")
    .eq("student_id", student.id)
    .like("deck", "verbs-%");
  const byDeck = new Map((data ?? []).map((r) => [r.deck as string, r]));
  const free = student.courses.length === 0;

  return (
    <>
      <Link href="/student/voca" className="text-sm text-zinc-600 underline">
        ← 보카
      </Link>
      <div>
        <h1 className="text-xl font-extrabold text-zinc-900">🔤 동사 3단변화</h1>
        <p className="text-sm text-zinc-500">원형 – 과거 – 과거분사(p.p.). 세트마다 외우고 → 게임으로 확인해요.</p>
      </div>
      <div className="flex flex-wrap gap-1.5 text-xs">
        {Object.values(PATTERN_INFO).map((p) => (
          <span key={p.label} className={`rounded-full px-2 py-0.5 font-semibold ${p.color}`}>
            {p.label} · {p.tip}
          </span>
        ))}
      </div>
      <section className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {VERB_SETS.map((set) => {
          const p = byDeck.get(`verbs-${set.id}`);
          const locked = free && set.id > FREE_VERB_SETS;
          // 순서대로 잠그지 않는다: 아무 세트나 골라서 할 수 있다 (무료회원만 앞 세트까지)
          const open = !locked;
          const body = (
            <>
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold ${
                  open ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-400"
                }`}
              >
                {locked ? "🔒" : open ? set.id : "🔒"}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="font-bold text-zinc-900">
                  세트 {set.id} · {set.title}
                </span>
                <span className="truncate text-xs text-zinc-500">
                  {set.verbs.slice(0, 4).map((v) => v.base).join(", ")} …
                </span>
                {locked ? (
                  <span className="text-xs font-semibold text-amber-700">수강생 전용이에요</span>
                ) : null}
              </span>
              <span className="ml-auto shrink-0 text-lg tracking-tight">
                {[1, 2, 3].map((n) => (
                  <span key={n} className={n <= (p?.stars ?? 0) ? "" : "opacity-20 grayscale"}>
                    ⭐
                  </span>
                ))}
              </span>
            </>
          );
          return open ? (
            <Link
              key={set.id}
              href={`/student/voca/verbs/${set.id}`}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-transform hover:border-violet-300 active:translate-y-0.5"
            >
              {body}
            </Link>
          ) : (
            <div key={set.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 opacity-80">
              {body}
            </div>
          );
        })}
      </section>
    </>
  );
}
