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
  // 맥 파일 이름에서 온 한글은 자모가 풀려 있어(NFD) 검색이 안 되니 합쳐서 저장
  const title = input.title.normalize("NFC").trim().slice(0, 80);
  if (!title || !/^\d+-[\w]{8}\.pdf$/.test(input.path)) return { error: "제목을 확인해주세요." };
  const supabase = createServerSupabaseClient();
  const { data: created, error } = await supabase.from("resources").insert({
    title,
    description: input.description.normalize("NFC").trim().slice(0, 200) || null,
    file_path: input.path,
    file_name: input.fileName.normalize("NFC").replace(/[\\/]/g, "").slice(0, 120) || "dingle.pdf",
    size_bytes: Math.max(0, Math.round(input.size)),
  }).select("id").single();
  if (error || !created) return { error: "등록에 실패했어요." };
  revalidatePath("/teacher/resources");
  revalidatePath("/student/resources");
  return { ok: true, id: created.id as string };
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
  const { data: cover } = await supabase.from("resources").select("cover_path").eq("id", id).maybeSingle();
  if (cover?.cover_path) await supabase.storage.from("covers").remove([cover.cover_path]);
  await supabase.from("resources").delete().eq("id", id);
  revalidatePath("/teacher/resources");
  revalidatePath("/student/resources");
}

/** 표지 1단계: 표지 이미지 업로드 주소 */
export async function createCoverUpload(resourceId: string, ext: "jpg" | "png" | "webp") {
  await requireTeacher();
  if (!isId(resourceId) || !["jpg", "png", "webp"].includes(ext)) return { error: "표지 형식을 확인해주세요." };
  const path = `${resourceId}/${Date.now()}.${ext}`;
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.storage.from("covers").createSignedUploadUrl(path);
  if (error || !data) return { error: "표지 업로드 준비에 실패했어요." };
  return { path, signedUrl: data.signedUrl };
}

/** 표지 2단계: 올린 표지를 자료에 연결 (예전 표지는 지움) */
export async function setCover(resourceId: string, path: string) {
  await requireTeacher();
  if (!isId(resourceId) || !path.startsWith(`${resourceId}/`)) return { error: "표지를 확인해주세요." };
  const supabase = createServerSupabaseClient();
  const { data: old } = await supabase.from("resources").select("cover_path").eq("id", resourceId).maybeSingle();
  await supabase.from("resources").update({ cover_path: path }).eq("id", resourceId);
  if (old?.cover_path && old.cover_path !== path) await supabase.storage.from("covers").remove([old.cover_path]);
  revalidatePath("/teacher/resources");
  revalidatePath("/student/resources");
  return { ok: true };
}
