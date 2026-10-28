"use client";

import { useEffect, useRef, useState } from "react";
import { COMPLETE_PERCENT, SEGMENT_SECONDS } from "@/lib/classroom/progress-rules";

// 유튜브 IFrame Player API 중 실제로 쓰는 부분만
interface YTPlayer {
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  pauseVideo(): void;
  destroy(): void;
}
interface YTNamespace {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      host?: string;
      playerVars?: Record<string, number>;
      events?: { onStateChange?: (e: { data: number }) => void; onReady?: () => void };
    },
  ) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  apiPromise ??= new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT!);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return apiPromise;
}

const REPORT_INTERVAL_MS = 15_000;
// 한 번 확인할 때 이보다 많이 넘어가면 '건너뛰기'로 보고 기록하지 않음 (2배속 + 여유)
const MAX_NATURAL_STEP = 2.6;

export function TrackedVideo({
  lessonId,
  videoId,
  title,
  initialSegments,
  initialDuration,
  initialPosition,
}: {
  lessonId: string;
  videoId: string;
  title: string;
  initialSegments: number[];
  initialDuration: number | null;
  /** 마지막으로 본 위치(초). 있으면 거기서부터 이어 본다 */
  initialPosition?: number | null;
}) {
  const holderRef = useRef<HTMLDivElement>(null);
  const segmentsRef = useRef(new Set(initialSegments));
  const durationRef = useRef(initialDuration ?? 0);
  const dirtyRef = useRef(false);
  // 지난 보고 이후 실제로 재생한 초 (복습 포함)
  const playedRef = useRef(0);
  // 지금 보고 있는 위치 (이어 보기용)
  const positionRef = useRef<number | null>(null);
  // 끝까지 다 봤거나 거의 끝이면 처음부터, 아니면 본 곳부터
  const resumeAt =
    initialPosition && initialDuration && initialPosition > 5 && initialPosition < initialDuration - 20
      ? Math.floor(initialPosition)
      : 0;
  const [resumeShown, setResumeShown] = useState(resumeAt > 0);
  const [percent, setPercent] = useState(() =>
    initialDuration ? calcPercent(new Set(initialSegments), initialDuration) : 0,
  );

  useEffect(() => {
    let player: YTPlayer | null = null;
    let lastTime: number | null = null;
    let cancelled = false;

    const report = (useBeacon = false) => {
      const duration = durationRef.current;
      const played = Math.floor(playedRef.current);
      if ((!dirtyRef.current && played < 1) || !duration) return;
      dirtyRef.current = false;
      playedRef.current -= played;
      const position = positionRef.current == null ? undefined : Math.floor(positionRef.current);
      const body = JSON.stringify({ lessonId, duration, played, position, segments: [...segmentsRef.current] });
      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon("/api/progress", new Blob([body], { type: "application/json" }));
        return;
      }
      fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body })
        .then((r) => (r.ok ? r.json() : null))
        .then((res: { percent: number } | null) => {
          if (res) setPercent((p) => Math.max(p, res.percent));
        })
        .catch(() => {
          dirtyRef.current = true;
          playedRef.current += played;
        });
    };

    const tick = () => {
      const YT = window.YT;
      if (!player || !YT) return;
      if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
        lastTime = null;
        return;
      }
      const duration = player.getDuration();
      if (duration > 0) durationRef.current = Math.round(duration);
      const now = player.getCurrentTime();
      positionRef.current = now;
      if (lastTime != null) {
        const step = now - lastTime;
        if (step > 0 && step <= MAX_NATURAL_STEP) {
          playedRef.current += step;
          for (let s = Math.floor(lastTime); s <= Math.floor(now); s++) {
            const seg = Math.floor(s / SEGMENT_SECONDS);
            if (!segmentsRef.current.has(seg)) {
              segmentsRef.current.add(seg);
              dirtyRef.current = true;
            }
          }
          if (durationRef.current) setPercent(calcPercent(segmentsRef.current, durationRef.current));
        }
      }
      lastTime = now;
    };

    loadYouTubeApi().then((YT) => {
      if (cancelled || !holderRef.current) return;
      const el = document.createElement("div");
      holderRef.current.appendChild(el);
      player = new YT.Player(el, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: { rel: 0, playsinline: 1, ...(resumeAt ? { start: resumeAt } : {}) },
        events: {
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
              tick();
              report();
            }
          },
        },
      });
    });

    const tickTimer = setInterval(tick, 1000);
    const reportTimer = setInterval(() => report(), REPORT_INTERVAL_MS);
    const onHide = () => {
      if (document.visibilityState === "hidden") report(true);
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);

    return () => {
      cancelled = true;
      clearInterval(tickTimer);
      clearInterval(reportTimer);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
      report(true);
      player?.destroy();
    };
    // resumeAt은 처음 열 때 한 번만 쓴다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, videoId]);

  const completed = percent >= COMPLETE_PERCENT;
  return (
    <div className="flex flex-col gap-2">
      <div
        ref={holderRef}
        title={title}
        className="aspect-video w-full overflow-hidden rounded-lg bg-black [&>iframe]:h-full [&>iframe]:w-full"
      />
      {resumeShown && (
        <p className="flex items-center justify-between gap-2 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
          ▶ 지난번 본 {formatTime(resumeAt)}부터 이어서 재생돼요
          <button type="button" onClick={() => setResumeShown(false)} className="text-zinc-400">
            ✕
          </button>
        </p>
      )}
      <div className="flex items-center gap-2 text-xs">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200">
          <div
            className={`h-full ${completed ? "bg-green-500" : "bg-brand-500"}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className={completed ? "font-semibold text-green-700" : "text-zinc-600"}>
          {completed ? `✅ 수강 완료 (${percent}%)` : `시청 ${percent}% · ${COMPLETE_PERCENT}% 이상 보면 수강 완료`}
        </span>
      </div>
    </div>
  );
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function calcPercent(segments: Set<number>, duration: number) {
  const total = Math.max(1, Math.ceil(duration / SEGMENT_SECONDS));
  let watched = 0;
  for (const s of segments) if (s < total) watched++;
  return Math.min(100, Math.floor((watched / total) * 100));
}
