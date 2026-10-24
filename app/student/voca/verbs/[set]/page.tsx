import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireStudent } from "@/lib/classroom/dal";
import { FREE_VERB_SETS, verbSet, VERB_SETS, hasFullVoca } from "@/lib/classroom/verbs";
import { VerbStudy } from "./verb-study";

export default async function VerbSetPage({ params }: { params: Promise<{ set: string }> }) {
  const student = await requireStudent();
  const { set: raw } = await params;
  const set = verbSet(Number(raw));
  if (!set) notFound();
  if (!hasFullVoca(student) && set.id > FREE_VERB_SETS) redirect("/student/voca/verbs");
  const next = VERB_SETS.find((s) => s.id === set.id + 1);

  return (
    <>
      <Link href="/student/voca/verbs" className="text-sm text-zinc-600 underline">
        ← 세트 목록
      </Link>
      <h1 className="text-xl font-extrabold text-zinc-900">
        세트 {set.id} · {set.title}
      </h1>
      <VerbStudy setId={set.id} verbs={set.verbs} nextSetId={next?.id ?? null} />
    </>
  );
}
