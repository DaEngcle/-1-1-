import Link from "next/link";
import { requireStudent } from "@/lib/classroom/dal";
import { LineIcon } from "@/app/_ui/line-icons";
import { PushToggle } from "@/app/_ui/push-toggle";
import { InstallAppCard } from "@/app/_ui/pwa";
import { SettingsToggles } from "./settings-toggles";

const card = "rounded-[28px] bg-white p-5 shadow-sm";

export default async function SettingsPage() {
  await requireStudent();

  return (
    <>
      <Link href="/student/more" className="flex items-center gap-1 text-sm font-semibold text-zinc-500">
        <LineIcon name="chevron" className="h-4 w-4 rotate-180" />
        더보기
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">설정</h1>

      <section className={card}>
        <h2 className="text-lg font-extrabold text-zinc-900">학습 설정</h2>
        <p className="text-xs text-zinc-400">이 기기에만 저장돼요. 화면 언어는 지금은 한국어만 있어요.</p>
        <SettingsToggles />
      </section>

      <section id="notify" className={`${card} scroll-mt-6 flex flex-col gap-3`}>
        <h2 className="text-lg font-extrabold text-zinc-900">알림·앱 설치</h2>
        <PushToggle />
        <InstallAppCard />
        <Link href="/install" className="text-sm font-semibold text-brand-700 underline">
          📲 폰에 설치하는 방법 보기 (아이폰·갤럭시)
        </Link>
      </section>

    </>
  );
}
