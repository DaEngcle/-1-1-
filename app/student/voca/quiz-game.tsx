"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useTts } from "@/app/_ui/audio/use-tts";
import { CatSprite } from "@/app/_ui/cat";
import { useMyCat } from "@/app/_ui/cat-context";
import { starsFor } from "@/lib/classroom/verbs";
import { saveVocaResult } from "./actions";

/** 게임 한 문제 */
export type QuizQuestion = {
  /** 틀린 것만 다시 할 때 쓰는 키 */
  key: string;
  prompt: React.ReactNode;
  hint?: string;
  answer: string;
  choices: string[];
  /** 문제가 뜨면 읽어줄 문장 (듣기 문제) */
  speakOnShow?: string;
  /** 정답 확인 후 읽어줄 문장 */
  speak?: string;
  /** 틀렸을 때·결과에서 보여줄 정답 설명 */
  review: string;
};

const HEARTS = 3;

export function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function beep(ok: boolean) {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    (ok ? [660, 990] : [220, 160]).forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = ok ? "triangle" : "square";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.18);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.09);
      o.stop(ctx.currentTime + i * 0.09 + 0.2);
    });
    setTimeout(() => ctx.close().catch(() => {}), 600);
  } catch {
    // 소리가 안 나도 게임은 계속
  }
}

/**
 * 말해보카식 게임 판: 하트 3개 · 문제당 제한 시간 · 콤보 · 결과(별) 저장.
 * build(only)는 문제를 만든다. only가 있으면 그 키의 문제만 (틀린 것만 다시).
 */
export function QuizGame({
  deck,
  build,
  seconds = 10,
  nextHref,
  accent = "violet",
}: {
  deck: string;
  build: (only?: string[]) => QuizQuestion[];
  seconds?: number;
  nextHref?: string | null;
  accent?: "violet" | "teal";
}) {
  const cat = useMyCat();
  const { play } = useTts();
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => build());
  const [retry, setRetry] = useState(false);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [hearts, setHearts] = useState(HEARTS);
  const [combo, setCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState<QuizQuestion[]>([]);
  const [left, setLeft] = useState(seconds);
  const [done, setDone] = useState(false);
  const [, startTransition] = useTransition();
  const saved = useRef(false);
  const q = questions[i];
  const main = accent === "teal" ? "bg-teal-600 border-teal-800" : "bg-violet-600 border-violet-800";

  // 듣기 문제는 뜨자마자 읽어준다
  useEffect(() => {
    if (q?.speakOnShow && !done) play(q.speakOnShow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, questions]);

  // 타이머: 시간이 다 되면 틀린 걸로
  useEffect(() => {
    if (done || picked || !q) return;
    const started = Date.now();
    const t = setInterval(() => {
      const remain = seconds - (Date.now() - started) / 1000;
      setLeft(Math.max(0, remain));
      if (remain <= 0) {
        clearInterval(t);
        choose("⏰");
      }
    }, 100);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, done, picked, questions]);

  if (!q && !done) {
    return <p className="text-sm text-zinc-500">문제를 만들 문장이 부족해요.</p>;
  }

  function finish(c: number, w: QuizQuestion[]) {
    setDone(true);
    if (saved.current || retry) return; // 틀린 것만 다시 하는 판은 기록하지 않는다
    saved.current = true;
    startTransition(() => saveVocaResult(deck, (c / questions.length) * 100, w.map((x) => x.key)));
  }

  function choose(c: string) {
    if (picked || done) return;
    setPicked(c);
    const ok = c === q.answer;
    beep(ok);
    const nc = correct + (ok ? 1 : 0);
    const nw = ok ? wrong : [...wrong, q];
    if (ok) {
      setCorrect(nc);
      setCombo((n) => n + 1);
      setXp((x) => x + 10 + Math.min(combo, 5) * 2);
      if (q.speak) play(q.speak);
      setTimeout(() => advance(nc, nw, hearts), q.speak ? 1400 : 800);
    } else {
      setWrong(nw);
      setCombo(0);
      const h = hearts - 1;
      setHearts(h);
      if (q.speak) play(q.speak, "slow");
      if (h <= 0) setTimeout(() => finish(nc, nw), 1400);
    }
  }

  function advance(c = correct, w = wrong, h = hearts) {
    if (h <= 0 || i + 1 >= questions.length) return finish(c, w);
    setPicked(null);
    setLeft(seconds);
    setI((n) => n + 1);
  }

  function restart(only?: string[]) {
    saved.current = false;
    setRetry(Boolean(only));
    setQuestions(build(only));
    setI(0);
    setPicked(null);
    setHearts(HEARTS);
    setCombo(0);
    setXp(0);
    setCorrect(0);
    setWrong([]);
    setLeft(seconds);
    setDone(false);
  }

  if (done) {
    const percent = Math.round((correct / questions.length) * 100);
    const stars = starsFor(percent);
    return (
      <section className="flex flex-col items-center gap-3 rounded-3xl bg-white p-5 text-center shadow-sm">
        {cat && (
          <CatSprite breed={cat.breed} mood={stars >= 3 ? "cheer" : stars >= 1 ? "happy" : "sad"} className="h-20 w-24" />
        )}
        <p className="text-3xl tracking-tight">
          {[1, 2, 3].map((n) => (
            <span key={n} className={n <= stars ? "" : "opacity-20 grayscale"}>
              ⭐
            </span>
          ))}
        </p>
        <p className="text-2xl font-extrabold text-zinc-900">
          {correct}/{questions.length} 정답 · {percent}%
        </p>
        <p className="text-sm font-bold text-violet-700">
          {cat?.name ? `${cat.name}: ` : ""}
          {hearts <= 0
            ? "하트를 다 썼어… 한 번만 더 해보자 💪"
            : stars >= 3
              ? "완벽해! 이 덱은 마스터 🎉"
              : stars >= 1
                ? "좋아! 틀린 것만 다시 하면 별 3개 가능 🔥"
                : "괜찮아, 천천히 다시 해보자"}
        </p>
        <p className="text-xs text-zinc-500">
          +{xp} XP{retry ? " · 틀린 것만 다시 한 판은 기록에 안 들어가요" : ""}
        </p>
        {wrong.length > 0 && (
          <div className="flex w-full flex-col gap-1.5 rounded-2xl bg-rose-50 p-3 text-left">
            <p className="text-xs font-bold text-rose-700">틀린 것</p>
            {wrong.map((w) => (
              <button
                key={w.key}
                type="button"
                onClick={() => w.speak && play(w.speak, "slow")}
                className="flex items-start justify-between gap-2 text-left text-sm"
              >
                <span>{w.review}</span>
                {w.speak && <span>🔊</span>}
              </button>
            ))}
          </div>
        )}
        <div className="flex w-full flex-col gap-2">
          {wrong.length > 0 && (
            <button
              type="button"
              onClick={() => restart([...new Set(wrong.map((w) => w.key))])}
              className="rounded-2xl border-b-4 border-rose-700 bg-rose-500 py-3 font-extrabold text-white active:translate-y-0.5 active:border-b-2"
            >
              🔁 틀린 것만 다시
            </button>
          )}
          <button
            type="button"
            onClick={() => restart()}
            className={`rounded-2xl border-b-4 py-3 font-extrabold text-white active:translate-y-0.5 active:border-b-2 ${main}`}
          >
            새 문제로 다시
          </button>
          {nextHref && stars > 0 && (
            <Link href={nextHref} className="rounded-2xl border-2 border-violet-200 py-3 font-extrabold text-violet-700">
              다음 →
            </Link>
          )}
        </div>
      </section>
    );
  }

  const answered = picked !== null;
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-lg tracking-tighter">
          {Array.from({ length: HEARTS }, (_, n) => (
            <span key={n} className={n < hearts ? "" : "opacity-20 grayscale"}>
              ❤️
            </span>
          ))}
        </span>
        <span className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
          <span
            className={`block h-full rounded-full transition-all ${accent === "teal" ? "bg-teal-500" : "bg-violet-500"}`}
            style={{ width: `${((i + (answered ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </span>
        <span className="text-xs font-bold text-zinc-500">
          {i + 1}/{questions.length}
        </span>
      </div>
      {combo >= 2 && <p className="animate-pulse text-center text-sm font-extrabold text-orange-500">🔥 {combo} 콤보!</p>}

      <div className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-sm">
        <span className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <span
            className={`block h-full ${left < 3 ? "bg-rose-500" : "bg-emerald-400"}`}
            style={{ width: `${(left / seconds) * 100}%` }}
          />
        </span>
        <div className="text-center text-lg leading-relaxed text-zinc-900">{q.prompt}</div>
        {q.hint && <p className="text-center text-sm text-zinc-500">{q.hint}</p>}
        {q.speakOnShow && (
          <button
            type="button"
            onClick={() => play(q.speakOnShow!)}
            className="self-center rounded-full bg-violet-50 px-4 py-1.5 text-sm font-bold text-violet-700"
          >
            🔊 다시 듣기
          </button>
        )}
        <div className="grid grid-cols-1 gap-2">
          {q.choices.map((c) => {
            const isAnswer = c === q.answer;
            const isPicked = c === picked;
            return (
              <button
                key={c}
                type="button"
                disabled={answered}
                onClick={() => choose(c)}
                className={`rounded-2xl border-2 border-b-4 px-4 py-3 text-left text-base font-bold transition-all active:translate-y-0.5 ${
                  answered && isAnswer
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                    : answered && isPicked
                      ? "border-rose-400 bg-rose-50 text-rose-700"
                      : "border-slate-200 bg-white text-zinc-800 hover:border-violet-300"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
        {answered && picked !== q.answer && (
          <div className="flex flex-col gap-2 rounded-2xl bg-rose-50 p-3">
            <p className="text-sm text-rose-800">
              {picked === "⏰" ? "⏰ 시간 초과! " : ""}
              {q.review}
            </p>
            {hearts > 0 && (
              <button type="button" onClick={() => advance()} className="rounded-xl bg-rose-500 py-2 font-bold text-white">
                다음 →
              </button>
            )}
          </div>
        )}
      </div>
      <p className="text-center text-xs text-zinc-400">+{xp} XP</p>
    </section>
  );
}
