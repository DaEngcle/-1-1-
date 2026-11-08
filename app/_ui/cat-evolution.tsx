"use client";

import { useEffect, useState, useTransition } from "react";
import { CAT_STAGE_NAMES, type CatBreed, type CatStage } from "@/lib/classroom/cat";
import { seeCatStage } from "@/app/student/cat-stage-actions";
import { CatSprite } from "./cat";

/** 고양이가 한 단계 자랐을 때 한 번만 뜨는 축하 화면: 전 단계와 새 단계가 번갈아 깜빡이다가 새 모습으로 */
export function CatEvolution({ breed, name, from, to }: { breed: CatBreed; name: string; from: CatStage; to: CatStage }) {
  const [open, setOpen] = useState(true);
  const [tick, setTick] = useState(0);
  const [, startTransition] = useTransition();
  const FLASHES = 9;

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setTick((t) => (t >= FLASHES ? t : t + 1)), 180);
    return () => clearInterval(id);
  }, [open]);

  if (!open) return null;
  const done = tick >= FLASHES;
  const shown = done || tick % 2 === 1 ? to : from;

  function close() {
    setOpen(false);
    startTransition(() => seeCatStage());
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="고양이 성장"
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-brand-50 via-white to-[#fff8e8] px-6 pt-[env(safe-area-inset-top)] pb-[calc(24px+env(safe-area-inset-bottom))] text-center"
    >
      <div className={`transition-transform duration-300 ${done ? "scale-110" : ""}`}>
        <CatSprite breed={breed} stage={shown} mood={done ? "cheer" : "default"} className="h-44 w-56" />
      </div>
      <p className="text-2xl font-extrabold leading-snug text-zinc-900" aria-live="polite">
        {done ? (
          <>
            {name}님 고양이가 자랐어요!
            <br />
            <span className="text-brand-600">
              {to}단계 {CAT_STAGE_NAMES[to]}
            </span>
          </>
        ) : (
          "어…? 고양이가 달라지고 있어요"
        )}
      </p>
      {done && <p className="text-sm text-zinc-500">공부한 날이 쌓여서 자랐어요. 앞으로도 같이 해요.</p>}
      <button
        type="button"
        onClick={close}
        disabled={!done}
        autoFocus
        className="w-full max-w-xs rounded-2xl border-b-4 border-brand-800 bg-brand-600 px-5 py-4 text-lg font-extrabold text-white transition-opacity active:translate-y-0.5 active:border-b-2 disabled:opacity-0"
      >
        좋아요
      </button>
    </div>
  );
}
