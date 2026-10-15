import Link from "next/link";
import { requireStudent } from "@/lib/classroom/dal";
import { getStudentStats } from "@/lib/classroom/stats";
import { getCourseProgress } from "@/lib/classroom/progress";
import { ScoreTrendChart } from "@/app/_ui/score-trend-chart";
import { cardClass } from "@/app/_ui/styles";
import { ATTENDANCE_LABEL } from "@/lib/classroom/attendance";

function StatTile({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className={`${cardClass} flex flex-col gap-1`}>
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-2xl font-bold text-zinc-900">
        {value}
        {unit && <span className="ml-0.5 text-sm font-normal text-zinc-500">{unit}</span>}
      </span>
    </div>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <span className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
      <span className="block h-full bg-yellow-400" style={{ width: `${percent}%` }} />
    </span>
  );
}

export default async function StudentHomePage() {
  const student = await requireStudent();
  const [stats, progressMap] = await Promise.all([
    getStudentStats(student.id),
    getCourseProgress([student.id]),
  ]);
  const progress = progressMap.get(student.id)!;
  const totalClasses = Object.values(stats.attendance).reduce((a, b) => a + b, 0);
  const attended = stats.attendance.present + stats.attendance.late;

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-zinc-900">{student.name}님, 오늘도 한 문장! 💪</h1>
        <Link href="/student/lessons" className="text-sm font-semibold text-yellow-700 underline">
          부트캠프 복습하러 가기 →
        </Link>
      </div>

      <section className="grid grid-cols-2 gap-3">
        <Link href="/student/lessons" className={`${cardClass} flex flex-col gap-1.5 hover:border-yellow-400`}>
          <span className="text-xs text-zinc-500">🎬 영상 수강률</span>
          <span className="text-2xl font-bold text-zinc-900">
            {progress.videoPercent}
            <span className="ml-0.5 text-sm font-normal text-zinc-500">%</span>
          </span>
          <ProgressBar percent={progress.videoPercent} />
          <span className="text-xs text-zinc-500">
            {progress.completedVideos}/{progress.videoLessons} 레슨 수강 완료
          </span>
        </Link>
        <Link href="/student/shadowing" className={`${cardClass} flex flex-col gap-1.5 hover:border-yellow-400`}>
          <span className="text-xs text-zinc-500">🎤 쉐도잉 제출</span>
          <span className="text-2xl font-bold text-zinc-900">
            {progress.submitPercent}
            <span className="ml-0.5 text-sm font-normal text-zinc-500">%</span>
          </span>
          <ProgressBar percent={progress.submitPercent} />
          <span className="text-xs text-zinc-500">
            {progress.submittedSentences}/{progress.sentences} 문장 제출
          </span>
        </Link>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="연속 학습" value={stats.streakDays} unit="일" />
        <StatTile label="평균 발음 점수" value={stats.averageScore ?? "-"} unit={stats.averageScore != null ? "점" : undefined} />
        <StatTile label="연습한 문장" value={stats.practicedSentences} unit="개" />
        <StatTile
          label="출석률"
          value={totalClasses ? Math.round((attended / totalClasses) * 100) : "-"}
          unit={totalClasses ? "%" : undefined}
        />
      </section>

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">최근 30일 평균 발음 점수</h2>
        <ScoreTrendChart data={stats.dailyScores} />
        <p className="mt-1 text-xs text-zinc-500">
          총 {stats.totalSubmissions}회 제출 · 학습한 날 {stats.activeDays}일
          {stats.bestScore != null && ` · 최고 ${stats.bestScore}점`}
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <section className={cardClass}>
          <h2 className="mb-2 font-bold text-zinc-900">자주 틀리는 단어 TOP 5</h2>
          {stats.weakWords.length === 0 ? (
            <p className="text-sm text-zinc-500">채점 결과가 쌓이면 여기에 보여요.</p>
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
                {(Object.keys(ATTENDANCE_LABEL) as (keyof typeof ATTENDANCE_LABEL)[])
                  .map((k) => `${ATTENDANCE_LABEL[k].label} ${stats.attendance[k]}`)
                  .join(" · ")}
              </p>
              <ul className="flex flex-col gap-1 text-sm">
                {stats.recentAttendance.map((a) => (
                  <li key={a.class_date} className="flex justify-between">
                    <span className="text-zinc-600">{a.class_date}</span>
                    <span>
                      {ATTENDANCE_LABEL[a.status].icon} {ATTENDANCE_LABEL[a.status].label}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </>
  );
}
