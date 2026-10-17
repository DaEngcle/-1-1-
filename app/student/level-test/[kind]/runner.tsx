"use client";

import Link from "next/link";
import { useState } from "react";
import { useTts } from "@/app/_ui/audio/use-tts";
import { useRecorder } from "@/app/_ui/audio/use-recorder";
import { toWav16kMono } from "@/app/_ui/audio/wav";
import { levelInfo } from "@/lib/classroom/levels";

interface Props {
  kind: "pre" | "post";
  speaking: { id: string; sentence: string }[];
  listening: { id: string; sentence: string; choices: string[] }[];
  answeredSpeaking: Record<string, number>;
}

type Result = { speaking: number; listening: number; total: number; level: number };

const btn = "rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50";

export function LevelTestRunner({ kind, speaking, listening, answeredSpeaking }: Props) {
  const firstUnanswered = speaking.findIndex((q) => !(q.id in answeredSpeaking));
  const [step, setStep] = useState(firstUnanswered === -1 ? speaking.length : firstUnanswered);
  const [done, setDone] = useState<Record<string, number>>(answeredSpeaking);
  const [choices, setChoices] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const recorder = useRecorder(30);
  const { play, playingKey } = useTts();

  const total = speaking.length + listening.length;
  const isSpeaking = step < speaking.length;

  async function submitSpeaking(questionId: string) {
    if (!recorder.blob) return;
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("action", "speaking");
      form.append("kind", kind);
      form.append("questionId", questionId);
      form.append("audio", await toWav16kMono(recorder.blob), "answer.wav");
      const res = await fetch("/api/level-test", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "제출에 실패했어요.");
        return;
      }
      setDone((d) => ({ ...d, [questionId]: data.score }));
      recorder.reset();
      setStep((s) => s + 1);
    } catch {
      setError("녹음 처리 중 문제가 생겼어요. 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function finish() {
    const missing = listening.filter((q) => !(q.id in choices)).length;
    if (missing > 0) {
      setError(`아직 고르지 않은 문제가 ${missing}개 있어요.`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("action", "finish");
      form.append("kind", kind);
      form.append("listening", JSON.stringify(choices));
      const res = await fetch("/api/level-test", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "제출에 실패했어요.");
      else setResult(data);
    } catch {
      setError("제출 중 문제가 생겼어요. 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    const info = levelInfo(result.level);
    return (
      <section className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-brand-900/5 p-6 text-center">
        <span className="text-sm text-zinc-500">{kind === "pre" ? "수강 전" : "수강 후"} 레벨테스트 결과</span>
        <span className="text-4xl font-bold text-brand-700">Lv.{result.level}</span>
        <span className="text-lg font-semibold text-zinc-900">{info.name}</span>
        <span className="text-sm text-zinc-600">{info.desc}</span>
        <div className="mt-2 grid w-full grid-cols-3 gap-2 text-sm">
          {[
            ["종합", result.total],
            ["말하기", result.speaking],
            ["듣기", result.listening],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-zinc-50 p-2">
              <div className="text-xs text-zinc-500">{label}</div>
              <div className="text-xl font-bold text-zinc-900">{value}</div>
            </div>
          ))}
        </div>
        <Link href="/student" className={`${btn} mt-2 border-b-4 border-brand-800 bg-brand-600 text-white active:translate-y-0.5 active:border-b-2`}>
          내 홈으로
        </Link>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>{isSpeaking ? "1부 · 말하기" : "2부 · 듣기"}</span>
          <span>
            {Math.min(step, speaking.length) + Object.keys(choices).length}/{total}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full bg-brand-500 transition-all"
            style={{ width: `${((Math.min(step, speaking.length) + Object.keys(choices).length) / total) * 100}%` }}
          />
        </div>
      </div>

      {isSpeaking ? (
        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-brand-900/5 p-5">
          <p className="text-sm text-zinc-500">
            말하기 {step + 1}/{speaking.length} · 문장을 소리 내어 읽고 녹음하세요. (한 번 들어볼 수 있어요)
          </p>
          <p className="text-2xl font-semibold leading-relaxed text-zinc-900">{speaking[step].sentence}</p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => play(speaking[step].sentence, "normal", `s:${step}`)}
              className={`${btn} border-zinc-300 bg-white`}
            >
              {playingKey === `s:${step}` ? "재생 중..." : "▶ 들어보기"}
            </button>
            {recorder.recording ? (
              <button type="button" onClick={recorder.stop} className={`${btn} border-red-400 bg-red-50 text-red-700`}>
                ■ 녹음 끝내기 ({recorder.seconds}s)
              </button>
            ) : (
              <button
                type="button"
                onClick={recorder.start}
                disabled={busy}
                className={`${btn} border-zinc-900 bg-zinc-900 text-white`}
              >
                🎙 {recorder.url ? "다시 녹음" : "녹음하기"}
              </button>
            )}
          </div>
          {recorder.url && !recorder.recording && (
            <div className="flex flex-wrap items-center gap-2">
              <audio src={recorder.url} controls className="h-9 max-w-full" />
              <button
                type="button"
                onClick={() => submitSpeaking(speaking[step].id)}
                disabled={busy}
                className={`${btn} border-b-4 border-brand-800 bg-brand-600 text-white active:translate-y-0.5 active:border-b-2`}
              >
                {busy ? "채점 중..." : "제출하고 다음 →"}
              </button>
            </div>
          )}
          {(error ?? recorder.error) && <p className="text-sm text-red-600">{error ?? recorder.error}</p>}
          <p className="text-xs text-zinc-400">
            완료한 문장: {Object.keys(done).length}/{speaking.length} · 중간에 나가도 이어서 볼 수 있어요.
          </p>
        </article>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-zinc-600">
            듣기 {listening.length}문제 · ▶를 눌러 듣고 알맞은 뜻을 고르세요. 여러 번 들어도 돼요.
          </p>
          {listening.map((q, i) => (
            <article key={q.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-brand-900/5 p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-500">{i + 1}.</span>
                <button
                  type="button"
                  onClick={() => play(q.sentence, "normal", q.id)}
                  className={`${btn} border-zinc-300 bg-white py-1.5`}
                >
                  {playingKey === q.id ? "재생 중..." : "▶ 듣기"}
                </button>
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {q.choices.map((c, ci) => (
                  <label
                    key={ci}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                      choices[q.id] === ci ? "border-brand-400 bg-brand-50" : "border-zinc-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={choices[q.id] === ci}
                      onChange={() => {
                        setChoices((cur) => ({ ...cur, [q.id]: ci }));
                        setError(null);
                      }}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </article>
          ))}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={finish}
            disabled={busy}
            className={`${btn} border-b-4 border-brand-800 bg-brand-600 text-white active:translate-y-0.5 active:border-b-2`}
          >
            {busy ? "결과 계산 중..." : "제출하고 내 레벨 보기"}
          </button>
        </div>
      )}
    </section>
  );
}
