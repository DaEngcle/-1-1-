import Link from "next/link";
import { ReviewMarquee, ReviewWall } from "@/app/_ui/reviews";
import { InstallAppCard } from "@/app/_ui/pwa";
import { PushToggle } from "@/app/_ui/push-toggle";
import { requireStudent } from "@/lib/classroom/dal";
import { PLANS, isPlanId } from "@/lib/classroom/plans";
import { kstDate } from "@/lib/classroom/stats";

function daysLeft(until: string) {
  const ms =
    new Date(`${until}T00:00:00Z`).getTime() -
    new Date(`${kstDate(new Date())}T00:00:00Z`).getTime();
  return Math.max(0, Math.round(ms / 86400000));
}
import { getStudentStats } from "@/lib/classroom/stats";
import { getCourseProgress } from "@/lib/classroom/progress";
import { ScoreTrendChart } from "@/app/_ui/score-trend-chart";
import { cardClass } from "@/app/_ui/styles";
import { ATTENDANCE_LABEL } from "@/lib/classroom/attendance";
import { getEngagement, getWeeklyRanking } from "@/lib/classroom/engagement";
import { getTests } from "@/lib/classroom/level-test-data";
import { LevelCard } from "@/app/_ui/level-card";
import {
  Badges,
  Missions,
  StudyCalendar,
  WeeklyRanking,
} from "@/app/_ui/engagement";

function StatTile({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className={`${cardClass} flex flex-col gap-1`}>
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-2xl font-bold text-zinc-900">
        {value}
        {unit && (
          <span className="ml-0.5 text-sm font-normal text-zinc-500">
            {unit}
          </span>
        )}
      </span>
    </div>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <span className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
      <span
        className="block h-full bg-brand-500"
        style={{ width: `${percent}%` }}
      />
    </span>
  );
}

export default async function StudentHomePage() {
  const student = await requireStudent();
  const [stats, progressMap, engagement, ranking, tests] = await Promise.all([
    getStudentStats(student.id),
    getCourseProgress([student.id]),
    getEngagement(student.id),
    getWeeklyRanking({ masked: true }),
    getTests(student.id),
  ]);
  const nickname = student.nickname;
  const progress = progressMap.get(student.id)!;
  const totalClasses = Object.values(stats.attendance).reduce(
    (a, b) => a + b,
    0,
  );
  const attended = stats.attendance.present + stats.attendance.late;

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-500 p-5 text-white shadow-lg shadow-brand-900/15">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-14 right-16 h-28 w-28 rounded-full bg-white/10"
        />
        <p className="text-sm text-brand-100">오늘도 한 문장!</p>
        <h1 className="text-2xl font-extrabold tracking-tight">
          {nickname ?? student.name}님, 반가워요 👋
        </h1>
        <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
          <span className="rounded-full bg-white/15 px-3 py-1">
            🔥 {engagement.streak}일 연속
          </span>
          {isPlanId(student.plan) && (
            <span className="rounded-full bg-white/15 px-3 py-1">
              🎫 {PLANS[student.plan].name.replace("다잉클 ", "")}
              {student.accessUntil && ` · D-${daysLeft(student.accessUntil)}`}
            </span>
          )}
          {student.courses.length === 0 && (
            <span className="rounded-full bg-[#ffd23f] px-3 py-1 text-zinc-900">
              🎁 무료회원
            </span>
          )}
          {!nickname && (
            <Link
              href="/student/profile"
              className="rounded-full bg-white px-3 py-1 text-brand-700"
            >
              ✏️ 랭킹 닉네임 정하기
            </Link>
          )}
          <span className="rounded-full bg-white/15 px-3 py-1">
            🎯 오늘 미션 {engagement.missions.filter((m) => m.done).length}/
            {engagement.missions.length}
          </span>
        </div>
        {engagement.nextLesson && (
          <Link
            href={`/student/lessons/${engagement.nextLesson.id}`}
            className="mt-4 flex items-center justify-between gap-3 rounded-2xl border-b-4 border-brand-100 bg-white px-4 py-3 text-brand-700 transition-all active:translate-y-0.5 active:border-b-2"
          >
            <span className="flex min-w-0 flex-col">
              <span className="text-xs font-semibold text-brand-500">
                이어서 공부하기
              </span>
              <span className="truncate font-bold">
                {engagement.nextLesson.label}
              </span>
            </span>
            <span className="shrink-0 text-xl">→</span>
          </Link>
        )}
      </section>

      <InstallAppCard />
      <PushToggle />

      {student.courses.length === 0 && (
        <section className="flex flex-col gap-2 rounded-2xl bg-[#fff8db] p-4 text-zinc-900">
          <p className="font-bold">🎁 무료회원으로 이용 중이에요</p>
          <p className="text-sm text-zinc-700">
            자료실 전자책, 강의 맛보기(과정별 Day 1~3), 레벨테스트를 무료로
            써보세요.
          </p>
          <div className="flex flex-wrap gap-2 text-sm font-semibold">
            <Link
              href="/student/resources"
              className="rounded-full bg-[#ffd23f] px-3 py-1"
            >
              📕 자료 받기
            </Link>
            <Link
              href="/student/lessons?course=bootcamp"
              className="rounded-full bg-white px-3 py-1"
            >
              🎬 강의 맛보기
            </Link>
            <Link
              href="/student/level-test"
              className="rounded-full bg-white px-3 py-1"
            >
              📊 레벨테스트
            </Link>
          </div>
        </section>
      )}

      {student.courses.length === 0 && (
        <section className="flex flex-col gap-3 overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50 py-4 text-zinc-900 shadow-sm">
          <div className="flex items-end justify-between gap-2 px-4">
            <div>
              <p className="text-xs text-zinc-500">
                먼저 들은 분들의 진짜 후기
              </p>
              <p className="text-2xl font-extrabold text-brand-700">
                ⭐ 진짜 수강생 후기
              </p>
            </div>
            <a
              href="#all-reviews"
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-zinc-700 hover:bg-slate-100"
            >
              전체 보기 ↓
            </a>
          </div>
          <ReviewMarquee />
        </section>
      )}

      <LevelCard pre={tests.pre} post={tests.post} href="/student/level-test" />

      <section className="grid grid-cols-3 gap-3">
        <div
          className={`${cardClass} flex flex-col items-center gap-0.5 text-center`}
        >
          <span className="text-xl">🔥</span>
          <span className="text-2xl font-bold text-zinc-900">
            {engagement.streak}
            <span className="ml-0.5 text-sm font-normal text-zinc-500">일</span>
          </span>
          <span className="text-xs text-zinc-500">
            최고 {engagement.bestStreak}일
          </span>
        </div>
        <Link
          href="/student/lessons"
          className={`${cardClass} flex flex-col items-center gap-0.5 text-center hover:border-brand-300`}
        >
          <span className="text-xl">🎬</span>
          <span className="text-2xl font-bold text-zinc-900">
            {progress.videoPercent}
            <span className="ml-0.5 text-sm font-normal text-zinc-500">%</span>
          </span>
          <span className="text-xs text-zinc-500">강의 수강</span>
          <ProgressBar percent={progress.videoPercent} />
        </Link>
        <Link
          href="/student/shadowing"
          className={`${cardClass} flex flex-col items-center gap-0.5 text-center hover:border-brand-300`}
        >
          <span className="text-xl">🎤</span>
          <span className="text-2xl font-bold text-zinc-900">
            {progress.submittedSentences}
            <span className="ml-0.5 text-sm font-normal text-zinc-500">
              /{progress.sentences}
            </span>
          </span>
          <span className="text-xs text-zinc-500">쉐도잉 제출</span>
          <ProgressBar percent={progress.submitPercent} />
        </Link>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Missions missions={engagement.missions} />
        <WeeklyRanking rows={ranking} meId={student.id} />
      </div>

      <StudyCalendar month={engagement.month} />

      <Badges badges={engagement.badges} />

      <section className="grid grid-cols-3 gap-3">
        <StatTile
          label="평균 발음 점수"
          value={stats.averageScore ?? "-"}
          unit={stats.averageScore != null ? "점" : undefined}
        />
        <StatTile
          label="연습한 문장"
          value={stats.practicedSentences}
          unit="개"
        />
        <StatTile
          label="출석률"
          value={
            totalClasses ? Math.round((attended / totalClasses) * 100) : "-"
          }
          unit={totalClasses ? "%" : undefined}
        />
      </section>

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">
          최근 30일 평균 발음 점수
        </h2>
        <ScoreTrendChart data={stats.dailyScores} />
        <p className="mt-1 text-xs text-zinc-500">
          총 {stats.totalSubmissions}회 제출 · 학습한 날 {stats.activeDays}일
          {stats.bestScore != null && ` · 최고 ${stats.bestScore}점`}
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <section className={cardClass}>
          <h2 className="mb-2 font-bold text-zinc-900">
            자주 틀리는 단어 TOP 5
          </h2>
          {stats.weakWords.length === 0 ? (
            <p className="text-sm text-zinc-500">
              채점 결과가 쌓이면 여기에 보여요.
            </p>
          ) : (
            <ol className="flex flex-col gap-1.5 text-sm">
              {stats.weakWords.map((w, i) => (
                <li key={w.word} className="flex justify-between">
                  <span>
                    <span className="mr-2 text-zinc-400">{i + 1}</span>
                    <b>{w.word}</b>
                  </span>
                  <span className="text-zinc-500">
                    {w.count}회 · 평균 {w.avg}점
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className={cardClass}>
          <h2 className="mb-2 font-bold text-zinc-900">출결</h2>
          {totalClasses === 0 ? (
            <p className="text-sm text-zinc-500">아직 출결 기록이 없어요.</p>
          ) : (
            <>
              <p className="mb-2 text-sm text-zinc-700">
                {(
                  Object.keys(
                    ATTENDANCE_LABEL,
                  ) as (keyof typeof ATTENDANCE_LABEL)[]
                )
                  .map(
                    (k) =>
                      `${ATTENDANCE_LABEL[k].label} ${stats.attendance[k]}`,
                  )
                  .join(" · ")}
              </p>
              <ul className="flex flex-col gap-1 text-sm">
                {stats.recentAttendance.map((a) => (
                  <li key={a.class_date} className="flex justify-between">
                    <span className="text-zinc-600">{a.class_date}</span>
                    <span>
                      {ATTENDANCE_LABEL[a.status].icon}{" "}
                      {ATTENDANCE_LABEL[a.status].label}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
      {student.courses.length === 0 && (
        <div
          id="all-reviews"
          className="scroll-mt-6 rounded-3xl bg-white p-4 shadow-sm"
        >
          <ReviewWall tone="light" initial={6} />
        </div>
      )}
    </>
  );
}
