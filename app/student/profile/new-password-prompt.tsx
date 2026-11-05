"use client";

import { useActionState } from "react";
import { setNewPassword } from "./actions";
import { inputClass, primaryButtonClass } from "@/app/_ui/styles";
import { SubmitButton } from "@/app/_ui/submit-button";

/** 비밀번호가 초기화된 학생: 새 비밀번호를 정할 때까지 닫히지 않는 창 */
export function NewPasswordPrompt() {
  const [state, action, pending] = useActionState(setNewPassword, undefined);
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="new-password-title" className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
        <h2 id="new-password-title" className="text-lg font-extrabold text-zinc-900">🔒 새 비밀번호를 정해주세요</h2>
        <p className="mt-1 mb-4 text-sm text-zinc-600">
          지금 비밀번호는 임시 비밀번호예요. 다음 로그인부터 쓸 새 비밀번호를 정하면 바로 이어서 공부할 수 있어요.
        </p>
        <form action={action} className="flex flex-col gap-2">
          <input name="next" type="password" placeholder="새 비밀번호 (8자 이상)" autoComplete="new-password" minLength={8} required autoFocus className={inputClass} />
          <input name="confirm" type="password" placeholder="새 비밀번호 확인" autoComplete="new-password" minLength={8} required className={inputClass} />
          <SubmitButton disabled={pending} className={primaryButtonClass}>
            {pending ? "저장하는 중..." : "새 비밀번호 저장"}
          </SubmitButton>
          {state?.status === "error" && <p className="text-sm text-red-600">{state.message}</p>}
        </form>
      </div>
    </div>
  );
}
