"use client";

import { useActionState } from "react";
import { changePassword } from "./actions";
import { inputClass, primaryButtonClass } from "@/app/_ui/styles";
import { SubmitButton } from "@/app/_ui/submit-button";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined);
  return (
    <form action={action} className="flex flex-col gap-2">
      <input name="current" type="password" placeholder="지금 비밀번호 (임시 비밀번호)" autoComplete="current-password" required className={inputClass} />
      <input name="next" type="password" placeholder="새 비밀번호 (8자 이상)" autoComplete="new-password" minLength={8} required className={inputClass} />
      <input name="confirm" type="password" placeholder="새 비밀번호 확인" autoComplete="new-password" minLength={8} required className={inputClass} />
      <SubmitButton disabled={pending} className={`${primaryButtonClass} self-start`}>
        {pending ? "바꾸는 중..." : "비밀번호 바꾸기"}
      </SubmitButton>
      {state && (
        <p className={`text-sm ${state.status === "error" ? "text-red-600" : "text-green-700"}`}>{state.message}</p>
      )}
    </form>
  );
}
