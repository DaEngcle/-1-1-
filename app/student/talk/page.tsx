import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { SCENARIOS, TALK_PASS } from "@/lib/classroom/interview-scenarios";
import { talkAccess } from "@/lib/classroom/talk-access";
import { manwon } from "@/lib/classroom/price";
import { SubmitButton } from "@/app/_ui/submit-button";
import { requestTalkPass } from "./actions";
import { aiReady } from "@/lib/classroom/interview-ai";
import { InterviewerFace } from "@/app/_ui/interviewer-video";

const LEVEL_COLOR: Record<string, string> = {
  쉬움: "bg-green-50 text-green-700",
  보통: "bg-amber-50 text-amber-700",
  어려움: "bg-red-50 text-red-700",
};

export default async function TalkPage() {
  const student = await requireStudent();
  const supabase = createServerSupabaseClient();
  const [access, { data: done }] = await Promise.all([
    talkAccess(student),
    supabase.from("interview_sessions").select("scenario, feedback").eq("student_id", student.id).not("feedback", "is", null),
  ]);
  const best = new Map<string, number>();
  for (const d of done ?? []) {
    const score = (d.feedback as { score?: number } | null)?.score ?? 0;
    best.set(d.scenario as string, Math.max(best.get(d.scenario as string) ?? 0, score));
  }
  const ready = aiReady();

  return (
    <>
      <section className="flex flex-col gap-1 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 p-5 text-white shadow-lg">
        <h1 className="text-2xl font-extrabold">🎭 AI 면접·대화 연습</h1>
        <p className="text-sm text-white/85">
          호주 현지 매니저 캐릭터와 진짜처럼 말로 면접을 봐요. 끝나면 점수와 &lsquo;이렇게 말하면 더 좋아요&rsquo; 코칭이 나와요.
        </p>
        <p className="mt-1 text-xs font-semibold text-white/90">
          {!ready
            ? "🛠 AI 연결 준비 중이에요. 곧 열려요!"
            : access.kind === "free"
              ? access.left > 0
                ? "🎁 무료 체험 1번을 해볼 수 있어요!"
                : "무료 체험을 다 썼어요. 아래 AI 면접 패스로 계속할 수 있어요."
              : `오늘 ${access.left}번 남았어요 (하루 ${access.limit}번)${access.kind === "pass" ? ` · 패스 ~${access.passUntil}` : ""}`}
        </p>
      </section>

      {ready && access.kind === "free" && access.left === 0 && (
        <section className="flex flex-col gap-2 rounded-3xl border-2 border-amber-200 bg-[#FFF8E6] p-4">
          <p className="text-lg font-extrabold text-zinc-900">🎟 {TALK_PASS.name}</p>
          <p className="text-sm text-zinc-700">
            7명의 면접관과 하루 3번까지 · 코칭 리포트 포함 · <b>{manwon(TALK_PASS.price)}</b>
          </p>
          <p className="text-xs text-zinc-500">수강생은 AI 면접이 무료예요 (하루 5번).</p>
          {access.requested ? (
            <p className="rounded-xl bg-green-50 px-3 py-2 text-sm text-green-800">
              ✅ 신청 완료! 선생님이 카톡으로 결제 안내를 보내드려요. 확인되면 바로 열려요.
            </p>
          ) : (
            <form action={requestTalkPass}>
              <SubmitButton className="w-full rounded-xl border-b-4 border-amber-500 bg-[#ffd23f] px-5 py-3 font-extrabold text-zinc-900">
                🛒 {manwon(TALK_PASS.price)}에 패스 신청하기
              </SubmitButton>
            </form>
          )}
        </section>
      )}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SCENARIOS.map((s) => (
          <Link
            key={s.id}
            href={`/student/talk/${s.id}`}
            className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition-transform hover:border-sky-300 active:translate-y-0.5"
          >
            <InterviewerFace id={s.id} look={s.look} className="h-24 w-24 shrink-0" />
            <span className="flex min-w-0 flex-col gap-1">
              <span className="font-extrabold text-zinc-900">
                {s.emoji} {s.title}
              </span>
              <span className="text-xs text-zinc-500">
                {s.name} · {s.roleKo}
              </span>
              <span className="flex flex-wrap items-center gap-1 text-[11px]">
                <span className={`rounded-full px-2 py-0.5 font-semibold ${LEVEL_COLOR[s.level]}`}>{s.level}</span>
                {best.has(s.id) && (
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 font-bold text-sky-700">최고 {best.get(s.id)}점</span>
                )}
              </span>
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
