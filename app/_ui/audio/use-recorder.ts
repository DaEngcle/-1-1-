"use client";

import { useEffect, useRef, useState } from "react";

/** 마이크 녹음 훅. maxSeconds가 지나면 자동으로 멈춘다 */
export function useRecorder(maxSeconds: number) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function stop() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    setRecording(false);
  }

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const recorded = new Blob(chunks, { type: recorder.mimeType });
        setBlob(recorded);
        setUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return URL.createObjectURL(recorded);
        });
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setSeconds(0);
      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed++;
        setSeconds(elapsed);
        if (elapsed >= maxSeconds) stop();
      }, 1000);
    } catch {
      setError("마이크 권한이 필요해요. 브라우저 설정에서 마이크를 허용해주세요.");
    }
  }

  function reset() {
    setBlob(null);
    setUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
  }

  return { recording, seconds, blob, url, error, start, stop, reset };
}
