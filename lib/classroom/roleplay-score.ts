// 상황극 채점 (규칙만, AI 안 씀). 서버·브라우저 공용 — 서버에서도 같은 함수로 다시 채점한다.

import { checkSpoken, spokenWords } from "./sentence-practice";

export type TurnCheck = { stars: 1 | 2 | 3; keyHit: boolean; overlap: number };

function padded(s: string) {
  return ` ${spokenWords(s).join(" ")} `;
}

/** 답에 핵심 표현(아무 변형이나)이 들어 있는지 */
export function hasKeyPhrase(answer: string, keys: string[]) {
  const a = padded(answer);
  return keys.some((k) => {
    const n = padded(k);
    return n.trim() !== "" && a.includes(n);
  });
}

/**
 * 별점: 핵심 표현이 있으면 2~3개 (모범 답과 단어가 절반 넘게 겹치면 3개),
 * 없으면 1~2개 (그래도 모범 답과 많이 겹치면 2개).
 */
export function scoreTurn(answer: string, turn: { model: string; keys: string[] }): TurnCheck {
  const keyHit = hasKeyPhrase(answer, turn.keys);
  const overlap = answer.trim() ? checkSpoken(turn.model, answer).score : 0;
  const stars = keyHit ? (overlap >= 50 ? 3 : 2) : overlap >= 60 ? 2 : 1;
  return { stars, keyHit, overlap };
}

/** 시나리오 별점: 턴 별점 평균 (반올림) */
export function scenarioStars(turnStars: number[]) {
  if (turnStars.length === 0) return 0;
  return Math.max(1, Math.min(3, Math.round(turnStars.reduce((a, b) => a + b, 0) / turnStars.length)));
}

/** 힌트에서 핵심 표현 굵게: [앞, 표현, 뒤] (못 찾으면 null) */
export function splitKey(model: string, key: string): [string, string, string] | null {
  const i = model.toLowerCase().indexOf(key.toLowerCase());
  if (i < 0) return null;
  return [model.slice(0, i), model.slice(i, i + key.length), model.slice(i + key.length)];
}
