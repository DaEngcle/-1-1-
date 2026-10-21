"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";

/** 뉴스 퀴즈를 끝내면 읽음 + 점수 기록 */
export async function markNewsRead(newsId: string, score: number) {
  const student = await requireStudent();
  const supabase = createServerSupabaseClient();
  await supabase
    .from("news_reads")
    .upsert({ news_id: newsId, student_id: student.id, quiz_score: Math.max(0, Math.min(100, Math.round(score))) });
  revalidatePath("/student/news");
}
