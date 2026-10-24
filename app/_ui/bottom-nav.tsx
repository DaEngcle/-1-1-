"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Item = { href: string; label: string };

/** 가장 길게 일치하는 메뉴 하나만 활성 (/student 와 /student/lessons 구분) */
function activeHref(items: Item[], pathname: string) {
  return items
    .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

/** 라벨 앞 이모지를 아이콘으로, 나머지를 짧은 이름으로 */
function split(label: string) {
  const m = label.match(/^(\p{Extended_Pictographic}️?)\s*(.*)$/u);
  return m ? { icon: m[1], text: m[2] } : { icon: "", text: label };
}

/**
 * 휴대폰용 아래 탭바: 자주 쓰는 메뉴만 아래에 두고, 나머지는 '더보기'에 모은다.
 * (위쪽 가로 메뉴는 휴대폰에서 오른쪽 메뉴가 안 보여서 못 찾는 문제가 있었다)
 */
export function BottomNav({ items, primary }: { items: Item[]; primary: { href: string; icon: string; label: string }[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = activeHref(items, pathname);
  const primaryHrefs = new Set(primary.map((p) => p.href));
  const more = items.filter((i) => !primaryHrefs.has(i.href));
  const moreActive = more.some((i) => i.href === active);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/30 sm:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-4 pb-24 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-2 text-sm font-bold text-zinc-500">더보기</p>
            <ul className="grid grid-cols-2 gap-2">
              {more.map((i) => {
                const { icon, text } = split(i.label);
                return (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold ${
                        i.href === active ? "bg-brand-50 text-brand-700" : "bg-slate-50 text-zinc-800"
                      }`}
                    >
                      <span className="text-lg">{icon || "•"}</span>
                      {text}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden">
        <ul className="grid grid-cols-6">
          {primary.map((p) => {
            const on = p.href === active && !open;
            return (
              <li key={p.href}>
                <Link
                  href={p.href}
                  onClick={() => setOpen(false)}
                  className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${on ? "text-brand-600" : "text-zinc-500"}`}
                >
                  <span className={`text-xl ${on ? "" : "opacity-70 grayscale"}`}>{p.icon}</span>
                  {p.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={`flex w-full flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${
                open || moreActive ? "text-brand-600" : "text-zinc-500"
              }`}
            >
              <span className="text-xl">☰</span>
              더보기
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
