import type { MetadataRoute } from "next";

// 홈 화면에 추가하면 앱처럼 실행 (PWA). 추후 Capacitor로 앱스토어 출시 시에도 재사용.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "다잉클 클래스룸",
    short_name: "다잉클",
    description: "부트캠프 복습 · 쉐도잉 · AI 발음 피드백",
    start_url: "/student",
    display: "standalone",
    background_color: "#fefce8",
    theme_color: "#facc15",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
