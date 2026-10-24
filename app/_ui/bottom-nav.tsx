"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Item = { href: string; label: string };

/** 아래 탭바 아이콘 (선으로 그린 아이콘. 이모지 대신) */
const ICON_PATHS: Record<string, React.ReactNode> = {
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" />
    </>
  ),
  play: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="3.5" />
      <path d="m10.5 9.5 4 2.5-4 2.5z" />
    </>
  ),
  talk: (
    <>
      <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V15h0A2.5 2.5 0 0 1 5 12.5z" />
      <path d="M9 9.5h.01M12 9.5h.01M15 9.5h.01" />
    </>
  ),
  cards: (
    <>
      <rect x="4" y="7" width="12" height="13" rx="2.5" />
      <path d="M8 4h9.5A2.5 2.5 0 0 1 20 6.5V16" />
      <path d="M7.5 13.5h5" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
      <path d="M8 6H5.5a2.5 2.5 0 0 0 2.6 3.5M16 6h2.5a2.5 2.5 0 0 1-2.6 3.5" />
      <path d="M12 13v3.5M8.5 20h7M10 16.5h4V20h-4z" />
    </>
  ),
  more: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="2" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="2" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="2" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2" />
    </>
  ),
};

function NavIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICON_PATHS[name] ?? ICON_PATHS.more}
    </svg>
  );
}


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
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-4 pb-28 shadow-2xl"
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
      <nav className="fixed inset-x-3 bottom-[calc(10px+env(safe-area-inset-bottom))] z-40 sm:hidden">
        <ul className="grid grid-cols-6 gap-1 rounded-[28px] border border-white/70 bg-white/95 p-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.14)] backdrop-blur">
          {primary.map((p) => {
            const on = p.href === active && !open;
            return (
              <li key={p.href}>
                <Link
                  href={p.href}
                  onClick={() => setOpen(false)}
                  className={`flex flex-col items-center gap-0.5 rounded-[22px] py-2 text-[11px] font-semibold transition-colors ${
                    on ? "bg-zinc-900 text-white" : "text-zinc-400"
                  }`}
                >
                  <NavIcon name={p.icon} className={on ? "text-[#8EB4FF]" : ""} />
                  {p.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={`flex w-full flex-col items-center gap-0.5 rounded-[22px] py-2 text-[11px] font-semibold transition-colors ${
                open || moreActive ? "bg-zinc-900 text-white" : "text-zinc-400"
              }`}
            >
              <NavIcon name="more" className={open || moreActive ? "text-[#8EB4FF]" : ""} />
              더보기
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
