import Link from "next/link";
import { requireStudent } from "@/lib/classroom/dal";
import { NicknameForm } from "./nickname-form";
import { PasswordForm } from "./password-form";
import { cardClass } from "@/app/_ui/styles";


export default async function StudentProfilePage() {
  const student = await requireStudent();

  return (
    <>
      <Link href="/student/more" className="text-sm text-zinc-600 underline">
        ← 더보기
      </Link>
      <h1 className="text-xl font-extrabold text-zinc-900">👤 내 정보</h1>
      <h2 className="text-lg font-extrabold text-zinc-900">내 닉네임</h2>
      <section className={cardClass}>
        <p className="mb-3 text-sm text-zinc-600">
          주간 랭킹에는 실명 대신 닉네임이 보여요. 선생님은 실명과 닉네임을 함께 볼 수 있어요.
        </p>
        <NicknameForm current={student.nickname} />
      </section>
      <h2 id="password" className="scroll-mt-6 text-lg font-extrabold text-zinc-900">🔒 비밀번호 바꾸기</h2>
      <section className={cardClass}>
        <PasswordForm />
      </section>
    </>
  );
}
