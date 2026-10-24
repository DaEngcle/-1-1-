import Link from "next/link";
import { requireStudent } from "@/lib/classroom/dal";
import { getLessonProgress, type LessonProgressRow } from "@/lib/classroom/progress";
import { SubmissionList } from "@/app/teacher/submission-list";
import { cardClass } from "@/app/_ui/styles";
import { weekShadowingCount, WEEKLY_SHADOWING_GOAL } from "@/lib/classroom/engagement";

export default async function StudentShadowingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const student = await requireStudent();
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const [rows, weekCount] = await Promise.all([getLessonProgress(student.id), weekShadowingCount(student.id)]);
  const todo = rows.filter((r) => r.sentences > 0 && r.submitted < r.sentences);
  const totalSubmitted = rows.reduce((a, r) => a + r.submitted, 0);
  // 다음에 할 것만 먼저 보여주고 나머지는 접어 둔다 (60개 넘게 줄줄이 나오면 막막해서)
  const NEXT = 3;

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-zinc-900">🎤 내 쉐도잉</h1>
        <p className="text-sm text-zinc-600">
          이번 주 <b>{weekCount}개</b> / 목표 {WEEKLY_SHADOWING_GOAL}개 · 지금까지 총 {totalSubmitted}개 제출했어요.
        </p>
      </div>

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">다음에 할 쉐도잉</h2>
        {todo.length === 0 ? (
          <p className="text-sm text-green-700">🎉 공개된 쉐도잉을 모두 제출했어요!</p>
        ) : (
          <>
            <TodoList rows={todo.slice(0, NEXT)} />
            {todo.length > NEXT && (
              <details className="mt-1">
                <summary className="cursor-pointer py-2 text-sm font-semibold text-brand-700">
                  나머지 {todo.length - NEXT}개 보기
                </summary>
                <TodoList rows={todo.slice(NEXT)} />
              </details>
            )}
          </>
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

function TodoList({ rows }: { rows: LessonProgressRow[] }) {
  return (
    <ul className="flex flex-col divide-y divide-zinc-100">
      {rows.map(({ lesson, sentences, submitted }) => (
        <li key={lesson.id}>
          <Link
            href={`/student/lessons/${lesson.id}`}
            className="flex items-center justify-between gap-3 py-2.5 hover:bg-brand-50"
          >
            <span className="flex flex-col">
              <span className="text-xs text-zinc-500">
                Week {lesson.week_number} ·{" "}
                {lesson.kind === "day" ? `Day ${String(lesson.day_number).padStart(2, "0")}` : "Drill"}
              </span>
              <span className="text-sm font-medium text-zinc-900">{lesson.title}</span>
            </span>
            <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
              {sentences - submitted}개 남음 →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
