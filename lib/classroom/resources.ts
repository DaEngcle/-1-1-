import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";

/** 자료마다 다른 색 책 (표지가 없을 때) */
const BOOK_ICONS = ["📙", "📘", "📗", "📕"];
/** 과정 교재는 과정 색으로 (부트캠프 파랑, 1.0 노랑, 2.0 초록) */
const COURSE_ICONS: Record<string, string> = { bootcamp: "📘", level1: "📒", level2: "📗" };
export const bookIcon = (index: number, course?: string | null) =>
  (course && COURSE_ICONS[course]) || BOOK_ICONS[index % BOOK_ICONS.length];

/** 공개 버킷의 표지 주소 */
export function coverUrl(path: string | null) {
  if (!path) return null;
  // '/covers/...'는 앱에 같이 배포된 표지 (public/covers)
  if (path.startsWith("/")) return path;
  return createServerSupabaseClient().storage.from("covers").getPublicUrl(path).data.publicUrl;
}
