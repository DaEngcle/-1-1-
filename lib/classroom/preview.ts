/** 맛보기: 열린 과정의 Day 1~3은 수강권이 없어도 볼 수 있다 */
export const PREVIEW_DAYS = 3;

export function isPreviewLesson(l: { kind: string; day_number: number | null }) {
  return l.kind === "day" && l.day_number != null && l.day_number <= PREVIEW_DAYS;
}

/** 열린 과정이면서, 수강권에 있는 과정이거나 맛보기 레슨이면 true */
export function canOpenLesson(
  courses: readonly string[],
  l: { course_id: string; kind: string; day_number: number | null },
  courseStatus: string | null | undefined,
) {
  // 준비 중인 과정은 수강생도 레슨 안으로는 못 들어간다 (목차만)
  if (courseStatus !== "open") return false;
  return courses.includes(l.course_id) || isPreviewLesson(l);
}
