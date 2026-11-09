import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { catStage } from "@/lib/classroom/cat-stage-data";
import { VERB_SETS } from "@/lib/classroom/verbs";
import { PHRASE_DECKS } from "@/lib/classroom/phrase-decks";
import { CatSprite } from "@/app/_ui/cat";

export default async function VocaHomePage() {
  const student = await requireStudent();
  const { stage } = await catStage(student.id);
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("voca_progress")
    .select("deck, stars")
    .eq("student_id", student.id)
    .like("deck", "verbs-%");
  const stars = (data ?? []).reduce((n, r) => n + (r.stars ?? 0), 0);
  const cleared = (data ?? []).filter((r) => (r.stars ?? 0) > 0).length;

  return (
    <>
      <section className="flex items-center gap-3 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-500 p-5 text-white shadow-lg">
        {student.catBreed && <CatSprite breed={student.catBreed} stage={stage} mood="happy" className="h-16 w-20 shrink-0" />}
        <div>
          <h1 className="text-2xl font-extrabold">🗣️ 문장·표현</h1>
          <p className="text-sm text-white/85">표현을 문장째로 외워서 일터에서 바로 써요.</p>
        </div>
      </section>

      <Link
        href="/student/practice"
        className="flex items-center justify-between gap-3 rounded-3xl bg-brand-600 p-4 text-white shadow-sm transition-transform active:translate-y-0.5"
      >
        <span className="flex flex-col">
          <span className="text-lg font-extrabold">🎭 상황 연습</span>
          <span className="text-sm text-brand-100">내 일터 표현 익히기 → 상황극 → AI 실전 대화</span>
        </span>
        <span className="text-xl">→</span>
      </Link>

      <Link
        href="/student/voca/verbs"
        className="flex flex-col gap-2 rounded-3xl border-2 border-violet-200 bg-white p-4 shadow-sm transition-transform active:translate-y-0.5"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-extrabold text-zinc-900">🔤 동사 3단변화</span>
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">
            {cleared}/{VERB_SETS.length} 세트
          </span>
        </div>
        <p className="text-sm text-zinc-600">
          왕초보 필수! <b>make – made – made</b>처럼 불규칙 동사 90개를 많이 쓰는 순서대로 10개씩.
        </p>
        <span className="h-2 w-full overflow-hidden rounded-full bg-violet-100">
          <span className="block h-full bg-violet-500" style={{ width: `${(cleared / VERB_SETS.length) * 100}%` }} />
        </span>
        <span className="text-xs text-zinc-500">
          {cleared}개 세트 클리어 · 모은 별 ⭐ {stars}개 (세트마다 최대 3개)
        </span>
      </Link>

      <Link
        href="/student/voca/course"
        className="flex flex-col gap-1 rounded-3xl border-2 border-sky-200 bg-white p-4 shadow-sm transition-transform active:translate-y-0.5"
      >
        <span className="text-lg font-extrabold text-zinc-900">📚 과정별 문장</span>
        <p className="text-sm text-zinc-600">
          부트캠프·Level 1.0·2.0 수업에서 쉐도잉한 문장을 주차별로 복습해요. 듣기 → 순서 맞추기 → 빈칸 → 말하기.
        </p>
      </Link>

{PHRASE_DECKS.map((d) => (
        <Link
          key={d.id}
          href={`/student/voca/p/${d.id}`}
          className="flex flex-col gap-1 rounded-3xl border-2 border-violet-100 bg-white p-4 shadow-sm transition-transform active:translate-y-0.5"
        >
          <span className="text-lg font-extrabold text-zinc-900">
            {d.emoji} {d.title}
          </span>
          <p className="text-sm text-zinc-600">{d.desc}</p>
        </Link>
      ))}
    </>
  );
}
