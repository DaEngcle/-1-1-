"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { NICKNAME_PATTERN, NICKNAME_RULE } from "@/lib/classroom/nickname";
import { isCatBreed } from "@/lib/classroom/cat";
import { hashPassword, verifyPassword } from "@/lib/classroom/password";

export type NicknameState = { status: "success" | "error"; message: string } | undefined;

export async function saveNickname(_prev: NicknameState, formData: FormData): Promise<NicknameState> {
  const student = await requireStudent();
  const nickname = String(formData.get("nickname") ?? "").trim();
  if (!NICKNAME_PATTERN.test(nickname)) {
    return { status: "error", message: NICKNAME_RULE };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("students").update({ nickname }).eq("id", student.id);
  if (error?.code === "23505") return { status: "error", message: "이미 다른 친구가 쓰고 있는 닉네임이에요." };
  if (error) {
    console.error("닉네임 저장 실패:", error.message);
    return { status: "error", message: "저장 중 오류가 발생했어요." };
  }
  revalidatePath("/student");
  return { status: "success", message: `이제 랭킹에 '${nickname}'(으)로 보여요.` };
}

/** 응원 고양이 고르기 */
export async function chooseCat(formData: FormData) {
  const student = await requireStudent();
  const breed = formData.get("breed");
  if (!isCatBreed(breed)) return;
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("students").update({ cat_breed: breed }).eq("id", student.id);
  if (error) console.error("고양이 저장 실패:", error.message);
  revalidatePath("/student", "layout");
}

/** 고양이 이름 짓기 (1~10자) */
export async function saveCatName(_prev: NicknameState, formData: FormData): Promise<NicknameState> {
  const student = await requireStudent();
  const name = String(formData.get("cat_name") ?? "").trim().replace(/\s+/g, " ");
  if (name.length < 1 || [...name].length > 10) {
    return { status: "error", message: "이름은 1~10자로 지어주세요." };
  }
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("students").update({ cat_name: name }).eq("id", student.id);
  if (error) {
    console.error("고양이 이름 저장 실패:", error.message);
    return { status: "error", message: "저장 중 오류가 발생했어요." };
  }
  revalidatePath("/student", "layout");
  return { status: "success", message: `이제 이름은 '${name}'! 🐾` };
}

/** 비밀번호 바꾸기 (임시 비밀번호를 받은 뒤 등) */
export async function changePassword(_prev: NicknameState, formData: FormData): Promise<NicknameState> {
  const student = await requireStudent();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  if (next.length < 8) return { status: "error", message: "새 비밀번호는 8자 이상이어야 해요." };
  if (next !== String(formData.get("confirm") ?? "")) return { status: "error", message: "새 비밀번호 두 칸이 서로 달라요." };
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("students").select("password_hash").eq("id", student.id).maybeSingle();
  if (!data?.password_hash) return { status: "error", message: "전화번호로 가입한 계정만 비밀번호를 바꿀 수 있어요." };
  if (!(await verifyPassword(current, data.password_hash as string))) {
    return { status: "error", message: "지금 비밀번호가 맞지 않아요." };
  }
  const { error } = await supabase.from("students").update({ password_hash: await hashPassword(next) }).eq("id", student.id);
  if (error) return { status: "error", message: "저장 중 오류가 발생했어요." };
  return { status: "success", message: "비밀번호를 바꿨어요 🔑 다음부터 새 비밀번호로 로그인하세요." };
}
