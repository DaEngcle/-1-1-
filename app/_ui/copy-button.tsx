"use client";

import { useState } from "react";

/** 누르면 text를 클립보드에 복사 (카톡 응원 메시지·전화번호 등) */
export function CopyButton({ text, label, className }: { text: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      title={text}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          window.prompt("아래 내용을 복사해 주세요", text);
        }
      }}
      className={className}
    >
      {copied ? "✅ 복사됨" : label}
    </button>
  );
}
