import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { DAILY_LIMIT, SCENARIOS } from "@/lib/classroom/interview-scenarios";
import { aiReady } from "@/lib/classroom/interview-ai";
import { kstDate } from "@/lib/classroom/stats";
import { Interviewer } from "@/app/_ui/interviewer";

const LEVEL_COLOR: Record<string, string> = {
  쉬움: "bg-green-50 text-green-700",
  보통: "bg-amber-50 text-amber-700",
  어려움: "bg-red-50 text-red-700",
};

export default async function TalkPage() {
  const student = await requireStudent();
  const supabase = createServerSupabaseClient();
  const todayStart = new Date(`${kstDate(new Date())}T00:00:00+09:00`).toISOString();
  const [{ count }, { data: done }] = await Promise.all([
    supabase.from("interview_sessions").select("id", { count: "exact", head: true }).eq("student_id", student.id).gte("created_at", todayStart),
    supabase.from("interview_sessions").select("scenario, feedback").eq("student_id", student.id).not("feedback", "is", null),
  ]);
  const limit = student.courses.length === 0 ? DAILY_LIMIT.free : DAILY_LIMIT.student;
  const best = new Map<string, number>();
  for (const d of done ?? []) {
    const score = (d.feedback as { score?: number } | null)?.score ?? 0;
    best.set(d.scenario as string, Math.max(best.get(d.scenario as string) ?? 0, score));
  }
  const ready = aiReady();

  return (
    <>
      <section className="flex flex-col gap-1 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 p-5 text-white shadow-lg">
        <h1 className="text-2xl font-extrabold">🎭 AI 면접·대화 연습</h1>
        <p className="text-sm text-white/85">
          호주 현지 매니저 캐릭터와 진짜처럼 말로 면접을 봐요. 끝나면 점수와 &lsquo;이렇게 말하면 더 좋아요&rsquo; 코칭이 나와요.
        </p>
        <p className="mt-1 text-xs font-semibold text-white/90">
          {ready ? `오늘 ${Math.max(0, limit - (count ?? 0))}번 남았어요 (하루 ${limit}번)` : "🛠 AI 연결 준비 중이에요. 곧 열려요!"}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SCENARIOS.map((s) => (
          <Link
            key={s.id}
            href={`/student/talk/${s.id}`}
            className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition-transform hover:border-sky-300 active:translate-y-0.5"
          >
            <Interviewer look={s.look} className="h-24 w-24 shrink-0" />
            <span className="flex min-w-0 flex-col gap-1">
              <span className="font-extrabold text-zinc-900">
                {s.emoji} {s.title}
              </span>
              <span className="text-xs text-zinc-500">
                {s.name} · {s.roleKo}
              </span>
              <span className="flex flex-wrap items-center gap-1 text-[11px]">
                <span className={`rounded-full px-2 py-0.5 font-semibold ${LEVEL_COLOR[s.level]}`}>{s.level}</span>
                {best.has(s.id) && (
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 font-bold text-sky-700">최고 {best.get(s.id)}점</span>
                )}
              </span>
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
