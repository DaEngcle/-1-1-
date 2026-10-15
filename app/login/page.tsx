import type { Metadata } from "next";
import Link from "next/link";
import { StudentLoginForm, TeacherLoginForm } from "./login-forms";

export const metadata: Metadata = {
  title: "로그인 | 다잉클 클래스룸",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; error?: string }>;
}) {
  const { role, error } = await searchParams;
  const isTeacher = role === "teacher";

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-yellow-50 px-6 py-16">
      <main className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-yellow-700">
            {isTeacher ? "선생님 전용" : "수강생 전용"}
          </p>
          <h1 className="text-3xl font-bold text-zinc-900">다잉클 클래스룸</h1>
          <p className="text-base text-zinc-600">
            {isTeacher
              ? "학생 관리, 레슨, 출결을 한 곳에서."
              : "복습하고, 쉐도잉하고, AI 피드백 받기."}
          </p>
        </div>
        {(error === "inactive" || error === "expired") && (
          <p className="text-sm text-red-600">
            로그인이 만료됐어요. 선생님께 받은 코드로 다시 로그인해주세요.
          </p>
        )}
        {isTeacher ? <TeacherLoginForm /> : <StudentLoginForm />}
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
