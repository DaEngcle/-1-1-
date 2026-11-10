import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStudent } from "@/lib/classroom/dal";
import { jobSteps, lessonHref, listenDeck, roleplay, roleplaysFor, type RoleplayJob } from "@/lib/classroom/roleplays";
import { getLessonProgress } from "@/lib/classroom/lesson-progress";
import { LessonTodo } from "../lesson-todo";
import { ListeningDrill } from "./listening";
import { LessonPhrase } from "./lesson-phrase";

export const metadata: Metadata = { title: "상황 연습 · 다잉클" };

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ job: string; n: string }>;
  searchParams: Promise<{ part?: string }>;
}) {
  const student = await requireStudent();
  const { job, n } = await params;
  const r = roleplay(`${job}-${n}`);
  if (!r || !/^\d+$/.test(n)) notFound();
  const { part } = await searchParams;
  const list = roleplaysFor(r.job);
  const after = list[list.findIndex((x) => x.id === r.id) + 1] ?? null;
  const stepTitle = jobSteps(r.job as RoleplayJob)[r.step - 1]?.title ?? "";
  const here = lessonHref(r);

  if (part === "listen" || part === "phrase") {
    return (
      <>
        <Link href={here} className="text-sm text-zinc-600 underline">
          ← {r.emoji} {r.title}
        </Link>
        <h1 className="text-xl font-extrabold text-zinc-900">{part === "listen" ? "🎧 리스닝 연습" : "✍️ 표현 연습"}</h1>
        {part === "listen" ? (
          <ListeningDrill items={r.lines} deck={listenDeck(r.id)} nextHref={`${here}?part=phrase`} nextLabel="표현 연습으로" />
        ) : (
          <LessonPhrase items={r.lines} deckId={`ex-${r.job}`} setId={r.n} nextHref={`/student/roleplay/${r.id}`} />
        )}
      </>
    );
  }

  const progress = await getLessonProgress(student.id);
  return (
    <>
      <Link href={`/student/practice/${r.job}`} className="text-sm text-zinc-600 underline">
        ← 커리큘럼
      </Link>
      <p className="text-xs font-bold text-brand-600">
        STEP {r.step} · {stepTitle}
      </p>
      <LessonTodo lesson={r} parts={progress.parts(r.id)} heading={`${r.title}`} />
      <section className="flex flex-col gap-2 rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-extrabold text-zinc-700">이 상황의 핵심 문장</h2>
        <p className="text-xs text-zinc-500">리스닝을 먼저 하면 영어 문장이 보여요. 답부터 보지 말고 들어 보세요!</p>
        <ul className="flex flex-col gap-1.5">
          {r.lines.map((x) => (
            <li key={x.example} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-zinc-700">
              {progress.parts(r.id).listen ? (
                <>
                  <span className="font-semibold text-zinc-900">{x.example}</span>
                  <span className="block text-xs text-zinc-500">{x.example_ko}</span>
                </>
              ) : (
                <span>{x.example_ko}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
      {after && (
        <Link href={lessonHref(after)} className="rounded-2xl bg-white py-3 text-center font-bold text-brand-700 ring-2 ring-brand-100">
          다음 상황: {after.emoji} {after.title} →
        </Link>
      )}
    </>
  );
}
