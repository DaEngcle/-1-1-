"use client";

import type { LessonLine } from "@/lib/classroom/curriculum/kit";
import { PhraseStudy } from "@/app/student/voca/p/[deck]/[set]/phrase-study";

/** 상황 핵심 문장 5개로 표현 연습 (기록 키: ex-<직군>-<번호>) */
export function LessonPhrase({ items, deckId, setId, nextHref }: { items: LessonLine[]; deckId: string; setId: number; nextHref: string }) {
  return <PhraseStudy deckId={deckId} quizLabel="표현" setId={setId} items={items} nextHref={nextHref} />;
}
