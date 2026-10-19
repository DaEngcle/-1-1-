"use client";

import { useActionState } from "react";
import { pasteVideoRows } from "./actions";
import { inputClass, secondaryButtonClass } from "@/app/_ui/styles";
import { SubmitButton } from "@/app/_ui/submit-button";

/** 강의 링크 시트에서 줄을 복사해 붙여넣으면 바뀐 영상만 교체 (시트는 비공개 그대로) */
export function VideoSheetForm({ course }: { course: string }) {
  const [state, action] = useActionState(pasteVideoRows, undefined);
  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="course" value={course} />
      <textarea
        name="rows"
        required
        rows={3}
        placeholder={"시트에서 Day 줄들을 드래그해서 복사(⌘C) → 여기에 붙여넣기(⌘V)\n예: Day 07 - No one told me…   https://youtu.be/…   https://youtu.be/…"}
        className={`${inputClass} text-sm`}
      />
      <SubmitButton className={`${secondaryButtonClass} self-start`}>영상 반영하기</SubmitButton>
      {state && (
        <p className={`text-sm ${state.status === "error" ? "text-red-600" : "text-green-700"}`}>{state.message}</p>
      )}
    </form>
  );
}
