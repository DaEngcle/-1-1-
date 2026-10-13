import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient, type Lesson, type LessonItem } from "@/lib/supabase";
import { addItems, deleteItem, updateItem } from "../actions";
import { VideoEmbed } from "@/app/_ui/video-embed";
import { cardClass, inputClass, primaryButtonClass, secondaryButtonClass } from "@/app/_ui/styles";

export default async function TeacherLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();
  const [{ data: lessonRow }, { data: itemRows }] = await Promise.all([
    supabase.from("lessons").select("*").eq("id", id).maybeSingle(),
    supabase.from("lesson_items").select("*").eq("lesson_id", id).order("item_order"),
  ]);
  if (!lessonRow) notFound();
  const lesson = lessonRow as Lesson;
  const items = (itemRows ?? []) as LessonItem[];

  return (
    <>
      <div>
        <Link href="/teacher/lessons" className="text-xs text-zinc-500">
          ← 레슨 목록
        </Link>
        <h1 className="text-xl font-bold text-zinc-900">
          {lesson.kind === "day" ? `Day ${String(lesson.day_number).padStart(2, "0")} · ` : ""}
          {lesson.title}
        </h1>
        <p className="text-xs text-zinc-500">
          Week {lesson.week_number} · {lesson.week_title} · {lesson.is_published ? "공개중" : "비공개"}
        </p>
      </div>

      {lesson.video_url && <VideoEmbed url={lesson.video_url} title={lesson.title} />}

      <section className="flex flex-col gap-2">
        <h2 className="font-bold text-zinc-900">쉐도잉 문장 ({items.length})</h2>
        {items.map((item) => (
          <form key={item.id} action={updateItem} className={`${cardClass} flex flex-col gap-2`}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="lesson_id" value={lesson.id} />
            <input name="sentence" defaultValue={item.sentence} required className={inputClass} />
            <input name="translation" defaultValue={item.translation ?? ""} placeholder="해석 (선택)" className={inputClass} />
            <input name="note" defaultValue={item.note ?? ""} placeholder="발음/상황 메모 (선택)" className={inputClass} />
            <div className="flex gap-2">
              <button type="submit" className={secondaryButtonClass}>
                저장
              </button>
              <button type="submit" formAction={deleteItem} className={`${secondaryButtonClass} text-red-600`}>
                삭제
              </button>
            </div>
          </form>
        ))}
      </section>

      <section className={cardClass}>
        <h2 className="mb-1 font-bold text-zinc-900">문장 추가</h2>
        <p className="mb-2 text-xs text-zinc-500">
          교재/영상 대사를 한 줄에 한 문장씩 붙여넣으세요. 해석은 <code>|</code> 뒤에 쓰면 함께 저장돼요.
          <br />예: <code>You&apos;ve got an accent. | 너 억양이 있네.</code>
        </p>
        <form action={addItems} className="flex flex-col gap-2">
          <input type="hidden" name="lesson_id" value={lesson.id} />
          <textarea name="lines" rows={6} required className={`${inputClass} font-mono text-sm`} />
          <button type="submit" className={primaryButtonClass}>
            추가하기
          </button>
        </form>
      </section>
    </>
  );
}
