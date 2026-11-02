"use server";

import { revalidatePath } from "next/cache";
import { requireTeacher } from "@/lib/classroom/dal";
import { createServerSupabaseClient } from "@/lib/supabase";

function refresh() {
  revalidatePath("/teacher/sales");
  revalidatePath("/teacher/crm");
}

/** 결제 한 건 추가. 이름이 학생 한 명과 정확히 맞으면 그 학생에게 연결한다 */
export async function addPurchase(formData: FormData) {
  await requireTeacher();
  const text = (k: string, max = 80) => String(formData.get(k) ?? "").trim().slice(0, max) || null;
  const buyer = text("buyer_name", 40);
  const paidOn = text("paid_on", 10);
  const amount = Math.round(Number(String(formData.get("amount") ?? "").replace(/[^0-9]/g, "")));
  if (!buyer || !paidOn || !/^\d{4}-\d{2}-\d{2}$/.test(paidOn) || !amount) return;
  const supabase = createServerSupabaseClient();
  const { data: matches } = await supabase.from("students").select("id").eq("name", buyer).neq("approval", "rejected").limit(2);
  await supabase.from("purchases").insert({
    student_id: matches?.length === 1 ? matches[0].id : null,
    buyer_name: buyer,
    paid_on: paidOn,
    amount,
    source: text("source"),
    method: text("method"),
    product: text("product"),
    kind: text("kind", 20),
    note: text("note", 200),
  });
  refresh();
}

export async function deletePurchase(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  if (!/^[0-9a-f-]{36}$/.test(id)) return;
  await createServerSupabaseClient().from("purchases").delete().eq("id", id);
  refresh();
}
