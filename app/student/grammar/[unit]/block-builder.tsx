"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useTts } from "@/app/_ui/audio/use-tts";
import { saveVocaResult } from "@/app/student/voca/actions";
import { shuffle } from "@/app/student/voca/quiz-game";
import type { GrammarBlock } from "@/lib/classroom/grammar";

type Piece = { id: number; word: string };

/** 수업 마무리: 한국어를 보고 단어 블록을 눌러 영어 문장을 만든다 */
export function BlockBuilder({ unit, blocks, nextUnit }: { unit: number; blocks: GrammarBlock[]; nextUnit: number | null }) {
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [tries, setTries] = useState(0);
  const [status, setStatus] = useState<"playing" | "wrong" | "right" | "revealed">("playing");
  const [firstTry, setFirstTry] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [, startTransition] = useTransition();
  const { play } = useTts();

  const q = blocks[index];
  const pieces = useMemo<Piece[]>(
    () => shuffle([...q.tokens, ...q.extra]).map((word, id) => ({ id, word })),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 문제가 바뀌거나 다시 풀 때만 섞는다
    [index, round],
  );

  const word = (id: number) => pieces.find((p) => p.id === id)!.word;
  const locked = status === "right" || status === "revealed";

  const check = () => {
    const ok = picked.map(word).join(" ") === q.tokens.join(" ");
    if (ok) {
      setStatus("right");
      if (tries === 0) setFirstTry((n) => n + 1);
      else setMissed((m) => [...m, String(index)]);
      play(q.en, "normal", `block:${index}`);
      return;
    }
    const nextTries = tries + 1;
    setTries(nextTries);
    if (nextTries >= 2) {
      setMissed((m) => [...m, String(index)]);
      setStatus("revealed");
      play(q.en, "normal", `block:${index}`);
    } else {
      setStatus("wrong");
    }
  };

  const next = () => {
    if (index + 1 >= blocks.length) {
      setDone(true);
      startTransition(() => saveVocaResult(`gblocks-${unit}`, (firstTry / blocks.length) * 100, missed, blocks.length));
      return;
    }
    setIndex(index + 1);
    setPicked([]);
    setTries(0);
    setStatus("playing");
  };

  const restart = () => {
    setRound((r) => r + 1);
    setIndex(0);
    setPicked([]);
    setTries(0);
    setStatus("playing");
    setFirstTry(0);
    setMissed([]);
    setDone(false);
  };

  if (done) {
    return (
      <section className="flex flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center shadow-sm">
        <span className="text-5xl">🧩</span>
        <p className="text-xl font-extrabold text-zinc-900">
          {blocks.length}문장 중 {firstTry}문장을 한 번에 맞혔어요!
        </p>
        <p className="text-sm text-zinc-600">한 번에 못 맞힌 문장은 다시 풀면서 입으로도 말해 보세요.</p>
        <button type="button" onClick={restart} className="w-full rounded-2xl bg-amber-100 py-3 font-bold text-amber-900">
          다시 풀기
        </button>
        {nextUnit && (
          <Link
            href={`/student/grammar/${nextUnit}`}
            className="w-full rounded-2xl border-b-4 border-amber-700 bg-amber-500 py-3 font-extrabold text-white"
          >
            다음 유닛으로 →
          </Link>
        )}
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm font-bold text-amber-800">
        <span>🧩 블록으로 문장 만들기</span>
        <span>
          {index + 1} / {blocks.length}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-amber-100">
        <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${((index + (locked ? 1 : 0)) / blocks.length) * 100}%` }} />
      </div>

      <p className="rounded-2xl bg-white p-4 text-lg font-extrabold text-zinc-900 shadow-sm">{q.ko}</p>

      <div
        className={`flex min-h-20 flex-wrap content-start gap-2 rounded-2xl border-2 border-dashed p-3 ${
          status === "right"
            ? "border-emerald-400 bg-emerald-50"
            : status === "wrong"
              ? "border-rose-400 bg-rose-50"
              : "border-amber-300 bg-amber-50"
        }`}
        aria-label="만든 문장"
      >
        {picked.length === 0 && <span className="self-center text-sm text-zinc-400">아래 블록을 순서대로 눌러 보세요</span>}
        {picked.map((id) => (
          <button
            key={id}
            type="button"
            disabled={locked}
            onClick={() => {
              setPicked((p) => p.filter((x) => x !== id));
              setStatus("playing");
            }}
            className="rounded-xl border-b-4 border-amber-600 bg-amber-400 px-3 py-2 text-base font-bold text-zinc-900 active:translate-y-0.5 active:border-b-2"
          >
            {word(id)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2" aria-label="단어 블록">
        {pieces.map((p) => {
          const used = picked.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              disabled={used || locked}
              onClick={() => {
                setPicked((x) => [...x, p.id]);
                setStatus("playing");
              }}
              className={`rounded-xl border-b-4 px-3 py-2 text-base font-bold ${
                used ? "border-transparent bg-slate-100 text-transparent" : "border-slate-300 bg-white text-zinc-900 shadow-sm active:translate-y-0.5 active:border-b-2"
              }`}
            >
              {p.word}
            </button>
          );
        })}
      </div>

      {status === "wrong" && <p className="text-center text-sm font-bold text-rose-700">아쉬워요! 필요 없는 블록이 하나 섞여 있어요. 한 번 더 해 보세요.</p>}
      {status === "right" && <p className="text-center font-extrabold text-emerald-700">✅ {q.en}</p>}
      {status === "revealed" && (
        <p className="rounded-2xl bg-rose-50 p-3 text-center font-bold text-rose-800">
          정답: {q.en}
        </p>
      )}

      {locked ? (
        <button type="button" onClick={next} className="rounded-2xl border-b-4 border-amber-700 bg-amber-500 py-3 text-lg font-extrabold text-white">
          {index + 1 >= blocks.length ? "결과 보기" : "다음 문장 →"}
        </button>
      ) : (
        <button
          type="button"
          onClick={check}
          disabled={picked.length === 0}
          className="rounded-2xl border-b-4 border-amber-700 bg-amber-500 py-3 text-lg font-extrabold text-white disabled:opacity-40"
        >
          확인하기
        </button>
      )}
    </section>
  );
}
