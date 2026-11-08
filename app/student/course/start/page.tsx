import type { Metadata } from "next";
import { requireStudent } from "@/lib/classroom/dal";
import { maskName } from "@/lib/classroom/engagement";
import { getTests } from "@/lib/classroom/level-test-data";
import { courseLevelFromTest } from "@/lib/classroom/course-questions";
import { courseAccess, getCourseRow } from "@/lib/classroom/course-data";
import { Onboarding } from "./onboarding";
import { catStage } from "@/lib/classroom/cat-stage-data";

export const metadata: Metadata = { title: "내 워홀 코스 만들기 · 다잉클" };

export default async function CourseStartPage() {
  const student = await requireStudent();
  const [tests, row, cat] = await Promise.all([getTests(student.id), getCourseRow(student.id), catStage(student.id)]);
  // 수강 후 테스트가 있으면 그게 더 최근 실력
  const test = [tests.post, tests.pre].find((t) => t?.finished_at && t.level);
  const access = courseAccess(student);
  return (
    <Onboarding
      breed={student.catBreed ?? "cheese"}
      name={student.nickname ?? maskName(student.name)}
      initial={row?.answers ?? null}
      testLevel={courseLevelFromTest(test?.level)}
      access={{ fullVoca: access.fullVoca, freePhraseSets: access.freePhraseSets }}
      stage={cat.stage}
    />
  );
}
