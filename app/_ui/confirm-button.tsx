"use client";

import { SubmitButton } from "./submit-button";

/** 누르면 확인 창을 띄우고, 확인해야 폼을 제출하는 버튼 */
export function ConfirmButton({
  message,
  className,
  children,
}: {
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <SubmitButton
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </SubmitButton>
  );
}
