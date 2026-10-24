"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CatRoom, ItemPreview } from "@/app/_ui/cat-room";
import type { CatBreed, CatMood } from "@/lib/classroom/cat";
import { ITEMS, SLOT_KIND, SLOT_LABEL, type HouseItem, type Layout, type Slot } from "@/lib/classroom/cat-house";
import { buyItem, saveLayout } from "./actions";

type Target = "wall" | "floor" | "window" | "hat" | "outfit" | Slot;
const TARGETS: { id: Target; label: string }[] = [
  { id: "window", label: "🪟 창밖" },
  { id: "wall", label: "🧱 벽지" },
  { id: "floor", label: "🟫 바닥" },
  { id: "floorL", label: SLOT_LABEL.floorL },
  { id: "floorR", label: SLOT_LABEL.floorR },
  { id: "front", label: SLOT_LABEL.front },
  { id: "wallL", label: SLOT_LABEL.wallL },
  { id: "wallR", label: SLOT_LABEL.wallR },
  { id: "ceiling", label: "💡 " + SLOT_LABEL.ceiling },
  { id: "hat", label: "🎩 모자" },
  { id: "outfit", label: "👕 옷" },
];

const RARITY: Record<HouseItem["rarity"], string> = {
  기본: "bg-zinc-100 text-zinc-600",
  일반: "bg-sky-50 text-sky-700",
  레어: "bg-violet-100 text-violet-700",
  전설: "bg-amber-100 text-amber-800",
};

function kindOf(t: Target): HouseItem["kind"] {
  return t === "wall" || t === "floor" || t === "window" || t === "hat" || t === "outfit" ? t : SLOT_KIND[t];
}
const isWear = (t: Target): t is "hat" | "outfit" => t === "hat" || t === "outfit";

export function HouseEditor({
  initial,
  owned,
  balance,
  breed,
  mood,
  guest,
}: {
  initial: Layout;
  owned: string[];
  balance: number;
  breed: CatBreed | null;
  mood: CatMood;
  guest: CatBreed | null;
}) {
  const router = useRouter();
  const [layout, setLayout] = useState(initial);
  const [target, setTarget] = useState<Target>("floorL");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const own = new Set(owned);
  const dirty = JSON.stringify(layout) !== JSON.stringify(initial);
  const kind = kindOf(target);
  const current =
    target === "wall" || target === "floor" || target === "window"
      ? layout[target]
      : isWear(target)
        ? layout.wear[target]
        : layout.slots[target];
  const removable = isWear(target) || target in SLOT_KIND;

  function place(id: string | null) {
    setMsg(null);
    setLayout((l) => {
      if (target === "wall" || target === "floor" || target === "window") return id ? { ...l, [target]: id } : l;
      if (isWear(target)) {
        const wear = { ...l.wear };
        if (id) wear[target] = id;
        else delete wear[target];
        return { ...l, wear };
      }
      const slots = { ...l.slots };
      if (id) slots[target] = id;
      else delete slots[target];
      return { ...l, slots };
    });
  }

  function buy(it: HouseItem) {
    start(async () => {
      const r = await buyItem(it.id);
      setMsg(r.message);
      if (r.ok) {
        place(it.id);
        router.refresh();
      }
    });
  }

  function save() {
    start(async () => {
      const r = await saveLayout(layout);
      setMsg(r.message);
      if (r.ok) router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <CatRoom layout={layout} breed={breed} mood={mood} guest={guest} highlight={target in SLOT_KIND ? (target as Slot) : null} className="shadow-lg" />

      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-extrabold text-amber-800">🐟 츄르 {balance}</span>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || pending}
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-bold text-white disabled:bg-zinc-300"
        >
          {pending ? "저장 중…" : dirty ? "방 저장하기" : "저장됨"}
        </button>
      </div>
      {msg && <p className="rounded-xl bg-violet-50 p-2 text-center text-sm font-semibold text-violet-800">{msg}</p>}

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {TARGETS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTarget(t.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${target === t.id ? "bg-violet-600 text-white" : "bg-white text-zinc-700 shadow-sm"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {removable && (
          <li>
            <button
              type="button"
              onClick={() => place(null)}
              className={`flex h-full w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 bg-white p-2 text-xs font-semibold ${current ? "border-transparent text-zinc-500" : "border-violet-500 text-violet-700"}`}
            >
              <span className="text-2xl">∅</span>
              {isWear(target) ? "벗기" : "비우기"}
            </button>
          </li>
        )}
        {ITEMS.filter((i) => i.kind === kind).map((it) => {
          const has = own.has(it.id);
          const on = current === it.id;
          return (
            <li key={it.id}>
              <button
                type="button"
                disabled={pending}
                onClick={() => (has ? place(it.id) : buy(it))}
                className={`flex w-full flex-col items-center gap-1 rounded-2xl border-2 bg-white p-2 text-center shadow-sm ${on ? "border-violet-500" : "border-transparent"}`}
              >
                <ItemPreview id={it.id} className="h-14 w-14" />
                <span className="line-clamp-1 text-xs font-bold text-zinc-900">{it.name}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${RARITY[it.rarity]}`}>{it.rarity}</span>
                {has ? (
                  <span className="text-[11px] font-semibold text-emerald-700">{on ? "놓여 있음" : "놓기"}</span>
                ) : (
                  <span className={`text-[11px] font-bold ${balance >= it.price ? "text-amber-700" : "text-zinc-400"}`}>🐟 {it.price} 사기</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
