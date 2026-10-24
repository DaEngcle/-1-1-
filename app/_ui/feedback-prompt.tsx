"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { sendFeedback } from "@/app/student/feedback/actions";

/** 마지막으로 물어본 뒤 이만큼 지나야 다시 물어본다 */
const GAP_DAYS = 10;
/** 조건이 맞아도 이 확률로만 뜬다 (랜덤) */
const CHANCE = 0.35;
const KEY = "dingle:feedback-asked";

function askedRecently() {
  try {
    const at = Number(localStorage.getItem(KEY) ?? 0);
    return Date.now() - at < GAP_DAYS * 86400_000;
  } catch {
    return true; // 저장소를 못 쓰면 괜히 자주 뜨지 않게 묻지 않는다
  }
}

function markAsked() {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {}
}

const KINDS = [
  { id: "inconvenient", label: "😣 불편했어요" },
  { id: "idea", label: "💡 이런 게 있으면" },
  { id: "praise", label: "🥰 좋았어요" },
];

/**
 * 학생 화면에서 가끔(랜덤) 뜨는 질문: 불편한 점이나 있었으면 하는 기능.
 * 녹음·퀴즈 중에 방해되지 않게 화면 아래쪽에 작게 뜬다.
 */
export function FeedbackPrompt() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState("idea");
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  useEffect(() => {
    if (askedRecently() || Math.random() > CHANCE) return;
    // 들어오자마자 말고, 좀 써 본 다음에
    const t = setTimeout(() => {
      if (askedRecently()) return;
      markAsked();
      setOpen(true);
    }, 25_000);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  async function submit() {
    setState("sending");
    const res = await sendFeedback(kind, text, pathname);
    setState(res.ok ? "done" : "error");
    if (res.ok) setTimeout(() => setOpen(false), 2000);
  }

  return (
    <div className="fixed inset-x-0 bottom-16 z-50 flex justify-center p-3 sm:bottom-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
        {state === "done" ? (
          <p className="py-3 text-center font-bold text-zinc-900">고마워요! 꼭 읽어볼게요 🙏</p>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <p className="font-extrabold text-zinc-900">
                잠깐! 다잉클 클래스룸 쓰면서
                <br />
                불편했던 점이나 있었으면 하는 기능 있어요?
              </p>
              <button type="button" onClick={() => setOpen(false)} className="shrink-0 rounded-full px-2 text-lg text-zinc-400" aria-label="닫기">
                ✕
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {KINDS.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKind(k.id)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold ${kind === k.id ? "bg-[#6C5CFF] text-white" : "bg-slate-100 text-zinc-700"}`}
                >
                  {k.label}
                </button>
              ))}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="편하게 한 줄만 적어줘도 돼요"
              className="mt-2 w-full rounded-2xl border border-slate-200 p-3 text-base outline-none focus:border-[#6C5CFF]"
            />
            {state === "error" && <p className="mt-1 text-sm text-rose-600">보내지 못했어요. 다시 눌러주세요.</p>}
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => setOpen(false)} className="flex-1 rounded-2xl bg-slate-100 py-2.5 font-bold text-zinc-600">
                다음에
              </button>
              <button
                type="button"
                disabled={!text.trim() || state === "sending"}
                onClick={submit}
                className="flex-[2] rounded-2xl bg-[#6C5CFF] py-2.5 font-bold text-white disabled:opacity-40"
              >
                {state === "sending" ? "보내는 중…" : "보내기"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
