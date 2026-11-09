// 내 워홀 코스: 1분 질문의 보기와 답 모양. 서버·브라우저 공용 (가벼운 파일이라 화면에서 바로 쓴다)

export const CITIES = [
  { id: "melbourne", label: "멜버른", emoji: "☕" },
  { id: "sydney", label: "시드니", emoji: "🌉" },
  { id: "brisbane", label: "브리즈번", emoji: "🌞" },
  { id: "perth", label: "퍼스", emoji: "🏖️" },
  { id: "adelaide", label: "애들레이드", emoji: "🍇" },
  { id: "unknown", label: "아직 몰라요", emoji: "🤔" },
] as const;

export const STAGES = [
  { id: "before", label: "출국 전", desc: "가기 전에 준비하는 중이에요", emoji: "🧳" },
  { id: "arrived", label: "도착한 지 한 달 안", desc: "막 도착해서 정착하는 중이에요", emoji: "🛬" },
  { id: "jobhunt", label: "일 구하는 중", desc: "이력서 돌리고 면접 보는 중이에요", emoji: "📄" },
  { id: "working", label: "일하는 중", desc: "벌써 일하고 있어요", emoji: "💪" },
] as const;

export const JOBS = [
  { id: "cafe", label: "카페·바리스타", emoji: "☕" },
  { id: "kitchen", label: "주방·키친핸드", emoji: "🍳" },
  { id: "serving", label: "서빙·홀", emoji: "🍽️" },
  { id: "takeaway", label: "테이크어웨이·치킨집", emoji: "🍗" },
  { id: "bakery", label: "베이커리", emoji: "🥐" },
  { id: "housekeeping", label: "하우스키핑", emoji: "🛏️" },
  { id: "cleaning", label: "청소 (사무실·상가)", emoji: "🧽" },
  { id: "hotel", label: "호텔 프런트", emoji: "🛎️" },
  { id: "resort", label: "리조트", emoji: "🏝️" },
  { id: "farm", label: "농장", emoji: "🍓" },
  { id: "factory", label: "공장·육가공", emoji: "🏭" },
  { id: "construction", label: "건설·노무", emoji: "🦺" },
  { id: "trades", label: "타일·목수", emoji: "🔨" },
  { id: "retail", label: "리테일·마트", emoji: "🛒" },
  { id: "fashion", label: "옷가게·패션", emoji: "👗" },
  { id: "servo", label: "주유소·편의점", emoji: "⛽" },
  { id: "salon", label: "미용실", emoji: "💇" },
  { id: "care", label: "요양·간호 보조", emoji: "🩺" },
  { id: "childcare", label: "아이 돌보기", emoji: "🧸" },
  { id: "animal", label: "동물병원·동물 돌보기", emoji: "🐶" },
  { id: "fitness", label: "피트니스·코치", emoji: "🏋️" },
  { id: "office", label: "사무·전화", emoji: "💼" },
  { id: "other", label: "기타", emoji: "✨" },
] as const;

export const COURSE_LEVELS = [
  { id: 1, label: "레벨 1 · 왕초보", desc: "단어 몇 개로 겨우 말해요" },
  { id: 2, label: "레벨 2 · 기초", desc: "짧은 문장은 따라 말할 수 있어요" },
  { id: 3, label: "레벨 3 · 초중급", desc: "자주 쓰는 말은 알아듣고 대답해요" },
  { id: 4, label: "레벨 4 · 중급", desc: "일상 대화는 크게 막히지 않아요" },
  { id: 5, label: "레벨 5 · 중상급", desc: "길게 말해도 뜻은 다 통해요" },
] as const;

export const WORRIES = [
  { id: "interview", label: "면접", emoji: "🤝" },
  { id: "customer", label: "손님 응대", emoji: "🙋" },
  { id: "housing", label: "집 구하기", emoji: "🏠" },
  { id: "admin", label: "은행·폰·TFN", emoji: "🏦" },
  { id: "medical", label: "병원·약국", emoji: "💊" },
  { id: "friends", label: "친구 사귀기", emoji: "🍻" },
  { id: "phone", label: "전화 영어", emoji: "📞" },
] as const;

/** 직군 고르기 화면의 묶음 (소제목). 보기 id는 JOBS와 같다 */
export const JOB_GROUPS: { title: string; jobs: JobId[] }[] = [
  { title: "카페·음식", jobs: ["cafe", "kitchen", "serving", "takeaway", "bakery"] },
  { title: "호텔·청소", jobs: ["hotel", "resort", "housekeeping", "cleaning"] },
  { title: "케어", jobs: ["care", "childcare", "animal"] },
  { title: "뷰티", jobs: ["salon"] },
  { title: "리테일", jobs: ["retail", "fashion", "servo"] },
  { title: "현장·기술", jobs: ["construction", "trades"] },
  { title: "농장·공장", jobs: ["farm", "factory"] },
  { title: "사무·기타", jobs: ["office", "fitness", "other"] },
];
/** '직접 적기' 글자 수 */
export const JOB_OTHER_MAX = 30;

export const GOALS = [
  { id: "english", label: "영어 실력", emoji: "🗣️" },
  { id: "money", label: "돈 모으기", emoji: "💰" },
  { id: "friends", label: "친구·사람", emoji: "🤝" },
  { id: "travel", label: "여행·경험", emoji: "🗺️" },
  { id: "career", label: "커리어·이민", emoji: "🎓" },
] as const;

export const MINUTES = [
  { id: 5, label: "5분", desc: "출퇴근길에 가볍게" },
  { id: 10, label: "10분", desc: "하루 한 번 집중해서" },
  { id: 20, label: "20분", desc: "제대로 해 보고 싶어요" },
] as const;

export type CityId = (typeof CITIES)[number]["id"];
export type StageId = (typeof STAGES)[number]["id"];
export type JobId = (typeof JOBS)[number]["id"];
export type WorryId = (typeof WORRIES)[number]["id"];
export type CourseLevel = (typeof COURSE_LEVELS)[number]["id"];
export type DailyMinutes = (typeof MINUTES)[number]["id"];
export type GoalId = (typeof GOALS)[number]["id"];

export type CourseAnswers = {
  /** 호주 가는(이미 갔으면 도착한) 달 "YYYY-MM". 예전에 만든 코스에는 없다 */
  startMonth?: string;
  cities: CityId[];
  stage: StageId;
  jobs: JobId[];
  /** 보기에 없는 일 (직접 적기, AI에게만 참고로 준다) */
  jobOther?: string;
  level: CourseLevel;
  goals: GoalId[];
  worries: WorryId[];
  minutes: DailyMinutes;
};

const ids = <T extends { id: string | number }>(list: readonly T[]) => new Set(list.map((x) => x.id));
const CITY_IDS = ids(CITIES);
const STAGE_IDS = ids(STAGES);
const JOB_IDS = ids(JOBS);
const WORRY_IDS = ids(WORRIES);
const LEVEL_IDS = ids(COURSE_LEVELS);
const MINUTE_IDS = ids(MINUTES);
const GOAL_IDS = ids(GOALS);
const MONTH_RE = /^20\d\d-(0[1-9]|1[0-2])$/;

/** 저장된(또는 화면에서 보낸) 답을 믿을 수 있는 모양으로. 이상하면 null */
export function parseCourseAnswers(raw: unknown): CourseAnswers | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const list = <T>(v: unknown, ok: Set<string | number>) =>
    Array.isArray(v) ? ([...new Set(v)].filter((x) => ok.has(x as string)) as T[]) : [];
  if (!STAGE_IDS.has(r.stage as string) || !LEVEL_IDS.has(r.level as number) || !MINUTE_IDS.has(r.minutes as number)) return null;
  const jobOther = typeof r.jobOther === "string" ? cleanJobOther(r.jobOther) : "";
  return {
    ...(typeof r.startMonth === "string" && MONTH_RE.test(r.startMonth) ? { startMonth: r.startMonth } : {}),
    cities: list<CityId>(r.cities, CITY_IDS),
    stage: r.stage as StageId,
    jobs: list<JobId>(r.jobs, JOB_IDS),
    ...(jobOther ? { jobOther } : {}),
    level: r.level as CourseLevel,
    goals: list<GoalId>(r.goals, GOAL_IDS),
    worries: list<WorryId>(r.worries, WORRY_IDS),
    minutes: r.minutes as DailyMinutes,
  };
}

/** 직접 적은 일: 줄바꿈·꺾쇠 빼고 30자까지 */
export function cleanJobOther(v: string) {
  return v.replace(/[<>\n\r\t]/g, " ").replace(/\s+/g, " ").trim().slice(0, JOB_OTHER_MAX);
}

/** 한국 시간 오늘 "YYYY-MM-DD" */
export function kstToday(now = new Date()) {
  return now.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}

/** 이번 달에서 startMonth까지 몇 달 (지났으면 음수) */
export function monthsUntil(startMonth: string, now = new Date()) {
  const [y, m] = kstToday(now).split("-").map(Number);
  const [sy, sm] = startMonth.split("-").map(Number);
  return (sy - y) * 12 + (sm - m);
}

/**
 * 출국 달로 단계 정하기: 앞으로 갈 달이면 출국 전, 이번 달이면 도착 한 달 안.
 * 지난 달이면 null (이미 호주에 있으니 단계 질문으로 직접 고른다)
 */
export function stageFromMonth(startMonth: string, now = new Date()): StageId | null {
  const diff = monthsUntil(startMonth, now);
  if (diff > 0) return "before";
  if (diff === 0) return "arrived";
  return null;
}

/** 저장된 단계를 오늘 날짜로 맞춘다 (출국 전으로 골랐는데 출국 달이 지났으면 도착 한 달 안으로) */
export function withCurrentStage(a: CourseAnswers, now = new Date()): CourseAnswers {
  if (!a.startMonth) return a;
  const auto = stageFromMonth(a.startMonth, now);
  const stage = auto ?? (a.stage === "before" ? "arrived" : a.stage);
  return stage === a.stage ? a : { ...a, stage };
}

/** 코스 화면 머리말: "2027년 3월 출국 · D-113" 또는 "호주 생활 N일째" */
export function departureLabel(startMonth: string, now = new Date()) {
  const [sy, sm] = startMonth.split("-").map(Number);
  const start = Date.UTC(sy, sm - 1, 1);
  const today = Date.parse(`${kstToday(now)}T00:00:00Z`);
  const days = Math.round((start - today) / 86400000);
  if (days > 0) return `${sy}년 ${sm}월 출국 · D-${days}`;
  return `호주 생활 ${-days + 1}일째`;
}

/** 앱 레벨테스트 레벨(1~6) → 코스 레벨(1~5) */
export function courseLevelFromTest(level: number | null | undefined): CourseLevel | null {
  if (!level || level < 1) return null;
  return Math.min(5, Math.round(level)) as CourseLevel;
}
