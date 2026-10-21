import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireStudent } from "@/lib/classroom/dal";
import { phraseDeck } from "@/lib/classroom/phrase-decks";
import { FREE_VERB_SETS } from "@/lib/classroom/verbs";
import { PhraseStudy } from "./phrase-study";

export default async function PhraseSetPage({ params }: { params: Promise<{ deck: string; set: string }> }) {
  const student = await requireStudent();
  const { deck: deckId, set: raw } = await params;
  const deck = phraseDeck(deckId);
  const set = deck?.sets.find((x) => x.id === Number(raw));
  if (!deck || !set) notFound();
  if (student.courses.length === 0 && set.id > FREE_VERB_SETS) redirect(`/student/voca/p/${deck.id}`);
  const next = deck.sets.find((x) => x.id === set.id + 1);
  return (
    <>
      <Link href={`/student/voca/p/${deck.id}`} className="text-sm text-zinc-600 underline">
        ← {deck.title}
      </Link>
      <h1 className="text-xl font-extrabold text-zinc-900">
        {set.emoji} 세트 {set.id} · {set.title}
      </h1>
      <PhraseStudy
        deckId={deck.id}
        quizLabel={deck.quizLabel}
        setId={set.id}
        items={set.items}
        nextHref={next ? `/student/voca/p/${deck.id}/${next.id}` : null}
      />
    </>
  );
}
