"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";
import { isLostReason, isStage, profileFromForm } from "@/lib/classroom/profile";

const isId = (v: string) => /^[0-9a-f-]{36}$/.test(v);

function refresh(id?: string) {
  revalidatePath("/teacher/crm");
  revalidatePath("/teacher/students");
  if (id) revalidatePath(`/teacher/students/${id}`);
}

/** 상담 카드 추가: 로그인 계정 없이 프로필만 만든다 (등록하면 학생이 가입할 때 합치기) */
export async function addLead(formData: FormData) {
  await requireTeacher();
  const name = String(formData.get("name") ?? "").trim().slice(0, 40);
  if (!name) return;
  const phone = String(formData.get("phone") ?? "").replace(/[^0-9]/g, "") || null;
  const stage = String(formData.get("stage") ?? "consulted");
  const memo = String(formData.get("note") ?? "").trim().slice(0, 2000);
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("students")
    .insert({
      name,
      phone,
      ...profileFromForm(formData),
      stage: isStage(stage) ? stage : "consulted",
      approval: "lead",
      is_active: false,
    })
    .select("id")
    .single();
  if (error) {
    console.error("상담 카드 추가 실패:", error);
    return;
  }
  if (memo) await supabase.from("teacher_notes").insert({ student_id: data.id, body: memo });
  refresh();
}

/** 프로필 저장 (학생 상세·상담 카드 공통) */
export async function updateProfile(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  if (!isId(id)) return;
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("students").update(profileFromForm(formData)).eq("id", id);
  if (error) console.error("프로필 저장 실패:", error);
  refresh(id);
}

/** 고객 단계·미등록 사유·후속 조치 빠르게 바꾸기 */
export async function updateFollowUp(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  if (!isId(id)) return;
  const patch: Record<string, unknown> = {};
  const stage = formData.get("stage");
  if (isStage(stage)) {
    patch.stage = stage;
    // 등록으로 바꾸면 학생 목록에 보이도록 (가입하면 계정이 합쳐짐)
    if (stage === "enrolled") Object.assign(patch, { approval: "approved", is_active: true });
  }
  const reason = formData.get("lost_reason");
  if (reason != null) patch.lost_reason = isLostReason(reason) ? reason : null;
  // 체크박스는 체크 안 하면 값이 안 와서, toggles=1 표시가 있으면 없는 것 = false
  if (formData.get("toggles") === "1") {
    for (const k of ["called", "link_sent", "free_vod"] as const) patch[k] = formData.get(k) === "true";
  }
  const gift = formData.get("gift_sent");
  if (gift != null) patch.gift_sent = String(gift).trim().slice(0, 120) || null;
  if (Object.keys(patch).length === 0) return;
  const supabase = createServerSupabaseClient();
  await supabase.from("students").update(patch).eq("id", id);
  refresh(id);
}

/** 기수 만들기 */
export async function addCohort(formData: FormData) {
  await requireTeacher();
  const name = String(formData.get("name") ?? "").trim().slice(0, 40);
  if (!name) return;
  const course = String(formData.get("course_id") ?? "");
  const starts = String(formData.get("starts_on") ?? "");
  const supabase = createServerSupabaseClient();
  await supabase.from("cohorts").insert({
    name,
    course_id: course || null,
    starts_on: /^\d{4}-\d{2}-\d{2}$/.test(starts) ? starts : null,
  });
  refresh();
}

/** 상담 카드 삭제 (계정 없는 상담 기록만) */
export async function deleteLead(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  if (!isId(id)) return;
  const supabase = createServerSupabaseClient();
  await supabase.from("students").delete().eq("id", id).eq("approval", "lead");
  refresh();
}
