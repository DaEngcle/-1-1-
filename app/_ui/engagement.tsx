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

export function StudyCalendar({ month }: { month: Engagement["month"] }) {
  return (
    <section className={cardClass}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-bold text-zinc-900">{month.label} 학습 달력</h2>
        <span className="text-xs text-zinc-500">이번 달 {month.studiedDays}일 공부</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["월", "화", "수", "목", "금", "토", "일"].map((d) => (
          <span key={d} className="text-[11px] text-zinc-400">
            {d}
          </span>
        ))}
        {Array.from({ length: month.firstWeekday }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {month.days.map((d) => (
          <span
            key={d.day}
            title={d.level === 2 ? "쉐도잉 제출" : d.level === 1 ? "영상 시청" : undefined}
            className={`relative flex aspect-square items-center justify-center rounded text-[11px] ${
              d.level === 2
                ? "bg-emerald-600 font-semibold text-white"
                : d.level === 1
                  ? "bg-emerald-200 text-emerald-900"
                  : d.future
                    ? "border border-dashed border-zinc-200 text-zinc-300"
                    : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {Number(d.day.slice(8))}
            {d.attended && <span className="absolute right-0.5 top-0 text-[9px]">✓</span>}
          </span>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-zinc-500">
        <span>
          <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-emerald-200 align-middle" />
          영상 시청
        </span>
        <span>
          <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-emerald-600 align-middle" />
          쉐도잉 제출
        </span>
        <span>✓ 수업 출석</span>
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
