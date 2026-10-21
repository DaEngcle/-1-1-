import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";
import { kstDate } from "./stats";
import { DAILY_LIMIT, FREE_TRIALS } from "./interview-scenarios";

/**
 * AI 면접을 지금 할 수 있는지.
 * 수강생: 하루 5번 · 패스 있는 무료회원: 하루 3번 · 무료회원: 처음 1번 무료 체험
 */
export async function talkAccess(student: { id: string; courses: string[] }) {
  const supabase = createServerSupabaseClient();
  const today = kstDate(new Date());
  const todayStart = new Date(`${today}T00:00:00+09:00`).toISOString();
  const [{ data: st }, { count: todayCount }, { count: totalCount }, { data: req }] = await Promise.all([
    supabase.from("students").select("talk_until").eq("id", student.id).maybeSingle(),
    supabase.from("interview_sessions").select("id", { count: "exact", head: true }).eq("student_id", student.id).gte("created_at", todayStart),
    supabase.from("interview_sessions").select("id", { count: "exact", head: true }).eq("student_id", student.id),
    supabase.from("talk_requests").select("created_at").eq("student_id", student.id).maybeSingle(),
  ]);
  const passUntil = (st?.talk_until as string | null) ?? null;
  const hasPass = Boolean(passUntil && passUntil >= today);
  const enrolled = student.courses.length > 0;
  if (enrolled || hasPass) {
    const limit = enrolled ? DAILY_LIMIT.student : DAILY_LIMIT.pass;
    const left = Math.max(0, limit - (todayCount ?? 0));
    return { kind: enrolled ? ("student" as const) : ("pass" as const), left, limit, passUntil, requested: Boolean(req), canStart: left > 0 };
  }
  const left = Math.max(0, FREE_TRIALS - (totalCount ?? 0));
  return { kind: "free" as const, left, limit: FREE_TRIALS, passUntil, requested: Boolean(req), canStart: left > 0 };
}
