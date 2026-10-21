"use client";

import { useActionState } from "react";
import { saveCatName } from "@/app/student/profile/actions";
import { inputClass, primaryButtonClass } from "@/app/_ui/styles";
import { SubmitButton } from "@/app/_ui/submit-button";

/** 고양이 이름 짓기 */
export function CatNameForm({ current }: { current: string | null }) {
  const [state, action, pending] = useActionState(saveCatName, undefined);
  return (
    <form action={action} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          name="cat_name"
          defaultValue={current ?? ""}
          placeholder="예: 모찌, 호두, 라떼"
          maxLength={10}
          required
          className={`${inputClass} min-w-0 flex-1`}
        />
        <SubmitButton disabled={pending} className={primaryButtonClass}>
          {pending ? "저장 중..." : current ? "바꾸기" : "이름 짓기"}
        </SubmitButton>
      </div>
      {state && (
        <p className={`text-sm ${state.status === "error" ? "text-red-600" : "text-green-700"}`}>{state.message}</p>
      )}
    </form>
  );
}
