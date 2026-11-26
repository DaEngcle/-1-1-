"use server";

import { revalidatePath } from "next/cache";
import { requireTeacher } from "@/lib/classroom/dal";
import { endSubscription } from "@/lib/classroom/membership-billing";

/** 선생님이 바로 종료 (다음 결제 안 함, 학생은 무료회원으로). 환불은 토스 상점관리자에서 따로 한다 */
export async function endMembership(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id") ?? "");
  if (id) await endSubscription(id);
  revalidatePath("/teacher/memberships");
}
