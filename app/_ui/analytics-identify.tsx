"use client";
// PostHog에 '어느 학생인지'를 학생 ID로만 알려준다 (이름·연락처는 보내지 않음)
import { useEffect } from "react";
import posthog from "posthog-js";

export function AnalyticsIdentify({ id, role, plan }: { id: string; role: "student" | "teacher"; plan?: string | null }) {
  useEffect(() => {
    if (!posthog.__loaded) return; // 열쇠가 없어 꺼져 있으면 아무것도 안 함
    if (posthog.get_distinct_id() === id) return;
    // 같은 기기에서 다른 학생이 로그인하면 이전 학생 기록과 섞이지 않게 먼저 끊는다
    if (posthog.get_property("$user_state") === "identified") posthog.reset();
    posthog.identify(id, { role, plan: plan ?? null });
  }, [id, role, plan]);
  return null;
}
