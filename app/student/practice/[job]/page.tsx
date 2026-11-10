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
import { ROLEPLAY_STEPS, TOPIC_FOR_JOB, roleplaysFor, type RoleplayJob } from "@/lib/classroom/roleplays";
import { FREE_ROLEPLAYS_PER_DAY, getRoleplayStars, roleplayQuota } from "@/lib/classroom/roleplay-data";
import { scenario as talkScenario } from "@/lib/classroom/interview-scenarios";
import { talkAccess } from "@/lib/classroom/talk-access";
import { aiReady } from "@/lib/classroom/interview-ai";
import { InterviewerFace } from "@/app/_ui/interviewer-video";
import { StepTimeline, type TimelineSection } from "@/app/_ui/chat/step-timeline";

export const metadata: Metadata = { title: "상황 연습 · 다잉클" };

const TABS = [
  { id: "phrase", label: "① 표현 익히기" },
  { id: "roleplay", label: "② 상황극" },
  { id: "talk", label: "③ 실전 대화" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default async function PracticeJobPage({
  params,
  searchParams,
}: {
  params: Promise<{ job: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const student = await requireStudent();
  const { job: raw } = await params;
  const job = JOBS.find((j) => j.id === raw && j.id !== "other");
  if (!job) notFound();
  const jobId = job.id as RoleplayJob;
  const { tab: rawTab } = await searchParams;
  const tab: Tab = TABS.some((t) => t.id === rawTab) ? (rawTab as Tab) : "phrase";

  return (
    <>
      <Link href="/student/practice" className="text-sm text-zinc-600 underline">
        ← 상황 연습
      </Link>
      <h1 className="text-2xl font-extrabold text-zinc-900">
        {job.emoji} {job.label}
      </h1>
      <nav className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1 text-sm font-bold">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/student/practice/${jobId}?tab=${t.id}`}
            replace
            className={`rounded-xl py-2 text-center ${tab === t.id ? "bg-white text-brand-700 shadow-sm" : "text-zinc-500"}`}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      {tab === "phrase" && <PhraseTab jobId={jobId} student={student} />}
      {tab === "roleplay" && <RoleplayTab jobId={jobId} student={student} />}
      {tab === "talk" && <TalkTab jobId={jobId} student={student} />}
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
      <p className="text-sm text-zinc-600">이 일터에서 매일 쓰는 표현을 문장째로 외워요. 다 하면 상황극에서 바로 써 봐요.</p>
      <StepTimeline sections={[{ title: "표현 세트", items }]} currentId={current} />
      <Link href={`/student/practice/${jobId}?tab=roleplay`} className="rounded-2xl bg-white py-3 text-center font-extrabold text-brand-700 ring-2 ring-brand-100">
        ② 상황극으로 써 보기 →
      </Link>
    </section>
  );
}

async function RoleplayTab({ jobId, student }: { jobId: RoleplayJob; student: Student }) {
  const [stars, quota] = await Promise.all([getRoleplayStars(student.id), roleplayQuota(student)]);
  const list = roleplaysFor(jobId);
  const sections: TimelineSection[] = ROLEPLAY_STEPS.map((st) => ({
    title: st.title,
    items: list
      .filter((r) => r.step === st.step)
      .map((r) => ({
        id: r.id,
        emoji: r.emoji,
        title: r.title,
        tag: `${r.who} · ${r.turns.length}턴`,
        desc: r.desc,
        href: `/student/roleplay/${r.id}`,
        done: (stars.get(r.id) ?? 0) > 0,
        stars: stars.get(r.id) ?? 0,
      })),
  })).filter((s) => s.items.length > 0);
  const current = list.find((r) => !(stars.get(r.id) ?? 0))?.id ?? null;
  return (
    <section className="flex flex-col gap-3">
      <p className="text-sm text-zinc-600">상대 말을 듣고, 한국어 미션대로 영어로 답해요. 말로 해도 되고 써도 돼요. AI 없이 핵심 표현이 들어갔는지로 별을 매겨요.</p>
      {!quota.unlimited && (
        <p className="rounded-2xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
          무료회원은 하루 {FREE_ROLEPLAYS_PER_DAY}개까지 · 오늘 {quota.left}개 남았어요 (오늘 한 건 다시 해도 안 세요)
        </p>
      )}
      <StepTimeline sections={sections} currentId={current} />
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
