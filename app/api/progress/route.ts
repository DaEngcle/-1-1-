import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getVerifiedStudent } from "@/lib/classroom/dal";
import {
  COMPLETE_PERCENT,
  SEGMENT_SECONDS,
  segmentCount,
  watchPercent,
} from "@/lib/classroom/progress";

const MAX_DURATION_SECONDS = 6 * 60 * 60;
// 2배속까지 허용 + 여유분. 실제로 흐른 시간보다 많이 본 것으로 기록되지 않게 막는다
const MAX_SPEED = 2;
const FIRST_REPORT_SEGMENTS = 6;

/**
 * 레슨 영상 시청 기록: JSON { lessonId, duration, segments: number[] }
 * segments = 실제로 재생된 10초 구간 번호. 기존 기록과 합쳐서 저장한다.
 */
export async function POST(request: NextRequest) {
  const student = await getVerifiedStudent();
  if (!student) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  let body: { lessonId?: unknown; duration?: unknown; segments?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const lessonId = typeof body.lessonId === "string" ? body.lessonId : "";
  const duration = Math.round(Number(body.duration));
  if (!lessonId || !Number.isFinite(duration) || duration < 1 || duration > MAX_DURATION_SECONDS) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const total = segmentCount(duration);
  const reported = Array.isArray(body.segments)
    ? [...new Set(body.segments.filter((s): s is number => Number.isInteger(s) && s >= 0 && s < total))]
    : [];

  const supabase = createServerSupabaseClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, video_url")
    .eq("id", lessonId)
    .eq("is_published", true)
    .maybeSingle();
  if (!lesson?.video_url) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const { data: existing } = await supabase
    .from("video_progress")
    .select("watched_segments, completed_at, updated_at")
    .eq("student_id", student.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  const known = new Set<number>(existing?.watched_segments ?? []);
  const fresh = reported.filter((s) => !known.has(s)).sort((a, b) => a - b);

  // 지난 기록 이후 흐른 시간만큼만 새 구간을 인정
  const elapsed = existing
    ? (Date.now() - new Date(existing.updated_at).getTime()) / 1000
    : 0;
  const allowed = existing
    ? Math.floor((elapsed * MAX_SPEED) / SEGMENT_SECONDS) + 2
    : FIRST_REPORT_SEGMENTS;
  const accepted = fresh.slice(0, Math.max(0, allowed));

  if (existing && accepted.length === 0) {
    const percent = watchPercent([...known], duration);
    return NextResponse.json({ percent, completed: Boolean(existing.completed_at) });
  }

  const merged = [...known, ...accepted].sort((a, b) => a - b);
  const percent = watchPercent(merged, duration);
  const completedAt =
    existing?.completed_at ?? (percent >= COMPLETE_PERCENT ? new Date().toISOString() : null);

  const { error } = await supabase.from("video_progress").upsert({
    student_id: student.id,
    lesson_id: lessonId,
    watched_segments: merged,
    duration_seconds: duration,
    percent,
    completed_at: completedAt,
    updated_at: new Date().toISOString(),
  });
  if (error) {
    console.error("시청 기록 저장 실패:", error.message);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
  return NextResponse.json({ percent, completed: Boolean(completedAt) });
}
