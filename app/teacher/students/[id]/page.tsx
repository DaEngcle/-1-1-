import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getStudentStats } from "@/lib/classroom/stats";
import { getCourseProgress, getLessonProgress } from "@/lib/classroom/progress";
import { getEngagement } from "@/lib/classroom/engagement";
import { getAnswers, getTests } from "@/lib/classroom/level-test-data";
import { SPEAKING, type SpeakingDetail } from "@/lib/classroom/level-test";
import { SkillBars } from "@/app/_ui/skill-bars";
import { LevelCard } from "@/app/_ui/level-card";
import { Badges, StudyCalendar } from "@/app/_ui/engagement";
import { resetLevelTest } from "../../level-tests/actions";
import { ConfirmButton } from "@/app/_ui/confirm-button";
import {
  addNote,
  deleteNote,
  sendTeacherPush,
  setEarlyCourses,
  setVocaFull,
  setStudentActive,
  updateMemo,
} from "../actions";
import { RegenerateCodeButton, TempPasswordButton } from "../student-forms";
import { CopyButton } from "@/app/_ui/copy-button";
import { getRoster, nudgeMessage, STATUS_INFO } from "@/lib/classroom/roster";
import { headers } from "next/headers";
import { COURSE_SHORT, isTrialPlan, studentCourses } from "@/lib/classroom/plans";
import { PlanEditor } from "./plan-editor";
import { ATTENDANCE_LABEL } from "@/lib/classroom/attendance";
import { ScoreTrendChart } from "@/app/_ui/score-trend-chart";
import { SubmissionList } from "../../submission-list";
import { cardClass } from "@/app/_ui/styles";
import { requireTeacher } from "@/lib/classroom/dal";
import {
  PROFILE_SELECT,
  STAGES,
  isStage,
  type Profile,
} from "@/lib/classroom/profile";
import { ProfileFields } from "../../_ui/profile-fields";
import { updateProfile } from "../../crm/actions";
import { SubmitButton } from "@/app/_ui/submit-button";

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
    .select(
      `id, name, phone, memo, is_active, created_at, plan, courses, access_until, early_courses, ${PROFILE_SELECT}`,
    )
    .eq("id", id)
    .maybeSingle<
      {
        id: string;
        name: string;
        phone: string | null;
        memo: string | null;
        is_active: boolean;
        created_at: string;
        plan: string | null;
        access_until: string | null;
        early_courses: string[] | null;
        courses: string[] | null;
      } & Profile
    >();
  if (!student) notFound();
  const [
    roster,
    { data: noteRows },
    { data: cohortRows },
    { data: buys },
    { data: courseRows },
  ] = await Promise.all([
    getRoster(),
    supabase
      .from("teacher_notes")
      .select("id, body, created_at")
      .eq("student_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("cohorts").select("id, name").order("created_at"),
    supabase
      .from("purchases")
      .select("id, paid_on, amount, product, kind, starts_on, ends_on, source")
      .eq("student_id", id)
      .order("paid_on", { ascending: false }),
    supabase.from("courses").select("id, title, status").order("sort_order"),
  ]);
  const [{ count: pushDevices }, { data: pushLogs }] = await Promise.all([
    supabase
      .from("push_subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("student_id", id),
    supabase
      .from("push_log")
      .select("kind, title, body, sent_at")
      .eq("student_id", id)
      .order("sent_at", { ascending: false })
      .limit(5),
  ]);
  const stage = isStage(student.stage) ? student.stage : "enrolled";
  const me = roster.find((r) => r.id === id);
  const host = (await headers()).get("host") ?? "dingle-classroom.vercel.app";
  const [stats, progressMap, lessonRows, engagement, tests] = await Promise.all(
    [
      getStudentStats(id),
      getCourseProgress([id]),
      getLessonProgress(id),
      getEngagement(id),
      getTests(id),
    ],
  );
  const [preAnswers, postAnswers] = await Promise.all([
    tests.pre ? getAnswers(tests.pre.id) : [],
    tests.post ? getAnswers(tests.post.id) : [],
  ]);
  const testAudioPaths = [...preAnswers, ...postAnswers]
    .map((a) => a.audio_path)
    .filter((p): p is string => Boolean(p));
  const { data: signedTestAudio } = testAudioPaths.length
    ? await supabase.storage
        .from("shadowing")
        .createSignedUrls(testAudioPaths, 60 * 60)
    : { data: [] };
  const audioUrl = new Map(
    (signedTestAudio ?? []).map((x) => [x.path, x.signedUrl]),
  );
  const progress = progressMap.get(id)!;
  const totalClasses = Object.values(stats.attendance).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <>
      <div>
        <Link href="/teacher/students" className="text-xs text-zinc-500">
          ← 학생 목록
        </Link>
        <h1 className="text-xl font-bold text-zinc-900">{student.name}</h1>
        <p className="text-xs text-zinc-500">
          {[student.phone, student.memo].filter(Boolean).join(" · ")}
        </p>
      </div>

      {me && (
        <section className={`${cardClass} flex flex-col gap-3`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-sm font-bold ${STATUS_INFO[me.status].tone}`}
            >
              {STATUS_INFO[me.status].icon} {STATUS_INFO[me.status].label}
            </span>
            <span className="text-xs text-zinc-500">
              최근 활동:{" "}
              {me.daysInactive == null
                ? "없음"
                : me.daysInactive === 0
                  ? "오늘"
                  : `${me.daysInactive}일 전`}{" "}
              · 이번 주 제출 {me.weekSubmissions}개 · 최근 7일 중{" "}
              {me.week.filter(Boolean).length}일 공부
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <CopyButton
              text={nudgeMessage(me, `https://${host}/login`)}
              label="💬 카톡 응원 메시지 복사"
              className="rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-1.5 font-semibold text-brand-700"
            />
            {student.phone && (
              <CopyButton
                text={student.phone}
                label={`📱 ${student.phone}`}
                className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-zinc-600"
              />
            )}
          </div>
        </section>
      )}

      <section className={cardClass}>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold text-zinc-900">🙋 프로필 (상담 정보)</h2>
          {isTrialPlan(student.plan) && (
            <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700">
              🎁 무료 체험 1개월{student.access_until && ` (~${student.access_until})`}
            </span>
          )}
          <Link
            href="/teacher/crm"
            className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${STAGES[stage].tone}`}
          >
            {STAGES[stage].icon} {STAGES[stage].label}
          </Link>
        </div>
        <form action={updateProfile} className="flex flex-col gap-2">
          <input type="hidden" name="id" value={student.id} />
          <ProfileFields profile={student} cohorts={cohortRows ?? []} />
          <SubmitButton className="self-start rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-bold text-white">
            프로필 저장
          </SubmitButton>
        </form>
        {(buys ?? []).length > 0 && (
          <div className="mt-3 border-t border-slate-100 pt-2">
            <h3 className="mb-1 text-sm font-bold text-zinc-800">
              💳 결제 기록
            </h3>
            <ul className="flex flex-col gap-1 text-xs text-zinc-600">
              {(buys ?? []).map((b) => (
                <li key={b.id} className="flex flex-wrap gap-x-2">
                  <span className="text-zinc-400">{b.paid_on}</span>
                  <b className="text-zinc-800">{b.product}</b>
                  {b.amount != null && (
                    <span>{Number(b.amount).toLocaleString("ko-KR")}원</span>
                  )}
                  {b.kind && <span>· {b.kind}</span>}
                  {(b.starts_on || b.ends_on) && (
                    <span>
                      · {b.starts_on ?? "?"} ~ {b.ends_on ?? "?"}
                    </span>
                  )}
                  {b.source && (
                    <span className="text-zinc-400">· {b.source}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section id="push" className={`${cardClass} scroll-mt-6`}>
        <h2 className="mb-1 font-bold text-zinc-900">🔔 알림 보내기</h2>
        {pushDevices ? (
          <>
            <p className="mb-2 text-xs text-zinc-500">
              이 학생은 휴대폰 {pushDevices}대에서 알림을 켰어요. 공부를 안 한
              날은 저녁 8시쯤 자동 알림도 가요.
            </p>
            <form
              action={sendTeacherPush}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <input type="hidden" name="id" value={student.id} />
              <input
                name="body"
                required
                maxLength={140}
                placeholder="예: 오늘 Day 05 쉐도잉 꼭 올려줘요! 응원해요 💪"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <SubmitButton className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">
                보내기
              </SubmitButton>
            </form>
            {(pushLogs ?? []).length > 0 && (
              <ul className="mt-2 flex flex-col gap-1 text-xs text-zinc-500">
                {(pushLogs ?? []).map((l, i) => (
                  <li key={i}>
                    {new Date(l.sent_at).toLocaleString("ko-KR", {
                      timeZone: "Asia/Seoul",
                      dateStyle: "short",
                      timeStyle: "short",
                    })}{" "}
                    ·{" "}
                    {l.kind === "teacher"
                      ? "선생님"
                      : l.kind === "reminder"
                        ? "자동 알림"
                        : l.kind === "paused"
                          ? "알림 쉼"
                          : "안내"}{" "}
                    · {l.body}
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="text-xs text-zinc-500">
            아직 알림을 켜지 않았어요. 학생 홈의 &lsquo;🔔 알림 켜기&rsquo;를
            누르면 여기서 보낼 수 있어요.
          </p>
        )}
      </section>

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">📝 상담·관리 기록</h2>
        <form action={addNote} className="flex flex-col gap-2 sm:flex-row">
          <input type="hidden" name="id" value={student.id} />
          <textarea
            name="body"
            rows={2}
            required
            placeholder="예: 10/18 카톡으로 응원 메시지 보냄 / 레벨테스트 후 상담, r 발음 집중하기로 함"
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <SubmitButton className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">
            기록
          </SubmitButton>
        </form>
        <ul className="mt-3 flex flex-col gap-2">
          {(noteRows ?? []).map((n) => (
            <li
              key={n.id}
              className="flex items-start justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm"
            >
              <span className="whitespace-pre-line text-zinc-800">
                <span className="mr-2 text-xs text-zinc-400">
                  {new Date(n.created_at).toLocaleString("ko-KR", {
                    timeZone: "Asia/Seoul",
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
                {n.body}
              </span>
              <form action={deleteNote}>
                <input type="hidden" name="id" value={student.id} />
                <input type="hidden" name="note_id" value={n.id} />
                <ConfirmButton
                  message="이 기록을 지울까요?"
                  className="text-xs text-zinc-400 hover:text-red-600"
                >
                  삭제
                </ConfirmButton>
              </form>
            </li>
          ))}
          {(noteRows ?? []).length === 0 && (
            <li className="text-xs text-zinc-400">아직 기록이 없어요.</li>
          )}
        </ul>
      </section>

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">계정 관리</h2>
        <form action={updateMemo} className="mb-3 flex gap-2">
          <input type="hidden" name="id" value={student.id} />
          <input
            name="memo"
            defaultValue={student.memo ?? ""}
            placeholder="한 줄 메모 (학생 목록에 보여요)"
            className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
          />
          <SubmitButton className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold">
            저장
          </SubmitButton>
        </form>
        <div className="flex flex-wrap items-start gap-2">
          <form action={setStudentActive}>
            <input type="hidden" name="id" value={student.id} />
            <input
              type="hidden"
              name="is_active"
              value={String(!student.is_active)}
            />
            <ConfirmButton
              message={
                student.is_active
                  ? "이 학생을 비활성화할까요? 로그인할 수 없게 돼요."
                  : "이 학생을 다시 활성화할까요?"
              }
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
            >
              {student.is_active ? "비활성화" : "다시 활성화"}
            </ConfirmButton>
          </form>
          <div className="flex-1">
            {student.phone ? (
              <TempPasswordButton id={student.id} name={student.name} />
            ) : (
              <RegenerateCodeButton id={student.id} name={student.name} />
            )}
          </div>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">수강권</h2>
        <PlanEditor
          id={student.id}
          plan={student.plan}
          courses={studentCourses(student.plan, student.courses)}
          until={student.access_until}
        />
        <p className="mt-1 text-xs text-zinc-500">
          연장은 +개월 버튼이나 종료일만 바꿔 저장하세요. 종료일이 지나면 학생은 로그인할 수 없어요. (무료 체험은 끝나도
          로그인은 되고 강의만 잠겨요.)
        </p>
        {(() => {
          // 수강권에 들어 있지만 아직 '준비 중'이라 미리 열어주기를 안 하면 안 보이는 과정
          const hidden = (courseRows ?? []).filter(
            (c) =>
              c.status !== "open" &&
              studentCourses(student.plan, student.courses).includes(c.id as never) &&
              !(student.early_courses ?? []).includes(c.id),
          );
          return hidden.length > 0 ? (
            <p className="mt-3 rounded-lg bg-amber-50 p-2 text-xs font-semibold text-amber-800">
              ⚠️ 이 수강권에 {hidden.map((c) => c.title).join(", ")}이(가) 들어 있지만 아직 &lsquo;준비 중&rsquo; 과정이라
              학생에게 안 보여요. 보여주려면 아래 &lsquo;미리 열어주기&rsquo;에서 체크하고 저장하세요.
            </p>
          ) : null;
        })()}
        {!student.plan && (
          <form
            action={setVocaFull.bind(null, student.id, !(student.early_courses ?? []).includes("voca"))}
            className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-sm"
          >
            <span className="text-xs font-semibold text-zinc-700">
              🎮 보카·🐤 문법 {(student.early_courses ?? []).includes("voca") ? "전체 열림" : "앞부분만 열림 (무료회원)"}
            </span>
            <SubmitButton className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold">
              {(student.early_courses ?? []).includes("voca") ? "다시 잠그기" : "전체 열어주기"}
            </SubmitButton>
            <span className="w-full text-xs text-zinc-500">수강권 없이 초급반만 듣는 학생 등에게 보카와 기초 문법을 다 열어줄 때 써요.</span>
          </form>
        )}
        {(courseRows ?? []).some((c) => c.status !== "open") && (
          <form
            action={setEarlyCourses}
            className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-sm"
          >
            <input type="hidden" name="id" value={student.id} />
            <span className="text-xs font-semibold text-zinc-700">
              🔑 준비 중인 과정 미리 열어주기
            </span>
            {(courseRows ?? [])
              .filter((c) => c.status !== "open")
              .map((c) => (
                <label
                  key={c.id}
                  className="flex items-center gap-1 text-xs text-zinc-700"
                >
                  <input
                    type="checkbox"
                    name="early"
                    value={c.id}
                    defaultChecked={(student.early_courses ?? []).includes(
                      c.id,
                    )}
                  />
                  {COURSE_SHORT[c.id] ?? c.title}
                </label>
              ))}
            <SubmitButton className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold">
              저장
            </SubmitButton>
            <span className="w-full text-xs text-zinc-500">
              다른 학생에게는 계속 &lsquo;준비 중&rsquo;으로 보이고, 체크한
              학생만 공개된 레슨을 볼 수 있어요.
            </span>
          </form>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          [
            "🎬 영상 수강",
            `${progress.videoPercent}% (${progress.completedVideos}/${progress.videoLessons})`,
          ],
          [
            "🎤 쉐도잉 제출",
            `${progress.submitPercent}% (${progress.submittedSentences}/${progress.sentences})`,
          ],
          [
            "🔥 연속 학습",
            `${engagement.streak}일 (최고 ${engagement.bestStreak}일)`,
          ],
          [
            "평균 점수",
            stats.averageScore != null ? `${stats.averageScore}점` : "-",
          ],
          ["연습 문장", `${stats.practicedSentences}개`],
          [
            "출결",
            totalClasses
              ? (
                  Object.keys(
                    ATTENDANCE_LABEL,
                  ) as (keyof typeof ATTENDANCE_LABEL)[]
                )
                  .filter((k) => stats.attendance[k] > 0)
                  .map(
                    (k) => `${ATTENDANCE_LABEL[k].label}${stats.attendance[k]}`,
                  )
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

      {(tests.post?.skills ?? tests.pre?.skills) && (
        <section className={cardClass}>
          <h2 className="mb-2 font-bold text-zinc-900">5가지 실력</h2>
          <SkillBars
            current={(tests.post?.skills ?? tests.pre?.skills)!}
            previous={tests.post?.skills ? tests.pre?.skills : null}
          />
        </section>
      )}

      {(tests.pre || tests.post) && (
        <section className={cardClass}>
          <h2 className="mb-1 font-bold text-zinc-900">
            레벨테스트 말하기 답변
          </h2>
          <p className="mb-2 text-xs text-zinc-500">
            같은 질문에 수강 전·후 어떻게 대답했는지 들어보세요. 글자는 AI가
            받아 적은 내용이에요.
          </p>
          <ul className="flex flex-col divide-y divide-zinc-100">
            {SPEAKING.map((q) => {
              const pre = preAnswers.find((a) => a.question_id === q.id);
              const post = postAnswers.find((a) => a.question_id === q.id);
              return (
                <li key={q.id} className="flex flex-col gap-1 py-2">
                  <span className="text-sm font-medium text-zinc-900">
                    {q.question}
                  </span>
                  <div className="grid gap-1 sm:grid-cols-2">
                    {[
                      ["수강 전", pre],
                      ["수강 후", post],
                    ].map(([label, a]) => {
                      const ans = a as typeof pre;
                      const url = ans?.audio_path
                        ? audioUrl.get(ans.audio_path)
                        : undefined;
                      return (
                        <div
                          key={label as string}
                          className="flex flex-col gap-1 text-xs text-zinc-500"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-24 shrink-0">
                              {label as string} {ans ? `${ans.score}점` : "-"}
                            </span>
                            {url && (
                              <audio
                                src={url}
                                controls
                                preload="none"
                                className="h-8 w-full"
                              />
                            )}
                          </div>
                          {(ans?.detail as SpeakingDetail | null)
                            ?.transcript && (
                            <p className="rounded-lg bg-slate-50 px-2 py-1 text-zinc-700">
                              &ldquo;
                              {(ans!.detail as SpeakingDetail).transcript}
                              &rdquo;
                              <span className="ml-1 text-zinc-400">
                                · 발음{" "}
                                {(ans!.detail as SpeakingDetail).accuracy} ·
                                유창성 {(ans!.detail as SpeakingDetail).fluency}{" "}
                                · 단어{" "}
                                {(ans!.detail as SpeakingDetail).uniqueWords}개
                              </span>
                            </p>
                          )}
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
                      {t.kind === "pre" ? "수강 전" : "수강 후"} 테스트 초기화
                      (다시 보게 하기)
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
        <p className="mb-2 text-xs text-zinc-500">
          공개된 레슨만 보여요. 영상은 90% 이상 보면 수강 완료예요.
        </p>
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
                {lessonRows.map(
                  ({
                    lesson,
                    videoPercent,
                    videoCompleted,
                    sentences,
                    submitted,
                  }) => (
                    <tr key={lesson.id}>
                      <td className="py-1.5 pr-2">
                        <span className="text-xs text-zinc-500">
                          W{lesson.week_number} ·{" "}
                          {lesson.kind === "day"
                            ? `Day ${String(lesson.day_number).padStart(2, "0")}`
                            : "Drill"}
                        </span>{" "}
                        <span className="text-zinc-800">
                          {lesson.kind === "day" ? lesson.title : ""}
                        </span>
                      </td>
                      <td
                        className={`whitespace-nowrap py-1.5 pr-2 ${videoCompleted ? "text-green-700" : "text-zinc-600"}`}
                      >
                        {videoPercent == null
                          ? "-"
                          : videoCompleted
                            ? "✅ 완료"
                            : `${videoPercent}%`}
                      </td>
                      <td
                        className={`whitespace-nowrap py-1.5 ${
                          sentences > 0 && submitted === sentences
                            ? "text-green-700"
                            : "text-zinc-600"
                        }`}
                      >
                        {sentences === 0
                          ? "-"
                          : submitted === sentences
                            ? "✅ 제출"
                            : `${submitted}/${sentences}`}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">
          최근 30일 평균 발음 점수
        </h2>
        <ScoreTrendChart data={stats.dailyScores} />
      </section>

      {stats.weakWords.length > 0 && (
        <section className={cardClass}>
          <h2 className="mb-2 font-bold text-zinc-900">자주 틀리는 단어</h2>
          <p className="text-sm text-zinc-700">
            {stats.weakWords
              .map((w) => `${w.word} (${w.count}회, 평균 ${w.avg}점)`)
              .join(" · ")}
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
