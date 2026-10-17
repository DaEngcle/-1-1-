import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { kstDate } from "@/lib/classroom/stats";
import { SubmissionList } from "./submission-list";
import { getRoster, STATUS_INFO } from "@/lib/classroom/roster";
import { cardClass } from "@/app/_ui/styles";
import { requireTeacher } from "@/lib/classroom/dal";

export default async function TeacherHomePage() {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  const now = new Date();
  const today = kstDate(now);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [students, published, weekSubs, todayAttendance, pending] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("lessons").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("submissions").select("student_id").gte("created_at", weekAgo),
    supabase.from("attendance").select("id", { count: "exact", head: true }).eq("class_date", today),
    supabase.from("students").select("id", { count: "exact", head: true }).eq("approval", "pending"),
  ]);
  const roster = await getRoster();
  const attention = roster
    .filter((r) => r.isActive && (r.status === "risk" || r.status === "slow"))
    .sort((a, b) => (b.daysInactive ?? 99) - (a.daysInactive ?? 99));
  const activeThisWeek = new Set((weekSubs.data ?? []).map((s) => s.student_id)).size;

  const tiles = [
    { label: "활성 학생", value: students.count ?? 0, href: "/teacher/students" },
    { label: "공개 레슨", value: published.count ?? 0, href: "/teacher/lessons" },
    { label: "이번 주 제출", value: weekSubs.data?.length ?? 0 },
    { label: "이번 주 연습한 학생", value: activeThisWeek },
  ];

  return (
    <>
      {(pending.count ?? 0) > 0 && (
        <Link
          href="/teacher/students"
          className="flex items-center justify-between rounded-2xl bg-brand-600 p-4 font-bold text-white shadow-md"
        >
          <span>🙋 가입 신청 {pending.count}건이 승인을 기다리고 있어요</span>
          <span>승인하러 가기 →</span>
        </Link>
      )}
      {attention.length > 0 && (
        <section className={cardClass}>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-bold text-zinc-900">👀 오늘 챙길 학생</h2>
            <Link href="/teacher/students?filter=risk&sort=attention" className="text-xs font-semibold text-brand-700">
              전체 보기 →
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-slate-100 text-sm">
            {attention.slice(0, 5).map((r) => (
              <li key={r.id}>
                <Link href={`/teacher/students/${r.id}`} className="flex items-center justify-between gap-2 py-2 hover:bg-brand-50">
                  <span>
                    {STATUS_INFO[r.status].icon} <b>{r.name}</b>
                    <span className="ml-2 text-xs text-zinc-500">
                      {r.daysInactive == null ? "아직 시작 안 함" : `${r.daysInactive}일째 활동 없음`}
                    </span>
                  </span>
                  <span className="text-xs text-zinc-400">
                    {r.daysLeft != null && r.daysLeft >= 0 && r.daysLeft <= 14 ? `⏳ D-${r.daysLeft}` : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => {
          const body = (
            <>
              <span className="text-xs text-zinc-500">{t.label}</span>
              <span className="text-2xl font-bold text-zinc-900">{t.value}</span>
            </>
          );
          return t.href ? (
            <Link key={t.label} href={t.href} className={`${cardClass} flex flex-col gap-1 hover:border-brand-300`}>
              {body}
            </Link>
          ) : (
            <div key={t.label} className={`${cardClass} flex flex-col gap-1`}>
              {body}
            </div>
          );
        })}
      </section>

      <Link href="/teacher/attendance" className={`${cardClass} flex items-center justify-between hover:border-brand-300`}>
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
