"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";
import { fetchPlaylistVideos, youTubePlaylistId, youTubeVideoId } from "@/lib/classroom/youtube";

export async function setPublished(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  const publish = formData.get("publish") === "true";
  const supabase = createServerSupabaseClient();
  await supabase.from("lessons").update({ is_published: publish }).eq("id", id);
  revalidatePath("/teacher/lessons");
}

/** 선택한 레슨까지(정렬 순서 기준) 공개하고 이후는 비공개 */
export async function publishUntil(formData: FormData) {
  await requireTeacher();
  const sortOrder = Number(formData.get("sort_order"));
  if (!Number.isInteger(sortOrder)) return;
  const supabase = createServerSupabaseClient();
  await supabase.from("lessons").update({ is_published: true }).lte("sort_order", sortOrder);
  await supabase.from("lessons").update({ is_published: false }).gt("sort_order", sortOrder);
  revalidatePath("/teacher/lessons");
}

/**
 * 쉐도잉 문장 여러 개 추가. 한 줄에 한 문장.
 * "영어 문장 | 해석" 형식이면 해석도 함께 저장.
 */
export async function addItems(formData: FormData) {
  await requireTeacher();
  const lessonId = String(formData.get("lesson_id"));
  const lines = String(formData.get("lines") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return;

  const supabase = createServerSupabaseClient();
  const { data: last } = await supabase
    .from("lesson_items")
    .select("item_order")
    .eq("lesson_id", lessonId)
    .order("item_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const start = (last?.item_order ?? 0) + 1;

  await supabase.from("lesson_items").insert(
    lines.map((line, i) => {
      const [sentence, translation] = line.split("|").map((s) => s.trim());
      return {
        lesson_id: lessonId,
        item_order: start + i,
        sentence,
        translation: translation || null,
      };
    }),
  );
  revalidatePath(`/teacher/lessons/${lessonId}`);
}

export async function updateItem(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  const lessonId = String(formData.get("lesson_id"));
  const sentence = String(formData.get("sentence") ?? "").trim();
  if (!sentence) return;
  const supabase = createServerSupabaseClient();
  await supabase
    .from("lesson_items")
    .update({
      sentence,
      translation: String(formData.get("translation") ?? "").trim() || null,
      note: String(formData.get("note") ?? "").trim() || null,
    })
    .eq("id", id);
  revalidatePath(`/teacher/lessons/${lessonId}`);
}

export async function deleteItem(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  const lessonId = String(formData.get("lesson_id"));
  const supabase = createServerSupabaseClient();
  await supabase.from("lesson_items").delete().eq("id", id);
  revalidatePath(`/teacher/lessons/${lessonId}`);
}

export async function addRecording(formData: FormData) {
  await requireTeacher();
  const weekNumber = Number(formData.get("week_number"));
  const title = String(formData.get("title") ?? "").trim();
  const videoUrl = String(formData.get("video_url") ?? "").trim();
  if (!Number.isInteger(weekNumber) || !title || !/^https?:\/\//.test(videoUrl)) return;
  const supabase = createServerSupabaseClient();
  await supabase
    .from("class_recordings")
    .insert({ week_number: weekNumber, title, video_url: videoUrl });
  revalidatePath("/teacher/lessons");
}

export type PlaylistImportState =
  | { status: "success" | "error"; message: string }
  | undefined;

/** 유튜브 재생목록의 영상을 해당 주차 수업 영상으로 한꺼번에 등록 (이미 있는 영상은 건너뜀) */
export async function importPlaylist(
  _prev: PlaylistImportState,
  formData: FormData,
): Promise<PlaylistImportState> {
  await requireTeacher();
  const weekNumber = Number(formData.get("week_number"));
  const playlistId = youTubePlaylistId(String(formData.get("playlist_url") ?? ""));
  if (!Number.isInteger(weekNumber)) return { status: "error", message: "주차를 확인해주세요." };
  if (!playlistId) {
    return { status: "error", message: "재생목록 주소를 확인해주세요. (주소에 list=... 가 있어야 해요)" };
  }

  const videos = await fetchPlaylistVideos(playlistId);
  if (videos.length === 0) {
    return {
      status: "error",
      message: "영상을 찾지 못했어요. 재생목록이 '공개' 또는 '일부 공개'인지 확인해주세요.",
    };
  }

  const supabase = createServerSupabaseClient();
  const { data: existing } = await supabase
    .from("class_recordings")
    .select("video_url")
    .eq("week_number", weekNumber);
  const existingIds = new Set((existing ?? []).map((r) => youTubeVideoId(r.video_url)));
  const toAdd = videos.filter((v) => !existingIds.has(v.videoId));

  if (toAdd.length > 0) {
    const { error } = await supabase.from("class_recordings").insert(
      toAdd.map((v) => ({
        week_number: weekNumber,
        title: v.title,
        video_url: `https://youtu.be/${v.videoId}`,
      })),
    );
    if (error) {
      console.error("재생목록 등록 실패:", error.message);
      return { status: "error", message: "등록 중 오류가 발생했어요." };
    }
  }
  revalidatePath("/teacher/lessons");
  const skipped = videos.length - toAdd.length;
  return {
    status: "success",
    message: `${toAdd.length}개 영상을 추가했어요.${skipped ? ` (이미 있는 ${skipped}개는 건너뜀)` : ""}`,
  };
}

export async function deleteRecording(formData: FormData) {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  await supabase.from("class_recordings").delete().eq("id", String(formData.get("id")));
  revalidatePath("/teacher/lessons");
}
