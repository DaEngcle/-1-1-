"use server";

import { getVerifiedStudent } from "@/lib/classroom/dal";
import { maskName } from "@/lib/classroom/engagement";
import { sendVillageChat } from "@/lib/classroom/village-chat";

/** 마을 채팅 보내기. 이름은 닉네임 또는 가린 이름만 저장한다 (실명 노출 금지) */
export async function sendVillageChatAction(text: string) {
  const student = await getVerifiedStudent();
  if (!student) return { ok: false as const, message: "로그인이 필요해요." };
  return sendVillageChat(
    { id: student.id, name: student.nickname ?? maskName(student.name), breed: student.catBreed },
    text,
  );
}
