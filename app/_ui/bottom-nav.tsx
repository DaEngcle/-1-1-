"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LineIcon } from "./line-icons";

type Item = { href: string; label: string };


/** 가장 길게 일치하는 메뉴 하나만 활성 (/student 와 /student/lessons 구분) */
function activeHref(items: Item[], pathname: string) {
  return items
    .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

/**
 * 휴대폰용 아래 탭바: 자주 쓰는 메뉴만 아래에 두고, 나머지는 '더보기'에 모은다.
 * (위쪽 가로 메뉴는 휴대폰에서 오른쪽 메뉴가 안 보여서 못 찾는 문제가 있었다)
 */
export function BottomNav({
  items,
  primary,
  moreHref,
}: {
  items: Item[];
  primary: { href: string; icon: string; label: string }[];
  moreHref: string;
}) {
  const pathname = usePathname();
  const active = activeHref(items, pathname);
  const primaryHrefs = new Set(primary.map((p) => p.href));
  const more = items.filter((i) => !primaryHrefs.has(i.href));
  // '더보기' 화면이나 그 안의 메뉴(문법·뉴스·내 정보 등)에 있으면 더보기를 켠다
  const moreActive = pathname === moreHref || more.some((i) => i.href === active);

  return (
    <>
      <nav className="fixed inset-x-3 bottom-[calc(10px+env(safe-area-inset-bottom))] z-40 sm:hidden">
        <ul className="grid grid-cols-6 gap-1 rounded-[28px] border border-white/70 bg-white/95 p-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.14)] backdrop-blur">
          {primary.map((p) => {
            const on = p.href === active && !moreActive;
            return (
              <li key={p.href}>
                <Link
                  href={p.href}
                                    className={`flex flex-col items-center gap-0.5 rounded-[22px] py-2 text-[11px] font-semibold transition-colors ${
                    on ? "bg-zinc-900 text-white" : "text-zinc-400"
                  }`}
                >
                  <LineIcon name={p.icon} className={`h-6 w-6 ${on ? "text-[#8EB4FF]" : ""}`} />
                  {p.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href={moreHref}
              className={`flex flex-col items-center gap-0.5 rounded-[22px] py-2 text-[11px] font-semibold transition-colors ${
                moreActive ? "bg-zinc-900 text-white" : "text-zinc-400"
              }`}
            >
              <LineIcon name="more" className={`h-6 w-6 ${moreActive ? "text-[#8EB4FF]" : ""}`} />
              더보기
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
