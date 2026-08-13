"use client";

import { useActionState, useEffect, useRef } from "react";
import { subscribeTrial, type SubscribeState } from "./actions";

const initialState: SubscribeState = { status: "idle", message: "" };

export function SubscribeForm() {
  const [state, formAction, pending] = useActionState(
    subscribeTrial,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex w-full max-w-sm flex-col gap-3"
    >
      <input
        type="text"
        name="name"
        placeholder="이름"
        required
        className="rounded-lg border border-zinc-300 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-yellow-500 focus:outline-none"
      />
      <input
        type="tel"
        name="phone"
        placeholder="휴대폰 번호 (010-1234-5678)"
        required
        className="rounded-lg border border-zinc-300 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-yellow-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-yellow-400 px-4 py-3 font-semibold text-zinc-900 transition-colors hover:bg-yellow-300 disabled:opacity-50"
      >
        {pending ? "신청 중..." : "3일 무료로 시작하기"}
      </button>
      {state.message && (
        <p
          role="status"
          className={
            state.status === "success"
              ? "text-sm text-green-600"
              : "text-sm text-red-600"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
