"use client";

import { useTts } from "@/app/_ui/audio/use-tts";

/** 비교 단어쌍 듣기: 목표 소리 vs 헷갈리는 소리 */
export function MinimalPairs({ pairs }: { pairs: [string, string][] }) {
  const { play, playingKey } = useTts();
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {pairs.map(([target, confusing]) => (
        <div key={target} className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2">
          {[target, confusing].map((word, i) => (
            <button
              key={word}
              type="button"
              onClick={() => play(word, "slow", word)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold ${
                i === 0 ? "bg-sky-50 text-sky-800" : "bg-zinc-50 text-zinc-600"
              } ${playingKey === word ? "ring-2 ring-brand-400" : ""}`}
            >
              🔊 {word}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export function WordChips({ words }: { words: string[] }) {
  const { play, playingKey } = useTts();
  return (
    <div className="flex flex-wrap gap-2">
      {words.map((word) => (
        <span key={word} className="flex overflow-hidden rounded-full border border-zinc-200 bg-white text-sm">
          <button
            type="button"
            onClick={() => play(word, "normal", `n:${word}`)}
            className={`px-3 py-1 ${playingKey === `n:${word}` ? "bg-brand-50" : ""}`}
          >
            🔊 {word}
          </button>
          <button
            type="button"
            onClick={() => play(word, "slow", `s:${word}`)}
            className={`border-l border-zinc-200 px-2 py-1 ${playingKey === `s:${word}` ? "bg-brand-50" : ""}`}
            aria-label={`${word} 천천히`}
          >
            🐢
          </button>
        </span>
      ))}
    </div>
  );
}
