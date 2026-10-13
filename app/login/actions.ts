"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { createSession, deleteSession } from "@/lib/classroom/session";
import {
  hashLoginCode,
  isTeacherPassword,
  normalizeLoginCode,
} from "@/lib/classroom/login-code";

export type LoginState = { error: string } | undefined;

export async function studentLogin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const code = normalizeLoginCode(String(formData.get("code") ?? ""));
  if (code.length !== 8) {
    return { error: "선생님께 받은 8자리 코드를 입력해주세요." };
  }

  const supabase = createServerSupabaseClient();
  const { data: student } = await supabase
    .from("students")
    .select("id, is_active")
    .eq("login_code_hash", hashLoginCode(code))
    .maybeSingle();

  if (!student) {
    return { error: "코드가 올바르지 않아요. 다시 확인해주세요." };
  }
  if (!student.is_active) {
    return { error: "비활성화된 계정이에요. 선생님께 문의해주세요." };
  }

  await createSession({ role: "student", studentId: student.id });
  redirect("/student");
}

export async function teacherLogin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!isTeacherPassword(password)) {
    return { error: "비밀번호가 올바르지 않아요." };
  }
  await createSession({ role: "teacher" });
  redirect("/teacher");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
