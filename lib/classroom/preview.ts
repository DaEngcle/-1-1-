/** 맛보기: 열린 과정의 Day 1~3은 수강권이 없어도 볼 수 있다 */
export const PREVIEW_DAYS = 3;

export function isPreviewLesson(l: { kind: string; day_number: number | null }) {
  return l.kind === "day" && l.day_number != null && l.day_number <= PREVIEW_DAYS;
}

/** 수강권에 있는 과정이거나, 열린 과정의 맛보기 레슨이면 true */
export function canOpenLesson(
  courses: readonly string[],
  l: { course_id: string; kind: string; day_number: number | null },
  courseStatus: string | null | undefined,
) {
  return courses.includes(l.course_id) || (courseStatus === "open" && isPreviewLesson(l));
}
