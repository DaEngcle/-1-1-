"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Speed = "normal" | "slow";

/**
 * 원어민 음성 재생 훅.
 * 서버 TTS(/api/tts, Azure 호주 음성)를 우선 사용하고,
 * 서버 TTS를 쓸 수 없으면 브라우저 내장 음성(speechSynthesis)으로 대체한다.
 */
export function useTts() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cacheRef = useRef(new Map<string, string>());
  const serverAvailable = useRef(true);
  const loopRef = useRef(false);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [loop, setLoopState] = useState(false);

  const setLoop = useCallback((value: boolean) => {
    loopRef.current = value;
    setLoopState(value);
  }, []);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setPlayingKey(null);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const speakWithBrowser = useCallback(
    (text: string, speed: Speed, key: string) => {
      const synth = window.speechSynthesis;
      if (!synth) return;
      const utter = new SpeechSynthesisUtterance(text);
      const voices = synth.getVoices();
      utter.voice =
        voices.find((v) => v.lang === "en-AU") ??
        voices.find((v) => v.lang.startsWith("en")) ??
        null;
      utter.lang = utter.voice?.lang ?? "en-AU";
      utter.rate = speed === "slow" ? 0.65 : 0.95;
      utter.onend = () => {
        if (loopRef.current) setTimeout(() => synth.speak(utter), 600);
        else setPlayingKey(null);
      };
      synth.cancel();
      setPlayingKey(key);
      synth.speak(utter);
    },
    [],
  );

  const play = useCallback(
    async (text: string, speed: Speed = "normal", key = `${speed}:${text}`) => {
      stop();
      if (serverAvailable.current) {
        const cacheKey = `${speed}:${text}`;
        let url = cacheRef.current.get(cacheKey);
        if (!url) {
          setPlayingKey(key);
          const res = await fetch(
            `/api/tts?speed=${speed}&text=${encodeURIComponent(text)}`,
          );
          if (res.ok) {
            url = URL.createObjectURL(await res.blob());
            cacheRef.current.set(cacheKey, url);
          } else if (res.status === 503) {
            serverAvailable.current = false;
          }
        }
        if (url) {
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = () => {
            if (loopRef.current) {
              setTimeout(() => {
                if (loopRef.current) void audio.play();
              }, 600);
            } else {
              setPlayingKey(null);
            }
          };
          setPlayingKey(key);
          await audio.play().catch(() => setPlayingKey(null));
          return;
        }
      }
      speakWithBrowser(text, speed, key);
    },
    [speakWithBrowser, stop],
  );

  return { play, stop, playingKey, loop, setLoop };
}
