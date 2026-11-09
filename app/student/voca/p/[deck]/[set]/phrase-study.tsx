"use client";

import type { Phrase } from "@/lib/classroom/phrase-decks";
import { QuizGame, shuffle, type QuizQuestion } from "../../../quiz-game";
import { SentenceSteps } from "../../../sentence-steps";

function buildQuestions(items: Phrase[], label: string, only?: string[]): QuizQuestion[] {
  const picked = only ? items.filter((x) => only.includes(x.term)) : shuffle(items);
  return picked.map((x) => {
    const others = shuffle(items.filter((o) => o.term !== x.term)).slice(0, 3);
    const kind = Math.floor(Math.random() * 3);
    const review = `${x.term} = ${x.ko} · ${x.example}`;
    if (kind === 0) {
      return {
        key: x.term,
        label: `${label} · 뜻 고르기`,
        prompt: x.term,
        hint: "이 표현의 뜻은?",
        answer: x.ko,
        choices: shuffle([x.ko, ...others.map((o) => o.ko)]),
        speak: x.term,
        review,
        note: x.note,
      };
    }
    if (kind === 1) {
      return {
        key: x.term,
        label: `${label} · 영어로 말하면?`,
        prompt: `“${x.ko}”`,
        hint: "영어로는 뭐라고 할까요?",
        answer: x.term,
        choices: shuffle([x.term, ...others.map((o) => o.term)]),
        speak: x.term,
        review,
      };
    }
    // 예문 빈칸
    const at = x.example.toLowerCase().indexOf(x.term.toLowerCase());
    return {
      key: x.term,
      label: `${label} · 빈칸 채우기`,
      ...(at >= 0
        ? { blank: { before: x.example.slice(0, at), after: x.example.slice(at + x.term.length) } }
        : { prompt: x.example }),
      hint: `💬 ${x.example_ko}`,
      answer: x.term,
      choices: shuffle([x.term, ...others.map((o) => o.term)]),
      speak: x.example,
      review,
    };
  });
}

export function PhraseStudy({
  deckId,
  quizLabel,
  setId,
  items,
  nextHref,
}: {
  deckId: string;
  quizLabel: string;
  setId: number;
  items: Phrase[];
  nextHref: string | null;
}) {
  const deck = `${deckId}-${setId}`;
  return (
    <SentenceSteps
      key={deck}
      items={items}
      deck={deck}
      quiz={<QuizGame deck={deck} nextHref={nextHref} build={(only) => buildQuestions(items, quizLabel, only)} />}
    />
  );
}
