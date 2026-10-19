"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { createSession } from "@/lib/classroom/session";
import { checkLoginBlocked, recordLoginFailure } from "@/lib/classroom/rate-limit";
import { hashPassword, normalizePhone } from "@/lib/classroom/password";
import { NICKNAME_PATTERN, NICKNAME_RULE } from "@/lib/classroom/nickname";
import { kstDate } from "@/lib/classroom/stats";

export type FreeSignupState = { error: string } | undefined;

const NAME_PATTERN = /^[가-힣A-Za-z ]{2,20}$/;

/**
 * 웨비나·무료 자료 신청: 승인 없이 바로 '무료회원'으로 입장.
 * 무료회원 = 승인됨 + 수강권 없음 + 고객 단계 lead → 자료실·맛보기·레벨테스트만 열림
 */
export async function freeSignup(_prev: FreeSignupState, formData: FormData): Promise<FreeSignupState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const password = String(formData.get("password") ?? "");
  const nickname = String(formData.get("nickname") ?? "").trim();
  const from = String(formData.get("from") ?? "").replace(/[^\w가-힣 .-]/g, "").slice(0, 30);
  const privacy = formData.get("privacy") === "on";
  const marketing = formData.get("marketing") === "on";

  if (!NAME_PATTERN.test(name)) return { error: "이름을 한글 또는 영문으로 2~20자 입력해주세요." };
  if (!/^01[016789][0-9]{7,8}$/.test(phone)) return { error: "휴대폰 번호를 정확히 입력해주세요. (예: 010-1234-5678)" };
  if (!NICKNAME_PATTERN.test(nickname)) return { error: NICKNAME_RULE };
  if (password.length < 8) return { error: "비밀번호는 8자 이상으로 정해주세요." };
  if (!privacy) return { error: "개인정보 수집·이용에 동의해야 자료를 받을 수 있어요." };

  const { key, waitMinutes } = await checkLoginBlocked("signup");
  if (waitMinutes > 0) return { error: `신청이 너무 많아요. ${waitMinutes}분 뒤에 다시 시도해주세요.` };
  await recordLoginFailure(key);

  const supabase = createServerSupabaseClient();
  const now = new Date().toISOString();
  const source = `${from || "웨비나"} (${kstDate(new Date())})`;
  const { data: taken } = await supabase.from("students").select("id, phone").eq("nickname", nickname).maybeSingle();
  if (taken && taken.phone !== phone) return { error: "이미 다른 친구가 쓰고 있는 닉네임이에요. 다른 닉네임을 골라주세요." };

  const { data: existing } = await supabase
    .from("students")
    .select("id, password_hash, login_code_hash, stage, session_version")
    .eq("phone", phone)
    .maybeSingle();
  if (existing?.password_hash || existing?.login_code_hash) {
    return { error: "이미 가입된 번호예요. 아래 '이미 가입했어요'에서 로그인해 주세요." };
  }

  const passwordHash = await hashPassword(password);
  let studentId: string;
  let version = 1;
  if (existing) {
    // 상담 카드가 이미 있는 사람. 등록생 카드는 남이 가로채지 못하게 선생님 확인을 거친다
    const paid = existing.stage === "enrolled";
    const { error } = await supabase
      .from("students")
      .update({
        name,
        nickname,
        password_hash: passwordHash,
        privacy_agreed_at: now,
        marketing_agreed_at: marketing ? now : null,
        ...(paid ? { approval: "pending" } : { approval: "approved", is_active: true }),
      })
      .eq("id", existing.id);
    if (error) {
      console.error("무료회원 연결 실패:", error.message);
      return { error: "신청 중 오류가 발생했어요. 잠시 후 다시 시도해주세요." };
    }
    if (paid) redirect("/login?error=pending");
    studentId = existing.id;
    version = existing.session_version ?? 1;
  } else {
    const { data, error } = await supabase
      .from("students")
      .insert({
        name,
        phone,
        nickname,
        password_hash: passwordHash,
        approval: "approved",
        is_active: true,
        stage: "lead",
        source,
        privacy_agreed_at: now,
        marketing_agreed_at: marketing ? now : null,
      })
      .select("id, session_version")
      .single();
    if (error?.code === "23505") return { error: "이미 쓰고 있는 번호나 닉네임이에요. 다시 확인해 주세요." };
    if (error || !data) {
      console.error("무료회원 가입 실패:", error?.message);
      return { error: "신청 중 오류가 발생했어요. 잠시 후 다시 시도해주세요." };
    }
    studentId = data.id;
    version = data.session_version ?? 1;
  }

  await createSession({ role: "student", studentId, v: version });
  redirect("/student/resources?welcome=1");
}
