"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

// 브라우저 내장 음성 인식 (Web Speech API, 무료). 유료 음성 API는 쓰지 않는다.

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
  "service-not-allowed": "이 브라우저에서는 음성 인식을 쓸 수 없어요.",
  "no-speech": "잘 안 들렸어요. 버튼을 누르고 다시 말해 주세요.",
  "audio-capture": "마이크를 찾지 못했어요.",
};

function engine() {
  if (typeof window === "undefined") return null;
  const w = window as RecognitionWindow;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const noop = () => () => {};

/**
 * 영어 음성 인식 훅.
 * supported: 서버 렌더 중엔 null(모름), 브라우저에선 true/false.
 * listen(): 들은 말 후보들(최대 3개)을 onResult로 넘긴다.
 */
export function useSpeechRecognition(lang = "en-AU") {
  const supported = useSyncExternalStore(noop, () => engine() !== null, () => null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rec = useRef<Recognition | null>(null);

  useEffect(() => () => rec.current?.abort(), []);

  const listen = useCallback(
    (onResult: (alternatives: string[]) => void) => {
      const Engine = engine();
      if (!Engine) return;
      setError(null);
      rec.current?.abort();
      const r = new Engine();
      r.lang = lang;
      r.interimResults = false;
      r.maxAlternatives = 3;
      r.onresult = (e) => onResult(Array.from(e.results[0] ?? []).map((a) => a.transcript));
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
    },
    [lang],
  );

  const stop = useCallback(() => rec.current?.stop(), []);
  const abort = useCallback(() => {
    rec.current?.abort();
    setListening(false);
  }, []);

  return { supported, listening, error, listen, stop, abort };
}
