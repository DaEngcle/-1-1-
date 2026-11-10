"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import { useTts } from "@/app/_ui/audio/use-tts";
import { useSpeechRecognition } from "@/app/_ui/audio/use-speech-recognition";
import { ClozePrompt } from "@/app/_ui/practice/cloze-prompt";
import { isCorrect, splitExample, splitKorean } from "@/lib/classroom/course-drill";
import { checkSpoken, gradeValue, sameSentence, sentenceChips, shuffleChips, type SpokenCheck } from "@/lib/classroom/sentence-practice";
import { starsFor } from "@/lib/classroom/verbs";
import { saveVocaResult } from "./actions";
import { shuffle } from "./quiz-game";

/**
 * 문장 연습 한 개: 문장(example) 전체가 외울 단위이고, 표현(term)은 칠해서 보여 주기만 한다.
 * key가 없으면 term을 키로 쓴다 (같은 표현이 두 번 나오는 수업 문장은 key를 꼭 준다).
 */
export type SentenceItem = { key?: string; term: string; ko: string; example: string; example_ko: string; note?: string };
type Phrase = SentenceItem;
const keyOf = (x: SentenceItem) => x.key ?? x.term;

const primary =
  "w-full rounded-2xl border-b-4 border-teal-800 bg-teal-600 py-3 text-lg font-extrabold text-white active:translate-y-0.5 active:border-b-2 disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-400";
const soft = "rounded-full bg-teal-50 px-3 py-1.5 text-sm font-bold text-teal-700 active:translate-y-0.5";

/** 예문에서 표현 부분을 칠해서 보여 준다 */
function Highlighted({ example, term }: { example: string; term: string }) {
  const parts = splitExample(example, term);
  if (!parts) return <>{example}</>;
  return (
    <>
      {parts[0]}
      <mark className="rounded bg-teal-100 px-0.5 text-teal-800">{parts[1]}</mark>
      {parts[2]}
    </>
  );
}

function KoHighlighted({ x }: { x: Phrase }) {
  const parts = x.ko ? splitKorean(x.example_ko, x.ko) : null;
  if (!parts) return <>{x.example_ko}</>;
  return (
    <>
      {parts[0]}
      <b className="text-zinc-900">{parts[1]}</b>
      {parts[2]}
    </>
  );
}

function Progress({ at, total }: { at: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <span className="block h-full rounded-full bg-teal-500 transition-all" style={{ width: `${(at / total) * 100}%` }} />
      </span>
      <span className="text-xs font-bold text-zinc-500">
        {Math.min(at + 1, total)}/{total}
      </span>
    </div>
  );
}

/* ───────── 1. 문장으로 익히기 ───────── */

export function StudyCards({ items, onFinish }: { items: Phrase[]; onFinish: () => void }) {
  const [i, setI] = useState(0);
  const [showKo, setShowKo] = useState(false);
  const touchX = useRef<number | null>(null);
  const { play, stop } = useTts();
  const x = items[i];
  const last = i + 1 >= items.length;

  function go(n: number) {
    if (n < 0 || n >= items.length) return;
    stop();
    setShowKo(false);
    setI(n);
  }

  return (
    <section className="flex flex-col gap-3">
      <Progress at={i} total={items.length} />
      <div
        className="flex min-h-[260px] flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (dx < -50) go(i + 1);
          else if (dx > 50) go(i - 1);
        }}
      >
        <p className="text-sm font-bold text-teal-700">
          {x.term} {x.ko && <span className="font-normal text-zinc-500">· {x.ko}</span>}
        </p>
        <p className="text-[22px] font-bold leading-snug text-zinc-900">
          <Highlighted example={x.example} term={x.term} />
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => play(x.example)} className={soft}>
            🔊 듣기
          </button>
          <button type="button" onClick={() => play(x.example, "slow")} className={soft}>
            🐢 천천히
          </button>
        </div>
        {showKo ? (
          <p className="text-[15px] text-zinc-600">
            <KoHighlighted x={x} />
          </p>
        ) : (
          <button type="button" onClick={() => setShowKo(true)} className="self-start rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-500">
            번역 보기
          </button>
        )}
        {x.note && <p className="text-xs text-amber-700">💡 {x.note}</p>}
      </div>
      <p className="text-center text-xs text-zinc-400">소리 내서 두세 번 따라 읽고 넘기세요. 옆으로 밀어도 넘어가요.</p>
      <div className="grid grid-cols-[1fr_2fr] gap-2">
        <button
          type="button"
          onClick={() => go(i - 1)}
          disabled={i === 0}
          className="rounded-2xl bg-slate-100 py-3 text-lg font-extrabold text-zinc-600 disabled:text-zinc-300"
        >
          이전
        </button>
        <button type="button" onClick={() => (last ? onFinish() : go(i + 1))} className={primary}>
          {last ? "다 봤어요 →" : "다음"}
        </button>
      </div>
    </section>
  );
}

/* ───────── 2~4단계 공용: 한 판 진행 · 기록 ───────── */

type Turn = { x: Phrase; again: boolean };

/**
 * 한 판: 표현마다 처음 시도한 점수(0~1)만 기록하고, 틀린 건 판 끝에 한 번 더 낸다 (점수엔 안 들어감).
 * 판이 끝나면 기존 퀴즈와 같은 saveVocaResult로 한 번만 저장한다 (별·포인트·공부한 날).
 */
function useRound(items: Phrase[], deck: string) {
  const [queue, setQueue] = useState<Turn[]>(() => shuffle(items).map((x) => ({ x, again: false })));
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState<Map<string, number>>(new Map());
  const [done, setDone] = useState(false);
  const [, startTransition] = useTransition();
  const saved = useRef(false);

  function advance(value: number, requeue: boolean) {
    const turn = queue[idx];
    const nextScores = new Map(scores);
    if (!nextScores.has(keyOf(turn.x))) nextScores.set(keyOf(turn.x), value);
    setScores(nextScores);
    let nextQueue = queue;
    if (requeue && !turn.again) {
      nextQueue = [...queue, { x: turn.x, again: true }];
      setQueue(nextQueue);
    }
    if (idx + 1 < nextQueue.length) {
      setIdx(idx + 1);
      return;
    }
    setDone(true);
    if (saved.current) return;
    saved.current = true;
    const sum = items.reduce((s, x) => s + (nextScores.get(keyOf(x)) ?? 0), 0);
    const percent = (sum / items.length) * 100;
    const wrong = items.filter((x) => (nextScores.get(keyOf(x)) ?? 0) < 1).map(keyOf);
    startTransition(() => saveVocaResult(deck, percent, wrong, items.length));
  }

  function restart() {
    saved.current = false;
    setQueue(shuffle(items).map((x) => ({ x, again: false })));
    setIdx(0);
    setScores(new Map());
    setDone(false);
  }

  const sum = items.reduce((s, x) => s + (scores.get(keyOf(x)) ?? 0), 0);
  const percent = Math.round((sum / items.length) * 100);
  const missed = items.filter((x) => (scores.get(keyOf(x)) ?? 0) < 1);
  return { turn: queue[idx], idx, total: queue.length, done, advance, restart, percent, missed };
}

function StepDone({
  percent,
  missed,
  onRestart,
  nextLabel,
  onNext,
}: {
  percent: number;
  missed: Phrase[];
  onRestart: () => void;
  nextLabel: string | null;
  onNext: () => void;
}) {
  const { play } = useTts();
  const stars = starsFor(percent);
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col items-center gap-1 rounded-3xl border border-slate-200 bg-white p-5 text-center">
        <p className="text-3xl">
          {[1, 2, 3].map((n) => (
            <span key={n} className={n <= stars ? "" : "opacity-20 grayscale"}>
              ⭐
            </span>
          ))}
        </p>
        <p className="text-lg font-extrabold text-zinc-900">{percent}점</p>
        <p className="text-sm text-zinc-500">
          {percent >= 90 ? "이 세트 문장은 거의 다 입에 붙었어요." : percent >= 50 ? "좋아요. 아래 문장만 한 번 더 보면 돼요." : "처음엔 어려워요. 익히기부터 한 번 더 보고 오세요."}
        </p>
      </div>
      {missed.length > 0 && (
        <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold text-rose-600">다시 볼 문장 {missed.length}개</p>
          {missed.map((x) => (
            <button
              key={keyOf(x)}
              type="button"
              onClick={() => play(x.example, "slow")}
              className="flex items-start justify-between gap-2 border-b border-slate-100 py-2 text-left text-sm last:border-0"
            >
              <span>
                <span className="text-zinc-900">
                  <Highlighted example={x.example} term={x.term} />
                </span>
                <br />
                <span className="text-zinc-500">{x.example_ko}</span>
              </span>
              <span className="shrink-0">🔊</span>
            </button>
          ))}
        </div>
      )}
      {nextLabel && (
        <button type="button" onClick={onNext} className={primary}>
          다음 단계: {nextLabel} →
        </button>
      )}
      <button type="button" onClick={onRestart} className="rounded-2xl bg-slate-100 py-3 text-lg font-extrabold text-zinc-600">
        한 번 더 하기
      </button>
    </section>
  );
}

type StepProps = { items: Phrase[]; deck: string; nextLabel: string | null; onNext: () => void };

/* ───────── 2. 순서 맞추기 ───────── */

export function WordOrder(props: StepProps) {
  const r = useRound(props.items, props.deck);
  if (r.done) return <StepDone percent={r.percent} missed={r.missed} onRestart={r.restart} nextLabel={props.nextLabel} onNext={props.onNext} />;
  return (
    <section className="flex flex-col gap-3">
      <Progress at={r.idx} total={r.total} />
      <WordOrderCard key={r.idx} turn={r.turn} onNext={(ok) => r.advance(ok ? 1 : 0, !ok)} />
    </section>
  );
}

function WordOrderCard({ turn, onNext }: { turn: Turn; onNext: (ok: boolean) => void }) {
  const { x } = turn;
  const { play } = useTts();
  const [chips] = useState(() => sentenceChips(x.example));
  const [pool] = useState(() => shuffleChips(chips));
  const [built, setBuilt] = useState<number[]>([]);
  const [result, setResult] = useState<null | boolean>(null);

  function tap(n: number) {
    if (result !== null) return;
    const nb = [...built, n];
    setBuilt(nb);
    if (nb.length === chips.length) {
      const ok = sameSentence(nb.map((k) => chips[k]).join(" "), x.example);
      setResult(ok);
      void play(x.example, ok ? "normal" : "slow");
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5">
        {turn.again && <span className="self-start rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">다시 한 번</span>}
        <p className="text-xs font-bold text-zinc-500">영어 단어를 눌러 문장을 만들어 보세요</p>
        <p className="text-lg font-bold text-zinc-900">{x.example_ko}</p>
        <div
          className={`flex min-h-[64px] flex-wrap content-start gap-1.5 rounded-2xl border-2 border-dashed p-2 ${
            result === null ? "border-slate-200" : result ? "border-green-400 bg-green-50" : "border-red-300 bg-red-50"
          }`}
        >
          {built.map((k, pos) => (
            <button
              key={k}
              type="button"
              onClick={() => result === null && setBuilt(built.filter((_, p) => p !== pos))}
              className="rounded-xl bg-teal-600 px-2.5 py-1.5 text-[17px] font-bold text-white"
            >
              {chips[k]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {pool.map((k) => {
            const used = built.includes(k);
            return (
              <button
                key={k}
                type="button"
                disabled={used || result !== null}
                onClick={() => tap(k)}
                className={`rounded-xl px-2.5 py-1.5 text-[17px] font-bold ring-1 ${
                  used ? "bg-slate-50 text-transparent ring-slate-100" : "bg-white text-zinc-900 ring-slate-300 shadow-[0_2px_0_#cbd5e1]"
                }`}
              >
                {chips[k]}
              </button>
            );
          })}
        </div>
      </div>
      {result === null ? (
        <button type="button" onClick={() => setBuilt([])} disabled={built.length === 0} className="self-start text-sm font-bold text-zinc-500 underline disabled:text-zinc-300">
          처음부터 다시 놓기
        </button>
      ) : (
        <div className={`flex flex-col gap-2 rounded-2xl p-4 ${result ? "bg-green-50" : "bg-red-50"}`}>
          <p className={`text-lg font-extrabold ${result ? "text-green-700" : "text-red-600"}`}>{result ? "맞았어요!" : "순서가 달라요. 정답은"}</p>
          <button type="button" onClick={() => play(x.example, "slow")} className="flex items-start justify-between gap-2 text-left">
            <span className="text-base font-bold text-zinc-900">
              <Highlighted example={x.example} term={x.term} />
            </span>
            <span>🔊</span>
          </button>
          {!result && <p className="text-xs text-zinc-500">판 끝에 한 번 더 나와요.</p>}
          <button type="button" onClick={() => onNext(result)} className={primary}>
            다음
          </button>
        </div>
      )}
    </>
  );
}

/* ───────── 3. 빈칸 쓰기 ───────── */

export function TypeCloze(props: StepProps) {
  const r = useRound(props.items, props.deck);
  if (r.done) return <StepDone percent={r.percent} missed={r.missed} onRestart={r.restart} nextLabel={props.nextLabel} onNext={props.onNext} />;
  return (
    <section className="flex flex-col gap-3">
      <Progress at={r.idx} total={r.total} />
      <TypeClozeCard key={r.idx} turn={r.turn} onNext={(ok) => r.advance(ok ? 1 : 0, !ok)} />
    </section>
  );
}

function TypeClozeCard({ turn, onNext }: { turn: Turn; onNext: (ok: boolean) => void }) {
  const { x } = turn;
  const { play } = useTts();
  const [typed, setTyped] = useState("");
  const [hint, setHint] = useState(false);
  const [result, setResult] = useState<null | "right" | "wrong">(null);

  function check() {
    if (result || !typed.trim()) return;
    const ok = isCorrect(typed, x.term);
    setResult(ok ? "right" : "wrong");
    void play(x.example, ok ? "normal" : "slow");
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5">
        {turn.again && <span className="self-start rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">다시 한 번</span>}
        <p className="text-xs font-bold text-zinc-500">빈칸에 들어갈 표현을 써 보세요</p>
        <ClozePrompt
          item={x}
          typed={typed}
          onType={setTyped}
          result={result}
          hint={hint}
          onHint={() => setHint(true)}
          onEnter={() => (result ? onNext(result === "right") : check())}
          autoFocus={false}
        />
      </div>
      {!result ? (
        <button type="button" onClick={check} disabled={!typed.trim()} className={primary}>
          확인
        </button>
      ) : (
        <div className={`flex flex-col gap-2 rounded-2xl p-4 ${result === "right" ? "bg-green-50" : "bg-red-50"}`}>
          <p className={`text-lg font-extrabold ${result === "right" ? "text-green-700" : "text-red-600"}`}>
            {result === "right" ? "맞았어요!" : "아쉬워요. 판 끝에 한 번 더 나와요"}
          </p>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xl font-extrabold text-zinc-900">{x.term}</p>
              {x.ko && <p className="text-sm font-semibold text-zinc-700">{x.ko}</p>}
              {x.note && <p className="mt-1 text-xs text-zinc-500">💬 {x.note}</p>}
            </div>
            <button type="button" onClick={() => play(x.example, "slow")} aria-label="예문 듣기" className="shrink-0 rounded-full bg-white px-3 py-2 text-lg shadow-sm">
              🔊
            </button>
          </div>
          <p className="text-sm text-zinc-600">{x.example}</p>
          <button type="button" onClick={() => onNext(result === "right")} className={primary}>
            다음
          </button>
        </div>
      )}
    </>
  );
}

/* ───────── 4. 보고 말하기 ───────── */

export function SayIt(props: StepProps) {
  const r = useRound(props.items, props.deck);
  if (r.done) return <StepDone percent={r.percent} missed={r.missed} onRestart={r.restart} nextLabel={props.nextLabel} onNext={props.onNext} />;
  return (
    <section className="flex flex-col gap-3">
      <Progress at={r.idx} total={r.total} />
      <SayItCard key={r.idx} turn={r.turn} onNext={(value) => r.advance(value, false)} />
    </section>
  );
}

const GRADE_STYLE: Record<SpokenCheck["grade"], string> = {
  정확: "bg-green-100 text-green-700",
  거의: "bg-amber-100 text-amber-700",
  다시: "bg-rose-100 text-rose-600",
};

function SayItCard({ turn, onNext }: { turn: Turn; onNext: (value: number) => void }) {
  const { x } = turn;
  const { play } = useTts();
  const sr = useSpeechRecognition("en-AU");
  const [check, setCheck] = useState<SpokenCheck | null>(null);
  const [heard, setHeard] = useState<string | null>(null);
  const [best, setBest] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [termHint, setTermHint] = useState(false);

  function speak() {
    sr.listen((alts) => {
      // 후보 중 정답에 가장 가까운 것을 쓴다
      const scored = alts.map((a) => ({ a, c: checkSpoken(x.example, a) })).sort((p, q) => q.c.score - p.c.score);
      const top = scored[0];
      setHeard(top?.a ?? "");
      const c = top?.c ?? checkSpoken(x.example, "");
      setCheck(c);
      setBest((b) => Math.max(b, gradeValue(c.grade)));
      if (c.grade === "정확") void play(x.example);
    });
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-bold text-zinc-500">이 말을 영어 문장으로 말해 보세요</p>
        <p className="text-xl font-bold text-zinc-900">{x.example_ko}</p>
        {termHint ? (
          <p className="text-sm text-teal-700">
            💡 <b>{x.term}</b>{x.ko ? ` · ${x.ko}` : ""}
          </p>
        ) : (
          <button type="button" onClick={() => setTermHint(true)} className="self-start text-sm font-bold text-teal-700 underline">
            💡 표현 힌트
          </button>
        )}

        {check && (
          <div className="flex flex-col gap-1.5 rounded-2xl bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-sm font-extrabold ${GRADE_STYLE[check.grade]}`}>{check.grade}</span>
              <span className="text-xs text-zinc-500">{check.score}% 일치</span>
            </div>
            <p className="text-[17px] font-bold leading-relaxed">
              {check.chips.map((c, k) => (
                <span key={k} className={c.ok ? "text-green-600" : "text-zinc-300"}>
                  {c.text}{" "}
                </span>
              ))}
            </p>
            <p className="text-xs text-zinc-500">앱이 들은 말: {heard || "(알아듣지 못했어요)"}</p>
          </div>
        )}

        {reveal && (
          <p className="rounded-2xl bg-teal-50 p-3 text-[17px] font-bold text-zinc-900">
            <Highlighted example={x.example} term={x.term} />
          </p>
        )}

        {sr.supported === false ? (
          <p className="text-sm text-zinc-600">이 브라우저에서는 앱이 듣지 못해요. 소리 내어 말한 뒤 정답과 비교해 스스로 체크해 주세요.</p>
        ) : sr.supported ? (
          sr.listening ? (
            <button type="button" onClick={sr.stop} className="rounded-2xl border-2 border-red-400 bg-red-50 py-3 text-base font-extrabold text-red-600">
              ⏹ 듣고 있어요. 다 말했으면 누르세요
            </button>
          ) : (
            <button type="button" onClick={speak} className="rounded-2xl border-b-4 border-teal-800 bg-teal-600 py-3 text-base font-extrabold text-white active:translate-y-0.5 active:border-b-2">
              🎤 {check ? "다시 말하기" : "눌러서 말하기"}
            </button>
          )
        ) : null}
        {sr.error && <p className="text-sm text-red-600">{sr.error}</p>}

        <div className="flex gap-2">
          <button type="button" onClick={() => play(x.example, "slow")} className={soft}>
            🔊 들어보기
          </button>
          {!reveal && (
            <button type="button" onClick={() => setReveal(true)} className={soft}>
              정답 보기
            </button>
          )}
        </div>
      </div>

      {sr.supported === false ? (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setReveal(false);
              void play(x.example, "slow");
            }}
            className="rounded-2xl bg-slate-100 py-3 text-lg font-extrabold text-zinc-600"
          >
            다시
          </button>
          <button type="button" onClick={() => onNext(1)} className={primary}>
            말했어요
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => onNext(best)} disabled={!check && !reveal} className={primary}>
          다음
        </button>
      )}
    </>
  );
}

/* ───────── 단계 탭 (보카 표현 세트 · 과정별 수업 문장 공용) ───────── */

const STEPS = [
  { id: "study", tab: "듣기", title: "문장으로 익히기", guide: "문장째로 듣고 따라 읽어요. 칠한 부분이 핵심 표현이에요." },
  { id: "order", tab: "순서", title: "순서 맞추기", guide: "한국어를 보고 영어 단어를 순서대로 놓아 문장을 만들어요." },
  { id: "type", tab: "빈칸", title: "빈칸 쓰기", guide: "문장 속 핵심 표현을 직접 써요." },
  { id: "say", tab: "말하기", title: "보고 말하기", guide: "한국어를 보고 영어 문장 전체를 소리 내서 말해요." },
  { id: "quiz", tab: "퀴즈", title: "빠른 퀴즈", guide: "고르기 문제로 빠르게 확인해요." },
] as const;
type StepId = (typeof STEPS)[number]["id"];

/** 듣기 → 순서 맞추기 → 빈칸 → 보고 말하기 → (빠른 퀴즈). 처음 화면은 항상 '듣기' */
export function SentenceSteps({ items, deck, quiz }: { items: SentenceItem[]; deck: string; quiz: ReactNode }) {
  const [step, setStep] = useState<StepId>("study");
  const at = STEPS.findIndex((s) => s.id === step);
  const next = STEPS[at + 1] ?? null;

  function go(id: StepId) {
    setStep(id);
    window.scrollTo({ top: 0 });
  }

  const stepProps = { items, deck, nextLabel: next?.title ?? null, onNext: () => next && go(next.id) };

  return (
    <>
      <div className="grid grid-cols-5 gap-1 rounded-2xl bg-slate-100 p-1 text-xs font-bold">
        {STEPS.map((s, n) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(s.id)}
            className={`flex flex-col items-center rounded-xl py-1.5 ${step === s.id ? "bg-white text-teal-700 shadow-sm" : "text-zinc-500"}`}
          >
            <span className="text-[10px] text-zinc-400">{s.id === "quiz" ? "+" : n + 1}</span>
            {s.tab}
          </button>
        ))}
      </div>
      <div>
        <h2 className="text-base font-extrabold text-zinc-900">{STEPS[at].title}</h2>
        <p className="text-xs text-zinc-500">{STEPS[at].guide}</p>
      </div>
      {step === "study" && <StudyCards items={items} onFinish={() => go("order")} />}
      {step === "order" && <WordOrder {...stepProps} />}
      {step === "type" && <TypeCloze {...stepProps} />}
      {step === "say" && <SayIt {...stepProps} />}
      {step === "quiz" && quiz}
    </>
  );
}
