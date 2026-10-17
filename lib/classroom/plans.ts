// 수강권 → 볼 수 있는 과정. 서버·브라우저 공용

export const COURSE_IDS = ["bootcamp", "level1", "level2", "level3"] as const;
export type CourseId = (typeof COURSE_IDS)[number];

export const COURSE_SHORT: Record<string, string> = {
  bootcamp: "부트캠프",
  level1: "Level 1.0",
  level2: "Level 2.0",
  level3: "Level 3.0",
};

export const PLANS = {
  bootcamp: { name: "다잉클 부트캠프반", months: 3, courses: ["bootcamp"] as CourseId[] },
  kit12: { name: "다잉클 워홀생존키트", months: 12, courses: ["bootcamp", "level1", "level2", "level3"] as CourseId[] },
  // shortcut: 초급반·중급반(드라마) 과정이 생기면 여기에 추가
  allinone: { name: "다잉클 All in one", months: 18, courses: ["bootcamp", "level1", "level2", "level3"] as CourseId[] },
} as const;
export type PlanId = keyof typeof PLANS;

export function isPlanId(v: unknown): v is PlanId {
  return typeof v === "string" && v in PLANS;
}

export function coursesForPlan(plan: string | null | undefined): CourseId[] {
  return isPlanId(plan) ? PLANS[plan].courses : [];
}

/** 시작일(YYYY-MM-DD)부터 수강권 기간이 끝나는 날 */
export function accessUntil(plan: PlanId, startDay: string) {
  const d = new Date(`${startDay}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + PLANS[plan].months);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}
