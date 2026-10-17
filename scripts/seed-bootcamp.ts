import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createServerSupabaseClient, type Lesson } from "../lib/supabase";

type SeedLesson = Omit<Lesson, "id" | "created_at" | "is_published"> & {
  items: string[];
};

/**
 * 부트캠프 60일 커리큘럼(content/bootcamp-curriculum.json)을 lessons에 upsert.
 * 이미 있는 레슨의 공개 여부와, 선생님이 추가한 쉐도잉 문장은 건드리지 않는다.
 * 문장이 하나도 없는 레슨에만 기본 문장(Day 제목 표현)을 넣는다.
 */
async function main() {
  const filePath = join(__dirname, "..", "content", "bootcamp-curriculum.json");
  const seed: SeedLesson[] = JSON.parse(readFileSync(filePath, "utf-8"));
  const supabase = createServerSupabaseClient();

  const { data: lessons, error } = await supabase
    .from("lessons")
    .upsert(
      seed.map((l) => ({
        sort_order: l.sort_order,
        week_number: l.week_number,
        week_title: l.week_title,
        kind: l.kind,
        day_number: l.day_number,
        title: l.title,
        video_url: l.video_url,
        description: l.description,
      })),
      { onConflict: "course_id,sort_order" },
    )
    .select("id, sort_order");

  if (error || !lessons) {
    console.error("레슨 upsert 실패:", error?.message);
    process.exit(1);
  }

  const { data: existingItems } = await supabase
    .from("lesson_items")
    .select("lesson_id");
  const hasItems = new Set((existingItems ?? []).map((i) => i.lesson_id));
  const idByOrder = new Map(lessons.map((l) => [l.sort_order, l.id]));

  const newItems = seed.flatMap((lesson) => {
    const lessonId = idByOrder.get(lesson.sort_order);
    if (!lessonId || hasItems.has(lessonId)) return [];
    return lesson.items.map((sentence, i) => ({
      lesson_id: lessonId,
      item_order: i + 1,
      sentence,
    }));
  });

  if (newItems.length > 0) {
    const { error: itemError } = await supabase
      .from("lesson_items")
      .insert(newItems);
    if (itemError) {
      console.error("쉐도잉 문장 삽입 실패:", itemError.message);
      process.exit(1);
    }
  }

  console.log(`레슨 ${lessons.length}건 upsert, 기본 문장 ${newItems.length}건 추가 완료`);
}

main();
