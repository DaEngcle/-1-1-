import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { hasFullVoca } from "@/lib/classroom/verbs";
import { FREE_GRAMMAR_UNITS, GRAMMAR_PARTS, grammarDeck, grammarUnit } from "@/lib/classroom/grammar";

export default async function GrammarPage() {
  const student = await requireStudent();
  const { data } = await createServerSupabaseClient()
    .from("voca_progress")
    .select("deck, stars, best")
    .eq("student_id", student.id)
    .like("deck", "grammar-%");
  const byDeck = new Map((data ?? []).map((r) => [r.deck as string, r]));
  const free = !hasFullVoca(student);
  const cleared = (data ?? []).filter((r) => (r.stars ?? 0) > 0).length;

  return (
    <>
      <section className="flex items-center gap-3 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-5 text-white shadow-lg">
        <span className="text-5xl">🐤</span>
        <span className="flex flex-col gap-1">
          <span className="text-xl font-extrabold">기초 문법 20유닛</span>
          <span className="text-sm text-amber-50">
            개념 → 예문 듣기 → 문제 12개. 80점이 넘으면 별을 받아요. 아무 유닛부터 시작해도 돼요.
          </span>
          <span className="text-xs font-bold text-white/90">{cleared}/20 유닛 클리어</span>
        </span>
      </section>

      {GRAMMAR_PARTS.map((part) => (
        <section key={part.title} className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-zinc-500">{part.title}</h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {part.units.map((n) => {
              const u = grammarUnit(n)!;
              const p = byDeck.get(grammarDeck(n));
              const locked = free && n > FREE_GRAMMAR_UNITS;
              const body = (
                <>
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${locked ? "bg-slate-200" : "bg-amber-100"}`}
                  >
                    {locked ? "🔒" : u.emoji}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-xs font-bold text-amber-700">Unit {n}</span>
                    <span className="font-bold leading-snug text-zinc-900">{u.title}</span>
                    {locked ? (
                      <span className="text-xs font-semibold text-amber-700">수강생 전용이에요</span>
                    ) : p ? (
                      <span className="text-xs text-zinc-500">최고 {p.best}점</span>
                    ) : null}
                  </span>
                  <span className="ml-auto shrink-0 text-base tracking-tight">
                    {[1, 2, 3].map((k) => (
                      <span key={k} className={k <= (p?.stars ?? 0) ? "" : "opacity-20 grayscale"}>
                        ⭐
                      </span>
                    ))}
                  </span>
                </>
              );
              return (
                <li key={n}>
                  {locked ? (
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 opacity-80">{body}</div>
                  ) : (
                    <Link
                      href={`/student/grammar/${n}`}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-transform hover:border-amber-300 active:translate-y-0.5"
                    >
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
