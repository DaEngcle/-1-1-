"use client";

import { useState, useTransition } from "react";
import { likeRoom } from "../actions";

/** 친구 방 꾹꾹이 (하루 한 번) */
export function LikeButton({ ownerId, likes, liked }: { ownerId: string; likes: number; liked: boolean }) {
  const [done, setDone] = useState(liked);
  const [count, setCount] = useState(likes);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        disabled={done || pending}
        onClick={() =>
          start(async () => {
            const r = await likeRoom(ownerId);
            setMsg(r.message);
            if (r.ok) {
              setDone(true);
              setCount((c) => c + 1);
            }
          })
        }
        className="rounded-full bg-pink-500 px-6 py-3 text-lg font-extrabold text-white shadow-md disabled:bg-pink-200"
      >
        🐾 꾹꾹이 {count}
      </button>
      {msg && <p className="text-sm text-zinc-600">{msg}</p>}
      {done && !msg && <p className="text-xs text-zinc-400">꾹꾹이는 방마다 하루 한 번 누를 수 있어요.</p>}
    </div>
  );
}
