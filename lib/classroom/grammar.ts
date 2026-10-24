// 기초 문법 과정: 선생님 '🐤기초문법' 강의 1~60강 (구글 시트 '🐤기초문법')과 번호를 맞춘다.
// 유닛마다 강의 영상 + 개념·예문·문제(content/grammar/unit-NN.json)
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
import u21 from "@/content/grammar/unit-21.json";
import u22 from "@/content/grammar/unit-22.json";
import u23 from "@/content/grammar/unit-23.json";
import u24 from "@/content/grammar/unit-24.json";
import u25 from "@/content/grammar/unit-25.json";
import u26 from "@/content/grammar/unit-26.json";
import u27 from "@/content/grammar/unit-27.json";
import u28 from "@/content/grammar/unit-28.json";
import u29 from "@/content/grammar/unit-29.json";
import u30 from "@/content/grammar/unit-30.json";
import u31 from "@/content/grammar/unit-31.json";
import u32 from "@/content/grammar/unit-32.json";
import u33 from "@/content/grammar/unit-33.json";
import u34 from "@/content/grammar/unit-34.json";
import u35 from "@/content/grammar/unit-35.json";
import u36 from "@/content/grammar/unit-36.json";
import u37 from "@/content/grammar/unit-37.json";
import u38 from "@/content/grammar/unit-38.json";
import u39 from "@/content/grammar/unit-39.json";
import u40 from "@/content/grammar/unit-40.json";
import u41 from "@/content/grammar/unit-41.json";
import u42 from "@/content/grammar/unit-42.json";
import u43 from "@/content/grammar/unit-43.json";
import u44 from "@/content/grammar/unit-44.json";
import u45 from "@/content/grammar/unit-45.json";
import u46 from "@/content/grammar/unit-46.json";
import u47 from "@/content/grammar/unit-47.json";
import u48 from "@/content/grammar/unit-48.json";
import u49 from "@/content/grammar/unit-49.json";
import u50 from "@/content/grammar/unit-50.json";
import u51 from "@/content/grammar/unit-51.json";
import u52 from "@/content/grammar/unit-52.json";
import u53 from "@/content/grammar/unit-53.json";
import u54 from "@/content/grammar/unit-54.json";
import u55 from "@/content/grammar/unit-55.json";
import u56 from "@/content/grammar/unit-56.json";
import u57 from "@/content/grammar/unit-57.json";
import u58 from "@/content/grammar/unit-58.json";
import u59 from "@/content/grammar/unit-59.json";
import u60 from "@/content/grammar/unit-60.json";

export type GrammarQuiz =
  | { type: "blank"; sentence: string; answer: string; choices: string[]; ko: string; why: string }
  | { type: "translate"; ko: string; answer: string; choices: string[]; why: string }
  | { type: "fix"; prompt: string; answer: string; choices: string[]; why: string };

type UnitContent = {
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

export type GrammarUnit = UnitContent & { lecture: string; video: string };

/** 선생님 강의 목록 (시트 제목 그대로 · 유튜브 일부 공개) */
const LECTURES: Record<number, { title: string; video: string }> = {
  1: { title: "be동사", video: "https://youtu.be/KOFEmvdDXbQ" },
  2: { title: "be동사 부정문", video: "https://youtu.be/jwgX-RikqZE" },
  3: { title: "be동사 의문문", video: "https://youtu.be/J8HMV0vcRgc" },
  4: { title: "현재진행형", video: "https://youtu.be/52h3NddX-N8" },
  5: { title: "현재진행 시제 부정문", video: "https://youtu.be/yaImfyNn1jE" },
  6: { title: "현재진행 시제 의문문", video: "https://youtu.be/a8QvfBMPsIY" },
  7: { title: "현재 시제(1)", video: "https://youtu.be/AOS20EiYAkQ" },
  8: { title: "현재 시제(2)", video: "https://youtu.be/DheqHsbsChQ" },
  9: { title: "현재 시제 부정문", video: "https://youtu.be/5vrS_LJSDx4" },
  10: { title: "현재 시제 의문문", video: "https://youtu.be/KymHmewHHBk" },
  11: { title: "현재 진행 시제 vs 현재 시제", video: "https://youtu.be/r0HzKChgb8E" },
  12: { title: "현재진행 시제로 안 쓰는 동사", video: "https://youtu.be/HLwcE602uJY" },
  13: { title: "be동사 과거 시제(was/were)", video: "https://youtu.be/6xlMiJdFNBE" },
  14: { title: "be동사 과거 시제 부정문과 의문문", video: "https://youtu.be/Yh4DKID-pws" },
  15: { title: "일반동사 과거 시제", video: "https://youtu.be/Qy8cwot36YI" },
  16: { title: "과거 시제 부정문과 의문문", video: "https://youtu.be/6fU41t6njZA" },
  17: { title: "과거 진행 시제", video: "https://youtu.be/2TUgEVRoguo" },
  18: { title: "과거진행 시제 부정문과 의문문", video: "https://youtu.be/SYRumo47xe4" },
  19: { title: "used to + 동사원형", video: "https://youtu.be/VH39YtlRS_M" },
  20: { title: "현재완료 시제(1)", video: "https://youtu.be/O5HA48u1Vz4" },
  21: { title: "현재완료 시제(2)", video: "https://youtu.be/fSQ0b4tO1og" },
  22: { title: "현재완료 시제(3)", video: "https://youtu.be/Zxf2N_RteZU" },
  23: { title: "과거 시제 vs 현재완료(have p.p.)", video: "https://youtu.be/G2W1YnLtwq0" },
  24: { title: "just, already, yet", video: "https://youtu.be/dqbJImchIGs" },
  25: { title: "미래 시제(1) will", video: "https://youtu.be/mkgukqHLmlU" },
  26: { title: "미래 시제(2) be going to", video: "https://youtu.be/H_NWV0LhfFM" },
  27: { title: "미래 시제(3) will과 be going to 비교", video: "https://youtu.be/fDnb9jIcxZI" },
  28: { title: "미래 시제(4) be -ing로 미래 말하기", video: "https://youtu.be/0HdTE6niaj8" },
  29: { title: "can과 could", video: "https://youtu.be/1L2BT7xlQaI" },
  30: { title: "Can I ~?, Can you ~?", video: "https://youtu.be/lWEWXyMwwgA" },
  31: { title: "might", video: "https://youtu.be/NNONKjM_3Pc" },
  32: { title: "must", video: "https://youtu.be/aEPwPsCTTYw" },
  33: { title: "must와 have to (의무)", video: "https://youtu.be/RHO0i2AKPeI" },
  34: { title: "must not과 don't have to", video: "https://youtu.be/mx8YWTc2FjE" },
  35: { title: "should", video: "https://youtu.be/1YJBeJkkXIQ" },
  36: { title: "would like (to)", video: "https://youtu.be/gUwjSV7BKOc" },
  37: { title: "should (2)", video: "https://youtu.be/QLlbUFMV5vQ" },
  38: { title: "능동태와 수동태 비교", video: "https://youtu.be/gvuHwukO1U0" },
  39: { title: "부정문", video: "https://youtu.be/On3hKfNieEw" },
  40: { title: "의문사가 없는 의문문", video: "https://youtu.be/dBGqUyE_r5o" },
  41: { title: "who와 what", video: "https://youtu.be/fPtwD_WAX0k" },
  42: { title: "which", video: "https://youtu.be/bSDnChJbubM" },
  43: { title: "where, when, why", video: "https://youtu.be/sQcAZQkGNX8" },
  44: { title: "how", video: "https://youtu.be/S-wSo4FAMZ4" },
  45: { title: "간접의문문", video: "https://youtu.be/Aw_lZSzpgAE" },
  46: { title: "-ing (1) 주어", video: "https://youtu.be/Agq9sVr_TLM" },
  47: { title: "-ing (2) 목적어", video: "https://youtu.be/7pHyhnGWOs4" },
  48: { title: "to + 동사원형", video: "https://youtu.be/kswDeEZNr2A" },
  49: { title: "-ing와 to 동사원형 모두 가능한 동사", video: "https://youtu.be/iWNgxcAQWAM" },
  50: { title: "동사 + 사람 + to 동사원형", video: "https://youtu.be/PutGq6Yl5Qw" },
  51: { title: "make / have / let + 사람 + 동사원형", video: "https://youtu.be/h3swQ2MrQTQ" },
  52: { title: "목적을 나타내는 to", video: "https://youtu.be/TT0FPbVU_KA" },
  53: { title: "셀 수 있는 명사, 셀 수 없는 명사", video: "https://youtu.be/fpDvkzr7KJY" },
  54: { title: "단수와 복수", video: "https://youtu.be/O1Kkwkjlqg8" },
  55: { title: "단수·복수 주의할 명사", video: "https://youtu.be/rPKtoZoBeEY" },
  56: { title: "a glass / a can of ~", video: "https://youtu.be/oC3m1JElWgI" },
  57: { title: "a/an과 the", video: "https://youtu.be/6MoELuqVu9E" },
  58: { title: "the를 쓰지 않는 경우(1)", video: "https://youtu.be/JIBv7zN456A" },
  59: { title: "the를 쓰는 경우와 쓰지 않는 경우(2)", video: "https://youtu.be/d_huWHHljSE" },
  60: { title: "대명사", video: "https://youtu.be/eONTS6fvgNo" },
};

export const GRAMMAR_UNITS: GrammarUnit[] = ([u01, u02, u03, u04, u05, u06, u07, u08, u09, u10, u11, u12, u13, u14, u15, u16, u17, u18, u19, u20, u21, u22, u23, u24, u25, u26, u27, u28, u29, u30, u31, u32, u33, u34, u35, u36, u37, u38, u39, u40, u41, u42, u43, u44, u45, u46, u47, u48, u49, u50, u51, u52, u53, u54, u55, u56, u57, u58, u59, u60] as UnitContent[]).map((u) => ({
  ...u,
  lecture: LECTURES[u.unit].title,
  video: LECTURES[u.unit].video,
}));

/** 지금 학생에게 공개하는 유닛 수 (21~60강 내용은 만들어 두었고, 숫자만 올리면 열린다) */
export const OPEN_GRAMMAR_UNITS = 20;

/** 무료회원은 앞 유닛까지만 */
export const FREE_GRAMMAR_UNITS = 3;

/** 게임 저장용 덱 이름 (voca_progress 테이블을 같이 쓴다) */
export const grammarDeck = (unit: number) => `grammar-${unit}`;

export function grammarUnit(n: number) {
  if (n > OPEN_GRAMMAR_UNITS) return null;
  return GRAMMAR_UNITS.find((u) => u.unit === n) ?? null;
}

/** 유닛 묶음 (목록 화면 소제목). 공개한 유닛만 보여준다 */
const ALL_PARTS = [
  { title: "be동사 · 현재진행", units: [1, 2, 3, 4, 5, 6] },
  { title: "현재 시제", units: [7, 8, 9, 10, 11, 12] },
  { title: "과거 시제", units: [13, 14, 15, 16, 17, 18, 19] },
  { title: "현재완료", units: [20, 21, 22, 23, 24] },
  { title: "미래", units: [25, 26, 27, 28] },
  { title: "조동사 (can · might · must · should)", units: [29, 30, 31, 32, 33, 34, 35, 36, 37] },
  { title: "수동태 · 부정문 · 의문문", units: [38, 39, 40, 41, 42, 43, 44, 45] },
  { title: "-ing와 to 동사원형", units: [46, 47, 48, 49, 50, 51, 52] },
  { title: "명사 · 관사 · 대명사", units: [53, 54, 55, 56, 57, 58, 59, 60] },
];

export const GRAMMAR_PARTS = ALL_PARTS.map((p) => ({ ...p, units: p.units.filter((n) => n <= OPEN_GRAMMAR_UNITS) })).filter(
  (p) => p.units.length > 0,
);
