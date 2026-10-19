import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { cardClass } from "@/app/_ui/styles";

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)}MB` : `${Math.ceil(bytes / 1024)}KB`;
}

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const student = await requireStudent();
  const { welcome } = await searchParams;
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("resources")
    .select("id, title, description, size_bytes")
    .eq("is_published", true)
    .order("sort_order")
    .order("created_at");
  const free = student.courses.length === 0;

  return (
    <>
      {welcome && (
        <section className="flex flex-col gap-1 rounded-2xl bg-[#ffd23f] p-4 text-zinc-900">
          <p className="text-lg font-extrabold">🎉 {student.nickname ?? student.name}님, 환영해요!</p>
          <p className="text-sm">아래에서 자료를 받고, 강의 맛보기와 레벨테스트도 무료로 해보세요.</p>
        </section>
      )}
      <h1 className="text-xl font-bold text-zinc-900">🎁 자료실</h1>
      <section className="flex flex-col gap-2">
        {(data ?? []).length === 0 && <p className="text-sm text-zinc-500">곧 자료가 올라와요!</p>}
        {(data ?? []).map((r) => (
          <article key={r.id} className={`${cardClass} flex items-center justify-between gap-3`}>
            <div className="flex flex-col gap-0.5">
              <p className="font-bold text-zinc-900">📕 {r.title}</p>
              {r.description && <p className="text-sm text-zinc-600">{r.description}</p>}
              <p className="text-xs text-zinc-400">PDF {formatSize(r.size_bytes)}</p>
            </div>
            <a
              href={`/api/resources/${r.id}`}
              className="shrink-0 rounded-xl border-b-4 border-brand-800 bg-brand-600 px-4 py-2 text-sm font-bold text-white"
            >
              ⬇ 받기
            </a>
          </article>
        ))}
      </section>

      {free && (
        <section className={`${cardClass} flex flex-col gap-3`}>
          <h2 className="font-bold text-zinc-900">자료 받았다면, 이것도 무료로 해보세요 👇</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ["/student/lessons?course=bootcamp", "🎬 강의 맛보기", "과정별 Day 1~3 영상 + 쉐도잉"],
              ["/student/level-test", "📊 무료 레벨테스트", "내 영어 실력 10분 진단"],
              ["/student/pronunciation", "🗣 발음 가이드", "호주에서 통하는 발음 팁"],
            ].map(([href, title, sub]) => (
              <Link key={href} href={href} className="flex flex-col gap-0.5 rounded-2xl bg-brand-50 p-3 hover:bg-brand-100">
                <span className="font-bold text-zinc-900">{title}</span>
                <span className="text-xs text-zinc-500">{sub}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
