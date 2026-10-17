"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";
import { setPostTestOpen } from "@/lib/classroom/level-test-data";

export async function togglePostTest(formData: FormData) {
  await requireTeacher();
  await setPostTestOpen(formData.get("open") === "true");
  revalidatePath("/teacher/level-tests");
}

/** 학생의 레벨테스트 한 회차를 지워서 다시 볼 수 있게 한다 (녹음 파일도 삭제) */
export async function resetLevelTest(formData: FormData) {
  await requireTeacher();
  const testId = String(formData.get("test_id"));
  const studentId = String(formData.get("student_id"));
  const supabase = createServerSupabaseClient();
  const { data: answers } = await supabase.from("level_test_answers").select("audio_path").eq("test_id", testId);
  const paths = (answers ?? []).map((a) => a.audio_path).filter((p): p is string => Boolean(p));
  if (paths.length) await supabase.storage.from("shadowing").remove(paths);
  await supabase.from("level_tests").delete().eq("id", testId).eq("student_id", studentId);
  revalidatePath(`/teacher/students/${studentId}`);
  revalidatePath("/teacher/level-tests");
}
