import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";
import { fetchAll } from "./progress";
import { addDays, kstDate } from "./stats";
import { maskName } from "./engagement";
import type { CatBreed } from "./cat";
import { DEFAULT_LAYOUT, FREE_ITEMS, churuForDay, normalizeLayout, type Layout } from "./cat-house";

/** 공부 기록으로 번 츄르 · 쓴 츄르 · 마지막 공부일 */
export async function getChuru(studentId: string) {
  const supabase = createServerSupabaseClient();
  const [acts, subs, { data: items }] = await Promise.all([
    fetchAll<{ day: string; watched_seconds: number; voca_points: number | null }>((from, to) =>
      supabase.from("daily_activity").select("day, watched_seconds, voca_points").eq("student_id", studentId).range(from, to),
    ),
    fetchAll<{ created_at: string }>((from, to) =>
      supabase.from("submissions").select("created_at").eq("student_id", studentId).range(from, to),
    ),
    supabase.from("cat_items").select("item_id, price").eq("student_id", studentId),
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
  let todayEarned = 0;
  for (const [day, v] of days) {
    const c = churuForDay(v);
    earned += c;
    if (day === today) todayEarned = c;
    if (c > 0 && (!last || day > last)) last = day;
  }
  const spent = (items ?? []).reduce((n, i) => n + (i.price ?? 0), 0);
  let daysSince: number | null = null;
  if (last) {
    daysSince = 0;
    while (addDays(last, daysSince) < today && daysSince < 60) daysSince++;
  }
  return {
    balance: Math.max(0, earned - spent),
    todayEarned,
    owned: new Set<string>([...FREE_ITEMS, ...(items ?? []).map((i) => i.item_id as string)]),
    daysSince,
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
    .select("student_id, likes, updated_at, students(name, nickname, cat_breed, cat_name, is_active)")
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
