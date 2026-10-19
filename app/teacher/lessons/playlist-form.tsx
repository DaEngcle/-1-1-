"use client";

import { useActionState } from "react";
import { importPlaylist } from "./actions";
import { inputClass, secondaryButtonClass } from "@/app/_ui/styles";
import { SubmitButton } from "@/app/_ui/submit-button";

export function PlaylistImportForm({ weekNumber, course }: { weekNumber: number; course: string }) {
  const [state, action, pending] = useActionState(importPlaylist, undefined);
  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="week_number" value={weekNumber} />
      <input type="hidden" name="course" value={course} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          name="playlist_url"
          placeholder="유튜브 재생목록 주소 (youtube.com/playlist?list=...)"
          required
          className={`${inputClass} flex-1`}
        />
        <SubmitButton disabled={pending} className={secondaryButtonClass}>
          {pending ? "가져오는 중..." : "재생목록 가져오기"}
        </SubmitButton>
      </div>
      {state && (
        <p className={`text-sm ${state.status === "error" ? "text-red-600" : "text-green-700"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
