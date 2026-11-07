import Link from "next/link";
import { requireStudent } from "@/lib/classroom/dal";
import { getChuru, listRooms } from "@/lib/classroom/cat-house-data";
import { maskName } from "@/lib/classroom/engagement";
import { VillageGame } from "./village-game";

export default async function VillagePage() {
  const student = await requireStudent();
  const [churu, rooms] = await Promise.all([getChuru(student.id), listRooms(student.id)]);
  // 방을 꾸민 다른 학생의 고양이가 이웃으로 돌아다닌다 (이름은 닉네임 또는 가린 이름)
  const friends = rooms.flatMap((r) => (r.breed ? [{ breed: r.breed as string, name: r.name }] : [])).slice(0, 8);

  return (
    <>
      <h1 className="sr-only">멜번 고양이 마을</h1>
      {!student.catBreed && (
        <p className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">
          아직 내 고양이를 안 골랐어요. 지금은 치즈냥이가 대신 걸어요.{" "}
          <Link href="/student/cat-house#cat" className="font-bold underline">
            고르러 가기
          </Link>
        </p>
      )}
      <VillageGame
        breed={student.catBreed}
        churu={churu.balance}
        friends={friends}
        myName={student.nickname ?? maskName(student.name)}
      />
    </>
  );
}
