"use client";

import { useEffect } from "react";

/** 강의 목록에 들어오면 마지막으로 보던 강의가 화면 가운데 오게 내려 준다 */
export function ScrollToLesson({ id }: { id: string }) {
  useEffect(() => {
    // 주소에 #lesson-… 이 있으면 그 강의, 없으면 마지막으로 본 강의
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const el = document.getElementById(hash.startsWith("lesson-") ? hash : `lesson-${id}`);
    if (el) el.scrollIntoView({ block: "center" });
  }, [id]);
  return null;
}
