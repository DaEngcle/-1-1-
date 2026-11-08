"use client";

import { useRef, useState, useTransition } from "react";
import type { CatBreed } from "@/lib/classroom/cat";
import { isCorrect, splitExample, splitKorean } from "@/lib/classroom/course-drill";
import { finishPractice, recordPhrase } from "../actions";
import { BottomButton, CatSays, FullScreen, TopBar } from "../course-ui";

export type DrillItem = {
  key: string;
  term: string;
  ko: string;
  example: string;
  example_ko: string;
  note?: string;
  kind: "new" | "review" | "wrong";
  topic: string;
};

const KIND_TAG = { new: "새 표현", review: "복습", wrong: "다시 한 번" } as const;
/** 한 판에서 같은 표현을 최대 몇 번까지 다시 내는지 */
const MAX_TRIES = 3;

/** 브라우저 내장 음성 (무료). 호주 발음이 있으면 그걸로 */
function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voices = synth.getVoices();
  const voice = voices.find((v) => v.lang === "en-AU") ?? voices.find((v) => v.lang.startsWith("en"));
  u.lang = voice?.lang ?? "en-AU";
  if (voice) u.voice = voice;
  u.rate = 0.95;
  synth.speak(u);
}

function cheer(right: number, total: number) {
  if (total === 0) return "오늘 연습할 표현이 없어요. 내일 또 만나요!";
  if (right === total) return "하나도 안 틀렸어요. 오늘 몫은 끝!";
  if (right >= total / 2) return "반 넘게 맞혔어요. 틀린 건 내일 다시 나와요.";
  return "처음엔 다 어려워요. 내일 한 번 더 보면 훨씬 쉬워져요.";
}

export function Drill({ breed, name, items, freeLimit = null }: { breed: CatBreed; name: string; items: DrillItem[]; freeLimit?: number | null }) {
  const [queue, setQueue] = useState(items);
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [hint, setHint] = useState(false);
  const [result, setResult] = useState<null | "right" | "wrong">(null);
  const tries = useRef(new Map<string, number>());
  const firstRight = useRef(new Set<string>());
  const [rightCount, setRightCount] = useState(0);
  const [finished, setFinished] = useState(items.length === 0);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const item = queue[idx];
  const uniqueTotal = new Set(items.map((x) => x.key)).size;

  function check() {
    if (!item || result || !typed.trim()) return;
    const ok = isCorrect(typed, item.term);
    const n = (tries.current.get(item.key) ?? 0) + 1;
    tries.current.set(item.key, n);
    setResult(ok ? "right" : "wrong");
    if (ok && n === 1) {
      firstRight.current.add(item.key);
      setRightCount((c) => c + 1);
    }
    startTransition(() => recordPhrase(item.key, ok));
    // 틀린 건 몇 문제 뒤에 다시
    if (!ok && n < MAX_TRIES) {
      setQueue((q) => {
        const copy = [...q];
        copy.splice(Math.min(idx + 3, copy.length), 0, { ...item, kind: "wrong" });
        return copy;
      });
    }
  }

  function next() {
    setResult(null);
    setTyped("");
    setHint(false);
    if (idx + 1 >= queue.length) {
      setFinished(true);
      startTransition(() => finishPractice());
      return;
    }
    setIdx(idx + 1);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  if (finished || !item) {
    return (
      <FullScreen>
        <TopBar percent={100} backHref="/student/course" />
        <section className="mt-10 flex flex-col items-center gap-4 text-center">
          <CatSays breed={breed} mood={uniqueTotal > 0 && rightCount >= uniqueTotal / 2 ? "happy" : "default"} big>
            {cheer(rightCount, uniqueTotal)}
          </CatSays>
          {uniqueTotal > 0 && (
            <p className="text-sm text-zinc-600">
              {name}님, 처음에 바로 맞힌 표현 <b>{rightCount}</b>/{uniqueTotal}개 · 맞힌 표현은 1·3·7·14일 뒤에 복습으로 다시 나와요.
            </p>
          )}
          {freeLimit !== null && (
            <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              무료로는 하루 새 표현 {freeLimit}개까지 연습할 수 있어요. 복습은 그대로 나와요.
              <br />
              다잉클 수강생은 하루 최대 10개까지 새 표현을 연습해요.
            </p>
          )}
        </section>
        <BottomButton href="/student/course">코스로 돌아가기</BottomButton>
      </FullScreen>
    );
  }

  const words = item.term.split(/\s+/);
  const typedWords = typed.trim() ? typed.trim().split(/\s+/) : [];
  const parts = splitExample(item.example, item.term);
  const koParts = splitKorean(item.example_ko, item.ko);
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
    <FullScreen>
      <TopBar percent={(idx / queue.length) * 100} backHref="/student/course" />
      <div className="mt-2 flex items-center justify-between text-xs font-semibold text-zinc-500">
        <span className="rounded-full bg-white px-2 py-0.5 shadow-sm">{KIND_TAG[item.kind]}</span>
        <span className="truncate pl-2">{item.topic}</span>
      </div>

      <section className="mt-6 flex flex-col gap-4">
        <p className="text-sm font-bold text-zinc-500">빈칸에 들어갈 표현을 써 보세요</p>
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
        {!koParts && <p className="self-start rounded-lg bg-[#ffe9a8] px-2 py-0.5 text-sm font-bold text-zinc-900">{item.ko}</p>}

        <input
          ref={inputRef}
          value={typed}
          onChange={(e) => !result && setTyped(e.target.value.slice(0, 60))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              e.preventDefault();
              if (result) next();
              else check();
            }
          }}
          autoFocus
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
          <button type="button" onClick={() => setHint(true)} disabled={hint} className="self-start text-sm font-bold text-brand-700 underline disabled:text-zinc-400 disabled:no-underline">
            {hint ? "첫 글자를 보여 줬어요" : "💡 첫 글자 힌트"}
          </button>
        )}
      </section>

      {!result && (
        <BottomButton disabled={!typed.trim()} onClick={check}>
          확인
        </BottomButton>
      )}

      {result && (
        <div className="fixed inset-x-0 bottom-0 z-[70]">
          <div
            className={`mx-auto flex max-w-md flex-col gap-2 rounded-t-3xl px-5 pt-5 pb-[calc(16px+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(29,51,132,0.12)] ${
              result === "right" ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <p className={`text-lg font-extrabold ${result === "right" ? "text-green-700" : "text-red-600"}`}>
              {result === "right" ? "맞았어요!" : "아쉬워요. 조금 뒤에 다시 나와요"}
            </p>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xl font-extrabold text-zinc-900">{item.term}</p>
                <p className="text-sm font-semibold text-zinc-700">{item.ko}</p>
                {item.note && <p className="mt-1 text-xs text-zinc-500">💬 {item.note}</p>}
              </div>
              <button
                type="button"
                onClick={() => speak(item.example)}
                aria-label="예문 듣기"
                className="shrink-0 rounded-full bg-white px-3 py-2 text-lg shadow-sm active:translate-y-0.5"
              >
                🔊
              </button>
            </div>
            <p className="text-sm text-zinc-600">{item.example}</p>
            <button
              type="button"
              onClick={next}
              autoFocus
              className={`mt-2 w-full rounded-2xl border-b-4 px-5 py-4 text-lg font-extrabold text-white active:translate-y-0.5 active:border-b-2 ${
                result === "right" ? "border-green-700 bg-green-600" : "border-red-700 bg-red-500"
              }`}
            >
              다음
            </button>
          </div>
        </div>
      )}
    </FullScreen>
  );
}
