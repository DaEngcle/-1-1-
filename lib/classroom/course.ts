// 내 워홀 코스: 질문 답 + 고른 토픽 → 앱에 이미 있는 콘텐츠로 순서 짜기 (규칙만, AI 안 씀). 순수 함수만 둔다.
// 단계 완료는 이미 있는 기록에서 읽는다: 보카·문법 별(voca_progress), AI 면접(interview_sessions),
// 쉐도잉 제출(submissions), 고양이 마을 말하기(village_speak_usage).

import { phraseDeck } from "./phrase-decks";
import { grammarDeck, grammarUnit } from "./grammar";
import type { CourseAnswers, JobId, StageId } from "./course-questions";
import { courseTopic, type ChosenTopic } from "./course-topics";

export type CourseStepKind = "phrase" | "grammar" | "talk" | "shadowing" | "village";

export type CourseStep = {
  /** phrase:survival-2 · grammar:5 · talk:cafe · shadow:3 · village */
  id: string;
  kind: CourseStepKind;
  emoji: string;
  title: string;
  sub: string;
  /** 왜 이 단계가 들어갔는지 (짧게) */
  why?: string;
  href: string;
  minutes: number;
  /** 주차 (하루 분량 x 5일 = 1주) */
  week: number;
};

/** 이 학생이 열 수 있는 범위 (잠긴 콘텐츠는 코스에 넣지 않는다) */
export type CourseAccess = {
  /** 보카 세트 전부 (아니면 덱마다 앞 freePhraseSets개만) */
  fullVoca: boolean;
  freePhraseSets: number;
  /** 열 수 있는 문법 유닛 끝 번호 */
  maxGrammarUnit: number;
};

const MIN = { phrase: 5, grammar: 10, talk: 10, shadowing: 5, village: 5 } as const;
/** 쉐도잉 한 단계 = 이만큼 문장 제출 */
export const SHADOW_PER_STEP = 5;
const MAX_SHADOW_STEPS = 8;
const STUDY_DAYS_PER_WEEK = 5;

type Ref =
  | { kind: "phrase"; deck: string; set: number; why?: string }
  | { kind: "grammar"; unit: number; why?: string }
  | { kind: "talk"; scenario: string; why?: string }
  | { kind: "village"; why?: string };

const ph = (deck: string, set: number, why?: string): Ref => ({ kind: "phrase", deck, set, why });
const talk = (scenario: string, why?: string): Ref => ({ kind: "talk", scenario, why });

/** 직군 → AI 면접 캐릭터 (lib/classroom/interview-scenarios.ts) */
export const SCENARIO_FOR_JOB: Partial<Record<JobId, string>> = {
  cafe: "cafe",
  bakery: "cafe",
  serving: "cafe",
  kitchen: "chef",
  takeaway: "chef",
  housekeeping: "hotel",
  cleaning: "hotel",
  hotel: "hotel",
  farm: "farm",
  factory: "farm",
  construction: "carpenter",
  trades: "carpenter",
  retail: "retail",
  fashion: "retail",
  servo: "retail",
};

const STAGE_WHY: Record<StageId, string> = {
  before: "출국 전에 미리",
  arrived: "도착 첫 달에 바로 쓰는 말",
  jobhunt: "일 구하는 중이라서",
  working: "일하는 중이라서",
};

/** 레벨별 문법 유닛 (기초일수록 앞 유닛부터 많이) */
const GRAMMAR_BY_LEVEL: Record<number, number[]> = {
  1: range(1, 12),
  2: range(4, 19),
  3: range(13, 30),
  4: range(20, 30),
  5: range(25, 30),
};
/** 문법을 몇 단계마다 하나씩 끼우는지 */
const GRAMMAR_EVERY: Record<number, number> = { 1: 2, 2: 2, 3: 3, 4: 4, 5: 5 };

function range(a: number, b: number) {
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}

/**
 * 답 + 고른 토픽 → 순서 있는 단계 목록.
 * 표현 세트는 고른 토픽 순서대로, 그 사이에 AI 면접·고양이 마을·문법(레벨별)·쉐도잉을 끼운다.
 */
export function buildCourse(answers: CourseAnswers, topics: ChosenTopic[], access: CourseAccess): CourseStep[] {
  const { stage, jobs, worries, level } = answers;
  const content: Ref[] = [];
  const add = (r: Ref) => content.push(r);

  // 직군 면접 캐릭터 (최대 2명). 직군이 없거나 사무만 고르면 카페 면접으로 연습
  const scenarios = jobs.map((j) => SCENARIO_FOR_JOB[j]).filter((s): s is string => !!s).slice(0, 2);
  const interviewRefs = (why: string) => (scenarios.length ? scenarios : ["cafe"]).map((s) => talk(s, why));
  const goals = answers.goals ?? [];
  const interviewEarly = stage === "jobhunt" || worries.includes("interview") || goals.includes("money") || goals.includes("career");

  topics.forEach((t, i) => {
    const def = courseTopic(t.id);
    if (!def) return;
    def.sets.forEach(([d, s]) => add(ph(d, s, t.title)));
    // 면접이 급하면 첫 토픽 바로 뒤에 AI 면접
    if (i === 0 && interviewEarly)
      interviewRefs(
        stage === "jobhunt" ? STAGE_WHY.jobhunt : worries.includes("interview") ? "면접이 걱정된다고 해서" : goals.includes("money") ? "돈 모으기가 목표라서" : "커리어가 목표라서",
      ).forEach(add);
    if (t.id === "housing") add(talk("sharehouse", "집 구하기 연습"));
  });
  if (!interviewEarly && jobs.length > 0) interviewRefs("면접 미리 연습").forEach(add);

  // 고양이 마을: 멜버른(마을 배경)이나 친구 사귀기를 골랐으면 앞쪽에
  const villageEarly = answers.cities.includes("melbourne") || worries.includes("friends") || goals.includes("friends");
  if (!content.some((r) => r.kind === "village")) {
    content.splice(Math.min(villageEarly ? 2 : 6, content.length), 0, {
      kind: "village",
      why: villageEarly ? "멜버른 마을에서 말 걸어 보기" : undefined,
    });
  }

  const seen = new Set<string>();
  const usable = content
    .map((r) => toStep(r, access))
    .filter((s): s is Omit<CourseStep, "week"> => {
      if (!s || seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });

  // 문법 끼우기
  // 커리어·이민이 목표면 한 단계 위 문법까지
  const grammarLevel = goals.includes("career") ? Math.min(5, level + 1) : level;
  const grammar = GRAMMAR_BY_LEVEL[grammarLevel]
    .map((unit) => toStep({ kind: "grammar", unit, why: grammarLevel > level ? "커리어가 목표라서 한 단계 위 문법" : level <= 2 ? "기초 문법부터 탄탄하게" : undefined }, access))
    .filter((s): s is Omit<CourseStep, "week"> => !!s);
  const every = GRAMMAR_EVERY[grammarLevel];
  const merged: Omit<CourseStep, "week">[] = [];
  let sinceGrammar = 0;
  for (const s of usable) {
    merged.push(s);
    sinceGrammar++;
    if (sinceGrammar >= every && grammar.length) {
      merged.push(grammar.shift()!);
      sinceGrammar = 0;
    }
  }
  merged.push(...grammar);

  // 쉐도잉 5문장: 세 번째 자리, 그 뒤로 5단계마다
  const withShadow: Omit<CourseStep, "week">[] = [];
  let k = 0;
  merged.forEach((s, i) => {
    if ((i === 2 || (i > 2 && (i - 2) % 5 === 0)) && k < MAX_SHADOW_STEPS) {
      k++;
      withShadow.push({
        id: `shadow:${k}`,
        kind: "shadowing",
        emoji: "🎤",
        title: `쉐도잉 ${SHADOW_PER_STEP}문장`,
        sub: `코스 시작 후 누적 ${SHADOW_PER_STEP * k}문장 제출하면 완료`,
        href: "/student/shadowing",
        minutes: MIN.shadowing,
      });
    }
    withShadow.push(s);
  });

  // 주차: 하루 분량 x 5일
  const weekMinutes = answers.minutes * STUDY_DAYS_PER_WEEK;
  let cum = 0;
  return withShadow.map((s) => {
    const week = Math.floor(cum / weekMinutes) + 1;
    cum += s.minutes;
    return { ...s, week };
  });
}

function toStep(r: Ref, access: CourseAccess): Omit<CourseStep, "week"> | null {
  if (r.kind === "phrase") {
    const deck = phraseDeck(r.deck);
    const set = deck?.sets.find((x) => x.id === r.set);
    if (!deck || !set) return null;
    if (!access.fullVoca && deck.id !== "jobs" && set.id > access.freePhraseSets) return null;
    return {
      id: `phrase:${deck.id}-${set.id}`,
      kind: "phrase",
      emoji: set.emoji,
      title: set.title,
      sub: `${deck.title} · 세트 ${set.id}`,
      why: r.why,
      href: `/student/voca/p/${deck.id}/${set.id}`,
      minutes: MIN.phrase,
    };
  }
  if (r.kind === "grammar") {
    const u = r.unit <= access.maxGrammarUnit ? grammarUnit(r.unit) : null;
    if (!u) return null;
    return {
      id: `grammar:${r.unit}`,
      kind: "grammar",
      emoji: u.emoji ?? "🐤",
      title: u.lecture,
      sub: `기초 문법 · Unit ${r.unit}`,
      why: r.why,
      href: `/student/grammar/${r.unit}`,
      minutes: MIN.grammar,
    };
  }
  if (r.kind === "talk") {
    const label = TALK_LABEL[r.scenario];
    if (!label) return null;
    return {
      id: `talk:${r.scenario}`,
      kind: "talk",
      emoji: "🎭",
      title: label,
      sub: "AI 면접 · 끝까지 하고 코칭 받기",
      why: r.why,
      href: `/student/talk/${r.scenario}`,
      minutes: MIN.talk,
    };
  }
  return {
    id: "village",
    kind: "village",
    emoji: "🏘️",
    title: "고양이 마을에서 말 걸어 보기",
    sub: "멜번 고양이 마을 · 장소에서 영어로 한마디",
    why: r.why,
    href: "/student/village",
    minutes: MIN.village,
  };
}

/** AI 면접 이름 (interview-scenarios.ts의 제목과 맞춘다. 그 파일은 무거워서 이름만 따로 둔다) */
const TALK_LABEL: Record<string, string> = {
  cafe: "카페 바리스타 면접",
  chef: "주방 (셰프·키친핸드) 면접",
  hotel: "호텔 (프런트·하우스키핑) 면접",
  farm: "농장 (과일 피킹) 면접",
  carpenter: "건설 현장 (목수·레이버러) 면접",
  retail: "매장 (리테일) 면접",
  sharehouse: "쉐어하우스 집 인터뷰",
};

/** 이미 있는 기록 → 끝난 단계 id */
export type CourseProgressData = {
  /** voca_progress: deck → 별 */
  stars: Map<string, number>;
  /** 끝까지 해서 코칭을 받은 AI 면접 시나리오 */
  interviews: Set<string>;
  /** 코스 시작 후 쉐도잉 제출 문장 수 */
  shadowSince: number;
  /** 고양이 마을에서 말하기를 해 봤는지 */
  villageSpoke: boolean;
  /** 표현 연습에서 한 번이라도 맞힌 표현 (덱:세트:번호) */
  drilled: Set<string>;
};

/** 세트의 표현을 표현 연습에서 다 맞혔는지 */
function setDrilled(deckSet: string, drilled: Set<string>) {
  const [d, s] = deckSet.split("-");
  const set = phraseDeck(d)?.sets.find((x) => x.id === Number(s));
  return !!set && set.items.every((_, i) => drilled.has(`${d}:${s}:${i}`));
}

export function doneSteps(steps: CourseStep[], p: CourseProgressData): Set<string> {
  const done = new Set<string>();
  for (const s of steps) {
    const [, key] = s.id.split(":");
    const ok =
      s.kind === "phrase"
        ? (p.stars.get(key) ?? 0) > 0 || setDrilled(key, p.drilled)
        : s.kind === "grammar"
          ? (p.stars.get(grammarDeck(Number(key))) ?? 0) > 0
          : s.kind === "talk"
            ? p.interviews.has(key)
            : s.kind === "shadowing"
              ? p.shadowSince >= SHADOW_PER_STEP * Number(key)
              : p.villageSpoke;
    if (ok) done.add(s.id);
  }
  return done;
}

/** 오늘 할 것: 안 끝난 단계를 순서대로, 하루 분량(분) 안에서 1~3개 */
export function pickToday(steps: CourseStep[], done: Set<string>, minutes: number): string[] {
  const out: string[] = [];
  let total = 0;
  for (const s of steps) {
    if (done.has(s.id)) continue;
    if (out.length > 0 && total + s.minutes > minutes) break;
    out.push(s.id);
    total += s.minutes;
    if (out.length >= 3) break;
  }
  return out;
}
