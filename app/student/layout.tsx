import { requireStudent } from "@/lib/classroom/dal";
import type { Metadata } from "next";
import { AppShell } from "@/app/_ui/app-shell";
import { CatProvider } from "@/app/_ui/cat-context";

export const metadata: Metadata = { title: "다잉클 클래스룸" };

const NAV = [
  { href: "/student", label: "홈 · 내 성과" },
  { href: "/student/lessons", label: "강의 · 쉐도잉" },
  { href: "/student/talk", label: "🎭 AI 면접" },
  { href: "/student/voca", label: "🎮 보카" },
  { href: "/student/league", label: "🏆 리그" },
  { href: "/student/news", label: "📰 뉴스로 공부" },
  { href: "/student/resources", label: "🎁 자료실" },
  { href: "/student/shadowing", label: "내 쉐도잉" },
  { href: "/student/level-test", label: "레벨테스트" },
  { href: "/student/pronunciation", label: "발음 가이드" },
  { href: "/student/profile", label: "👤 내 정보" },
];

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const student = await requireStudent();
  return (
    <AppShell title={`다잉클 · ${student.nickname ?? student.name}`} nav={NAV}>
      <CatProvider breed={student.catBreed} name={student.catName}>{children}</CatProvider>
    </AppShell>
  );
}
