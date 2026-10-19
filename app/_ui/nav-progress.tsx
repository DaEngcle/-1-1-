"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/** 링크·뒤로가기를 누르면 화면 위에 파란 막대가 지나가서 '눌렸다'는 걸 알려줌 */
export function NavProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [active, setActive] = useState(false);

  // 주소가 바뀌면(이동 끝) 막대를 숨긴다
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 이동 완료 신호
    setActive(false);
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      setActive(true);
    };
    const onPop = () => setActive(true);
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(false), 10000);
    return () => clearTimeout(t);
  }, [active]);

  if (!active) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-brand-100/60">
      <div className="h-full w-2/5 rounded-full bg-brand-500" style={{ animation: "nav-progress 0.9s ease-in-out infinite" }} />
    </div>
  );
}
