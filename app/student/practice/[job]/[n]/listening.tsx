"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useTts } from "@/app/_ui/audio/use-tts";
import { splitExample } from "@/lib/classroom/course-drill";
import type { LessonLine } from "@/lib/classroom/curriculum/kit";
import { saveVocaResult } from "@/app/student/voca/actions";
import { shuffle } from "@/app/student/voca/quiz-game";

const primary =
  "w-full rounded-2xl border-b-4 border-brand-800 bg-brand-600 py-3 text-center text-lg font-extrabold text-white active:translate-y-0.5 active:border-b-2 disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-400";
const soft = "rounded-full bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700 active:translate-y-0.5";

function Highlighted({ example, term }: { example: string; term: string }) {
  const parts = splitExample(example, term);
  if (!parts) return <>{example}</>;
  return (
    <>
      {parts[0]}
      <mark className="rounded bg-brand-100 px-0.5 text-brand-800">{parts[1]}</mark>
      {parts[2]}
    </>
  );
}

/**
 * 리스닝: 영어는 숨기고 소리만 → 뜻 고르기 → 그다음에 영어 문장 공개.
 * 처음 맞힌 비율로 기록 (voca_progress, 키 ls-<상황 id>).
 */
export function ListeningDrill({ items, deck, nextHref, nextLabel }: { items: LessonLine[]; deck: string; nextHref: string; nextLabel: string }) {
  const [round, setRound] = useState(0);
  const order = useMemo(() => shuffle(items), [items, round]); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [, startTransition] = useTransition();
  const { play, stop } = useTts();
  const started = useRef(false);
  const x = order[i];
  const choices = useMemo(
    () => (x ? shuffle([x.example_ko, ...shuffle(items.filter((o) => o.example !== x.example)).slice(0, 2).map((o) => o.example_ko)]) : []),
    [x, items],
  );

  // 두 번째 문제부터는 자동으로 들려준다 (첫 문제는 버튼을 눌러야 소리가 나는 폰이 있다)
  useEffect(() => {
    if (x && started.current) void play(x.example);
  }, [x, play]);

  function listen(speed: "normal" | "slow" = "normal") {
    started.current = true;
    void play(x.example, speed);
  }

  function pick(c: string) {
    if (picked) return;
    started.current = true;
    setPicked(c);
    if (c !== x.example_ko) setWrong((w) => [...w, x.term]);
    void play(x.example);
  }

  function next() {
    stop();
    if (i + 1 >= order.length) {
      const percent = ((order.length - wrong.length) / order.length) * 100;
      startTransition(() => saveVocaResult(deck, percent, wrong, order.length));
      setDone(true);
      return;
    }
    setPicked(null);
    setI(i + 1);
  }

  function again() {
    setRound((r) => r + 1);
    setI(0);
    setPicked(null);
    setWrong([]);
    setDone(false);
  }

  if (done) {
    const right = order.length - wrong.length;
    return (
      <section className="flex flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center shadow-sm">
        <p className="text-4xl">{right === order.length ? "🎉" : right >= order.length - 2 ? "👏" : "💪"}</p>
        <p className="text-xl font-extrabold text-zinc-900">
          {order.length}문장 중 {right}개 알아들었어요
        </p>
        <ul className="flex w-full flex-col gap-1.5 text-left">
          {items.map((it) => (
            <li key={it.example} className={`rounded-2xl px-3 py-2 text-sm ${wrong.includes(it.term) ? "bg-amber-50" : "bg-slate-50"}`}>
              <span className="font-semibold text-zinc-900">
                <Highlighted example={it.example} term={it.term} />
              </span>
              <span className="block text-xs text-zinc-500">{it.example_ko}</span>
            </li>
          ))}
        </ul>
        <Link href={nextHref} className={primary}>
          {nextLabel} →
        </Link>
        <button type="button" onClick={again} className="text-sm font-bold text-zinc-500 underline">
          한 번 더 듣기
        </button>
      </section>
    );
  }

  const answered = picked !== null;
  const right = picked === x.example_ko;
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
          <span className="block h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(i / order.length) * 100}%` }} />
        </span>
        <span className="text-xs font-bold text-zinc-500">
          {i + 1}/{order.length}
        </span>
      </div>
      <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white p-5 text-center">
        {!answered ? (
          <>
            <p className="text-sm font-bold text-zinc-500">잘 듣고 무슨 뜻인지 골라 보세요</p>
            <button
              type="button"
              onClick={() => listen()}
              aria-label="문장 듣기"
              className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-4xl text-white shadow-lg shadow-brand-900/20 active:scale-95"
            >
              🔊
            </button>
            <button type="button" onClick={() => listen("slow")} className={soft}>
              🐢 천천히
            </button>
          </>
        ) : (
          <>
            <p className={`text-sm font-extrabold ${right ? "text-green-600" : "text-amber-600"}`}>{right ? "정답이에요!" : "아쉬워요. 이렇게 말했어요"}</p>
            <p className="text-[21px] font-bold leading-snug text-zinc-900">
              <Highlighted example={x.example} term={x.term} />
            </p>
            <p className="text-sm text-zinc-600">{x.example_ko}</p>
            <p className="text-xs text-zinc-500">
              <b className="text-brand-700">{x.term}</b> = {x.ko}
            </p>
            {x.note && <p className="text-xs text-amber-700">💡 {x.note}</p>}
            <div className="flex gap-2">
              <button type="button" onClick={() => listen()} className={soft}>
                🔊 다시 듣기
              </button>
              <button type="button" onClick={() => listen("slow")} className={soft}>
                🐢 천천히
              </button>
            </div>
          </>
        )}
      </div>
      {!answered ? (
        <ul className="flex flex-col gap-2">
          {choices.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => pick(c)}
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-left text-[15px] font-semibold text-zinc-800 active:border-brand-400"
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <button type="button" onClick={next} className={primary}>
          {i + 1 >= order.length ? "결과 보기" : "다음 문장"}
        </button>
      )}
    </section>
  );
}
