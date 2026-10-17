import { requireTeacher } from "@/lib/classroom/dal";
import type { Metadata } from "next";
import { AppShell } from "@/app/_ui/app-shell";

export const metadata: Metadata = { title: "다잉클 클래스룸 · 선생님" };

const NAV = [
  { href: "/teacher", label: "홈" },
  { href: "/teacher/students", label: "학생" },
  { href: "/teacher/lessons", label: "레슨" },
  { href: "/teacher/submissions", label: "쉐도잉 제출" },
  { href: "/teacher/level-tests", label: "레벨·랭킹" },
  { href: "/teacher/attendance", label: "출결" },
];

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireTeacher();
  return (
    <AppShell title="다잉클 클래스룸 · 선생님" nav={NAV}>
      {children}
    </AppShell>
  );
}
