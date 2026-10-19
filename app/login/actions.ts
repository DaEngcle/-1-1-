"use server";

import { redirect } from "next/navigation";
import { NICKNAME_PATTERN, NICKNAME_RULE } from "@/lib/classroom/nickname";
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
import { hashPassword, normalizePhone, verifyPassword } from "@/lib/classroom/password";
import { kstDate } from "@/lib/classroom/stats";

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
    .select("id, is_active, session_version, approval, access_until")
    .eq("login_code_hash", hashLoginCode(code))
    .maybeSingle();

  if (!student) {
    await recordLoginFailure(key);
    return { error: "코드가 올바르지 않아요. 다시 확인해주세요." };
  }
  const problem = accessProblem(student);
  if (problem) return { error: problem };

  await clearLoginFailures(key);
  await createSession({
    role: "student",
    studentId: student.id,
    v: student.session_version,
  });
  redirect("/student");
}

/** 승인 상태·수강 기간 확인 (로그인 직전) */
function accessProblem(student: { is_active: boolean; approval: string; access_until: string | null }) {
  if (!student.is_active || student.approval === "rejected") return "이용이 중지된 계정이에요. 선생님께 문의해주세요.";
  if (student.approval === "pending") return "거의 다 됐어요! 수강 확인이 끝나면 바로 열어드릴게요 😊";
  if (student.access_until && student.access_until < kstDate(new Date())) {
    return "수강 기간이 끝났어요. 연장은 선생님께 문의해주세요.";
  }
  return null;
}

/** 직접 가입한 학생: 전화번호 + 비밀번호 */
export async function phoneLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const password = String(formData.get("password") ?? "");
  if (phone.length < 9 || !password) return { error: "전화번호와 비밀번호를 입력해주세요." };

  const { key, waitMinutes } = await checkLoginBlocked("student");
  if (waitMinutes > 0) return { error: blockedMessage(waitMinutes) };

  const supabase = createServerSupabaseClient();
  const { data: student } = await supabase
    .from("students")
    .select("id, is_active, approval, access_until, session_version, password_hash")
    .eq("phone", phone)
    .maybeSingle();
  if (!student || !(await verifyPassword(password, student.password_hash))) {
    await recordLoginFailure(key);
    return { error: "전화번호 또는 비밀번호가 올바르지 않아요." };
  }
  const problem = accessProblem(student);
  if (problem) return { error: problem };

  await clearLoginFailures(key);
  await createSession({ role: "student", studentId: student.id, v: student.session_version });
  redirect("/student");
}

export type SignupState = { error: string } | { done: true } | undefined;

const NAME_PATTERN = /^[가-힣A-Za-z ]{2,20}$/;

/** 학생 직접 가입 → 승인 대기 */
export async function signup(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("password_confirm") ?? "");
  const nickname = String(formData.get("nickname") ?? "").trim();
  // 수강 과정은 학생이 고르지 않고 선생님이 승인할 때 정한다
  const agreed = formData.get("privacy") === "on";

  if (!NAME_PATTERN.test(name)) return { error: "이름을 한글 또는 영문으로 2~20자 입력해주세요." };
  if (!/^01[016789][0-9]{7,8}$/.test(phone)) return { error: "휴대폰 번호를 정확히 입력해주세요. (예: 010-1234-5678)" };
  if (!NICKNAME_PATTERN.test(nickname)) return { error: NICKNAME_RULE };
  if (password.length < 8) return { error: "비밀번호는 8자 이상으로 정해주세요." };
  if (password !== passwordConfirm) return { error: "비밀번호 확인이 일치하지 않아요." };
  if (!agreed) return { error: "개인정보 수집·이용에 동의해야 가입할 수 있어요." };

  // 가입 남용 방지: 로그인 실패 제한과 같은 방식으로 IP당 횟수 제한
  const { key, waitMinutes } = await checkLoginBlocked("signup");
  if (waitMinutes > 0) return { error: blockedMessage(waitMinutes) };
  await recordLoginFailure(key);

  const supabase = createServerSupabaseClient();
  const { data: taken } = await supabase.from("students").select("id").eq("nickname", nickname).maybeSingle();
  if (taken) return { error: "이미 다른 친구가 쓰고 있는 닉네임이에요. 다른 닉네임을 골라주세요." };
  const passwordHash = await hashPassword(password);
  // 선생님이 상담·시트로 미리 만들어 둔 카드(전화번호 같고 계정 없음)가 있으면 그 카드에 연결한다.
  // 다른 사람이 번호만 알고 가로채지 못하게 항상 '승인 대기'로 돌려서 선생님이 확인한다
  const { data: existing } = await supabase
    .from("students")
    .select("id, password_hash, login_code_hash")
    .eq("phone", phone)
    .maybeSingle();
  if (existing && !existing.password_hash && !existing.login_code_hash) {
    const { error: linkError } = await supabase
      .from("students")
      .update({ name, nickname, password_hash: passwordHash, approval: "pending", privacy_agreed_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (linkError) {
      console.error("가입 연결 실패:", linkError.message);
      return { error: "가입 중 오류가 발생했어요. 잠시 후 다시 시도해주세요." };
    }
    return { done: true };
  }
  const { error } = await supabase.from("students").insert({
    name,
    phone,
    nickname,
    password_hash: passwordHash,
    approval: "pending",
    stage: "enrolled",
    privacy_agreed_at: new Date().toISOString(),
  });
  if (error?.code === "23505") return { error: "이미 가입된 전화번호예요. 로그인해주세요." };
  if (error) {
    console.error("가입 실패:", error.message);
    return { error: "가입 중 오류가 발생했어요. 잠시 후 다시 시도해주세요." };
  }
  return { done: true };
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
