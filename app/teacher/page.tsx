import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { kstDate } from "@/lib/classroom/stats";
import { SubmissionList } from "./submission-list";
import { cardClass } from "@/app/_ui/styles";
import { requireTeacher } from "@/lib/classroom/dal";

export default async function TeacherHomePage() {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  const now = new Date();
  const today = kstDate(now);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [students, published, weekSubs, todayAttendance] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("lessons").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("submissions").select("student_id").gte("created_at", weekAgo),
    supabase.from("attendance").select("id", { count: "exact", head: true }).eq("class_date", today),
  ]);
  const activeThisWeek = new Set((weekSubs.data ?? []).map((s) => s.student_id)).size;

  const tiles = [
    { label: "활성 학생", value: students.count ?? 0, href: "/teacher/students" },
    { label: "공개 레슨", value: published.count ?? 0, href: "/teacher/lessons" },
    { label: "이번 주 제출", value: weekSubs.data?.length ?? 0 },
    { label: "이번 주 연습한 학생", value: activeThisWeek },
  ];

  return (
    <>
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => {
          const body = (
            <>
              <span className="text-xs text-zinc-500">{t.label}</span>
              <span className="text-2xl font-bold text-zinc-900">{t.value}</span>
            </>
          );
          return t.href ? (
            <Link key={t.label} href={t.href} className={`${cardClass} flex flex-col gap-1 hover:border-yellow-400`}>
              {body}
            </Link>
          ) : (
            <div key={t.label} className={`${cardClass} flex flex-col gap-1`}>
              {body}
            </div>
          );
        })}
      </section>

      <Link href="/teacher/attendance" className={`${cardClass} flex items-center justify-between hover:border-yellow-400`}>
        <span className="font-semibold text-zinc-900">오늘({today}) 출결 체크</span>
        <span className="text-sm text-zinc-500">
          {todayAttendance.count ? `${todayAttendance.count}명 기록됨` : "아직 기록 없음"} →
        </span>
      </Link>

      <section className="flex flex-col gap-2">
        <h2 className="font-bold text-zinc-900">최근 쉐도잉 제출</h2>
        <SubmissionList />
      </section>
    </>
  );
}
