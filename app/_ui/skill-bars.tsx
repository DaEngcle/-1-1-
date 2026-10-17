type Skills = { listening: number; grammar: number; pronunciation: number; fluency: number; range: number };

const LABELS: { key: keyof Skills; label: string; hint: string }[] = [
  { key: "listening", label: "듣기", hint: "받아쓰기·대화 이해" },
  { key: "grammar", label: "문법·어휘", hint: "자연스러운 대답·빈칸" },
  { key: "pronunciation", label: "발음", hint: "말하기 발음 정확도" },
  { key: "fluency", label: "유창성", hint: "끊기지 않고 말하기" },
  { key: "range", label: "말한 양", hint: "다양한 단어로 길게" },
];

/** 5가지 실력 막대. previous가 있으면 수강 전(회색) 위에 수강 후(파랑)를 겹쳐 보여준다 */
export function SkillBars({ current, previous }: { current: Skills; previous?: Skills | null }) {
  return (
    <div className="flex flex-col gap-2.5">
      {LABELS.map(({ key, label, hint }) => {
        const now = current[key] ?? 0;
        const before = previous?.[key];
        const diff = before == null ? null : now - before;
        return (
          <div key={key} className="grid grid-cols-[5.5rem_1fr_3.5rem] items-center gap-2 text-sm">
            <span className="flex flex-col leading-tight">
              <span className="font-semibold text-zinc-800">{label}</span>
              <span className="text-[10px] text-zinc-400">{hint}</span>
            </span>
            <span className="relative h-3 overflow-hidden rounded-full bg-slate-100">
              {before != null && (
                <span className="absolute inset-y-0 left-0 rounded-full bg-slate-300" style={{ width: `${before}%` }} />
              )}
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-brand-500/90"
                style={{ width: `${now}%`, opacity: before != null ? 0.85 : 1 }}
              />
            </span>
            <span className="text-right font-bold text-zinc-900">
              {now}
              {diff != null && (
                <span className={`ml-0.5 text-[11px] ${diff >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {diff >= 0 ? `+${diff}` : diff}
                </span>
              )}
            </span>
          </div>
        );
      })}
      {previous && (
        <p className="text-[11px] text-zinc-400">
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-slate-300" />
          수강 전 <span className="mr-1 ml-2 inline-block h-2 w-2 rounded-full bg-brand-500" />
          수강 후
        </p>
      )}
    </div>
  );
}
