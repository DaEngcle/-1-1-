// 직군별 커리큘럼 데이터 도구: 직군마다 5 STEP × 6상황 = 30개.
// 상황 하나 = 핵심 문장 5개(리스닝·표현 연습) + 짧은 상황극(턴 3~4개).

/** 핵심 문장: example 속에 term이 그대로 들어 있어야 한다 (칠해서 보여 주고 빈칸으로 낸다) */
export type LessonLine = { term: string; ko: string; example: string; example_ko: string; note?: string };

export type RoleplayTurn = {
  /** 상대가 하는 말 (영어) */
  line: string;
  /** 상대 말 번역 */
  ko: string;
  /** 학생이 할 말 (한국어 미션) */
  mission: string;
  /** 모범 답 하나 */
  model: string;
  /** 들어가면 인정하는 핵심 표현 (2~3개, 첫 번째가 모범 답 속 표현) */
  keys: string[];
};

export type LessonDef = {
  n: string;
  step: 1 | 2 | 3 | 4 | 5;
  emoji: string;
  title: string;
  desc: string;
  who: string;
  lines: LessonLine[];
  turns: RoleplayTurn[];
  outro: { line: string; ko: string };
};

export type JobCurriculum = {
  /** STEP 1~5 제목 (한국어, 짧게) */
  steps: [string, string, string, string, string];
  lessons: LessonDef[];
};

/** 핵심 문장: ln(표현, 표현 뜻, 문장, 문장 번역, 팁?) */
export const ln = (term: string, ko: string, example: string, example_ko: string, note?: string): LessonLine => ({ term, ko, example, example_ko, ...(note ? { note } : {}) });
/** 상황극 한 턴: t(상대 말, 번역, 한국어 미션, 모범 답, 핵심 표현들) */
export const t = (line: string, ko: string, mission: string, model: string, keys: string[]): RoleplayTurn => ({ line, ko, mission, model, keys });
/** 마지막 말 */
export const o = (line: string, ko: string) => ({ line, ko });
/** 상황 하나: L(번호, STEP, 이모지, 제목, 설명, 상대, 핵심 문장 5개, 턴들, 마지막 말) */
export const L = (
  n: string,
  step: LessonDef["step"],
  emoji: string,
  title: string,
  desc: string,
  who: string,
  lines: LessonLine[],
  turns: RoleplayTurn[],
  outro: { line: string; ko: string },
): LessonDef => ({ n, step, emoji, title, desc, who, lines, turns, outro });
