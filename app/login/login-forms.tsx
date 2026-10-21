"use client";

import { useActionState } from "react";
import { phoneLogin, signup, studentLogin, teacherLogin } from "./actions";
import { SubmitButton } from "@/app/_ui/submit-button";

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
      <SubmitButton disabled={pending} className={buttonClass}>
        {pending ? "확인 중..." : "시작하기"}
      </SubmitButton>
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
      <SubmitButton disabled={pending} className={buttonClass}>
        {pending ? "확인 중..." : "선생님으로 로그인"}
      </SubmitButton>
      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}

export function PhoneLoginForm() {
  const [state, action, pending] = useActionState(phoneLogin, undefined);
  return (
    <form action={action} className="flex w-full flex-col gap-3">
      <input name="phone" type="tel" inputMode="numeric" placeholder="휴대폰 번호" autoComplete="tel" required className={inputClass} />
      <input name="password" type="password" placeholder="비밀번호" autoComplete="current-password" required className={inputClass} />
      <details className="text-xs text-zinc-500">
        <summary className="cursor-pointer">비밀번호를 잊으셨나요?</summary>
        <p className="mt-1">
          다니엘쌤 카톡으로 &ldquo;비밀번호 잊었어요 + 이름&rdquo;을 보내주세요. 임시 비밀번호를 보내드려요. 로그인한 뒤
          [내 정보 → 비밀번호 바꾸기]에서 새로 바꾸면 돼요.
        </p>
      </details>
      <SubmitButton disabled={pending} className={buttonClass}>
        {pending ? "확인 중..." : "로그인"}
      </SubmitButton>
      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);
  if (state && "done" in state) {
    return (
      <div className="flex w-full flex-col gap-2 rounded-2xl bg-brand-50 p-4 text-sm text-zinc-800">
        <p className="text-base font-bold text-brand-700">🎉 가입 완료! 환영해요</p>
        <p>수강 확인이 끝나면 바로 열어드릴게요. 그때 휴대폰 번호와 비밀번호로 로그인하면 돼요 😊</p>
      </div>
    );
  }
  return (
    <form action={action} className="flex w-full flex-col gap-3 text-left">
      <input name="name" placeholder="이름 (실명)" autoComplete="name" required className={inputClass} />
      <div className="flex flex-col gap-1">
        <input
          name="nickname"
          placeholder="닉네임 (랭킹에 보여요)"
          autoComplete="off"
          minLength={2}
          maxLength={12}
          pattern="[가-힣A-Za-z0-9_]{2,12}"
          title="한글·영문·숫자·_ 로 2~12자"
          required
          className={inputClass}
        />
        <span className="px-1 text-xs text-zinc-500">🏆 랭킹에는 실명 대신 닉네임이 보여요. 한글·영문·숫자 2~12자</span>
      </div>
      <input name="phone" type="tel" inputMode="numeric" placeholder="휴대폰 번호 (로그인 아이디)" autoComplete="tel" required className={inputClass} />
      <input name="password" type="password" placeholder="비밀번호 (8자 이상)" autoComplete="new-password" minLength={8} required className={inputClass} />
      <input name="password_confirm" type="password" placeholder="비밀번호 확인" autoComplete="new-password" minLength={8} required className={inputClass} />
      <label className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-zinc-600">
        <input type="checkbox" name="privacy" required className="mt-0.5" />
        <span>
          <b>[필수] 개인정보 수집·이용 동의</b>
          <br />
          수집 항목: 이름, 휴대폰 번호, 학습 기록(녹음 포함) · 목적: 수강생 확인과 학습 관리 · 보관: 수강 종료 후 1년 뒤
          삭제
        </span>
      </label>
      <SubmitButton disabled={pending} className={buttonClass}>
        {pending ? "신청 중..." : "가입 신청"}
      </SubmitButton>
      {state && "error" in state && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}
