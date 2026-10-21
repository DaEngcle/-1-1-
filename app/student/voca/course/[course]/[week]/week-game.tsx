"use client";

import { QuizGame, shuffle, type QuizQuestion } from "../../../quiz-game";

type Sentence = { sentence: string; translation: string };

// 빈칸으로 만들지 않을 쉬운 단어
const STOP = new Set(
  "this that these those there their they them then than what when where which while with would could should have has had been being were your yours you're from into onto about after before because just like really very much many some them they're it's that's what's don't didn't doesn't can't won't isn't aren't wasn't i'm i've i'll you'll we're we'll he's she's here also only even well yeah okay gonna wanna gotta".split(
    " ",
  ),
);

/** 문장에서 빈칸으로 쓸 핵심 단어 후보 (고유명사·쉬운 단어 제외) */
function keyWords(sentence: string) {
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

function buildQuestions(sentences: Sentence[], only?: string[]): QuizQuestion[] {
  const pool = sentences.map((s, n) => ({ ...s, key: String(n), words: keyWords(s.sentence) }));
  const allWords = [...new Set(pool.flatMap((p) => p.words.map((w) => w.clean.toLowerCase())))];
  const picked = only ? pool.filter((p) => only.includes(p.key)) : shuffle(pool).slice(0, 10);
  return picked.map((p) => {
    const listen = p.words.length === 0 || Math.random() < 0.35;
    if (listen) {
      // 듣고 뜻 고르기
      const others = shuffle(pool.filter((o) => o.translation !== p.translation)).slice(0, 3).map((o) => o.translation);
      return {
        key: p.key,
        prompt: <b>🎧 잘 듣고, 무슨 뜻인지 골라보세요</b>,
        answer: p.translation,
        choices: shuffle([p.translation, ...others]),
        speakOnShow: p.sentence,
        speak: p.sentence,
        review: `${p.sentence} = ${p.translation}`,
      };
    }
    // 빈칸 채우기: 긴 단어일수록 핵심일 가능성이 높다
    const target = shuffle([...p.words].sort((a, b) => b.clean.length - a.clean.length).slice(0, 3))[0];
    const answer = target.clean.toLowerCase();
    const wrong = shuffle(allWords.filter((w) => w !== answer && Math.abs(w.length - answer.length) <= 4)).slice(0, 3);
    const tokens = p.sentence.split(/\s+/);
    return {
      key: p.key,
      prompt: (
        <span>
          {tokens.map((t, n) =>
            n === target.idx ? (
              <span key={n}>
                {t.slice(0, t.indexOf(target.clean))}
                <span className="mx-0.5 inline-block min-w-16 rounded-md border-b-4 border-violet-400 bg-violet-50 px-2 font-bold text-violet-400">
                  ?
                </span>
                {t.slice(t.indexOf(target.clean) + target.clean.length)}{" "}
              </span>
            ) : (
              <span key={n}>{t} </span>
            ),
          )}
        </span>
      ),
      hint: `💬 ${p.translation}`,
      answer,
      choices: shuffle([answer, ...wrong]),
      speak: p.sentence,
      review: `${p.sentence} (${p.translation})`,
    };
  });
}

export function WeekGame({ deck, sentences, nextHref }: { deck: string; sentences: Sentence[]; nextHref: string | null }) {
  return <QuizGame deck={deck} seconds={15} nextHref={nextHref} build={(only) => buildQuestions(sentences, only)} />;
}
