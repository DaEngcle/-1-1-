"use client";

import { useEffect, useState } from "react";
import { useSpeechRecognition } from "@/app/_ui/audio/use-speech-recognition";
import { compareSpoken } from "@/lib/classroom/village";
import type { TalkTurn } from "@/lib/classroom/village-talk";
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

/** 정답 후보 중 가장 가까운 것과 비교 */
function best(answers: string[], heard: string) {
  return answers
    .map((a) => ({ a, ...compareSpoken(a, heard) }))
    .sort((x, y) => y.score - x.score)[0];
}

type Line = { who: "clerk" | "me"; text: string; ko?: string; score?: number };

/**
 * 가게 대화: 점원이 말을 걸면 학생이 영어로 받아 2~3번 주고받는다.
 * 브라우저 음성 인식(무료)으로 들은 말을 정답 후보와 비교하고, 60% 넘으면 다음 차례로 간다.
 */
export function ShopTalk({ turns, quest: questProp = false, onFinish }: { turns: TalkTurn[]; quest?: boolean; onFinish?: () => void }) {
  const { supported, listening, error, listen, stop } = useSpeechRecognition("en-AU");
  const [step, setStep] = useState(0);
  const [log, setLog] = useState<Line[]>([{ who: "clerk", text: turns[0].clerk, ko: turns[0].clerkKo }]);
  const [last, setLast] = useState<{ heard: string; score: number; missing: string[] } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [recorded, setRecorded] = useState(false);
  // 의뢰 가게인지는 들어올 때 기준 (끝내고 나면 부모 값이 바뀌어도 안내는 남긴다)
  const [quest] = useState(questProp);
  const finished = step >= turns.length;
  const turn = turns[Math.min(step, turns.length - 1)];

  // 가게에 들어오면 점원이 먼저 말을 건다 (버튼을 눌러 들어왔으니 소리가 난다)
  useEffect(() => {
    say(turns[0].clerk);
    return () => {
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    };
  }, [turns]);

  function markSpoken() {
    if (recorded) return;
    setRecorded(true);
    void recordVillageSpeakAction();
  }

  function advance(myText: string, score?: number) {
    const next = step + 1;
    const lines: Line[] = [{ who: "me", text: myText, score }];
    if (next < turns.length) {
      lines.push({ who: "clerk", text: turns[next].clerk, ko: turns[next].clerkKo });
      setTimeout(() => say(turns[next].clerk), 500);
    }
    setLog((l) => [...l, ...lines]);
    if (next >= turns.length) onFinish?.();
    setStep(next);
    setLast(null);
    setShowAnswer(false);
  }

  function start() {
    setLast(null);
    listen((alts) => {
      const scored = alts.map((h) => ({ h, ...best(turn.answers, h) })).sort((x, y) => y.score - x.score)[0];
      if (!scored) return;
      markSpoken();
      if (scored.score >= PASS) advance(scored.h, scored.score);
      else setLast({ heard: scored.h, score: scored.score, missing: scored.missing });
    });
  }

  const bubble = (l: Line, i: number) =>
    l.who === "clerk" ? (
      <div key={i} className="flex items-start gap-2">
        <span className="text-lg" aria-hidden>🧑‍🍳</span>
        <div className="max-w-[85%] rounded-[12px] rounded-tl-none border-2 border-[#2a2350] bg-white px-3 py-2">
          <p className="text-sm font-bold text-[#2a2350]">
            {l.text}{" "}
            <button type="button" onClick={() => say(l.text)} aria-label="점원 말 다시 듣기" className="align-middle">🔊</button>
          </p>
          {l.ko && <p className="text-xs text-zinc-500">{l.ko}</p>}
        </div>
      </div>
    ) : (
      <div key={i} className="flex justify-end">
        <div className="max-w-[85%] rounded-[12px] rounded-tr-none border-2 border-[#2a2350] bg-[#e9e5ff] px-3 py-2 text-sm font-bold text-[#2a2350]">
          {l.text}
          {l.score !== undefined && <span className="ml-1 text-xs font-extrabold text-emerald-700">{l.score}%</span>}
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold text-[#6c5cff]">
        🗣 점원과 대화하기 · {Math.min(step + (finished ? 0 : 1), turns.length)}/{turns.length}
        {quest && " · 📜 오늘의 의뢰"}
      </p>
      <div className="flex max-h-56 flex-col gap-2 overflow-y-auto">{log.map(bubble)}</div>

      {finished ? (
        <div className="rounded-[10px] border-2 border-emerald-600 bg-emerald-50 p-3 text-sm text-emerald-800">
          <p className="font-extrabold">🎉 대화 완료! 영어로 {turns.length}번 주고받았어요.</p>
          <p className="mt-1 text-xs">말 걸어 보기 미션도 내 코스에 체크돼요. 다른 가게에서도 해 보세요.</p>
          {quest && <p className="mt-1 text-xs font-bold">📜 오늘의 의뢰 &lsquo;오늘의 가게&rsquo; 완료! 🐟 +5</p>}
        </div>
      ) : (
        <>
          <div className="rounded-[10px] bg-[#f4f2ff] px-3 py-2 text-sm text-[#2a2350]">
            <p>
              <b>이렇게 말해 보세요:</b> {turn.ko}
            </p>
            <button type="button" onClick={() => setShowAnswer(true)} className="mt-1 text-xs font-extrabold underline">
              {showAnswer ? `✅ ${turn.answers[0]}` : "💡 정답 보기"}
            </button>
            {showAnswer && (
              <button type="button" onClick={() => say(turn.answers[0])} className="ml-2 text-xs" aria-label="정답 듣기">🔊</button>
            )}
          </div>

          {supported === false ? (
            <>
              <p className="text-xs text-zinc-600">이 화면에서는 앱이 듣지 못해요. 크롬이나 사파리에서 열면 앱이 들어 줘요. 지금은 소리 내어 말한 뒤 넘어가세요.</p>
              <button
                type="button"
                onClick={() => {
                  markSpoken();
                  advance(turn.answers[0]);
                }}
                className="rounded-[10px] border-2 border-[#2a2350] bg-white px-3 py-2 text-sm font-bold text-[#2a2350]"
              >
                🗣 소리 내어 말해 봤어요 → 다음
              </button>
            </>
          ) : listening ? (
            <button type="button" onClick={stop} className="rounded-[10px] border-2 border-red-500 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
              ⏹ 듣고 있어요. 다 말했으면 누르세요
            </button>
          ) : (
            <button type="button" onClick={start} className="rounded-[10px] border-2 border-[#2a2350] bg-[#6c5cff] px-3 py-2 text-sm font-bold text-white shadow-[0_3px_0_#2a2350]">
              {last ? "🎤 다시 말하기" : "🎤 눌러서 대답하기"}
            </button>
          )}

          {last && (
            <div className="rounded-[10px] border-2 border-[#2a2350] bg-white p-3 text-sm text-[#2a2350]">
              <p className="font-extrabold">정답과 {last.score}% 일치 · 조금만 더! 빠진 단어를 넣어 다시 말해 보세요.</p>
              <p className="mt-1 text-xs text-zinc-600">앱이 들은 말: {last.heard || "(알아듣지 못했어요)"}</p>
              {last.missing.length > 0 && <p className="mt-1 text-xs text-zinc-600">빠진 단어: <b>{last.missing.join(", ")}</b></p>}
              <button type="button" onClick={() => advance(last.heard || turn.answers[0], last.score)} className="mt-1 text-xs font-bold underline">
                이번엔 넘어가기
              </button>
            </div>
          )}
          {error && (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => {
                  markSpoken();
                  advance(turn.answers[0]);
                }}
                className="self-start text-xs font-bold text-[#2a2350] underline"
              >
                앱이 못 들어도 소리 내어 말해 봤어요 → 다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
