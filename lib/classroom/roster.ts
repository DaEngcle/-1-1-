import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";
import { fetchAll, getCourseProgress, type CourseProgress } from "./progress";
import { kstDate } from "./stats";

/** 학생 상태 신호등 */
export type RosterStatus = "new" | "good" | "slow" | "risk" | "noaccount";

export const STATUS_INFO: Record<RosterStatus, { icon: string; label: string; tone: string }> = {
  good: { icon: "🟢", label: "잘 따라오는 중", tone: "bg-green-50 text-green-800 border-green-200" },
  slow: { icon: "🟡", label: "느슨해짐", tone: "bg-amber-50 text-amber-800 border-amber-200" },
  risk: { icon: "🔴", label: "이탈 위험", tone: "bg-red-50 text-red-700 border-red-200" },
  new: { icon: "🆕", label: "시작 전", tone: "bg-slate-50 text-slate-700 border-slate-200" },
  noaccount: { icon: "🔑", label: "가입 안내 필요", tone: "bg-violet-50 text-violet-800 border-violet-200" },
};

export interface RosterRow {
  id: string;
  name: string;
  nickname: string | null;
  phone: string | null;
  memo: string | null;
  isActive: boolean;
  plan: string | null;
  accessUntil: string | null;
  daysLeft: number | null;
  createdAt: string;
  cohortId: string | null;
  /** 로그인할 방법(비밀번호·코드)이 있는지. 시트에서 가져온 학생은 없음 */
  hasAccount: boolean;
  status: RosterStatus;
  lastActive: string | null;
  daysInactive: number | null;
  /** 최근 7일(6일 전 → 오늘) 공부한 날 */
  week: boolean[];
  weekSubmissions: number;
  totalSubmissions: number;
  avgScore30: number | null;
  attendanceRate: number | null;
  levelPre: number | null;
  levelPost: number | null;
  progress: CourseProgress | undefined;
}

function addDays(day: string, n: number) {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function daysBetween(from: string, to: string) {
  return Math.round((new Date(`${to}T00:00:00Z`).getTime() - new Date(`${from}T00:00:00Z`).getTime()) / 86400000);
}

/** 선생님 관리판: 승인된 학생 전체의 활동·진도·상태 */
export async function getRoster(): Promise<RosterRow[]> {
  const supabase = createServerSupabaseClient();
  const { data: studentRows } = await supabase
    .from("students")
    .select("id, name, nickname, phone, memo, is_active, plan, access_until, created_at, cohort_id, password_hash, login_code_hash")
    .eq("approval", "approved")
    // 무료회원(웨비나 등)·상담 고객은 학생 관리판이 아니라 상담·고객 탭에서 본다
    .eq("stage", "enrolled")
    .order("name");
  const students = studentRows ?? [];
  const ids = students.map((s) => s.id as string);
  if (ids.length === 0) return [];

  const today = kstDate(new Date());
  const since30 = addDays(today, -29);
  const [progress, subs, daily, videos, { data: att }, { data: tests }] = await Promise.all([
    getCourseProgress(ids),
    fetchAll<{ student_id: string; created_at: string; status: string; overall_score: number | null }>((from, to) =>
      supabase.from("submissions").select("student_id, created_at, status, overall_score").in("student_id", ids).range(from, to),
    ),
    fetchAll<{ student_id: string; day: string; watched_seconds: number }>((from, to) =>
      supabase
        .from("daily_activity")
        .select("student_id, day, watched_seconds")
        .in("student_id", ids)
        .gte("day", since30)
        .range(from, to),
    ),
    fetchAll<{ student_id: string; updated_at: string }>((from, to) =>
      supabase.from("video_progress").select("student_id, updated_at").in("student_id", ids).range(from, to),
    ),
    supabase.from("attendance").select("student_id, status").in("student_id", ids),
    supabase.from("level_tests").select("student_id, kind, level").in("student_id", ids).not("finished_at", "is", null),
  ]);

  const activeDays = new Map<string, Set<string>>();
  const lastDay = new Map<string, string>();
  const touch = (id: string, day: string) => {
    activeDays.set(id, (activeDays.get(id) ?? new Set()).add(day));
    if (!lastDay.has(id) || day > lastDay.get(id)!) lastDay.set(id, day);
  };
  for (const s of subs) touch(s.student_id, kstDate(s.created_at));
  for (const d of daily) if (d.watched_seconds > 0) touch(d.student_id, d.day);
  for (const v of videos) touch(v.student_id, kstDate(v.updated_at));

  const weekStart = addDays(today, -6);
  return students.map((s) => {
    const id = s.id as string;
    const mySubs = subs.filter((x) => x.student_id === id);
    const scored30 = mySubs.filter((x) => x.status === "scored" && kstDate(x.created_at) >= since30);
    const days = activeDays.get(id) ?? new Set<string>();
    const week = Array.from({ length: 7 }, (_, i) => days.has(addDays(weekStart, i)));
    const last = lastDay.get(id) ?? null;
    const daysInactive = last ? daysBetween(last, today) : null;
    const sinceJoin = daysBetween(kstDate(s.created_at), today);
    const weekActive = week.filter(Boolean).length;

    const hasAccount = Boolean(s.password_hash || s.login_code_hash);
    let status: RosterStatus;
    if (!hasAccount) status = "noaccount";
    else if (!last) status = sinceJoin < 3 ? "new" : "risk";
    else if (daysInactive! >= 7) status = "risk";
    else if (daysInactive! >= 3 || weekActive <= 1) status = "slow";
    else status = "good";

    const myAtt = (att ?? []).filter((a) => a.student_id === id);
    const attended = myAtt.filter((a) => a.status === "present" || a.status === "late").length;
    const until = (s.access_until as string | null) ?? null;

    return {
      id,
      name: s.name as string,
      nickname: (s.nickname as string | null) ?? null,
      phone: (s.phone as string | null) ?? null,
      memo: (s.memo as string | null) ?? null,
      isActive: Boolean(s.is_active),
      plan: (s.plan as string | null) ?? null,
      accessUntil: until,
      daysLeft: until ? daysBetween(today, until) : null,
      createdAt: s.created_at as string,
      cohortId: (s.cohort_id as string | null) ?? null,
      hasAccount,
      status,
      lastActive: last,
      daysInactive,
      week,
      weekSubmissions: mySubs.filter((x) => kstDate(x.created_at) >= weekStart).length,
      totalSubmissions: mySubs.length,
      avgScore30: scored30.length
        ? Math.round(scored30.reduce((a, x) => a + Number(x.overall_score ?? 0), 0) / scored30.length)
        : null,
      attendanceRate: myAtt.length ? Math.round((attended / myAtt.length) * 100) : null,
      levelPre: ((tests ?? []).find((t) => t.student_id === id && t.kind === "pre")?.level as number | undefined) ?? null,
      levelPost: ((tests ?? []).find((t) => t.student_id === id && t.kind === "post")?.level as number | undefined) ?? null,
      progress: progress.get(id),
    };
  });
}

/** 상태별로 학생에게 보낼 카톡 응원 메시지 초안 */
export function nudgeMessage(row: RosterRow, loginUrl: string) {
  const who = `${row.nickname ?? row.name}님`;
  switch (row.status) {
    case "noaccount":
      return `${who} 안녕하세요! 다잉클 온라인 클래스룸이 열렸어요 🎉 아래 링크에서 '처음이에요(가입)'로 이름·전화번호만 넣어주시면 바로 연결해 드릴게요. 쉐도잉 채점, 레벨테스트, 강의 진도까지 한 곳에서 볼 수 있어요 💙\n👉 ${loginUrl}`;
    case "new":
      return `${who} 환영해요! 🎉 레벨테스트로 지금 실력부터 확인하고, Day 01부터 같이 시작해봐요 💪\n👉 ${loginUrl}`;
    case "risk":
      return `${who}, 요즘 많이 바쁘셨죠? 😊 다시 시작하는 게 제일 어려운데, 오늘은 쉐도잉 한 문장만 같이 해봐요! 딱 5분이면 돼요 💪\n👉 ${loginUrl}`;
    case "slow":
      return `${who} 이번 주도 화이팅이에요! 🔥 하루 10분이면 충분해요. 오늘 쉐도잉 한 문장 도전해볼까요?\n👉 ${loginUrl}`;
    default:
      return `${who} 요즘 정말 꾸준하네요! 👏 이번 주 쉐도잉 ${row.weekSubmissions}개 제출, 이대로만 가면 금방 늘어요 🚀`;
  }
}
