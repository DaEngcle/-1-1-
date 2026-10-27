"use client";

import { useState } from "react";
import { useRecorder } from "@/app/_ui/audio/use-recorder";

/** 리포트 문장 따라 말하기: 🎤 누르고 말하면 발음 점수 */
export function PracticeLine({ sessionId, text }: { sessionId: string; text: string }) {
  const [result, setResult] = useState<{ score: number; weak: string[] } | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function send(wav: Blob) {
    setBusy(true);
    setMsg(null);
    const form = new FormData();
    form.append("sessionId", sessionId);
    form.append("text", text);
    form.append("audio", wav, "practice.wav");
    try {
      const res = await fetch("/api/interview/practice", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setResult({ score: data.score, weak: data.weak ?? [] });
      else setMsg(data.error ?? "다시 해 주세요.");
    } catch {
      setMsg("인터넷 연결이 불안정해요.");
    }
    setBusy(false);
  }
  const recorder = useRecorder(15, (wav) => {
    if (wav) void send(wav);
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => (recorder.recording ? recorder.stop() : void recorder.start({ autoStop: true }))}
        className={`rounded-full px-3 py-1.5 text-xs font-bold text-white ${recorder.recording ? "animate-pulse bg-rose-500" : "bg-[#6C5CFF]"} disabled:bg-slate-300`}
      >
        {busy ? "채점 중…" : recorder.recording ? "⏹ 그만" : "🎤 따라 말하기"}
      </button>
      {result && (
        <span className={`text-xs font-bold ${result.score >= 80 ? "text-emerald-700" : result.score >= 60 ? "text-amber-700" : "text-rose-600"}`}>
          {result.score}점{result.score >= 80 ? " 👏" : ""}
          {result.weak.length > 0 && <span className="font-semibold text-zinc-500"> · 다시: {result.weak.join(", ")}</span>}
        </span>
      )}
      {msg && <span className="text-xs text-rose-600">{msg}</span>}
    </div>
  );
}
