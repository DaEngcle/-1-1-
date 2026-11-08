import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireStudent } from "@/lib/classroom/dal";
import { maskName } from "@/lib/classroom/engagement";
import { FREE_NEW_PER_DAY, courseAccess, getCourseRow, getPracticeQueue } from "@/lib/classroom/course-data";
import { Drill } from "./drill";

export const metadata: Metadata = { title: "오늘의 연습 · 다잉클" };

export default async function CoursePracticePage() {
  const student = await requireStudent();
  const row = await getCourseRow(student.id);
  if (!row?.answers) redirect("/student/course/start");
  const access = courseAccess(student);
  const queue = await getPracticeQueue(student.id, row, access);
  return (
    <Drill
      breed={student.catBreed ?? "cheese"}
      name={student.nickname ?? maskName(student.name)}
      freeLimit={access.fullVoca ? null : FREE_NEW_PER_DAY}
      items={queue.items.map((p) => ({ key: p.key, term: p.term, ko: p.ko, example: p.example, example_ko: p.example_ko, note: p.note, kind: p.kind, topic: p.topic }))}
    />
  );
}
