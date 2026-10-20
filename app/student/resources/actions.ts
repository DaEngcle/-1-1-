"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";

/** 유료 자료 구매 신청 → 선생님이 결제 안내 후 열어준다 */
export async function requestPurchase(formData: FormData) {
  const student = await requireStudent();
  const id = String(formData.get("id"));
  if (!/^[0-9a-f-]{36}$/.test(id)) return;
  const supabase = createServerSupabaseClient();
  const { data: resource } = await supabase.from("resources").select("id, price").eq("id", id).maybeSingle();
  if (!resource?.price) return;
  await supabase
    .from("resource_requests")
    .upsert({ resource_id: id, student_id: student.id }, { onConflict: "resource_id,student_id", ignoreDuplicates: true });
  revalidatePath(`/student/resources/${id}`);
  revalidatePath("/student/resources");
  revalidatePath("/teacher/resources");
}
