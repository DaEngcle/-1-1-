// 상황 연습 화면 도우미: 내 워홀 코스 단계 → 맞춤 커리큘럼(표현 익히기 · 상황극 · 실전 대화). 순수 함수

import type { CourseStep } from "./course";
import { JOBS, type JobId } from "./course-questions";
import type { TimelineItem, TimelineSection } from "@/app/_ui/chat/step-timeline";

/** 상황 연습에서 보여 주는 단계 종류 */
export const HUB_KINDS = new Set(["phrase", "roleplay", "talk"]);

export const HUB_KIND_LABEL: Record<string, string> = { phrase: "표현 익히기", roleplay: "실전 상황", talk: "실전 대화" };

export function hubSteps(steps: CourseStep[]) {
  return steps.filter((s) => HUB_KINDS.has(s.kind));
}

export function stepItem(s: CourseStep, done: Set<string>): TimelineItem {
  return {
    id: s.id,
    emoji: s.emoji,
    title: s.title,
    tag: `${HUB_KIND_LABEL[s.kind] ?? ""} · ${s.minutes}분${s.why ? ` · ${s.why}` : ""}`,
    desc: s.kind === "phrase" ? "예문을 문장째로 듣고, 순서 맞추고, 써 보고, 말해 봐요." : s.sub,
    href: s.href,
    done: done.has(s.id),
  };
}

/** 주차 → STEP 묶음 */
export function curriculumSections(steps: CourseStep[], done: Set<string>): TimelineSection[] {
  const weeks = [...new Set(steps.map((s) => s.week))];
  // 주차 번호가 띄엄띄엄이어도 STEP은 1부터
  return weeks.map((w, i) => {
    const list = steps.filter((s) => s.week === w);
    return {
      title: `STEP ${i + 1}`,
      sub: `${list.filter((s) => done.has(s.id)).length}/${list.length}`,
      items: list.map((s) => stepItem(s, done)),
    };
  });
}

/** 직군 목록: 코스에서 고른 직군이 먼저 */
export function orderedJobs(courseJobs: readonly JobId[] = []) {
  const all = JOBS.filter((j) => j.id !== "other");
  return [...all.filter((j) => courseJobs.includes(j.id)), ...all.filter((j) => !courseJobs.includes(j.id))];
}
