import Link from "next/link";
import { requireStudent } from "@/lib/classroom/dal";
import { NicknameForm } from "./nickname-form";
import { cardClass } from "@/app/_ui/styles";
import { CatPicker } from "@/app/_ui/cat-picker";

export default async function StudentProfilePage() {
  const student = await requireStudent();

  return (
    <>
      <Link href="/student" className="text-sm text-zinc-600 underline">
        ← 홈
      </Link>
      <h1 className="text-xl font-extrabold text-zinc-900">내 닉네임</h1>
      <section className={cardClass}>
        <p className="mb-3 text-sm text-zinc-600">
          주간 랭킹에는 실명 대신 닉네임이 보여요. 선생님은 실명과 닉네임을 함께 볼 수 있어요.
        </p>
        <NicknameForm current={student.nickname} />
      </section>
      <h2 id="cat" className="scroll-mt-6 text-xl font-extrabold text-zinc-900">🐾 내 고양이</h2>
      <section className={cardClass}>
        <p className="mb-3 text-sm text-zinc-600">
          홈에서 매일 응원해주는 고양이예요. 누르면 바로 바뀌어요.
        </p>
        <CatPicker current={student.catBreed} />
      </section>
    </>
  );
}
