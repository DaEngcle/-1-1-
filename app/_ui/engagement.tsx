import type { Badge, Engagement, RankRow } from "@/lib/classroom/engagement";
import { cardClass } from "@/app/_ui/styles";

const BADGE_ICONS: Record<string, string> = {
  first: "👣",
  streak3: "🔥",
  streak7: "🔥",
  streak30: "🏆",
  video1: "🎬",
  week: "🏅",
  score80: "🎯",
  score90: "💯",
  sub10: "🎤",
  sub50: "🎙",
  test: "📈",
  levelup: "🚀",
};

/** 별 메달 (공부한 날) */
function StarCoin({ strong }: { strong: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full drop-shadow-sm">
      <defs>
        <linearGradient id={strong ? "coin-strong" : "coin-soft"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={strong ? "#FFD84D" : "#BFE9FF"} />
          <stop offset="0.55" stopColor={strong ? "#FFB86B" : "#A8C8FF"} />
          <stop offset="1" stopColor={strong ? "#F49BD6" : "#C7B5FF"} />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill={`url(#${strong ? "coin-strong" : "coin-soft"})`} />
      <circle cx="20" cy="20" r="13.5" fill="#fff" opacity="0.9" />
      <path
        d="M20 10.5l2.9 6 6.5.9-4.7 4.5 1.1 6.5L20 25.3l-5.8 3.1 1.1-6.5-4.7-4.5 6.5-.9z"
        fill={strong ? "#FFC53D" : "#8FB7FF"}
        stroke={strong ? "#F59E0B" : "#6C8EF5"}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StudyCalendar({
  month,
  streak,
  bestStreak,
  totalDays,
  tier,
}: {
  month: Engagement["month"];
  streak?: number;
  bestStreak?: number;
  totalDays?: number;
  /** 현재 리그 (학생 홈에서만) */
  tier?: React.ReactNode;
}) {
  const past = month.days.filter((d) => !d.future);
  const perfect = past.length > 0 && past.every((d) => d.level > 0);
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-[#fffaf0] shadow-sm">
      <div className="flex items-center justify-between px-4 pt-4">
        <div>
          <p className="text-xs font-semibold text-zinc-500">학습 달력</p>
          <p className="text-3xl font-extrabold text-zinc-900">{month.label}</p>
        </div>
        {perfect ? (
          <span className="rounded-full bg-gradient-to-r from-amber-400 to-pink-400 px-3 py-1 text-xs font-extrabold text-white shadow">
            🏅 PERFECT
          </span>
        ) : (
          <span className="text-xs text-zinc-500">이번 달 {month.studiedDays}일 공부</span>
        )}
      </div>
      <div className="m-3 grid grid-cols-7 gap-1.5 rounded-2xl bg-white p-3 text-center">
        {["월", "화", "수", "목", "금", "토", "일"].map((d) => (
          <span key={d} className="text-[11px] font-semibold text-zinc-400">
            {d}
          </span>
        ))}
        {Array.from({ length: month.firstWeekday }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {month.days.map((d) => (
          <span
            key={d.day}
            title={d.level === 2 ? "쉐도잉까지 완료" : d.level === 1 ? "공부함" : undefined}
            className="relative flex aspect-square items-center justify-center text-[11px]"
          >
            {d.level > 0 ? (
              <StarCoin strong={d.level === 2} />
            ) : (
              <span className={d.future ? "text-zinc-200" : "text-zinc-400"}>{Number(d.day.slice(8))}</span>
            )}
            {d.attended && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" title="수업 출석" />}
          </span>
        ))}
      </div>
      {streak != null && (
        <div className="grid grid-cols-3 divide-x divide-amber-100 border-t border-amber-100 bg-white/70 py-3 text-center">
          <div className="flex flex-col items-center justify-center gap-0.5">
            {tier ?? <span className="text-2xl">🔥</span>}
            <span className="text-[11px] text-zinc-500">현재 리그</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            {streak > 0 && streak >= (bestStreak ?? 0) && (
              <span className="text-[10px] font-bold text-violet-500">신기록!</span>
            )}
            <span className="text-3xl font-extrabold text-violet-600">{streak}</span>
            <span className="text-[11px] text-zinc-500">연속 학습일</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-zinc-700">{totalDays ?? 0}</span>
            <span className="text-[11px] text-zinc-500">총 학습일</span>
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-3 px-4 pb-3 text-[11px] text-zinc-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3.5 w-3.5">
            <StarCoin strong={false} />
          </span>
          공부함
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3.5 w-3.5">
            <StarCoin strong />
          </span>
          쉐도잉까지
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          수업 출석
        </span>
      </div>
    </section>
  );
}

export function Missions({ missions }: { missions: Engagement["missions"] }) {
  const done = missions.filter((m) => m.done).length;
  return (
    <section className={cardClass}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-bold text-zinc-900">오늘의 미션</h2>
        <span className={`text-xs ${done === missions.length ? "font-semibold text-emerald-700" : "text-zinc-500"}`}>
          {done === missions.length ? "🎉 오늘 미션 완료!" : `${done}/${missions.length}`}
        </span>
      </div>
      <ul className="flex flex-col gap-1.5 text-sm">
        {missions.map((m) => (
          <li key={m.label} className={m.done ? "text-zinc-900" : "text-zinc-500"}>
            {m.done ? "✅" : "⬜️"} {m.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Badges({ badges }: { badges: Badge[] }) {
  return (
    <section className={cardClass}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-bold text-zinc-900">배지</h2>
        <span className="text-xs text-zinc-500">
          {badges.filter((b) => b.earned).length}/{badges.length}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center sm:grid-cols-6">
        {badges.map((b) => (
          <div key={b.id} title={b.hint} className="flex flex-col items-center gap-1">
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full text-xl ${
                b.earned ? "bg-amber-100 ring-2 ring-amber-300" : "border border-dashed border-zinc-300 bg-zinc-50 grayscale opacity-40"
              }`}
            >
              {b.earned ? BADGE_ICONS[b.id] : "🔒"}
            </span>
            <span className={`text-[11px] leading-tight ${b.earned ? "text-zinc-800" : "text-zinc-400"}`}>{b.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function WeeklyRanking({ rows, meId, limit = 5 }: { rows: RankRow[]; meId?: string; limit?: number }) {
  const top = rows.slice(0, limit);
  const me = meId ? rows.find((r) => r.studentId === meId) : undefined;
  const medal = (rank: number) => (rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}`);
  return (
    <section className={cardClass}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-bold text-zinc-900">이번 주 랭킹</h2>
        {meId ? (
          <a href="/student/profile" className="text-xs font-semibold text-brand-600 underline">
            닉네임 바꾸기
          </a>
        ) : (
          <span className="text-[11px] text-zinc-500">실명 (닉네임)</span>
        )}
      </div>
      <p className="mb-2 text-[11px] text-zinc-500">영상 1분 = 1P · 쉐도잉 제출 = 10P · 80점 이상 +5P</p>
      {rows.length === 0 ? (
        <p className="text-sm text-zinc-500">아직 기록이 없어요.</p>
      ) : (
        <ol className="flex flex-col gap-1 text-sm">
          {top.map((r) => (
            <li
              key={r.studentId}
              className={`flex items-center justify-between rounded-lg px-2 py-1 ${
                r.studentId === meId ? "bg-brand-50 font-semibold text-brand-800 ring-1 ring-brand-200" : ""
              }`}
            >
              <span>
                <span className="inline-block w-7 text-center">{medal(r.rank)}</span>
                {r.name}
                {r.studentId === meId && " (나)"}
              </span>
              <span className="text-zinc-600">{r.xp}P</span>
            </li>
          ))}
          {me && !top.some((r) => r.studentId === meId) && (
            <li className="flex items-center justify-between rounded-lg bg-brand-50 px-2 py-1 font-semibold text-brand-800 ring-1 ring-brand-200">
              <span>
                <span className="inline-block w-7 text-center">{me.rank}</span>
                {me.name} (나)
              </span>
              <span className="text-zinc-600">{me.xp}P</span>
            </li>
          )}
        </ol>
      )}
    </section>
  );
}
