"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { createSession, deleteSession } from "@/lib/classroom/session";
import {
  hashLoginCode,
  isTeacherPassword,
  normalizeLoginCode,
  teacherPasswordFingerprint,
} from "@/lib/classroom/login-code";
import {
  checkLoginBlocked,
  clearLoginFailures,
  recordLoginFailure,
} from "@/lib/classroom/rate-limit";

export type LoginState = { error: string } | undefined;

function blockedMessage(waitMinutes: number) {
  return `로그인 시도가 너무 많아요. ${waitMinutes}분 뒤에 다시 시도해주세요.`;
}

export async function studentLogin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const code = normalizeLoginCode(String(formData.get("code") ?? ""));
  if (code.length !== 8) {
    return { error: "선생님께 받은 8자리 코드를 입력해주세요." };
  }

  const { key, waitMinutes } = await checkLoginBlocked("student");
  if (waitMinutes > 0) return { error: blockedMessage(waitMinutes) };

  const supabase = createServerSupabaseClient();
  const { data: student } = await supabase
    .from("students")
    .select("id, is_active, session_version")
    .eq("login_code_hash", hashLoginCode(code))
    .maybeSingle();

  if (!student) {
    await recordLoginFailure(key);
    return { error: "코드가 올바르지 않아요. 다시 확인해주세요." };
  }
  if (!student.is_active) {
    return { error: "비활성화된 계정이에요. 선생님께 문의해주세요." };
  }

  await clearLoginFailures(key);
  await createSession({
    role: "student",
    studentId: student.id,
    v: student.session_version,
  });
  redirect("/student");
}

export async function teacherLogin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const { key, waitMinutes } = await checkLoginBlocked("teacher");
  if (waitMinutes > 0) return { error: blockedMessage(waitMinutes) };

  const password = String(formData.get("password") ?? "");
  if (!isTeacherPassword(password)) {
    await recordLoginFailure(key);
    return { error: "비밀번호가 올바르지 않아요." };
  }
  await clearLoginFailures(key);
  await createSession({ role: "teacher", pv: teacherPasswordFingerprint() });
  redirect("/teacher");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
