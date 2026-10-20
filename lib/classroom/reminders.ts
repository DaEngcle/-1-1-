import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";
import { kstDate } from "./stats";
import { sendPushToStudent, type PushPayload } from "./push";

function addDays(day: string, n: number) {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * 듀오링고식 저녁 알림 문구: 연속 기록이 있으면 지키자, 쉬고 있으면 점점 장난스럽게.
 * 2주 넘게 반응이 없으면 '잠시 쉴게요' 한 번 보내고 멈춘다.
 */
export function reminderFor(name: string, streak: number, daysAway: number, seed: number): PushPayload | "pause" | null {
  const pick = <T,>(xs: T[]) => xs[seed % xs.length];
  if (daysAway === 0) return null; // 오늘 이미 공부함
  if (streak > 0) {
    return pick([
      { title: `🔥 ${streak}일 연속 기록이 위험해요!`, body: `${name}님, 오늘 한 문장만 쉐도잉해도 ${streak + 1}일째가 돼요.` },
      { title: `🔥 ${streak}일째 불꽃, 꺼지기 직전!`, body: "5분이면 충분해요. 오늘 문장 하나만 같이 해요 💪" },
      { title: "오늘 공부 아직이에요 👀", body: `${name}님의 ${streak}일 연속 기록, 오늘도 이어가 볼까요?` },
    ]);
  }
  if (daysAway <= 2) {
    return pick([
      { title: "오늘도 한 문장! ✨", body: `${name}님, 호주에서 바로 쓰는 문장 하나만 따라 해봐요.` },
      { title: "5분 쉐도잉 어때요? 🎧", body: "듣고 → 따라 말하고 → AI 채점까지. 딱 5분이면 돼요." },
    ]);
  }
  if (daysAway <= 6) {
    return pick([
      { title: "다니엘쌤이 기다려요 🥲", body: `${name}님 요즘 바쁘셨죠? 오늘은 한 문장만 같이 해요.` },
      { title: "영어 근육이 살짝 풀리는 중… 😢", body: "지금 한 문장이면 금방 돌아와요. 다시 시작이 제일 쉬워요!" },
    ]);
  }
  if (daysAway <= 13) {
    return pick([
      { title: "호주 카페 사장님이 물어봐요 ☕️", body: `"How are you finding it so far?" … ${name}님 대답 연습하러 가요!` },
      { title: "출국일은 다가오는데… ✈️", body: "오늘 딱 한 문장으로 다시 시작해요. 다잉클이 응원해요 💙" },
    ]);
  }
  return "pause";
}

/** 매일 저녁: 알림을 켠 학생 중 오늘 공부 안 한 학생에게 한 번 */
export async function sendDailyReminders() {
  const supabase = createServerSupabaseClient();
  const today = kstDate(new Date());
  const since = addDays(today, -40);
  const { data: subs } = await supabase.from("push_subscriptions").select("student_id");
  const ids = [...new Set((subs ?? []).map((s) => s.student_id as string))];
  if (ids.length === 0) return { checked: 0, sent: 0, paused: 0 };

  const [{ data: students }, { data: daily }, { data: subRows }, { data: logs }] = await Promise.all([
    supabase.from("students").select("id, name, nickname, is_active, approval").in("id", ids),
    supabase.from("daily_activity").select("student_id, day, watched_seconds").in("student_id", ids).gte("day", since),
    supabase.from("submissions").select("student_id, created_at").in("student_id", ids).gte("created_at", `${since}T00:00:00+09:00`),
    supabase.from("push_log").select("student_id, kind, sent_at").in("student_id", ids).gte("sent_at", `${addDays(today, -30)}T00:00:00+09:00`),
  ]);
  const studied = new Map<string, Set<string>>();
  const mark = (id: string, day: string) => studied.set(id, (studied.get(id) ?? new Set()).add(day));
  for (const d of daily ?? []) if (d.watched_seconds > 0) mark(d.student_id, d.day);
  for (const s of subRows ?? []) mark(s.student_id, kstDate(s.created_at));

  let sent = 0;
  let paused = 0;
  for (const st of students ?? []) {
    if (!st.is_active || st.approval !== "approved") continue;
    const myLogs = (logs ?? []).filter((l) => l.student_id === st.id);
    if (myLogs.some((l) => l.kind === "reminder" && kstDate(l.sent_at) === today)) continue; // 오늘 이미 보냄
    // '잠시 쉴게요'를 보낸 뒤로 공부 기록이 없으면 계속 쉰다
    const pausedAt = myLogs.filter((l) => l.kind === "paused").map((l) => kstDate(l.sent_at)).sort().pop();
    const days = studied.get(st.id) ?? new Set<string>();
    const last = [...days].sort().pop() ?? null;
    if (pausedAt && (!last || last <= pausedAt)) continue;

    const daysAway = last ? Math.round((Date.parse(today) - Date.parse(last)) / 86400000) : 99;
    let streak = 0;
    for (let d = addDays(today, -1); days.has(d); d = addDays(d, -1)) streak++;
    const seed = Number(today.replaceAll("-", "")) + st.id.charCodeAt(0);
    const msg = reminderFor((st.nickname as string | null) ?? (st.name as string), streak, daysAway, seed);
    if (!msg) continue;
    if (msg === "pause") {
      const n = await sendPushToStudent(
        st.id,
        { title: "알림을 잠시 쉴게요 🌙", body: "요즘 알림이 별 도움이 안 되는 것 같아서요. 언제든 돌아오면 반갑게 맞을게요 💙", tag: "reminder" },
        "paused",
      );
      if (n) paused++;
      continue;
    }
    if (await sendPushToStudent(st.id, { ...msg, url: "/student/lessons", tag: "reminder" }, "reminder")) sent++;
  }
  return { checked: ids.length, sent, paused };
}
