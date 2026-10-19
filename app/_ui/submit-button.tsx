"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

/**
 * 폼 제출 버튼: 누르는 동안 '처리 중' 표시, 끝나면 잠깐 '✓ 완료'
 * (눌렸는지 모르겠다는 피드백 반영)
 */
export function SubmitButton({
  className,
  children,
  onClick,
  disabled,
  title,
  name,
  value,
  formAction,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  title?: string;
  name?: string;
  value?: string;
  formAction?: (formData: FormData) => void | Promise<void>;
}) {
  const { pending } = useFormStatus();
  const [done, setDone] = useState(false);
  const wasPending = useRef(false);
  useEffect(() => {
    if (pending) {
      wasPending.current = true;
      return;
    }
    if (!wasPending.current) return;
    wasPending.current = false;
    setDone(true);
    const t = setTimeout(() => setDone(false), 1400);
    return () => clearTimeout(t);
  }, [pending]);
  return (
    <button
      type="submit"
      className={`${className ?? ""} relative`}
      onClick={onClick}
      disabled={disabled || pending}
      aria-busy={pending}
      title={title}
      name={name}
      value={value}
      formAction={formAction}
    >
      <span className={pending || done ? "invisible" : undefined}>{children}</span>
      {(pending || done) && (
        <span className="absolute inset-0 flex items-center justify-center gap-1 whitespace-nowrap">
          {pending ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span className="text-[0.85em]">처리 중</span>
            </>
          ) : (
            <span className="text-[0.85em]">✓ 완료</span>
          )}
        </span>
      )}
    </button>
  );
}
