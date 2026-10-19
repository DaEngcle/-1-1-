import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { cardClass } from "@/app/_ui/styles";
import { bookIcon, coverUrl } from "@/lib/classroom/resources";

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  return bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)}MB`
    : `${Math.ceil(bytes / 1024)}KB`;
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const student = await requireStudent();
  const { welcome } = await searchParams;
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("resources")
    .select("id, title, description, size_bytes, cover_path")
    .eq("is_published", true)
    .order("sort_order")
    .order("created_at");
  const free = student.courses.length === 0;

  return (
    <>
      {welcome && (
        <section className="flex flex-col gap-1 rounded-2xl bg-[#ffd23f] p-4 text-zinc-900">
          <p className="text-lg font-extrabold">
            🎉 {student.nickname ?? student.name}님, 환영해요!
          </p>
          <p className="text-sm">
            아래에서 자료를 받고, 강의 맛보기와 레벨테스트도 무료로 해보세요.
          </p>
        </section>
      )}
      <h1 className="text-xl font-bold text-zinc-900">🎁 자료실</h1>
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(data ?? []).length === 0 && (
          <p className="col-span-full text-sm text-zinc-500">
            곧 자료가 올라와요!
          </p>
        )}
        {(data ?? []).map((r, i) => {
          const cover = coverUrl(r.cover_path);
          return (
            <a
              key={r.id}
              href={`/api/resources/${r.id}`}
              className={`${cardClass} group flex flex-col gap-2 !p-3 hover:border-brand-300`}
            >
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element -- Supabase 공개 표지
                <img
                  src={cover}
                  alt={`${r.title} 표지`}
                  className="aspect-[3/4] w-full rounded-lg object-cover object-top shadow-md transition-transform group-hover:-translate-y-0.5"
                />
              ) : (
                <span className="flex aspect-[3/4] w-full items-center justify-center rounded-lg bg-slate-100 text-6xl">
                  {bookIcon(i)}
                </span>
              )}
              <p className="text-sm font-bold leading-snug text-zinc-900">
                {r.title}
              </p>
              {r.description && (
                <p className="text-xs text-zinc-600">{r.description}</p>
              )}
              <span className="mt-auto rounded-xl border-b-4 border-brand-800 bg-brand-600 px-3 py-1.5 text-center text-sm font-bold text-white">
                ⬇ 무료로 받기{" "}
                <span className="font-normal opacity-80">
                  {formatSize(r.size_bytes)}
                </span>
              </span>
            </a>
          );
        })}
      </section>

      {free && (
        <section className={`${cardClass} flex flex-col gap-3`}>
          <h2 className="font-bold text-zinc-900">
            자료 받았다면, 이것도 무료로 해보세요 👇
          </h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              [
                "/student/lessons?course=bootcamp",
                "🎬 강의 맛보기",
                "과정별 Day 1~3 영상 + 쉐도잉",
              ],
              [
                "/student/level-test",
                "📊 무료 레벨테스트",
                "내 영어 실력 10분 진단",
              ],
              [
                "/student/pronunciation",
                "🗣 발음 가이드",
                "호주에서 통하는 발음 팁",
              ],
            ].map(([href, title, sub]) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col gap-0.5 rounded-2xl bg-brand-50 p-3 hover:bg-brand-100"
              >
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
