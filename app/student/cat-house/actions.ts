"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { kstDate } from "@/lib/classroom/stats";
import { BOX_MIN_DAYS, BOX_ODDS, ITEMS, ITEM_BY_ID, ROOM_UPGRADES, checkGuestbook, inSeason, normalizeLayout, priceOn, type Layout } from "@/lib/classroom/cat-house";
import { weekStart } from "@/lib/classroom/engagement";
import { getChuru, getRoom } from "@/lib/classroom/cat-house-data";

/** 상점에서 아이템 사기 (츄르가 충분할 때만) */
export async function buyItem(itemId: string) {
  const student = await requireStudent();
  const item = ITEM_BY_ID.get(itemId);
  if (!item || item.price <= 0) return { ok: false, message: "살 수 없는 아이템이에요." };
  const today = kstDate(new Date());
  if (!inSeason(item, today)) return { ok: false, message: "기간 한정 아이템이라 지금은 살 수 없어요." };
  // 오늘의 특가면 30% 싸게
  const price = priceOn(item, today);
  const churu = await getChuru(student.id);
  if (churu.owned.has(itemId)) return { ok: false, message: "이미 가지고 있어요." };
  if (itemId === "room-3" && !churu.owned.has("room-2")) return { ok: false, message: "큰 방을 먼저 넓혀야 해요." };
  if (churu.balance < price) return { ok: false, message: `츄르가 ${price - churu.balance}개 모자라요. 공부하면 모여요! 🐟` };
  const { error } = await createServerSupabaseClient()
    .from("cat_items")
    .insert({ student_id: student.id, item_id: itemId, price });
  if (error) return { ok: false, message: "사지 못했어요. 다시 해 주세요." };
  // 동시에 여러 개를 사서 츄르가 모자라게 되면 방금 산 것을 되돌린다
  const after = await getChuru(student.id);
  if (after.balance < 0 || after.spentOver) {
    await createServerSupabaseClient().from("cat_items").delete().eq("student_id", student.id).eq("item_id", itemId);
    return { ok: false, message: "츄르가 모자라요. 다시 확인해 주세요 🐟" };
  }
  revalidatePath("/student/cat-house");
  return { ok: true, message: `${item.name} 샀어요! 방에 놓아 보세요 🏠` };
}

/** 방 배치 저장 (가진 아이템만 놓을 수 있다) */
export async function saveLayout(raw: Layout) {
  const student = await requireStudent();
  const layout = normalizeLayout(raw);
  const { owned } = await getChuru(student.id);
  // normalizeLayout이 종류·위치·개수를 이미 맞춰 준다. 여기선 가진 것만 놓았는지 확인
  const roomItem = ROOM_UPGRADES.find((r) => r.size === layout.size)?.id;
  const used = [layout.wall, layout.floor, layout.window, ...layout.items.map((p) => p.id), layout.wear.hat, layout.wear.outfit, roomItem];
  if (used.some((id) => id && !owned.has(id))) return { ok: false, message: "아직 안 산 아이템이 있어요." };
  const { error } = await createServerSupabaseClient()
    .from("cat_rooms")
    .upsert({ student_id: student.id, layout, updated_at: new Date().toISOString() });
  if (error) return { ok: false, message: "저장하지 못했어요." };
  revalidatePath("/student/cat-house");
  return { ok: true, message: "저장했어요 🏠" };
}

/** 친구 방에 꾹꾹이 (하루 한 번) */
export async function likeRoom(ownerId: string) {
  const student = await requireStudent();
  if (ownerId === student.id) return { ok: false, message: "내 방에는 누를 수 없어요." };
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("cat_room_likes")
    .insert({ owner_id: ownerId, liker_id: student.id, day: kstDate(new Date()) });
  if (error) return { ok: false, message: "오늘은 이미 꾹꾹이를 눌렀어요 🐾" };
  const { likes } = await getRoom(ownerId);
  await supabase.from("cat_rooms").update({ likes: likes + 1 }).eq("student_id", ownerId);
  revalidatePath(`/student/cat-house/${ownerId}`);
  return { ok: true, message: "꾹꾹이를 남겼어요 🐾" };
}

/** 주간 깜짝 상자 열기 (이번 주 3일 이상 공부하면 무료로 한 번) */
export async function openBox() {
  const student = await requireStudent();
  const churu = await getChuru(student.id);
  if (churu.boxOpened) return { ok: false, message: "이번 주 상자는 이미 열었어요. 다음 주 월요일에 새 상자가 와요 🎁" };
  if (churu.weekDays < BOX_MIN_DAYS) {
    return { ok: false, message: `이번 주 ${BOX_MIN_DAYS}일 공부하면 열 수 있어요 (지금 ${churu.weekDays}일)` };
  }
  // 등급 뽑기 (확률 공개: 일반 75 · 레어 22 · 전설 3)
  const roll = Math.random() * 100;
  const rarity = roll < BOX_ODDS.전설 ? "전설" : roll < BOX_ODDS.전설 + BOX_ODDS.레어 ? "레어" : "일반";
  const today = kstDate(new Date());
  const pool = ITEMS.filter(
    (i) => i.price > 0 && i.kind !== "room" && inSeason(i, today) && i.rarity === rarity && !churu.owned.has(i.id),
  );
  const item = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("cat_boxes")
    .insert({ student_id: student.id, week: weekStart(), item_id: item?.id ?? null, churu: item ? 0 : 30 });
  if (error) return { ok: false, message: "이번 주 상자는 이미 열었어요 🎁" };
  if (item) await supabase.from("cat_items").insert({ student_id: student.id, item_id: item.id, price: 0 });
  revalidatePath("/student/cat-house");
  return item
    ? { ok: true, message: `🎉 ${rarity} 아이템 「${item.name}」이(가) 나왔어요!`, itemId: item.id }
    : { ok: true, message: "🎉 이미 다 가지고 있어서 츄르 30개로 바꿔 드렸어요!" };
}

/** 친구 방 방명록에 영어 한 줄 (방마다 하루 한 번) */
export async function writeGuestbook(ownerId: string, message: string) {
  const student = await requireStudent();
  if (ownerId === student.id) return { ok: false, message: "내 방에는 쓸 수 없어요." };
  if (!/^[0-9a-f-]{36}$/.test(ownerId)) return { ok: false, message: "방을 찾지 못했어요." };
  const checked = checkGuestbook(String(message ?? ""));
  if (!checked.ok) return { ok: false, message: checked.reason };
  const supabase = createServerSupabaseClient();
  const { data: owner } = await supabase.from("students").select("is_active").eq("id", ownerId).maybeSingle();
  if (!owner?.is_active) return { ok: false, message: "방을 찾지 못했어요." };
  const { error } = await supabase
    .from("cat_guestbook")
    .insert({ owner_id: ownerId, writer_id: student.id, day: kstDate(new Date()), message: checked.text });
  if (error) {
    return { ok: false, message: error.code === "23505" ? "이 방에는 오늘 이미 남겼어요. 내일 또 와요 🐾" : "남기지 못했어요. 다시 해 주세요." };
  }
  revalidatePath(`/student/cat-house/${ownerId}`);
  return { ok: true, message: "방명록을 남겼어요 ✉️" };
}

/** 방명록 글 지우기 (방 주인 또는 쓴 사람만) */
export async function removeGuestbook(entryId: number) {
  const student = await requireStudent();
  if (!Number.isInteger(entryId)) return { ok: false };
  const supabase = createServerSupabaseClient();
  const { data: row } = await supabase.from("cat_guestbook").select("owner_id, writer_id").eq("id", entryId).maybeSingle();
  if (!row || (row.owner_id !== student.id && row.writer_id !== student.id)) return { ok: false };
  const { error } = await supabase.from("cat_guestbook").delete().eq("id", entryId);
  if (error) return { ok: false };
  revalidatePath(`/student/cat-house/${row.owner_id}`);
  revalidatePath("/student/cat-house");
  return { ok: true };
}
