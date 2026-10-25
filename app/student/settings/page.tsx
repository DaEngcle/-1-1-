import Link from "next/link";
import { requireStudent } from "@/lib/classroom/dal";
import { PLANS, isPlanId } from "@/lib/classroom/plans";
import { logout } from "@/app/login/actions";
import { LineIcon } from "@/app/_ui/line-icons";
import { PushToggle } from "@/app/_ui/push-toggle";
import { InstallAppCard } from "@/app/_ui/pwa";
import { SubmitButton } from "@/app/_ui/submit-button";
import { SettingsToggles } from "./settings-toggles";

const card = "rounded-[28px] bg-white p-5 shadow-sm";

export default async function SettingsPage() {
  const student = await requireStudent();
  const plan = isPlanId(student.plan) ? PLANS[student.plan].name : "무료회원";

  return (
    <>
      <Link href="/student/more" className="flex items-center gap-1 text-sm font-semibold text-zinc-500">
        <LineIcon name="chevron" className="h-4 w-4 rotate-180" />
        더보기
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">설정</h1>

      <section className={card}>
        <h2 className="text-lg font-extrabold text-zinc-900">내 계정</h2>
        <p className="mt-2 text-zinc-800">
          {student.name}
          {student.nickname && <span className="text-zinc-500"> ({student.nickname})</span>}
        </p>
        <p className="text-sm text-zinc-500">
          {plan}
          {student.accessUntil ? ` · ${student.accessUntil.replaceAll("-", ".")}까지` : ""}
        </p>
        <Link href="/student/profile" className="mt-3 inline-block text-sm font-semibold text-brand-700 underline">
          닉네임·비밀번호 바꾸기
        </Link>
      </section>

      <section className={card}>
        <h2 className="text-lg font-extrabold text-zinc-900">학습 설정</h2>
        <p className="text-xs text-zinc-400">이 기기에만 저장돼요. 화면 언어는 지금은 한국어만 있어요.</p>
        <SettingsToggles />
      </section>

      <section id="notify" className={`${card} scroll-mt-6 flex flex-col gap-3`}>
        <h2 className="text-lg font-extrabold text-zinc-900">알림·앱 설치</h2>
        <PushToggle />
        <InstallAppCard />
      </section>

      <form action={logout} className="rounded-[28px] bg-white px-5 shadow-sm">
        <SubmitButton className="flex w-full items-center gap-4 py-3.5 text-left">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <LineIcon name="logout" className="h-6 w-6" />
          </span>
          <span className="font-bold text-rose-600">로그아웃</span>
        </SubmitButton>
      </form>
    </>
  );
}
