"use server";

import { revalidatePath } from "next/cache";
import { sheetCsvUrl, syncCourseVideos } from "@/lib/classroom/video-sheet";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";
import { COURSE_IDS, type CourseId } from "@/lib/classroom/plans";

function isCourseId(v: string): v is CourseId {
  return (COURSE_IDS as readonly string[]).includes(v);
}
import { fetchPlaylistVideos, youTubePlaylistId, youTubeVideoId } from "@/lib/classroom/youtube";

export async function setPublished(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  const publish = formData.get("publish") === "true";
  const supabase = createServerSupabaseClient();
  await supabase.from("lessons").update({ is_published: publish }).eq("id", id);
  revalidatePath("/teacher/lessons");
}

/** 선택한 레슨까지(과정 안 정렬 순서 기준) 공개하고 이후는 비공개 */
export async function publishUntil(formData: FormData) {
  await requireTeacher();
  const course = String(formData.get("course"));
  const sortOrder = Number(formData.get("sort_order"));
  if (!isCourseId(course) || !Number.isInteger(sortOrder)) return;
  const supabase = createServerSupabaseClient();
  await supabase.from("lessons").update({ is_published: true }).eq("course_id", course).lte("sort_order", sortOrder);
  await supabase.from("lessons").update({ is_published: false }).eq("course_id", course).gt("sort_order", sortOrder);
  revalidatePath("/teacher/lessons");
}

/** 새 레슨(Day) 추가: 과정의 맨 뒤에 붙고, Day 번호는 자동 */
export async function addLesson(formData: FormData) {
  await requireTeacher();
  const course = String(formData.get("course"));
  const weekNumber = Number(formData.get("week_number"));
  const weekTitle = String(formData.get("week_title") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const videoUrl = String(formData.get("video_url") ?? "").trim();
  if (!isCourseId(course) || !Number.isInteger(weekNumber) || weekNumber < 1 || !title) return;
  if (videoUrl && !/^https?:\/\//.test(videoUrl)) return;

  const supabase = createServerSupabaseClient();
  const { data: rows } = await supabase
    .from("lessons")
    .select("sort_order, day_number, week_number, week_title")
    .eq("course_id", course);
  const sortOrder = Math.max(0, ...(rows ?? []).map((r) => r.sort_order)) + 1;
  const dayNumber = Math.max(0, ...(rows ?? []).map((r) => r.day_number ?? 0)) + 1;
  const sameWeek = (rows ?? []).find((r) => r.week_number === weekNumber);
  await supabase.from("lessons").insert({
    course_id: course,
    sort_order: sortOrder,
    week_number: weekNumber,
    week_title: weekTitle || sameWeek?.week_title || `Week ${weekNumber}`,
    kind: "day",
    day_number: dayNumber,
    title,
    video_url: videoUrl || null,
  });
  revalidatePath("/teacher/lessons");
}

/** 과정 상태: 열림 / 준비 중 */
export async function setCourseStatus(formData: FormData) {
  await requireTeacher();
  const course = String(formData.get("course"));
  const status = String(formData.get("status"));
  if (!isCourseId(course) || (status !== "open" && status !== "preparing")) return;
  const supabase = createServerSupabaseClient();
  await supabase.from("courses").update({ status }).eq("id", course);
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
  const course = String(formData.get("course") ?? "bootcamp");
  const weekNumber = Number(formData.get("week_number"));
  const title = String(formData.get("title") ?? "").trim();
  const videoUrl = String(formData.get("video_url") ?? "").trim();
  if (!isCourseId(course) || !Number.isInteger(weekNumber) || !title || !/^https?:\/\//.test(videoUrl)) return;
  const supabase = createServerSupabaseClient();
  await supabase
    .from("class_recordings")
    .insert({ course_id: course, week_number: weekNumber, title, video_url: videoUrl });
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
  const course = String(formData.get("course") ?? "bootcamp");
  if (!isCourseId(course)) return { status: "error", message: "과정을 확인해주세요." };
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
    .eq("course_id", course)
    .eq("week_number", weekNumber);
  const existingIds = new Set((existing ?? []).map((r) => youTubeVideoId(r.video_url)));
  const toAdd = videos.filter((v) => !existingIds.has(v.videoId));

  if (toAdd.length > 0) {
    const { error } = await supabase.from("class_recordings").insert(
      toAdd.map((v) => ({
        course_id: course,
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

export type SheetSyncState = { status: "success" | "error"; message: string } | undefined;

/** 강의 링크 시트를 연결하고 바로 한 번 반영 */
export async function saveVideoSheet(_prev: SheetSyncState, formData: FormData): Promise<SheetSyncState> {
  await requireTeacher();
  const course = String(formData.get("course"));
  const sheet = String(formData.get("sheet") ?? "").trim();
  if (!isCourseId(course)) return { status: "error", message: "과정을 확인해주세요." };
  if (sheet && !sheetCsvUrl(sheet)) return { status: "error", message: "구글 시트 주소를 확인해주세요." };
  const supabase = createServerSupabaseClient();
  await supabase.from("courses").update({ video_sheet: sheet || null }).eq("id", course);
  if (!sheet) {
    revalidatePath("/teacher/lessons");
    return { status: "success", message: "시트 연결을 해제했어요." };
  }
  const result = await syncCourseVideos(course, { force: true });
  revalidatePath("/teacher/lessons");
  revalidatePath("/student/lessons");
  return result.ok
    ? { status: "success", message: `시트에서 영상 ${result.checked}개를 확인했고, ${result.changed}개를 새 영상으로 바꿨어요.` }
    : { status: "error", message: result.message };
}
