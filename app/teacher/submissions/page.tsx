import Link from "next/link";
import { createServerSupabaseClient, type Submission } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";
import { getCourseProgress } from "@/lib/classroom/progress";
import { SubmissionList } from "../submission-list";
import { cardClass, inputClass, secondaryButtonClass } from "@/app/_ui/styles";

const STATUS_OPTIONS: { value: Submission["status"]; label: string }[] = [
  { value: "pending", label: "채점 대기" },
  { value: "scored", label: "채점 완료" },
  { value: "failed", label: "인식 실패" },
];

export default async function TeacherSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ student?: string; week?: string; status?: string; page?: string }>;
}) {
  await requireTeacher();
  const params = await searchParams;
  const supabase = createServerSupabaseClient();

  const [{ data: studentRows }, { data: weekRows }] = await Promise.all([
    supabase.from("students").select("id, name").eq("is_active", true).order("name"),
    supabase.from("lessons").select("week_number, week_title").order("sort_order"),
  ]);
  const students = studentRows ?? [];
  const weeks = [...new Map((weekRows ?? []).map((w) => [w.week_number, w.week_title])).entries()];
  const progress = await getCourseProgress(students.map((s) => s.id));

  const studentId = students.some((s) => s.id === params.student) ? params.student : undefined;
  const weekNumber = Number(params.week) || undefined;
  const status = STATUS_OPTIONS.some((o) => o.value === params.status)
    ? (params.status as Submission["status"])
    : undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const pageHref = (p: number) => {
    const q = new URLSearchParams();
    if (studentId) q.set("student", studentId);
    if (weekNumber) q.set("week", String(weekNumber));
    if (status) q.set("status", status);
    if (p > 1) q.set("page", String(p));
    const qs = q.toString();
    return `/teacher/submissions${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <h1 className="text-xl font-bold text-zinc-900">🎤 쉐도잉 제출</h1>

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">학생별 제출 현황</h2>
        <p className="mb-2 text-xs text-zinc-500">공개된 레슨의 쉐도잉 문장 중 한 번이라도 제출한 문장 수예요.</p>
        {students.length === 0 ? (
          <p className="text-sm text-zinc-500">등록된 학생이 없어요.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-zinc-100">
            {students.map((s) => {
              const p = progress.get(s.id);
              return (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <Link href={`/teacher/submissions?student=${s.id}`} className="font-medium hover:underline">
                    {s.name}
                  </Link>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-20 overflow-hidden rounded-full bg-zinc-200 sm:w-32">
                      <span
                        className="block h-full bg-yellow-400"
                        style={{ width: `${p?.submitPercent ?? 0}%` }}
                      />
                    </span>
                    <span className="w-24 text-right text-zinc-600">
                      {p?.submittedSentences ?? 0}/{p?.sentences ?? 0} ({p?.submitPercent ?? 0}%)
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <form className="flex flex-wrap items-center gap-2" action="/teacher/submissions">
        <select name="student" defaultValue={studentId ?? ""} className={inputClass}>
          <option value="">모든 학생</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select name="week" defaultValue={weekNumber ?? ""} className={inputClass}>
          <option value="">모든 주차</option>
          {weeks.map(([n, title]) => (
            <option key={n} value={n}>
              Week {n} · {title}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status ?? ""} className={inputClass}>
          <option value="">모든 상태</option>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button type="submit" className={secondaryButtonClass}>
          보기
        </button>
        {(studentId || weekNumber || status) && (
          <Link href="/teacher/submissions" className="text-sm text-zinc-500 underline">
            초기화
          </Link>
        )}
      </form>

      <SubmissionList
        studentId={studentId}
        weekNumber={weekNumber}
        status={status}
        limit={30}
        page={page}
        pageHref={pageHref}
      />
    </>
  );
}
