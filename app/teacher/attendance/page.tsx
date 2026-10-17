import { createServerSupabaseClient, type AttendanceStatus } from "@/lib/supabase";
import { kstDate } from "@/lib/classroom/stats";
import { ATTENDANCE_LABEL } from "@/lib/classroom/attendance";
import { saveAttendance } from "./actions";
import { cardClass, inputClass, primaryButtonClass, secondaryButtonClass } from "@/app/_ui/styles";
import { requireTeacher } from "@/lib/classroom/dal";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await requireTeacher();
  const { date } = await searchParams;
  const classDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : kstDate(new Date());
  const supabase = createServerSupabaseClient();

  const [{ data: students }, { data: records }, { data: recentDates }] = await Promise.all([
    supabase.from("students").select("id, name").eq("is_active", true).order("name"),
    supabase.from("attendance").select("student_id, status, note").eq("class_date", classDate),
    supabase.from("attendance").select("class_date, status").order("class_date", { ascending: false }).limit(500),
  ]);
  const byStudent = new Map((records ?? []).map((r) => [r.student_id, r]));

  // 최근 수업일별 요약
  const summary = new Map<string, Record<AttendanceStatus, number>>();
  for (const r of recentDates ?? []) {
    const s = summary.get(r.class_date) ?? { present: 0, late: 0, absent: 0, excused: 0 };
    s[r.status as AttendanceStatus]++;
    summary.set(r.class_date, s);
  }

  return (
    <>
      <form className="flex items-center gap-2">
        <input type="date" name="date" defaultValue={classDate} className={inputClass} />
        <button type="submit" className={secondaryButtonClass}>
          날짜 이동
        </button>
      </form>

      <form action={saveAttendance} className={`${cardClass} flex flex-col gap-3`}>
        <h2 className="font-bold text-zinc-900">{classDate} 출결</h2>
        <input type="hidden" name="class_date" value={classDate} />
        {(students ?? []).length === 0 && <p className="text-sm text-zinc-500">활성 학생이 없어요.</p>}
        {(students ?? []).map((s) => {
          const record = byStudent.get(s.id);
          return (
            <fieldset key={s.id} className="flex flex-col gap-1.5 border-b border-zinc-100 pb-3">
              <input type="hidden" name="student_id" value={s.id} />
              <legend className="mb-1 font-medium text-zinc-900">{s.name}</legend>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(ATTENDANCE_LABEL) as AttendanceStatus[]).map((status) => (
                  <label
                    key={status}
                    className="flex cursor-pointer items-center gap-1 rounded-full border border-zinc-300 px-3 py-1 text-sm has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700"
                  >
                    <input
                      type="radio"
                      name={`status_${s.id}`}
                      value={status}
                      defaultChecked={record?.status === status}
                      className="sr-only"
                    />
                    {ATTENDANCE_LABEL[status].icon} {ATTENDANCE_LABEL[status].label}
                  </label>
                ))}
              </div>
              <input
                name={`note_${s.id}`}
                defaultValue={record?.note ?? ""}
                placeholder="메모 (선택)"
                className={`${inputClass} text-sm`}
              />
            </fieldset>
          );
        })}
        <button type="submit" className={primaryButtonClass}>
          출결 저장
        </button>
      </form>

      {summary.size > 0 && (
        <section className={cardClass}>
          <h2 className="mb-2 font-bold text-zinc-900">최근 수업일</h2>
          <ul className="flex flex-col gap-1 text-sm">
            {[...summary.entries()].slice(0, 15).map(([d, s]) => (
              <li key={d}>
                <a href={`/teacher/attendance?date=${d}`} className="flex justify-between hover:underline">
                  <span>{d}</span>
                  <span className="text-zinc-600">
                    출석 {s.present} · 지각 {s.late} · 결석 {s.absent} · 공결 {s.excused}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
