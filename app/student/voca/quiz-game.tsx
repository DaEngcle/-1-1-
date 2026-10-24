"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useTts } from "@/app/_ui/audio/use-tts";
import { CatSprite } from "@/app/_ui/cat";
import { useMyCat } from "@/app/_ui/cat-context";
import { starsFor } from "@/lib/classroom/verbs";
import { saveVocaResult } from "./actions";
import { readPref } from "@/app/_ui/prefs";

/** 게임 한 문제 */
export type QuizQuestion = {
  /** 틀린 것만 다시 할 때 쓰는 키 */
  key: string;
  /** 문제 종류 칩 (예: 빈칸 채우기) */
  label: string;
  /** 큰 글씨 문제 */
  prompt?: React.ReactNode;
  /** 빈칸 문제: 앞·뒤 문장 (가운데가 빈칸, 맞히면 채워진다) */
  blank?: { before: string; after: string };
  /** 한국어 힌트 */
  hint?: string;
  answer: string;
  choices: string[];
  /** 문제가 뜨자마자 읽어줄 문장 (듣기 문제) — 답을 안 알려주는 소리만 */
  speakOnShow?: string;
  /** 답한 뒤 읽어줄 문장 */
  speak?: string;
  /** 정답 설명 */
  review: string;
  note?: string;
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
  if (!readPref("gameSound")) return;
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

const RANK = [
  { min: 3, title: "PERFECT", from: "#FFD84D", to: "#FF9F43", ribbon: "#7C5CFF" },
  { min: 2, title: "GREAT", from: "#C7F0FF", to: "#7FB2FF", ribbon: "#3B82F6" },
  { min: 1, title: "GOOD", from: "#E8F9EE", to: "#7FD9A7", ribbon: "#10B981" },
  { min: 0, title: "TRY AGAIN", from: "#F1F1F4", to: "#C9CBD4", ribbon: "#9CA3AF" },
];

/** 결과 메달 */
function Medal({ stars }: { stars: number }) {
  const r = RANK.find((x) => stars >= x.min)!;
  return (
    <svg viewBox="0 0 160 170" className="h-40 w-40 drop-shadow-[0_10px_20px_rgba(124,92,255,0.25)]">
      <defs>
        <linearGradient id="medal-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={r.from} />
          <stop offset="1" stopColor={r.to} />
        </linearGradient>
      </defs>
      <path d="M52 0 L70 46 L56 52 L36 8Z" fill={r.ribbon} opacity="0.85" />
      <path d="M108 0 L90 46 L104 52 L124 8Z" fill={r.ribbon} opacity="0.85" />
      <circle cx="80" cy="88" r="56" fill="url(#medal-g)" />
      <circle cx="80" cy="88" r="44" fill="#fff" opacity="0.35" />
      <path
        d="M80 58l9 18.5 20.4 3-14.7 14.3 3.5 20.2L80 104.4 61.8 114l3.5-20.2L50.6 79.5l20.4-3z"
        fill="#fff"
        stroke={r.to}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="22" y="128" width="116" height="30" rx="10" fill={r.ribbon} />
      <text x="80" y="149" textAnchor="middle" fontSize="17" fontWeight="900" fill="#fff" fontFamily="system-ui, sans-serif">
        {r.title}
      </text>
    </svg>
  );
}

/**
 * 말해보카식 게임 판: 하트 3개 · 문제당 제한 시간 · 콤보 · 결과 메달 저장.
 * build(only)는 문제를 만든다. only가 있으면 그 키의 문제만 (틀린 것만 다시).
 */
export function QuizGame({
  deck,
  build,
  seconds = 10,
  nextHref,
}: {
  deck: string;
  build: (only?: string[]) => QuizQuestion[];
  seconds?: number;
  nextHref?: string | null;
}) {
  const cat = useMyCat();
  const { play, stop, preload } = useTts();
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => build());
  const [retry, setRetry] = useState(false);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [hearts, setHearts] = useState(HEARTS);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState<QuizQuestion[]>([]);
  const [left, setLeft] = useState(seconds);
  const [done, setDone] = useState(false);
  const [, startTransition] = useTransition();
  const saved = useRef(false);
  const autoNext = useRef<ReturnType<typeof setTimeout> | null>(null);
  const q = questions[i];
  const iRef = useRef(i);
  iRef.current = i;

  // 듣기 문제는 뜨자마자 읽어주고, 정답 문장은 미리 받아둔다 (맞힌 순간 바로 나오게)
  useEffect(() => {
    if (!q || done) return;
    preload(q.speak);
    preload(q.speak, "slow");
    const next = questions[i + 1];
    preload(next?.speakOnShow);
    if (q.speakOnShow) play(q.speakOnShow);
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

  useEffect(() => () => {
    if (autoNext.current) clearTimeout(autoNext.current);
  }, []);

  if (!q && !done) {
    return <p className="text-sm text-zinc-500">문제를 만들 문장이 부족해요.</p>;
  }

  function finish(c: number, w: QuizQuestion[]) {
    setDone(true);
    if (saved.current || retry) return; // 틀린 것만 다시 하는 판은 기록하지 않는다
    saved.current = true;
    startTransition(() => saveVocaResult(deck, (c / questions.length) * 100, w.map((x) => x.key), questions.length));
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
      const nCombo = combo + 1;
      setCombo(nCombo);
      setBestCombo((b) => Math.max(b, nCombo));
      setXp((x) => x + 10 + Math.min(combo, 5) * 2);
      // 정답 문장을 다 읽어준 뒤에 다음 문제로 (늦게 나와서 다음 문제에 겹치지 않게)
      const at = i;
      let moved = false;
      const go = () => {
        if (moved) return;
        moved = true;
        if (autoNext.current) clearTimeout(autoNext.current);
        autoNext.current = setTimeout(() => {
          if (at === iRef.current) advance(nc, nw, hearts);
        }, 500);
      };
      if (q.speak) {
        void play(q.speak).then(go);
        autoNext.current = setTimeout(go, 7000); // 소리가 안 끝나도 7초 뒤엔 넘어감
      } else go();
    } else {
      setWrong(nw);
      setCombo(0);
      const h = hearts - 1;
      setHearts(h);
      if (q.speak) play(q.speak, "slow");
      if (h <= 0) autoNext.current = setTimeout(() => finish(nc, nw), 1600);
    }
  }

  function advance(c = correct, w = wrong, h = hearts) {
    if (autoNext.current) clearTimeout(autoNext.current);
    autoNext.current = null;
    stop(); // 앞 문제 소리가 다음 문제에 겹치지 않게
    if (h <= 0 || i + 1 >= questions.length) return finish(c, w);
    setPicked(null);
    setLeft(seconds);
    setI((n) => n + 1);
  }

  function restart(only?: string[]) {
    stop();
    saved.current = false;
    setRetry(Boolean(only));
    setQuestions(build(only));
    setI(0);
    setPicked(null);
    setHearts(HEARTS);
    setCombo(0);
    setBestCombo(0);
    setXp(0);
    setCorrect(0);
    setWrong([]);
    setLeft(seconds);
    setDone(false);
  }

  const shell = "-mx-4 flex flex-col gap-3 bg-gradient-to-b from-[#ECEBFF] via-[#F3F0FF] to-[#FBF7FF] px-4 py-4 sm:mx-0 sm:rounded-[32px] sm:px-5";
  const purple = "bg-[#6C5CFF] text-white shadow-[0_4px_0_#4936D8] active:translate-y-[3px] active:shadow-none";

  if (done) {
    const percent = Math.round((correct / questions.length) * 100);
    const stars = starsFor(percent);
    return (
      <section className={shell}>
        <div className="flex flex-col items-center gap-2 rounded-[28px] bg-white px-5 pb-5 pt-6 text-center shadow-[0_12px_30px_-12px_rgba(91,76,255,0.35)]">
          <Medal stars={stars} />
          <p className="text-2xl tracking-tight">
            {[1, 2, 3].map((n) => (
              <span key={n} className={n <= stars ? "" : "opacity-20 grayscale"}>
                ⭐
              </span>
            ))}
          </p>
          <div className="grid w-full grid-cols-3 gap-2">
            {[
              ["정답", `${correct}/${questions.length}`],
              ["최고 콤보", `🔥${bestCombo}`],
              ["획득", `+${xp}XP`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-[#F4F2FF] py-2">
                <p className="text-lg font-extrabold text-[#2B2560]">{v}</p>
                <p className="text-[11px] text-[#7A74A8]">{k}</p>
              </div>
            ))}
          </div>
          <div className="mt-1 flex w-full items-center gap-2 rounded-2xl bg-[#FFF8E6] p-2 text-left">
            {cat && (
              <CatSprite breed={cat.breed} mood={stars >= 3 ? "cheer" : stars >= 1 ? "happy" : "sad"} className="h-14 w-16 shrink-0" />
            )}
            <p className="text-sm font-bold text-[#6B4E00]">
              {cat?.name && <span className="block text-[11px] text-[#B08A2E]">{cat.name}</span>}
              {hearts <= 0
                ? "하트를 다 썼어… 한 번만 더 해보자 💪"
                : stars >= 3
                  ? "완벽해! 이 덱은 마스터 🎉"
                  : stars >= 1
                    ? "좋아! 틀린 것만 다시 하면 별 3개 가능 🔥"
                    : "괜찮아, 천천히 다시 해보자"}
            </p>
          </div>
          {retry && <p className="text-[11px] text-zinc-400">틀린 것만 다시 한 판은 기록에 안 들어가요</p>}
        </div>

        {wrong.length > 0 && (
          <div className="flex flex-col gap-1 rounded-[24px] bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-[#E0456B]">다시 볼 것 {wrong.length}개</p>
            {wrong.map((w) => (
              <button
                key={w.key}
                type="button"
                onClick={() => w.speak && play(w.speak, "slow")}
                className="flex items-start justify-between gap-2 border-b border-slate-100 py-2 text-left text-sm text-[#2B2560] last:border-0"
              >
                <span>{w.review}</span>
                {w.speak && <span className="shrink-0">🔊</span>}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 pb-2">
          {wrong.length > 0 && (
            <button
              type="button"
              onClick={() => restart([...new Set(wrong.map((w) => w.key))])}
              className="rounded-2xl bg-[#FF6B8A] py-3.5 text-lg font-extrabold text-white shadow-[0_4px_0_#D9476A] active:translate-y-[3px] active:shadow-none"
            >
              🔁 틀린 것만 다시
            </button>
          )}
          <button type="button" onClick={() => restart()} className={`rounded-2xl py-3.5 text-lg font-extrabold ${purple}`}>
            새 문제로 다시
          </button>
          {nextHref && stars > 0 && (
            <Link href={nextHref} className="rounded-2xl bg-white py-3.5 text-center text-lg font-extrabold text-[#6C5CFF] shadow-sm ring-2 ring-[#DCD7FF]">
              다음 단계 →
            </Link>
          )}
        </div>
      </section>
    );
  }

  const answered = picked !== null;
  const ok = picked === q.answer;
  const wide = q.choices.some((c) => c.length > 16);
  // 답하기 전엔 듣기 문제만 소리를 들을 수 있다 (빈칸 문제는 소리가 정답을 알려주니까)
  const audio = answered ? q.speak : q.speakOnShow;

  return (
    <section className={shell}>
      {/* 상단: 진행 · 하트 */}
      <div className="flex items-center gap-2">
        <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/80 shadow-inner">
          <span
            className="block h-full rounded-full bg-gradient-to-r from-[#7C6BFF] to-[#C86BFF] transition-all duration-500"
            style={{ width: `${((i + (answered ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </span>
        <span className="text-xs font-bold text-[#7A74A8]">
          {i + 1}/{questions.length}
        </span>
        <span className="rounded-full bg-white px-2.5 py-1 text-sm font-extrabold text-[#FF4D6D] shadow-sm">❤️ {hearts}</span>
      </div>

      <div className="flex h-7 items-center justify-center">
        {combo >= 2 && (
          <span className="animate-bounce rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-3 py-1 text-xs font-extrabold text-white shadow">
            🔥 {combo} 콤보!
          </span>
        )}
      </div>

      {/* 문제 카드 */}
      <div className="relative flex min-h-[210px] flex-col items-center justify-center gap-3 overflow-hidden rounded-[28px] bg-white px-5 pb-6 pt-7 text-center shadow-[0_12px_30px_-12px_rgba(91,76,255,0.4)]">
        <span className="absolute inset-x-0 top-0 h-1.5 bg-[#F0EEFF]">
          <span
            className={`block h-full transition-[width] duration-100 ${left < 3 ? "bg-[#FF6B8A]" : "bg-[#5EDFB8]"}`}
            style={{ width: `${(left / seconds) * 100}%` }}
          />
        </span>
        <span className="rounded-full bg-[#EEEBFF] px-3 py-1 text-xs font-bold text-[#5B4CFF]">{q.label}</span>
        {q.speakOnShow && (
          <button
            type="button"
            onClick={() => play(q.speakOnShow!)}
            aria-label="문장 듣기"
            className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#8B7CFF] to-[#6C5CFF] text-4xl text-white shadow-[0_6px_0_#4936D8] active:translate-y-[3px] active:shadow-none"
          >
            🔊
          </button>
        )}
        {q.hint && <p className="text-[15px] leading-snug text-[#7A74A8]">{q.hint}</p>}
        {q.blank ? (
          <p className="text-[21px] font-bold leading-relaxed text-[#2B2560]">
            {q.blank.before}
            <span
              className={`mx-1 inline-flex h-9 min-w-[92px] items-center justify-center rounded-lg px-2 align-middle text-[19px] ${
                answered ? (ok ? "bg-[#C8F4E6] text-[#0F7A5C]" : "bg-[#C8F4E6] text-[#0F7A5C] ring-2 ring-[#FF8DA1]") : "bg-[#D6F6EE]"
              }`}
            >
              {answered ? q.answer : ""}
            </span>
            {q.blank.after}
          </p>
        ) : (
          q.prompt && <div className="text-[22px] font-bold leading-snug text-[#2B2560]">{q.prompt}</div>
        )}
      </div>

      {/* 보기 */}
      <div className={`grid gap-2.5 ${wide ? "grid-cols-1" : "grid-cols-2"}`}>
        {q.choices.map((c) => {
          const isAnswer = c === q.answer;
          const isPicked = c === picked;
          const style = !answered
            ? "bg-white text-[#2B2560] ring-1 ring-[#E3DFFF] shadow-[0_3px_0_#DCD7FF] hover:ring-[#B9B0FF]"
            : isAnswer
              ? "bg-[#DDF8EF] text-[#0F7A5C] ring-2 ring-[#34C79A] shadow-[0_3px_0_#9BE3CB]"
              : isPicked
                ? "bg-[#FFE6EA] text-[#C2334D] ring-2 ring-[#FF7A90] shadow-[0_3px_0_#FFC2CC]"
                : "bg-white/60 text-[#B4AFD6] ring-1 ring-[#EEEBFF]";
          return (
            <button
              key={c}
              type="button"
              disabled={answered}
              onClick={() => choose(c)}
              className={`min-h-[56px] rounded-2xl px-4 py-3 text-[17px] font-bold transition-all active:translate-y-[2px] active:shadow-none ${wide ? "text-left" : ""} ${style}`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* 정답·오답 안내 */}
      {answered && (
        <div className={`rounded-2xl p-4 text-left ${ok ? "bg-[#DDF8EF]" : "bg-[#FFE6EA]"}`}>
          <p className={`text-base font-extrabold ${ok ? "text-[#0F7A5C]" : "text-[#C2334D]"}`}>
            {ok ? "정답이에요! 🎉" : picked === "⏰" ? "시간이 다 됐어요 ⏰" : "아쉬워요 😢"}
          </p>
          <p className="mt-0.5 text-sm text-[#2B2560]">{q.review}</p>
          {q.note && <p className="mt-1 text-xs text-amber-700">💡 {q.note}</p>}
        </div>
      )}

      {/* 하단 버튼 (말해보카처럼) */}
      <div className="grid grid-cols-3 gap-2 pb-1">
        <button
          type="button"
          disabled={!audio}
          onClick={() => audio && play(audio, "slow")}
          className={`flex flex-col items-center gap-0.5 rounded-2xl py-2.5 text-xs font-bold disabled:bg-[#D9D4FF] disabled:text-white/80 disabled:shadow-none ${purple}`}
        >
          <span className="text-xl">🐢</span>천천히 듣기
        </button>
        <button
          type="button"
          disabled={!audio}
          onClick={() => audio && play(audio)}
          className={`flex flex-col items-center gap-0.5 rounded-2xl py-2.5 text-xs font-bold disabled:bg-[#D9D4FF] disabled:text-white/80 disabled:shadow-none ${purple}`}
        >
          <span className="text-xl">🔊</span>다시 듣기
        </button>
        <button
          type="button"
          disabled={!answered || hearts <= 0}
          onClick={() => advance()}
          className={`flex flex-col items-center gap-0.5 rounded-2xl py-2.5 text-xs font-bold disabled:bg-[#D9D4FF] disabled:text-white/80 disabled:shadow-none ${purple}`}
        >
          <span className="text-xl">▶</span>다음 문제
        </button>
      </div>
      <p className="text-center text-xs font-semibold text-[#9A94C8]">+{xp} XP</p>
    </section>
  );
}
