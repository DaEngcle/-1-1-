import Link from "next/link";
import { requireStudent } from "@/lib/classroom/dal";
import { LEVELS } from "@/lib/classroom/levels";
import { getTests, isPostTestOpen } from "@/lib/classroom/level-test-data";
import { LevelCard } from "@/app/_ui/level-card";
import { cardClass } from "@/app/_ui/styles";

export default async function StudentLevelTestPage() {
  const student = await requireStudent();
  const [{ pre, post }, postOpen] = await Promise.all([getTests(student.id), isPostTestOpen()]);

  const next =
    !pre?.finished_at
      ? { kind: "pre", label: pre ? "수강 전 테스트 이어서 보기" : "수강 전 테스트 시작" }
      : !post?.finished_at && postOpen
        ? { kind: "post", label: post ? "수강 후 테스트 이어서 보기" : "수강 후 테스트 시작" }
        : null;

  return (
    <>
      <h1 className="text-xl font-bold text-zinc-900">📈 레벨테스트</h1>
      <p className="text-sm text-zinc-600">
        수업 시작 전에 한 번, 수료할 때 한 번 같은 테스트를 봐요. 두 결과를 비교해서 얼마나 늘었는지 보여드려요.
      </p>

      <LevelCard pre={pre} post={post} />

      {next ? (
        <Link
          href={`/student/level-test/${next.kind}`}
          className="rounded-lg bg-violet-600 px-4 py-3 text-center font-semibold text-white"
        >
          {next.label} →
        </Link>
      ) : (
        pre?.finished_at &&
        !post?.finished_at && (
          <p className="text-sm text-zinc-500">수강 후 테스트는 수료할 때 선생님이 열어줘요.</p>
        )
      )}

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">레벨 안내</h2>
        <ul className="flex flex-col gap-1.5 text-sm">
          {LEVELS.map((l) => (
            <li key={l.level} className="flex gap-2">
              <span className="w-12 shrink-0 font-semibold text-violet-700">Lv.{l.level}</span>
              <span className="w-32 shrink-0 font-medium text-zinc-900">{l.name}</span>
              <span className="text-zinc-600">{l.desc}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-zinc-500">점수 = 말하기(발음·유창성·억양) 60% + 듣기 40%</p>
      </section>
    </>
  );
}
