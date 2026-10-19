"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";

const isId = (v: string) => /^[0-9a-f-]{36}$/.test(v);

/** PDF 올리기 1단계: 브라우저가 Supabase로 바로 올릴 수 있는 1회용 업로드 주소 (Vercel 용량 제한 우회) */
export async function createResourceUpload(fileName: string) {
  await requireTeacher();
  if (!/\.pdf$/i.test(fileName)) return { error: "PDF 파일만 올릴 수 있어요." };
  const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.pdf`;
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.storage.from("resources").createSignedUploadUrl(path);
  if (error || !data) return { error: "업로드 준비에 실패했어요." };
  return { path, signedUrl: data.signedUrl };
}

/** PDF 올리기 2단계: 올라간 파일을 자료실에 등록 */
export async function registerResource(input: {
  path: string;
  fileName: string;
  size: number;
  title: string;
  description: string;
}) {
  await requireTeacher();
  const title = input.title.trim().slice(0, 80);
  if (!title || !/^\d+-[\w]{8}\.pdf$/.test(input.path)) return { error: "제목을 확인해주세요." };
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("resources").insert({
    title,
    description: input.description.trim().slice(0, 200) || null,
    file_path: input.path,
    file_name: input.fileName.replace(/[\\/]/g, "").slice(0, 120) || "dingle.pdf",
    size_bytes: Math.max(0, Math.round(input.size)),
  });
  if (error) return { error: "등록에 실패했어요." };
  revalidatePath("/teacher/resources");
  revalidatePath("/student/resources");
  return { ok: true };
}

export async function setResourcePublished(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  if (!isId(id)) return;
  const supabase = createServerSupabaseClient();
  await supabase.from("resources").update({ is_published: formData.get("publish") === "true" }).eq("id", id);
  revalidatePath("/teacher/resources");
  revalidatePath("/student/resources");
}

export async function deleteResource(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  if (!isId(id)) return;
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("resources").select("file_path").eq("id", id).maybeSingle();
  if (data) await supabase.storage.from("resources").remove([data.file_path]);
  await supabase.from("resources").delete().eq("id", id);
  revalidatePath("/teacher/resources");
  revalidatePath("/student/resources");
}
