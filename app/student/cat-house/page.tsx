import Link from "next/link";
import { requireStudent } from "@/lib/classroom/dal";
import { CatRoom } from "@/app/_ui/cat-room";
import { ITEM_BY_ID, GUESTS, POSTCARDS, POSTCARD_MIN, affinity, catMoodFor, guestFor, roomScore, DAILY_CHURU_CAP } from "@/lib/classroom/cat-house";
import type { CatBreed } from "@/lib/classroom/cat";
import { BoxButton } from "./box-button";
import { getChuru, getRoom, listRooms } from "@/lib/classroom/cat-house-data";
import { HouseEditor } from "./house-editor";

export default async function CatHousePage() {
  const student = await requireStudent();
  const [churu, room, rooms] = await Promise.all([getChuru(student.id), getRoom(student.id), listRooms(student.id)]);
  const mood = catMoodFor(churu.daysSince);
  const catName = student.catName ?? "고양이";
  const aff = affinity(churu.studyEarned);
  const guest = guestFor(room.layout);
  const score = roomScore(room.layout);

  return (
    <>
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900">🏠 {catName}의 집</h1>
        <p className="text-sm text-zinc-500">
          공부하면 츄르 🐟가 모여요 (오늘 {churu.todayEarned}/{DAILY_CHURU_CAP}). 츄르로 가구를 사서 방을 꾸며 주세요.
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-bold text-violet-700">기분 · {mood.label}</span>
          <span className="rounded-full bg-pink-50 px-2 py-0.5 text-xs font-bold text-pink-700">💛 친밀도 Lv.{aff.level}</span>
          {score.trophy && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800">{score.trophy} 하우스</span>}
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-600">방 점수 {score.score}</span>
          {score.sets.map((x) => (
            <span key={x} className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
              {x} 완성 +50
            </span>
          ))}
        </div>
        <p className="text-sm text-zinc-700">
          <b>{catName}</b>: {churu.daysSince === 0 ? aff.line : mood.line}
        </p>
        {aff.next !== null && (
          <p className="text-[11px] text-zinc-400">다음 친밀도까지 공부 츄르 {aff.next}개 · 친밀도는 줄어들지 않아요</p>
        )}
        {guest && (
          <p className="text-sm text-zinc-700">
            🐾 손님 <b>{guest.name}</b>: {guest.line}
          </p>
        )}
      </div>

      {churu.todayPostcard ? (
        <div className="rounded-2xl bg-sky-50 p-3 text-sm text-sky-900 shadow-sm">
          ✉️ 오늘 {catName}가 <b>{churu.todayPostcard.emoji} {churu.todayPostcard.place}</b>({churu.todayPostcard.city})에 다녀왔어요!
          <br />“{churu.todayPostcard.note}”
        </div>
      ) : (
        <div className="rounded-2xl bg-sky-50 p-3 text-sm text-sky-800 shadow-sm">
          ✈️ 오늘 츄르 {POSTCARD_MIN}개를 모으면 {catName}가 호주 여행을 다녀와서 엽서를 가져와요 ({churu.todayEarned}/{POSTCARD_MIN})
        </div>
      )}

      <BoxButton opened={churu.boxOpened} weekDays={churu.weekDays} />

      {!student.catBreed ? (
        <p className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">
          먼저{" "}
          <Link href="/student/profile#cat" className="font-bold underline">
            내 고양이
          </Link>
          를 골라 주세요!
        </p>
      ) : null}

      <HouseEditor
        initial={room.layout}
        owned={[...churu.owned]}
        balance={churu.balance}
        breed={student.catBreed}
        mood={mood.mood}
        guest={(guest?.breed as CatBreed | undefined) ?? null}
      />

      <section className="flex flex-col gap-2 rounded-2xl bg-white p-3 shadow-sm">
        <h2 className="font-extrabold text-zinc-900">
          ✉️ 엽서 도감 <span className="text-sm font-semibold text-zinc-500">{churu.postcards.size}/{POSTCARDS.length}</span>
        </h2>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {POSTCARDS.map((p) => {
            const got = churu.postcards.get(p.id);
            return (
              <li
                key={p.id}
                className={`flex flex-col items-center gap-0.5 rounded-xl p-2 text-center ${got ? "bg-sky-50" : "bg-zinc-50 opacity-60"}`}
              >
                <span className="text-2xl">{got ? p.emoji : "❔"}</span>
                <span className="text-xs font-bold text-zinc-800">{got ? p.place : "???"}</span>
                <span className="text-[10px] text-zinc-500">{got ? got.slice(5).replace("-", "/") : p.city}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-2 rounded-2xl bg-white p-3 shadow-sm">
        <h2 className="font-extrabold text-zinc-900">🐱 손님 고양이 도감</h2>
        <p className="text-xs text-zinc-500">특정 아이템을 방에 놓으면 손님이 놀러 와요.</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {GUESTS.map((g) => {
            const can = g.needs.some((n) => churu.owned.has(n));
            return (
              <li key={g.id} className={`rounded-xl p-2 text-sm ${can ? "bg-violet-50" : "bg-zinc-50"}`}>
                <b className="text-zinc-900">{can ? g.name : "???"}</b>
                <p className="text-[11px] text-zinc-500">힌트: {needHint(g.needs)}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <details className="rounded-2xl bg-white p-3 text-sm text-zinc-600 shadow-sm">
        <summary className="cursor-pointer font-bold text-zinc-800">🐟 츄르는 어떻게 모아요?</summary>
        <ul className="mt-2 list-disc pl-5">
          <li>쉐도잉 1문장 제출 +5</li>
          <li>강의 영상 1분 +1 (하루 20까지)</li>
          <li>보카·기초 문법 게임, AI 면접 → 받은 리그 포인트의 절반</li>
          <li>친구 방에 꾹꾹이 +1 · 내 방이 꾹꾹이 받으면 +3</li>
          <li>하루 최대 {DAILY_CHURU_CAP}개까지 모여요. 매일 조금씩이 제일 좋아요!</li>
          <li>며칠 쉬어도 고양이는 아프지 않아요. 창가에서 낮잠 자며 기다려요 💤</li>
        </ul>
      </details>

      <section className="flex flex-col gap-2">
        <h2 className="font-extrabold text-zinc-900">🐾 친구 방 구경하기</h2>
        {rooms.length === 0 ? (
          <p className="text-sm text-zinc-500">아직 꾸민 방이 없어요. 첫 번째로 꾸며 볼까요?</p>
        ) : (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {rooms.map((r) => (
              <li key={r.id}>
                <Link href={`/student/cat-house/${r.id}`} className="flex flex-col gap-1 rounded-2xl bg-white p-2 shadow-sm">
                  <CatRoom layout={r.layout} breed={r.breed} className="rounded-xl" />
                  <span className="truncate text-sm font-bold text-zinc-900">{r.catName ?? "고양이"} · {r.name}</span>
                  <span className="text-xs text-zinc-500">🐾 꾹꾹이 {r.likes}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}


function needHint(ids: readonly string[]) {
  return ids.map((id) => ITEM_BY_ID.get(id)?.name ?? id).join(" 또는 ");
}
