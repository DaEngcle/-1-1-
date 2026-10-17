"use client";

import { useActionState } from "react";
import { saveNickname } from "./actions";
import { inputClass, primaryButtonClass } from "@/app/_ui/styles";

export function NicknameForm({ current }: { current: string | null }) {
  const [state, action, pending] = useActionState(saveNickname, undefined);
  return (
    <form action={action} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          name="nickname"
          defaultValue={current ?? ""}
          placeholder="예: 시드니바리스타"
          maxLength={12}
          required
          className={`${inputClass} flex-1`}
        />
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "저장 중..." : "저장"}
        </button>
      </div>
      {state && (
        <p className={`text-sm ${state.status === "error" ? "text-red-600" : "text-green-700"}`}>{state.message}</p>
      )}
    </form>
  );
}
