import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getVerifiedStudent, isTeacher } from "@/lib/classroom/dal";

/** 자료 내려받기: 로그인한 회원만, 1분짜리 서명 링크로 보낸다 (다운로드 수 기록) */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await getVerifiedStudent();
  const teacher = student ? false : await isTeacher();
  if (!student && !teacher) return NextResponse.redirect(new URL("/login", request.url));

  const supabase = createServerSupabaseClient();
  const { data: resource } = await supabase
    .from("resources")
    .select("id, file_path, file_name, link_url, is_published")
    .eq("id", id)
    .maybeSingle();
  if (!resource || (!resource.is_published && !teacher)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  // 링크 자료(노션 체크리스트 등)는 기록만 남기고 그 주소로 보낸다
  if (resource.link_url) {
    if (student) await supabase.from("resource_downloads").insert({ resource_id: resource.id, student_id: student.id });
    return NextResponse.redirect(resource.link_url);
  }
  if (!resource.file_path) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const { data: signed } = await supabase.storage
    .from("resources")
    .createSignedUrl(resource.file_path, 60, { download: resource.file_name ?? "dingle.pdf" });
  if (!signed?.signedUrl) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  if (student) await supabase.from("resource_downloads").insert({ resource_id: resource.id, student_id: student.id });
  return NextResponse.redirect(signed.signedUrl);
}
