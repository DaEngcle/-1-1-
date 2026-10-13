import Link from "next/link";
import { notFound } from "next/navigation";
import { getTip } from "@/lib/classroom/pronunciation-tips";
import { MouthDiagram } from "@/app/_ui/mouth-diagram";
import { VideoEmbed } from "@/app/_ui/video-embed";
import { MinimalPairs, WordChips } from "@/app/_ui/practice/listen-buttons";
import { cardClass } from "@/app/_ui/styles";

export default async function PronunciationTipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tip = getTip(id);
  if (!tip) notFound();

  return (
    <>
      <div className="flex flex-col gap-1">
        <Link href="/student/pronunciation" className="text-xs text-zinc-500">
          ← 발음 가이드
        </Link>
        <h1 className="text-xl font-bold text-zinc-900">
          {tip.title} <span className="text-sm font-normal text-zinc-400">{tip.ipa}</span>
        </h1>
        <p className="text-sm text-zinc-700">{tip.summary}</p>
      </div>

      <section className={`${cardClass} flex flex-col items-center gap-2`}>
        <MouthDiagram variant={tip.diagram} />
        <p className="text-xs text-red-600">흔한 실수: {tip.commonMistake}</p>
      </section>

      {tip.videoUrl && (
        <section className="flex flex-col gap-2">
          <h2 className="font-bold text-zinc-900">🎬 다니엘 쌤 설명 영상</h2>
          <VideoEmbed url={tip.videoUrl} title={tip.title} />
        </section>
      )}

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">이렇게 소리 내요</h2>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed text-zinc-800">
          {tip.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-bold text-zinc-900">🎧 비교해서 들어보기</h2>
        <p className="text-xs text-zinc-500">파란색이 이번에 연습할 소리, 회색이 헷갈리기 쉬운 소리예요.</p>
        <MinimalPairs pairs={tip.minimalPairs} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-bold text-zinc-900">부트캠프 표현으로 연습</h2>
        <WordChips words={tip.practiceWords} />
      </section>
    </>
  );
}
