"use client";

import { useActionState } from "react";
import {
  createStudent,
  regenerateCode,
  type StudentFormState,
} from "./actions";
import {
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/app/_ui/styles";
import { PLANS } from "@/lib/classroom/plans";
import { SubmitButton } from "@/app/_ui/submit-button";

function CodeNotice({ state }: { state: StudentFormState }) {
  if (!state) return null;
  if (state.status === "error") {
    return <p className="text-sm text-red-600">{state.message}</p>;
  }
  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-zinc-800">
      <p>
        <b>{state.name}</b> 학생 로그인 코드:{" "}
        <span className="font-mono text-base font-bold tracking-widest">
          {state.code}
        </span>
      </p>
      <p className="mt-1 text-xs text-zinc-600">
        이 코드는 지금만 보여요. 학생에게 바로 전달해주세요. (분실 시 재발급)
      </p>
    </div>
  );
}

export function CreateStudentForm() {
  const [state, action, pending] = useActionState(createStudent, undefined);
  return (
    <form action={action} className="flex flex-col gap-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <input name="name" placeholder="이름" required className={inputClass} />
        <input name="phone" type="tel" placeholder="전화번호 (선택)" className={inputClass} />
        <input name="memo" placeholder="메모 (선택)" className={inputClass} />
      </div>
      <select name="plan" defaultValue="bootcamp" className={inputClass}>
        {Object.entries(PLANS).map(([id, p]) => (
          <option key={id} value={id}>
            {p.name} ({p.months}개월, 오늘부터)
          </option>
        ))}
      </select>
      <SubmitButton disabled={pending} className={primaryButtonClass}>
        {pending ? "등록 중..." : "학생 등록"}
      </SubmitButton>
      <CodeNotice state={state} />
    </form>
  );
}

export function RegenerateCodeButton({ id, name }: { id: string; name: string }) {
  const [state, action, pending] = useActionState(regenerateCode, undefined);
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`${name} 학생의 기존 코드는 더 이상 쓸 수 없게 돼요. 재발급할까요?`)) {
          e.preventDefault();
        }
      }}
      className="flex flex-col gap-2"
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="name" value={name} />
      <SubmitButton disabled={pending} className={secondaryButtonClass}>
        코드 재발급
      </SubmitButton>
      <CodeNotice state={state} />
    </form>
  );
}
