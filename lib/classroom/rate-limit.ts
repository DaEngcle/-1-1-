import "server-only";
import { headers } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase";

// IP 하나당 15분에 5번까지 틀릴 수 있음
const MAX_FAILURES = 5;
const WINDOW_MINUTES = 15;

async function clientIp() {
  const h = await headers();
  // Vercel이 x-forwarded-for 맨 앞에 실제 접속 IP를 넣어준다
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

function windowStart() {
  return new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
}

/** 로그인 시도 전에 호출. 최근 실패가 너무 많으면 남은 대기 시간(분)을 반환 */
export async function checkLoginBlocked(scope: "teacher" | "student") {
  const key = `${scope}:${await clientIp()}`;
  const supabase = createServerSupabaseClient();
  const { data, count } = await supabase
    .from("login_attempts")
    .select("created_at", { count: "exact" })
    .eq("key", key)
    .gte("created_at", windowStart())
    .order("created_at", { ascending: true })
    .limit(1);

  if ((count ?? 0) < MAX_FAILURES || !data?.[0]) return { key, waitMinutes: 0 };
  const oldest = new Date(data[0].created_at).getTime();
  const unblockAt = oldest + WINDOW_MINUTES * 60 * 1000;
  return { key, waitMinutes: Math.max(1, Math.ceil((unblockAt - Date.now()) / 60000)) };
}

export async function recordLoginFailure(key: string) {
  const supabase = createServerSupabaseClient();
  await supabase.from("login_attempts").insert({ key });
  // 오래된 기록 정리 (하루 이상 지난 것)
  await supabase
    .from("login_attempts")
    .delete()
    .lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
}

export async function clearLoginFailures(key: string) {
  const supabase = createServerSupabaseClient();
  await supabase.from("login_attempts").delete().eq("key", key);
}
