// 내 워홀 코스 토픽: 이미 있는 보카 세트(덱:세트)를 상황별로 묶은 것. 서버·브라우저 공용.
// AI는 이 목록 안에서만 고를 수 있다 (새 표현을 만들지 않는다).

import { phraseDeck, type Phrase } from "./phrase-decks";
import type { CourseAnswers } from "./course-questions";

export type CourseTopicDef = {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  /** [덱, 세트] */
  sets: [string, number][];
};

export const COURSE_TOPICS: CourseTopicDef[] = [
  // 직군 (jobs 덱 + 일터 공통 손님 응대 12를 묶는다)
  { id: "cafe", emoji: "☕", title: "카페에서 주문 받고 커피 설명하기", desc: "플랫화이트·샷 추가·테이크어웨이처럼 카운터에서 매일 오가는 말", sets: [["jobs", 1], ["survival", 1], ["jobs", 12]] },
  { id: "kitchen", emoji: "🍳", title: "주방에서 지시 알아듣고 대답하기", desc: "헤드셰프가 바쁘게 던지는 말과 조리 용어", sets: [["kitchen", 6], ["kitchen", 5]] },
  { id: "ingredients", emoji: "🥩", title: "식재료·고기 부위 이름 익히기", desc: "호주와 미국에서 이름이 다른 재료까지", sets: [["kitchen", 1], ["kitchen", 2], ["kitchen", 3]] },
  { id: "serving", emoji: "🍽️", title: "홀에서 주문 받고 테이블 챙기기", desc: "자리 안내·주문·계산까지 서빙에서 쓰는 말", sets: [["jobs", 7], ["jobs", 12]] },
  { id: "takeaway", emoji: "🍗", title: "테이크어웨이 카운터에서 주문 받기", desc: "메뉴 설명·포장·대기 시간 안내", sets: [["jobs", 18]] },
  { id: "bakery", emoji: "🥐", title: "베이커리에서 빵 고르는 손님 돕기", desc: "진열·포장·재료 묻는 손님에게 답하는 말", sets: [["jobs", 13], ["jobs", 12]] },
  { id: "housekeeping", emoji: "🛏️", title: "객실 청소하며 손님·매니저와 말하기", desc: "체크아웃·린넨·청소 요청을 주고받는 말", sets: [["jobs", 2]] },
  { id: "cleaning", emoji: "🧽", title: "사무실·상가 청소 일 지시 알아듣기", desc: "청소 구역·도구·시간을 확인하는 말", sets: [["jobs", 8]] },
  { id: "hotel", emoji: "🛎️", title: "호텔 프런트에서 체크인 돕기", desc: "예약 확인·방 안내·요청 처리", sets: [["jobs", 10], ["jobs", 12]] },
  { id: "resort", emoji: "🏝️", title: "리조트 화상 면접 보고 일 시작하기", desc: "화상 면접 첫마디·숙소·근무 기간·하우스키핑과 프런트 표현", sets: [["jobs", 23], ["jobs", 2], ["jobs", 10]] },
  { id: "farm", emoji: "🍓", title: "농장에서 작업 지시 알아듣기", desc: "피킹·패킹·작업 속도에 자주 듣는 말", sets: [["jobs", 3], ["survival", 7]] },
  { id: "factory", emoji: "🏭", title: "공장·육가공 라인에서 일하기", desc: "안전 수칙·라인 작업·교대에 쓰는 말", sets: [["jobs", 6]] },
  { id: "construction", emoji: "🦺", title: "건설 현장에서 지시 받고 안전 지키기", desc: "도구·자재·안전 관련 현장 영어", sets: [["jobs", 9]] },
  { id: "trades", emoji: "🔨", title: "타일·목수 일에서 쓰는 기술 영어", desc: "치수·자재·작업 순서를 말하는 법", sets: [["jobs", 15]] },
  { id: "retail", emoji: "🛒", title: "매장에서 손님에게 물건 안내하기", desc: "찾는 물건·계산·환불을 처리하는 말", sets: [["jobs", 4], ["jobs", 12]] },
  { id: "fashion", emoji: "👗", title: "옷가게에서 사이즈 찾아 주기", desc: "피팅룸·사이즈·교환을 안내하는 말", sets: [["jobs", 14], ["jobs", 12]] },
  { id: "servo", emoji: "⛽", title: "주유소·편의점 계산대 지키기", desc: "주유 번호·계산·담배·복권 손님 응대", sets: [["jobs", 19]] },
  { id: "salon", emoji: "💇", title: "미용실에서 원하는 스타일 묻기", desc: "기장·스타일·예약을 확인하는 말", sets: [["jobs", 17]] },
  { id: "care", emoji: "🩺", title: "요양·간호 보조로 어르신 돕기", desc: "몸 상태 묻기와 돌봄에서 쓰는 말", sets: [["jobs", 16]] },
  { id: "childcare", emoji: "🧸", title: "아이 돌보며 부모와 이야기하기", desc: "내니·차일드케어에서 쓰는 말", sets: [["jobs", 22]] },
  { id: "animal", emoji: "🐶", title: "동물병원·동물 돌보는 일 영어", desc: "산책·먹이·보호자 안내", sets: [["jobs", 20]] },
  { id: "fitness", emoji: "🏋️", title: "피트니스에서 회원 안내하고 코칭하기", desc: "운동 동작 설명과 회원 응대", sets: [["jobs", 21]] },
  { id: "phone", emoji: "📞", title: "전화 받고 메시지 전하기", desc: "전화 영어와 사무실에서 쓰는 기본 표현", sets: [["jobs", 5], ["phrasal", 6]] },
  // 일터 공통 (일하는 학생은 모두 넣는다)
  { id: "shift", emoji: "🗓️", title: "근무 시간·급여 이야기하기", desc: "로스터·시프트 바꾸기·페이슬립 확인", sets: [["jobs", 11], ["phrasal", 7]] },
  { id: "customer", emoji: "🙋", title: "어떤 일터든 손님 응대하기", desc: "인사·요청 받기·사과·마무리 한마디", sets: [["jobs", 12]] },
  // 생활
  { id: "interview", emoji: "🤝", title: "면접에서 내 경험 말하기", desc: "경력·가능한 요일·비자를 묻고 답하는 말", sets: [["survival", 2]] },
  { id: "housing", emoji: "🏠", title: "쉐어하우스 보러 가서 질문하기", desc: "렌트비·본드·빌 포함인지 확인하는 말", sets: [["survival", 3], ["phrasal", 9]] },
  { id: "admin", emoji: "🏦", title: "은행 계좌·TFN·폰 개통하기", desc: "도착 첫 주에 창구에서 쓰는 말", sets: [["survival", 4], ["phrasal", 10]] },
  { id: "medical", emoji: "💊", title: "병원·약국에서 아픈 곳 설명하기", desc: "증상 말하기와 약 받을 때 쓰는 말", sets: [["survival", 5]] },
  { id: "transport", emoji: "🚌", title: "대중교통 타고 길 묻기", desc: "교통카드·환승·길 묻기", sets: [["survival", 6], ["phrasal", 5]] },
  { id: "friends", emoji: "🍻", title: "처음 만난 사람과 가볍게 수다 떨기", desc: "인사·맞장구·약속 잡을 때 쓰는 말", sets: [["slang", 1], ["phrasal", 3]] },
  { id: "everyday", emoji: "🔗", title: "원어민이 매일 쓰는 구동사", desc: "pick up, figure out처럼 교과서엔 잘 없는 말", sets: [["phrasal", 1], ["phrasal", 2]] },
  { id: "aussie", emoji: "🦘", title: "호주 사람 말투 알아듣기", desc: "줄임말과 일터에서 듣는 슬랭", sets: [["slang", 2], ["slang", 6]] },
];

export function courseTopic(id: string) {
  return COURSE_TOPICS.find((t) => t.id === id) ?? null;
}

export type TopicPhrase = Phrase & { key: string };

/** 토픽에 들어 있는 표현 (잠긴 세트는 뺀다). key = 덱:세트:번호 */
export function topicPhrases(t: CourseTopicDef, access: { fullVoca: boolean; freePhraseSets: number }): TopicPhrase[] {
  return t.sets.flatMap(([d, s]) => {
    if (!access.fullVoca && d !== "jobs" && s > access.freePhraseSets) return [];
    const set = phraseDeck(d)?.sets.find((x) => x.id === s);
    return set ? set.items.map((p, i) => ({ ...p, key: `${d}:${s}:${i}` })) : [];
  });
}

/** 덱:세트:번호 → 표현 */
export function phraseByKey(key: string): Phrase | null {
  const m = /^([a-z]+):(\d+):(\d+)$/.exec(key);
  if (!m) return null;
  return phraseDeck(m[1])?.sets.find((x) => x.id === Number(m[2]))?.items[Number(m[3])] ?? null;
}

/** 학생 코스에 저장되는 토픽 (AI가 이름을 바꿔 줄 수 있다) */
export type ChosenTopic = { id: string; title: string; desc: string };

const JOB_TOPIC: Record<string, string[]> = {
  cafe: ["cafe"],
  kitchen: ["kitchen", "ingredients"],
  serving: ["serving"],
  takeaway: ["takeaway"],
  bakery: ["bakery"],
  housekeeping: ["housekeeping"],
  cleaning: ["cleaning"],
  hotel: ["hotel"],
  resort: ["resort", "interview"],
  farm: ["farm"],
  factory: ["factory"],
  construction: ["construction"],
  trades: ["trades"],
  retail: ["retail"],
  fashion: ["fashion"],
  servo: ["servo"],
  salon: ["salon"],
  care: ["care"],
  childcare: ["childcare"],
  animal: ["animal"],
  fitness: ["fitness"],
  office: ["phone"],
  other: ["customer"],
};
const WORRY_TOPIC: Record<string, string> = {
  interview: "interview",
  customer: "customer",
  housing: "housing",
  admin: "admin",
  medical: "medical",
  friends: "friends",
  phone: "phone",
};

/** 일하는 학생에게는 꼭 넣는 일터 공통 토픽 (근무·급여, 손님 응대) */
export function requiredTopics(a: Pick<CourseAnswers, "stage">): string[] {
  return a.stage === "working" ? ["shift", "customer"] : [];
}

/**
 * 워홀 목표 → 먼저 넣을 토픽.
 * 돈: 내 직군 + 면접 · 커리어·이민: 면접 + 전화·사무 · 친구: 수다·슬랭 · 영어: 구동사 · 여행: 교통·슬랭
 */
export function goalTopics(a: Pick<CourseAnswers, "goals" | "jobs">): string[] {
  const out: string[] = [];
  const add = (id: string) => !out.includes(id) && out.push(id);
  const goals = a.goals ?? [];
  if (goals.includes("money")) {
    a.jobs.forEach((j) => JOB_TOPIC[j]?.slice(0, 1).forEach(add));
    add("interview");
  }
  if (goals.includes("career")) ["interview", "phone"].forEach(add);
  if (goals.includes("friends")) ["friends", "aussie"].forEach(add);
  if (goals.includes("english")) add("everyday");
  if (goals.includes("travel")) ["transport", "aussie"].forEach(add);
  return out;
}

/** 규칙으로 추천 (AI를 못 쓸 때도 이걸로 코스가 만들어진다). 3~6개, 급한 순서 */
export function recommendTopics(a: CourseAnswers, access: { fullVoca: boolean; freePhraseSets: number }): string[] {
  const order: string[] = [];
  const add = (id: string) => {
    if (!order.includes(id)) order.push(id);
  };
  // 워홀 목표가 제일 먼저 (최대 3개만, 지금 단계 토픽도 들어갈 자리를 남긴다)
  goalTopics(a).slice(0, 3).forEach(add);
  if (a.stage === "before") ["admin", "transport", "housing"].forEach(add);
  if (a.stage === "arrived") ["housing", "admin"].forEach(add);
  if (a.stage === "jobhunt") add("interview");
  // 보기에 없는 일만 직접 적었으면 '기타'처럼 (일터 공통 손님 응대)
  const jobs: string[] = a.jobs.length ? a.jobs : a.jobOther ? ["other"] : [];
  if (a.stage === "working") jobs.forEach((j) => JOB_TOPIC[j]?.slice(0, 1).forEach(add));
  a.worries.forEach((w) => add(WORRY_TOPIC[w]));
  jobs.forEach((j) => JOB_TOPIC[j]?.forEach(add));
  // 일하는 학생은 일터 공통(근무·급여, 손님 응대)을 모두 넣는다
  requiredTopics(a).forEach(add);
  if (a.level >= 4) add("everyday");
  const usable = () => order.filter((id) => topicPhrases(courseTopic(id)!, access).length > 0);
  // 3개가 안 되면 누구에게나 쓸모 있는 토픽으로 채운다
  for (const id of ["transport", "friends", "everyday", "aussie", "admin", "cafe"]) {
    if (usable().length >= 3) break;
    add(id);
  }
  const list = usable();
  // 일터 공통 토픽은 6개 제한에 밀려 빠지지 않게
  const req = requiredTopics(a);
  const must = list.filter((id) => req.includes(id));
  return [...list.filter((id) => !must.includes(id)).slice(0, 6 - must.length), ...must];
}

export type AiCourse = { summary: string; topics: ChosenTopic[] };

/** AI가 준 JSON을 엄격하게 확인: 모르는 id는 버리고, 글자 수를 자른다. 쓸 게 3개 안 되면 null */
export function validateAiCourse(raw: unknown, allowed: string[]): AiCourse | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as { summary?: unknown; topics?: unknown };
  if (typeof r.summary !== "string" || !Array.isArray(r.topics)) return null;
  const seen = new Set<string>();
  const topics: ChosenTopic[] = [];
  for (const t of r.topics) {
    if (!t || typeof t !== "object") continue;
    const { id, title, desc } = t as Record<string, unknown>;
    if (typeof id !== "string" || !allowed.includes(id) || seen.has(id) || !courseTopic(id)) continue;
    seen.add(id);
    const def = courseTopic(id)!;
    topics.push({
      id,
      title: typeof title === "string" && title.trim() ? title.trim().slice(0, 30) : def.title,
      desc: typeof desc === "string" && desc.trim() ? desc.trim().slice(0, 60) : def.desc,
    });
    if (topics.length >= 6) break;
  }
  const summary = r.summary.trim().slice(0, 80);
  if (topics.length < 3 || !summary) return null;
  return { summary, topics };
}
