"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CatBreed } from "@/lib/classroom/cat";
import { CatSays } from "./course/course-ui";
import { useMyCat } from "@/app/_ui/cat-context";
import { dismissGuide } from "./course/actions";

/** 처음 온 학생에게 보여 주는 앱 사용법 4장 (한 번 보면 다시 안 뜬다. 더보기에서 다시 볼 수 있다) */
export function FirstVisitGuide({ breed, name, hasCourse }: { breed: CatBreed; name: string; hasCourse: boolean }) {
  const router = useRouter();
  const myStage = useMyCat()?.stage;
  const [open, setOpen] = useState(true);
  const [i, setI] = useState(0);
  const [, startTransition] = useTransition();

  const cards: { body: React.ReactNode; mood?: "default" | "happy" }[] = [
    {
      body: (
        <>
          반가워요, {name}님!
          <br />
          여기는 다니엘 쌤과 워홀 영어를 연습하는 곳이에요.
        </>
      ),
    },
    { body: <>먼저 1분 질문에 답하면 {name}님에게 맞는 워홀 코스를 짜 줘요.</> },
    { body: <>매일 &lsquo;오늘의 연습&rsquo; 몇 개만 하면 돼요. 하면 츄르 🐟를 받아요.</>, mood: "happy" },
    {
      body: (
        <span className="flex flex-col gap-1.5 text-left">
          <span>어디에 뭐가 있는지만 알려 줄게요.</span>
          <span className="font-semibold">🎬 강의: 데일리 강의·다시보기는 아래 &lsquo;강의&rsquo;</span>
          <span className="font-semibold">🎮 보카: 표현 게임은 아래 &lsquo;보카&rsquo;</span>
          <span className="font-semibold">🏠 고양이 집·마을: &lsquo;더보기&rsquo; 맨 위</span>
        </span>
      ),
      mood: "happy",
    },
  ];
  const last = i === cards.length - 1;

  function close(to?: string) {
    setOpen(false);
    startTransition(() => dismissGuide());
    if (to) router.push(to);
    else router.replace("/student", { scroll: false });
  }

  // Esc = 건너뛰기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="앱 사용법"
      className="fixed inset-0 z-[65] overflow-y-auto bg-gradient-to-b from-brand-50 via-white to-[#fff8e8]"
    >
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-4 pt-[calc(16px+env(safe-area-inset-top))] pb-[calc(16px+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between py-2">
          <div className="flex gap-1.5" aria-label={`${cards.length}장 중 ${i + 1}번째`}>
            {cards.map((_, k) => (
              <span key={k} className={`h-2 rounded-full transition-all ${k === i ? "w-6 bg-brand-500" : "w-2 bg-brand-200"}`} />
            ))}
          </div>
          {!last && (
            <button type="button" onClick={() => close()} className="rounded-full px-3 py-1.5 text-sm font-semibold text-zinc-500 hover:bg-white">
              건너뛰기
            </button>
          )}
        </div>

        <div key={i} className="mt-14 flex flex-col items-center" aria-live="polite">
          <CatSays breed={breed} stage={myStage} mood={cards[i].mood} big>
            {cards[i].body}
          </CatSays>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-6">
          {last ? (
            <>
              <button
                type="button"
                autoFocus
                onClick={() => close(hasCourse ? "/student/course" : "/student/course/start")}
                className="w-full rounded-2xl border-b-4 border-brand-800 bg-brand-600 px-5 py-4 text-lg font-extrabold text-white active:translate-y-0.5 active:border-b-2"
              >
                {hasCourse ? "내 코스 보기" : "내 코스 만들기"}
              </button>
              <button type="button" onClick={() => close()} className="w-full rounded-2xl px-5 py-3 font-bold text-zinc-500 hover:bg-white">
                나중에 할게요
              </button>
            </>
          ) : (
            <>
              <button
                key={`next-${i}`}
                type="button"
                autoFocus
                onClick={() => setI(i + 1)}
                className="w-full rounded-2xl border-b-4 border-brand-800 bg-brand-600 px-5 py-4 text-lg font-extrabold text-white active:translate-y-0.5 active:border-b-2"
              >
                다음
              </button>
              {i > 0 && (
                <button type="button" onClick={() => setI(i - 1)} className="w-full rounded-2xl px-5 py-3 font-bold text-zinc-500 hover:bg-white">
                  이전
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
