// 앱 멤버십 (월 정기결제). 강의 영상은 포함하지 않는다. 서버·브라우저 공용

export const MEMBERSHIP = {
  plan: "app" as const,
  name: "다잉클 앱 멤버십",
  /** 월 결제 금액(원). 다니엘이 가격을 정하면 바꾼다 */
  price: 14900,
  /** false면 구독 화면이 '준비 중'으로 나온다 (선생님은 미리보기 가능) */
  onSale: false,
  /** 결제가 실패했을 때 다시 시도하는 날 수 (그동안은 계속 이용 가능) */
  graceDays: 3,
  perks: [
    ["🎤", "AI 면접 연습", "하루 3번, 꼬리 질문과 모범 답안"],
    ["🎭", "상황극 롤플레이", "카페·숙소·일터 상황 무제한"],
    ["📚", "보카·동사 세트 전체", "워홀 필수 표현 전부 열림"],
    ["📰", "뉴스로 배우는 영어", "매일 새 기사"],
    ["📊", "레벨테스트·리그", "실력 변화와 랭킹"],
    ["🐱", "고양이 집 꾸미기", "공부하면 츄르가 쌓여요"],
  ] as const,
};

/** AI를 쓰는 기능의 하루 한도 (비용 관리). 수강생 = 웨비나 과정 수강생 */
export const AI_LIMITS = {
  /** 쉐도잉 녹음 뒤 한국어 AI 코칭 문장. 넘으면 점수만 나온다 */
  coachPerDay: { course: 60, member: 30, free: 10 },
};

export function isMembershipPlan(plan: string | null | undefined) {
  return plan === MEMBERSHIP.plan;
}

/** YYYY-MM-DD에 일수를 더한다 */
export function addDays(day: string, n: number) {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** 한 달 뒤 같은 날 (말일이 없으면 그 달 마지막 날) */
function addOneMonth(day: string) {
  const [y, m, dd] = day.split("-").map(Number);
  const target = new Date(Date.UTC(y, m, 1)); // 다음 달 1일
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(dd, last));
  return target.toISOString().slice(0, 10);
}

/** 이용 시작일 → 이 결제로 이용할 수 있는 마지막 날 */
export function periodEndFrom(startDay: string) {
  return addDays(addOneMonth(startDay), -1);
}

/** "2026-12-26" → "12월 26일" */
export function koDay(day: string) {
  const [, m, d] = day.split("-").map(Number);
  return `${m}월 ${d}일`;
}
