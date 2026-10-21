"use client";

import { useState } from "react";
import { useTts } from "@/app/_ui/audio/use-tts";
import { PATTERN_INFO, regularized, type Verb } from "@/lib/classroom/verbs";
import { QuizGame, shuffle, type QuizQuestion } from "../../quiz-game";

/** 읽어줄 문장: "make, made, made" */
const say = (v: Verb) => `${v.base}, ${v.past.replace(" / ", ", ")}, ${v.pp}`;
const triplet = (v: Verb) => `${v.base} – ${v.past} – ${v.pp}`;

function makeQuestion(verb: Verb, all: Verb[]): QuizQuestion {
  const kind = (["past", "pp", "triplet"] as const)[Math.floor(Math.random() * 3)];
  const reg = regularized(verb.base);
  const others = shuffle(all.filter((o) => o.base !== verb.base));
  let answer: string;
  let pool: string[];
  let prompt: string;
  let label: string;
  if (kind === "past") {
    answer = verb.past;
    pool = [reg, verb.pp, verb.base, `${verb.past}ed`, ...others.map((o) => o.past)];
    label = "⏪ 과거형";
    prompt = verb.base;
  } else if (kind === "pp") {
    answer = verb.pp;
    pool = [reg, verb.past, `${verb.base}en`, verb.base, `${verb.pp}en`, ...others.map((o) => o.pp)];
    label = "✅ 과거분사 (p.p.)";
    prompt = verb.base;
  } else {
    answer = triplet(verb);
    pool = [
      `${verb.base} – ${reg} – ${reg}`,
      `${verb.base} – ${verb.pp} – ${verb.past}`,
      `${verb.base} – ${verb.past} – ${verb.past.split(" / ")[0]}en`,
      `${verb.base} – ${verb.base} – ${verb.base}`,
      `${verb.base} – ${verb.past} – ${reg}`,
    ];
    label = "🔤 3단변화";
    prompt = `“${verb.ko}”`;
  }
  const wrong = [...new Set(pool)].filter((c) => c && c !== answer).slice(0, 3);
  const hint = kind === "past" ? `${verb.ko} · 과거형은?` : kind === "pp" ? `${verb.ko} · 과거분사는?` : "원형 – 과거 – 과거분사";
  return {
    key: verb.base,
    label,
    prompt,
    hint,
    answer,
    choices: shuffle([answer, ...wrong]),
    speak: say(verb),
    review: `${triplet(verb)} (${verb.ko})`,
    note: verb.note,
  };
}

export function VerbStudy({ setId, verbs, nextSetId }: { setId: number; verbs: Verb[]; nextSetId: number | null }) {
  const [mode, setMode] = useState<"study" | "game">("study");
  return (
    <>
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 text-sm font-bold">
        {(["study", "game"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-xl py-2 transition-colors ${mode === m ? "bg-white text-violet-700 shadow-sm" : "text-zinc-500"}`}
          >
            {m === "study" ? "📖 외우기" : "🎮 게임"}
          </button>
        ))}
      </div>
      {mode === "study" ? (
        <Study verbs={verbs} onPlay={() => setMode("game")} />
      ) : (
        <Game key={setId} setId={setId} verbs={verbs} nextSetId={nextSetId} />
      )}
    </>
  );
}

function Study({ verbs, onPlay }: { verbs: Verb[]; onPlay: () => void }) {
  const { play, playingKey } = useTts();
  const [hide, setHide] = useState(false);
  const [shown, setShown] = useState<Set<string>>(new Set());
  const reveal = (k: string) => setShown((s) => new Set(s).add(k));

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-zinc-500">🔊를 눌러 소리 내서 3번씩 따라 말해보세요.</p>
        <button
          type="button"
          onClick={() => {
            setHide((h) => !h);
            setShown(new Set());
          }}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${hide ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-700"}`}
        >
          {hide ? "🙈 가리고 외우는 중" : "🙈 가리고 외우기"}
        </button>
      </div>
      {verbs.map((v) => {
        const key = `normal:${say(v)}`;
        const cell = (k: string, text: string) =>
          hide && !shown.has(k) ? (
            <button
              type="button"
              onClick={() => reveal(k)}
              className="rounded-lg bg-slate-200 px-2 py-0.5 text-sm font-bold text-slate-400"
            >
              ?
            </button>
          ) : (
            <span className="font-bold text-zinc-900">{text}</span>
          );
        return (
          <div key={v.base} className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${PATTERN_INFO[v.pattern].color}`}>
                {PATTERN_INFO[v.pattern].label}
              </span>
              <span className="text-sm text-zinc-500">{v.ko}</span>
              <button
                type="button"
                onClick={() => play(say(v), "slow")}
                className={`ml-auto rounded-full px-2.5 py-1 text-xs font-bold ${
                  playingKey === `slow:${say(v)}` || playingKey === key ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-700"
                }`}
              >
                🔊
              </button>
            </div>
            <p className="flex flex-wrap items-center gap-x-2 text-lg">
              <span className="font-bold text-violet-700">{v.base}</span>
              <span className="text-zinc-300">–</span>
              {cell(`${v.base}-past`, v.past)}
              <span className="text-zinc-300">–</span>
              {cell(`${v.base}-pp`, v.pp)}
            </p>
            {v.note && <p className="text-xs text-amber-700">💡 {v.note}</p>}
          </div>
        );
      })}
      <button
        type="button"
        onClick={onPlay}
        className="mt-1 rounded-2xl border-b-4 border-violet-800 bg-violet-600 py-3 text-lg font-extrabold text-white active:translate-y-0.5 active:border-b-2"
      >
        다 외웠어요 → 🎮 게임 시작
      </button>
    </section>
  );
}

function Game({ setId, verbs, nextSetId }: { setId: number; verbs: Verb[]; nextSetId: number | null }) {
  return (
    <QuizGame
      deck={`verbs-${setId}`}
      nextHref={nextSetId ? `/student/voca/verbs/${nextSetId}` : null}
      build={(only) => shuffle(only ? verbs.filter((v) => only.includes(v.base)) : verbs).map((v) => makeQuestion(v, verbs))}
    />
  );
}
