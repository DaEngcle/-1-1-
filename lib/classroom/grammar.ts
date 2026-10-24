// 기초 문법 과정 (🐤 기초반 Grammar Unit 1~20). 내용은 content/grammar/unit-NN.json
// 14~20유닛 예문은 선생님 수업 자료(Notion '다잉클 기초반 수업자료')에서 가져왔다.
import u01 from "@/content/grammar/unit-01.json";
import u02 from "@/content/grammar/unit-02.json";
import u03 from "@/content/grammar/unit-03.json";
import u04 from "@/content/grammar/unit-04.json";
import u05 from "@/content/grammar/unit-05.json";
import u06 from "@/content/grammar/unit-06.json";
import u07 from "@/content/grammar/unit-07.json";
import u08 from "@/content/grammar/unit-08.json";
import u09 from "@/content/grammar/unit-09.json";
import u10 from "@/content/grammar/unit-10.json";
import u11 from "@/content/grammar/unit-11.json";
import u12 from "@/content/grammar/unit-12.json";
import u13 from "@/content/grammar/unit-13.json";
import u14 from "@/content/grammar/unit-14.json";
import u15 from "@/content/grammar/unit-15.json";
import u16 from "@/content/grammar/unit-16.json";
import u17 from "@/content/grammar/unit-17.json";
import u18 from "@/content/grammar/unit-18.json";
import u19 from "@/content/grammar/unit-19.json";
import u20 from "@/content/grammar/unit-20.json";

export type GrammarQuiz =
  | { type: "blank"; sentence: string; answer: string; choices: string[]; ko: string; why: string }
  | { type: "translate"; ko: string; answer: string; choices: string[]; why: string }
  | { type: "fix"; prompt: string; answer: string; choices: string[]; why: string };

export type GrammarUnit = {
  unit: number;
  title: string;
  emoji: string;
  goal: string;
  points: { title: string; body: string }[];
  formula: string[];
  mistakes: { wrong: string; right: string; why: string }[];
  examples: { en: string; ko: string }[];
  quiz: GrammarQuiz[];
};

export const GRAMMAR_UNITS = [u01, u02, u03, u04, u05, u06, u07, u08, u09, u10, u11, u12, u13, u14, u15, u16, u17, u18, u19, u20] as GrammarUnit[];

/** 무료회원은 앞 유닛까지만 */
export const FREE_GRAMMAR_UNITS = 3;

/** 게임 저장용 덱 이름 (voca_progress 테이블을 같이 쓴다) */
export const grammarDeck = (unit: number) => `grammar-${unit}`;

export function grammarUnit(n: number) {
  return GRAMMAR_UNITS.find((u) => u.unit === n) ?? null;
}

/** 유닛 묶음 (목록 화면 소제목) */
export const GRAMMAR_PARTS = [
  { title: "현재 — 나·너·그 사람 이야기", units: [1, 2, 3, 4, 5] },
  { title: "지금 하는 일 · 할 수 있는 일", units: [6, 7, 8, 9, 10] },
  { title: "미래 · 과거의 시작", units: [11, 12, 13, 14, 15] },
  { title: "과거 더 자세히 · 현재완료", units: [16, 17, 18, 19, 20] },
];
