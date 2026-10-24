import Link from "next/link";
import { logout } from "@/app/login/actions";
import { NavLinks } from "./nav-links";
import { BottomNav } from "./bottom-nav";
import { SubmitButton } from "@/app/_ui/submit-button";

export function AppShell({
  title,
  nav,
  bottomNav,
  children,
}: {
  title: string;
  nav: { href: string; label: string }[];
  /** 있으면 휴대폰에서는 위 메뉴 대신 아래 탭바(+더보기)를 쓴다 */
  bottomNav?: { items: { href: string; icon: string; label: string }[]; moreHref: string };
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col bg-[#f4f7fe]">
      <header className="sticky top-0 z-10 bg-brand-600 text-white shadow-md shadow-brand-900/10">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 pt-3 pb-2">
          <Link href={nav[0]?.href ?? "/"} className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-sm font-black text-brand-600">
              D
            </span>
            {title}
          </Link>
          <form action={logout}>
            <SubmitButton className="text-sm text-brand-100 underline-offset-2 hover:underline">
              로그아웃
            </SubmitButton>
          </form>
        </div>
        <div className={bottomNav ? "hidden sm:block" : ""}>
          <NavLinks items={nav} />
        </div>
      </header>
      <main className={`mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-4 py-6 ${bottomNav ? "pb-32 sm:pb-6" : ""}`}>
        {children}
      </main>
      {bottomNav && <BottomNav items={nav} primary={bottomNav.items} moreHref={bottomNav.moreHref} />}
    </div>
  );
}
