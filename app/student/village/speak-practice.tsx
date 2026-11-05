"use client";

import { useEffect, useRef, useState } from "react";
import { compareSpoken } from "@/lib/classroom/village";

type Recognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type RecognitionWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

const ERRORS: Record<string, string> = {
  "not-allowed": "마이크를 허용해 주세요. 브라우저 설정에서 켤 수 있어요.",
  "no-speech": "잘 안 들렸어요. 버튼을 누르고 다시 말해 주세요.",
  "audio-capture": "마이크를 찾지 못했어요.",
};

function verdict(score: number) {
  if (score >= 90) return "잘했어요! 그대로 쓰면 돼요 🎉";
  if (score >= 60) return "거의 다 왔어요. 빠진 단어를 넣어 다시 말해 보세요.";
  return "정답과 많이 달라요. 정답을 듣고 다시 말해 보세요.";
}

/** 가게 안 말하기 연습: 브라우저가 알아들은 말을 정답 문장과 비교한다 (비용 없음) */
export function SpeakPractice({ text }: { text: string }) {
  // 방을 열 때 브라우저에서만 그려지므로 window를 바로 읽어도 된다
  const [Engine] = useState(() => {
    const w = window as RecognitionWindow;
    return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
  });
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const rec = useRef<Recognition | null>(null);

  useEffect(() => () => rec.current?.abort(), []);

  if (!Engine) {
    return <p className="text-sm text-zinc-600">이 화면에서는 앱이 듣지 못해요. 소리 내어 말해 본 뒤 정답을 확인해 보세요.</p>;
  }

  function start() {
    setHeard(null);
    setError(null);
    const r = new Engine!();
    r.lang = "en-AU";
    r.interimResults = false;
    r.maxAlternatives = 3;
    r.onresult = (e) => {
      const alts = Array.from(e.results[0] ?? []).map((a) => a.transcript);
      // 후보 중 정답에 가장 가까운 것을 쓴다
      const best = alts.sort((x, y) => compareSpoken(text, y).score - compareSpoken(text, x).score)[0];
      setHeard(best ?? "");
    };
    r.onerror = (e) => {
      if (e.error !== "aborted") setError(ERRORS[e.error] ?? "지금은 앱이 듣지 못해요. 소리 내어 말해 본 뒤 정답을 확인해 보세요.");
    };
    r.onend = () => setListening(false);
    rec.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      setError("잠깐 뒤에 다시 눌러 주세요.");
    }
  }

  const result = heard === null ? null : compareSpoken(text, heard);

  return (
    <div className="flex flex-col gap-2">
      {listening ? (
        <button type="button" onClick={() => rec.current?.stop()} className="rounded-[10px] border-2 border-red-500 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
          ⏹ 듣고 있어요. 다 말했으면 누르세요
        </button>
      ) : (
        <button type="button" onClick={start} className="rounded-[10px] border-2 border-[#2a2350] bg-[#6c5cff] px-3 py-2 text-sm font-bold text-white shadow-[0_3px_0_#2a2350]">
          {result ? "🎤 다시 말하기" : "🎤 눌러서 말하기"}
        </button>
      )}
      {result && (
        <div className="rounded-[10px] border-2 border-[#2a2350] bg-white p-3 text-sm text-[#2a2350]">
          <p className="font-extrabold">정답과 {result.score}% 일치 · {verdict(result.score)}</p>
          <p className="mt-1 text-xs text-zinc-600">앱이 들은 말: {heard || "(알아듣지 못했어요)"}</p>
          {result.missing.length > 0 && <p className="mt-1 text-xs text-zinc-600">빠진 단어: <b>{result.missing.join(", ")}</b></p>}
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
