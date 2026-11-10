import Link from "next/link";

// STEP 목록: 세로 점선 + 동그라미 + 알약 줄. 지금 할 것 하나는 카드로 펼쳐서 '시작하기'

export type TimelineItem = {
  id: string;
  emoji: string;
  title: string;
  desc?: string;
  /** 작게: 종류·시간 */
  tag?: string;
  href: string;
  done: boolean;
  stars?: number;
  locked?: boolean;
};

export type TimelineSection = { title: string; sub?: string; items: TimelineItem[] };

function Circle({ done, current }: { done: boolean; current: boolean }) {
  return (
    <span
      className={`relative z-[1] mt-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-black ${
        done ? "border-brand-600 bg-brand-600 text-white" : current ? "border-brand-600 bg-white" : "border-slate-300 bg-white"
      }`}
    >
      {done ? "✓" : ""}
    </span>
  );
}

export function StepTimeline({ sections, currentId }: { sections: TimelineSection[]; currentId?: string | null }) {
  return (
    <div className="flex flex-col gap-5">
      {sections.map((sec) => (
        <section key={sec.title} className="flex flex-col gap-1">
          <h3 className="text-sm font-extrabold text-zinc-800">
            {sec.title}
            {sec.sub && <span className="ml-1 font-semibold text-zinc-400">{sec.sub}</span>}
          </h3>
          <ol className="relative flex flex-col gap-2 pl-0">
            <span aria-hidden className="absolute bottom-4 left-[9px] top-4 border-l-2 border-dotted border-slate-300" />
            {sec.items.map((it) => {
              const current = it.id === currentId;
              return (
                <li key={it.id} className="flex items-start gap-3">
                  <Circle done={it.done} current={current} />
                  {current && !it.locked ? (
                    <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-3xl border-2 border-brand-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-2xl">{it.emoji}</span>
                        <span className="flex min-w-0 flex-col">
                          <span className="font-extrabold text-zinc-900">{it.title}</span>
                          {it.tag && <span className="text-xs text-zinc-500">{it.tag}</span>}
                        </span>
                      </div>
                      {it.desc && <p className="text-sm text-zinc-600">{it.desc}</p>}
                      <Link href={it.href} className="rounded-2xl bg-brand-600 py-3 text-center text-base font-extrabold text-white active:translate-y-0.5">
                        시작하기
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={it.locked ? "#" : it.href}
                      aria-disabled={it.locked}
                      className={`flex min-w-0 flex-1 items-center gap-3 rounded-full border px-2 py-2 pr-4 ${
                        it.done ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-white"
                      } ${it.locked ? "pointer-events-none opacity-50" : "active:translate-y-0.5"}`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-sm ring-1 ring-slate-100">
                        {it.locked ? "🔒" : it.emoji}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className={`truncate text-sm font-bold ${it.done ? "text-zinc-500" : "text-zinc-900"}`}>{it.title}</span>
                        {it.tag && <span className="truncate text-[11px] text-zinc-400">{it.tag}</span>}
                      </span>
                      {it.stars !== undefined && it.stars > 0 && <span className="shrink-0 text-xs">{"⭐".repeat(it.stars)}</span>}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
