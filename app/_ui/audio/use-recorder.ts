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
export function useRecorder(
  maxSeconds: number,
  /** 녹음이 끝나면 (성공: WAV, 실패: null) */
  onFinished?: (wav: Blob | null) => void,
  /** keepContext: 오디오를 계속 켜 둔다 (화면을 안 눌러도 다음 녹음을 바로 시작할 수 있게 — 아이폰용) */
  options: { keepContext?: boolean } = {},
) {
  const keepContext = Boolean(options.keepContext);
  const onFinishedRef = useRef(onFinished);
  useEffect(() => {
    onFinishedRef.current = onFinished;
  });
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
  const stopRef = useRef<() => void>(() => {});

  function release(closeContext = !keepContext) {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    nodeRef.current?.disconnect();
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (closeContext) {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    }
    nodeRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    activeRef.current = false;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => release(true), []);

  // 다른 앱으로 나가면 오디오·마이크를 완전히 끈다 (돌아와서 누르면 새로 켠다)
  useEffect(() => {
    function onHide() {
      if (document.visibilityState !== "hidden") return;
      if (activeRef.current) {
        // 말하다가 나간 녹음은 보내지 않고 버린다
        chunksRef.current = [];
        stopRef.current();
      }
      else if (!startingRef.current) release(true);
    }
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function makeContext() {
    if (ctxRef.current && ctxRef.current.state !== "closed") return ctxRef.current;
    const AudioCtx: Ctx =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: Ctx }).webkitAudioContext;
    ctxRef.current = new AudioCtx();
    return ctxRef.current;
  }

  /** 화면을 누른 순간에 미리 오디오를 켜 둔다 (그 뒤엔 자동으로 녹음 시작 가능) */
  function prepare() {
    void makeContext().resume().catch(() => {});
  }

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
      // 데이터가 거의 없으면 오디오가 멈춘 것일 수 있어서, 다음 녹음은 새로 연다
      release(true);
      setError(
        total === 0
          ? "마이크 소리가 들어오지 않았어요. 🎙 버튼을 한 번 더 눌러 주세요. (마이크를 새로 켤게요)"
          : "녹음이 너무 짧아요. 버튼을 누르고 문장을 끝까지 말한 다음 멈춰주세요.",
      );
      onFinishedRef.current?.(null);
      return;
    }
    if (peak < 0.003) {
      // 켜 둔 오디오가 먹통이 됐을 수 있어서, 다음 녹음은 마이크를 새로 연다
      release(true);
      setError("소리가 거의 녹음되지 않았어요. 🎙 버튼을 눌러 다시 말해 주세요. (마이크를 새로 켤게요)");
      onFinishedRef.current?.(null);
      return;
    }
    // 작게 녹음됐으면 크게 키워서 보낸다 (조용한 마이크도 알아듣게)
    if (peak < 0.3) {
      const gain = Math.min(8, 0.6 / peak);
      for (let i = 0; i < samples.length; i++) samples[i] *= gain;
    }
    const wav = encodeWav16kMono(samples, rate);
    setBlob(wav);
    setUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(wav);
    });
    onFinishedRef.current?.(wav);
  }

  /**
   * autoStop: 말을 시작했다가 1.6초 조용하면 자동으로 끝낸다 (10초 동안 아무 말이 없어도 끝낸다)
   */
  async function start(opts: { autoStop?: boolean; retried?: boolean } = {}) {
    const retried = Boolean(opts.retried);
    if (activeRef.current || startingRef.current) return;
    startingRef.current = true;
    setError(null);
    reset();
    // 앱을 나갔다 오면 아이폰이 켜 둔 오디오를 멈춰(interrupted) 버린다 → 새로 만든다
    if (ctxRef.current && ctxRef.current.state !== "running") {
      ctxRef.current.close().catch(() => {});
      ctxRef.current = null;
    }
    // 아이폰은 '누른 그 순간'에 오디오를 켜야 해서, 권한을 묻기 전에 먼저 만든다
    const ctx = makeContext();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      await ctx.resume();
      const source = ctx.createMediaStreamSource(stream);
      const node = ctx.createScriptProcessor(4096, 1, 1);
      chunksRef.current = [];
      let lastLevel = 0;
      const startedAt = Date.now();
      let spokeAt = 0; // 마지막으로 목소리가 들린 시각
      let loudRun = 0; // 연속으로 목소리가 들린 횟수 (잡음 무시)
      let spoke = false;
      let anySignal = false;
      node.onaudioprocess = (e) => {
        if (!activeRef.current) return;
        const data = e.inputBuffer.getChannelData(0);
        chunksRef.current.push(new Float32Array(data));
        if (!anySignal) {
          for (let i = 0; i < data.length; i += 8) {
            if (data[i] !== 0) {
              anySignal = true;
              break;
            }
          }
          // 2초 동안 완전한 0만 들어오면 마이크가 먹통 → 새로 연다 (한 번만)
          if (!anySignal && !retried && Date.now() - startedAt > 2000) {
            activeRef.current = false;
            setTimeout(() => {
              release(true);
              setRecording(false);
              void start({ ...opts, retried: true });
            }, 0);
            return;
          }
        }
        let sum = 0;
        for (let i = 0; i < data.length; i += 16) sum += data[i] * data[i];
        const raw = Math.sqrt(sum / (data.length / 16));
        // 소리 크기 표시 (너무 자주 그리지 않게)
        const shown = Math.min(1, raw * 6);
        if (Math.abs(shown - lastLevel) > 0.05) {
          lastLevel = shown;
          setLevel(shown);
        }
        if (!opts.autoStop) return;
        const now = Date.now();
        if (raw > 0.025) {
          loudRun++;
          spokeAt = now;
          if (loudRun >= 2) spoke = true;
        } else loudRun = 0;
        if ((spoke && now - spokeAt > 1600) || (!spoke && now - startedAt > 10000)) {
          setTimeout(() => stopRef.current(), 0);
        }
      };
      source.connect(node);
      node.connect(ctx.destination); // 연결해야 처리가 돈다 (출력은 무음)
      sourceRef.current = source;
      nodeRef.current = node;
      activeRef.current = true;
      // 마이크를 켜는 사이에 앱을 나갔으면 바로 끈다 (숨은 화면에서 녹음이 켜져 있지 않게)
      if (document.visibilityState === "hidden") {
        chunksRef.current = [];
        activeRef.current = false;
        release(true);
        onFinishedRef.current?.(null);
        return;
      }
      setRecording(true);
      setSeconds(0);
      // 오디오가 멈춰 있으면 녹음 데이터가 아예 안 들어온다 → 1.5초 뒤 한 번 새로 연다
      if (!retried) {
        setTimeout(() => {
          if (activeRef.current && chunksRef.current.length === 0) {
            activeRef.current = false;
            release(true);
            setRecording(false);
            void start({ ...opts, retried: true });
          }
        }, 1500);
      }
      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed++;
        setSeconds(elapsed);
        if (elapsed >= maxSeconds) stop();
      }, 1000);
    } catch {
      release(true);
      setError("마이크 권한이 필요해요. 브라우저 설정에서 마이크를 허용해주세요.");
      onFinishedRef.current?.(null);
    } finally {
      startingRef.current = false;
    }
  }

  useEffect(() => {
    stopRef.current = stop;
  });

  return { recording, seconds, level, blob, url, error, start, stop, reset, prepare };
}
