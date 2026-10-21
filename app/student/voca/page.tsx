import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { VERB_SETS } from "@/lib/classroom/verbs";
import { CatSprite } from "@/app/_ui/cat";

export default async function VocaHomePage() {
  const student = await requireStudent();
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("voca_progress")
    .select("deck, stars")
    .eq("student_id", student.id)
    .like("deck", "verbs-%");
  const stars = (data ?? []).reduce((n, r) => n + (r.stars ?? 0), 0);
  const cleared = (data ?? []).filter((r) => (r.stars ?? 0) > 0).length;
  const maxStars = VERB_SETS.length * 3;

  return (
    <>
      <section className="flex items-center gap-3 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-500 p-5 text-white shadow-lg">
        {student.catBreed && <CatSprite breed={student.catBreed} mood="happy" className="h-16 w-20 shrink-0" />}
        <div>
          <h1 className="text-2xl font-extrabold">🎮 보카</h1>
          <p className="text-sm text-white/85">게임처럼 매일 5분, 단어를 입에 붙여요.</p>
        </div>
      </section>

      <Link
        href="/student/voca/verbs"
        className="flex flex-col gap-2 rounded-3xl border-2 border-violet-200 bg-white p-4 shadow-sm transition-transform active:translate-y-0.5"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-extrabold text-zinc-900">🔤 동사 3단변화</span>
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">
            ⭐ {stars}/{maxStars}
          </span>
        </div>
        <p className="text-sm text-zinc-600">
          왕초보 필수! <b>make – made – made</b>처럼 불규칙 동사 90개를 많이 쓰는 순서대로 10개씩.
        </p>
        <span className="h-2 w-full overflow-hidden rounded-full bg-violet-100">
          <span className="block h-full bg-violet-500" style={{ width: `${(cleared / VERB_SETS.length) * 100}%` }} />
        </span>
        <span className="text-xs text-zinc-500">
          {cleared}/{VERB_SETS.length} 세트 클리어
        </span>
      </Link>

      <Link
        href="/student/voca/course"
        className="flex flex-col gap-1 rounded-3xl border-2 border-sky-200 bg-white p-4 shadow-sm transition-transform active:translate-y-0.5"
      >
        <span className="text-lg font-extrabold text-zinc-900">📚 과정별 단어</span>
        <p className="text-sm text-zinc-600">
          부트캠프·Level 1.0·2.0 수업에서 쉐도잉한 문장으로 주차별 복습. 빈칸 채우기 + 듣고 뜻 고르기.
        </p>
      </Link>

      <Link
        href="/student/voca/slang"
        className="flex flex-col gap-1 rounded-3xl border-2 border-teal-200 bg-white p-4 shadow-sm transition-transform active:translate-y-0.5"
      >
        <span className="text-lg font-extrabold text-zinc-900">🦘 호주 슬랭</span>
        <p className="text-sm text-zinc-600">arvo, servo, no worries, Yeah nah… 호주에서 매일 듣는 말 60개.</p>
      </Link>
    </>
  );
}
