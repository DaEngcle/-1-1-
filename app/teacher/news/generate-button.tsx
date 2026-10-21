"use client";

import { useActionState } from "react";
import { generateNow } from "./actions";
import { SubmitButton } from "@/app/_ui/submit-button";

export function GenerateButton() {
  const [state, action, pending] = useActionState(generateNow, undefined);
  return (
    <form action={action} className="flex flex-col gap-1">
      <SubmitButton disabled={pending} className="self-start rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">
        {pending ? "만드는 중… (30초쯤)" : "✨ 지금 새 뉴스 2개 만들기"}
      </SubmitButton>
      {state && <p className="text-sm text-zinc-700">{state.message}</p>}
    </form>
  );
}
