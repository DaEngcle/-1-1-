"use client";

import { usePref, writePref, type PrefName } from "@/app/_ui/prefs";

const ROWS: { name: PrefName; title: string; sub: string }[] = [
  { name: "showTranslation", title: "쉐도잉 해석 항상 보기", sub: "문장 아래 한국어 해석을 처음부터 펼쳐 둬요" },
  { name: "interviewSubtitles", title: "AI 면접 자막 켜고 시작", sub: "면접관 말을 글로도 보여줘요 (듣기 연습엔 끄기 추천)" },
  { name: "gameSound", title: "게임 효과음", sub: "보카·문법 문제 맞힐 때 소리" },
];

function Row({ name, title, sub }: { name: PrefName; title: string; sub: string }) {
  const on = usePref(name);
  return (
    <li className="flex items-center gap-3 py-3.5">
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-bold text-zinc-900">{title}</span>
        <span className="text-sm text-zinc-500">{sub}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={title}
        onClick={() => writePref(name, !on)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-brand-600" : "bg-zinc-300"}`}
      >
        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </li>
  );
}

/** 학습 설정 스위치 (이 기기에 저장) */
export function SettingsToggles() {
  return (
    <ul className="divide-y divide-zinc-100">
      {ROWS.map((r) => (
        <Row key={r.name} {...r} />
      ))}
    </ul>
  );
}
