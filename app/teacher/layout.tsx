import { requireTeacher } from "@/lib/classroom/dal";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Metadata } from "next";
import { AppShell } from "@/app/_ui/app-shell";

export const metadata: Metadata = { title: "다잉클 클래스룸 · 선생님" };

const NAV = [
  { href: "/teacher", label: "홈" },
  { href: "/teacher/students", label: "학생" },
  { href: "/teacher/crm", label: "상담·고객" },
  { href: "/teacher/lessons", label: "레슨" },
  { href: "/teacher/resources", label: "자료실" },
  { href: "/teacher/news", label: "뉴스" },
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
  const supabase = createServerSupabaseClient();
  const [{ count }, { count: buyRequests }] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }).eq("approval", "pending"),
    supabase.from("resource_requests").select("id", { count: "exact", head: true }),
  ]);
  const nav = NAV.map((n) =>
    n.href === "/teacher/students" && count
      ? { ...n, label: `학생 · 신청 ${count}` }
      : n.href === "/teacher/resources" && buyRequests
        ? { ...n, label: `자료실 · 구매 ${buyRequests}` }
        : n,
  );
  return (
    <AppShell title="다잉클 클래스룸 · 선생님" nav={nav}>
      {children}
    </AppShell>
  );
}
