"use client";

import { useActionState } from "react";
import { studentLogin, teacherLogin } from "./actions";

const inputClass =
  "rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none";
const buttonClass =
  "rounded-xl border-b-4 border-brand-800 bg-brand-600 px-4 py-3 font-bold text-white transition-all hover:bg-brand-500 active:translate-y-0.5 active:border-b-2 disabled:opacity-50";

export function StudentLoginForm() {
  const [state, action, pending] = useActionState(studentLogin, undefined);
  return (
    <form action={action} className="flex w-full flex-col gap-3">
      <input
        name="code"
        placeholder="로그인 코드 (예: ABCD-EFGH)"
        autoComplete="off"
        autoCapitalize="characters"
        required
        className={`${inputClass} text-center font-mono tracking-widest uppercase`}
      />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "확인 중..." : "시작하기"}
      </button>
      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}

export function TeacherLoginForm() {
  const [state, action, pending] = useActionState(teacherLogin, undefined);
  return (
    <form action={action} className="flex w-full flex-col gap-3">
      <input
        name="password"
        type="password"
        placeholder="선생님 비밀번호"
        required
        className={inputClass}
      />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "확인 중..." : "선생님으로 로그인"}
      </button>
      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}
