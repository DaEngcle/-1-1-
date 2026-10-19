import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";

/** 자료마다 다른 색 책 (표지가 없을 때) */
const BOOK_ICONS = ["📙", "📘", "📗", "📕"];
export const bookIcon = (index: number) => BOOK_ICONS[index % BOOK_ICONS.length];

/** 공개 버킷의 표지 주소 */
export function coverUrl(path: string | null) {
  if (!path) return null;
  return createServerSupabaseClient().storage.from("covers").getPublicUrl(path).data.publicUrl;
}
