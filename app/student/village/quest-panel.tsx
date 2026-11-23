"use client";

import { useState } from "react";
import { useSpeechRecognition } from "@/app/_ui/audio/use-speech-recognition";
import { compareSpoken } from "@/lib/classroom/village";
import { QUEST_BONUS, QUEST_CHURU, QUEST_KINDS, SHOP_NAMES, type QuestKind } from "@/lib/classroom/village-quest";
import type { QuestState } from "@/lib/classroom/village-quest-data";
import { recordVillageSpeakAction } from "./actions";

const PASS = 60;

function say(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-AU";
  u.rate = 0.95;
  speechSynthesis.speak(u);
}

/** 문장 하나 말하기 (60% 넘으면 통과). 앱이 못 듣는 화면에선 '말해 봤어요'로 넘어간다 */
function QuestSpeak({ answers, onPass }: { answers: string[]; onPass: () => void }) {
  const { supported, listening, error, listen, stop } = useSpeechRecognition("en-AU");
  const [last, setLast] = useState<{ heard: string; score: number; missing: string[] } | null>(null);

  function pass() {
    void recordVillageSpeakAction();
    onPass();
  }
  function start() {
    setLast(null);
    listen((alts) => {
      const best = alts
        .flatMap((h) => answers.map((a) => ({ h, ...compareSpoken(a, h) })))
        .sort((x, y) => y.score - x.score)[0];
      if (!best) return;
      if (best.score >= PASS) pass();
      else setLast({ heard: best.h, score: best.score, missing: best.missing });
    });
  }

  if (supported === false) {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-xs text-zinc-600">이 화면에서는 앱이 듣지 못해요. 소리 내어 말한 뒤 눌러 주세요. (크롬·사파리에서는 앱이 들어 줘요)</p>
        <button type="button" onClick={pass} className="rounded-[10px] border-2 border-[#2a2350] bg-white px-3 py-2 text-sm font-bold text-[#2a2350]">
          🗣 소리 내어 말해 봤어요
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      {listening ? (
        <button type="button" onClick={stop} className="rounded-[10px] border-2 border-red-500 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
          ⏹ 듣고 있어요. 다 말했으면 누르세요
        </button>
      ) : (
        <button type="button" onClick={start} className="rounded-[10px] border-2 border-[#2a2350] bg-[#6c5cff] px-3 py-2 text-sm font-bold text-white shadow-[0_3px_0_#2a2350]">
          {last ? "🎤 다시 말하기" : "🎤 눌러서 말하기"}
        </button>
      )}
      {last && (
        <div className="text-xs text-zinc-600">
          <p className="font-bold text-[#2a2350]">{last.score}% 일치 · 조금만 더!</p>
          <p>앱이 들은 말: {last.heard || "(알아듣지 못했어요)"}</p>
          {last.missing.length > 0 && <p>빠진 단어: <b>{last.missing.join(", ")}</b></p>}
        </div>
      )}
      {error && (
        <div className="flex flex-col gap-1">
          <p className="text-xs text-red-600">{error}</p>
          <button type="button" onClick={pass} className="self-start text-xs font-bold text-[#2a2350] underline">
            앱이 못 들어도 소리 내어 말해 봤어요 → 완료
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * 오늘의 의뢰 3개 (오늘의 가게 · 강의 문장 · 어제 복습) + 연속 기록.
 * 지도 오른쪽 위 버튼을 누르면 펼쳐진다.
 */
export function QuestPanel({
  state,
  onComplete,
  onVisit,
}: {
  state: QuestState;
  onComplete: (kind: QuestKind) => void;
  onVisit: (placeId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<QuestKind | null>(null);
  const [reveal, setReveal] = useState(false);
  const count = state.done.length;
  const all = count >= QUEST_KINDS.length;
  const isDone = (k: QuestKind) => state.done.includes(k);

  const row = (k: QuestKind, icon: string, title: string, body: React.ReactNode) => (
    <li key={k} className={`rounded-[12px] border-2 p-3 ${isDone(k) ? "border-emerald-600 bg-emerald-50" : "border-[#2a2350] bg-white"}`}>
      <p className="text-sm font-extrabold text-[#2a2350]">
        {isDone(k) ? "✅" : icon} {title} <span className="text-xs font-bold text-amber-700">🐟 +{QUEST_CHURU}</span>
      </p>
      {!isDone(k) && <div className="mt-1 flex flex-col gap-1.5 text-sm text-[#2a2350]">{body}</div>}
    </li>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="absolute right-2.5 top-[calc(env(safe-area-inset-top)+10px)] z-[95] rounded-full border-2 border-[#2a2350] bg-white/90 px-3 py-1 text-xs font-extrabold text-[#2a2350] shadow-sm backdrop-blur"
        aria-expanded={open}
      >
        📜 오늘의 의뢰 {count}/{QUEST_KINDS.length} · 🐾 {state.streak}일
      </button>
      {open && (
        <div className="absolute inset-x-2.5 top-[calc(env(safe-area-inset-top)+48px)] z-[96] mx-auto max-h-[75%] max-w-md overflow-y-auto rounded-[16px] border-2 border-[#2a2350] bg-[#fffaf0] p-3 shadow-[0_4px_0_#2a2350]">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-base font-extrabold text-[#2a2350]">📜 오늘의 의뢰</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="닫기" className="text-lg font-bold text-[#2a2350]">✕</button>
          </div>
          <p className="mb-2 text-xs text-zinc-600">
            3개를 다 하면 보너스 🐟 {QUEST_BONUS}와 발자국 🐾 하나! 매일 이어 가면 연속 기록이 늘어요. 지금 <b>🐾 {state.streak}일 연속</b>.
          </p>
          {all && (
            <p className="mb-2 rounded-[10px] border-2 border-emerald-600 bg-emerald-50 p-2 text-sm font-extrabold text-emerald-800">
              🎉 오늘 의뢰 완료! 🐟 {state.churuToday} 받았어요 · 🐾 {state.streak}일 연속. 내일 또 만나요!
            </p>
          )}
          <ul className="flex flex-col gap-2">
            {row(
              "shop",
              "🛒",
              `오늘의 가게: ${SHOP_NAMES[state.shopId] ?? state.shopId}`,
              <>
                <p className="text-xs text-zinc-600">가게에 들어가 점원과 영어로 3번 주고받으면 끝나요.</p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onVisit(state.shopId);
                  }}
                  className="self-start rounded-[10px] border-2 border-[#2a2350] bg-[#6c5cff] px-3 py-1.5 text-sm font-bold text-white"
                >
                  🐾 가게로 데려다주기
                </button>
              </>,
            )}
            {row(
              "lesson",
              "📒",
              state.lesson ? `${state.lesson.label} 강의 문장 말하기` : "강의 문장 말하기",
              state.lesson ? (
                active === "lesson" ? (
                  <>
                    <p className="font-bold">
                      {state.lesson.sentence}{" "}
                      <button type="button" onClick={() => say(state.lesson!.sentence)} aria-label="문장 듣기">🔊</button>
                    </p>
                    {state.lesson.translation && <p className="text-xs text-zinc-500">{state.lesson.translation}</p>}
                    <QuestSpeak answers={[state.lesson.sentence]} onPass={() => onComplete("lesson")} />
                  </>
                ) : (
                  <button type="button" onClick={() => setActive("lesson")} className="self-start text-sm font-bold underline">
                    문장 보고 말하기 →
                  </button>
                )
              ) : (
                <p className="text-xs text-zinc-600">아직 본 강의가 없어요. 강의를 하나 틀어 보면 여기에 문장이 나와요.</p>
              ),
            )}
            {row(
              "review",
              "🔁",
              "어제 복습 (힌트 없이)",
              active === "review" ? (
                <>
                  <p className="text-xs text-zinc-600">어제 {SHOP_NAMES[state.review.shopId] ?? ""}에서 한 말이에요. 영어로 말해 보세요.</p>
                  <p className="font-bold">“{state.review.ko}”</p>
                  <button type="button" onClick={() => setReveal(true)} className="self-start text-xs font-bold underline">
                    {reveal ? `✅ ${state.review.answers[0]}` : "💡 정답 보기"}
                  </button>
                  <QuestSpeak answers={state.review.answers} onPass={() => onComplete("review")} />
                </>
              ) : (
                <button type="button" onClick={() => setActive("review")} className="self-start text-sm font-bold underline">
                  복습 시작 →
                </button>
              ),
            )}
          </ul>
        </div>
      )}
    </>
  );
}
