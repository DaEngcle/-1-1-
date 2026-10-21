import Link from "next/link";
import { requireStudent } from "@/lib/classroom/dal";
import { getSeasonRanking, getWeeklyRanking } from "@/lib/classroom/engagement";
import { kstDate } from "@/lib/classroom/stats";
import { nextTier, seasonInfo, tierFor } from "@/lib/classroom/league";
import { TierEmblem } from "@/app/_ui/tier-emblem";
import { RankList, TierLadder } from "@/app/_ui/league";

export default async function LeaguePage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const student = await requireStudent();
  const week = (await searchParams).tab === "week";
  const [season, weekly] = await Promise.all([getSeasonRanking({ masked: true }), getWeeklyRanking({ masked: true })]);
  const me = season.find((r) => r.studentId === student.id);
  const points = me?.xp ?? 0;
  const tier = tierFor(points, me?.rank ?? 99);
  const next = nextTier(points);
  const info = seasonInfo(kstDate(new Date()));

  return (
    <>
      <section
        className="relative flex flex-col items-center gap-1 overflow-hidden rounded-3xl p-5 text-center shadow-lg"
        style={{ background: `linear-gradient(160deg, #1e1b4b 0%, #312e81 55%, ${tier.from} 140%)` }}
      >
        <span className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.25),transparent_70%)]" />
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
          🏆 {info.label} · 종료까지 {info.daysLeft}일
        </span>
        <TierEmblem tier={tier.id} className="h-32 w-32 drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]" />
        <p className="text-3xl font-extrabold text-white">{tier.name}</p>
        <p className="text-sm text-white/80">
          {me ? `시즌 ${me.rank}위 / ${season.length}명 · ${points}P` : "이번 달 첫 포인트를 모아보세요!"}
        </p>
        {next && (
          <div className="mt-2 flex w-full max-w-xs flex-col gap-1">
            <span className="h-3 overflow-hidden rounded-full bg-white/15">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-amber-300 to-pink-300"
                style={{ width: `${Math.max(4, ((points - tier.min) / (next.tier.min - tier.min)) * 100)}%` }}
              />
            </span>
            <span className="text-xs text-white/80">
              {next.tier.name} 승급까지 <b className="text-amber-200">{next.left}P</b>
            </span>
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-[#f3f1ff] p-3">
        <TierLadder current={tier.id} />
      </section>

      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 text-sm font-bold">
        <Link href="/student/league" className={`rounded-xl py-2 text-center ${!week ? "bg-white text-violet-700 shadow-sm" : "text-zinc-500"}`}>
          🏆 이번 시즌
        </Link>
        <Link href="/student/league?tab=week" className={`rounded-xl py-2 text-center ${week ? "bg-white text-violet-700 shadow-sm" : "text-zinc-500"}`}>
          📅 이번 주
        </Link>
      </div>

      <section className="rounded-3xl border border-slate-200/80 bg-white p-2 shadow-sm">
        {(week ? weekly : season).length === 0 ? (
          <p className="p-3 text-sm text-zinc-500">아직 기록이 없어요.</p>
        ) : (
          <RankList rows={week ? weekly : season} meId={student.id} showTier={!week} />
        )}
      </section>

      <section className="rounded-2xl bg-slate-50 p-3 text-xs leading-relaxed text-zinc-600">
        <p className="mb-1 font-bold text-zinc-800">포인트 모으는 법</p>
        🎬 영상 1분 = 1P · 🎤 쉐도잉 제출 = 10P (80점 이상 +5P) · 🎮 보카 맞힌 문제당 2P (하루 100P까지)
        <br />
        매달 1일에 새 시즌이 시작돼요. 이번 달 포인트로 티어가 정해지고, 마스터 점수를 넘긴 시즌 1위는 <b>챌린저</b>!
        <br />
        랭킹 이름은 닉네임으로 보여요.{" "}
        <Link href="/student/profile" className="font-semibold text-violet-600 underline">
          닉네임 바꾸기
        </Link>
      </section>
    </>
  );
}
