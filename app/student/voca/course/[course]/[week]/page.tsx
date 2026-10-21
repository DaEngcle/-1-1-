import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStudent } from "@/lib/classroom/dal";
import { getVocaCourses, getVocaWeek } from "@/lib/classroom/course-voca";
import { WeekGame } from "./week-game";

export default async function CourseWeekVocaPage({ params }: { params: Promise<{ course: string; week: string }> }) {
  const student = await requireStudent();
  const { course, week: raw } = await params;
  const week = Number(raw);
  if (!/^[a-z0-9]+$/.test(course) || !Number.isInteger(week)) notFound();
  const data = await getVocaWeek(student, course, week);
  if (!data || data.sentences.length < 4) notFound();
  const courses = await getVocaCourses(student);
  const weeks = courses.find((c) => c.id === course)?.weeks ?? [];
  const next = weeks.find((w) => w.week > week && w.open);

  return (
    <>
      <Link href="/student/voca/course" className="text-sm text-zinc-600 underline">
        ← 과정별 단어
      </Link>
      <h1 className="text-xl font-extrabold text-zinc-900">
        {data.title} · {week}주차
      </h1>
      <p className="text-sm text-zinc-500">
        수업에서 쉐도잉한 문장 {data.sentences.length}개 중 10문제. 빈칸 채우기 + 듣고 뜻 고르기가 섞여 나와요.
      </p>
      <WeekGame
        deck={`course-${course}-w${week}`}
        sentences={data.sentences}
        nextHref={next ? `/student/voca/course/${course}/${next.week}` : null}
      />
    </>
  );
}
