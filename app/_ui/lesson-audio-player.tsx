"use client";

import { useEffect, useRef, useState } from "react";
import { SEGMENT_SECONDS } from "@/lib/classroom/progress-rules";

const SPEEDS = [1, 1.25, 1.5] as const;
const REPORT_INTERVAL_MS = 15_000;
const posKey = (lessonId: string) => `lesson-audio-pos:${lessonId}`;

function readPos(lessonId: string) {
  try {
    const v = Number(localStorage.getItem(posKey(lessonId)));
    return Number.isFinite(v) && v > 0 ? v : 0;
  } catch {
    return 0;
  }
}
function savePos(lessonId: string, sec: number) {
  try {
    localStorage.setItem(posKey(lessonId), String(Math.floor(sec)));
  } catch {
    // 저장 못 해도 재생은 계속
  }
}

/**
 * 강의 소리만 듣기 (화면 꺼도 재생). 잠금 화면 컨트롤은 Media Session API로.
 * 들은 구간은 영상과 같은 /api/progress로 보내 수강 기록에 합친다.
 */
export function LessonAudioPlayer({
  lessonId,
  src,
  title,
  artwork,
}: {
  lessonId: string;
  src: string;
  /** 잠금 화면 제목 (Day NN · 레슨 제목) */
  title: string;
  /** 잠금 화면 그림 (앱 기준 경로) */
  artwork: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const segments = new Set<number>();
    let dirty = false;
    let played = 0;
    // 마지막으로 확인한 재생 위치와 그때의 실제 시각 (건너뛰기는 기록하지 않기 위해)
    let last: { pos: number; at: number } | null = null;

    const report = (useBeacon = false) => {
      const dur = Math.round(audio.duration);
      const sec = Math.floor(played);
      if ((!dirty && sec < 1) || !Number.isFinite(dur) || dur < 1) return;
      dirty = false;
      played -= sec;
      const body = JSON.stringify({
        lessonId,
        duration: dur,
        played: sec,
        position: Math.floor(audio.currentTime),
        segments: [...segments],
      });
      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon("/api/progress", new Blob([body], { type: "application/json" }));
        return;
      }
      fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body }).then(
        (r) => {
          if (!r.ok) throw new Error();
        },
      ).catch(() => {
        dirty = true;
        played += sec;
      });
    };

    const track = () => {
      const now = audio.currentTime;
      setCurrent(now);
      savePos(lessonId, now);
      if (audio.paused) {
        last = null;
        return;
      }
      const at = performance.now();
      if (last) {
        const step = now - last.pos;
        // 화면이 꺼져 이벤트가 드문드문 와도, 실제 흐른 시간 × 배속 안이면 들은 것으로 본다
        const allowed = ((at - last.at) / 1000) * audio.playbackRate * 1.2 + 1;
        if (step > 0 && step <= allowed) {
          played += step;
          for (let s = Math.floor(last.pos); s <= Math.floor(now); s++) {
            const seg = Math.floor(s / SEGMENT_SECONDS);
            if (!segments.has(seg)) {
              segments.add(seg);
              dirty = true;
            }
          }
        }
      }
      last = { pos: now, at };
    };

    const onMeta = () => {
      setDuration(audio.duration);
      const saved = readPos(lessonId);
      // 거의 끝까지 들었으면 처음부터
      if (saved > 5 && saved < audio.duration - 20) audio.currentTime = saved;
      setCurrent(audio.currentTime);
    };
    const onPlay = () => {
      setPlaying(true);
      last = null;
      if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "playing";
    };
    const onPause = () => {
      track();
      setPlaying(false);
      if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "paused";
      report();
    };
    const onSeeking = () => {
      last = null;
    };

    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate", track);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);
    audio.addEventListener("seeking", onSeeking);
    if (audio.readyState >= 1) onMeta();

    if ("mediaSession" in navigator) {
      const ms = navigator.mediaSession;
      try {
        ms.metadata = new MediaMetadata({
          title,
          artist: "다잉클",
          artwork: [{ src: new URL(artwork, location.href).href, sizes: "512x512", type: "image/png" }],
        });
      } catch {
        // MediaMetadata 없는 브라우저
      }
      const seekBy = (d: number) => {
        audio.currentTime = Math.min(Math.max(0, audio.currentTime + d), audio.duration || Infinity);
      };
      const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
        ["play", () => void audio.play()],
        ["pause", () => audio.pause()],
        ["seekbackward", (d) => seekBy(-(d.seekOffset ?? 10))],
        ["seekforward", (d) => seekBy(d.seekOffset ?? 10)],
        [
          "seekto",
          (d) => {
            if (d.seekTime == null) return;
            if (d.fastSeek && "fastSeek" in audio) audio.fastSeek(d.seekTime);
            else audio.currentTime = d.seekTime;
          },
        ],
      ];
      for (const [action, handler] of handlers) {
        try {
          ms.setActionHandler(action, handler);
        } catch {
          // 지원하지 않는 동작
        }
      }
    }

    const reportTimer = setInterval(() => report(), REPORT_INTERVAL_MS);
    const onHide = () => {
      if (document.visibilityState === "hidden") report(true);
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);

    return () => {
      clearInterval(reportTimer);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate", track);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
      audio.removeEventListener("seeking", onSeeking);
      report(true);
      if ("mediaSession" in navigator) {
        for (const action of ["play", "pause", "seekbackward", "seekforward", "seekto"] as MediaSessionAction[]) {
          try {
            navigator.mediaSession.setActionHandler(action, null);
          } catch {
            // 무시
          }
        }
      }
    };
  }, [lessonId, title, artwork]);

  const audio = () => audioRef.current;
  const seekBy = (d: number) => {
    const a = audio();
    if (!a) return;
    a.currentTime = Math.min(Math.max(0, a.currentTime + d), a.duration || Infinity);
  };
  const btn = "rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-brand-900/5">
      <audio ref={audioRef} src={src} preload="metadata" playsInline />
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={playing ? "일시정지" : "재생"}
          onClick={() => {
            const a = audio();
            if (!a) return;
            if (a.paused) void a.play();
            else a.pause();
          }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg text-white"
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <div className="flex flex-1 flex-col gap-1">
          <input
            type="range"
            aria-label="재생 위치"
            min={0}
            max={duration || 0}
            step={1}
            value={Math.min(current, duration || 0)}
            onChange={(e) => {
              const a = audio();
              if (a) a.currentTime = Number(e.target.value);
            }}
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-xs text-zinc-500">
            <span>{formatTime(current)}</span>
            <span>{duration ? formatTime(duration) : "--:--"}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={btn} onClick={() => seekBy(-10)}>
          ⏪ 10초
        </button>
        <button type="button" className={btn} onClick={() => seekBy(10)}>
          10초 ⏩
        </button>
        <span className="flex-1" />
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setSpeed(s);
              const a = audio();
              if (a) a.playbackRate = s;
            }}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              speed === s ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-zinc-700"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}

function formatTime(sec: number) {
  const t = Math.floor(sec);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = String(t % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}
