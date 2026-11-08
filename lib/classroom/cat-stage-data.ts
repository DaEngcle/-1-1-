import "server-only";
// 고양이 성장 단계: 지금까지 '공부한 날' 수(달력·연속 기록과 같은 기준)로 정한다
import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase";
import { fetchAll } from "./progress";
import { kstDate } from "./stats";
import { catStageForDays, daysToNextStage, isCatStage, type CatStage } from "./cat";

/**
 * 공부한 날 수: 영상을 봤거나, 보카·문법·연습을 했거나(voca_plays), 쉐도잉을 제출한 날.
 * lib/classroom/engagement.ts의 '공부한 날'(studied)과 같은 기준이다.
 */
export const studyDayCount = cache(async (studentId: string) => {
  const supabase = createServerSupabaseClient();
  const [acts, subs] = await Promise.all([
    fetchAll<{ day: string }>((from, to) =>
      supabase
        .from("daily_activity")
        .select("day")
        .eq("student_id", studentId)
        .or("watched_seconds.gt.0,voca_plays.gt.0")
        .range(from, to),
    ),
    fetchAll<{ created_at: string }>((from, to) =>
      supabase.from("submissions").select("created_at").eq("student_id", studentId).range(from, to),
    ),
  ]);
  return new Set([...acts.map((a) => a.day), ...subs.map((s) => kstDate(s.created_at))]).size;
});

/** 내 고양이 단계 + 마지막으로 본 단계 (축하 화면용) */
export const catStage = cache(async (studentId: string) => {
  const supabase = createServerSupabaseClient();
  const [days, { data }] = await Promise.all([
    studyDayCount(studentId),
    supabase.from("students").select("cat_stage_seen").eq("id", studentId).maybeSingle(),
  ]);
  const stage: CatStage = catStageForDays(days);
  const seen = isCatStage(data?.cat_stage_seen) ? data.cat_stage_seen : null;
  return { stage, days, seen, next: daysToNextStage(days) };
});

export async function markCatStageSeen(studentId: string, stage: CatStage) {
  // 본 단계는 내려가지 않는다 (기록을 잠깐 못 읽어 단계가 낮게 나와도 축하가 다시 뜨지 않게)
  const { error } = await createServerSupabaseClient()
    .from("students")
    .update({ cat_stage_seen: stage })
    .eq("id", studentId)
    .or(`cat_stage_seen.is.null,cat_stage_seen.lt.${stage}`);
  if (error) console.error("고양이 단계 저장 실패:", error.message);
}
