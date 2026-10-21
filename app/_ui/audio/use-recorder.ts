"use client";

import { useEffect, useRef, useState } from "react";
import { encodeWav16kMono } from "./wav";

type Ctx = typeof AudioContext;

/**
 * 마이크 녹음 훅. maxSeconds가 지나면 자동으로 멈춘다.
 *
 * 마이크 소리를 Web Audio로 바로 받아 16kHz WAV로 만든다.
 * (예전엔 MediaRecorder로 압축 녹음 → 변환했는데, 아이폰 사파리에서 변환할 때
 *  앞 0.5초만 남고 잘리는 일이 있어서 채점이 0점으로 나왔다)
 */
export function useRecorder(maxSeconds: number) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [level, setLevel] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nodeRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const chunksRef = useRef<Float32Array[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef = useRef(false);
  const startingRef = useRef(false);

  function release() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    nodeRef.current?.disconnect();
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    ctxRef.current?.close().catch(() => {});
    nodeRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    ctxRef.current = null;
    activeRef.current = false;
  }

  useEffect(() => release, []);

  function reset() {
    setBlob(null);
    setUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
  }

  function stop() {
    if (!activeRef.current) return;
    const rate = ctxRef.current?.sampleRate ?? 48000;
    const chunks = chunksRef.current;
    chunksRef.current = [];
    release();
    setRecording(false);
    setLevel(0);

    const total = chunks.reduce((n, c) => n + c.length, 0);
    const samples = new Float32Array(total);
    let at = 0;
    for (const c of chunks) {
      samples.set(c, at);
      at += c.length;
    }
    let peak = 0;
    for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]));

    if (total / rate < 0.8) {
      setError("녹음이 너무 짧아요. 버튼을 누르고 문장을 끝까지 말한 다음 멈춰주세요.");
      return;
    }
    if (peak < 0.01) {
      setError("소리가 거의 녹음되지 않았어요. 마이크를 손으로 막고 있지 않은지 확인하고 다시 녹음해주세요.");
      return;
    }
    const wav = encodeWav16kMono(samples, rate);
    setBlob(wav);
    setUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(wav);
    });
  }

  async function start() {
    if (activeRef.current || startingRef.current) return;
    startingRef.current = true;
    setError(null);
    reset();
    // 아이폰은 '누른 그 순간'에 오디오를 켜야 해서, 권한을 묻기 전에 먼저 만든다
    const AudioCtx: Ctx =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: Ctx }).webkitAudioContext;
    const ctx = new AudioCtx();
    ctxRef.current = ctx;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      await ctx.resume();
      const source = ctx.createMediaStreamSource(stream);
      const node = ctx.createScriptProcessor(4096, 1, 1);
      chunksRef.current = [];
      let lastLevel = 0;
      node.onaudioprocess = (e) => {
        if (!activeRef.current) return;
        const data = e.inputBuffer.getChannelData(0);
        chunksRef.current.push(new Float32Array(data));
        // 소리 크기 표시 (너무 자주 그리지 않게)
        let sum = 0;
        for (let i = 0; i < data.length; i += 16) sum += data[i] * data[i];
        const rms = Math.min(1, Math.sqrt(sum / (data.length / 16)) * 6);
        if (Math.abs(rms - lastLevel) > 0.05) {
          lastLevel = rms;
          setLevel(rms);
        }
      };
      source.connect(node);
      node.connect(ctx.destination); // 연결해야 처리가 돈다 (출력은 무음)
      sourceRef.current = source;
      nodeRef.current = node;
      activeRef.current = true;
      setRecording(true);
      setSeconds(0);
      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed++;
        setSeconds(elapsed);
        if (elapsed >= maxSeconds) stop();
      }, 1000);
    } catch {
      release();
      setError("마이크 권한이 필요해요. 브라우저 설정에서 마이크를 허용해주세요.");
    } finally {
      startingRef.current = false;
    }
  }

  return { recording, seconds, level, blob, url, error, start, stop, reset };
}
