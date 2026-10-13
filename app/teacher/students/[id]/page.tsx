import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getStudentStats } from "@/lib/classroom/stats";
import { ATTENDANCE_LABEL } from "@/lib/classroom/attendance";
import { ScoreTrendChart } from "@/app/_ui/score-trend-chart";
import { SubmissionList } from "../../submission-list";
import { cardClass } from "@/app/_ui/styles";

export default async function TeacherStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();
  const { data: student } = await supabase
    .from("students")
    .select("id, name, phone, memo, is_active, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!student) notFound();
  const stats = await getStudentStats(id);
  const totalClasses = Object.values(stats.attendance).reduce((a, b) => a + b, 0);

  return (
    <>
      <div>
        <Link href="/teacher/students" className="text-xs text-zinc-500">
          ← 학생 목록
        </Link>
        <h1 className="text-xl font-bold text-zinc-900">{student.name}</h1>
        <p className="text-xs text-zinc-500">{[student.phone, student.memo].filter(Boolean).join(" · ")}</p>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["연속 학습", `${stats.streakDays}일`],
          ["평균 점수", stats.averageScore != null ? `${stats.averageScore}점` : "-"],
          ["연습 문장", `${stats.practicedSentences}개`],
          [
            "출결",
            totalClasses
              ? (Object.keys(ATTENDANCE_LABEL) as (keyof typeof ATTENDANCE_LABEL)[])
                  .filter((k) => stats.attendance[k] > 0)
                  .map((k) => `${ATTENDANCE_LABEL[k].label}${stats.attendance[k]}`)
                  .join(" ")
              : "-",
          ],
        ].map(([label, value]) => (
          <div key={label} className={`${cardClass} flex flex-col gap-1`}>
            <span className="text-xs text-zinc-500">{label}</span>
            <span className="text-lg font-bold text-zinc-900">{value}</span>
          </div>
        ))}
      </section>

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">최근 30일 평균 발음 점수</h2>
        <ScoreTrendChart data={stats.dailyScores} />
      </section>

      {stats.weakWords.length > 0 && (
        <section className={cardClass}>
          <h2 className="mb-2 font-bold text-zinc-900">자주 틀리는 단어</h2>
          <p className="text-sm text-zinc-700">
            {stats.weakWords.map((w) => `${w.word} (${w.count}회, 평균 ${w.avg}점)`).join(" · ")}
          </p>
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="font-bold text-zinc-900">제출 기록</h2>
        <SubmissionList studentId={id} limit={50} />
      </section>
    </>
  );
}
