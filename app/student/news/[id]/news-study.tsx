"use client";

import { useState, useTransition } from "react";
import { useTts } from "@/app/_ui/audio/use-tts";
import { CatSprite } from "@/app/_ui/cat";
import { useMyCat } from "@/app/_ui/cat-context";
import { markNewsRead } from "../actions";

type Expression = { phrase: string; meaning: string; example: string; example_ko: string; note?: string };
type Quiz = { question: string; choices: string[]; answer: number; explain: string };

function Speak({ text, label = "🔊", slow }: { text: string; label?: string; slow?: boolean }) {
  const { play, playingKey } = useTts();
  const key = `${slow ? "slow" : "normal"}:${text}`;
  return (
    <button
      type="button"
      onClick={() => play(text, slow ? "slow" : "normal")}
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
        playingKey === key ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700 hover:bg-brand-100"
      }`}
    >
      {label}
    </button>
  );
}

/** 요약 듣기 + 해석 보기 */
export function NewsSummary({ en, ko }: { en: string; ko: string }) {
  const [showKo, setShowKo] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Speak text={en} label="🔊 듣기" />
        <Speak text={en} label="🐢 천천히" slow />
        <button
          type="button"
          onClick={() => setShowKo((v) => !v)}
          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-zinc-700"
        >
          {showKo ? "해석 숨기기" : "🇰🇷 해석 보기"}
        </button>
      </div>
      <p className="text-[17px] leading-relaxed text-zinc-900">{en}</p>
      {showKo && <p className="rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-zinc-700">{ko}</p>}
    </div>
  );
}

/** 핵심 표현 카드 */
export function ExpressionList({ items }: { items: Expression[] }) {
  return (
    <ol className="flex flex-col gap-2">
      {items.map((x, i) => (
        <li key={i} className="flex flex-col gap-1 rounded-2xl border border-slate-200 p-3">
          <div className="flex items-start justify-between gap-2">
            <p>
              <b className="text-lg text-brand-700">{x.phrase}</b>{" "}
              <span className="text-sm text-zinc-600">{x.meaning}</span>
            </p>
            <Speak text={x.phrase} />
          </div>
          <div className="flex items-start justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-sm">
              <span className="text-zinc-900">{x.example}</span>
              <br />
              <span className="text-zinc-500">{x.example_ko}</span>
            </p>
            <Speak text={x.example} />
          </div>
          {x.note && <p className="text-xs text-amber-700">💡 {x.note}</p>}
        </li>
      ))}
    </ol>
  );
}

/** 3지선다 미니 퀴즈. 다 풀면 고양이가 반응하고 기록을 남긴다 */
export function NewsQuiz({ newsId, quiz }: { newsId: string; quiz: Quiz[] }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => quiz.map(() => null));
  const [, startTransition] = useTransition();
  const cat = useMyCat();
  const done = picked.every((p) => p !== null);
  const correct = picked.filter((p, i) => p === quiz[i].answer).length;

  function pick(qi: number, ci: number) {
    if (picked[qi] !== null) return;
    const next = picked.map((p, i) => (i === qi ? ci : p));
    setPicked(next);
    if (next.every((p) => p !== null)) {
      const score = (next.filter((p, i) => p === quiz[i].answer).length / quiz.length) * 100;
      startTransition(() => markNewsRead(newsId, score));
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {quiz.map((q, qi) => (
        <div key={qi} className="flex flex-col gap-2">
          <p className="font-bold text-zinc-900">
            Q{qi + 1}. {q.question}
          </p>
          <div className="flex flex-col gap-1.5">
            {q.choices.map((c, ci) => {
              const chosen = picked[qi] === ci;
              const answered = picked[qi] !== null;
              const right = ci === q.answer;
              return (
                <button
                  key={ci}
                  type="button"
                  onClick={() => pick(qi, ci)}
                  disabled={answered}
                  className={`rounded-xl border-2 px-3 py-2 text-left text-sm font-semibold transition-colors ${
                    answered && right
                      ? "border-green-500 bg-green-50 text-green-800"
                      : chosen
                        ? "border-red-400 bg-red-50 text-red-700"
                        : "border-slate-200 bg-white text-zinc-800 hover:border-brand-300"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
          {picked[qi] !== null && <p className="text-xs text-zinc-600">{q.explain}</p>}
        </div>
      ))}
      {done && (
        <div className="flex items-center gap-2 rounded-2xl bg-brand-50 p-3">
          {cat && (
            <CatSprite
              breed={cat.breed}
              mood={correct === quiz.length ? "cheer" : correct > 0 ? "happy" : "sad"}
              className="h-14 w-16 shrink-0"
            />
          )}
          <p className="text-sm font-bold text-brand-700">
            {cat?.name && <span className="block text-[11px] font-semibold text-brand-500">{cat.name}</span>}
            {correct === quiz.length
              ? `${quiz.length}문제 다 맞혔어! 오늘 표현 완벽해 🎉`
              : `${quiz.length}문제 중 ${correct}개 맞혔어! 표현 한 번만 더 읽어보자 💪`}
          </p>
        </div>
      )}
    </div>
  );
}
