"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRecorder } from "@/app/_ui/audio/use-recorder";
import { toWav16kMono } from "@/app/_ui/audio/wav";
import { SkillBars } from "@/app/_ui/skill-bars";
import { levelInfo } from "@/lib/classroom/levels";

interface Questions {
  dictation: { id: string }[];
  dialogues: { id: string; lineCount: number; question: string; choices: string[] }[];
  responses: { id: string; prompt: string; choices: string[] }[];
  blanks: { id: string; sentence: string; ko: string }[];
  speaking: { id: string; question: string; ko: string }[];
}

interface Answers {
  dictation: Record<string, string>;
  dialogues: Record<string, number>;
  responses: Record<string, number>;
  blanks: Record<string, string>;
}

type Result = {
  listening: number;
  grammar: number;
  speaking: number;
  total: number;
  level: number;
  skills: { listening: number; grammar: number; pronunciation: number; fluency: number; range: number };
};

const SECTIONS = ["🎧 듣기 ① 받아쓰기", "🎧 듣기 ② 대화", "✏️ 문법·어휘", "🗣 말하기"] as const;
const DICTATION_PLAYS = 3;
const DIALOGUE_PLAYS = 2;
const MAX_SPEAK_SECONDS = 45;

const btn = "rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-40";
const primary = `${btn} border-b-4 border-brand-800 bg-brand-600 text-white active:translate-y-0.5 active:border-b-2`;
const secondary = `${btn} border-slate-200 bg-white text-slate-700 hover:bg-brand-50`;
const card = "flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm";

/** 문제 음성 재생 (대본은 서버에만 있고, id로 mp3만 받아온다) */
function useTestAudio() {
  const cache = useRef(new Map<string, string>());
  const current = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  async function url(audioId: string) {
    let u = cache.current.get(audioId);
    if (!u) {
      const res = await fetch(`/api/level-test?audio=${encodeURIComponent(audioId)}`);
      if (!res.ok) throw new Error("audio");
      u = URL.createObjectURL(await res.blob());
      cache.current.set(audioId, u);
    }
    return u;
  }

  async function playSequence(key: string, audioIds: string[]) {
    current.current?.pause();
    setPlaying(key);
    try {
      for (const id of audioIds) {
        const audio = new Audio(await url(id));
        current.current = audio;
        await new Promise<void>((resolve) => {
          audio.onended = () => setTimeout(resolve, 350);
          audio.onerror = () => resolve();
          void audio.play().catch(() => resolve());
        });
      }
    } catch {
      alert("음성을 불러오지 못했어요. 잠시 후 다시 눌러주세요.");
    } finally {
      setPlaying(null);
    }
  }

  useEffect(() => () => current.current?.pause(), []);
  return { playing, playSequence };
}

export function LevelTestRunner({
  kind,
  questions,
  answeredSpeaking,
}: {
  kind: "pre" | "post";
  questions: Questions;
  answeredSpeaking: string[];
}) {
  const storageKey = `level-test:${kind}`;
  const [section, setSection] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ dictation: {}, dialogues: {}, responses: {}, blanks: {} });
  const [plays, setPlays] = useState<Record<string, number>>({});
  const [spoken, setSpoken] = useState<string[]>(answeredSpeaking);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const { playing, playSequence } = useTestAudio();
  const loaded = useRef(false);

  // 중간에 나가도 이어서: 쓴 답·들은 횟수·진행 위치를 이 기기에 저장
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      // localStorage는 브라우저에 그려진 뒤에만 읽을 수 있어서 마운트 후 한 번 복원한다
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved?.answers) setAnswers(saved.answers);
      if (saved?.plays) setPlays(saved.plays);
      if (Number.isInteger(saved?.section)) setSection(saved.section);
    } catch {}
    loaded.current = true;
  }, [storageKey]);
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ answers, plays, section }));
    } catch {}
  }, [storageKey, answers, plays, section]);

  function set<K extends keyof Answers>(group: K, id: string, value: Answers[K][string]) {
    setError(null);
    setAnswers((a) => ({ ...a, [group]: { ...a[group], [id]: value } }));
  }

  function play(key: string, audioIds: string[], limit: number) {
    if ((plays[key] ?? 0) >= limit || playing) return;
    setPlays((p) => ({ ...p, [key]: (p[key] ?? 0) + 1 }));
    void playSequence(key, audioIds);
  }

  function next() {
    const missing =
      section === 0
        ? questions.dictation.filter((q) => !answers.dictation[q.id]?.trim()).length
        : section === 1
          ? questions.dialogues.filter((q) => !(q.id in answers.dialogues)).length
          : section === 2
            ? questions.responses.filter((q) => !(q.id in answers.responses)).length +
              questions.blanks.filter((q) => !answers.blanks[q.id]?.trim()).length
            : 0;
    if (missing > 0) {
      setError(`아직 답하지 않은 문제가 ${missing}개 있어요. 모르면 짐작해서라도 적어주세요.`);
      return;
    }
    setError(null);
    setSection((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function finish() {
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("action", "finish");
      form.append("kind", kind);
      form.append("answers", JSON.stringify(answers));
      const res = await fetch("/api/level-test", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "제출에 실패했어요.");
        return;
      }
      try {
        localStorage.removeItem(storageKey);
      } catch {}
      setResult(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("제출 중 문제가 생겼어요. 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    const info = levelInfo(result.level);
    return (
      <section className={`${card} items-center p-6 text-center`}>
        <span className="text-sm text-zinc-500">{kind === "pre" ? "수강 전" : "수강 후"} 레벨테스트 결과</span>
        <span className="text-5xl font-extrabold text-brand-600">Lv.{result.level}</span>
        <span className="text-lg font-bold text-zinc-900">{info.name}</span>
        <span className="text-sm text-zinc-600">{info.desc}</span>
        <div className="mt-2 grid w-full grid-cols-4 gap-2 text-sm">
          {[
            ["종합", result.total],
            ["듣기", result.listening],
            ["문법", result.grammar],
            ["말하기", result.speaking],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-brand-50 p-2">
              <div className="text-xs text-brand-700">{label}</div>
              <div className="text-xl font-bold text-zinc-900">{value}</div>
            </div>
          ))}
        </div>
        <div className="w-full text-left">
          <SkillBars current={result.skills} />
        </div>
        <Link href="/student" className={`${primary} mt-2`}>
          내 홈으로
        </Link>
      </section>
    );
  }

  const progress = Math.round((section / SECTIONS.length) * 100);
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs font-semibold text-zinc-500">
          <span>{SECTIONS[section]}</span>
          <span>
            {section + 1}/{SECTIONS.length} 단계
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {section === 0 && (
        <>
          <p className="text-sm text-zinc-600">
            원어민 문장을 듣고 <b>들리는 그대로</b> 영어로 적어주세요. 문장마다 {DICTATION_PLAYS}번까지 들을 수 있어요.
          </p>
          {questions.dictation.map((q, i) => {
            const left = DICTATION_PLAYS - (plays[q.id] ?? 0);
            return (
              <article key={q.id} className={card}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-brand-600">{i + 1}.</span>
                  <button
                    type="button"
                    onClick={() => play(q.id, [q.id], DICTATION_PLAYS)}
                    disabled={left <= 0 || !!playing}
                    className={secondary}
                  >
                    {playing === q.id ? "🔊 재생 중..." : `▶ 듣기 (${left}번 남음)`}
                  </button>
                </div>
                <input
                  value={answers.dictation[q.id] ?? ""}
                  onChange={(e) => set("dictation", q.id, e.target.value)}
                  placeholder="들리는 대로 영어로 적어주세요"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-base focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                />
              </article>
            );
          })}
        </>
      )}

      {section === 1 && (
        <>
          <p className="text-sm text-zinc-600">
            두 사람의 대화를 듣고 질문에 답하세요. 대화는 <b>{DIALOGUE_PLAYS}번까지</b> 들을 수 있어요.
          </p>
          {questions.dialogues.map((q, i) => {
            const left = DIALOGUE_PLAYS - (plays[q.id] ?? 0);
            return (
              <article key={q.id} className={card}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-brand-600">{i + 1}.</span>
                  <button
                    type="button"
                    onClick={() =>
                      play(q.id, Array.from({ length: q.lineCount }, (_, n) => `${q.id}:${n}`), DIALOGUE_PLAYS)
                    }
                    disabled={left <= 0 || !!playing}
                    className={secondary}
                  >
                    {playing === q.id ? "🔊 대화 재생 중..." : `▶ 대화 듣기 (${left}번 남음)`}
                  </button>
                </div>
                <p className="font-semibold text-zinc-900">{q.question}</p>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {q.choices.map((c, ci) => (
                    <label
                      key={ci}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                        answers.dialogues[q.id] === ci ? "border-brand-400 bg-brand-50 font-semibold" : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={answers.dialogues[q.id] === ci}
                        onChange={() => set("dialogues", q.id, ci)}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </article>
            );
          })}
        </>
      )}

      {section === 2 && (
        <>
          <p className="text-sm text-zinc-600">가장 자연스러운 대답을 고르고, 빈칸에 들어갈 영어 단어를 하나 적어주세요.</p>
          {questions.responses.map((q, i) => (
            <article key={q.id} className={card}>
              <p className="font-semibold text-zinc-900">
                <span className="mr-1 text-brand-600">{i + 1}.</span> A: &ldquo;{q.prompt}&rdquo;
                <span className="ml-1 text-zinc-500">B: ______</span>
              </p>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {q.choices.map((c, ci) => (
                  <label
                    key={ci}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                      answers.responses[q.id] === ci ? "border-brand-400 bg-brand-50 font-semibold" : "border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers.responses[q.id] === ci}
                      onChange={() => set("responses", q.id, ci)}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </article>
          ))}
          {questions.blanks.map((q, i) => (
            <article key={q.id} className={card}>
              <p className="font-semibold text-zinc-900">
                <span className="mr-1 text-brand-600">{questions.responses.length + i + 1}.</span> {q.sentence}
              </p>
              <p className="text-xs text-zinc-500">{q.ko}</p>
              <input
                value={answers.blanks[q.id] ?? ""}
                onChange={(e) => set("blanks", q.id, e.target.value)}
                placeholder="빈칸에 들어갈 단어 하나"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-base focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              />
            </article>
          ))}
        </>
      )}

      {section === 3 && (
        <>
          <p className="text-sm text-zinc-600">
            영어 질문에 <b>영어로 자유롭게</b> 대답해 주세요. 정답은 없어요. 아는 단어로 최대한 길게 말할수록 좋아요. (최대{" "}
            {MAX_SPEAK_SECONDS}초)
          </p>
          {questions.speaking.map((q, i) => (
            <SpeakingItem
              key={q.id}
              kind={kind}
              index={i + 1}
              question={q}
              done={spoken.includes(q.id)}
              playing={playing === q.id}
              onPlayQuestion={() => void playSequence(q.id, [q.id])}
              onDone={() => setSpoken((s) => [...new Set([...s, q.id])])}
            />
          ))}
        </>
      )}

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      <div className="flex justify-between gap-2">
        {section > 0 ? (
          <button type="button" onClick={() => setSection((s) => s - 1)} className={secondary}>
            ← 이전
          </button>
        ) : (
          <span />
        )}
        {section < SECTIONS.length - 1 ? (
          <button type="button" onClick={next} className={primary}>
            다음 단계 →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              const left = questions.speaking.filter((q) => !spoken.includes(q.id)).length;
              if (left > 0) setError(`말하기 ${left}문제가 남았어요. 어려우면 '건너뛰기'를 눌러주세요.`);
              else void finish();
            }}
            disabled={busy}
            className={primary}
          >
            {busy ? "결과 계산 중..." : "제출하고 내 레벨 보기"}
          </button>
        )}
      </div>
    </section>
  );
}

function SpeakingItem({
  kind,
  index,
  question,
  done,
  playing,
  onPlayQuestion,
  onDone,
}: {
  kind: string;
  index: number;
  question: { id: string; question: string; ko: string };
  done: boolean;
  playing: boolean;
  onPlayQuestion: () => void;
  onDone: () => void;
}) {
  const recorder = useRecorder(MAX_SPEAK_SECONDS);
  const [showKo, setShowKo] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(skip: boolean) {
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("action", "speaking");
      form.append("kind", kind);
      form.append("questionId", question.id);
      if (skip) form.append("skip", "true");
      else if (recorder.blob) form.append("audio", await toWav16kMono(recorder.blob), "answer.wav");
      const res = await fetch("/api/level-test", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "제출에 실패했어요.");
      else onDone();
    } catch {
      setError("녹음 처리 중 문제가 생겼어요. 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className={`${card} ${done ? "border-green-200 bg-green-50/40" : ""}`}>
      <div className="flex items-start gap-2">
        <span className="text-sm font-bold text-brand-600">{index}.</span>
        <p className="text-lg font-semibold leading-snug text-zinc-900">{question.question}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onPlayQuestion} disabled={playing} className={secondary}>
          {playing ? "🔊 재생 중..." : "▶ 질문 듣기"}
        </button>
        <button type="button" onClick={() => setShowKo((v) => !v)} className={secondary}>
          {showKo ? "힌트 닫기" : "🇰🇷 한국어 힌트"}
        </button>
      </div>
      {showKo && <p className="rounded-xl bg-slate-50 p-2 text-sm text-zinc-600">{question.ko}</p>}

      {done ? (
        <p className="text-sm font-semibold text-green-700">✅ 제출 완료</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {recorder.recording ? (
              <button type="button" onClick={recorder.stop} className={`${btn} border-red-400 bg-red-50 text-red-700`}>
                ■ 녹음 끝내기 ({recorder.seconds}/{MAX_SPEAK_SECONDS}s)
              </button>
            ) : (
              <button
                type="button"
                onClick={recorder.start}
                disabled={busy}
                className={`${btn} border-zinc-900 bg-zinc-900 text-white`}
              >
                🎙 {recorder.url ? "다시 녹음" : "대답 녹음하기"}
              </button>
            )}
            {!recorder.recording && !recorder.url && (
              <button type="button" onClick={() => void send(true)} disabled={busy} className="text-xs text-zinc-400 underline">
                건너뛰기 (0점)
              </button>
            )}
          </div>
          {recorder.url && !recorder.recording && (
            <div className="flex flex-wrap items-center gap-2">
              <audio src={recorder.url} controls className="h-9 max-w-full" />
              <button type="button" onClick={() => void send(false)} disabled={busy} className={primary}>
                {busy ? "채점 중..." : "제출"}
              </button>
            </div>
          )}
          {(error ?? recorder.error) && <p className="text-sm text-red-600">{error ?? recorder.error}</p>}
        </>
      )}
    </article>
  );
}
