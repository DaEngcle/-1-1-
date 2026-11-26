// PostHog: 학생들이 어떤 화면을 열고 어디서 멈추는지 보는 분석 도구
// NEXT_PUBLIC_POSTHOG_KEY가 있을 때만 켜진다 (없으면 아무것도 보내지 않음)
import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  try {
    posthog.init(key, {
      // 광고 차단기에 막히지 않게 우리 도메인(/ingest)을 거쳐 보낸다 — next.config.ts rewrites
      api_host: "/ingest",
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST === "eu" ? "https://eu.posthog.com" : "https://us.posthog.com",
      defaults: "2025-05-24",
      person_profiles: "identified_only",
      session_recording: {
        // 세션 다시보기에서 입력 내용(비밀번호·숙제 답 등)은 가린다
        maskAllInputs: true,
      },
    });
  } catch (e) {
    console.error("PostHog 시작 실패:", e);
  }
}
