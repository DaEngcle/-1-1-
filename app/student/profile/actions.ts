"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";

export type NicknameState = { status: "success" | "error"; message: string } | undefined;

// 한글·영문·숫자·밑줄, 2~12자
const NICKNAME_PATTERN = /^[가-힣A-Za-z0-9_]{2,12}$/;

export async function saveNickname(_prev: NicknameState, formData: FormData): Promise<NicknameState> {
  const student = await requireStudent();
  const nickname = String(formData.get("nickname") ?? "").trim();
  if (!NICKNAME_PATTERN.test(nickname)) {
    return { status: "error", message: "한글·영문·숫자·_ 로 2~12자까지 쓸 수 있어요. (띄어쓰기 불가)" };
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
