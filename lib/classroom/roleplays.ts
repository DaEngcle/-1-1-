// 직군별 상황 30개 (5 STEP × 6): 핵심 문장 5개(리스닝·표현 연습) + 상황극(AI 안 씀, 규칙으로만 채점).
// 데이터는 lib/classroom/curriculum/<직군>.ts. 서버 전용으로 읽는다 (화면엔 상황 하나만 넘긴다).
// 상황극 keys[0]은 모범 답(model)에 꼭 들어 있어야 한다 (힌트에서 굵게 보여 준다). 검사: npx tsx scripts/check-curriculum.ts

import type { JobId } from "./course-questions";
import { CURRICULA } from "./curriculum";
import type { LessonDef, LessonLine, RoleplayTurn } from "./curriculum/kit";

export type { LessonLine, RoleplayTurn };

export type RoleplayJob = Exclude<JobId, "other">;

export type Roleplay = Omit<LessonDef, "n"> & {
  /** `${job}-${번호}` (학생 기록이 이 id에 붙는다) */
  id: string;
  job: RoleplayJob;
  n: number;
};

export const ROLEPLAYS: Roleplay[] = (Object.entries(CURRICULA) as [RoleplayJob, (typeof CURRICULA)[RoleplayJob]][]).flatMap(([job, c]) =>
  [...c.lessons]
    .sort((a, b) => a.step - b.step)
    .map(({ n, ...l }) => ({ ...l, id: `${job}-${n}`, job, n: Number(n) })),
);

const BY_ID = new Map(ROLEPLAYS.map((r) => [r.id, r]));

export function roleplay(id: string) {
  return BY_ID.get(id) ?? null;
}

/** STEP 순서대로 */
export function roleplaysFor(job: string) {
  return ROLEPLAYS.filter((r) => r.job === job);
}

/** 직군의 STEP 제목 5개 */
export function jobSteps(job: RoleplayJob) {
  return CURRICULA[job].steps.map((title, i) => ({ step: (i + 1) as 1 | 2 | 3 | 4 | 5, title }));
}

/** 상황 화면 주소 */
export const lessonHref = (r: Pick<Roleplay, "job" | "n">) => `/student/practice/${r.job}/${r.n}`;

/** 리스닝·표현 연습 기록 키 (voca_progress.deck) */
export const listenDeck = (id: string) => `ls-${id}`;
export const phraseDeckKey = (id: string) => `ex-${id}`;

/** 직군 → 표현 익히기 토픽 (course-topics.ts의 id). 사무는 '전화' 토픽 */
export const TOPIC_FOR_JOB: Record<RoleplayJob, string> = {
  cafe: "cafe", kitchen: "kitchen", serving: "serving", takeaway: "takeaway", bakery: "bakery",
  housekeeping: "housekeeping", cleaning: "cleaning", hotel: "hotel", resort: "resort",
  farm: "farm", factory: "factory", construction: "construction", trades: "trades",
  retail: "retail", fashion: "fashion", servo: "servo", salon: "salon", care: "care",
  childcare: "childcare", animal: "animal", fitness: "fitness", office: "phone",
};
