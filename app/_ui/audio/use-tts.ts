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
  // 재생 요청 번호: 소리를 받아오는 사이 다른 재생·정지가 오면 늦게 온 소리는 버린다
  const playIdRef = useRef(0);
  const pendingRef = useRef(new Map<string, Promise<string | null>>());
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [loop, setLoopState] = useState(false);

  const setLoop = useCallback((value: boolean) => {
    loopRef.current = value;
    setLoopState(value);
  }, []);

  const stop = useCallback(() => {
    playIdRef.current++;
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

  /** 서버 음성을 받아 캐시에 넣는다 (같은 문장은 한 번만 요청) */
  const load = useCallback(async (text: string, speed: Speed, voice = "a") => {
    const cacheKey = `${voice}:${speed}:${text}`;
    const cached = cacheRef.current.get(cacheKey);
    if (cached) return cached;
    const pending = pendingRef.current.get(cacheKey);
    if (pending) return pending;
    const job = (async () => {
      try {
        const res = await fetch(`/api/tts?speed=${speed}&voice=${voice}&text=${encodeURIComponent(text)}`);
        if (res.ok) {
          const url = URL.createObjectURL(await res.blob());
          cacheRef.current.set(cacheKey, url);
          return url;
        }
        if (res.status === 503) serverAvailable.current = false;
      } catch {
        // 네트워크 문제면 브라우저 음성으로
      }
      return null;
    })();
    pendingRef.current.set(cacheKey, job);
    const url = await job;
    pendingRef.current.delete(cacheKey);
    return url;
  }, []);

  /** 미리 받아두기 (문제가 뜰 때 정답 문장을 준비) */
  const preload = useCallback(
    (text: string | undefined, speed: Speed = "normal", voice = "a") => {
      if (text && serverAvailable.current) void load(text, speed, voice);
    },
    [load],
  );

  const play = useCallback(
    async (text: string, speed: Speed = "normal", key = `${speed}:${text}`, voice = "a"): Promise<void> => {
      stop();
      const id = playIdRef.current;
      if (serverAvailable.current) {
        if (!cacheRef.current.has(`${voice}:${speed}:${text}`)) setPlayingKey(key);
        const url = await load(text, speed, voice);
        if (id !== playIdRef.current) return; // 그사이 다른 소리를 틀었거나 멈춤
        if (url) {
          const audio = new Audio(url);
          audioRef.current = audio;
          setPlayingKey(key);
          return new Promise<void>((resolve) => {
            audio.onended = () => {
              if (loopRef.current) {
                setTimeout(() => {
                  if (loopRef.current) void audio.play();
                }, 600);
              } else {
                setPlayingKey(null);
              }
              resolve();
            };
            audio.onpause = () => resolve();
            audio.play().catch(() => {
              setPlayingKey(null);
              resolve();
            });
          });
        }
      }
      if (id !== playIdRef.current) return;
      speakWithBrowser(text, speed, key);
    },
    [speakWithBrowser, stop, load],
  );

  return { play, stop, preload, playingKey, loop, setLoop };
}
