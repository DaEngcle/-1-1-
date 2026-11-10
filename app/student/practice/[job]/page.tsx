import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { JOBS } from "@/lib/classroom/course-questions";
import { courseTopic } from "@/lib/classroom/course-topics";
import { SCENARIO_FOR_JOB } from "@/lib/classroom/course";
import { phraseDeck } from "@/lib/classroom/phrase-decks";
import { hasFullVoca, phraseSetLocked } from "@/lib/classroom/verbs";
import { TOPIC_FOR_JOB, jobSteps, lessonHref, roleplaysFor, type RoleplayJob } from "@/lib/classroom/roleplays";
import { FREE_ROLEPLAYS_PER_DAY, roleplayQuota } from "@/lib/classroom/roleplay-data";
import { getLessonProgress, nextLesson } from "@/lib/classroom/lesson-progress";
import { scenario as talkScenario } from "@/lib/classroom/interview-scenarios";
import { talkAccess } from "@/lib/classroom/talk-access";
import { aiReady } from "@/lib/classroom/interview-ai";
import { InterviewerFace } from "@/app/_ui/interviewer-video";
import { StepTimeline, type TimelineSection } from "@/app/_ui/chat/step-timeline";
import { LessonTodo } from "./lesson-todo";

export const metadata: Metadata = { title: "상황 연습 · 다잉클" };

export default async function PracticeJobPage({ params }: { params: Promise<{ job: string }> }) {
  const student = await requireStudent();
  const { job: raw } = await params;
  const job = JOBS.find((j) => j.id === raw && j.id !== "other");
  if (!job) notFound();
  const jobId = job.id as RoleplayJob;
  const [progress, quota] = await Promise.all([getLessonProgress(student.id), roleplayQuota(student)]);
  const list = roleplaysFor(jobId);
  const next = nextLesson(list, progress);
  const doneCount = list.filter((r) => progress.done(r.id)).length;
  const sections: TimelineSection[] = jobSteps(jobId).map((st) => {
    const items = list.filter((r) => r.step === st.step);
    return {
      title: `STEP ${st.step} · ${st.title}`,
      sub: `${items.filter((r) => progress.done(r.id)).length}/${items.length}`,
      items: items.map((r) => {
        const p = progress.parts(r.id);
        return {
          id: r.id,
          emoji: r.emoji,
          title: r.title,
          tag: `${p.listen ? "✓" : "○"} 리스닝 · ${p.phrase ? "✓" : "○"} 표현 · ${p.roleplay ? "✓" : "○"} 롤플레잉`,
          desc: r.desc,
          href: lessonHref(r),
          done: progress.done(r.id),
          stars: p.roleplay,
        };
      }),
    };
  });

  return (
    <>
      <Link href="/student/practice" className="text-sm text-zinc-600 underline">
        ← 상황 연습
      </Link>
      <div className="flex items-end justify-between gap-2">
        <h1 className="text-2xl font-extrabold text-zinc-900">
          {job.emoji} {job.label} 실전 연습
        </h1>
        <span className="shrink-0 text-sm font-bold text-brand-700">
          {doneCount}/{list.length}
        </span>
      </div>
      <span className="block h-2 overflow-hidden rounded-full bg-slate-100">
        <span className="block h-full rounded-full bg-brand-600" style={{ width: `${(doneCount / Math.max(1, list.length)) * 100}%` }} />
      </span>

      {next ? (
        <LessonTodo lesson={next} parts={progress.parts(next.id)} heading="오늘의 학습" />
      ) : (
        <p className="rounded-3xl bg-green-50 p-4 text-sm font-semibold text-green-800">이 일터 상황 {list.length}개를 다 끝냈어요! 아래에서 다시 하거나 AI 실전 대화로 넘어가 보세요.</p>
      )}

      {!quota.unlimited && (
        <p className="rounded-2xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
          무료회원은 롤플레잉 하루 {FREE_ROLEPLAYS_PER_DAY}개까지 · 오늘 {quota.left}개 남았어요. 리스닝·표현 연습은 제한 없어요.
        </p>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-extrabold text-zinc-900">🎭 {job.label} 커리큘럼</h2>
        <StepTimeline sections={sections} currentId={next?.id ?? null} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-extrabold text-zinc-900">🗣️ AI 실전 대화</h2>
        <TalkTab jobId={jobId} student={student} />
      </section>

      <details className="rounded-3xl bg-white p-4 shadow-sm">
        <summary className="cursor-pointer list-none text-sm font-bold text-zinc-700">📚 이 일터 표현 세트 더 보기</summary>
        <div className="mt-3">
          <PhraseTab jobId={jobId} student={student} />
        </div>
      </details>
    </>
  );
}

type Student = Awaited<ReturnType<typeof requireStudent>>;

async function PhraseTab({ jobId, student }: { jobId: RoleplayJob; student: Student }) {
  const topic = courseTopic(TOPIC_FOR_JOB[jobId]);
  const sets = (topic?.sets ?? [])
    .map(([d, s]) => {
      const deck = phraseDeck(d);
      const set = deck?.sets.find((x) => x.id === s);
      return deck && set ? { deck, set } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);
  const { data } = await createServerSupabaseClient().from("voca_progress").select("deck, stars").eq("student_id", student.id);
  const stars = new Map((data ?? []).map((r) => [r.deck as string, (r.stars as number) ?? 0]));
  const full = hasFullVoca(student);
  const items = sets.map(({ deck, set }) => ({
    id: `${deck.id}-${set.id}`,
    emoji: set.emoji,
    title: set.title,
    tag: `${deck.title} · 예문 ${set.items.length}개`,
    desc: "예문을 문장째로 듣고 → 순서 맞추고 → 빈칸에 쓰고 → 보고 말해요.",
    href: `/student/voca/p/${deck.id}/${set.id}`,
    done: (stars.get(`${deck.id}-${set.id}`) ?? 0) > 0,
    stars: stars.get(`${deck.id}-${set.id}`) ?? 0,
    locked: phraseSetLocked(full, deck.id, set.id),
  }));
  const current = items.find((x) => !x.done && !x.locked)?.id ?? null;
  return (
    <section className="flex flex-col gap-3">
      <p className="text-sm text-zinc-600">일터에서 자주 쓰는 표현을 세트로 더 외워요.</p>
      <StepTimeline sections={[{ title: "표현 세트", items }]} currentId={current} />
    </section>
  );
}

async function TalkTab({ jobId, student }: { jobId: RoleplayJob; student: Student }) {
  const id = SCENARIO_FOR_JOB[jobId];
  const s = id ? talkScenario(id) : null;
  const ready = aiReady();
  const access = await talkAccess(student);
  return (
    <section className="flex flex-col gap-3">
      <p className="text-sm text-zinc-600">AI 면접관과 진짜처럼 대화해요. 대답은 정해져 있지 않아요. 끝나면 코칭 리포트가 나와요.</p>
      {s ? (
        <Link href={`/student/talk/${s.id}`} className="flex items-center gap-3 rounded-3xl border-2 border-brand-200 bg-white p-3 shadow-sm active:translate-y-0.5">
          <InterviewerFace id={s.id} look={s.look} className="h-20 w-20 shrink-0" />
          <span className="flex min-w-0 flex-col gap-1">
            <span className="font-extrabold text-zinc-900">
              {s.emoji} {s.title}
            </span>
            <span className="text-xs text-zinc-500">
              {s.name} · {s.roleKo} · {s.level}
            </span>
            <span className="text-xs font-bold text-brand-700">시작하기 →</span>
          </span>
        </Link>
      ) : (
        <p className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-zinc-600">
          이 일터 전용 AI 면접은 아직 없어요. 비슷한 면접으로 연습해 보세요.{" "}
          <Link href="/student/talk" className="font-bold text-brand-700 underline">
            AI 면접 전체
          </Link>
        </p>
      )}
      <p className="text-xs text-zinc-500">
        {!ready
          ? "AI 연결 준비 중이에요."
          : access.kind === "free"
            ? access.left > 0
              ? "무료 체험 1번을 할 수 있어요."
              : "무료 체험을 다 썼어요. AI 면접 패스로 계속할 수 있어요."
            : `오늘 ${access.left}번 남았어요 (하루 ${access.limit}번)`}
      </p>
    </section>
  );
}
