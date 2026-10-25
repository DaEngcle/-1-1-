"use client";

import { useState, useTransition } from "react";
import { GUESTBOOK_MAX, GUESTBOOK_PHRASES } from "@/lib/classroom/cat-house";
import type { GuestbookEntry } from "@/lib/classroom/cat-house-data";
import { removeGuestbook, writeGuestbook } from "./actions";

/** 방명록: 친구 방에서는 영어 한 줄 쓰기 + 목록, 내 방에서는 목록만 */
export function Guestbook({
  ownerId,
  entries,
  canWrite,
  isOwner,
  wroteToday,
}: {
  ownerId: string;
  entries: GuestbookEntry[];
  canWrite: boolean;
  isOwner: boolean;
  wroteToday: boolean;
}) {
  const [list, setList] = useState(entries);
  const [text, setText] = useState("");
  const [done, setDone] = useState(wroteToday);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function send() {
    start(async () => {
      const r = await writeGuestbook(ownerId, text);
      setMsg(r.message);
      if (r.ok) {
        setDone(true);
        setText("");
        setList((l) => [{ id: -Date.now(), writerId: "", name: "나", message: text.trim(), day: "", mine: true }, ...l]);
      }
    });
  }

  function remove(id: number) {
    start(async () => {
      const r = await removeGuestbook(id);
      if (r.ok) setList((l) => l.filter((e) => e.id !== id));
    });
  }

  return (
    <section className="flex flex-col gap-2 rounded-2xl bg-white p-3 shadow-sm">
      <h2 className="font-extrabold text-zinc-900">✉️ 방명록 {list.length > 0 && <span className="text-sm text-zinc-500">{list.length}</span>}</h2>
      {canWrite &&
        (done ? (
          <p className="rounded-xl bg-violet-50 p-2 text-sm text-violet-700">오늘은 남겼어요. 내일 또 놀러 와요 🐾</p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-zinc-500">영어로 한 줄 남겨요. 아래 문장을 눌러도 돼요.</p>
            <div className="flex flex-wrap gap-1.5">
              {GUESTBOOK_PHRASES.map((p) => (
                <button
                  key={p.en}
                  type="button"
                  onClick={() => setText(p.en)}
                  title={p.ko}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700"
                >
                  {p.en}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={GUESTBOOK_MAX}
                placeholder="Write in English!"
                lang="en"
                autoCapitalize="sentences"
                className="min-w-0 flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              />
              <button
                type="button"
                disabled={pending || text.trim().length < 2}
                onClick={send}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white disabled:bg-zinc-300"
              >
                남기기
              </button>
            </div>
          </div>
        ))}
      {msg && <p className="text-sm text-zinc-600">{msg}</p>}
      {list.length === 0 ? (
        <p className="text-sm text-zinc-400">{isOwner ? "아직 방명록이 없어요. 친구 방에 먼저 놀러 가 볼까요?" : "첫 방명록을 남겨 보세요!"}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-zinc-100">
          {list.map((e) => (
            <li key={e.id} className="flex items-start gap-2 py-2">
              <div className="min-w-0 flex-1">
                <p className="break-words text-[15px] font-semibold text-zinc-900" lang="en">
                  “{e.message}”
                </p>
                <p className="text-xs text-zinc-500">
                  {e.name}
                  {e.day && ` · ${e.day.slice(5).replace("-", "/")}`}
                </p>
              </div>
              {(isOwner || e.mine) && e.id > 0 && (
                <button type="button" onClick={() => remove(e.id)} disabled={pending} className="text-xs text-zinc-400 underline">
                  지우기
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
