"use client";

import type { RefObject } from "react";
import { splitExample, splitKorean } from "@/lib/classroom/course-drill";

export type ClozeItem = { term: string; ko: string; example: string; example_ko: string };

/**
 * 빈칸 타이핑 문제 화면 (오늘의 연습 · 보카 '빈칸 쓰기' 공용).
 * 예문 속 표현 자리에 단어마다 칸을 그리고, 아래 한국어 번역 · 입력칸 · 첫 글자 힌트를 보여 준다.
 * 채점과 다음 문제로 넘기기는 부르는 쪽에서 한다.
 */
export function ClozePrompt({
  item,
  typed,
  onType,
  result,
  hint,
  onHint,
  onEnter,
  inputRef,
  autoFocus = true,
}: {
  item: ClozeItem;
  typed: string;
  onType: (v: string) => void;
  result: null | "right" | "wrong";
  hint: boolean;
  onHint: () => void;
  /** 엔터: 답 전엔 확인, 답 뒤엔 다음 */
  onEnter: () => void;
  inputRef?: RefObject<HTMLInputElement | null>;
  autoFocus?: boolean;
}) {
  const words = item.term.split(/\s+/);
  const typedWords = typed.trim() ? typed.trim().split(/\s+/) : [];
  const parts = splitExample(item.example, item.term);
  const koParts = item.ko ? splitKorean(item.example_ko, item.ko) : null;
  const boxes = (
    <span className="mx-0.5 inline-flex flex-wrap items-baseline gap-1 align-baseline">
      {words.map((w, i) => (
        <span
          key={i}
          className={`inline-block rounded-md border-b-2 px-1 text-center font-extrabold ${
            result === "right" ? "border-green-500 bg-green-50 text-green-700" : result === "wrong" ? "border-red-400 bg-red-50 text-red-600" : "border-brand-400 bg-brand-50 text-brand-700"
          }`}
          style={{ minWidth: `${Math.max(2, w.length) * 0.62 + 0.6}em` }}
        >
          {result ? w : (typedWords[i] ?? (hint ? <span className="text-brand-300">{w[0]}</span> : " "))}
        </span>
      ))}
    </span>
  );

  return (
    <>
      <p className="text-xl font-bold leading-relaxed text-zinc-900">
        {parts ? (
          <>
            {parts[0]}
            {boxes}
            {parts[2]}
          </>
        ) : (
          <>
            {boxes}
            <span className="mt-2 block text-base font-semibold text-zinc-500">{item.example}</span>
          </>
        )}
      </p>
      <p className="text-[15px] text-zinc-600">
        {koParts ? (
          <>
            {koParts[0]}
            <mark className="rounded bg-[#ffe9a8] px-0.5 font-bold text-zinc-900">{koParts[1]}</mark>
            {koParts[2]}
          </>
        ) : (
          item.example_ko
        )}
      </p>
      {!koParts && item.ko && <p className="self-start rounded-lg bg-[#ffe9a8] px-2 py-0.5 text-sm font-bold text-zinc-900">{item.ko}</p>}

      <input
        ref={inputRef}
        value={typed}
        onChange={(e) => !result && onType(e.target.value.slice(0, 60))}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            e.preventDefault();
            onEnter();
          }
        }}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        placeholder="영어로 입력"
        aria-label="빈칸에 들어갈 표현"
        readOnly={!!result}
        className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-lg font-semibold text-zinc-900 focus:border-brand-500 focus:outline-none"
      />
      {!result && (
        <button type="button" onClick={onHint} disabled={hint} className="self-start text-sm font-bold text-brand-700 underline disabled:text-zinc-400 disabled:no-underline">
          {hint ? "첫 글자를 보여 줬어요" : "💡 첫 글자 힌트"}
        </button>
      )}
    </>
  );
}
