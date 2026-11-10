import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStudent } from "@/lib/classroom/dal";
import { getVocaCourses, getVocaWeek } from "@/lib/classroom/course-voca";
import { lessonSentenceItems } from "@/lib/classroom/lesson-sentences";
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
        ← 과정별 문장
      </Link>
      <h1 className="text-xl font-extrabold text-zinc-900">
        {data.title} · {week}주차
      </h1>
      <p className="text-sm text-zinc-500">
        수업에서 쉐도잉한 문장 {data.sentences.length}개 중 10개를 문장째로 연습해요. 듣기 → 순서 맞추기 → 빈칸 → 보고 말하기 순서예요.
      </p>
      <WeekGame
        deck={`course-${course}-w${week}`}
        sentences={data.sentences}
        items={lessonSentenceItems(data.sentences)}
        nextHref={next ? `/student/voca/course/${course}/${next.week}` : null}
      />
    </>
  );
}
