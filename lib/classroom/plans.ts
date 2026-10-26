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
  // 예전에 판매한 6개월반 (부트캠프 + Level 1.0). 새로 팔지 않아서 업그레이드 안내에는 안 나온다
  combo6: { name: "다잉클 부트캠프 + 1.0반", months: 6, courses: ["bootcamp", "level1"] as CourseId[], legacy: true },
  // 2.0까지 듣는 기존 학생용 (기간은 승인 후 종료일로 조정)
  combo12: {
    name: "다잉클 부트캠프 + 1.0 + 2.0반",
    months: 12,
    courses: ["bootcamp", "level1", "level2"] as CourseId[],
    legacy: true,
  },
  // 무료 체험 (웨비나·이벤트로 1달 열어주는 학생). 끝나면 잠기지 않고 무료회원으로 내려간다
  trial1: { name: "다잉클 무료 체험", months: 1, courses: ["bootcamp"] as CourseId[], legacy: true, trial: true },
  kit12: { name: "다잉클 워홀생존키트", months: 12, courses: ["bootcamp", "level1", "level2", "level3"] as CourseId[] },
  // shortcut: 초급반·중급반(드라마) 과정이 생기면 여기에 추가
  allinone: { name: "다잉클 All in one", months: 18, courses: ["bootcamp", "level1", "level2", "level3"] as CourseId[] },
  // 선생님이 과정을 직접 골라 준 학생 (예: 1.0반만). 실제 과정은 students.courses에 있다
  custom: { name: "다잉클 맞춤 수강", months: 3, courses: [] as CourseId[], legacy: true },
} as const;
export type PlanId = keyof typeof PLANS;

export function isPlanId(v: unknown): v is PlanId {
  return typeof v === "string" && v in PLANS;
}

/** 이 과정을 볼 수 있는, 지금 판매 중인 수강권 (잠긴 과정 안내용) */
export function upgradePlanFor(courseId: string) {
  return Object.values(PLANS).find((p) => !("legacy" in p) && (p.courses as readonly string[]).includes(courseId));
}

/** 무료 체험 수강권인지 */
export function isTrialPlan(plan: string | null | undefined) {
  return isPlanId(plan) && "trial" in PLANS[plan];
}

export function coursesForPlan(plan: string | null | undefined): CourseId[] {
  return isPlanId(plan) ? PLANS[plan].courses : [];
}

function onlyCourseIds(courses: readonly unknown[]): CourseId[] {
  return COURSE_IDS.filter((c) => courses.includes(c));
}

/** 학생이 볼 수 있는 과정: 맞춤 수강이면 직접 고른 과정, 아니면 수강권 기본 과정 */
export function studentCourses(plan: string | null | undefined, courses: readonly unknown[] | null | undefined): CourseId[] {
  if (plan === "custom") return onlyCourseIds(courses ?? []);
  return coursesForPlan(plan);
}

/** 화면에 보일 수강권 이름 (맞춤 수강은 고른 과정으로 예: "Level 1.0반") */
export function planName(plan: string | null | undefined, courses?: readonly unknown[] | null): string {
  if (!isPlanId(plan)) return "";
  if (plan === "custom") {
    const list = onlyCourseIds(courses ?? []);
    return list.length ? `다잉클 ${list.map((c) => COURSE_SHORT[c].replace("Level ", "")).join(" + ")}반` : PLANS.custom.name;
  }
  return PLANS[plan].name;
}

/** 고른 과정과 똑같은 수강권이 있으면 그 수강권(지금 수강권이 맞으면 그대로), 없으면 custom */
export function planForCourses(courses: CourseId[], current?: string | null): PlanId {
  const key = (list: readonly string[]) => [...list].sort().join(",");
  const want = key(courses);
  if (isPlanId(current) && current !== "custom" && current !== "trial1" && key(PLANS[current].courses) === want) return current;
  const hit = (Object.keys(PLANS) as PlanId[]).find(
    (id) => id !== "custom" && id !== "trial1" && key(PLANS[id].courses) === want,
  );
  return hit ?? "custom";
}

/** 시작일(YYYY-MM-DD)부터 수강권 기간이 끝나는 날 */
export function accessUntil(plan: PlanId, startDay: string) {
  const d = new Date(`${startDay}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + PLANS[plan].months);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}
