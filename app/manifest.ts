import type { MetadataRoute } from "next";

/** 홈 화면에 설치하는 앱(PWA) 정보 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "다잉클 클래스룸",
    short_name: "다잉클",
    description: "워홀 영어, 매일 10분 쉐도잉으로. AI 발음 채점 · 강의 진도 · 레벨테스트",
    id: "/student",
    start_url: "/student?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#2453eb",
    lang: "ko",
    categories: ["education"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "강의 · 쉐도잉", url: "/student/lessons", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "내 쉐도잉", url: "/student/shadowing", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "자료실", url: "/student/resources", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
