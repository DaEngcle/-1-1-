import { createCoverUpload, setCover } from "./actions";

/** 표지 이미지를 Supabase에 바로 올리고 자료에 연결 */
export async function uploadCover(resourceId: string, blob: Blob) {
  const ext = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
  const prep = await createCoverUpload(resourceId, ext);
  if ("error" in prep) throw new Error(prep.error);
  const res = await fetch(prep.signedUrl, { method: "PUT", headers: { "content-type": blob.type || "image/jpeg" }, body: blob });
  if (!res.ok) throw new Error("표지 업로드에 실패했어요.");
  const done = await setCover(resourceId, prep.path);
  if ("error" in done) throw new Error(done.error);
}
