import Link from "next/link";
import { createServerSupabaseClient, type Student } from "@/lib/supabase";
import { approveStudent, rejectStudent, setStudentActive } from "./actions";
import { PLANS, isPlanId } from "@/lib/classroom/plans";
import { kstDate } from "@/lib/classroom/stats";
import { ConfirmButton } from "@/app/_ui/confirm-button";
import { getCourseProgress } from "@/lib/classroom/progress";
import { CreateStudentForm, RegenerateCodeButton } from "./student-forms";
import { cardClass, secondaryButtonClass } from "@/app/_ui/styles";
import { requireTeacher } from "@/lib/classroom/dal";

export default async function StudentsPage() {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("students")
    .select("id, name, nickname, phone, memo, is_active, created_at, approval, plan, requested_plan, access_until")
    .order("is_active", { ascending: false })
    .order("name");
  type Row = Omit<Student, "login_code_hash" | "session_version"> & {
    nickname: string | null;
    approval: "pending" | "approved" | "rejected";
    plan: string | null;
    requested_plan: string | null;
    access_until: string | null;
  };
  const all = (data ?? []) as Row[];
  const pendingStudents = all.filter((s) => s.approval === "pending");
  const students = all.filter((s) => s.approval === "approved");
  const today = kstDate(new Date());
  const [progress, { data: levelRows }] = await Promise.all([
    getCourseProgress(students.map((s) => s.id)),
    supabase
      .from("level_tests")
      .select("student_id, kind, level")
      .not("finished_at", "is", null),
  ]);
  const levelOf = (id: string, kind: string) =>
    levelRows?.find((r) => r.student_id === id && r.kind === kind)?.level as number | undefined;

  return (
    <>
      {pendingStudents.length > 0 && (
        <section className={`${cardClass} border-brand-200 bg-brand-50/50`}>
          <h2 className="mb-1 font-bold text-zinc-900">🙋 가입 신청 ({pendingStudents.length})</h2>
          <p className="mb-3 text-xs text-zinc-500">
            결제·수강 등록을 확인한 뒤 승인해 주세요. 시작일부터 수강권 기간만큼 이용할 수 있어요.
          </p>
          <ul className="flex flex-col gap-2">
            {pendingStudents.map((p) => (
              <li key={p.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3">
                <div className="text-sm">
                  <b className="text-zinc-900">{p.name}</b>
                  <span className="ml-2 text-zinc-500">{p.phone}</span>
                  <span className="ml-2 text-xs text-zinc-400">
                    신청: {isPlanId(p.requested_plan) ? PLANS[p.requested_plan].name : "-"} ·{" "}
                    {new Date(p.created_at).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <form action={approveStudent} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="id" value={p.id} />
                    <select
                      name="plan"
                      defaultValue={isPlanId(p.requested_plan) ? p.requested_plan : "bootcamp"}
                      className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                    >
                      {Object.entries(PLANS).map(([id, plan]) => (
                        <option key={id} value={id}>
                          {plan.name} ({plan.months}개월)
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center gap-1 text-xs text-zinc-500">
                      시작일
                      <input
                        type="date"
                        name="start"
                        defaultValue={today}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                      />
                    </label>
                    <button type="submit" className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-bold text-white">
                      승인
                    </button>
                  </form>
                  <form action={rejectStudent}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmButton message={`${p.name} 님의 가입 신청을 거절할까요?`} className="text-xs text-red-600 underline">
                      거절
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={cardClass}>
        <h2 className="mb-3 font-bold text-zinc-900">학생 직접 등록 (코드 발급)</h2>
        <CreateStudentForm />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-bold text-zinc-900">학생 목록 ({students.length})</h2>
        {students.length === 0 && (
          <p className="text-sm text-zinc-500">아직 등록된 학생이 없어요.</p>
        )}
        {students.map((s) => (
          <div
            key={s.id}
            className={`${cardClass} flex flex-col gap-2 ${s.is_active ? "" : "opacity-60"}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link
                  href={`/teacher/students/${s.id}`}
                  className="font-semibold text-zinc-900 underline-offset-2 hover:underline"
                >
                  {s.name}
                </Link>
                {s.nickname && <span className="ml-1 text-xs text-zinc-500">({s.nickname})</span>}
                {isPlanId(s.plan) && (
                  <span
                    className={`ml-2 rounded px-1.5 py-0.5 text-xs ${
                      s.access_until && s.access_until < today ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {PLANS[s.plan].name.replace("다잉클 ", "")}
                    {s.access_until && ` ~${s.access_until.slice(2).replaceAll("-", ".")}`}
                    {s.access_until && s.access_until < today && " 만료"}
                  </span>
                )}
                {levelOf(s.id, "pre") != null && (
                  <span className="ml-2 rounded bg-brand-100 px-1.5 py-0.5 text-xs text-brand-800">
                    Lv.{levelOf(s.id, "pre")}
                    {levelOf(s.id, "post") != null && ` → Lv.${levelOf(s.id, "post")}`}
                  </span>
                )}
                {!s.is_active && (
                  <span className="ml-2 text-xs text-zinc-500">비활성</span>
                )}
                <p className="text-xs text-zinc-500">
                  {[s.phone, s.memo].filter(Boolean).join(" · ") || "-"}
                </p>
                {progress.get(s.id) && (
                  <p className="mt-1 text-xs text-zinc-700">
                    🎬 수강 <b>{progress.get(s.id)!.videoPercent}%</b> ({progress.get(s.id)!.completedVideos}/
                    {progress.get(s.id)!.videoLessons}) · 🎤 쉐도잉 <b>{progress.get(s.id)!.submitPercent}%</b> (
                    {progress.get(s.id)!.submittedSentences}/{progress.get(s.id)!.sentences})
                  </p>
                )}
              </div>
              <form action={setStudentActive}>
                <input type="hidden" name="id" value={s.id} />
                <input type="hidden" name="is_active" value={String(!s.is_active)} />
                <button type="submit" className={secondaryButtonClass}>
                  {s.is_active ? "비활성화" : "활성화"}
                </button>
              </form>
            </div>
            <RegenerateCodeButton id={s.id} name={s.name} />
          </div>
        ))}
      </section>
    </>
  );
}
