// 보카 문장 연습(순서 맞추기 · 보고 말하기) 도우미. 서버·브라우저 공용 순수 함수

import { normalizeAnswer } from "./course-drill";

/**
 * 문장을 단어 칩으로 나눈다. 문장부호는 단어에 붙여 둔다 ("Hi," "please?").
 * 글자가 없는 조각(— – 같은 대시)은 앞 단어에 붙인다.
 */
export function sentenceChips(sentence: string): string[] {
  const out: string[] = [];
  for (const raw of sentence.trim().split(/\s+/)) {
    if (!raw) continue;
    if (!/[\p{L}\p{N}]/u.test(raw) && out.length > 0) out[out.length - 1] += ` ${raw}`;
    else out.push(raw);
  }
  return out;
}

/** 칩을 섞는다. 칩이 2개 이상이면 원래 순서와 똑같이 나오지 않게 */
export function shuffleChips(chips: string[]): number[] {
  const idx = chips.map((_, i) => i);
  for (let attempt = 0; attempt < 8; attempt++) {
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    const same = idx.every((n, i) => chips[n] === chips[i]);
    if (!same || idx.length < 2) break;
  }
  return idx;
}

/** 순서 맞추기 채점: 대소문자·문장부호는 무시 */
export function sameSentence(built: string, target: string) {
  return normalizeAnswer(built) !== "" && normalizeAnswer(built) === normalizeAnswer(target);
}

const NUMBERS: Record<string, string> = {
  zero: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9", ten: "10",
  eleven: "11", twelve: "12", fifteen: "15", twenty: "20", thirty: "30", forty: "40", fifty: "50", hundred: "100",
};

/**
 * 말하기 비교용 단어: 소문자, 줄임말은 풀어서(what's = what is, can't = can not),
 * 하이픈은 띄어쓰기, 숫자 단어는 숫자로. 정답·들은 말 양쪽에 똑같이 쓴다.
 */
export function spokenWords(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\bcan't\b/g, "can not")
    .replace(/\bcannot\b/g, "can not")
    .replace(/\bwon't\b/g, "will not")
    .replace(/\blet's\b/g, "let us")
    .replace(/n't\b/g, " not")
    .replace(/'re\b/g, " are")
    .replace(/'m\b/g, " am")
    .replace(/'ll\b/g, " will")
    .replace(/'ve\b/g, " have")
    .replace(/'d\b/g, " would")
    .replace(/\b(it|that|what|there|here|he|she|who|where|how)'s\b/g, "$1 is")
    .replace(/'/g, "")
    .replace(/[-–—]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    // 붙여 쓰기·띄어 쓰기가 갈리는 말은 하나로
    .replace(/\btake away\b/g, "takeaway")
    .replace(/\bwifi\b/g, "wi fi")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => NUMBERS[w] ?? w);
}

export type SpokenCheck = {
  /** 정답 문장의 칩마다 들렸는지 */
  chips: { text: string; ok: boolean }[];
  /** 정답 단어 중 들린 비율 (0~100) */
  score: number;
  grade: "정확" | "거의" | "다시";
};

/** 들은 말을 정답 문장과 단어 순서대로 비교한다 (가장 긴 공통 부분열) */
export function checkSpoken(target: string, heard: string): SpokenCheck {
  const chips = sentenceChips(target);
  // 칩마다 비교 단어로 풀고, 어느 칩에서 나왔는지 기억해 둔다
  const a: { w: string; chip: number }[] = [];
  chips.forEach((c, i) => spokenWords(c).forEach((w) => a.push({ w, chip: i })));
  const b = spokenWords(heard);
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] = a[i].w === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const hit = new Array<boolean>(a.length).fill(false);
  for (let i = 0, j = 0; i < a.length && j < b.length; ) {
    if (a[i].w === b[j]) {
      hit[i] = true;
      i++;
      j++;
    } else if (dp[i][j + 1] >= dp[i + 1][j]) j++;
    else i++;
  }
  const chipOk = chips.map((_, ci) => {
    const mine = a.map((x, k) => (x.chip === ci ? hit[k] : null)).filter((x): x is boolean => x !== null);
    return mine.length === 0 || mine.every(Boolean);
  });
  const score = a.length ? Math.round((100 * hit.filter(Boolean).length) / a.length) : 0;
  return {
    chips: chips.map((text, i) => ({ text, ok: chipOk[i] })),
    score,
    grade: gradeFor(score),
  };
}

export function gradeFor(score: number): SpokenCheck["grade"] {
  return score >= 90 ? "정확" : score >= 60 ? "거의" : "다시";
}

/** 판 점수에 넣는 값: 정확 1 · 거의 0.5 · 다시 0 */
export function gradeValue(grade: SpokenCheck["grade"]) {
  return grade === "정확" ? 1 : grade === "거의" ? 0.5 : 0;
}
