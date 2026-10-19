"use client";

import { useActionState } from "react";
import { freeSignup } from "./actions";
import { inputClass } from "@/app/_ui/styles";
import { SubmitButton } from "@/app/_ui/submit-button";

const buttonClass =
  "rounded-xl border-b-4 border-amber-500 bg-[#ffd23f] px-4 py-3 text-base font-extrabold text-zinc-900 transition-all hover:brightness-105 active:translate-y-0.5 active:border-b-2 disabled:opacity-50";

export function FreeSignupForm({ from }: { from: string }) {
  const [state, action, pending] = useActionState(freeSignup, undefined);
  return (
    <form action={action} className="flex w-full flex-col gap-3 text-left">
      <input type="hidden" name="from" value={from} />
      <input name="name" placeholder="이름" autoComplete="name" required className={inputClass} />
      <input
        name="phone"
        type="tel"
        inputMode="numeric"
        placeholder="휴대폰 번호 (로그인 아이디)"
        autoComplete="tel"
        required
        className={inputClass}
      />
      <input
        name="password"
        type="password"
        placeholder="비밀번호 (8자 이상)"
        autoComplete="new-password"
        minLength={8}
        required
        className={inputClass}
      />
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
        <span className="px-1 text-xs text-zinc-500">한글·영문·숫자 2~12자, 띄어쓰기 없이</span>
      </div>
      <label className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-zinc-600">
        <input type="checkbox" name="privacy" required className="mt-0.5" />
        <span>
          <b>[필수] 개인정보 수집·이용 동의</b>
          <br />
          수집 항목: 이름, 휴대폰 번호, 학습 기록(녹음 포함) · 목적: 무료 자료 제공과 학습 관리 · 보관: 탈퇴 요청 시 또는
          마지막 이용 후 1년 뒤 삭제
        </span>
      </label>
      <label className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-zinc-600">
        <input type="checkbox" name="marketing" className="mt-0.5" />
        <span>
          <b>[선택] 혜택·이벤트 안내 받기</b>
          <br />
          새 무료 자료, 할인, 웨비나 소식을 카톡·문자로 보내드려요. 언제든 그만 받을 수 있어요.
        </span>
      </label>
      <SubmitButton disabled={pending} className={buttonClass}>
        🎁 무료로 받고 바로 들어가기
      </SubmitButton>
      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}
