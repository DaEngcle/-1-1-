import Link from "next/link";
import { notFound } from "next/navigation";
import {
  createServerSupabaseClient,
  type ClassRecording,
  type Lesson,
  type LessonItem,
  type Submission,
} from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { VideoEmbed } from "@/app/_ui/video-embed";
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

  const [{ data: itemRows }, { data: recordingRows }, { data: neighborRows }] = await Promise.all([
    supabase.from("lesson_items").select("*").eq("lesson_id", id).order("item_order"),
    supabase
      .from("class_recordings")
      .select("*")
      .eq("week_number", lesson.week_number)
      .order("created_at"),
    supabase
      .from("lessons")
      .select("id, sort_order")
      .eq("is_published", true)
      .in("sort_order", [lesson.sort_order - 1, lesson.sort_order + 1]),
  ]);
  const items = (itemRows ?? []) as LessonItem[];
  const recordings = (recordingRows ?? []) as ClassRecording[];
  const prev = neighborRows?.find((n) => n.sort_order === lesson.sort_order - 1);
  const next = neighborRows?.find((n) => n.sort_order === lesson.sort_order + 1);

  // 문장별 가장 최근 제출 결과
  const latest = new Map<string, PracticeResult>();
  if (items.length > 0) {
    const { data: subs } = await supabase
      .from("submissions")
      .select("*")
      .eq("student_id", student.id)
      .in("lesson_item_id", items.map((i) => i.id))
      .order("created_at", { ascending: false });
    for (const s of (subs ?? []) as Submission[]) {
      if (!latest.has(s.lesson_item_id)) {
        latest.set(s.lesson_item_id, {
          ...s,
          word_details: s.word_details as WordResult[] | null,
        });
      }
    }
  }

  const heading =
    lesson.kind === "day"
      ? `Day ${String(lesson.day_number).padStart(2, "0")} · ${lesson.title}`
      : lesson.title;

  return (
    <>
      <div className="flex flex-col gap-1">
        <Link href="/student/lessons" className="text-xs text-zinc-500">
          ← Week {lesson.week_number} · {lesson.week_title}
        </Link>
        <h1 className="text-xl font-bold text-zinc-900">{heading}</h1>
        {lesson.description && <p className="text-sm text-zinc-600">{lesson.description}</p>}
      </div>

      {lesson.video_url && (
        <section className="flex flex-col gap-2">
          <h2 className="font-bold text-zinc-900">🎬 교재 영상</h2>
          <VideoEmbed url={lesson.video_url} title={heading} />
        </section>
      )}

      {recordings.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="font-bold text-zinc-900">📹 Week {lesson.week_number} 수업 영상</h2>
          {recordings.map((r) => (
            <details key={r.id} className="rounded-xl border border-zinc-200 bg-white p-3">
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
