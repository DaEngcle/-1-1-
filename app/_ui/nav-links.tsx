"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** 상단 메뉴. 지금 보고 있는 메뉴를 흰색으로 강조 */
export function NavLinks({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();
  // 가장 길게 일치하는 메뉴 하나만 활성 (/student 와 /student/lessons 구분)
  const active = items
    .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-2 pb-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
            item.href === active ? "bg-white text-brand-700 shadow-sm" : "text-brand-50 hover:bg-white/15"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
