import "server-only";
import { createServerSupabaseClient, type AttendanceStatus } from "@/lib/supabase";
import type { WordResult } from "./azure-speech";

export function kstDate(d: Date | string) {
  return new Date(d).toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}

function addDays(date: string, days: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export interface StudentStats {
  totalSubmissions: number;
  practicedSentences: number;
  averageScore: number | null;
  bestScore: number | null;
  streakDays: number;
  activeDays: number;
  /** 최근 30일 일별 평균 종합 점수 (제출 없는 날은 null) */
  dailyScores: { date: string; score: number | null; count: number }[];
  /** 자주 틀리는 단어 (정확도 70 미만 횟수) */
  weakWords: { word: string; count: number; avg: number }[];
  attendance: Record<AttendanceStatus, number>;
  recentAttendance: { class_date: string; status: AttendanceStatus }[];
}

export async function getStudentStats(studentId: string): Promise<StudentStats> {
  const supabase = createServerSupabaseClient();
  const [{ data: subs }, { data: att }] = await Promise.all([
    supabase
      .from("submissions")
      .select("lesson_item_id, status, overall_score, word_details, created_at")
      .eq("student_id", studentId)
      .order("created_at"),
    supabase
      .from("attendance")
      .select("class_date, status")
      .eq("student_id", studentId)
      .order("class_date", { ascending: false }),
  ]);

  const submissions = subs ?? [];
  const scored = submissions.filter((s) => s.status === "scored" && s.overall_score != null);
  const scores = scored.map((s) => Number(s.overall_score));

  // 연속 학습일: 오늘(또는 어제)부터 거꾸로 제출이 있는 날 수
  const days = new Set(submissions.map((s) => kstDate(s.created_at)));
  const today = kstDate(new Date());
  let cursor = days.has(today) ? today : addDays(today, -1);
  let streakDays = 0;
  while (days.has(cursor)) {
    streakDays++;
    cursor = addDays(cursor, -1);
  }

  const byDay = new Map<string, number[]>();
  for (const s of scored) {
    const d = kstDate(s.created_at);
    byDay.set(d, [...(byDay.get(d) ?? []), Number(s.overall_score)]);
  }
  const dailyScores = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(today, i - 29);
    const list = byDay.get(date) ?? [];
    return {
      date,
      count: list.length,
      score: list.length ? Math.round(list.reduce((a, b) => a + b, 0) / list.length) : null,
    };
  });

  const wordStats = new Map<string, { miss: number; total: number; sum: number }>();
  for (const s of scored) {
    for (const w of (s.word_details as WordResult[] | null) ?? []) {
      if (w.errorType === "Insertion") continue;
      const key = w.word.toLowerCase();
      const ws = wordStats.get(key) ?? { miss: 0, total: 0, sum: 0 };
      ws.total++;
      ws.sum += w.accuracy;
      if (w.accuracy < 70 || w.errorType === "Omission") ws.miss++;
      wordStats.set(key, ws);
    }
  }
  const weakWords = [...wordStats.entries()]
    .filter(([, v]) => v.miss > 0)
    .map(([word, v]) => ({ word, count: v.miss, avg: Math.round(v.sum / v.total) }))
    .sort((a, b) => b.count - a.count || a.avg - b.avg)
    .slice(0, 5);

  const attendance: Record<AttendanceStatus, number> = { present: 0, late: 0, absent: 0, excused: 0 };
  for (const a of att ?? []) attendance[a.status as AttendanceStatus]++;

  return {
    totalSubmissions: submissions.length,
    practicedSentences: new Set(submissions.map((s) => s.lesson_item_id)).size,
    averageScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
    bestScore: scores.length ? Math.round(Math.max(...scores)) : null,
    streakDays,
    activeDays: days.size,
    dailyScores,
    weakWords,
    attendance,
    recentAttendance: (att ?? []).slice(0, 10) as StudentStats["recentAttendance"],
  };
}
