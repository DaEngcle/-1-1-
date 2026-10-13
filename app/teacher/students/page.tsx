import Link from "next/link";
import { createServerSupabaseClient, type Student } from "@/lib/supabase";
import { setStudentActive } from "./actions";
import { CreateStudentForm, RegenerateCodeButton } from "./student-forms";
import { cardClass, secondaryButtonClass } from "@/app/_ui/styles";

export default async function StudentsPage() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("students")
    .select("id, name, phone, memo, is_active, created_at")
    .order("is_active", { ascending: false })
    .order("name");
  const students = (data ?? []) as Omit<Student, "login_code_hash">[];

  return (
    <>
      <section className={cardClass}>
        <h2 className="mb-3 font-bold text-zinc-900">학생 등록</h2>
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
                {!s.is_active && (
                  <span className="ml-2 text-xs text-zinc-500">비활성</span>
                )}
                <p className="text-xs text-zinc-500">
                  {[s.phone, s.memo].filter(Boolean).join(" · ") || "-"}
                </p>
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
