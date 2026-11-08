import Link from "next/link";
import { CatSprite } from "@/app/_ui/cat";
import type { CatBreed, CatMood } from "@/lib/classroom/cat";

/** 코스 질문·연습 화면: 앱 메뉴 위를 덮는 전체 화면 (부드러운 브랜드 파랑 → 크림색) */
export function FullScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-gradient-to-b from-brand-50 via-white to-[#fff8e8]">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-4 pt-[calc(12px+env(safe-area-inset-top))] pb-[calc(16px+env(safe-area-inset-bottom))]">
        {children}
      </div>
    </div>
  );
}

/** 위쪽 줄: 뒤로 화살표 + 진행 막대 */
export function TopBar({ percent, onBack, backHref }: { percent: number; onBack?: () => void; backHref?: string }) {
  const arrow = (
    <span aria-hidden className="text-2xl leading-none">
      ←
    </span>
  );
  return (
    <div className="flex items-center gap-3 py-2">
      {onBack ? (
        <button type="button" onClick={onBack} aria-label="뒤로" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-600 hover:bg-white">
          {arrow}
        </button>
      ) : (
        <Link href={backHref ?? "/student"} aria-label="나가기" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-600 hover:bg-white">
          {arrow}
        </Link>
      )}
      <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-brand-100">
        <span className="block h-full rounded-full bg-brand-500 transition-[width] duration-500" style={{ width: `${Math.max(4, Math.min(100, percent))}%` }} />
      </span>
    </div>
  );
}

/** 내 고양이 + 말풍선 */
export function CatSays({ breed, mood = "default", children, big }: { breed: CatBreed; mood?: CatMood; children: React.ReactNode; big?: boolean }) {
  return (
    <div className={`flex ${big ? "flex-col items-center text-center" : "items-end"} gap-3`}>
      <CatSprite breed={breed} mood={mood} className={big ? "h-28 w-36" : "h-16 w-20 shrink-0"} />
      <p className={`rounded-2xl bg-white px-4 py-3 text-[15px] font-bold leading-snug text-zinc-800 shadow-sm shadow-brand-900/5 ${big ? "" : "rounded-bl-sm"}`}>
        {children}
      </p>
    </div>
  );
}

/** 아래 큰 버튼 (화면 맨 아래 고정) */
export function BottomButton({ children, disabled, onClick, href }: { children: React.ReactNode; disabled?: boolean; onClick?: () => void; href?: string }) {
  const cls =
    "block w-full rounded-2xl border-b-4 border-brand-800 bg-brand-600 px-5 py-4 text-center text-lg font-extrabold text-white transition-all active:translate-y-0.5 active:border-b-2 disabled:border-slate-300 disabled:bg-slate-300";
  return (
    <div className="sticky bottom-0 mt-auto bg-gradient-to-t from-[#fff8e8] via-[#fff8e8] to-transparent pt-4">
      {href ? (
        <Link href={href} className={cls}>
          {children}
        </Link>
      ) : (
        <button type="button" disabled={disabled} onClick={onClick} className={cls}>
          {children}
        </button>
      )}
    </div>
  );
}
