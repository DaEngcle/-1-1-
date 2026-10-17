import type { Metadata } from "next";
import Link from "next/link";
import { PhoneLoginForm, StudentLoginForm, TeacherLoginForm } from "./login-forms";

const ERRORS: Record<string, string> = {
  expired: "로그인이 만료됐어요. 다시 로그인해주세요.",
  inactive: "이용이 중지된 계정이에요. 선생님께 문의해주세요.",
  pending: "거의 다 됐어요! 수강 확인이 끝나면 바로 열어드릴게요 😊",
  "plan-ended": "수강 기간이 끝났어요. 연장은 선생님께 문의해주세요.",
};

export const metadata: Metadata = {
  title: "로그인 | 다잉클 클래스룸",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; error?: string; method?: string }>;
}) {
  const { role, error, method } = await searchParams;
  const byCode = method === "code";
  const isTeacher = role === "teacher";

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-brand-600 to-brand-500 px-6 py-16">
      <main className="flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl bg-white p-8 text-center shadow-xl shadow-brand-900/20">
        <div className="flex flex-col items-center gap-2">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-black text-white shadow-md">
            D
          </span>
          <p className="mt-1 rounded-full bg-brand-50 px-3 py-0.5 text-xs font-bold text-brand-700">
            {isTeacher ? "선생님 전용" : "수강생 전용"}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">다잉클 클래스룸</h1>
          <p className="text-base text-zinc-600">
            {isTeacher
              ? "학생 관리, 레슨, 출결을 한 곳에서."
              : "복습하고, 쉐도잉하고, AI 피드백 받기."}
          </p>
        </div>
        {error && ERRORS[error] && <p className="text-sm text-red-600">{ERRORS[error]}</p>}
        {isTeacher ? (
          <TeacherLoginForm />
        ) : byCode ? (
          <StudentLoginForm />
        ) : (
          <PhoneLoginForm />
        )}
        {!isTeacher && (
          <div className="flex w-full flex-col gap-2 text-sm">
            <Link
              href="/signup"
              className="rounded-xl border-2 border-brand-100 px-4 py-2.5 font-bold text-brand-700 hover:bg-brand-50"
            >
              처음이에요 · 회원가입
            </Link>
            <Link href={byCode ? "/login" : "/login?method=code"} className="text-xs text-zinc-500 underline">
              {byCode ? "전화번호로 로그인" : "선생님께 받은 코드로 로그인"}
            </Link>
          </div>
        )}
        <Link
          href={isTeacher ? "/login" : "/login?role=teacher"}
          className="text-xs text-zinc-400 underline"
        >
          {isTeacher ? "수강생 로그인" : "선생님 로그인"}
        </Link>
      </main>
    </div>
  );
}
