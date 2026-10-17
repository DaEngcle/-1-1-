"use client";

import Link from "next/link";
import { useState } from "react";
import type { WordResult } from "@/lib/classroom/azure-speech";
import { findTipsForSentence } from "@/lib/classroom/pronunciation-tips";
import { buildDetailedFeedback } from "@/lib/classroom/detailed-feedback";
import { useTts } from "@/app/_ui/audio/use-tts";
import { toWav16kMono } from "@/app/_ui/audio/wav";
import { useRecorder } from "@/app/_ui/audio/use-recorder";

export interface PracticeResult {
  status: "pending" | "scored" | "failed";
  overall_score?: number | null;
  accuracy_score?: number | null;
  fluency_score?: number | null;
  completeness_score?: number | null;
  prosody_score?: number | null;
  word_details?: WordResult[] | null;
  feedback_text?: string | null;
  error?: string;
}

const MAX_RECORD_SECONDS = 45;

function scoreColor(score: number) {
  if (score >= 80) return "text-green-700 bg-green-50";
  if (score >= 60) return "text-amber-800 bg-amber-50";
  return "text-red-700 bg-red-50";
}

function ScoreBadge({ label, value }: { label: string; value?: number | null }) {
  if (value == null) return null;
  return (
    <div className={`flex flex-col items-center rounded-lg px-2 py-1.5 ${scoreColor(value)}`}>
      <span className="text-lg font-bold">{Math.round(value)}</span>
      <span className="text-[11px]">{label}</span>
    </div>
  );
}

function ResultView({ result, onPlayWord }: { result: PracticeResult; onPlayWord: (w: string) => void }) {
  if (result.status === "failed") {
    return <p className="text-sm text-red-600">{result.error ?? "평가에 실패했어요. 다시 녹음해보세요."}</p>;
  }
  if (result.status === "pending") {
    return <p className="text-sm text-zinc-600">제출 완료! 선생님이 확인할 거예요. (AI 자동 평가 준비 중)</p>;
  }
  const words = result.word_details ?? [];
  const weakWords = words
    .filter((w) => w.errorType !== "Insertion" && w.accuracy < 70)
    .map((w) => w.word)
    .join(" ");
  const tips = weakWords ? findTipsForSentence(weakWords) : [];
  const detailed = buildDetailedFeedback(words, {
    accuracy: result.accuracy_score,
    fluency: result.fluency_score,
    completeness: result.completeness_score,
    prosody: result.prosody_score,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-5 gap-1.5">
        <ScoreBadge label="종합" value={result.overall_score} />
        <ScoreBadge label="정확도" value={result.accuracy_score} />
        <ScoreBadge label="유창성" value={result.fluency_score} />
        <ScoreBadge label="완성도" value={result.completeness_score} />
        <ScoreBadge label="억양" value={result.prosody_score} />
      </div>
      {words.length > 0 && (
        <p className="flex flex-wrap gap-1 text-base leading-relaxed">
          {words
            .filter((w) => w.errorType !== "Insertion")
            .map((w, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onPlayWord(w.word)}
                title={`${Math.round(w.accuracy)}점 · 눌러서 원어민 발음 듣기`}
                className={`rounded px-1 ${
                  w.errorType === "Omission"
                    ? "bg-zinc-100 text-zinc-400 line-through"
                    : scoreColor(w.accuracy)
                }`}
              >
                {w.word}
              </button>
            ))}
        </p>
      )}
      <p className="text-xs text-zinc-500">
        초록 80+ · 노랑 60~79 · 빨강 60 미만 · 회색 줄: 빠뜨린 단어
        <br />
        👆 단어를 누르면 그 단어만 천천히 들을 수 있어요.
      </p>
      {result.feedback_text ? (
        <div className="rounded-xl border border-brand-100 bg-brand-50 p-3 text-sm leading-relaxed whitespace-pre-line text-zinc-800">
          <span className="mb-1 block text-xs font-semibold text-brand-700">AI 코치 피드백</span>
          {result.feedback_text}
        </div>
      ) : (
        detailed.length > 0 && (
          <div className="rounded-xl border border-brand-100 bg-brand-50 p-3 text-sm leading-relaxed text-zinc-800">
            <span className="mb-1.5 block text-xs font-semibold text-brand-700">📝 이렇게 고쳐 보세요</span>
            <ul className="flex flex-col gap-1.5">
              {detailed.map((line, i) => (
                <li key={i}>
                  {line.word ? (
                    <button
                      type="button"
                      onClick={() => onPlayWord(line.word!)}
                      className="mr-1 rounded bg-white px-1.5 font-semibold text-brand-700 underline decoration-dotted"
                    >
                      {line.word} 🔊
                    </button>
                  ) : (
                    "• "
                  )}
                  {line.text}
                </li>
              ))}
            </ul>
          </div>
        )
      )}
      {tips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tips.map(({ tip }) => (
            <Link
              key={tip.id}
              href={`/student/pronunciation/${tip.id}`}
              className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700"
            >
              💡 {tip.label} 발음 교정 팁 보기
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function SentencePractice({
  itemId,
  index,
  sentence,
  translation,
  note,
  initialResult,
}: {
  itemId: string;
  index: number;
  sentence: string;
  translation: string | null;
  note: string | null;
  initialResult: PracticeResult | null;
}) {
  const { play, stop, playingKey, loop, setLoop } = useTts();
  const [showTranslation, setShowTranslation] = useState(false);
  const recorder = useRecorder(MAX_RECORD_SECONDS);
  const { recording, seconds, url: recordedUrl, blob: recordedBlob } = recorder;
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<PracticeResult | null>(initialResult);
  const [error, setError] = useState<string | null>(null);

  const tips = findTipsForSentence(sentence);
  const tokens = sentence.split(/(\s+)/);

  function startRecording() {
    setError(null);
    stop();
    recorder.start();
  }

  async function submit() {
    if (!recordedBlob) return;
    setSubmitting(true);
    setError(null);
    try {
      const wav = await toWav16kMono(recordedBlob);
      const form = new FormData();
      form.append("lessonItemId", itemId);
      form.append("audio", wav, "recording.wav");
      const res = await fetch("/api/submissions", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "제출에 실패했어요.");
      } else {
        setResult(data);
      }
    } catch {
      setError("녹음 처리 중 문제가 생겼어요. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  const btn = "rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50";
  // 듣기·천천히·반복·해석 4개를 한 줄에
  const tool = "rounded-lg border px-1 py-2 text-sm font-medium whitespace-nowrap transition-colors disabled:opacity-40";

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-brand-900/5 p-4">
      <div className="flex items-start gap-2">
        <span className="mt-1 shrink-0 rounded bg-zinc-100 px-1.5 text-xs text-zinc-500">{index}</span>
        <p className="text-lg leading-relaxed font-medium text-zinc-900">
          {tokens.map((t, i) =>
            /^\s+$/.test(t) ? (
              t
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => play(t.replace(/[^A-Za-z0-9'$-]/g, ""), "slow", `word:${i}`)}
                className={`rounded underline decoration-zinc-300 decoration-dotted underline-offset-4 hover:bg-brand-50 ${
                  playingKey === `word:${i}` ? "bg-brand-100" : ""
                }`}
              >
                {t}
              </button>
            ),
          )}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        <button
          type="button"
          onClick={() => (playingKey === "normal" ? stop() : play(sentence, "normal", "normal"))}
          className={`${tool} ${playingKey === "normal" ? "border-brand-400 bg-brand-50 text-brand-700" : "border-zinc-300 bg-white"}`}
        >
          {playingKey === "normal" ? "■ 정지" : "▶ 듣기"}
        </button>
        <button
          type="button"
          onClick={() => (playingKey === "slow" ? stop() : play(sentence, "slow", "slow"))}
          className={`${tool} ${playingKey === "slow" ? "border-brand-400 bg-brand-50 text-brand-700" : "border-zinc-300 bg-white"}`}
        >
          {playingKey === "slow" ? "■ 정지" : "🐢 천천히"}
        </button>
        <button
          type="button"
          onClick={() => setLoop(!loop)}
          aria-pressed={loop}
          className={`${tool} ${loop ? "border-brand-400 bg-brand-50 text-brand-700" : "border-zinc-300 bg-white"}`}
        >
          🔁 반복{loop ? " ON" : ""}
        </button>
        <button
          type="button"
          onClick={() => setShowTranslation((v) => !v)}
          disabled={!translation && !note}
          className={`${tool} ${showTranslation ? "border-brand-400 bg-brand-50 text-brand-700" : "border-zinc-300 bg-white"}`}
        >
          {showTranslation ? "해석 닫기" : "해석"}
        </button>
      </div>

      {showTranslation && (
        <div className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">
          {translation && <p>{translation}</p>}
          {note && <p className="mt-1 text-zinc-500">{note}</p>}
        </div>
      )}

      {tips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tips.map(({ tip, words }) => (
            <Link
              key={tip.id}
              href={`/student/pronunciation/${tip.id}`}
              className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-700"
            >
              💡 <b>{tip.label}</b> 주의: {words.slice(0, 3).join(", ")}
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-zinc-100 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          {recording ? (
            <button type="button" onClick={recorder.stop} className={`${btn} border-red-400 bg-red-50 text-red-700`}>
              ■ 녹음 끝내기 ({seconds}s)
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              disabled={submitting}
              className={`${btn} border-zinc-900 bg-zinc-900 text-white`}
            >
              🎙 {recordedUrl ? "다시 녹음" : "따라 말하기 녹음"}
            </button>
          )}
          {recordedUrl && !recording && (
            <>
              <audio src={recordedUrl} controls className="h-9 max-w-full" />
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className={`${btn} border-b-4 border-brand-800 bg-brand-600 font-bold text-white active:translate-y-0.5 active:border-b-2`}
              >
                {submitting ? "AI가 듣는 중..." : "제출하고 피드백 받기"}
              </button>
            </>
          )}
        </div>
        {(error ?? recorder.error) && <p className="text-sm text-red-600">{error ?? recorder.error}</p>}
        {result && <ResultView result={result} onPlayWord={(w) => play(w, "slow")} />}
      </div>
    </article>
  );
}
