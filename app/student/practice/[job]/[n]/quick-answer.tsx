"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useTts } from "@/app/_ui/audio/use-tts";
import type { RoleplayTurn } from "@/lib/classroom/curriculum/kit";
import { scoreTurn } from "@/lib/classroom/roleplay-score";
import type { SpokenCheck } from "@/lib/classroom/sentence-practice";
import { saveVocaResult } from "@/app/student/voca/actions";
import { AnswerBox, AnswerCompare } from "@/app/student/voca/sentence-steps";

const LIMIT = 3;
const primary =
  "w-full rounded-2xl border-b-4 border-brand-800 bg-brand-600 py-3 text-center text-lg font-extrabold text-white active:translate-y-0.5 active:border-b-2";
const soft = "rounded-full bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700 active:translate-y-0.5";

type Result = { turn: number; said: string; check: SpokenCheck; stars: number; secs: number | null };

const fast = (secs: number | null) => secs !== null && secs <= LIMIT;
/** 한 문제 점수: 별(1~3)/3, 3초를 넘기면 0.6배, 모르겠어요는 0 */
const value = (r: Result) => (r.said ? (r.stars / 3) * (fast(r.secs) ? 1 : 0.6) : 0);

/**
 * 3초 대답: 상대 말을 자막 없이 듣고, 끝나자마자 3초 안에 대답을 시작한다 (말 또는 채팅).
 * 시작까지 걸린 시간과 모범 답 비교를 보여 주고, 기록은 voca_progress 키 qk-<상황 id>.
 */
export function QuickAnswerDrill({ turns, who, deck, nextHref }: { turns: RoleplayTurn[]; who: string; deck: string; nextHref: string }) {
  const [order, setOrder] = useState(() => turns.map((_, k) => k));
  const [i, setI] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [cur, setCur] = useState<Result | null>(null);
  const [heardAt, setHeardAt] = useState<number | null>(null);
  const [startSecs, setStartSecs] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [begun, setBegun] = useState(false);
  const [done, setDone] = useState(false);
  const [, startTransition] = useTransition();
  const { play, stop } = useTts();
  const token = useRef(0);
  const ti = order[i];
  const turn = turns[ti];

  // 상대 말이 끝나면 초시계 시작 (다시 듣기로는 초시계가 다시 시작되지 않는다)
  async function ask() {
    const my = ++token.current;
    await play(turn.line);
    if (my !== token.current) return;
    setHeardAt((t) => t ?? performance.now());
  }

  useEffect(() => {
    const t = token;
    if (begun && !done) void ask();
    return () => {
      t.current++;
    };
  }, [begun, i, order]); // eslint-disable-line react-hooks/exhaustive-deps

  // 대답 시작 전까지 초시계 화면 갱신
  useEffect(() => {
    if (heardAt === null || startSecs !== null || cur) return;
    const id = setInterval(() => setNow(performance.now()), 100);
    return () => clearInterval(id);
  }, [heardAt, startSecs, cur]);

  function started() {
    if (startSecs !== null) return;
    setStartSecs(heardAt === null ? 0 : Math.max(0, (performance.now() - heardAt) / 1000));
  }

  function answer(said: string, check: SpokenCheck) {
    const secs = startSecs ?? (heardAt === null ? 0 : (performance.now() - heardAt) / 1000);
    const r: Result = { turn: ti, said, check, stars: said ? scoreTurn(said, turn).stars : 0, secs };
    setCur(r);
  }

  function giveUp() {
    stop();
    setCur({ turn: ti, said: "", check: { chips: [], score: 0, grade: "다시" }, stars: 0, secs: null });
  }

  function reset() {
    stop();
    token.current++;
    setCur(null);
    setHeardAt(null);
    setStartSecs(null);
  }

  function retry() {
    reset();
    void ask();
  }

  function next() {
    const all = [...results.filter((x) => x.turn !== ti), cur!];
    setResults(all);
    reset();
    if (i + 1 >= order.length) {
      const scored = turns.map((_, k) => all.find((x) => x.turn === k)).filter((x): x is Result => !!x);
      const percent = (scored.reduce((a, r) => a + value(r), 0) / turns.length) * 100;
      const slow = scored.filter((r) => value(r) < 1).map((r) => turns[r.turn].model);
      startTransition(() => saveVocaResult(deck, percent, slow, turns.length));
      setDone(true);
      return;
    }
    setI(i + 1);
  }

  function again(onlySlow: boolean) {
    const pick = onlySlow ? results.filter((r) => !fast(r.secs) || r.stars < 2).map((r) => r.turn) : turns.map((_, k) => k);
    setOrder(pick.length ? pick : turns.map((_, k) => k));
    setI(0);
    setDone(false);
  }

  if (done) {
    const fastCount = results.filter((r) => fast(r.secs) && r.said).length;
    const slowLeft = results.some((r) => !fast(r.secs) || r.stars < 2);
    return (
      <section className="flex flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center shadow-sm">
        <p className="text-4xl">{fastCount === turns.length ? "⚡" : fastCount > 0 ? "👏" : "💪"}</p>
        <p className="text-xl font-extrabold text-zinc-900">
          {turns.length}개 중 {fastCount}개를 3초 안에 대답했어요
        </p>
        <ul className="flex w-full flex-col gap-1.5 text-left">
          {turns.map((t, k) => {
            const r = results.find((x) => x.turn === k);
            const ok = r && fast(r.secs) && r.stars >= 2;
            return (
              <li key={k} className={`rounded-2xl px-3 py-2 text-sm ${ok ? "bg-slate-50" : "bg-amber-50"}`}>
                <span className="block text-xs text-zinc-500">{t.line}</span>
                <span className="font-semibold text-zinc-900">{t.model}</span>
                <span className="block text-xs font-bold text-zinc-500">
                  {!r || !r.said ? "모범 답 봄" : `${r.secs!.toFixed(1)}초 · ${"★".repeat(r.stars)}${"☆".repeat(3 - r.stars)}`}
                </span>
              </li>
            );
          })}
        </ul>
        <Link href={nextHref} className={primary}>
          롤플레잉으로 →
        </Link>
        {slowLeft && (
          <button type="button" onClick={() => again(true)} className="text-sm font-bold text-brand-700 underline">
            느렸던 것만 다시 하기
          </button>
        )}
        <button type="button" onClick={() => again(false)} className="text-sm font-bold text-zinc-500 underline">
          처음부터 다시
        </button>
      </section>
    );
  }

  if (!begun) {
    return (
      <section className="flex flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center shadow-sm">
        <p className="text-5xl">⚡</p>
        <p className="text-lg font-extrabold text-zinc-900">듣자마자 3초 안에 대답하기</p>
        <p className="text-sm leading-relaxed text-zinc-600">
          {who}의 말이 자막 없이 나와요. 말이 끝나면 3초를 세요.
          <br />
          완벽하지 않아도 괜찮으니 바로 🎤 말하거나 ⌨️ 쳐서 대답을 시작하세요.
        </p>
        <button type="button" onClick={() => setBegun(true)} className={primary}>
          ▶ 시작하기
        </button>
      </section>
    );
  }

  const waiting = heardAt === null;
  const elapsed = startSecs ?? (waiting ? 0 : Math.max(0, (now - heardAt) / 1000));
  const left = Math.max(0, LIMIT - elapsed);
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

      <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white p-5 text-center">
        {!cur ? (
          <>
            <p className="text-sm font-bold text-zinc-500">{waiting ? `${who} 말하는 중… 잘 들어 보세요` : startSecs !== null ? "좋아요, 계속 대답하세요!" : "지금 대답하세요!"}</p>
            {waiting ? (
              <span className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-brand-100 text-4xl">👂</span>
            ) : (
              <span
                className={`flex h-20 w-20 items-center justify-center rounded-full text-3xl font-black tabular-nums ${
                  startSecs !== null ? "bg-green-100 text-green-700" : left > 0 ? "bg-brand-600 text-white" : "bg-amber-100 text-amber-700"
                }`}
              >
                {startSecs !== null ? "✓" : left > 0 ? Math.ceil(left) : `${elapsed.toFixed(0)}s`}
              </span>
            )}
            {!waiting && startSecs === null && left === 0 && <p className="text-xs font-bold text-amber-700">3초가 지났어요. 그래도 지금 말해 보세요!</p>}
            <p className="text-xs text-zinc-500">💬 미션: {turn.mission}</p>
            <button type="button" onClick={() => void play(turn.line)} className={soft}>
              🔊 다시 듣기
            </button>
          </>
        ) : (
          <>
            <p className={`text-sm font-extrabold ${!cur.said ? "text-zinc-500" : fast(cur.secs) ? "text-green-600" : "text-amber-600"}`}>
              {!cur.said ? "이렇게 대답하면 돼요" : fast(cur.secs) ? `⚡ ${cur.secs!.toFixed(1)}초 만에 대답 시작!` : `⏱ ${cur.secs!.toFixed(1)}초 걸렸어요. 다음엔 더 빨리!`}
            </p>
            {cur.said && (
              <p className="text-lg text-amber-500">
                {"★".repeat(cur.stars)}
                <span className="text-slate-200">{"★".repeat(3 - cur.stars)}</span>
              </p>
            )}
            <p className="text-sm text-zinc-500">
              {who}: <span className="font-semibold text-zinc-800">{turn.line}</span>
              <span className="block text-xs">{turn.ko}</span>
            </p>
          </>
        )}
      </div>

      {!cur ? (
        <>
          <AnswerBox key={`${i}-${ti}`} target={turn.model} onStart={started} onAnswer={answer} voiceLabel="바로 말하기" placeholder="바로 영어로 쳐 보세요" />
          <button type="button" onClick={giveUp} className="text-sm font-bold text-zinc-500 underline">
            모르겠어요 · 모범 답 보기
          </button>
        </>
      ) : (
        <>
          {cur.said ? (
            <AnswerCompare said={cur.said} check={cur.check} />
          ) : null}
          <div className="flex items-center justify-between gap-2 rounded-2xl bg-brand-50/70 p-3">
            <span className="text-[15px] font-bold text-zinc-900">
              <span className="block text-xs font-bold text-brand-700">모범 답</span>
              {turn.model}
            </span>
            <button type="button" onClick={() => void play(turn.model)} className={soft} aria-label="모범 답 듣기">
              🔊
            </button>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={retry} className="flex-1 rounded-2xl bg-white py-3 font-bold text-brand-700 ring-2 ring-brand-100">
              다시 대답하기
            </button>
            <button type="button" onClick={next} className="flex-1 rounded-2xl border-b-4 border-brand-800 bg-brand-600 py-3 font-extrabold text-white active:translate-y-0.5">
              {i + 1 >= order.length ? "결과 보기" : "다음"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
