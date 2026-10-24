"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ItemPreview } from "@/app/_ui/cat-room";
import { BOX_MIN_DAYS, BOX_ODDS } from "@/lib/classroom/cat-house";
import { openBox } from "./actions";

/** 주간 깜짝 상자 (무료·확률 공개) */
export function BoxButton({ opened, weekDays }: { opened: boolean; weekDays: number }) {
  const router = useRouter();
  const [result, setResult] = useState<{ message: string; itemId?: string } | null>(null);
  const [pending, start] = useTransition();
  const ready = !opened && weekDays >= BOX_MIN_DAYS;
  return (
    <section className="flex flex-col gap-2 rounded-2xl bg-gradient-to-br from-amber-100 to-pink-100 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`text-4xl ${ready ? "animate-bounce" : ""}`}>🎁</span>
        <div className="flex flex-1 flex-col">
          <span className="font-extrabold text-zinc-900">이번 주 깜짝 상자</span>
          <span className="text-xs text-zinc-600">
            {opened
              ? "이번 주는 열었어요. 다음 주 월요일에 새 상자!"
              : `이번 주 ${BOX_MIN_DAYS}일 공부하면 무료로 열려요 (지금 ${Math.min(weekDays, BOX_MIN_DAYS)}/${BOX_MIN_DAYS}일)`}
          </span>
        </div>
        <button
          type="button"
          disabled={!ready || pending}
          onClick={() =>
            start(async () => {
              const r = await openBox();
              setResult(r);
              if (r.ok) router.refresh();
            })
          }
          className="rounded-full bg-pink-500 px-4 py-2 text-sm font-extrabold text-white shadow disabled:bg-zinc-300"
        >
          {pending ? "여는 중…" : "열기"}
        </button>
      </div>
      {result && (
        <div className="flex items-center gap-2 rounded-xl bg-white/80 p-2 text-sm font-semibold text-zinc-800">
          {"itemId" in result && result.itemId && <ItemPreview id={result.itemId} className="h-10 w-10" />}
          {result.message}
        </div>
      )}
      <p className="text-[11px] text-zinc-500">
        확률: 일반 {BOX_ODDS.일반}% · 레어 {BOX_ODDS.레어}% · 전설 {BOX_ODDS.전설}% · 돈으로는 살 수 없어요 · 이미 다 가진 등급이면 츄르 30개
      </p>
    </section>
  );
}
