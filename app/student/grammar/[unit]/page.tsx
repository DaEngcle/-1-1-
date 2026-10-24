import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireStudent } from "@/lib/classroom/dal";
import { hasFullVoca } from "@/lib/classroom/verbs";
import { FREE_GRAMMAR_UNITS, grammarUnit } from "@/lib/classroom/grammar";
import { GrammarStudy } from "./grammar-study";

export default async function GrammarUnitPage({ params }: { params: Promise<{ unit: string }> }) {
  const student = await requireStudent();
  const n = Number((await params).unit);
  const unit = grammarUnit(n);
  if (!unit) notFound();
  if (!hasFullVoca(student) && n > FREE_GRAMMAR_UNITS) redirect("/student/grammar");
  const next = grammarUnit(n + 1);

  return (
    <>
      <Link href="/student/grammar" className="text-sm text-zinc-600 underline">
        ← 문법 유닛 목록
      </Link>
      <h1 className="text-xl font-extrabold text-zinc-900">
        {unit.emoji} Unit {unit.unit} · {unit.title}
      </h1>
      <GrammarStudy unit={unit} nextUnit={next && (hasFullVoca(student) || next.unit <= FREE_GRAMMAR_UNITS) ? next.unit : null} />
    </>
  );
}
