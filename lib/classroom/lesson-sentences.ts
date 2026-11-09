// 과정별 수업 문장(lesson_items의 쉐도잉 문장 + 번역)을 문장 연습 단위로. 서버·브라우저 공용 순수 함수

// 빈칸으로 만들지 않을 쉬운 단어
const STOP = new Set(
  "this that these those there their they them then than what when where which while with would could should have has had been being were your yours you're from into onto about after before because just like really very much many some them they're it's that's what's don't didn't doesn't can't won't isn't aren't wasn't i'm i've i'll you'll we're we'll he's she's here also only even well yeah okay gonna wanna gotta".split(
    " ",
  ),
);

/** 문장에서 빈칸으로 쓸 핵심 단어 후보 (고유명사·쉬운 단어 제외) */
export function keyWords(sentence: string) {
  const words = sentence.split(/\s+/).map((w, idx) => ({ raw: w, clean: w.replace(/^[^A-Za-z]+|[^A-Za-z']+$/g, ""), idx }));
  return words.filter(
    (w) =>
      w.clean.length >= 4 &&
      /^[a-z][a-z']*$/i.test(w.clean) &&
      !w.clean.includes("'") &&
      !STOP.has(w.clean.toLowerCase()) &&
      !(w.idx > 0 && /^[A-Z]/.test(w.clean)), // 문장 중간 대문자 = 이름·지명
  );
}

/** 문장 속 핵심 표현 하나: 긴 단어 중 문장에 한 번만 나오는 것 (칠하기·빈칸 자리가 헷갈리지 않게) */
export function lessonKeyTerm(sentence: string): string {
  const lower = sentence.toLowerCase();
  const once = (w: string) => lower.split(w.toLowerCase()).length === 2;
  const cands = keyWords(sentence)
    .map((w) => w.clean)
    .sort((a, b) => b.length - a.length);
  const pick = cands.find(once);
  if (pick) return pick;
  const any = sentence
    .split(/\s+/)
    .map((w) => w.replace(/^[^A-Za-z]+|[^A-Za-z']+$/g, ""))
    .filter((w) => w.length >= 2)
    .sort((a, b) => b.length - a.length)
    .find(once);
  return any ?? sentence.split(/\s+/)[0];
}

export type LessonSentence = { sentence: string; translation: string };

/** 한 판에 쓸 문장 (최대 n개, 섞어서). 순서 맞추기가 너무 길어지지 않게 25단어 넘는 문장은 뒤로 */
export function lessonSentenceItems(sentences: LessonSentence[], n = 10) {
  const pool = sentences.map((s, i) => ({ ...s, i }));
  for (let k = pool.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [pool[k], pool[j]] = [pool[j], pool[k]];
  }
  const words = (s: string) => s.split(/\s+/).length;
  pool.sort((a, b) => Number(words(a.sentence) > 25) - Number(words(b.sentence) > 25));
  return pool.slice(0, n).map((s) => ({
    key: String(s.i),
    term: lessonKeyTerm(s.sentence),
    ko: "",
    example: s.sentence,
    example_ko: s.translation,
  }));
}
