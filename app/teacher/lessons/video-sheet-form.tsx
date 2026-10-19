"use client";

import { useActionState } from "react";
import { saveVideoSheet } from "./actions";
import { inputClass, secondaryButtonClass } from "@/app/_ui/styles";
import { SubmitButton } from "@/app/_ui/submit-button";

/** 강의 링크 시트 연결: VOD 링크를 시트에 넣으면 1시간 안에 학생 화면에 자동 반영 */
export function VideoSheetForm({ course, sheet }: { course: string; sheet: string | null }) {
  const [state, action] = useActionState(saveVideoSheet, undefined);
  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="course" value={course} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          name="sheet"
          defaultValue={sheet ?? ""}
          placeholder="구글 시트 주소 (docs.google.com/spreadsheets/d/...)"
          className={`${inputClass} flex-1 text-sm`}
        />
        <SubmitButton className={secondaryButtonClass}>{sheet ? "지금 반영하기" : "연결하기"}</SubmitButton>
      </div>
      {state && (
        <p className={`text-sm ${state.status === "error" ? "text-red-600" : "text-green-700"}`}>{state.message}</p>
      )}
    </form>
  );
}
