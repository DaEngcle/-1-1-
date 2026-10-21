"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";

/** AI 면접 패스 구매 신청 → 선생님이 결제 확인 후 열어준다 */
export async function requestTalkPass() {
  const student = await requireStudent();
  const supabase = createServerSupabaseClient();
  await supabase.from("talk_requests").upsert({ student_id: student.id }, { onConflict: "student_id", ignoreDuplicates: true });
  revalidatePath("/student/talk");
  revalidatePath("/teacher/students");
}
