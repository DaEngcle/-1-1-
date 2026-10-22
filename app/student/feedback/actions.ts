"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";

const KINDS = ["inconvenient", "idea", "praise"] as const;

/** 가끔 뜨는 '불편한 점·바라는 기능' 질문에 답하기 */
export async function sendFeedback(kind: string, message: string, page: string) {
  const student = await requireStudent();
  const text = message.trim().slice(0, 2000);
  if (!text) return { ok: false };
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("student_feedback").insert({
    student_id: student.id,
    kind: (KINDS as readonly string[]).includes(kind) ? kind : "idea",
    message: text,
    page: page.slice(0, 200),
  });
  if (error) {
    console.error(error);
    return { ok: false };
  }
  revalidatePath("/teacher/feedback");
  return { ok: true };
}
