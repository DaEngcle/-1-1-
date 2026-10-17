"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";
import { generateLoginCode, hashLoginCode } from "@/lib/classroom/login-code";
import { accessUntil, isPlanId } from "@/lib/classroom/plans";
import { kstDate } from "@/lib/classroom/stats";

export type StudentFormState =
  | { status: "success"; name: string; code: string }
  | { status: "error"; message: string }
  | undefined;

/** 코드 해시 충돌(극히 드묾) 시 재시도하며 insert/update */
async function withFreshCode(
  run: (hash: string) => Promise<{ code?: string } | null>,
): Promise<string> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = generateLoginCode();
    const result = await run(hashLoginCode(code));
    if (result?.code !== "23505") return code;
  }
  throw new Error("로그인 코드 생성에 실패했어요.");
}

export async function createStudent(
  _prev: StudentFormState,
  formData: FormData,
): Promise<StudentFormState> {
  await requireTeacher();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/[^0-9]/g, "");
  const memo = String(formData.get("memo") ?? "").trim();
  const plan = String(formData.get("plan") ?? "bootcamp");
  if (!name) return { status: "error", message: "이름을 입력해주세요." };
  if (!isPlanId(plan)) return { status: "error", message: "수강권을 선택해주세요." };

  const supabase = createServerSupabaseClient();
  if (phone) {
    const { data: dup } = await supabase.from("students").select("id").eq("phone", phone).maybeSingle();
    if (dup) return { status: "error", message: "이미 등록된 전화번호예요." };
  }
  try {
    const code = await withFreshCode(async (hash) => {
      const { error } = await supabase.from("students").insert({
        name,
        phone: phone || null,
        memo: memo || null,
        login_code_hash: hash,
        plan,
        access_until: accessUntil(plan, kstDate(new Date())),
      });
      if (error && error.code !== "23505") throw new Error(error.message);
      return error;
    });
    revalidatePath("/teacher/students");
    return { status: "success", name, code };
  } catch (e) {
    console.error("학생 등록 실패:", e);
    return { status: "error", message: "등록 중 오류가 발생했어요." };
  }
}

export async function regenerateCode(
  _prev: StudentFormState,
  formData: FormData,
): Promise<StudentFormState> {
  await requireTeacher();
  const id = String(formData.get("id"));
  const name = String(formData.get("name"));
  const supabase = createServerSupabaseClient();
  try {
    const { data: current } = await supabase
      .from("students")
      .select("session_version")
      .eq("id", id)
      .single();
    // 세션 버전을 올려서 예전 코드로 로그인해 둔 기기도 바로 로그아웃시킨다
    const nextVersion = (current?.session_version ?? 1) + 1;
    const code = await withFreshCode(async (hash) => {
      const { error } = await supabase
        .from("students")
        .update({ login_code_hash: hash, session_version: nextVersion })
        .eq("id", id);
      if (error && error.code !== "23505") throw new Error(error.message);
      return error;
    });
    return { status: "success", name, code };
  } catch (e) {
    console.error("코드 재발급 실패:", e);
    return { status: "error", message: "재발급 중 오류가 발생했어요." };
  }
}

export async function setStudentActive(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  const isActive = formData.get("is_active") === "true";
  const supabase = createServerSupabaseClient();
  await supabase.from("students").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/teacher/students");
}

/** 가입 신청 승인: 수강권과 시작일을 정하면 종료일이 자동 계산된다 */
export async function approveStudent(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  const plan = String(formData.get("plan"));
  const start = String(formData.get("start") || kstDate(new Date()));
  if (!isPlanId(plan) || !/^\d{4}-\d{2}-\d{2}$/.test(start)) return;
  const supabase = createServerSupabaseClient();
  await supabase
    .from("students")
    .update({ approval: "approved", is_active: true, plan, access_until: accessUntil(plan, start) })
    .eq("id", id);
  revalidatePath("/teacher/students");
}

export async function rejectStudent(formData: FormData) {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  await supabase.from("students").update({ approval: "rejected", is_active: false }).eq("id", String(formData.get("id")));
  revalidatePath("/teacher/students");
}

/** 수강권·종료일 변경 (연장 포함) */
export async function updatePlan(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  const plan = String(formData.get("plan"));
  const until = String(formData.get("until") ?? "");
  if (!isPlanId(plan) || !/^\d{4}-\d{2}-\d{2}$/.test(until)) return;
  const supabase = createServerSupabaseClient();
  await supabase.from("students").update({ plan, access_until: until }).eq("id", id);
  revalidatePath("/teacher/students");
  revalidatePath(`/teacher/students/${id}`);
}
