import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BusinessFooter } from "@/app/_ui/legal";
import { getPayingStudent } from "@/lib/classroom/dal";
import { MEMBERSHIP, addDays, koDay, periodEndFrom } from "@/lib/classroom/membership";
import { hasActiveCoursePlan, inActiveTrial, liveSubscription } from "@/lib/classroom/membership-billing";
import { kstDate } from "@/lib/classroom/stats";
import { Checkout } from "./checkout";

export const metadata: Metadata = {
  title: "앱 멤버십 | 다잉클 클래스룸",
  description: "AI 면접·상황극·보카·뉴스까지, 다잉클 앱 기능을 매달 이용하는 멤버십",
};

export default async function SubscribePage({ searchParams }: { searchParams: Promise<{ fail?: string; error?: string }> }) {
  const { fail, error } = await searchParams;
  const student = await getPayingStudent();
  if (student && (await liveSubscription(student.id))) redirect("/student/membership");
  const coursePlan = student ? hasActiveCoursePlan(student) : false;
  const nextPayDay = koDay(addDays(periodEndFrom(kstDate(new Date())), 1));

  return (
    <div className="flex flex-1 flex-col items-center gap-6 bg-gradient-to-b from-brand-600 to-brand-500 px-5 py-10">
      <main className="flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl bg-white p-7 text-center shadow-xl shadow-brand-900/20">
        <div className="flex flex-col items-center gap-2">
          <span className="rounded-full bg-[#ffd23f] px-3 py-1 text-xs font-extrabold text-zinc-900">앱 멤버십</span>
          <h1 className="text-2xl font-extrabold leading-snug tracking-tight text-zinc-900">
            매일 말하는 연습,
            <br />
            앱 하나로
          </h1>
          <p className="text-3xl font-black text-brand-700">
            월 {MEMBERSHIP.price.toLocaleString("ko-KR")}원
          </p>
          <p className="text-xs text-zinc-500">강의 영상은 포함되지 않아요 (강의는 과정 수강생 전용)</p>
        </div>

        <ul className="grid w-full grid-cols-2 gap-2 text-left">
          {MEMBERSHIP.perks.map(([icon, title, sub]) => (
            <li key={title} className="flex flex-col gap-0.5 rounded-2xl bg-brand-50 p-3">
              <span className="text-xl">{icon}</span>
              <span className="text-sm font-bold text-zinc-900">{title}</span>
              <span className="text-xs text-zinc-500">{sub}</span>
            </li>
          ))}
        </ul>

        {fail && <p className="w-full rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">카드 등록이 취소됐거나 실패했어요. 다시 시도해 주세요.</p>}
        {error && <p className="w-full rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error.slice(0, 120)}</p>}

        {!student ? (
          <div className="flex w-full flex-col gap-2">
            <p className="text-sm text-zinc-600">먼저 무료로 가입하고 로그인한 뒤 시작할 수 있어요.</p>
            <Link href="/free?from=멤버십" className="w-full rounded-2xl bg-brand-600 px-4 py-4 text-base font-extrabold text-white">
              무료 가입하기
            </Link>
            <Link href="/login" className="text-xs text-zinc-500 underline">이미 가입했어요 · 로그인</Link>
          </div>
        ) : coursePlan ? (
          <div className="flex w-full flex-col gap-2">
            <p className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
              과정 수강 중이라 앱 기능이 이미 모두 열려 있어요. 따로 결제하지 않아도 돼요.
            </p>
            <Link href="/student" className="text-sm font-bold text-brand-700 underline">클래스룸으로 가기</Link>
          </div>
        ) : inActiveTrial(student) ? (
          <p className="w-full rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">
            지금은 무료 체험 중이에요. 체험이 끝난 다음 날({student.access_until ? koDay(addDays(student.access_until, 1)) : "체험 종료 후"})부터 멤버십을 시작할 수 있어요.
          </p>
        ) : (
          <Checkout price={MEMBERSHIP.price} nextPayDay={nextPayDay} disabled={!MEMBERSHIP.onSale} />
        )}
      </main>
      <BusinessFooter className="w-full max-w-sm text-white/70 [&_a]:text-white/90" />
    </div>
  );
}
