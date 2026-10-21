"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useTts } from "@/app/_ui/audio/use-tts";
import { CatSprite } from "@/app/_ui/cat";
import { useMyCat } from "@/app/_ui/cat-context";
import { PATTERN_INFO, regularized, starsFor, type Verb } from "@/lib/classroom/verbs";
import { saveVocaResult } from "../../actions";

const SECONDS = 10;
const HEARTS = 3;

/** 읽어줄 문장: "make, made, made" */
const say = (v: Verb) => `${v.base}, ${v.past.replace(" / ", ", ")}, ${v.pp}`;
const triplet = (v: Verb) => `${v.base} – ${v.past} – ${v.pp}`;

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Question = { verb: Verb; kind: "past" | "pp" | "triplet"; prompt: React.ReactNode; answer: string; choices: string[] };

function makeQuestion(verb: Verb, all: Verb[]): Question {
  const kind = (["past", "pp", "triplet"] as const)[Math.floor(Math.random() * 3)];
  const reg = regularized(verb.base);
  const others = shuffle(all.filter((o) => o.base !== verb.base));
  let answer: string;
  let pool: string[];
  let prompt: React.ReactNode;
  if (kind === "past") {
    answer = verb.past;
    pool = [reg, verb.pp, verb.base, `${verb.past}ed`, ...others.map((o) => o.past)];
    prompt = (
      <>
        <b className="text-violet-700">{verb.base}</b>의 <b>과거형</b>은?
      </>
    );
  } else if (kind === "pp") {
    answer = verb.pp;
    pool = [reg, verb.past, `${verb.base}en`, verb.base, `${verb.pp}en`, ...others.map((o) => o.pp)];
    prompt = (
      <>
        <b className="text-violet-700">{verb.base}</b>의 <b>과거분사(p.p.)</b>는?
      </>
    );
  } else {
    answer = triplet(verb);
    pool = [
      `${verb.base} – ${reg} – ${reg}`,
      `${verb.base} – ${verb.pp} – ${verb.past}`,
      `${verb.base} – ${verb.past} – ${verb.past.split(" / ")[0]}en`,
      `${verb.base} – ${verb.base} – ${verb.base}`,
      `${verb.base} – ${verb.past} – ${reg}`,
    ];
    prompt = (
      <>
        <b className="text-violet-700">“{verb.ko}”</b> 3단변화는?
      </>
    );
  }
  const wrong = [...new Set(pool)].filter((c) => c && c !== answer).slice(0, 3);
  return { verb, kind, prompt, answer, choices: shuffle([answer, ...wrong]) };
}

/** 짧은 효과음 (파일 없이) */
function beep(ok: boolean) {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const notes = ok ? [660, 990] : [220, 160];
    notes.forEach((f, i) => {
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
  const cat = useMyCat();
  const { play } = useTts();
  const [round, setRound] = useState(0);
  const [pool, setPool] = useState<Verb[]>(verbs);
  const questions = useMemo(
    () => shuffle(pool).map((v) => makeQuestion(v, verbs)),
    // 판(round)이 바뀔 때마다 새로 섞는다
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pool, round],
  );
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [hearts, setHearts] = useState(HEARTS);
  const [combo, setCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState<Verb[]>([]);
  const [left, setLeft] = useState(SECONDS);
  const [done, setDone] = useState(false);
  const [, startTransition] = useTransition();
  const saved = useRef(false);
  const q = questions[i];

  // 타이머: 시간이 다 되면 틀린 걸로
  useEffect(() => {
    if (done || picked) return;
    const started = Date.now();
    const t = setInterval(() => {
      const remain = SECONDS - (Date.now() - started) / 1000;
      setLeft(Math.max(0, remain));
      if (remain <= 0) {
        clearInterval(t);
        choose("⏰");
      }
    }, 100);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, done, picked, round]);

  function finish(finalCorrect: number, finalWrong: Verb[]) {
    setDone(true);
    if (saved.current) return;
    saved.current = true;
    const percent = (finalCorrect / questions.length) * 100;
    // 틀린 것만 다시 하는 판은 기록하지 않는다 (세트 점수가 왜곡되니까)
    if (pool.length === verbs.length) {
      startTransition(() => saveVocaResult(`verbs-${setId}`, percent, finalWrong.map((v) => v.base)));
    }
  }

  function choose(c: string) {
    if (picked || done) return;
    setPicked(c);
    const ok = c === q.answer;
    beep(ok);
    const nextCorrect = correct + (ok ? 1 : 0);
    const nextWrong = ok ? wrong : [...wrong, q.verb];
    if (ok) {
      setCorrect(nextCorrect);
      setCombo((n) => n + 1);
      setXp((x) => x + 10 + Math.min(combo, 5) * 2);
      setTimeout(() => advance(nextCorrect, nextWrong, hearts), 800);
    } else {
      setWrong(nextWrong);
      setCombo(0);
      const h = hearts - 1;
      setHearts(h);
      play(say(q.verb), "slow");
      if (h <= 0) setTimeout(() => finish(nextCorrect, nextWrong), 1400);
    }
  }

  function advance(c = correct, w = wrong, h = hearts) {
    if (h <= 0) return finish(c, w);
    if (i + 1 >= questions.length) return finish(c, w);
    setPicked(null);
    setLeft(SECONDS);
    setI((n) => n + 1);
  }

  function restart(only?: Verb[]) {
    saved.current = false;
    setPool(only ?? verbs);
    setRound((r) => r + 1);
    setI(0);
    setPicked(null);
    setHearts(HEARTS);
    setCombo(0);
    setXp(0);
    setCorrect(0);
    setWrong([]);
    setLeft(SECONDS);
    setDone(false);
  }

  if (done) {
    const percent = Math.round((correct / questions.length) * 100);
    const stars = starsFor(percent);
    const gameOver = hearts <= 0;
    return (
      <section className="flex flex-col items-center gap-3 rounded-3xl bg-white p-5 text-center shadow-sm">
        {cat && (
          <CatSprite breed={cat.breed} mood={stars >= 3 ? "cheer" : stars >= 1 ? "happy" : "sad"} className="h-20 w-24" />
        )}
        <p className="text-3xl tracking-tight">
          {[1, 2, 3].map((n) => (
            <span key={n} className={n <= stars ? "" : "opacity-20 grayscale"}>
              ⭐
            </span>
          ))}
        </p>
        <p className="text-2xl font-extrabold text-zinc-900">
          {correct}/{questions.length} 정답 · {percent}%
        </p>
        <p className="text-sm font-bold text-violet-700">
          {cat?.name ? `${cat.name}: ` : ""}
          {gameOver
            ? "하트를 다 썼어… 외우기 한 번 더 보고 다시 도전하자 💪"
            : stars >= 3
              ? "완벽해! 이 세트는 마스터 🎉"
              : stars >= 1
                ? "좋아! 틀린 것만 다시 하면 별 3개 가능 🔥"
                : "괜찮아, 외우기부터 천천히 다시 해보자"}
        </p>
        <p className="text-xs text-zinc-500">+{xp} XP</p>
        {wrong.length > 0 && (
          <div className="flex w-full flex-col gap-1 rounded-2xl bg-rose-50 p-3 text-left">
            <p className="text-xs font-bold text-rose-700">틀린 동사</p>
            {wrong.map((v) => (
              <button
                key={v.base}
                type="button"
                onClick={() => play(say(v), "slow")}
                className="flex items-center justify-between text-sm"
              >
                <span>
                  <b>{triplet(v)}</b> <span className="text-zinc-500">{v.ko}</span>
                </span>
                <span>🔊</span>
              </button>
            ))}
          </div>
        )}
        <div className="flex w-full flex-col gap-2">
          {wrong.length > 0 && (
            <button
              type="button"
              onClick={() => restart([...new Map(wrong.map((v) => [v.base, v])).values()])}
              className="rounded-2xl border-b-4 border-rose-700 bg-rose-500 py-3 font-extrabold text-white active:translate-y-0.5 active:border-b-2"
            >
              🔁 틀린 것만 다시
            </button>
          )}
          <button
            type="button"
            onClick={() => restart()}
            className="rounded-2xl border-b-4 border-violet-800 bg-violet-600 py-3 font-extrabold text-white active:translate-y-0.5 active:border-b-2"
          >
            처음부터 다시
          </button>
          {nextSetId && stars > 0 && (
            <Link
              href={`/student/voca/verbs/${nextSetId}`}
              className="rounded-2xl border-2 border-violet-200 py-3 font-extrabold text-violet-700"
            >
              다음 세트 →
            </Link>
          )}
        </div>
      </section>
    );
  }

  const answered = picked !== null;
  return (
    <section className="flex flex-col gap-3">
      {/* 상단: 하트 · 진행 · 콤보 */}
      <div className="flex items-center gap-2">
        <span className="text-lg tracking-tighter">
          {Array.from({ length: HEARTS }, (_, n) => (
            <span key={n} className={n < hearts ? "" : "opacity-20 grayscale"}>
              ❤️
            </span>
          ))}
        </span>
        <span className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
          <span
            className="block h-full rounded-full bg-violet-500 transition-all"
            style={{ width: `${((i + (answered ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </span>
        <span className="text-xs font-bold text-zinc-500">
          {i + 1}/{questions.length}
        </span>
      </div>
      {combo >= 2 && (
        <p className="animate-pulse text-center text-sm font-extrabold text-orange-500">🔥 {combo} 콤보!</p>
      )}

      <div className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-sm">
        {/* 남은 시간 */}
        <span className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <span
            className={`block h-full ${left < 3 ? "bg-rose-500" : "bg-emerald-400"}`}
            style={{ width: `${(left / SECONDS) * 100}%` }}
          />
        </span>
        <p className="text-center text-xl text-zinc-900">{q.prompt}</p>
        <div className="grid grid-cols-1 gap-2">
          {q.choices.map((c) => {
            const isAnswer = c === q.answer;
            const isPicked = c === picked;
            return (
              <button
                key={c}
                type="button"
                disabled={answered}
                onClick={() => choose(c)}
                className={`rounded-2xl border-2 border-b-4 px-4 py-3 text-lg font-bold transition-all active:translate-y-0.5 ${
                  answered && isAnswer
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                    : answered && isPicked
                      ? "border-rose-400 bg-rose-50 text-rose-700"
                      : "border-slate-200 bg-white text-zinc-800 hover:border-violet-300"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
        {answered && picked !== q.answer && (
          <div className="flex flex-col gap-2 rounded-2xl bg-rose-50 p-3">
            <p className="text-sm text-rose-800">
              {picked === "⏰" ? "⏰ 시간 초과! " : ""}정답: <b>{triplet(q.verb)}</b> ({q.verb.ko})
            </p>
            {q.verb.note && <p className="text-xs text-amber-700">💡 {q.verb.note}</p>}
            {hearts > 0 && (
              <button
                type="button"
                onClick={() => advance()}
                className="rounded-xl bg-rose-500 py-2 font-bold text-white"
              >
                다음 →
              </button>
            )}
          </div>
        )}
      </div>
      <p className="text-center text-xs text-zinc-400">+{xp} XP</p>
    </section>
  );
}
