import Link from "next/link";
import { requireStudent } from "@/lib/classroom/dal";
import { CatRoom } from "@/app/_ui/cat-room";
import { catMoodFor, DAILY_CHURU_CAP } from "@/lib/classroom/cat-house";
import { getChuru, getRoom, listRooms } from "@/lib/classroom/cat-house-data";
import { HouseEditor } from "./house-editor";

export default async function CatHousePage() {
  const student = await requireStudent();
  const [churu, room, rooms] = await Promise.all([getChuru(student.id), getRoom(student.id), listRooms(student.id)]);
  const mood = catMoodFor(churu.daysSince);
  const catName = student.catName ?? "고양이";

  return (
    <>
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900">🏠 {catName}의 집</h1>
        <p className="text-sm text-zinc-500">
          공부하면 츄르 🐟가 모여요 (오늘 {churu.todayEarned}/{DAILY_CHURU_CAP}). 츄르로 가구를 사서 방을 꾸며 주세요.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-2xl bg-white p-3 shadow-sm">
        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-bold text-violet-700">기분 · {mood.label}</span>
        <p className="text-sm text-zinc-700">
          <b>{catName}</b>: {mood.line}
        </p>
      </div>

      {!student.catBreed ? (
        <p className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">
          먼저{" "}
          <Link href="/student/profile#cat" className="font-bold underline">
            내 고양이
          </Link>
          를 골라 주세요!
        </p>
      ) : null}

      <HouseEditor initial={room.layout} owned={[...churu.owned]} balance={churu.balance} breed={student.catBreed} mood={mood.mood} />

      <details className="rounded-2xl bg-white p-3 text-sm text-zinc-600 shadow-sm">
        <summary className="cursor-pointer font-bold text-zinc-800">🐟 츄르는 어떻게 모아요?</summary>
        <ul className="mt-2 list-disc pl-5">
          <li>쉐도잉 1문장 제출 +5</li>
          <li>강의 영상 1분 +1 (하루 20까지)</li>
          <li>보카·기초 문법 게임, AI 면접 → 받은 리그 포인트의 절반</li>
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
                  <RoomThumb id={r.id} breed={r.breed} />
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

async function RoomThumb({ id, breed }: { id: string; breed: Parameters<typeof CatRoom>[0]["breed"] }) {
  const { layout } = await getRoom(id);
  return <CatRoom layout={layout} breed={breed} className="rounded-xl" />;
}
