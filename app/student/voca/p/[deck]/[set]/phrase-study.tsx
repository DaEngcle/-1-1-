"use client";

import { useState } from "react";
import { useTts } from "@/app/_ui/audio/use-tts";
import type { Phrase } from "@/lib/classroom/phrase-decks";
import { QuizGame, shuffle, type QuizQuestion } from "../../../quiz-game";

function buildQuestions(items: Phrase[], label: string, only?: string[]): QuizQuestion[] {
  const picked = only ? items.filter((x) => only.includes(x.term)) : shuffle(items);
  return picked.map((x) => {
    const others = shuffle(items.filter((o) => o.term !== x.term)).slice(0, 3);
    const kind = Math.floor(Math.random() * 3);
    const review = `${x.term} = ${x.ko} · ${x.example}`;
    if (kind === 0) {
      return {
        key: x.term,
        label: `${label} · 뜻 고르기`,
        prompt: x.term,
        hint: "이 표현의 뜻은?",
        answer: x.ko,
        choices: shuffle([x.ko, ...others.map((o) => o.ko)]),
        speak: x.term,
        review,
        note: x.note,
      };
    }
    if (kind === 1) {
      return {
        key: x.term,
        label: `${label} · 영어로 말하면?`,
        prompt: `“${x.ko}”`,
        hint: "영어로는 뭐라고 할까요?",
        answer: x.term,
        choices: shuffle([x.term, ...others.map((o) => o.term)]),
        speak: x.term,
        review,
      };
    }
    // 예문 빈칸
    const at = x.example.toLowerCase().indexOf(x.term.toLowerCase());
    return {
      key: x.term,
      label: `${label} · 빈칸 채우기`,
      ...(at >= 0
        ? { blank: { before: x.example.slice(0, at), after: x.example.slice(at + x.term.length) } }
        : { prompt: x.example }),
      hint: `💬 ${x.example_ko}`,
      answer: x.term,
      choices: shuffle([x.term, ...others.map((o) => o.term)]),
      speak: x.example,
      review,
    };
  });
}

export function PhraseStudy({
  deckId,
  quizLabel,
  setId,
  items,
  nextHref,
}: {
  deckId: string;
  quizLabel: string;
  setId: number;
  items: Phrase[];
  nextHref: string | null;
}) {
  const [mode, setMode] = useState<"study" | "game">("study");
  const [hide, setHide] = useState(false);
  const [shown, setShown] = useState<Set<string>>(new Set());
  const { play } = useTts();

  return (
    <>
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 text-sm font-bold">
        {(["study", "game"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-xl py-2 ${mode === m ? "bg-white text-teal-700 shadow-sm" : "text-zinc-500"}`}
          >
            {m === "study" ? "📖 외우기" : "🎮 게임"}
          </button>
        ))}
      </div>
      {mode === "game" ? (
        <QuizGame key={setId} deck={`${deckId}-${setId}`} nextHref={nextHref} build={(only) => buildQuestions(items, quizLabel, only)} />
      ) : (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-zinc-500">🔊로 듣고 예문까지 소리 내서 따라 해보세요.</p>
            <button
              type="button"
              onClick={() => {
                setHide((h) => !h);
                setShown(new Set());
              }}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${hide ? "bg-teal-600 text-white" : "bg-teal-50 text-teal-700"}`}
            >
              🙈 뜻 가리기
            </button>
          </div>
          {items.map((x) => (
            <div key={x.term} className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <b className="text-lg text-teal-700">{x.term}</b>
                {hide && !shown.has(x.term) ? (
                  <button
                    type="button"
                    onClick={() => setShown((s) => new Set(s).add(x.term))}
                    className="rounded-lg bg-slate-200 px-2 py-0.5 text-sm font-bold text-slate-400"
                  >
                    뜻 보기
                  </button>
                ) : (
                  <span className="text-sm text-zinc-600">{x.ko}</span>
                )}
                <button
                  type="button"
                  onClick={() => play(x.term)}
                  className="ml-auto rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700"
                >
                  🔊
                </button>
              </div>
              <button
                type="button"
                onClick={() => play(x.example, "slow")}
                className="flex items-start justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-left text-sm"
              >
                <span>
                  <span className="text-zinc-900">{x.example}</span>
                  <br />
                  <span className="text-zinc-500">{x.example_ko}</span>
                </span>
                <span>🔊</span>
              </button>
              {x.note && <p className="text-xs text-amber-700">💡 {x.note}</p>}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setMode("game")}
            className="mt-1 rounded-2xl border-b-4 border-teal-800 bg-teal-600 py-3 text-lg font-extrabold text-white active:translate-y-0.5 active:border-b-2"
          >
            다 외웠어요 → 🎮 게임 시작
          </button>
        </section>
      )}
    </>
  );
}
