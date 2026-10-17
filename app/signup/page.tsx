import type { Metadata } from "next";
import Link from "next/link";
import { PLANS } from "@/lib/classroom/plans";
import { SignupForm } from "@/app/login/login-forms";

export const metadata: Metadata = { title: "회원가입 | 다잉클 클래스룸" };

export default function SignupPage() {
  const plans = Object.entries(PLANS).map(([id, p]) => ({ id, label: `${p.name} (${p.months}개월)` }));
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-brand-600 to-brand-500 px-6 py-16">
      <main className="flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl bg-white p-8 text-center shadow-xl shadow-brand-900/20">
        <div className="flex flex-col items-center gap-2">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-black text-white shadow-md">
            D
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">다잉클 클래스룸 가입</h1>
          <p className="text-sm text-zinc-600">수강생만 이용할 수 있어요. 신청하면 선생님이 확인 후 승인해요.</p>
        </div>
        <SignupForm plans={plans} />
        <Link href="/login" className="text-xs text-zinc-500 underline">
          이미 가입했어요 · 로그인
        </Link>
      </main>
    </div>
  );
}
