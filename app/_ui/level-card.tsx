import Link from "next/link";
import { levelInfo } from "@/lib/classroom/levels";
import type { LevelTestRow } from "@/lib/classroom/level-test-data";
import { cardClass } from "@/app/_ui/styles";

function LevelBlock({ label, test, highlight }: { label: string; test: LevelTestRow; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className={`font-bold ${highlight ? "text-3xl text-violet-700" : "text-2xl text-zinc-500"}`}>
        Lv.{test.level}
      </span>
      <span className={`text-xs ${highlight ? "text-violet-700" : "text-zinc-500"}`}>
        {levelInfo(test.level ?? 1).name} · {test.total_score}점
      </span>
    </div>
  );
}

/** 레벨 카드: 수강 전 → 수강 후 비교. href가 있으면 테스트 보러 가는 링크를 보여준다 */
export function LevelCard({
  pre,
  post,
  href,
}: {
  pre: LevelTestRow | null;
  post: LevelTestRow | null;
  href?: string;
}) {
  const preDone = pre?.finished_at ? pre : null;
  const postDone = post?.finished_at ? post : null;

  if (!preDone) {
    return (
      <section className={`${cardClass} flex items-center justify-between gap-3`}>
        <div>
          <p className="text-xs text-zinc-500">내 레벨</p>
          <p className="font-semibold text-zinc-900">아직 레벨테스트를 보지 않았어요</p>
          <p className="text-xs text-zinc-500">말하기 10문장 + 듣기 10문제 · 약 10분</p>
        </div>
        {href && (
          <Link href={href} className="shrink-0 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white">
            테스트 보기
          </Link>
        )}
      </section>
    );
  }

  const growth = postDone ? (postDone.total_score ?? 0) - (preDone.total_score ?? 0) : null;
  return (
    <section className={cardClass}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">내 레벨</span>
        {href && (
          <Link href={href} className="text-xs text-violet-700 underline">
            자세히
          </Link>
        )}
      </div>
      <div className="mt-2 flex items-center gap-4">
        <LevelBlock label={postDone ? "수강 전" : "현재"} test={preDone} highlight={!postDone} />
        {postDone && (
          <>
            <span className="text-xl text-zinc-400">→</span>
            <LevelBlock label="수강 후" test={postDone} highlight />
          </>
        )}
        <div className="ml-auto flex flex-col items-end gap-1 text-right text-xs">
          {growth != null ? (
            <>
              <span
                className={`rounded px-2 py-0.5 font-semibold ${
                  growth >= 0 ? "bg-green-100 text-green-800" : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {growth >= 0 ? `+${growth}점 성장` : `${growth}점`}
              </span>
              <span className="text-zinc-600">
                말하기 {signed((postDone!.speaking_score ?? 0) - (preDone.speaking_score ?? 0))} · 듣기{" "}
                {signed((postDone!.listening_score ?? 0) - (preDone.listening_score ?? 0))}
              </span>
            </>
          ) : (
            <span className="text-zinc-600">
              말하기 {preDone.speaking_score} · 듣기 {preDone.listening_score}
              <br />
              수료 때 한 번 더 보고 성장을 확인해요
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

function signed(n: number) {
  return n >= 0 ? `+${n}` : `${n}`;
}
