import Link from "next/link";
import { PRONUNCIATION_TIPS } from "@/lib/classroom/pronunciation-tips";

export default function PronunciationGuidePage() {
  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-zinc-900">👄 발음 가이드</h1>
        <p className="text-sm text-zinc-600">한국인이 특히 어려워하는 소리, 입모양부터 잡아봐요.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {PRONUNCIATION_TIPS.map((tip) => (
          <Link
            key={tip.id}
            href={`/student/pronunciation/${tip.id}`}
            className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-4 hover:border-yellow-400"
          >
            <span className="text-2xl font-bold text-zinc-900">
              {tip.label} <span className="text-sm font-normal text-zinc-400">{tip.ipa}</span>
            </span>
            <span className="text-sm font-medium text-zinc-800">{tip.title}</span>
            <span className="text-xs text-red-600">흔한 실수: {tip.commonMistake}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
