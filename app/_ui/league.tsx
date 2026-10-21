import Link from "next/link";
import type { RankRow } from "@/lib/classroom/engagement";
import { TIERS, nextTier, tierFor, type TierId } from "@/lib/classroom/league";
import { isCatBreed } from "@/lib/classroom/cat";
import { CatSprite } from "./cat";
import { TierEmblem } from "./tier-emblem";

export function Avatar({ breed, className = "h-9 w-11" }: { breed: string | null; className?: string }) {
  return isCatBreed(breed) ? (
    <CatSprite breed={breed} className={className} />
  ) : (
    <span className={`${className} flex items-center justify-center rounded-xl bg-slate-100 text-lg`}>🐾</span>
  );
}

/** 랭킹 줄 (시즌·주간 공용) */
export function RankList({ rows, meId, showTier = true }: { rows: RankRow[]; meId?: string; showTier?: boolean }) {
  const medal = (rank: number) => (rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : String(rank));
  return (
    <ol className="flex flex-col">
      {rows.map((r) => {
        const tier = tierFor(r.xp, r.rank);
        const me = r.studentId === meId;
        return (
          <li
            key={r.studentId}
            className={`flex items-center gap-2 border-b border-slate-100 px-2 py-2 last:border-0 ${
              me ? "rounded-2xl border-0 bg-violet-50 ring-2 ring-violet-300" : ""
            }`}
          >
            <span className={`w-7 text-center ${r.rank <= 3 ? "text-xl" : "text-sm font-bold text-zinc-400"}`}>{medal(r.rank)}</span>
            <Avatar breed={r.catBreed} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-bold text-zinc-900">
                {r.name}
                {me && <span className="ml-1 text-xs text-violet-600">나</span>}
              </span>
              {showTier && (
                <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: tier.ink }}>
                  <TierEmblem tier={tier.id} className="h-4 w-4" />
                  {tier.name}
                </span>
              )}
            </span>
            <span className="shrink-0 font-extrabold text-zinc-700">
              {r.xp.toLocaleString()}
              <span className="ml-0.5 text-xs font-semibold text-zinc-400">P</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** 홈에 놓는 작은 리그 카드 */
export function LeagueCard({ rows, meId }: { rows: RankRow[]; meId: string }) {
  const me = rows.find((r) => r.studentId === meId);
  const points = me?.xp ?? 0;
  const tier = tierFor(points, me?.rank ?? 99);
  const next = nextTier(points);
  return (
    <Link
      href="/student/league"
      className="flex flex-col gap-3 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm transition-transform active:translate-y-0.5"
    >
      <div className="flex items-center gap-3">
        <TierEmblem tier={tier.id} className="h-16 w-16 shrink-0 drop-shadow" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs font-semibold text-zinc-500">이번 달 리그</span>
          <span className="text-xl font-extrabold" style={{ color: tier.ink }}>
            {tier.name}
          </span>
          <span className="text-xs text-zinc-500">
            {me ? `${me.rank}위 / ${rows.length}명 · ${points}P` : "아직 기록이 없어요"}
          </span>
        </div>
        <span className="text-xl text-violet-500">→</span>
      </div>
      {next && (
        <div className="flex flex-col gap-1">
          <span className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
              style={{ width: `${Math.max(4, ((points - tier.min) / (next.tier.min - tier.min)) * 100)}%` }}
            />
          </span>
          <span className="text-[11px] text-zinc-500">
            {next.tier.name}까지 <b className="text-violet-600">{next.left}P</b>
          </span>
        </div>
      )}
      <div className="flex items-center gap-1">
        {rows.slice(0, 3).map((r) => (
          <span key={r.studentId} className="flex min-w-0 flex-1 items-center gap-1 rounded-xl bg-slate-50 px-1.5 py-1">
            <span className="text-sm">{r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : "🥉"}</span>
            <Avatar breed={r.catBreed} className="h-6 w-7" />
            <span className="truncate text-[11px] font-semibold text-zinc-700">{r.name}</span>
          </span>
        ))}
      </div>
    </Link>
  );
}

export function TierLadder({ current }: { current: TierId }) {
  const at = TIERS.findIndex((t) => t.id === current);
  return (
    <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
      {TIERS.map((t, i) => (
        <div key={t.id} className={`flex w-16 shrink-0 flex-col items-center gap-0.5 rounded-2xl py-1.5 ${t.id === current ? "bg-white shadow ring-2 ring-violet-300" : ""}`}>
          <TierEmblem tier={t.id} className="h-10 w-10" dim={i > at} />
          <span className={`text-[10px] font-bold ${i > at ? "text-zinc-400" : ""}`} style={i > at ? undefined : { color: t.ink }}>
            {t.name}
          </span>
          <span className="text-[9px] text-zinc-400">{t.id === "challenger" ? "시즌 1위" : `${t.min}P`}</span>
        </div>
      ))}
    </div>
  );
}
