import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";
import { kstDate } from "./stats";
import { getLessonProgress, studentActivity, studentSubmissions } from "./progress";

// 학습 포인트: 영상 1분 = 1, 쉐도잉 제출 = 10, 80점 이상이면 +5
const XP_PER_SUBMISSION = 10;
const XP_HIGH_SCORE_BONUS = 5;
const HIGH_SCORE = 80;

function addDays(day: string, n: number) {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** 이번 주 월요일 (한국 시간) */
export function weekStart(today = kstDate(new Date())) {
  const dow = new Date(`${today}T00:00:00Z`).getUTCDay(); // 0=일
  return addDays(today, -((dow + 6) % 7));
}

/** 이번 주 쉐도잉 목표 (홈·내 쉐도잉에서 '전체 1,560개 중 2개' 대신 보여준다) */
export const WEEKLY_SHADOWING_GOAL = 20;

/** 이번 주(월요일부터, 한국 시간)에 쉐도잉한 문장 수 (같은 문장을 여러 번 내도 1개) */
export async function weekShadowingCount(studentId: string) {
  // 홈의 다른 계산과 같이 쓰는 제출 기록에서 이번 주 것만 센다
  const since = new Date(`${weekStart()}T00:00:00+09:00`).getTime();
  const rows = (await studentSubmissions(studentId)).filter((r) => new Date(r.created_at).getTime() >= since);
  return new Set(rows.map((r) => r.lesson_item_id)).size;
}

type SubRow = { created_at: string; status: string; overall_score: number | null };

interface DayActivity {
  watchedSeconds: number;
  vocaPlays: number;
  submissions: number;
  bestScore: number;
}

function buildDays(watchRows: { day: string; watched_seconds: number; voca_plays?: number | null }[], subs: SubRow[]) {
  const days = new Map<string, DayActivity>();
  const get = (d: string) => {
    let v = days.get(d);
    if (!v) days.set(d, (v = { watchedSeconds: 0, vocaPlays: 0, submissions: 0, bestScore: 0 }));
    return v;
  };
  for (const w of watchRows) {
    get(w.day).watchedSeconds += w.watched_seconds;
    get(w.day).vocaPlays += w.voca_plays ?? 0;
  }
  for (const s of subs) {
    const d = get(kstDate(s.created_at));
    d.submissions++;
    if (s.status === "scored") d.bestScore = Math.max(d.bestScore, Number(s.overall_score ?? 0));
  }
  return days;
}

function streaks(studied: Set<string>, today: string) {
  let current = 0;
  let cursor = studied.has(today) ? today : addDays(today, -1);
  while (studied.has(cursor)) {
    current++;
    cursor = addDays(cursor, -1);
  }
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of [...studied].sort()) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return { current, best };
}

export interface Badge {
  id: string;
  label: string;
  hint: string;
  earned: boolean;
}

export interface CalendarDay {
  day: string;
  /** 0 = 안 함, 1 = 영상만, 2 = 쉐도잉 제출 */
  level: 0 | 1 | 2;
  attended: boolean;
  future: boolean;
}

export interface Engagement {
  streak: number;
  /** 지금까지 공부한 날 수 */
  totalDays: number;
  bestStreak: number;
  month: { label: string; firstWeekday: number; days: CalendarDay[]; studiedDays: number };
  missions: { label: string; done: boolean }[];
  badges: Badge[];
  /** 아직 다 안 끝낸 첫 공개 레슨 (이어서 공부하기) */
  nextLesson: { id: string; label: string } | null;
}

/** 학생 한 명의 달력·연속 학습·오늘의 미션·배지 */
export async function getEngagement(studentId: string): Promise<Engagement> {
  const supabase = createServerSupabaseClient();
  const [watchRows, subs, { data: attRows }, { count: completedVideos }, lessonRows, { data: tests }] =
    await Promise.all([
      studentActivity(studentId),
      studentSubmissions(studentId),
      supabase.from("attendance").select("class_date, status").eq("student_id", studentId),
      supabase
        .from("video_progress")
        .select("lesson_id", { count: "exact", head: true })
        .eq("student_id", studentId)
        .not("completed_at", "is", null),
      getLessonProgress(studentId),
      supabase.from("level_tests").select("kind, level, finished_at").eq("student_id", studentId),
    ]);

  const today = kstDate(new Date());
  const days = buildDays(watchRows, subs);
  const studied = new Set([...days].filter(([, v]) => v.watchedSeconds > 0 || v.submissions > 0 || v.vocaPlays > 0).map(([d]) => d));
  const { current, best } = streaks(studied, today);
  const attended = new Set(
    (attRows ?? []).filter((a) => a.status === "present" || a.status === "late").map((a) => a.class_date),
  );

  // 이번 달 달력
  const monthStart = `${today.slice(0, 8)}01`;
  const monthDays: CalendarDay[] = [];
  for (let d = monthStart; d.slice(0, 7) === monthStart.slice(0, 7); d = addDays(d, 1)) {
    const a = days.get(d);
    monthDays.push({
      day: d,
      level: a?.submissions ? 2 : a?.watchedSeconds || a?.vocaPlays ? 1 : 0,
      attended: attended.has(d),
      future: d > today,
    });
  }
  const firstWeekday = (new Date(`${monthStart}T00:00:00Z`).getUTCDay() + 6) % 7; // 월=0

  const todayAct = days.get(today);
  const missions = [
    { label: "영상 10분 이상 보기", done: (todayAct?.watchedSeconds ?? 0) >= 600 },
    { label: "쉐도잉 1문장 제출", done: (todayAct?.submissions ?? 0) > 0 },
    { label: `쉐도잉 ${HIGH_SCORE}점 넘기기`, done: (todayAct?.bestScore ?? 0) >= HIGH_SCORE },
  ];

  const scores = subs.filter((s) => s.status === "scored").map((s) => Number(s.overall_score ?? 0));
  const maxScore = scores.length ? Math.max(...scores) : 0;
  const weeks = new Map<number, boolean>();
  for (const r of lessonRows) {
    const done = (r.videoPercent == null || r.videoCompleted) && r.submitted === r.sentences;
    weeks.set(r.lesson.week_number, (weeks.get(r.lesson.week_number) ?? true) && done);
  }
  const weekCleared = [...weeks.values()].some(Boolean);
  const pre = tests?.find((t) => t.kind === "pre" && t.finished_at);
  const post = tests?.find((t) => t.kind === "post" && t.finished_at);

  const badges: Badge[] = [
    { id: "first", label: "첫 걸음", hint: "쉐도잉 첫 제출", earned: subs.length > 0 },
    { id: "streak3", label: "3일 연속", hint: "3일 연속 공부", earned: best >= 3 },
    { id: "streak7", label: "7일 연속", hint: "7일 연속 공부", earned: best >= 7 },
    { id: "streak30", label: "30일 연속", hint: "30일 연속 공부", earned: best >= 30 },
    { id: "video1", label: "첫 수강 완료", hint: "영상 하나를 90% 이상 시청", earned: (completedVideos ?? 0) > 0 },
    { id: "week", label: "한 주 완주", hint: "한 주 영상·쉐도잉 모두 완료", earned: weekCleared },
    { id: "score80", label: "첫 80점", hint: "쉐도잉 80점 이상", earned: maxScore >= 80 },
    { id: "score90", label: "첫 90점", hint: "쉐도잉 90점 이상", earned: maxScore >= 90 },
    { id: "sub10", label: "쉐도잉 10회", hint: "쉐도잉 10번 제출", earned: subs.length >= 10 },
    { id: "sub50", label: "쉐도잉 50회", hint: "쉐도잉 50번 제출", earned: subs.length >= 50 },
    { id: "test", label: "레벨 확인", hint: "레벨테스트 완료", earned: Boolean(pre) },
    {
      id: "levelup",
      label: "레벨 업",
      hint: "수강 후 테스트에서 레벨 상승",
      earned: Boolean(pre && post && (post.level ?? 0) > (pre.level ?? 0)),
    },
  ];

  const next = lessonRows.find(
    (r) => (r.videoPercent != null && !r.videoCompleted) || r.submitted < r.sentences,
  )?.lesson;

  return {
    nextLesson: next
      ? {
          id: next.id,
          label: next.kind === "day" ? `Day ${String(next.day_number).padStart(2, "0")} · ${next.title}` : next.title,
        }
      : null,
    streak: current,
    bestStreak: best,
    totalDays: studied.size,
    month: {
      label: `${Number(today.slice(5, 7))}월`,
      firstWeekday,
      days: monthDays,
      studiedDays: monthDays.filter((d) => !d.future && d.level > 0).length,
    },
    missions,
    badges,
  };
}

export function maskName(name: string) {
  const chars = [...name];
  if (chars.length <= 1) return name;
  if (chars.length === 2) return `${chars[0]}*`;
  return `${chars[0]}${"*".repeat(chars.length - 2)}${chars[chars.length - 1]}`;
}

export interface RankRow {
  studentId: string;
  name: string;
  xp: number;
  rank: number;
  catBreed: string | null;
}

/**
 * 이번 주(월~일) 학습 포인트 순위.
 * masked=true(학생 화면): 닉네임, 없으면 이름 가운데를 가림. false(선생님): 실명 (닉네임)
 */
export async function getWeeklyRanking({ masked }: { masked: boolean }): Promise<RankRow[]> {
  return getRanking({ masked, start: weekStart() });
}

/** 이번 달 시즌(1일~말일) 포인트 순위 — 리그 티어용 */
export async function getSeasonRanking({ masked }: { masked: boolean }): Promise<RankRow[]> {
  return getRanking({ masked, start: `${kstDate(new Date()).slice(0, 8)}01` });
}

// 순위는 모든 학생에게 똑같아서 1분 동안 서버에 저장해 두고 같이 쓴다 (홈을 열 때마다 이번 달 기록 전체를 다시 읽지 않게)
const RANK_TTL = 60_000;
const rankCache = new Map<string, { at: number; rows: Promise<RankRow[]> }>();

/** start(한국 날짜)부터 지금까지 학습 포인트 순위 */
function getRanking(opts: { masked: boolean; start: string }): Promise<RankRow[]> {
  const key = `${opts.masked}|${opts.start}`;
  const hit = rankCache.get(key);
  if (hit && Date.now() - hit.at < RANK_TTL) return hit.rows;
  const rows = computeRanking(opts);
  rankCache.set(key, { at: Date.now(), rows });
  rows.catch(() => rankCache.delete(key));
  return rows;
}

async function computeRanking({ masked, start }: { masked: boolean; start: string }): Promise<RankRow[]> {
  const supabase = createServerSupabaseClient();
  const startIso = new Date(`${start}T00:00:00+09:00`).toISOString();
  const [{ data: students }, { data: xpRows, error: xpError }] = await Promise.all([
    supabase
      .from("students")
      .select("id, name, nickname, cat_breed")
      .eq("is_active", true)
      // 시트에서 가져왔지만 아직 가입 안 한 학생은 랭킹에서 뺀다
      .or("password_hash.not.is.null,login_code_hash.not.is.null"),
    // 학생별 포인트 합계는 DB에서 계산해 받는다 (이번 달 기록 전체를 서버로 가져오지 않게)
    // 시청 분 + 보카 포인트 + 제출당 XP_PER_SUBMISSION + 고득점 보너스 — 함수 정의는 Supabase 'league_xp'
    supabase.rpc("league_xp", {
      p_start_day: start,
      p_start_ts: startIso,
      p_per_sub: XP_PER_SUBMISSION,
      p_high: HIGH_SCORE,
      p_bonus: XP_HIGH_SCORE_BONUS,
    }),
  ]);
  // 실패를 0점 순위로 저장해 두지 않게 던진다 (getRanking이 캐시에서 지운다)
  if (xpError) throw new Error(`리그 점수 계산 실패: ${xpError.message}`);

  const xp = new Map<string, number>(
    ((xpRows ?? []) as { student_id: string; xp: number | string }[]).map((r) => [r.student_id, Number(r.xp)]),
  );

  const rows = (students ?? [])
    .map((s) => ({
      studentId: s.id as string,
      name: masked
        ? ((s.nickname as string | null) ?? maskName(s.name))
        : s.nickname
          ? `${s.name} (${s.nickname})`
          : (s.name as string),
      xp: xp.get(s.id) ?? 0,
      catBreed: (s.cat_breed as string | null) ?? null,
    }))
    .sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name));
  // 같은 점수는 같은 등수
  let rank = 0;
  return rows.map((r, i) => {
    if (i === 0 || r.xp !== rows[i - 1].xp) rank = i + 1;
    return { ...r, rank };
  });
}

/**
 * 실제로 재생한 시간을 오늘 날짜(한국 시간)에 더한다.
 * 브라우저가 보낸 값은 마지막 기록 이후 흐른 시간(2배속까지)만큼만 인정한다.
 */
/** 보카 한 판을 오늘(한국 날짜) 학습으로 기록 — 연속 학습일에 들어간다 */
export async function addVocaPlay(studentId: string, points = 0) {
  const supabase = createServerSupabaseClient();
  const day = kstDate(new Date());
  const { data } = await supabase
    .from("daily_activity")
    .select("voca_plays, voca_points")
    .eq("student_id", studentId)
    .eq("day", day)
    .maybeSingle();
  if (data) {
    await supabase
      .from("daily_activity")
      // 보카 포인트는 하루 100P까지만 (랭킹 쏠림 방지)
      .update({ voca_plays: (data.voca_plays ?? 0) + 1, voca_points: Math.min(100, (data.voca_points ?? 0) + points) })
      .eq("student_id", studentId)
      .eq("day", day);
  } else {
    // updated_at은 영상 시간 부풀리기 방지용이라 건드리지 않도록 새 줄은 과거 시각으로
    await supabase
      .from("daily_activity")
      .insert({
        student_id: studentId,
        day,
        voca_plays: 1,
        voca_points: Math.min(100, points),
        updated_at: new Date(0).toISOString(),
      });
  }
}

export async function addWatchedSeconds(studentId: string, claimedSeconds: number) {
  if (!(claimedSeconds > 0)) return;
  const supabase = createServerSupabaseClient();
  const day = kstDate(new Date());
  const { data } = await supabase
    .from("daily_activity")
    .select("watched_seconds, updated_at")
    .eq("student_id", studentId)
    .eq("day", day)
    .maybeSingle();
  const allowed = data
    ? Math.min(60, Math.floor(((Date.now() - new Date(data.updated_at).getTime()) / 1000) * 2))
    : 30;
  const add = Math.min(Math.floor(claimedSeconds), allowed);
  if (add <= 0) return;
  await supabase.from("daily_activity").upsert({
    student_id: studentId,
    day,
    watched_seconds: (data?.watched_seconds ?? 0) + add,
    updated_at: new Date().toISOString(),
  });
}
