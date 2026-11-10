"use client";

import { keyWords } from "@/lib/classroom/lesson-sentences";
import { QuizGame, shuffle, type QuizQuestion } from "../../../quiz-game";
import { SentenceSteps, type SentenceItem } from "../../../sentence-steps";

type Sentence = { sentence: string; translation: string };

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
        label: "🎧 듣고 뜻 고르기",
        prompt: "무슨 뜻일까요?",
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
    const word = tokens[target.idx];
    const at = word.indexOf(target.clean);
    const pre = tokens.slice(0, target.idx).join(" ");
    const rest = tokens.slice(target.idx + 1).join(" ");
    const before = (pre ? `${pre} ` : "") + word.slice(0, at);
    const after = word.slice(at + target.clean.length) + (rest ? ` ${rest}` : "");
    return {
      key: p.key,
      label: "✏️ 빈칸 채우기",
      blank: { before, after },
      hint: `💬 ${p.translation}`,
      answer,
      choices: shuffle([answer, ...wrong]),
      speak: p.sentence,
      review: `${p.sentence} (${p.translation})`,
    };
  });
}

/** 과정별 수업 문장: 문장 연습 4단계가 기본, 예전 고르기 게임은 '빠른 퀴즈' */
export function WeekGame({
  deck,
  sentences,
  items,
  nextHref,
}: {
  deck: string;
  sentences: Sentence[];
  items: SentenceItem[];
  nextHref: string | null;
}) {
  return (
    <SentenceSteps
      items={items}
      deck={deck}
      quiz={<QuizGame deck={deck} seconds={15} nextHref={nextHref} build={(only) => buildQuestions(sentences, only)} />}
    />
  );
}
