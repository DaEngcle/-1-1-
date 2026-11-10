import type { Metadata } from "next";
import Link from "next/link";
import { requireStudent } from "@/lib/classroom/dal";
import { maskName } from "@/lib/classroom/engagement";
import { catStage } from "@/lib/classroom/cat-stage-data";
import { jobGear } from "@/lib/classroom/cat-gear";
import { courseAccess, getCourseRow, getCourseView } from "@/lib/classroom/course-data";
import { pickToday } from "@/lib/classroom/course";
import { PHRASE_DECKS } from "@/lib/classroom/phrase-decks";
import { ROLEPLAYS } from "@/lib/classroom/roleplays";
import { FREE_ROLEPLAYS_PER_DAY, roleplayUnlimited } from "@/lib/classroom/roleplay-data";
import { getLessonProgress } from "@/lib/classroom/lesson-progress";
import { HUB_KIND_LABEL, curriculumSections, hubSteps, orderedJobs } from "@/lib/classroom/practice-hub";
import { CatSprite } from "@/app/_ui/cat";
import { StepTimeline } from "@/app/_ui/chat/step-timeline";

export const metadata: Metadata = { title: "상황 연습 · 다잉클" };

/** 지금 STEP과 다음 STEP까지만 펼치고 나머지는 접어 둔다 */
const OPEN_SECTIONS = 2;

export default async function PracticeHubPage() {
  const student = await requireStudent();
  const [row, cat] = await Promise.all([getCourseRow(student.id), catStage(student.id)]);
  const access = courseAccess(student);
  const name = student.nickname ?? maskName(student.name);
  const breed = student.catBreed ?? "cheese";
  const view = row?.answers ? await getCourseView(student.id, { ...row, answers: row.answers }, access) : null;
  const lessons = await getLessonProgress(student.id);

  const steps = view ? hubSteps(view.steps) : [];
  const done = view?.done ?? new Set<string>();
  const sections = curriculumSections(steps, done);
  const currentId = steps.find((s) => !done.has(s.id))?.id ?? null;
  const currentSection = Math.max(0, sections.findIndex((sec) => sec.items.some((it) => it.id === currentId)));
  const todayIds = view && row?.answers ? pickToday(steps, done, row.answers.minutes) : [];
  const today = todayIds.map((id) => steps.find((s) => s.id === id)!).filter(Boolean);
  const todayNext = today.find((s) => !done.has(s.id));
  const jobs = orderedJobs(row?.answers?.jobs);
  const courseJobs = new Set(row?.answers?.jobs ?? []);

  return (
    <>
      {view && row?.answers ? (
        <>
          <section className="flex items-center gap-3 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-500 p-5 text-white shadow-lg shadow-brand-900/15">
            <span className="shrink-0 rounded-2xl bg-white/15 p-1.5">
              <CatSprite breed={breed} stage={cat.stage} gear={jobGear(row.answers.jobs, row.answers.jobOther)} mood="happy" className="h-14 w-16" />
            </span>
            <div className="flex min-w-0 flex-col gap-0.5">
              <h1 className="text-xl font-extrabold tracking-tight">{name}님의 맞춤 커리큘럼</h1>
              <p className="text-sm text-brand-100">{row.ai?.summary ?? "내 워홀 코스 순서대로 표현을 익히고, 상황극으로 써 보고, AI와 실전 대화를 해요."}</p>
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-zinc-900">오늘의 학습</h2>
              <span className="text-xs text-zinc-500">
                하루 {row.answers.minutes}분 · {today.filter((s) => done.has(s.id)).length}/{today.length}
              </span>
            </div>
            {today.length === 0 ? (
              <p className="rounded-2xl bg-green-50 px-3 py-2 text-sm font-semibold text-green-800">커리큘럼을 다 끝냈어요. 아래에서 다른 일터도 연습해 보세요.</p>
            ) : (
              <>
                <ul className="flex flex-col gap-2">
                  {today.map((s) => (
                    <li key={s.id}>
                      <Link href={s.href} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black ${
                            done.has(s.id) ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white"
                          }`}
                        >
                          {done.has(s.id) ? "✓" : ""}
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <span className="text-[11px] font-bold text-brand-600">{HUB_KIND_LABEL[s.kind]}</span>
                          <span className={`truncate text-sm font-bold ${done.has(s.id) ? "text-zinc-400 line-through" : "text-zinc-900"}`}>
                            {s.emoji} {s.title}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {todayNext ? (
                  <Link href={todayNext.href} className="rounded-2xl bg-brand-600 py-4 text-center text-lg font-extrabold text-white shadow-sm active:translate-y-0.5">
                    시작하기
                  </Link>
                ) : (
                  <p className="text-center text-sm font-semibold text-green-700">오늘 몫은 다 했어요. 내일 다음 단계가 나와요.</p>
                )}
              </>
            )}
          </section>

          {sections.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-bold text-zinc-500">내 커리큘럼</h2>
              <StepTimeline sections={sections.slice(currentSection, currentSection + OPEN_SECTIONS)} currentId={currentId} />
              {(currentSection > 0 || sections.length > currentSection + OPEN_SECTIONS) && (
                <details className="rounded-2xl bg-white/60 p-2">
                  <summary className="cursor-pointer list-none rounded-xl bg-white px-4 py-3 text-sm font-bold text-brand-700 shadow-sm">전체 STEP 보기 ({sections.length})</summary>
                  <div className="mt-3 px-1">
                    <StepTimeline sections={sections} currentId={null} />
                  </div>
                </details>
              )}
              <p className="text-center text-xs text-zinc-500">
                상황이 바뀌면{" "}
                <Link href="/student/course/start" className="font-bold text-brand-700 underline">
                  코스 질문 다시 하기
                </Link>
                . 커리큘럼이 바로 바뀌어요.
              </p>
            </section>
          )}
        </>
      ) : (
        <>
          <section className="flex items-center gap-3 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-500 p-5 text-white shadow-lg">
            <CatSprite breed={breed} stage={cat.stage} mood="happy" className="h-14 w-16 shrink-0" />
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-extrabold">🎭 상황 연습</h1>
              <p className="text-sm text-brand-100">일터 표현을 문장으로 익히고, 상황극으로 써 보고, AI와 실전 대화까지.</p>
            </div>
          </section>
          <Link href="/student/course/start" className="flex flex-col gap-2 rounded-3xl border-2 border-brand-200 bg-white p-5 shadow-sm">
            <span className="text-lg font-extrabold text-zinc-900">🧭 1분 질문으로 내 커리큘럼 만들기</span>
            <span className="text-sm text-zinc-600">출국 시기·일하고 싶은 곳·걱정되는 것을 알려 주면, 필요한 순서대로 연습을 짜 줘요.</span>
            <span className="mt-1 rounded-2xl bg-brand-600 py-3 text-center font-extrabold text-white">만들기</span>
          </Link>
        </>
      )}

      <section className="flex flex-col gap-2">
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-bold text-zinc-500">일터별로 연습하기</h2>
          {!roleplayUnlimited(student) && <span className="text-[11px] text-zinc-400">무료회원 롤플레잉 하루 {FREE_ROLEPLAYS_PER_DAY}개</span>}
        </div>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {jobs.map((j) => {
            const list = ROLEPLAYS.filter((r) => r.job === j.id);
            const cleared = list.filter((r) => lessons.done(r.id)).length;
            return (
              <li key={j.id}>
                <Link
                  href={`/student/practice/${j.id}`}
                  className={`flex h-full flex-col gap-1 rounded-2xl border bg-white p-3 shadow-sm active:translate-y-0.5 ${courseJobs.has(j.id) ? "border-brand-300" : "border-slate-200"}`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-2xl">{j.emoji}</span>
                  <span className="text-sm font-extrabold leading-snug text-zinc-900">{j.label}</span>
                  <span className="text-[11px] text-zinc-500">
                    {courseJobs.has(j.id) ? "내 일터 · " : ""}상황 {cleared}/{list.length}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold text-zinc-500">표현 모음</h2>
        <ul className="flex flex-col divide-y divide-slate-100 rounded-3xl bg-white px-4 shadow-sm">
          {[
            ...PHRASE_DECKS.filter((d) => d.id !== "jobs").map((d) => ({ href: `/student/voca/p/${d.id}`, title: `${d.emoji} ${d.title}`, sub: d.desc })),
            { href: "/student/voca/p/jobs", title: "🧑‍🍳 직군별 일터 영어 (전체 세트)", sub: "일터 21곳 + 근무·손님 응대 공통 표현" },
            { href: "/student/voca/course", title: "📚 과정별 문장", sub: "수업에서 쉐도잉한 문장을 주차별로" },
            { href: "/student/voca/verbs", title: "🔤 동사 3단변화", sub: "불규칙 동사 90개 (형태 연습)" },
            { href: "/student/talk", title: "🎭 AI 면접 전체", sub: "면접관 캐릭터와 실전 대화 · 끝나면 코칭" },
          ].map((x) => (
            <li key={x.href}>
              <Link href={x.href} className="flex items-center gap-3 py-3">
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-bold text-zinc-900">{x.title}</span>
                  <span className="truncate text-xs text-zinc-500">{x.sub}</span>
                </span>
                <span className="text-zinc-300">›</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
