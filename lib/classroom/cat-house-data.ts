import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";
import { fetchAll } from "./progress";
import { addDays, kstDate } from "./stats";
import type { CatBreed } from "./cat";
import { maskName, weekStart } from "./engagement";
import {
  DEFAULT_LAYOUT,
  FREE_ITEMS,
  POSTCARD_MIN,
  churuForDay,
  normalizeLayout,
  postcardFor,
  type Layout,
} from "./cat-house";

/** 공부 기록으로 번 츄르 · 쓴 츄르 · 마지막 공부일 */
export async function getChuru(studentId: string) {
  const supabase = createServerSupabaseClient();
  const [acts, subs, { data: items }, { count: likesGot }, { count: likesGave }, { data: boxes }] = await Promise.all([
    fetchAll<{ day: string; watched_seconds: number; voca_points: number | null }>((from, to) =>
      supabase.from("daily_activity").select("day, watched_seconds, voca_points").eq("student_id", studentId).range(from, to),
    ),
    fetchAll<{ created_at: string }>((from, to) =>
      supabase.from("submissions").select("created_at").eq("student_id", studentId).range(from, to),
    ),
    supabase.from("cat_items").select("item_id, price").eq("student_id", studentId),
    supabase.from("cat_room_likes").select("owner_id", { count: "exact", head: true }).eq("owner_id", studentId),
    supabase.from("cat_room_likes").select("owner_id", { count: "exact", head: true }).eq("liker_id", studentId),
    supabase.from("cat_boxes").select("week, item_id, churu").eq("student_id", studentId),
  ]);
  const days = new Map<string, { submissions: number; watchedSeconds: number; vocaPoints: number }>();
  const get = (d: string) => {
    let v = days.get(d);
    if (!v) days.set(d, (v = { submissions: 0, watchedSeconds: 0, vocaPoints: 0 }));
    return v;
  };
  for (const a of acts) {
    const v = get(a.day);
    v.watchedSeconds += a.watched_seconds ?? 0;
    v.vocaPoints += a.voca_points ?? 0;
  }
  for (const s of subs) get(kstDate(s.created_at)).submissions++;

  let earned = 0;
  let last: string | null = null;
  const today = kstDate(new Date());
  const week = weekStart(today);
  let todayEarned = 0;
  let weekDays = 0;
  const postcardDays: string[] = [];
  for (const [day, v] of days) {
    const c = churuForDay(v);
    earned += c;
    if (day === today) todayEarned = c;
    if (c > 0 && (!last || day > last)) last = day;
    if (c > 0 && day >= week) weekDays++;
    if (c >= POSTCARD_MIN) postcardDays.push(day);
  }
  // 친밀도는 공부로 번 츄르만 센다 (선물·상자 제외)
  const studyEarned = earned;
  // 꾹꾹이: 받으면 +3, 누르면 +1 / 깜짝 상자 츄르
  earned += (likesGot ?? 0) * 3 + (likesGave ?? 0) + (boxes ?? []).reduce((n, b) => n + (b.churu ?? 0), 0);
  postcardDays.sort();
  const postcards = new Map<string, string>(); // 엽서 id → 처음 받은 날
  for (const d of postcardDays) {
    const p = postcardFor(studentId, d);
    if (!postcards.has(p.id)) postcards.set(p.id, d);
  }
  const spent = (items ?? []).reduce((n, i) => n + (i.price ?? 0), 0);
  let daysSince: number | null = null;
  if (last) {
    daysSince = 0;
    while (addDays(last, daysSince) < today && daysSince < 60) daysSince++;
  }
  return {
    balance: Math.max(0, earned - spent),
    /** 번 것보다 많이 썼는지 (동시 구매 확인용) */
    spentOver: spent > earned,
    todayEarned,
    owned: new Set<string>([...FREE_ITEMS, ...(items ?? []).map((i) => i.item_id as string)]),
    daysSince,
    studyEarned,
    weekDays,
    boxOpened: (boxes ?? []).some((b) => b.week === week),
    postcards,
    todayPostcard: todayEarned >= POSTCARD_MIN ? postcardFor(studentId, today) : null,
  };
}

export async function getRoom(studentId: string): Promise<{ layout: Layout; likes: number }> {
  const { data } = await createServerSupabaseClient()
    .from("cat_rooms")
    .select("layout, likes")
    .eq("student_id", studentId)
    .maybeSingle();
  return { layout: data ? normalizeLayout(data.layout) : DEFAULT_LAYOUT, likes: data?.likes ?? 0 };
}

/** 구경할 수 있는 다른 학생 방 (꾸민 사람만, 최근 꾸민 순) */
export async function listRooms(excludeId: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("cat_rooms")
    .select("student_id, layout, likes, updated_at, students(name, nickname, cat_breed, cat_name, is_active)")
    .neq("student_id", excludeId)
    .order("updated_at", { ascending: false })
    .limit(40);
  return (data ?? [])
    .map((r) => {
      const s = r.students as unknown as {
        name: string;
        nickname: string | null;
        cat_breed: string | null;
        cat_name: string | null;
        is_active: boolean;
      } | null;
      if (!s || !s.is_active) return null;
      return {
        id: r.student_id as string,
        name: s.nickname ?? maskName(s.name),
        catName: s.cat_name,
        breed: s.cat_breed as CatBreed | null,
        likes: r.likes ?? 0,
        layout: normalizeLayout(r.layout),
      };
    })
    .filter((r) => r !== null);
}

/** 이 방에 오늘 꾹꾹이를 눌렀는지 */
export async function likedToday(ownerId: string, likerId: string) {
  const { data } = await createServerSupabaseClient()
    .from("cat_room_likes")
    .select("owner_id")
    .eq("owner_id", ownerId)
    .eq("liker_id", likerId)
    .eq("day", kstDate(new Date()))
    .maybeSingle();
  return Boolean(data);
}

export type GuestbookEntry = { id: number; writerId: string; name: string; message: string; day: string; mine: boolean };

/** 방명록 최근 글 (최신 순) */
export async function listGuestbook(ownerId: string, viewerId: string, limit = 20): Promise<GuestbookEntry[]> {
  const { data } = await createServerSupabaseClient()
    .from("cat_guestbook")
    .select("id, writer_id, message, day, students!cat_guestbook_writer_id_fkey(name, nickname, is_active)")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? [])
    .map((r) => {
      const s = r.students as unknown as { name: string; nickname: string | null; is_active: boolean } | null;
      if (!s || !s.is_active) return null;
      return {
        id: r.id as number,
        writerId: r.writer_id as string,
        name: s.nickname ?? maskName(s.name),
        message: r.message as string,
        day: r.day as string,
        mine: r.writer_id === viewerId,
      };
    })
    .filter((r) => r !== null);
}
