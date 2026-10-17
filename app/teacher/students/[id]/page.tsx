import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getStudentStats } from "@/lib/classroom/stats";
import { getCourseProgress, getLessonProgress } from "@/lib/classroom/progress";
import { getEngagement } from "@/lib/classroom/engagement";
import { getAnswers, getTests } from "@/lib/classroom/level-test-data";
import { SPEAKING_QUESTIONS } from "@/lib/classroom/level-test";
import { LevelCard } from "@/app/_ui/level-card";
import { Badges, StudyCalendar } from "@/app/_ui/engagement";
import { resetLevelTest } from "../../level-tests/actions";
import { ConfirmButton } from "@/app/_ui/confirm-button";
import { ATTENDANCE_LABEL } from "@/lib/classroom/attendance";
import { ScoreTrendChart } from "@/app/_ui/score-trend-chart";
import { SubmissionList } from "../../submission-list";
import { cardClass } from "@/app/_ui/styles";
import { requireTeacher } from "@/lib/classroom/dal";

export default async function TeacherStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireTeacher();
  const { id } = await params;
  const supabase = createServerSupabaseClient();
  const { data: student } = await supabase
    .from("students")
    .select("id, name, phone, memo, is_active, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!student) notFound();
  const [stats, progressMap, lessonRows, engagement, tests] = await Promise.all([
    getStudentStats(id),
    getCourseProgress([id]),
    getLessonProgress(id),
    getEngagement(id),
    getTests(id),
  ]);
  const [preAnswers, postAnswers] = await Promise.all([
    tests.pre ? getAnswers(tests.pre.id) : [],
    tests.post ? getAnswers(tests.post.id) : [],
  ]);
  const testAudioPaths = [...preAnswers, ...postAnswers].map((a) => a.audio_path).filter((p): p is string => Boolean(p));
  const { data: signedTestAudio } = testAudioPaths.length
    ? await supabase.storage.from("shadowing").createSignedUrls(testAudioPaths, 60 * 60)
    : { data: [] };
  const audioUrl = new Map((signedTestAudio ?? []).map((x) => [x.path, x.signedUrl]));
  const progress = progressMap.get(id)!;
  const totalClasses = Object.values(stats.attendance).reduce((a, b) => a + b, 0);

  return (
    <>
      <div>
        <Link href="/teacher/students" className="text-xs text-zinc-500">
          ← 학생 목록
        </Link>
        <h1 className="text-xl font-bold text-zinc-900">{student.name}</h1>
        <p className="text-xs text-zinc-500">{[student.phone, student.memo].filter(Boolean).join(" · ")}</p>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          ["🎬 영상 수강", `${progress.videoPercent}% (${progress.completedVideos}/${progress.videoLessons})`],
          ["🎤 쉐도잉 제출", `${progress.submitPercent}% (${progress.submittedSentences}/${progress.sentences})`],
          ["🔥 연속 학습", `${engagement.streak}일 (최고 ${engagement.bestStreak}일)`],
          ["평균 점수", stats.averageScore != null ? `${stats.averageScore}점` : "-"],
          ["연습 문장", `${stats.practicedSentences}개`],
          [
            "출결",
            totalClasses
              ? (Object.keys(ATTENDANCE_LABEL) as (keyof typeof ATTENDANCE_LABEL)[])
                  .filter((k) => stats.attendance[k] > 0)
                  .map((k) => `${ATTENDANCE_LABEL[k].label}${stats.attendance[k]}`)
                  .join(" ")
              : "-",
          ],
        ].map(([label, value]) => (
          <div key={label} className={`${cardClass} flex flex-col gap-1`}>
            <span className="text-xs text-zinc-500">{label}</span>
            <span className="text-lg font-bold text-zinc-900">{value}</span>
          </div>
        ))}
      </section>

      <LevelCard pre={tests.pre} post={tests.post} />

      {(tests.pre || tests.post) && (
        <section className={cardClass}>
          <h2 className="mb-1 font-bold text-zinc-900">레벨테스트 말하기 녹음 비교</h2>
          <p className="mb-2 text-xs text-zinc-500">같은 문장을 수강 전·후에 어떻게 말했는지 들어보세요.</p>
          <ul className="flex flex-col divide-y divide-zinc-100">
            {SPEAKING_QUESTIONS.map((q) => {
              const pre = preAnswers.find((a) => a.question_id === q.id);
              const post = postAnswers.find((a) => a.question_id === q.id);
              return (
                <li key={q.id} className="flex flex-col gap-1 py-2">
                  <span className="text-sm text-zinc-900">{q.sentence}</span>
                  <div className="grid gap-1 sm:grid-cols-2">
                    {[
                      ["수강 전", pre],
                      ["수강 후", post],
                    ].map(([label, a]) => {
                      const ans = a as typeof pre;
                      const url = ans?.audio_path ? audioUrl.get(ans.audio_path) : undefined;
                      return (
                        <div key={label as string} className="flex items-center gap-2 text-xs text-zinc-500">
                          <span className="w-24 shrink-0">
                            {label as string} {ans ? `${ans.score}점` : "-"}
                          </span>
                          {url && <audio src={url} controls preload="none" className="h-8 w-full" />}
                        </div>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-2 flex flex-wrap gap-2">
            {[tests.pre, tests.post].map(
              (t) =>
                t && (
                  <form key={t.id} action={resetLevelTest}>
                    <input type="hidden" name="test_id" value={t.id} />
                    <input type="hidden" name="student_id" value={id} />
                    <ConfirmButton
                      message={`${t.kind === "pre" ? "수강 전" : "수강 후"} 테스트 결과와 녹음을 지울까요? 학생이 다시 봐야 해요.`}
                      className="text-xs text-red-600 underline"
                    >
                      {t.kind === "pre" ? "수강 전" : "수강 후"} 테스트 초기화 (다시 보게 하기)
                    </ConfirmButton>
                  </form>
                ),
            )}
          </div>
        </section>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <StudyCalendar month={engagement.month} />
        <Badges badges={engagement.badges} />
      </div>

      <section className={cardClass}>
        <h2 className="mb-1 font-bold text-zinc-900">레슨별 진도</h2>
        <p className="mb-2 text-xs text-zinc-500">공개된 레슨만 보여요. 영상은 90% 이상 보면 수강 완료예요.</p>
        {lessonRows.length === 0 ? (
          <p className="text-sm text-zinc-500">공개된 레슨이 없어요.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-500">
                  <th className="py-1 pr-2 font-normal">레슨</th>
                  <th className="py-1 pr-2 font-normal">🎬 영상</th>
                  <th className="py-1 font-normal">🎤 쉐도잉</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {lessonRows.map(({ lesson, videoPercent, videoCompleted, sentences, submitted }) => (
                  <tr key={lesson.id}>
                    <td className="py-1.5 pr-2">
                      <span className="text-xs text-zinc-500">
                        W{lesson.week_number} ·{" "}
                        {lesson.kind === "day" ? `Day ${String(lesson.day_number).padStart(2, "0")}` : "Drill"}
                      </span>{" "}
                      <span className="text-zinc-800">{lesson.kind === "day" ? lesson.title : ""}</span>
                    </td>
                    <td className={`whitespace-nowrap py-1.5 pr-2 ${videoCompleted ? "text-green-700" : "text-zinc-600"}`}>
                      {videoPercent == null ? "-" : videoCompleted ? "✅ 완료" : `${videoPercent}%`}
                    </td>
                    <td
                      className={`whitespace-nowrap py-1.5 ${
                        sentences > 0 && submitted === sentences ? "text-green-700" : "text-zinc-600"
                      }`}
                    >
                      {sentences === 0 ? "-" : submitted === sentences ? "✅ 제출" : `${submitted}/${sentences}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">최근 30일 평균 발음 점수</h2>
        <ScoreTrendChart data={stats.dailyScores} />
      </section>

      {stats.weakWords.length > 0 && (
        <section className={cardClass}>
          <h2 className="mb-2 font-bold text-zinc-900">자주 틀리는 단어</h2>
          <p className="text-sm text-zinc-700">
            {stats.weakWords.map((w) => `${w.word} (${w.count}회, 평균 ${w.avg}점)`).join(" · ")}
          </p>
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="font-bold text-zinc-900">제출 기록</h2>
        <SubmissionList studentId={id} limit={50} />
      </section>
    </>
  );
}
