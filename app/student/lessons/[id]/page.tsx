import Link from "next/link";
import { ClipPlayer } from "@/app/_ui/clip-player";
import { notFound } from "next/navigation";
import { canOpenLesson, PREVIEW_DAYS } from "@/lib/classroom/preview";
import { upgradePlanFor } from "@/lib/classroom/plans";
import {
  createServerSupabaseClient,
  type ClassRecording,
  type Lesson,
  type LessonItem,
  type Submission,
} from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { VideoEmbed } from "@/app/_ui/video-embed";
import { TrackedVideo } from "@/app/_ui/tracked-video";
import { youTubeVideoId } from "@/lib/classroom/youtube";
import { SentencePractice, type PracticeResult } from "@/app/_ui/practice/sentence-practice";
import type { WordResult } from "@/lib/classroom/azure-speech";

export default async function StudentLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await requireStudent();
  const supabase = createServerSupabaseClient();

  const { data: lessonRow } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();
  if (!lessonRow) notFound();
  const lesson = lessonRow as Lesson;
  // 수강권에 없는 과정은 맛보기(Day 1~3)만
  const { data: courseRow } = await supabase.from("courses").select("status").eq("id", lesson.course_id).maybeSingle();
  if (!canOpenLesson(student.courses, lesson, courseRow?.status, student.earlyCourses)) notFound();
  const isPreview =
    !(student.courses as string[]).includes(lesson.course_id) && !student.earlyCourses.includes(lesson.course_id);
  const upgrade = upgradePlanFor(lesson.course_id);

  const [
    { data: itemRows },
    { data: recordingRows },
    { data: neighborRows },
    { data: progressRow },
    { data: subRows },
  ] = await Promise.all([
    supabase.from("lesson_items").select("*").eq("lesson_id", id).order("item_order"),
    supabase
      .from("class_recordings")
      .select("*")
      .eq("course_id", lesson.course_id)
      .eq("week_number", lesson.week_number)
      .order("created_at"),
    // 바로 앞·뒤 레슨 (정렬 번호가 띄엄띄엄이어도 찾도록)
    Promise.all([
      supabase
        .from("lessons")
        .select("id, sort_order")
        .eq("is_published", true)
        .eq("course_id", lesson.course_id)
        .lt("sort_order", lesson.sort_order)
        .order("sort_order", { ascending: false })
        .limit(1),
      supabase
        .from("lessons")
        .select("id, sort_order")
        .eq("is_published", true)
        .eq("course_id", lesson.course_id)
        .gt("sort_order", lesson.sort_order)
        .order("sort_order")
        .limit(1),
    ]).then(([p, n]) => ({ data: [...(p.data ?? []), ...(n.data ?? [])] })),
    supabase
      .from("video_progress")
      .select("watched_segments, duration_seconds, last_position")
      .eq("student_id", student.id)
      .eq("lesson_id", id)
      .maybeSingle(),
    // 이 레슨 문장들에 대한 내 제출 (문장 목록을 기다리지 않고 함께 조회)
    supabase
      .from("submissions")
      .select("*, lesson_items!inner(lesson_id)")
      .eq("student_id", student.id)
      .eq("lesson_items.lesson_id", id)
      .order("created_at", { ascending: false }),
  ]);
  const lessonVideoId = youTubeVideoId(lesson.video_url);
  const items = (itemRows ?? []) as LessonItem[];
  const recordings = (recordingRows ?? []) as ClassRecording[];
  const prev = neighborRows?.find((n) => n.sort_order < lesson.sort_order);
  const nextRow = neighborRows?.find((n) => n.sort_order > lesson.sort_order);
  // 맛보기 학생은 맛보기 레슨까지만 다음으로 넘어간다
  const next = isPreview && lesson.day_number != null && lesson.day_number >= PREVIEW_DAYS ? undefined : nextRow;

  // 문장별 가장 최근 제출 결과
  const latest = new Map<string, PracticeResult>();
  for (const s of (subRows ?? []) as Submission[]) {
    if (!latest.has(s.lesson_item_id)) {
      latest.set(s.lesson_item_id, {
        ...s,
        word_details: s.word_details as WordResult[] | null,
      });
    }
  }

  const heading =
    lesson.kind === "day"
      ? `Day ${String(lesson.day_number).padStart(2, "0")} · ${lesson.title}`
      : lesson.title;

  return (
    <>
      <div className="flex flex-col gap-1">
        <Link href={`/student/lessons?course=${lesson.course_id}`} className="text-xs text-zinc-500">
          ← Week {lesson.week_number} · {lesson.week_title}
        </Link>
        <h1 className="text-xl font-bold text-zinc-900">{heading}</h1>
        {lesson.description && <p className="text-sm text-zinc-600">{lesson.description}</p>}
      </div>

      {isPreview && (
        <section className="flex flex-col gap-1 rounded-2xl bg-[#ffd23f] p-4 text-zinc-900">
          <p className="font-bold">🎁 맛보기 강의예요 (Day 1~{PREVIEW_DAYS} 무료 공개)</p>
          <p className="text-sm opacity-90">
            영상도 보고, 쉐도잉 녹음해서 AI 발음 채점까지 받아보세요. 나머지 강의는{" "}
            {upgrade?.name ?? "상위 과정"} 수강생에게 열려요.
          </p>
        </section>
      )}

      {lesson.clip_path && process.env.NEXT_PUBLIC_SUPABASE_URL && (
        <section className="flex flex-col gap-2">
          <h2 className="font-bold text-zinc-900">🎞 교재 영상 <span className="text-xs font-semibold text-zinc-500">원어민 대화</span></h2>
          <ClipPlayer
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/clips/${lesson.clip_path}`}
            title={heading}
          />
        </section>
      )}

      {lesson.video_url && (
        <section className="flex flex-col gap-2">
          <h2 className="font-bold text-zinc-900">🎬 강의 영상</h2>
          {lesson.video_live && (
            <p className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-zinc-600">
              📼 Live 수업 녹화본이에요. VOD 강의가 준비되면 교체될 예정입니다.
            </p>
          )}
          {lessonVideoId ? (
            <TrackedVideo
              lessonId={lesson.id}
              videoId={lessonVideoId}
              title={heading}
              initialSegments={progressRow?.watched_segments ?? []}
              initialDuration={progressRow?.duration_seconds ?? null}
              initialPosition={progressRow?.last_position ?? null}
            />
          ) : (
            <VideoEmbed url={lesson.video_url} title={heading} />
          )}
        </section>
      )}

      {recordings.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="font-bold text-zinc-900">📹 Week {lesson.week_number} 수업 영상</h2>
          {recordings.map((r) => (
            <details key={r.id} className="rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-brand-900/5 p-3">
              <summary className="cursor-pointer text-sm font-medium text-zinc-800">{r.title}</summary>
              <div className="mt-3">
                <VideoEmbed url={r.video_url} title={r.title} />
              </div>
            </details>
          ))}
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="font-bold text-zinc-900">🗣 쉐도잉 연습</h2>
        <p className="text-sm text-zinc-600">
          원어민 음성을 듣고 → 천천히 따라 하고 → 녹음해서 제출하면 AI가 발음·억양을 채점해줘요.
        </p>
        {items.length === 0 && (
          <p className="text-sm text-zinc-500">아직 등록된 문장이 없어요.</p>
        )}
        {items.map((item, i) => (
          <SentencePractice
            key={item.id}
            itemId={item.id}
            index={i + 1}
            sentence={item.sentence}
            translation={item.translation}
            note={item.note}
            initialResult={latest.get(item.id) ?? null}
          />
        ))}
      </section>

      <nav className="flex justify-between text-sm">
        {prev ? <Link href={`/student/lessons/${prev.id}`} className="text-zinc-600 underline">← 이전</Link> : <span />}
        {next ? <Link href={`/student/lessons/${next.id}`} className="text-zinc-600 underline">다음 →</Link> : <span />}
      </nav>
    </>
  );
}
