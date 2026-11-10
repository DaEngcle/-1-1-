"use server";

import { revalidatePath } from "next/cache";
import { requireStudent } from "@/lib/classroom/dal";
import { claimRoleplayStart, saveRoleplayResult } from "@/lib/classroom/roleplay-data";

/** 상황극 시작 (무료회원 하루 3개 확인) */
export async function startRoleplay(id: string) {
  const student = await requireStudent();
  return claimRoleplayStart(student, String(id));
}

/** 상황극 끝: 턴마다 가장 잘한 답을 보내면 서버가 다시 채점해서 저장 */
export async function finishRoleplay(id: string, answers: string[]) {
  const student = await requireStudent();
  const res = await saveRoleplayResult(student, String(id), answers);
  revalidatePath("/student/practice", "layout");
  revalidatePath("/student/course");
  return res;
}
