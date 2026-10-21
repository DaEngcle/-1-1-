"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { NICKNAME_PATTERN, NICKNAME_RULE } from "@/lib/classroom/nickname";
import { isCatBreed } from "@/lib/classroom/cat";

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
