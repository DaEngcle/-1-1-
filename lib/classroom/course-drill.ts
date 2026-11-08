// 오늘의 연습(빈칸 타이핑) 도우미. 서버·브라우저 공용 순수 함수

/** 비교용: 대소문자·문장부호·띄어쓰기 차이는 무시 */
export function normalizeAnswer(s: string) {
  return s
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isCorrect(typed: string, term: string) {
  return normalizeAnswer(typed) !== "" && normalizeAnswer(typed) === normalizeAnswer(term);
}

/** 예문을 [앞, 표현, 뒤]로 나눈다. 예문에 표현이 없으면 null */
export function splitExample(example: string, term: string): [string, string, string] | null {
  const i = example.toLowerCase().indexOf(term.toLowerCase());
  if (i < 0) return null;
  return [example.slice(0, i), example.slice(i, i + term.length), example.slice(i + term.length)];
}

/** 한국어 뜻에서 번역문에 실제로 들어 있는 조각을 찾아 [앞, 조각, 뒤]로. 못 찾으면 null */
export function splitKorean(exampleKo: string, ko: string): [string, string, string] | null {
  const pieces = ko
    .replace(/\([^)]*\)/g, "")
    .replace(/~/g, "")
    .split(/[,/·]|\s+또는\s+/)
    .map((x) => x.trim())
    .filter((x) => x.length >= 2)
    .sort((a, b) => b.length - a.length);
  for (const p of pieces) {
    // 끝 글자(어미)가 달라도 찾을 수 있게 두 글자까지 줄여 본다
    for (let len = p.length; len >= Math.max(2, p.length - 2); len--) {
      const part = p.slice(0, len);
      const i = exampleKo.indexOf(part);
      if (i >= 0) return [exampleKo.slice(0, i), part, exampleKo.slice(i + part.length)];
    }
  }
  return null;
}
