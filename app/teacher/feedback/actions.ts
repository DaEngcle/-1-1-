"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";

/** 읽음 표시 (확인함 ↔ 새 의견) */
export async function toggleFeedbackDone(id: string, done: boolean) {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  await supabase.from("student_feedback").update({ done }).eq("id", id);
  revalidatePath("/teacher", "layout");
}
