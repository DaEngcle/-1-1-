"use client";

import { useState } from "react";
import { useRecorder } from "@/app/_ui/audio/use-recorder";
import { VILLAGE_MAX_RECORD_SECONDS } from "@/lib/classroom/village";

type Result = { heard: string; score: number; completeness: number; weak: string[]; left: number };

function verdict(r: Result) {
  if (r.completeness < 70) return "문장이 달라요. 정답을 듣고 다시 말해 보세요.";
  if (r.score >= 80) return "잘했어요! 그대로 쓰면 돼요 🎉";
  if (r.score >= 60) return "거의 다 왔어요. 아래 단어만 다시 말해 보세요.";
  return "조금 더 또박또박 다시 말해 보세요.";
}

/** 가게 안 말하기 연습: 말하면 앱이 듣고 정답 문장과 비교해 알려 준다 */
export function SpeakPractice({ text }: { text: string }) {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function send(wav: Blob) {
    setSending(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("text", text);
      form.append("audio", wav, "speak.wav");
      const res = await fetch("/api/village/speak", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "다시 말해 주세요.");
      else setResult(data as Result);
    } catch {
      setError("인터넷 연결을 확인하고 다시 말해 주세요.");
    } finally {
      setSending(false);
    }
  }

  const recorder = useRecorder(VILLAGE_MAX_RECORD_SECONDS, (wav) => {
    if (wav) void send(wav);
  });

  function start() {
    setResult(null);
    setError(null);
    void recorder.start();
  }

  return (
    <div className="flex flex-col gap-2">
      {recorder.recording ? (
        <button type="button" onClick={recorder.stop} className="rounded-[10px] border-2 border-red-500 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
          ⏹ 다 말했어요 ({recorder.seconds}초 / {VILLAGE_MAX_RECORD_SECONDS}초)
        </button>
      ) : (
        <button type="button" disabled={sending} onClick={start} className="rounded-[10px] border-2 border-[#2a2350] bg-[#6c5cff] px-3 py-2 text-sm font-bold text-white shadow-[0_3px_0_#2a2350] disabled:opacity-60">
          {sending ? "듣고 있어요..." : result ? "🎤 다시 말하기" : "🎤 눌러서 말하기"}
        </button>
      )}
      {result && (
        <div className="rounded-[10px] border-2 border-[#2a2350] bg-white p-3 text-sm text-[#2a2350]">
          <p className="font-extrabold">{result.score}점 · {verdict(result)}</p>
          <p className="mt-1 text-xs text-zinc-600">앱이 들은 말: {result.heard || "(알아듣지 못했어요)"}</p>
          {result.weak.length > 0 && <p className="mt-1 text-xs text-zinc-600">다시 말해 볼 단어: <b>{result.weak.join(", ")}</b></p>}
          <p className="mt-1 text-xs text-zinc-500">오늘 {result.left}번 더 할 수 있어요.</p>
        </div>
      )}
      {(error ?? recorder.error) && <p className="text-sm text-red-600">{error ?? recorder.error}</p>}
    </div>
  );
}
