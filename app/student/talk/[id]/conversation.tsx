"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useTts } from "@/app/_ui/audio/use-tts";
import { useRecorder } from "@/app/_ui/audio/use-recorder";
import { usePref } from "@/app/_ui/prefs";
import { Interviewer } from "@/app/_ui/interviewer";
import { InterviewerFace, InterviewerVideo, hasInterviewerVideo } from "@/app/_ui/interviewer-video";
import { CatSprite } from "@/app/_ui/cat";
import { useMyCat } from "@/app/_ui/cat-context";
import type { Scenario } from "@/lib/classroom/interview-scenarios";
import { PracticeLine } from "./practice-line";
import { AnswerSheet, ChatScreen, HintPill, MissionCard, MyMessage, PartnerMessage, TypingBubble, type AnswerMode } from "@/app/_ui/chat/chat-ui";
import { spokenWords } from "@/lib/classroom/sentence-practice";

type Turn = { role: "ai" | "me"; text: string; ko?: string; coach_ko?: string; hint?: string };
/** 면접 한 번에 '다시 시도' 횟수 (서버와 같게) */
const MAX_RETRIES = 3;

/**
 * 리포트가 나온 뒤 내 답마다 별: 코칭 '이렇게 말하면 더 좋아요'에 나온 답이면 2개 (아주 짧으면 1개), 아니면 3개.
 * (답마다 따로 AI 채점을 하지 않고 이미 받은 코칭 리포트로만 정한다)
 */
function answerStars(text: string, fb: Feedback | null): number | undefined {
  if (!fb) return undefined;
  const mine = spokenWords(text).join(" ");
  const fixed = fb.fixes.some((f) => {
    const said = spokenWords(f.you_said).join(" ");
    return said && (said === mine || mine.includes(said) || said.includes(mine));
  });
  if (!fixed) return 3;
  return spokenWords(text).length <= 3 ? 1 : 2;
}
type Feedback = {
  result: string;
  score: number;
  scores: { communication: number; answers: number; grammar: number };
  summary_ko: string;
  good_ko: string[];
  fixes: { you_said: string; better: string; why_ko: string }[];
  expressions: { en: string; ko: string }[];
  model_answers?: { question: string; answer: string; ko: string }[];
};
type Phase = "intro" | "talking" | "listening" | "recording" | "thinking" | "reporting" | "report";

const MAX_ANSWER_SECONDS = 40;
const NETWORK_ERROR = "인터넷 연결이 불안정해요. 잠시 후 다시 해 주세요.";

/** 서버 요청. 인터넷이 끊겨도 멈추지 않고 실패로 돌려준다 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function request(url: string, init: RequestInit): Promise<{ ok: boolean; data: any }> {
  try {
    const res = await fetch(url, init);
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  } catch {
    return { ok: false, data: { error: NETWORK_ERROR } };
  }
}

export function Conversation({ scenario: s, ready }: { scenario: Scenario; ready: boolean }) {
  const { play, stop, unlock } = useTts();
  /** ✕로 녹음을 취소하면 녹음 결과를 보내지 않는다 */
  const cancelRef = useRef(false);
  const recorder = useRecorder(
    MAX_ANSWER_SECONDS,
    (wav) => {
      if (cancelRef.current) {
        cancelRef.current = false;
        setPhase("listening");
        return;
      }
      if (wav) void sendAnswer({ audio: wav });
      else setPhase("listening");
    },
    { keepContext: true },
  );
  // 실전: 면접관 말이 끝나면 바로 마이크가 켜지고, 말을 멈추면 자동 전송 · 연습: 버튼으로
  const [mode, setMode] = useState<"real" | "practice">("real");
  const [answerMode, setAnswerMode] = useState<AnswerMode>("voice");
  const cat = useMyCat();
  const [phase, setPhase] = useState<Phase>("intro");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const subtitlesPref = usePref("interviewSubtitles");
  const [subtitlesToggled, setSubtitlesToggled] = useState<boolean | null>(null);
  const subtitles = subtitlesToggled ?? subtitlesPref;
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [ended, setEnded] = useState(false);
  /** 다음 답을 '다시 시도'로 보낼지 (지운 내 답·면접관 대답) */
  const retryRef = useRef<Turn[] | null>(null);
  const [retriesLeft, setRetriesLeft] = useState(MAX_RETRIES);

  /** 면접관 말하기 → 끝나면 학생 차례 (마지막이면 리포트) */
  async function say(text: string, last = false) {
    setPhase("talking");
    const heard = await play(text, "normal", `iv:${text}`, s.voice);
    if (last) void finish();
    else if (!heard) {
      // 소리가 안 나왔는데 녹음부터 시작하면 안 된다 → 직접 듣고 시작하게
      setPhase("listening");
      setError("면접관 말이 재생되지 않았어요. 🔊로 듣고 🎙를 눌러 대답해 주세요.");
    } else if (mode === "real" && answerMode === "voice") startRecording();
    else setPhase("listening");
  }

  async function start() {
    setError(null);
    // 지금(버튼을 누른 순간) 오디오를 켜 둬야, 나중에 손 안 대고 녹음이 시작된다 (아이폰)
    recorder.prepare();
    unlock();
    setPhase("thinking");
    const { ok, data } = await request("/api/interview/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario: s.id }),
    });
    if (!ok) {
      setError(data.error ?? "시작하지 못했어요.");
      setPhase("intro");
      return;
    }
    setSessionId(data.sessionId);
    setTurns([{ role: "ai", text: data.reply, ko: data.ko, coach_ko: data.coach_ko, hint: data.hint }]);
    void say(data.reply);
  }

  async function sendAnswer(answer: { audio?: Blob; text?: string }) {
    if (!sessionId) return;
    setPhase("thinking");
    const form = new FormData();
    form.append("sessionId", sessionId);
    if (answer.audio) form.append("audio", answer.audio, "answer.wav");
    if (answer.text) form.append("text", answer.text);
    const retrying = retryRef.current;
    if (retrying) form.append("retry", "1");
    const { ok, data } = await request("/api/interview/turn", { method: "POST", body: form });
    if (!ok) {
      setError(data.error ?? "다시 말해 주세요.");
      // 다시 시도가 막히면 지웠던 대화를 되돌린다
      if (retrying) {
        setTurns((t) => [...t, ...retrying]);
        retryRef.current = null;
      }
      setPhase("listening");
      return;
    }
    if (data.retry || !data.heard) {
      setError("잘 안 들렸어요 🙉 마이크 가까이에서 한 번 더 말해 주세요.");
      setPhase("listening");
      return;
    }
    retryRef.current = null;
    if (typeof data.retriesLeft === "number") setRetriesLeft(data.retriesLeft);
    setError(null);
    setTurns((t) => [...t, { role: "me", text: data.heard }, { role: "ai", text: data.reply, ko: data.ko, coach_ko: data.coach_ko, hint: data.hint }]);
    if (data.done) setEnded(true);
    void say(data.reply, Boolean(data.done));
  }

  /** 마지막 내 답을 지우고 같은 질문에 다시 답하기 */
  function retryLast() {
    if (retriesLeft <= 0 || turns.length < 3 || phase === "recording" || phase === "thinking") return;
    stop();
    const removed = turns.slice(-2);
    retryRef.current = removed;
    setTurns(turns.slice(0, -2));
    setEnded(false);
    setError(null);
    setPhase("listening");
  }

  function startRecording() {
    stop();
    unlock();
    setError(null);
    cancelRef.current = false;
    setPhase("recording");
    void recorder.start({ autoStop: mode === "real" });
  }

  function cancelRecording() {
    cancelRef.current = true;
    recorder.stop();
  }

  async function finish() {
    if (!sessionId) return;
    stop();
    setPhase("reporting");
    const { ok, data } = await request("/api/interview/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    if (!ok || !data.feedback) {
      setError(data.error ?? "리포트를 만들지 못했어요.");
      setPhase("report");
      return;
    }
    setFeedback(data.feedback);
    setPhase("report");
  }

  const lastAiIndex = turns.map((t) => t.role).lastIndexOf("ai");
  const lastMeIndex = turns.map((t) => t.role).lastIndexOf("me");

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
                mode === id ? "border-brand-600 bg-brand-50" : "border-slate-200 bg-white"
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
          className="rounded-2xl bg-brand-600 py-4 text-lg font-extrabold text-white shadow-[0_4px_0_var(--color-brand-800)] active:translate-y-[3px] active:shadow-none disabled:bg-slate-300 disabled:shadow-none"
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
              <p className="text-5xl font-black text-brand-600">
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
              {cat && <CatSprite breed={cat.breed} stage={cat.stage} mood={feedback.score >= 70 ? "cheer" : "happy"} className="h-14 w-16 shrink-0" />}
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
                <p className="text-sm font-bold text-brand-600">✨ 이렇게 말하면 더 좋아요</p>
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
                    {sessionId && <PracticeLine sessionId={sessionId} text={f.better} />}
                  </div>
                ))}
              </div>
            )}
            {(feedback.model_answers ?? []).length > 0 && (
              <div className="flex flex-col gap-2 rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-sm font-bold text-zinc-900">🏆 모범 답안 따라 해 보기</p>
                {(feedback.model_answers ?? []).map((m) => (
                  <div key={m.question} className="flex flex-col gap-1 rounded-2xl bg-slate-50 p-3 text-sm">
                    <p className="text-xs font-semibold text-zinc-500">Q. {m.question}</p>
                    <button
                      type="button"
                      onClick={() => play(m.answer, "slow", `model:${m.answer}`, s.voice)}
                      className="flex items-start justify-between gap-2 text-left font-bold text-zinc-900"
                    >
                      <span>{m.answer}</span>
                      <span>🔊</span>
                    </button>
                    <p className="text-xs text-zinc-500">{m.ko}</p>
                    {sessionId && <PracticeLine sessionId={sessionId} text={m.answer} />}
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
          <div className="flex flex-col gap-2 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">
            <p>{error}</p>
            <button type="button" onClick={() => void finish()} className="self-start rounded-full bg-white px-3 py-1.5 text-rose-700 ring-1 ring-rose-200">
              🔄 리포트 다시 받기
            </button>
          </div>
        )}
        <div className="flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-zinc-800">💬 대화 다시 보기 {feedback && <span className="font-semibold text-zinc-400">· 별은 코칭 리포트 기준</span>}</p>
          {turns.map((t, i) =>
            t.role === "ai" ? (
              <PartnerMessage key={i} name={s.name} text={t.text} ko={t.ko} onPlay={() => play(t.text, "normal", `iv:${t.text}`, s.voice)} />
            ) : (
              <MyMessage key={i} text={t.text} stars={answerStars(t.text, feedback)} />
            ),
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 pb-2">
          <button
            type="button"
            onClick={() => {
              setTurns([]);
              setRetriesLeft(MAX_RETRIES);
              setRevealed(new Set());
              setSessionId(null);
              setFeedback(null);
              setEnded(false);
              setError(null);
              setPhase("intro");
            }}
            className="rounded-2xl bg-brand-600 py-3 font-extrabold text-white shadow-[0_4px_0_var(--color-brand-800)] active:translate-y-[3px] active:shadow-none"
          >
            다시 도전
          </button>
          <Link href="/student/talk" className="rounded-2xl bg-white py-3 text-center font-extrabold text-brand-600 ring-2 ring-brand-100">
            다른 면접
          </Link>
        </div>
      </section>
    );
  }

  // ---------- 대화 중 (상황극과 같은 대화 화면) ----------
  const busy = phase === "thinking" || phase === "talking";
  const answered = turns.filter((t) => t.role === "me").length;
  return (
    <ChatScreen
      title={`${s.emoji} ${s.title}`}
      closeHref="/student/talk"
      scrollKey={`${turns.length}-${phase}`}
      sheet={
        <div className="flex flex-col gap-2">
          {error && <p className="rounded-xl bg-rose-50 p-2 text-center text-sm font-semibold text-rose-700">{error}</p>}
          {recorder.error && phase !== "recording" && <p className="rounded-xl bg-amber-50 p-2 text-center text-sm font-semibold text-amber-800">{recorder.error}</p>}
          <AnswerSheet
            mode={answerMode}
            onMode={setAnswerMode}
            recording={phase === "recording"}
            busy={busy}
            disabled={ended || phase !== "listening"}
            onMic={startRecording}
            onCancel={cancelRecording}
            onSend={recorder.stop}
            onSubmitText={(text) => void sendAnswer({ text })}
            level={recorder.level}
            status={
              phase === "talking"
                ? `${s.name}가 말하는 중…`
                : phase === "thinking"
                  ? "듣고 생각하는 중…"
                  : phase === "recording"
                    ? mode === "real"
                      ? `듣고 있어요 · 말을 멈추면 자동으로 보내요 (${recorder.seconds}s)`
                      : `듣고 있어요 · 다 말했으면 ↑ (${recorder.seconds}s)`
                    : ended
                      ? "면접이 끝났어요"
                      : retryRef.current
                        ? "같은 질문에 다시 답해 보세요"
                        : "내 차례예요"
            }
          />
          <button
            type="button"
            disabled={phase === "recording" || phase === "thinking" || answered < 2}
            onClick={finish}
            className="text-center text-xs font-semibold text-zinc-400 underline disabled:no-underline disabled:opacity-40"
          >
            여기서 끝내고 리포트 받기
          </button>
        </div>
      }
    >
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span className="flex items-center gap-2">
          <InterviewerFace id={s.id} look={s.look} className="h-9 w-9" />
          {s.name} · {s.roleKo}
        </span>
        <button type="button" onClick={() => setSubtitlesToggled(!subtitles)} className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
          {subtitles ? "자막 끄기" : "자막 켜기"}
        </button>
      </div>
      {turns.map((t, i) =>
        t.role === "ai" ? (
          <div key={i} className="flex flex-col gap-2">
            <PartnerMessage
              name={s.name}
              text={t.text}
              ko={t.ko}
              onPlay={() => play(t.text, "normal", `iv:${t.text}`, s.voice)}
              hidden={!subtitles && !revealed.has(i)}
              onReveal={() => setRevealed((r) => new Set(r).add(i))}
            />
            {t.coach_ko && <MissionCard label="코치">{t.coach_ko}</MissionCard>}
            {t.hint && i === lastAiIndex && !ended && <HintPill>{t.hint}</HintPill>}
          </div>
        ) : (
          <MyMessage
            key={i}
            text={t.text}
            onRetry={i === lastMeIndex && retriesLeft > 0 && phase === "listening" ? retryLast : undefined}
            note={i === lastMeIndex && retriesLeft < MAX_RETRIES ? `다시 시도 ${retriesLeft}번 남음` : undefined}
          />
        ),
      )}
      {phase === "thinking" && <TypingBubble name={s.name} />}
    </ChatScreen>
  );
}
