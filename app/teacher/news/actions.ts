"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";
import { generateNewsLessons } from "@/lib/classroom/news";

export type GenerateState = { message: string } | undefined;

export async function generateNow(): Promise<GenerateState> {
  await requireTeacher();
  const r = await generateNewsLessons(2);
  revalidatePath("/teacher/news");
  revalidatePath("/student/news");
  return { message: r.created ? `새 뉴스 ${r.created}개를 만들었어요.` : `못 만들었어요: ${r.reason}` };
}

export async function setNewsPublished(formData: FormData) {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  await supabase
    .from("news_lessons")
    .update({ is_published: formData.get("publish") === "true" })
    .eq("id", String(formData.get("id")));
  revalidatePath("/teacher/news");
  revalidatePath("/student/news");
}

export async function deleteNews(formData: FormData) {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  await supabase.from("news_lessons").delete().eq("id", String(formData.get("id")));
  revalidatePath("/teacher/news");
  revalidatePath("/student/news");
}
