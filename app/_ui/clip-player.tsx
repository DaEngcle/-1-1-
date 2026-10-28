"use client";

import { useRef, useState } from "react";

/** 교재 영상 (원어민 대화 짧은 클립): 반복 재생 · 느리게 */
export function ClipPlayer({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loop, setLoop] = useState(false);
  const [slow, setSlow] = useState(false);
  const btn = (on: boolean) =>
    `rounded-full border px-3 py-1 text-xs font-semibold ${on ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-zinc-700"}`;
  return (
    <div className="flex flex-col gap-2">
      <video
        ref={ref}
        src={src}
        title={title}
        controls
        playsInline
        preload="metadata"
        loop={loop}
        className="aspect-video w-full rounded-lg bg-black"
      />
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btn(loop)} onClick={() => setLoop((v) => !v)}>
          🔁 반복 재생
        </button>
        <button
          type="button"
          className={btn(slow)}
          onClick={() => {
            const next = !slow;
            setSlow(next);
            if (ref.current) ref.current.playbackRate = next ? 0.75 : 1;
          }}
        >
          🐢 0.75배속
        </button>
        <button
          type="button"
          className={btn(false)}
          onClick={() => {
            if (!ref.current) return;
            ref.current.currentTime = 0;
            void ref.current.play();
          }}
        >
          ⏮ 처음부터
        </button>
      </div>
    </div>
  );
}
