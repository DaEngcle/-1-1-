import Link from "next/link";
import { requireStudent } from "@/lib/classroom/dal";
import { getLessonProgress } from "@/lib/classroom/progress";
import { SubmissionList } from "@/app/teacher/submission-list";
import { cardClass } from "@/app/_ui/styles";

export default async function StudentShadowingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const student = await requireStudent();
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const rows = await getLessonProgress(student.id);
  const todo = rows.filter((r) => r.sentences > 0 && r.submitted < r.sentences);
  const totalSentences = rows.reduce((a, r) => a + r.sentences, 0);
  const totalSubmitted = rows.reduce((a, r) => a + r.submitted, 0);

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-zinc-900">🎤 내 쉐도잉</h1>
        <p className="text-sm text-zinc-600">
          공개된 문장 {totalSentences}개 중 <b>{totalSubmitted}개</b> 제출했어요.
        </p>
      </div>

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">아직 안 낸 쉐도잉</h2>
        {todo.length === 0 ? (
          <p className="text-sm text-green-700">🎉 공개된 쉐도잉을 모두 제출했어요!</p>
        ) : (
          <ul className="flex flex-col divide-y divide-zinc-100">
            {todo.map(({ lesson, sentences, submitted }) => (
              <li key={lesson.id}>
                <Link
                  href={`/student/lessons/${lesson.id}`}
                  className="flex items-center justify-between gap-3 py-2.5 hover:bg-yellow-50"
                >
                  <span className="flex flex-col">
                    <span className="text-xs text-zinc-500">
                      Week {lesson.week_number} ·{" "}
                      {lesson.kind === "day" ? `Day ${String(lesson.day_number).padStart(2, "0")}` : "Drill"}
                    </span>
                    <span className="text-sm font-medium text-zinc-900">{lesson.title}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                    {sentences - submitted}개 남음 →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-bold text-zinc-900">내가 낸 쉐도잉</h2>
        <SubmissionList
          studentId={student.id}
          limit={20}
          page={page}
          pageHref={(p) => (p > 1 ? `/student/shadowing?page=${p}` : "/student/shadowing")}
          lessonHref={(id) => `/student/lessons/${id}`}
        />
      </section>
    </>
  );
}
