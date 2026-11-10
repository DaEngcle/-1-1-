import Link from "next/link";
import { lessonHref, type Roleplay } from "@/lib/classroom/roleplays";
import type { LessonParts } from "@/lib/classroom/lesson-progress";

/** 상황 하나의 할 일 세 줄 (리스닝 → 표현 연습 → 롤플레잉) + 이어서 하기 버튼 */
export function lessonPartLinks(r: Pick<Roleplay, "id" | "job" | "n" | "lines">, p: LessonParts) {
  const base = lessonHref(r);
  return [
    { key: "listen", label: `리스닝 연습 ${r.lines.length}개`, sub: "듣고 뜻 고르기 → 문장 확인", href: `${base}?part=listen`, done: p.listen },
    { key: "phrase", label: "표현 연습", sub: "떠올리기 → 순서 → 빈칸 → 말하기", href: `${base}?part=phrase`, done: p.phrase },
    { key: "roleplay", label: "롤플레잉 해보기", sub: "상대 말에 영어로 답하기", href: `/student/roleplay/${r.id}`, done: p.roleplay > 0 },
  ];
}

export function LessonTodo({ lesson: r, parts, heading }: { lesson: Roleplay; parts: LessonParts; heading: string }) {
  const rows = lessonPartLinks(r, parts);
  const next = rows.find((x) => !x.done) ?? rows[0];
  return (
    <section className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-extrabold text-zinc-900">{heading}</h2>
        <span className="text-xs font-bold text-zinc-400">STEP {r.step}</span>
      </div>
      <Link href={lessonHref(r)} className="flex items-center gap-3 rounded-2xl bg-brand-50/70 p-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-2xl">{r.emoji}</span>
        <span className="flex min-w-0 flex-col">
          <span className="font-extrabold text-zinc-900">{r.title}</span>
          <span className="truncate text-xs text-zinc-500">{r.desc}</span>
        </span>
      </Link>
      <ul className="flex flex-col gap-1">
        {rows.map((x) => (
          <li key={x.key}>
            <Link href={x.href} className="flex items-center gap-3 rounded-2xl px-1 py-2">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black ${
                  x.done ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white"
                }`}
              >
                {x.done ? "✓" : ""}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className={`font-bold ${x.done ? "text-zinc-400 line-through" : "text-zinc-900"}`}>{x.label}</span>
                <span className="text-xs text-zinc-500">{x.sub}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href={next.href} className="rounded-2xl bg-brand-600 py-4 text-center text-lg font-extrabold text-white shadow-sm active:translate-y-0.5">
        {rows.every((x) => x.done) ? "다시 하기 ▶" : rows.some((x) => x.done) ? "이어서 하기 ▶" : "학습 시작하기 ▶"}
      </Link>
    </section>
  );
}
