"use server";

import { createServerSupabaseClient } from "@/lib/supabase";

export type SubscribeState = {
  status: "idle" | "success" | "error";
  message: string;
};

const PHONE_REGEX = /^01[016789]\d{7,8}$/;

export async function subscribeTrial(
  _prevState: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/[^0-9]/g, "");

  if (!name) {
    return { status: "error", message: "이름을 입력해주세요." };
  }
  if (!PHONE_REGEX.test(phone)) {
    return {
      status: "error",
      message: "올바른 휴대폰 번호를 입력해주세요. (예: 010-1234-5678)",
    };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("subscribers").insert({
    name,
    phone,
    status: "trial",
  });

  if (error) {
    if (error.code === "23505") {
      return {
        status: "error",
        message: "이미 신청된 번호예요. 카카오톡을 확인해주세요!",
      };
    }
    console.error("구독 등록 실패:", error.message);
    return {
      status: "error",
      message: "일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
    };
  }

  return {
    status: "success",
    message: "신청 완료! 내일 오전 9시부터 카카오톡으로 표현이 도착해요.",
  };
}
