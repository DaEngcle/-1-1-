import { requireStudent } from "@/lib/classroom/dal";
import type { Metadata } from "next";
import { AppShell } from "@/app/_ui/app-shell";
import { CatProvider } from "@/app/_ui/cat-context";
import { FeedbackPrompt } from "@/app/_ui/feedback-prompt";

export const metadata: Metadata = { title: "다잉클 클래스룸" };

const NAV = [
  { href: "/student", label: "홈 · 내 성과" },
  { href: "/student/lessons", label: "강의 · 쉐도잉" },
  { href: "/student/talk", label: "🎭 AI 면접" },
  { href: "/student/voca", label: "🎮 보카" },
  { href: "/student/grammar", label: "🐤 기초 문법" },
  { href: "/student/league", label: "🏆 리그" },
  { href: "/student/news", label: "📰 뉴스로 공부" },
  { href: "/student/resources", label: "🎁 자료실" },
  { href: "/student/shadowing", label: "🎤 내 쉐도잉" },
  { href: "/student/level-test", label: "📈 레벨테스트" },
  { href: "/student/pronunciation", label: "👄 발음 가이드" },
  { href: "/student/profile", label: "👤 내 정보" },
];

// 휴대폰 아래 탭바에 둘 자주 쓰는 메뉴 (나머지는 '더보기')
const BOTTOM_NAV = [
  { href: "/student", icon: "🏠", label: "홈" },
  { href: "/student/lessons", icon: "🎬", label: "강의" },
  { href: "/student/talk", icon: "🎭", label: "AI 면접" },
  { href: "/student/voca", icon: "🎮", label: "보카" },
  { href: "/student/league", icon: "🏆", label: "리그" },
];

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const student = await requireStudent();
  return (
    <AppShell title={`다잉클 · ${student.nickname ?? student.name}`} nav={NAV} bottomNav={BOTTOM_NAV}>
      <CatProvider breed={student.catBreed} name={student.catName}>{children}</CatProvider>
      <FeedbackPrompt />
    </AppShell>
  );
}
