"use client";

import { useState } from "react";
import { useTts } from "@/app/_ui/audio/use-tts";
import type { GrammarHomework as Homework } from "@/lib/classroom/grammar";

/** 라이브 수업 숙제: 예문 해석 + 단어 정리 + 라이브 다시보기 */
export function GrammarHomework({ homework }: { homework: Homework }) {
  const [shown, setShown] = useState<Record<number, boolean>>({});
  const { play, playingKey } = useTts();
  const sentences = homework.sentences ?? [];
  const words = homework.words ?? [];

  return (
    <section className="flex flex-col gap-3">
      {homework.live && (
        <a
          href={homework.live}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl bg-white p-3 text-sm font-bold text-amber-800 shadow-sm"
        >
          🔴 라이브 다시보기 <span className="font-normal text-zinc-500">· 기초반 라이브 수업 녹화</span>
        </a>
      )}

      {sentences.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="font-bold text-zinc-900">✏️ 해석해 보기</p>
          <p className="text-sm text-zinc-600">먼저 우리말로 해석해 보고, 문장을 눌러 답을 확인하세요.</p>
          {sentences.map((s, i) => (
            <article key={s.en} className="flex items-start gap-2 rounded-2xl bg-white p-3 shadow-sm">
              <button
                type="button"
                onClick={() => setShown((v) => ({ ...v, [i]: !v[i] }))}
                className="flex min-w-0 flex-1 flex-col text-left"
              >
                <span className="font-semibold text-zinc-900">
                  <span className="mr-1 text-amber-600">{i + 1}.</span>
                  {s.en}
                </span>
                {shown[i] ? (
                  <span className="text-sm text-zinc-600">{s.ko}</span>
                ) : (
                  <span className="text-xs text-zinc-400">답 보기</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => play(s.en, "normal", `hw:${i}`)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${playingKey === `hw:${i}` ? "bg-amber-500 text-white" : "bg-amber-50"}`}
                aria-label="듣기"
              >
                🔊
              </button>
            </article>
          ))}
        </div>
      )}

      {words.length > 0 && (
        <article className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-2 font-bold text-zinc-900">📒 단어 정리</p>
          <ul className="flex flex-col divide-y divide-zinc-100">
            {words.map((w) => (
              <li key={w.en} className="flex gap-3 py-1.5 text-sm">
                <span className="w-2/5 shrink-0 font-semibold text-zinc-900">{w.en}</span>
                <span className="text-zinc-600">{w.ko}</span>
              </li>
            ))}
          </ul>
        </article>
      )}
    </section>
  );
}
