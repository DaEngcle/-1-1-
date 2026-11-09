"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useTts } from "@/app/_ui/audio/use-tts";
import { useSpeechRecognition } from "@/app/_ui/audio/use-speech-recognition";
import { AnswerSheet, ChatScreen, HintPill, MissionCard, MyMessage, PartnerMessage, Stars, type AnswerMode } from "@/app/_ui/chat/chat-ui";
import type { Roleplay, RoleplayTurn } from "@/lib/classroom/roleplays";
import { scenarioStars, scoreTurn, splitKey, type TurnCheck } from "@/lib/classroom/roleplay-score";
import { finishRoleplay, startRoleplay } from "../actions";

type Answer = { text: string; check: TurnCheck; best: { text: string; stars: number } };

function ModelHint({ turn }: { turn: RoleplayTurn }) {
  const parts = splitKey(turn.model, turn.keys[0]);
  if (!parts) return <>{turn.model}</>;
  return (
    <>
      {parts[0]}
      <b className="text-brand-700">{parts[1]}</b>
      {parts[2]}
    </>
  );
}

/** 상황극 진행: 상대 말 → 미션 → 내 답(음성·텍스트) → 별 → 다음 상대 말 */
export function RoleplayPlayer({ scenario: r, backHref }: { scenario: Roleplay; backHref: string }) {
  const { play, unlock } = useTts();
  const sr = useSpeechRecognition("en-AU");
  const [mode, setMode] = useState<AnswerMode>("voice");
  const [answers, setAnswers] = useState<(Answer | null)[]>(() => r.turns.map(() => null));
  /** 지금 답할 턴 (다시 시도하면 그 턴으로) */
  const [active, setActive] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [result, setResult] = useState<{ stars: number; points: number } | null>(null);
  const [saving, startSaving] = useTransition();
  const [, startCall] = useTransition();
  const spoken = useRef(new Set<number>());

  // 지금까지 나온 마지막 상대 말 (아직 안 한 첫 턴, 다 했으면 마지막 턴)
  const firstOpen = answers.findIndex((a) => a === null);
  const reached = firstOpen === -1 ? r.turns.length - 1 : firstOpen;
  const allDone = answers.every(Boolean);
  const voiceOk = sr.supported !== false;
  const effectiveMode: AnswerMode = voiceOk ? mode : "text";

  // 들어오면 시작 기록 (무료회원 하루 3개)
  useEffect(() => {
    startCall(async () => {
      const res = await startRoleplay(r.id);
      if (!res.ok && res.reason === "limit") setBlocked(true);
    });
  }, [r.id]);

  // 새 상대 말이 나오면 한 번 읽어 준다
  useEffect(() => {
    if (spoken.current.has(reached)) return;
    spoken.current.add(reached);
    void play(r.turns[reached].line);
  }, [reached, play, r.turns]);

  function submit(text: string) {
    const turn = r.turns[active];
    const check = scoreTurn(text, turn);
    const prev = answers[active];
    const best = prev && prev.best.stars >= check.stars ? prev.best : { text, stars: check.stars };
    const next = answers.map((a, i) => (i === active ? { text, check, best } : a));
    setAnswers(next);
    const firstEmpty = next.findIndex((a) => a === null);
    if (firstEmpty >= 0) setActive(firstEmpty);
    else {
      setActive(r.turns.length);
      if (!result || check.stars > (prev?.best.stars ?? 0)) save(next);
      void play(r.outro.line);
    }
  }

  function save(list: (Answer | null)[]) {
    startSaving(async () => {
      const res = await finishRoleplay(
        r.id,
        list.map((a) => a?.best.text ?? ""),
      );
      if (res) setResult((cur) => ({ stars: Math.max(cur?.stars ?? 0, res.stars), points: (cur?.points ?? 0) + res.points }));
    });
  }

  function mic() {
    unlock();
    sr.listen((alts) => {
      const turn = r.turns[active];
      // 후보 중 점수가 가장 좋은 것
      const best = alts
        .map((a) => ({ a, c: scoreTurn(a, turn) }))
        .sort((x, y) => y.c.stars - x.c.stars || y.c.overlap - x.c.overlap)[0];
      if (best?.a.trim()) submit(best.a.trim());
    });
  }

  const sheet = blocked ? null : allDone && active >= r.turns.length ? null : (
    <AnswerSheet
      mode={effectiveMode}
      onMode={setMode}
      voiceSupported={voiceOk}
      recording={sr.listening}
      onMic={mic}
      onCancel={sr.abort}
      onSend={sr.stop}
      onSubmitText={submit}
      status={
        sr.error ??
        (sr.supported === false
          ? "이 브라우저는 음성 인식이 안 돼서 텍스트로 답해요."
          : sr.listening
            ? "듣고 있어요. 다 말했으면 ↑를 누르세요."
            : active < reached
              ? "다시 시도하는 중이에요"
              : null)
      }
    />
  );

  return (
    <ChatScreen title={`${r.emoji} ${r.title}`} closeHref={backHref} scrollKey={`${active}-${answers.filter(Boolean).length}-${result?.stars}`} sheet={sheet}>
      {blocked ? (
        <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
          오늘 무료 상황극 3개를 다 했어요. 내일 또 해요.{" "}
          <Link href={backHref} className="font-bold underline">
            목록으로
          </Link>
        </div>
      ) : (
        <>
          <p className="text-center text-xs text-zinc-400">{r.desc}</p>
          {r.turns.slice(0, reached + 1).map((turn, i) => {
            const a = answers[i];
            return (
              <div key={i} className="flex flex-col gap-2">
                <PartnerMessage name={r.who} text={turn.line} ko={turn.ko} onPlay={() => play(turn.line)} />
                <MissionCard>{turn.mission}</MissionCard>
                <HintPill>
                  <ModelHint turn={turn} />
                </HintPill>
                {a && (
                  <MyMessage
                    text={a.text}
                    stars={a.check.stars}
                    onRetry={() => setActive(i)}
                    note={
                      !a.check.keyHit ? (
                        <>
                          핵심 표현을 넣어 보세요: <b className="text-brand-700">{turn.keys[0]}</b>
                        </>
                      ) : a.check.stars < 3 ? (
                        "좋아요. 힌트 문장처럼 조금 더 길게 말하면 별 3개예요."
                      ) : null
                    }
                  />
                )}
                {active === i && a && <p className="self-end pr-1 text-xs font-bold text-brand-600">이 미션을 다시 답해 보세요 ↓</p>}
              </div>
            );
          })}
          {allDone && (
            <>
              <PartnerMessage name={r.who} text={r.outro.line} ko={r.outro.ko} onPlay={() => play(r.outro.line)} />
              <div className="mt-2 flex flex-col items-center gap-2 rounded-3xl bg-brand-50 p-5 text-center">
                <p className="text-lg font-extrabold text-zinc-900">상황극 완료!</p>
                <Stars n={result?.stars ?? scenarioStars(answers.map((x) => x?.best.stars ?? 1))} />
                <p className="text-xs text-zinc-500">
                  {saving ? "저장하는 중…" : result ? (result.points > 0 ? `+${result.points}P · 오늘 공부한 날로 기록했어요` : "기록했어요 (포인트는 시나리오마다 하루 한 번)") : ""}
                </p>
                <p className="text-xs text-zinc-500">별이 적은 답은 ↻ 다시 시도로 바꿀 수 있어요.</p>
                <div className="mt-1 grid w-full grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      spoken.current.clear();
                      setAnswers(r.turns.map(() => null));
                      setActive(0);
                    }}
                    className="rounded-2xl bg-white py-3 font-extrabold text-brand-700 ring-2 ring-brand-100"
                  >
                    처음부터
                  </button>
                  <Link href={backHref} className="rounded-2xl bg-brand-600 py-3 font-extrabold text-white">
                    목록으로
                  </Link>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </ChatScreen>
  );
}
