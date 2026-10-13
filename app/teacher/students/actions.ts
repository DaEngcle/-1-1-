"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";
import { generateLoginCode, hashLoginCode } from "@/lib/classroom/login-code";

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
  if (!name) return { status: "error", message: "이름을 입력해주세요." };

  const supabase = createServerSupabaseClient();
  try {
    const code = await withFreshCode(async (hash) => {
      const { error } = await supabase.from("students").insert({
        name,
        phone: phone || null,
        memo: memo || null,
        login_code_hash: hash,
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
    const code = await withFreshCode(async (hash) => {
      const { error } = await supabase
        .from("students")
        .update({ login_code_hash: hash })
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
