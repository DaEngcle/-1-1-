import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireStudent } from "@/lib/classroom/dal";
import { SLANG_SETS, slangSet } from "@/lib/classroom/slang";
import { FREE_VERB_SETS } from "@/lib/classroom/verbs";
import { SlangStudy } from "./slang-study";

export default async function SlangSetPage({ params }: { params: Promise<{ set: string }> }) {
  const student = await requireStudent();
  const set = slangSet(Number((await params).set));
  if (!set) notFound();
  if (student.courses.length === 0 && set.id > FREE_VERB_SETS) redirect("/student/voca/slang");
  const next = SLANG_SETS.find((x) => x.id === set.id + 1);
  return (
    <>
      <Link href="/student/voca/slang" className="text-sm text-zinc-600 underline">
        ← 호주 슬랭
      </Link>
      <h1 className="text-xl font-extrabold text-zinc-900">
        {set.emoji} 세트 {set.id} · {set.title}
      </h1>
      <SlangStudy setId={set.id} items={set.items} nextHref={next ? `/student/voca/slang/${next.id}` : null} />
    </>
  );
}
