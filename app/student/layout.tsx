import { requireStudent } from "@/lib/classroom/dal";
import type { Metadata } from "next";
import { AppShell } from "@/app/_ui/app-shell";

export const metadata: Metadata = { title: "다잉클 클래스룸" };

const NAV = [
  { href: "/student", label: "홈 · 내 성과" },
  { href: "/student/lessons", label: "부트캠프 복습" },
  { href: "/student/shadowing", label: "내 쉐도잉" },
  { href: "/student/level-test", label: "레벨테스트" },
  { href: "/student/pronunciation", label: "발음 가이드" },
];

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const student = await requireStudent();
  return (
    <AppShell title={`다잉클 클래스룸 · ${student.name}`} nav={NAV}>
      {children}
    </AppShell>
  );
}
