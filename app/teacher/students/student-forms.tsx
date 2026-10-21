"use client";

import { useActionState } from "react";
import {
  createStudent,
  makeTempPassword,
  regenerateCode,
  type StudentFormState,
} from "./actions";
import { CopyButton } from "@/app/_ui/copy-button";
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

/** 비밀번호를 잊은 학생에게 임시 비밀번호 만들어 주기 */
export function TempPasswordButton({ id, name }: { id: string; name: string }) {
  const [state, action, pending] = useActionState(makeTempPassword, undefined);
  const message =
    state?.status === "success"
      ? `${name}님, 다잉클 클래스룸 임시 비밀번호예요 🔑\n${state.password}\n\n휴대폰 번호 + 이 비밀번호로 로그인한 뒤, [내 정보 → 비밀번호 바꾸기]에서 꼭 새 비밀번호로 바꿔주세요!`
      : "";
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`${name} 학생의 비밀번호를 임시 비밀번호로 바꿀까요? 지금 로그인된 기기는 로그아웃돼요.`)) {
          e.preventDefault();
        }
      }}
      className="flex flex-col gap-2"
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton disabled={pending} className={secondaryButtonClass}>
        🔑 임시 비밀번호 만들기
      </SubmitButton>
      {state?.status === "error" && <p className="text-sm text-red-600">{state.message}</p>}
      {state?.status === "success" && (
        <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
          <p>
            임시 비밀번호: <b className="font-mono text-lg tracking-wider">{state.password}</b>
          </p>
          <p className="text-xs text-zinc-600">이 화면을 벗어나면 다시 볼 수 없어요. 아래 버튼으로 복사해서 카톡으로 보내주세요.</p>
          <CopyButton
            text={message}
            label="💬 카톡 안내 메시지 복사"
            className="self-start rounded-lg bg-[#ffd23f] px-3 py-1.5 text-sm font-bold text-zinc-900"
          />
        </div>
      )}
    </form>
  );
}
