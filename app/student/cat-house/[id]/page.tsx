import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { maskName } from "@/lib/classroom/engagement";
import { CatRoom } from "@/app/_ui/cat-room";
import type { CatBreed } from "@/lib/classroom/cat";
import { getRoom, likedToday } from "@/lib/classroom/cat-house-data";
import { guestFor, roomScore } from "@/lib/classroom/cat-house";
import { LikeButton } from "./like-button";

export default async function VisitRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireStudent();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { data: owner } = await createServerSupabaseClient()
    .from("students")
    .select("name, nickname, cat_breed, cat_name, is_active")
    .eq("id", id)
    .maybeSingle();
  if (!owner || !owner.is_active) notFound();
  const [{ layout, likes }, liked] = await Promise.all([getRoom(id), likedToday(id, me.id)]);
  const name = (owner.nickname as string | null) ?? maskName(owner.name as string);

  return (
    <>
      <Link href="/student/cat-house" className="text-sm text-zinc-600 underline">
        ← 내 고양이 집
      </Link>
      <h1 className="text-2xl font-extrabold text-zinc-900">
        🏠 {(owner.cat_name as string | null) ?? "고양이"}의 집 <span className="text-base font-semibold text-zinc-500">· {name}</span>
      </h1>
      <CatRoom
        layout={layout}
        breed={owner.cat_breed as CatBreed | null}
        mood="happy"
        guest={(guestFor(layout)?.breed as CatBreed | undefined) ?? null}
        className="shadow-lg"
      />
      <p className="text-center text-sm text-zinc-600">
        방 점수 {roomScore(layout).score}
        {roomScore(layout).trophy ? ` · ${roomScore(layout).trophy} 하우스` : ""}
        {roomScore(layout).sets.length ? ` · ${roomScore(layout).sets.join(" · ")}` : ""}
      </p>
      <LikeButton ownerId={id} likes={likes} liked={liked || id === me.id} />
    </>
  );
}
