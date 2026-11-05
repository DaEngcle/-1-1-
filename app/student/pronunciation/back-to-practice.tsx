"use client";

import { useRouter } from "next/navigation";

/** 강의 연습 중에 들어온 학생이 하던 곳으로 돌아가는 버튼 (앱으로 설치하면 브라우저 뒤로 가기가 없다) */
export function BackToPractice() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="self-start rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm font-bold text-brand-700 shadow-sm"
    >
      ← 연습하던 곳으로 돌아가기
    </button>
  );
}
