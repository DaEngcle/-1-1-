import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireStudent } from "@/lib/classroom/dal";
import { maskName } from "@/lib/classroom/engagement";
import { CatSprite } from "@/app/_ui/cat";
import { cardClass } from "@/app/_ui/styles";
import { SubmitButton } from "@/app/_ui/submit-button";
import { COURSE_TOPICS, topicPhrases } from "@/lib/classroom/course-topics";
import { COURSE_BONUS_POINTS, courseAccess, getCourseRow, getCourseView } from "@/lib/classroom/course-data";
import type { CourseStep } from "@/lib/classroom/course";
import { toggleTopic } from "./actions";
import { jobGear } from "@/lib/classroom/cat-gear";
import { departureLabel } from "@/lib/classroom/course-questions";
import { catStage } from "@/lib/classroom/cat-stage-data";

export const metadata: Metadata = { title: "내 워홀 코스 · 다잉클" };

const KIND_LABEL = { phrase: "표현", grammar: "문법", talk: "AI 면접", shadowing: "쉐도잉", village: "고양이 마을", roleplay: "상황극" } as const;

export default async function CoursePage() {
  const student = await requireStudent();
  const row = await getCourseRow(student.id);
  if (!row?.answers) redirect("/student/course/start");
  const access = courseAccess(student);
  const [view, cat] = await Promise.all([getCourseView(student.id, { ...row, answers: row.answers }, access), catStage(student.id)]);
  const name = student.nickname ?? maskName(student.name);
  const breed = student.catBreed ?? "cheese";
  const total = view.steps.length;
  const doneCount = view.steps.filter((s) => view.done.has(s.id)).length;
  const percent = total ? Math.round((doneCount / total) * 100) : 0;
  const today = view.todayIds.map((id) => view.steps.find((s) => s.id === id)!).filter(Boolean);
  const { counts } = view.practice;
  const practiceTotal = counts.new + counts.review + counts.wrong;
  const weeks = [...new Set(view.steps.map((s) => s.week))];
  const firstUndone = view.steps.find((s) => !view.done.has(s.id))?.id;
  const more = COURSE_TOPICS.filter((t) => !row.topics.some((c) => c.id === t.id) && topicPhrases(t, access).length > 0);

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-500 p-5 text-white shadow-lg shadow-brand-900/15">
        <div className="relative flex items-center gap-3">
          <span className="shrink-0 rounded-2xl bg-white/15 p-1.5">
            <CatSprite breed={breed} mood={view.todayDone ? "happy" : "default"} gear={jobGear(row.answers.jobs, row.answers.jobOther)} stage={cat.stage} className="h-16 w-20" />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="text-xl font-extrabold tracking-tight">{name}님의 워홀 코스</h1>
            {row.answers.startMonth && (
              <span className="self-start rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold">✈️ {departureLabel(row.answers.startMonth)}</span>
            )}
            {row.ai?.summary && <p className="text-sm text-brand-100">{row.ai.summary}</p>}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/25">
            <span className="block h-full rounded-full bg-white" style={{ width: `${percent}%` }} />
          </span>
          <span className="shrink-0 text-sm font-extrabold">{percent}%</span>
        </div>
        <p className="mt-1 text-xs text-brand-100">
          {doneCount}/{total}단계 완료 · 하루 {row.answers.minutes}분
        </p>
      </section>

      <Link href="/student/practice" className="flex items-center justify-between gap-3 rounded-2xl border-2 border-brand-200 bg-white p-4 shadow-sm active:translate-y-0.5">
        <span className="flex flex-col">
          <span className="font-extrabold text-zinc-900">🎭 상황 연습에서 커리큘럼 보기</span>
          <span className="text-xs text-zinc-500">이 코스 순서대로 표현 익히기 → 상황극 → AI 실전 대화</span>
        </span>
        <span className="text-lg text-brand-600">→</span>
      </Link>

      <section className={`${cardClass} flex flex-col gap-3`}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-extrabold text-zinc-900">✍️ 오늘의 연습</h2>
          <span className="text-xs text-zinc-500">빈칸에 표현을 직접 써 봐요</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "새 표현", n: counts.new },
            { label: "복습", n: counts.review },
            { label: "오늘 틀린 것", n: counts.wrong },
          ].map((c) => (
            <div key={c.label} className="rounded-2xl bg-slate-50 py-2">
              <p className="text-2xl font-extrabold text-zinc-900">{c.n}</p>
              <p className="text-xs text-zinc-500">{c.label}</p>
            </div>
          ))}
        </div>
        {practiceTotal > 0 ? (
          <Link
            href="/student/course/practice"
            className="rounded-2xl border-b-4 border-brand-800 bg-brand-600 px-5 py-3 text-center text-lg font-extrabold text-white transition-all active:translate-y-0.5 active:border-b-2"
          >
            시작
          </Link>
        ) : (
          <p className="rounded-2xl bg-green-50 px-3 py-2 text-center text-sm font-semibold text-green-800">오늘 연습은 다 했어요. 내일 복습할 표현이 또 와요.</p>
        )}
      </section>

      <section className={`${cardClass} flex flex-col gap-2`}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-extrabold text-zinc-900">📌 오늘 할 것</h2>
          <span className="text-xs text-zinc-500">
            {today.filter((s) => view.done.has(s.id)).length}/{today.length}
          </span>
        </div>
        {today.length === 0 ? (
          <p className="text-sm text-green-700">🎉 코스를 다 끝냈어요! 아래에서 토픽을 더 넣을 수 있어요.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {today.map((s) => (
              <StepRow key={s.id} step={s} done={view.done.has(s.id)} next={s.id === firstUndone} />
            ))}
          </ul>
        )}
        {view.bonusGot ? (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">오늘 할 것을 다 해서 츄르 🐟 {COURSE_BONUS_POINTS / 2}개를 받았어요.</p>
        ) : (
          today.length > 0 && <p className="text-xs text-zinc-500">오늘 할 것을 다 하면 츄르 🐟 {COURSE_BONUS_POINTS / 2}개를 더 받아요 (하루 한 번).</p>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold text-zinc-500">내 토픽</h2>
        <ul className="flex flex-col gap-2">
          {view.topics.map((t) => (
            <li key={t.id} className={`${cardClass} flex items-center gap-3`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-2xl">{t.emoji}</span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-bold leading-snug text-zinc-900">{t.title}</span>
                <span className="text-xs text-zinc-500">
                  {t.done}/{t.total} 완료
                </span>
                <span className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <span className="block h-full bg-brand-500" style={{ width: `${t.total ? Math.round((t.done / t.total) * 100) : 0}%` }} />
                </span>
              </span>
              {view.topics.length > 1 && (
                <form action={toggleTopic}>
                  <input type="hidden" name="topic" value={t.id} />
                  <input type="hidden" name="op" value="remove" />
                  <SubmitButton className="shrink-0 rounded-full px-2 py-1 text-xs font-semibold text-zinc-400 hover:bg-slate-100">빼기</SubmitButton>
                </form>
              )}
            </li>
          ))}
        </ul>
        {more.length > 0 && (
          <details className="rounded-2xl bg-white/60 p-1">
            <summary className="cursor-pointer list-none rounded-xl bg-white px-4 py-3 text-sm font-bold text-brand-700 shadow-sm">＋ 토픽 더 넣기 ({more.length})</summary>
            <ul className="mt-2 flex flex-col gap-2">
              {more.map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                  <span className="text-2xl">{t.emoji}</span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-sm font-bold text-zinc-900">{t.title}</span>
                    <span className="truncate text-xs text-zinc-500">{t.desc}</span>
                  </span>
                  <form action={toggleTopic}>
                    <input type="hidden" name="topic" value={t.id} />
                    <input type="hidden" name="op" value="add" />
                    <SubmitButton className="shrink-0 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">넣기</SubmitButton>
                  </form>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold text-zinc-500">전체 코스</h2>
        {weeks.map((w) => {
          const list = view.steps.filter((s) => s.week === w);
          return (
            <div key={w} className="flex flex-col gap-2">
              <p className="text-sm font-extrabold text-zinc-800">
                {w}주차 <span className="font-semibold text-zinc-400">· {list.filter((s) => view.done.has(s.id)).length}/{list.length}</span>
              </p>
              <ul className="flex flex-col gap-2">
                {list.map((s) => (
                  <StepRow key={s.id} step={s} done={view.done.has(s.id)} next={s.id === firstUndone} />
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <p className="text-center text-xs text-zinc-500">
        상황이 바뀌었나요?{" "}
        <Link href="/student/course/start" className="font-bold text-brand-700 underline">
          질문 다시 하기
        </Link>{" "}
        (연습 기록은 그대로 남아요)
      </p>
    </>
  );
}

function StepRow({ step, done, next }: { step: CourseStep; done: boolean; next: boolean }) {
  return (
    <li>
      <Link
        href={step.href}
        className={`flex items-center gap-3 rounded-2xl border p-3 transition-transform active:translate-y-0.5 ${
          done ? "border-slate-200 bg-slate-50" : next ? "border-brand-300 bg-white shadow-sm" : "border-slate-200 bg-white"
        }`}
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${done ? "bg-green-100" : "bg-brand-50"}`}
        >
          {done ? "✓" : step.emoji}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className={`truncate font-bold ${done ? "text-zinc-400 line-through" : "text-zinc-900"}`}>{step.title}</span>
          <span className="truncate text-xs text-zinc-500">
            {KIND_LABEL[step.kind]} · {step.minutes}분{step.why ? ` · ${step.why}` : ""}
          </span>
        </span>
        {!done && <span className="shrink-0 text-lg text-brand-600">{next ? "시작 →" : "→"}</span>}
      </Link>
    </li>
  );
}
