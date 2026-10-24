"use client";

import { useState } from "react";
import { useTts } from "@/app/_ui/audio/use-tts";
import { VideoEmbed } from "@/app/_ui/video-embed";
import { QuizGame, shuffle, type QuizQuestion } from "@/app/student/voca/quiz-game";
import { grammarDeck, type GrammarQuiz, type GrammarUnit } from "@/lib/classroom/grammar";

const STEPS = ["📺 강의", "① 개념", "② 예문", "③ 문제"] as const;

/** 문법 문제 → 보카 게임 문제 형식 */
function toQuestion(q: GrammarQuiz, i: number): QuizQuestion {
  const key = String(i);
  const choices = shuffle(q.choices);
  if (q.type === "blank") {
    const [before, after = ""] = q.sentence.split("___");
    return {
      key,
      label: "빈칸 채우기",
      blank: { before, after },
      hint: q.ko,
      answer: q.answer,
      choices,
      speak: q.sentence.replace("___", q.answer),
      review: q.why,
    };
  }
  if (q.type === "translate") {
    return { key, label: "영어로 하면?", prompt: q.ko, answer: q.answer, choices, speak: q.answer, review: q.why };
  }
  return { key, label: "틀린 곳 찾기", prompt: q.prompt, answer: q.answer, choices, speak: q.answer, review: q.why };
}

export function GrammarStudy({ unit, nextUnit }: { unit: GrammarUnit; nextUnit: number | null }) {
  const [step, setStep] = useState(0);
  const [showKo, setShowKo] = useState<Record<number, boolean>>({});
  const { play, playingKey } = useTts();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-1 rounded-2xl bg-amber-50 p-1">
        {STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(i)}
            className={`rounded-xl py-2 text-sm font-bold ${step === i ? "bg-white text-amber-700 shadow-sm" : "text-amber-800/60"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {step === 0 && (
        <section className="flex flex-col gap-3">
          <VideoEmbed url={unit.video} title={`Unit ${unit.unit} · ${unit.lecture}`} />
          <p className="text-sm text-zinc-600">다니엘 쌤 강의를 먼저 보고, 개념 → 예문 → 문제로 복습해요.</p>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="rounded-2xl border-b-4 border-amber-700 bg-amber-500 py-3 text-lg font-extrabold text-white active:translate-y-0.5 active:border-b-2"
          >
            강의 다 봤어요 → 개념 정리
          </button>
        </section>
      )}

      {step === 1 && (
        <section className="flex flex-col gap-3">
          <p className="rounded-2xl bg-amber-100 p-3 text-sm font-semibold text-amber-900">🎯 {unit.goal}</p>
          {unit.formula.length > 0 && (
            <div className="rounded-2xl bg-zinc-900 p-4 font-mono text-sm leading-relaxed text-amber-200">
              {unit.formula.map((f) => (
                <p key={f}>{f}</p>
              ))}
            </div>
          )}
          {unit.points.map((p, i) => (
            <article key={p.title} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="font-bold text-zinc-900">
                <span className="mr-1 text-amber-600">{i + 1}.</span>
                {p.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed whitespace-pre-line text-zinc-700">{p.body}</p>
            </article>
          ))}
          <article className="rounded-2xl bg-rose-50 p-4">
            <p className="mb-2 font-bold text-rose-800">⚠️ 한국인이 자주 하는 실수</p>
            <ul className="flex flex-col gap-2">
              {unit.mistakes.map((m) => (
                <li key={m.wrong} className="text-sm">
                  <p className="text-rose-700 line-through">✗ {m.wrong}</p>
                  <p className="font-semibold text-emerald-700">✓ {m.right}</p>
                  <p className="text-xs text-zinc-600">{m.why}</p>
                </li>
              ))}
            </ul>
          </article>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="rounded-2xl border-b-4 border-amber-700 bg-amber-500 py-3 text-lg font-extrabold text-white active:translate-y-0.5 active:border-b-2"
          >
            이해했어요 → 예문 듣기
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="flex flex-col gap-2">
          <p className="text-sm text-zinc-600">듣고 따라 말해 보세요. 문장을 누르면 해석이 보여요.</p>
          {unit.examples.map((e, i) => (
            <article key={e.en} className="flex items-start gap-2 rounded-2xl bg-white p-3 shadow-sm">
              <button
                type="button"
                onClick={() => setShowKo((s) => ({ ...s, [i]: !s[i] }))}
                className="flex min-w-0 flex-1 flex-col text-left"
              >
                <span className="font-semibold text-zinc-900">{e.en}</span>
                {showKo[i] ? (
                  <span className="text-sm text-zinc-600">{e.ko}</span>
                ) : (
                  <span className="text-xs text-zinc-400">해석 보기</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => play(e.en, "normal", `ex:${i}`)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${playingKey === `ex:${i}` ? "bg-amber-500 text-white" : "bg-amber-50"}`}
                aria-label="듣기"
              >
                🔊
              </button>
              <button
                type="button"
                onClick={() => play(e.en, "slow", `exs:${i}`)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${playingKey === `exs:${i}` ? "bg-amber-500 text-white" : "bg-amber-50"}`}
                aria-label="천천히 듣기"
              >
                🐢
              </button>
            </article>
          ))}
          <button
            type="button"
            onClick={() => setStep(3)}
            className="mt-1 rounded-2xl border-b-4 border-amber-700 bg-amber-500 py-3 text-lg font-extrabold text-white active:translate-y-0.5 active:border-b-2"
          >
            🎮 문제 풀기 (12문제)
          </button>
        </section>
      )}

      {step === 3 && (
        <QuizGame
          deck={grammarDeck(unit.unit)}
          seconds={25}
          nextHref={nextUnit ? `/student/grammar/${nextUnit}` : null}
          build={(only) =>
            shuffle(unit.quiz.map((q, i) => ({ q, i })).filter(({ i }) => !only || only.includes(String(i)))).map(({ q, i }) =>
              toQuestion(q, i),
            )
          }
        />
      )}
    </div>
  );
}
