"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTts } from "@/app/_ui/audio/use-tts";
import { useRecorder } from "@/app/_ui/audio/use-recorder";
import { Interviewer } from "@/app/_ui/interviewer";
import { InterviewerFace, InterviewerVideo, hasInterviewerVideo } from "@/app/_ui/interviewer-video";
import { CatSprite } from "@/app/_ui/cat";
import { useMyCat } from "@/app/_ui/cat-context";
import type { Scenario } from "@/lib/classroom/interview-scenarios";

type Turn = { role: "ai" | "me"; text: string };
type Feedback = {
  result: string;
  score: number;
  scores: { communication: number; answers: number; grammar: number };
  summary_ko: string;
  good_ko: string[];
  fixes: { you_said: string; better: string; why_ko: string }[];
  expressions: { en: string; ko: string }[];
};
type Phase = "intro" | "talking" | "listening" | "recording" | "thinking" | "reporting" | "report";

const MAX_ANSWER_SECONDS = 40;

export function Conversation({ scenario: s, ready }: { scenario: Scenario; ready: boolean }) {
  const { play, stop, playingKey } = useTts();
  const recorder = useRecorder(
    MAX_ANSWER_SECONDS,
    (wav) => {
      if (wav) void sendAnswer(wav);
      else setPhase("listening");
    },
    { keepContext: true },
  );
  // 실전: 면접관 말이 끝나면 바로 마이크가 켜지고, 말을 멈추면 자동 전송 · 연습: 버튼으로
  const [mode, setMode] = useState<"real" | "practice">("real");
  const cat = useMyCat();
  const [phase, setPhase] = useState<Phase>("intro");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mood, setMood] = useState<"smile" | "neutral" | "thinking">("smile");
  const [subtitles, setSubtitles] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [ended, setEnded] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const talking = playingKey?.startsWith("iv:") ?? false;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns, phase]);

  /** 면접관 말하기 → 끝나면 학생 차례 (마지막이면 리포트) */
  async function say(text: string, last = false) {
    setPhase("talking");
    await play(text, "normal", `iv:${text}`, s.voice);
    if (last) void finish();
    else if (mode === "real") startRecording();
    else setPhase("listening");
  }

  async function start() {
    setError(null);
    // 지금(버튼을 누른 순간) 오디오를 켜 둬야, 나중에 손 안 대고 녹음이 시작된다 (아이폰)
    recorder.prepare();
    setPhase("thinking");
    const res = await fetch("/api/interview/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario: s.id }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "시작하지 못했어요.");
      setPhase("intro");
      return;
    }
    setSessionId(data.sessionId);
    setTurns([{ role: "ai", text: data.reply }]);
    void say(data.reply);
  }

  async function sendAnswer(blob: Blob) {
    if (!sessionId) return;
    setPhase("thinking");
    setMood("thinking");
    const form = new FormData();
    form.append("sessionId", sessionId);
    form.append("audio", blob, "answer.wav");
    const res = await fetch("/api/interview/turn", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    setMood("smile");
    if (!res.ok) {
      setError(data.error ?? "다시 말해 주세요.");
      setPhase("listening");
      return;
    }
    if (data.retry || !data.heard) {
      setError("잘 안 들렸어요 🙉 마이크 가까이에서 한 번 더 말해 주세요.");
      setPhase("listening");
      return;
    }
    setError(null);
    setTurns((t) => [...t, { role: "me", text: data.heard }, { role: "ai", text: data.reply }]);
    setMood(data.mood ?? "smile");
    if (data.done) setEnded(true);
    void say(data.reply, Boolean(data.done));
  }

  function startRecording() {
    stop();
    setError(null);
    setPhase("recording");
    void recorder.start({ autoStop: mode === "real" });
  }

  async function finish() {
    if (!sessionId) return;
    stop();
    setPhase("reporting");
    const res = await fetch("/api/interview/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.feedback) {
      setError(data.error ?? "리포트를 만들지 못했어요.");
      setPhase("report");
      return;
    }
    setFeedback(data.feedback);
    setPhase("report");
  }

  const lastAi = [...turns].reverse().find((t) => t.role === "ai")?.text;

  // ---------- 시작 전: 캐릭터 소개 + 미리 볼 표현 ----------
  if (phase === "intro") {
    return (
      <section className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2 rounded-[28px] p-5 text-center" style={{ background: s.look.bg }}>
          {hasInterviewerVideo(s.id) ? (
            <InterviewerVideo id={s.id} className="aspect-video w-full rounded-2xl shadow-sm" />
          ) : (
            <Interviewer look={s.look} className="h-44 w-44" />
          )}
          <p className="text-xl font-extrabold text-zinc-900">
            {s.emoji} {s.title}
          </p>
          <p className="text-sm text-zinc-700">
            면접관 <b>{s.name}</b> ({s.roleKo}) · {s.place}
          </p>
        </div>
        <div className="rounded-3xl bg-white p-4 shadow-sm">
          <p className="mb-2 text-sm font-bold text-zinc-900">💡 시작 전에 써먹을 표현</p>
          <ul className="flex flex-col gap-1.5">
            {s.prep.map((x) => (
              <li key={x.en}>
                <button
                  type="button"
                  onClick={() => play(x.en, "normal", `prep:${x.en}`, s.voice)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-left text-sm"
                >
                  <span>
                    <b className="text-zinc-900">{x.en}</b>
                    <br />
                    <span className="text-zinc-500">{x.ko}</span>
                  </span>
                  <span>🔊</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-sky-50 p-3 text-xs leading-relaxed text-sky-900">
          🎧 6~8번 주고받으면 면접이 끝나고 코칭 리포트가 나와요. 자막은 꺼져 있어요 (진짜 면접처럼!). 안 들리면 💬
          자막을 켜거나 🐢로 천천히 다시 들어요. 조용한 곳에서 해주세요!
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["real", "🎧 실전 모드", "면접관 말이 끝나면 바로 대답. 말을 멈추면 자동으로 넘어가요."],
              ["practice", "👆 연습 모드", "🎙 버튼을 눌러 말하고, 다시 눌러 끝내요. 생각할 시간이 있어요."],
            ] as const
          ).map(([id, title, desc]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`flex flex-col gap-1 rounded-2xl border-2 p-3 text-left ${
                mode === id ? "border-[#6C5CFF] bg-[#F1EEFF]" : "border-slate-200 bg-white"
              }`}
            >
              <span className="font-extrabold text-zinc-900">{title}</span>
              <span className="text-xs text-zinc-600">{desc}</span>
            </button>
          ))}
        </div>
        {error && <p className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}
        <button
          type="button"
          disabled={!ready}
          onClick={start}
          className="rounded-2xl bg-[#6C5CFF] py-4 text-lg font-extrabold text-white shadow-[0_4px_0_#4936D8] active:translate-y-[3px] active:shadow-none disabled:bg-slate-300 disabled:shadow-none"
        >
          {ready ? "면접 시작하기 🎤" : "🛠 AI 연결 준비 중이에요"}
        </button>
      </section>
    );
  }

  // ---------- 리포트 ----------
  if (phase === "report" || phase === "reporting") {
    return (
      <section className="flex flex-col gap-3">
        {phase === "reporting" ? (
          <div className="flex flex-col items-center gap-3 rounded-[28px] bg-white p-8 text-center shadow-sm">
            <InterviewerFace id={s.id} look={s.look} className="h-32 w-32" />
            <p className="animate-pulse font-bold text-zinc-700">{s.name}가 면접 결과를 정리하고 있어요…</p>
          </div>
        ) : feedback ? (
          <>
            <div className="flex flex-col items-center gap-2 rounded-[28px] p-5 text-center shadow-sm" style={{ background: s.look.bg }}>
              <InterviewerFace id={s.id} look={s.look} className="h-28 w-28" />
              <p className="text-2xl font-extrabold text-zinc-900">{feedback.result}</p>
              <p className="text-5xl font-black text-[#6C5CFF]">
                {feedback.score}
                <span className="text-lg font-bold text-zinc-500">점</span>
              </p>
              <div className="grid w-full grid-cols-3 gap-2">
                {(
                  [
                    ["대화력", feedback.scores.communication],
                    ["답변 내용", feedback.scores.answers],
                    ["문법·단어", feedback.scores.grammar],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-white/80 py-2">
                    <p className="text-lg font-extrabold text-zinc-900">{v}</p>
                    <p className="text-[11px] text-zinc-500">{k}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-3xl bg-[#FFF8E6] p-3">
              {cat && <CatSprite breed={cat.breed} mood={feedback.score >= 70 ? "cheer" : "happy"} className="h-14 w-16 shrink-0" />}
              <p className="text-sm leading-relaxed text-[#5B4300]">{feedback.summary_ko}</p>
            </div>
            {feedback.good_ko.length > 0 && (
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="mb-1 text-sm font-bold text-emerald-700">👍 잘한 점</p>
                <ul className="list-inside list-disc text-sm text-zinc-700">
                  {feedback.good_ko.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
            )}
            {feedback.fixes.length > 0 && (
              <div className="flex flex-col gap-2 rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-sm font-bold text-[#6C5CFF]">✨ 이렇게 말하면 더 좋아요</p>
                {feedback.fixes.map((f) => (
                  <div key={f.you_said} className="flex flex-col gap-1 rounded-2xl bg-slate-50 p-3 text-sm">
                    <p className="text-zinc-500 line-through decoration-rose-300">🗣 {f.you_said}</p>
                    <button
                      type="button"
                      onClick={() => play(f.better, "slow", `fix:${f.better}`, s.voice)}
                      className="flex items-start justify-between gap-2 text-left font-bold text-emerald-800"
                    >
                      <span>✅ {f.better}</span>
                      <span>🔊</span>
                    </button>
                    <p className="text-xs text-zinc-600">{f.why_ko}</p>
                  </div>
                ))}
              </div>
            )}
            {feedback.expressions.length > 0 && (
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="mb-1 text-sm font-bold text-zinc-900">📌 이 면접 필수 표현</p>
                {feedback.expressions.map((x) => (
                  <button
                    key={x.en}
                    type="button"
                    onClick={() => play(x.en, "normal", `exp:${x.en}`, s.voice)}
                    className="flex w-full items-center justify-between gap-2 border-b border-slate-100 py-2 text-left text-sm last:border-0"
                  >
                    <span>
                      <b>{x.en}</b> <span className="text-zinc-500">{x.ko}</span>
                    </span>
                    <span>🔊</span>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>
        )}
        <details className="rounded-3xl bg-white p-4 text-sm shadow-sm">
          <summary className="cursor-pointer font-bold text-zinc-800">💬 대화 다시 보기</summary>
          <div className="mt-2 flex flex-col gap-1.5">
            {turns.map((t, i) => (
              <p key={i} className={t.role === "ai" ? "text-zinc-800" : "text-right text-[#5B4CFF]"}>
                <b>{t.role === "ai" ? s.name : "나"}:</b> {t.text}
              </p>
            ))}
          </div>
        </details>
        <div className="grid grid-cols-2 gap-2 pb-2">
          <button
            type="button"
            onClick={() => {
              setTurns([]);
              setSessionId(null);
              setFeedback(null);
              setEnded(false);
              setError(null);
              setPhase("intro");
            }}
            className="rounded-2xl bg-[#6C5CFF] py-3 font-extrabold text-white shadow-[0_4px_0_#4936D8] active:translate-y-[3px] active:shadow-none"
          >
            다시 도전
          </button>
          <Link href="/student/talk" className="rounded-2xl bg-white py-3 text-center font-extrabold text-[#6C5CFF] ring-2 ring-[#DCD7FF]">
            다른 면접
          </Link>
        </div>
      </section>
    );
  }

  // ---------- 대화 중 ----------
  return (
    <section className="-mx-4 flex min-h-[80vh] flex-col gap-3 px-4 pb-4 pt-2 sm:mx-0 sm:rounded-[32px]" style={{ background: `linear-gradient(180deg, ${s.look.bg} 0%, #ffffff 70%)` }}>
      <div className="flex items-center justify-between text-xs font-semibold text-zinc-600">
        <span>
          {s.emoji} {s.name} · {s.roleKo}
        </span>
        <button type="button" onClick={() => setSubtitles((v) => !v)} className="rounded-full bg-white/80 px-3 py-1 shadow-sm">
          {subtitles ? "💬 자막 끄기" : "💬 자막 켜기"}
        </button>
      </div>

      <div className="flex flex-col items-center">
        {hasInterviewerVideo(s.id) ? (
          <InterviewerVideo id={s.id} talking={talking} className="aspect-video w-full rounded-3xl shadow-lg" />
        ) : (
          <Interviewer look={s.look} talking={talking} mood={phase === "thinking" ? "thinking" : mood} className="h-48 w-48 drop-shadow-lg" />
        )}
        <p className="mt-1 h-5 text-sm font-semibold text-zinc-500">
          {phase === "talking"
            ? `${s.name}가 말하는 중…`
            : phase === "thinking"
              ? "🤔 듣고 생각하는 중…"
              : phase === "recording"
                ? mode === "real"
                  ? "🎙 듣고 있어요… 말을 멈추면 자동으로 보내요"
                  : "🎙 듣고 있어요. 다 말하면 버튼을 다시 눌러요"
                : mode === "real"
                  ? "🎙 버튼을 눌러 다시 말해 주세요"
                  : "당신 차례예요!"}
        </p>
      </div>

      <div className="flex max-h-[34vh] flex-col gap-2 overflow-y-auto rounded-3xl bg-white/70 p-3">
        {turns.map((t, i) =>
          t.role === "ai" ? (
            <div key={i} className="max-w-[85%] self-start rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm">
              {subtitles ? t.text : <span className="text-zinc-400">🔊 (자막 꺼짐)</span>}
            </div>
          ) : (
            <div key={i} className="max-w-[85%] self-end rounded-2xl rounded-tr-sm bg-[#6C5CFF] px-3 py-2 text-sm text-white shadow-sm">
              {t.text}
            </div>
          ),
        )}
        <div ref={bottomRef} />
      </div>

      {error && <p className="rounded-xl bg-rose-50 p-2 text-center text-sm font-semibold text-rose-700">{error}</p>}
      {recorder.error && phase !== "recording" && (
        <p className="rounded-xl bg-amber-50 p-2 text-center text-sm font-semibold text-amber-800">{recorder.error}</p>
      )}

      <div className="mt-auto flex items-center justify-center gap-4">
        <button
          type="button"
          disabled={!lastAi || phase === "recording" || phase === "thinking"}
          onClick={() => lastAi && play(lastAi, "slow", `iv:${lastAi}`, s.voice)}
          className="flex h-14 w-14 flex-col items-center justify-center rounded-full bg-white text-xl shadow disabled:opacity-40"
          aria-label="천천히 다시 듣기"
        >
          🐢
        </button>
        {phase === "recording" ? (
          <button
            type="button"
            onClick={recorder.stop}
            className={`flex h-24 w-24 flex-col items-center justify-center rounded-full bg-rose-500 text-white shadow-[0_6px_0_#BE123C] active:translate-y-[3px] active:shadow-none ${mode === "real" ? "animate-pulse" : ""}`}
          >
            <span className="text-3xl">{mode === "real" ? "✋" : "■"}</span>
            <span className="text-xs font-bold">{mode === "real" ? "다 말했어요" : `${recorder.seconds}s · 끝내기`}</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={phase !== "listening" || ended}
            onClick={startRecording}
            className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[#6C5CFF] text-white shadow-[0_6px_0_#4936D8] active:translate-y-[3px] active:shadow-none disabled:bg-slate-300 disabled:shadow-none"
          >
            <span className="text-3xl">🎙</span>
            <span className="text-xs font-bold">말하기</span>
          </button>
        )}
        <button
          type="button"
          disabled={!lastAi || phase === "recording" || phase === "thinking"}
          onClick={() => lastAi && play(lastAi, "normal", `iv:${lastAi}`, s.voice)}
          className="flex h-14 w-14 flex-col items-center justify-center rounded-full bg-white text-xl shadow disabled:opacity-40"
          aria-label="다시 듣기"
        >
          🔊
        </button>
      </div>
      {phase === "recording" && (
        <div className="flex h-6 items-end justify-center gap-1">
          {[0.1, 0.25, 0.4, 0.55, 0.7, 0.55, 0.4, 0.25, 0.1].map((t, i) => (
            <span
              key={i}
              className={`w-1.5 rounded-full transition-all ${recorder.level >= t * 0.6 ? "bg-rose-500" : "bg-zinc-200"}`}
              style={{ height: `${30 + t * 100}%` }}
            />
          ))}
        </div>
      )}
      <button
        type="button"
        disabled={phase === "recording" || phase === "thinking" || turns.filter((t) => t.role === "me").length < 2}
        onClick={finish}
        className="text-center text-xs font-semibold text-zinc-500 underline disabled:no-underline disabled:opacity-40"
      >
        여기서 끝내고 리포트 받기
      </button>
    </section>
  );
}
