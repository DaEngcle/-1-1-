"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { starsFor } from "@/lib/classroom/verbs";
import { addVocaPlay } from "@/lib/classroom/engagement";

/** 게임 한 판 결과 저장: 최고 점수·별은 더 좋을 때만 올린다 */
export async function saveVocaResult(deck: string, percent: number, wrong: string[]) {
  const student = await requireStudent();
  if (!/^[a-z0-9-]{1,40}$/.test(deck)) return;
  const score = Math.max(0, Math.min(100, Math.round(percent)));
  const supabase = createServerSupabaseClient();
  const { data: cur } = await supabase
    .from("voca_progress")
    .select("best, stars, plays")
    .eq("student_id", student.id)
    .eq("deck", deck)
    .maybeSingle();
  await supabase.from("voca_progress").upsert({
    student_id: student.id,
    deck,
    best: Math.max(cur?.best ?? 0, score),
    stars: Math.max(cur?.stars ?? 0, starsFor(score)),
    plays: (cur?.plays ?? 0) + 1,
    wrong: wrong.slice(0, 20),
    updated_at: new Date().toISOString(),
  });
  await addVocaPlay(student.id);
  revalidatePath("/student/voca", "layout");
  revalidatePath("/student");
}
