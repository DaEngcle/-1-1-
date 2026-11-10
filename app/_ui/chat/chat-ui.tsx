"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

// 상황극과 AI 실전 대화가 같이 쓰는 대화 화면 조각들 (말풍선 · 미션 · 힌트 · 아래 답하기 칸)

/** 전체 화면 대화: 위에 ✕와 제목, 가운데 대화, 아래 답하기 칸 */
export function ChatScreen({
  title,
  closeHref,
  onClose,
  scrollKey,
  sheet,
  children,
}: {
  title: string;
  closeHref?: string;
  onClose?: () => void;
  /** 바뀔 때마다 맨 아래로 내린다 */
  scrollKey?: unknown;
  sheet?: ReactNode;
  children: ReactNode;
}) {
  const bottom = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [scrollKey]);
  const close = "flex h-10 w-10 items-center justify-center rounded-full text-2xl text-zinc-500 hover:bg-slate-100";
  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white">
      <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-slate-100 px-12">
        {closeHref ? (
          <Link href={closeHref} aria-label="닫기" className={`absolute left-2 top-2 ${close}`}>
            ✕
          </Link>
        ) : (
          <button type="button" onClick={onClose} aria-label="닫기" className={`absolute left-2 top-2 ${close}`}>
            ✕
          </button>
        )}
        <h1 className="truncate text-base font-extrabold text-zinc-900">{title}</h1>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-md flex-col gap-3 px-4 py-4">
          {children}
          <div ref={bottom} />
        </div>
      </div>
      {sheet && (
        <div className="shrink-0 rounded-t-3xl bg-white shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
          <div className="mx-auto max-w-md px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]">{sheet}</div>
        </div>
      )}
    </div>
  );
}

/** 상대 말풍선 (이름표 + 회색 풍선 + 번역 보기) */
export function PartnerMessage({
  name,
  text,
  ko,
  onPlay,
  hidden,
  onReveal,
}: {
  name: string;
  text: string;
  ko?: string;
  onPlay?: () => void;
  /** 자막 끈 상태: 영어를 가리고 '영어 보기' */
  hidden?: boolean;
  onReveal?: () => void;
}) {
  const [showKo, setShowKo] = useState(false);
  return (
    <div className="flex max-w-[88%] flex-col items-start gap-1 self-start">
      <span className="pl-1 text-xs font-bold text-zinc-500">{name}</span>
      <div className="flex items-start gap-2 rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3 text-[16px] leading-snug text-zinc-900">
        {hidden ? (
          <button type="button" onClick={onReveal} className="text-left text-zinc-400">
            🔊 듣고 대답해 보세요 · 영어 보기
          </button>
        ) : (
          <span>{text}</span>
        )}
        {onPlay && (
          <button type="button" onClick={onPlay} aria-label="다시 듣기" className="shrink-0 text-base">
            🔊
          </button>
        )}
      </div>
      {ko && (
        <button type="button" onClick={() => setShowKo((v) => !v)} className="pl-1 text-xs font-semibold text-zinc-400">
          {showKo ? ko : "번역 보기"}
        </button>
      )}
    </div>
  );
}

/** 한국어 미션 카드 */
export function MissionCard({ children, label = "미션" }: { children: ReactNode; label?: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-2xl bg-brand-50 px-4 py-3 text-[15px] text-brand-900">
      <span className="text-[11px] font-extrabold text-brand-500">{label}</span>
      <span className="font-semibold">{children}</span>
    </div>
  );
}

/** 알약 모양 '힌트 보기' (누르면 모범 답 하나) */
export function HintPill({ children, onOpen }: { children: ReactNode; onOpen?: () => void }) {
  const [open, setOpen] = useState(false);
  if (open) {
    return <div className="self-start rounded-2xl border border-brand-100 bg-white px-4 py-2.5 text-[15px] text-zinc-800">💡 {children}</div>;
  }
  return (
    <button
      type="button"
      onClick={() => {
        setOpen(true);
        onOpen?.();
      }}
      className="self-start rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-bold text-brand-700"
    >
      💡 힌트 보기
    </button>
  );
}

export function Stars({ n }: { n: number }) {
  return (
    <span className="text-sm tracking-tight" aria-label={`별 ${n}개`}>
      {[1, 2, 3].map((k) => (
        <span key={k} className={k <= n ? "" : "opacity-20 grayscale"}>
          ⭐
        </span>
      ))}
    </span>
  );
}

/** 내 말풍선 (파란 풍선 + 다시 시도 + 별) */
export function MyMessage({ text, stars, onRetry, note }: { text: string; stars?: number; onRetry?: () => void; note?: ReactNode }) {
  return (
    <div className="flex max-w-[88%] flex-col items-end gap-1 self-end">
      <div className="rounded-2xl rounded-tr-md bg-brand-600 px-4 py-3 text-[16px] leading-snug text-white">{text}</div>
      {(onRetry || stars !== undefined) && (
        <div className="flex items-center gap-2 pr-1">
          {onRetry && (
            <button type="button" onClick={onRetry} className="text-xs font-bold text-zinc-500">
              ↻ 다시 시도
            </button>
          )}
          {stars !== undefined && <Stars n={stars} />}
        </div>
      )}
      {note && <div className="pr-1 text-right text-xs text-zinc-500">{note}</div>}
    </div>
  );
}

/** 상대가 생각 중 */
export function TypingBubble({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-start gap-1 self-start">
      <span className="pl-1 text-xs font-bold text-zinc-500">{name}</span>
      <div className="animate-pulse rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3 text-zinc-400">● ● ●</div>
    </div>
  );
}

export type AnswerMode = "voice" | "text";

/**
 * 아래 답하기 칸: 음성/텍스트 토글 + 큰 마이크.
 * 녹음 중엔 ✕(취소) · 듣는 중 표시 · ↑(보내기).
 */
export function AnswerSheet({
  mode,
  onMode,
  voiceSupported = true,
  recording,
  busy,
  disabled,
  onMic,
  onCancel,
  onSend,
  onSubmitText,
  status,
  level,
}: {
  mode: AnswerMode;
  onMode: (m: AnswerMode) => void;
  /** false면 음성 버튼을 막고 텍스트로 */
  voiceSupported?: boolean;
  recording: boolean;
  /** 보내는 중·상대가 생각 중 */
  busy?: boolean;
  disabled?: boolean;
  onMic: () => void;
  onCancel: () => void;
  onSend: () => void;
  onSubmitText: (text: string) => void;
  /** 마이크 아래 한 줄 안내 */
  status?: ReactNode;
  /** 0~1 소리 크기 (있으면 막대로) */
  level?: number;
}) {
  const [text, setText] = useState("");
  const off = disabled || busy;
  const useVoice = mode === "voice" && voiceSupported;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid w-48 grid-cols-2 rounded-full bg-slate-100 p-1 text-sm font-bold">
        {(
          [
            ["voice", "음성"],
            ["text", "텍스트"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => onMode(m)}
            disabled={m === "voice" && !voiceSupported}
            className={`rounded-full py-1.5 ${mode === m ? "bg-white text-brand-700 shadow-sm" : "text-zinc-500"} disabled:text-zinc-300`}
          >
            {label}
          </button>
        ))}
      </div>

      {useVoice ? (
        recording ? (
          <div className="flex items-center gap-6">
            <button type="button" onClick={onCancel} aria-label="취소" className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-zinc-600">
              ✕
            </button>
            <span className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-brand-100 text-3xl">🎙</span>
            <button type="button" onClick={onSend} aria-label="보내기" className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-xl font-black text-white">
              ↑
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onMic}
            disabled={off}
            aria-label="말하기"
            className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-3xl text-white shadow-[0_6px_16px_rgba(36,83,235,0.35)] active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
          >
            🎙
          </button>
        )
      ) : (
        <form
          className="flex w-full items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (off || !text.trim()) return;
            onSubmitText(text.trim());
            setText("");
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 300))}
            placeholder="영어로 답을 써 보세요"
            autoCapitalize="sentences"
            autoComplete="off"
            enterKeyHint="send"
            aria-label="답 쓰기"
            className="min-w-0 flex-1 rounded-full border-2 border-slate-200 px-4 py-3 text-base focus:border-brand-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={off || !text.trim()}
            aria-label="보내기"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xl font-black text-white disabled:bg-slate-300"
          >
            ↑
          </button>
        </form>
      )}
      {recording && level !== undefined && (
        <div className="flex h-5 items-end justify-center gap-1">
          {[0.1, 0.25, 0.4, 0.55, 0.7, 0.55, 0.4, 0.25, 0.1].map((t, i) => (
            <span key={i} className={`w-1.5 rounded-full ${level >= t * 0.6 ? "bg-brand-500" : "bg-zinc-200"}`} style={{ height: `${30 + t * 100}%` }} />
          ))}
        </div>
      )}
      {status && <div className="min-h-[1.25rem] text-center text-xs font-semibold text-zinc-500">{status}</div>}
    </div>
  );
}
