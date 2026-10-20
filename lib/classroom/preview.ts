/** 맛보기: 열린 과정의 Day 1~3은 수강권이 없어도 볼 수 있다 */
export const PREVIEW_DAYS = 3;

export function isPreviewLesson(l: { kind: string; day_number: number | null }) {
  return l.kind === "day" && l.day_number != null && l.day_number <= PREVIEW_DAYS;
}

/**
 * 레슨을 열 수 있는지.
 * - 열린 과정: 수강권에 있거나, 미리 열어준 과정이거나, 맛보기(Day 1~3)
 * - 준비 중인 과정: 선생님이 미리 열어준 학생만
 */
export function canOpenLesson(
  courses: readonly string[],
  l: { course_id: string; kind: string; day_number: number | null },
  courseStatus: string | null | undefined,
  earlyCourses: readonly string[] = [],
) {
  if (earlyCourses.includes(l.course_id)) return true;
  if (courseStatus !== "open") return false;
  return courses.includes(l.course_id) || isPreviewLesson(l);
}
