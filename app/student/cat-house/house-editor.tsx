"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CatRoom, ItemPreview } from "@/app/_ui/cat-room";
import type { CatBreed, CatMood } from "@/lib/classroom/cat";
import {
  ITEMS,
  ITEM_BY_ID,
  MAX_PLACED,
  ROOM_H,
  ROOM_W,
  clampPlace,
  defaultPlace,
  type HouseItem,
  type Layout,
} from "@/lib/classroom/cat-house";
import { buyItem, saveLayout } from "./actions";

type Tab = HouseItem["kind"];
const TABS: { id: Tab; label: string }[] = [
  { id: "floorItem", label: "🛋️ 가구" },
  { id: "frontItem", label: "☕ 소품" },
  { id: "wallItem", label: "🖼️ 벽장식" },
  { id: "lightItem", label: "💡 조명" },
  { id: "window", label: "🪟 창밖" },
  { id: "wall", label: "🧱 벽지" },
  { id: "floor", label: "🟫 바닥" },
  { id: "hat", label: "🎩 모자" },
  { id: "outfit", label: "👕 옷" },
];
const PLACEABLE: Tab[] = ["floorItem", "frontItem", "wallItem", "lightItem"];

const RARITY: Record<HouseItem["rarity"], string> = {
  기본: "bg-zinc-100 text-zinc-600",
  일반: "bg-sky-50 text-sky-700",
  레어: "bg-violet-100 text-violet-700",
  전설: "bg-amber-100 text-amber-800",
};

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
  // 구매처럼 기다린 뒤에 놓을 때도 가장 최근 배치를 쓰기 위해
  const latest = useRef(layout);
  useEffect(() => {
    latest.current = layout;
  }, [layout]);
  const [tab, setTab] = useState<Tab>("floorItem");
  const [sel, setSel] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<HouseItem | null>(null);
  const [pending, start] = useTransition();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const drag = useRef<{ i: number; dx: number; dy: number } | null>(null);
  const own = new Set(owned);
  const dirty = JSON.stringify(layout) !== JSON.stringify(initial);
  const placedIds = new Set(layout.items.map((p) => p.id));
  const selItem = sel !== null ? layout.items[sel] : null;

  /** 화면 좌표 → 방 좌표 */
  function toRoom(e: { clientX: number; clientY: number }) {
    const r = svgRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * ROOM_W,
      y: ((e.clientY - r.top) / r.height) * ROOM_H,
    };
  }

  function onItemPointerDown(i: number, e: React.PointerEvent<SVGGElement>) {
    e.preventDefault();
    setSel(i);
    const p = layout.items[i];
    const at = toRoom(e);
    drag.current = { i, dx: at.x - p.x, dy: at.y - p.y };
    const move = (ev: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const pt = toRoom(ev);
      setLayout((l) => {
        const items = [...l.items];
        const q = clampPlace(items[d.i].id, pt.x - d.dx, pt.y - d.dy);
        if (q) items[d.i] = q;
        return { ...l, items };
      });
    };
    const up = () => {
      drag.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function nudge(dx: number, dy: number) {
    if (sel === null) return;
    setLayout((l) => {
      const items = [...l.items];
      const p = items[sel];
      const q = clampPlace(p.id, p.x + dx, p.y + dy);
      if (q) items[sel] = q;
      return { ...l, items };
    });
  }

  function reorder(delta: number) {
    if (sel === null) return;
    const to = sel + delta;
    if (to < 0 || to >= layout.items.length) return;
    setLayout((l) => {
      const items = [...l.items];
      [items[sel], items[to]] = [items[to], items[sel]];
      return { ...l, items };
    });
    setSel(to);
  }

  function removeSel() {
    if (sel === null) return;
    setLayout((l) => ({ ...l, items: l.items.filter((_, i) => i !== sel) }));
    setSel(null);
  }

  /** 가진 아이템을 고르면: 놓여 있으면 선택, 아니면 방에 놓기 / 배경·옷은 바꾸기 */
  function use(it: HouseItem) {
    setMsg(null);
    if (it.kind === "wall" || it.kind === "floor" || it.kind === "window") {
      setLayout((l) => ({ ...l, [it.kind]: it.id }));
      return;
    }
    if (it.kind === "hat" || it.kind === "outfit") {
      const k = it.kind;
      setLayout((l) => {
        const wear = { ...l.wear };
        if (wear[k] === it.id) delete wear[k];
        else wear[k] = it.id;
        return { ...l, wear };
      });
      return;
    }
    const cur = latest.current;
    const idx = cur.items.findIndex((p) => p.id === it.id);
    if (idx >= 0) {
      setSel(idx);
      return;
    }
    if (cur.items.length >= MAX_PLACED) {
      setMsg(`방에는 ${MAX_PLACED}개까지 놓을 수 있어요.`);
      return;
    }
    const p = defaultPlace(it.id, cur.items.length);
    if (!p) return;
    // 같은 목록 기준으로 놓고 선택해야 번호가 어긋나지 않는다
    const next = { ...cur, items: [...cur.items, p] };
    latest.current = next;
    setLayout(next);
    setSel(cur.items.length);
  }

  function buy(it: HouseItem) {
    start(async () => {
      const r = await buyItem(it.id);
      setMsg(r.message);
      if (r.ok) {
        use(it);
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

  const list = ITEMS.filter((i) => i.kind === tab);

  return (
    <div className="flex flex-col gap-3">
      {confirm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setConfirm(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-50">
              <ItemPreview id={confirm.id} className="h-16 w-16" />
            </div>
            <p className="text-lg font-extrabold text-zinc-900">
              {confirm.name}
            </p>
            {confirm.desc && (
              <p className="mt-0.5 text-sm text-zinc-500">{confirm.desc}</p>
            )}
            <p className="mt-2 text-sm text-zinc-700">
              🐟 츄르 <b>{confirm.price}</b>개로 살까요? (지금 {balance}개)
            </p>
            {balance < confirm.price && (
              <p className="mt-1 text-sm font-semibold text-rose-600">
                츄르가 {confirm.price - balance}개 모자라요. 쉐도잉 1문장에
                5개씩 모여요!
              </p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfirm(null)}
                className="rounded-2xl bg-zinc-100 py-3 font-bold text-zinc-700"
              >
                취소
              </button>
              {balance < confirm.price ? (
                <Link
                  href="/student/shadowing"
                  className="rounded-2xl bg-violet-600 py-3 text-center font-bold text-white"
                >
                  🐟 츄르 모으러 가기
                </Link>
              ) : (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    const it = confirm;
                    setConfirm(null);
                    buy(it);
                  }}
                  className="rounded-2xl bg-violet-600 py-3 font-bold text-white disabled:bg-zinc-300"
                >
                  살게요
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <CatRoom
        layout={layout}
        breed={breed}
        mood={mood}
        guest={guest}
        selected={sel}
        onItemPointerDown={onItemPointerDown}
        svgRef={svgRef}
        className="shadow-lg"
      />
      <p className="-mt-1 text-center text-xs text-zinc-400">
        물건을 손가락으로 끌어서 옮겨요 · 바닥 앞쪽에 둔 물건이 고양이 앞에
        보여요
      </p>

      {selItem && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-violet-50 p-2">
          <span className="text-sm font-bold text-violet-800">
            {ITEM_BY_ID.get(selItem.id)?.name}
          </span>
          <span className="ml-auto flex gap-1">
            {[
              ["◀", -1, 0],
              ["▲", 0, -1],
              ["▼", 0, 1],
              ["▶", 1, 0],
            ].map(([l, dx, dy]) => (
              <button
                key={l as string}
                type="button"
                onClick={() => nudge(dx as number, dy as number)}
                className="h-8 w-8 rounded-lg bg-white text-sm font-bold text-violet-700 shadow-sm"
              >
                {l}
              </button>
            ))}
            <button
              type="button"
              onClick={() => reorder(1)}
              className="rounded-lg bg-white px-2 text-xs font-bold text-violet-700 shadow-sm"
            >
              앞으로
            </button>
            <button
              type="button"
              onClick={() => reorder(-1)}
              className="rounded-lg bg-white px-2 text-xs font-bold text-violet-700 shadow-sm"
            >
              뒤로
            </button>
            <button
              type="button"
              onClick={removeSel}
              className="rounded-lg bg-white px-2 text-xs font-bold text-rose-600 shadow-sm"
            >
              빼기
            </button>
          </span>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-extrabold text-amber-800">
          🐟 츄르 {balance}
        </span>
        <span className="text-xs text-zinc-500">
          놓은 물건 {layout.items.length}/{MAX_PLACED}
        </span>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || pending}
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-bold text-white disabled:bg-zinc-300"
        >
          {pending ? "저장 중…" : dirty ? "방 저장하기" : "저장됨"}
        </button>
      </div>
      {msg && (
        <p className="rounded-xl bg-violet-50 p-2 text-center text-sm font-semibold text-violet-800">
          {msg}
        </p>
      )}

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${tab === t.id ? "bg-violet-600 text-white" : "bg-white text-zinc-700 shadow-sm"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {list.map((it) => {
          const has = own.has(it.id);
          const on =
            it.kind === "wall" || it.kind === "floor" || it.kind === "window"
              ? layout[it.kind] === it.id
              : it.kind === "hat" || it.kind === "outfit"
                ? layout.wear[it.kind] === it.id
                : placedIds.has(it.id);
          return (
            <li key={it.id}>
              <button
                type="button"
                disabled={pending}
                onClick={() => (has ? use(it) : setConfirm(it))}
                className={`flex w-full flex-col items-center gap-1 rounded-2xl border-2 bg-white p-2 text-center shadow-sm ${on ? "border-violet-500" : "border-transparent"}`}
              >
                <ItemPreview id={it.id} className="h-14 w-14" />
                <span className="line-clamp-1 text-xs font-bold text-zinc-900">
                  {it.name}
                </span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${RARITY[it.rarity]}`}
                >
                  {it.rarity}
                </span>
                {has ? (
                  <span className="text-[11px] font-semibold text-emerald-700">
                    {on
                      ? PLACEABLE.includes(it.kind)
                        ? "방에 있음 · 고르기"
                        : it.kind === "hat" || it.kind === "outfit"
                          ? "입는 중 · 벗기"
                          : "사용 중"
                      : PLACEABLE.includes(it.kind)
                        ? "놓기"
                        : it.kind === "hat" || it.kind === "outfit"
                          ? "입히기"
                          : "바꾸기"}
                  </span>
                ) : (
                  <span
                    className={`text-[11px] font-bold ${balance >= it.price ? "text-amber-700" : "text-zinc-400"}`}
                  >
                    🐟 {it.price} 사기
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
