import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";
import { kstDate } from "./stats";
import { addVocaPlay } from "./engagement";
import { roleplay } from "./roleplays";
import { scenarioStars, scoreTurn } from "./roleplay-score";

/** 무료회원이 하루에 시작할 수 있는 상황극 수 */
export const FREE_ROLEPLAYS_PER_DAY = 3;
/** 시나리오를 끝내면 주는 포인트 (시나리오마다 하루 한 번) */
export const ROLEPLAY_POINTS = 4;

/** 유료 과정 수강생은 무제한 */
export function roleplayUnlimited(student: { courses: readonly string[] }) {
  return student.courses.length > 0;
}

/** 시나리오별 최고 별 */
export async function getRoleplayStars(studentId: string): Promise<Map<string, number>> {
  const { data, error } = await createServerSupabaseClient().from("roleplay_progress").select("scenario, stars").eq("student_id", studentId);
  if (error) console.error("상황극 기록 조회 실패:", error.message);
  return new Map((data ?? []).map((r) => [r.scenario as string, (r.stars as number) ?? 0]));
}

async function startedToday(studentId: string, day: string): Promise<string[] | null> {
  const { data, error } = await createServerSupabaseClient()
    .from("roleplay_daily")
    .select("scenarios")
    .eq("student_id", studentId)
    .eq("day", day)
    .maybeSingle();
  if (error) {
    console.error("상황극 오늘 기록 조회 실패:", error.message);
    return null;
  }
  return (data?.scenarios as string[] | null) ?? [];
}

export type RoleplayQuota = { unlimited: boolean; left: number; started: string[] };

export async function roleplayQuota(student: { id: string; courses: readonly string[] }): Promise<RoleplayQuota> {
  if (roleplayUnlimited(student)) return { unlimited: true, left: Infinity, started: [] };
  const started = (await startedToday(student.id, kstDate(new Date()))) ?? [];
  return { unlimited: false, left: Math.max(0, FREE_ROLEPLAYS_PER_DAY - started.length), started };
}

/** 시작 기록 (무료회원 하루 3개). 이미 오늘 시작한 시나리오는 다시 해도 안 센다 */
export async function claimRoleplayStart(student: { id: string; courses: readonly string[] }, id: string) {
  if (!roleplay(id)) return { ok: false as const, reason: "missing" as const };
  if (roleplayUnlimited(student)) return { ok: true as const };
  const day = kstDate(new Date());
  const supabase = createServerSupabaseClient();
  // 동시에 여러 개를 시작해도 3개를 못 넘게: 읽은 목록 그대로일 때만 바꾼다 (몇 번 다시 시도)
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabase.from("roleplay_daily").select("scenarios").eq("student_id", student.id).eq("day", day).maybeSingle();
    // 기록 표가 없거나 DB 오류면 막지 않는다 (공부를 못 하게 되는 게 더 나쁨)
    if (error) {
      console.error("상황극 오늘 기록 조회 실패:", error.message);
      return { ok: true as const };
    }
    const started = (data?.scenarios as string[] | null) ?? [];
    if (started.includes(id)) return { ok: true as const };
    if (started.length >= FREE_ROLEPLAYS_PER_DAY) return { ok: false as const, reason: "limit" as const };
    if (!data) {
      const { error: insErr } = await supabase.from("roleplay_daily").insert({ student_id: student.id, day, scenarios: [id] });
      if (!insErr) return { ok: true as const };
      continue; // 같은 순간 다른 요청이 먼저 만들었으면 다시 읽는다
    }
    const { data: updated } = await supabase
      .from("roleplay_daily")
      .update({ scenarios: [...started, id] })
      .eq("student_id", student.id)
      .eq("day", day)
      .eq("scenarios", `{${started.map((x) => `"${x}"`).join(",")}}`)
      .select("day");
    if (updated?.length) return { ok: true as const };
  }
  return { ok: false as const, reason: "busy" as const };
}

/**
 * 끝낸 결과 저장. 별은 서버에서 답을 다시 채점해서 정한다 (화면이 보낸 별은 안 믿는다).
 * 포인트는 시나리오마다 하루 한 번.
 */
export async function saveRoleplayResult(student: { id: string; courses: readonly string[] }, id: string, answers: unknown) {
  const r = roleplay(id);
  if (!r || !Array.isArray(answers) || answers.length !== r.turns.length) return null;
  const texts = answers.map((a) => (typeof a === "string" ? a.slice(0, 300) : ""));
  const day = kstDate(new Date());
  // 무료회원은 오늘 시작한 시나리오만 기록
  if (!roleplayUnlimited(student)) {
    const started = await startedToday(student.id, day);
    if (started !== null && !started.includes(id)) return null;
  }
  const stars = scenarioStars(texts.map((t, i) => (t.trim() ? scoreTurn(t, r.turns[i]).stars : 1)));
  const supabase = createServerSupabaseClient();
  const { data: cur, error } = await supabase
    .from("roleplay_progress")
    .select("stars, plays")
    .eq("student_id", student.id)
    .eq("scenario", id)
    .maybeSingle();
  if (error) {
    console.error("상황극 기록 조회 실패:", error.message);
    return { stars, points: 0 };
  }
  const { error: upErr } = await supabase.from("roleplay_progress").upsert({
    student_id: student.id,
    scenario: id,
    stars: Math.max((cur?.stars as number | undefined) ?? 0, stars),
    plays: ((cur?.plays as number | undefined) ?? 0) + 1,
    updated_at: new Date().toISOString(),
  });
  if (upErr) {
    console.error("상황극 기록 저장 실패:", upErr.message);
    return { stars, points: 0 };
  }
  // 포인트는 시나리오마다 하루 한 번: 지급일을 '오늘이 아닐 때만' 바꾸고, 바뀐 요청만 지급 (동시에 끝내도 한 번)
  const { data: claimed } = await supabase
    .from("roleplay_progress")
    .update({ paid_day: day })
    .eq("student_id", student.id)
    .eq("scenario", id)
    .or(`paid_day.is.null,paid_day.lt.${day}`)
    .select("scenario");
  const pay = Boolean(claimed?.length);
  // 포인트 주면서 공부한 날도 같이 기록된다 (daily_activity.voca_plays)
  if (pay) await addVocaPlay(student.id, ROLEPLAY_POINTS);
  return { stars, points: pay ? ROLEPLAY_POINTS : 0 };
}
