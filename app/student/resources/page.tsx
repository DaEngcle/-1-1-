import Link from "next/link";
import { ReviewMarquee } from "@/app/_ui/reviews";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { cardClass } from "@/app/_ui/styles";
import { bookIcon, coverUrl } from "@/lib/classroom/resources";
import { discountRate, manwon } from "@/lib/classroom/price";

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
    .select(
      "id, title, description, size_bytes, cover_path, link_url, price, list_price, required_course",
    )
    .eq("is_published", true)
    .order("sort_order")
    .order("created_at");
  const { data: accessRows } = await supabase
    .from("resource_access")
    .select("resource_id")
    .eq("student_id", student.id);
  const owned = new Set((accessRows ?? []).map((a) => a.resource_id as string));
  const free = student.courses.length === 0;
  // 수강생 한정 자료는 그 과정을 듣는 학생에게만 보인다
  const list = (data ?? []).filter(
    (r) => !r.required_course || student.courses.includes(r.required_course as never) || owned.has(r.id),
  );

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
        {list.length === 0 && (
          <p className="col-span-full text-sm text-zinc-500">
            곧 자료가 올라와요!
          </p>
        )}
        {list.map((r, i) => {
          const cover = coverUrl(r.cover_path);
          // 유료 자료(아직 안 산 것)는 미리보기·구매 페이지로
          const forSale = Boolean(r.price) && !owned.has(r.id);
          const rate = discountRate(r.list_price, r.price);
          return (
            <a
              key={r.id}
              href={
                forSale
                  ? `/student/resources/${r.id}`
                  : `/api/resources/${r.id}`
              }
              {...(r.link_url
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
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
                <span className="flex aspect-[3/4] w-full items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 text-xs text-brand-700">
                  표지 준비 중
                </span>
              )}
              <p className="text-sm font-bold leading-snug text-zinc-900">
                {r.link_url ? "✅" : bookIcon(i)} {r.title}
              </p>
              {r.description && (
                <p className="text-xs text-zinc-600">{r.description}</p>
              )}
              <span className="mt-auto rounded-xl border-b-4 border-brand-800 bg-brand-600 px-3 py-1.5 text-center text-sm font-bold text-white">
                {forSale ? (
                  <>
                    👀 미리보기 ·{" "}
                    {rate > 0 && (
                      <span className="text-[#ffd23f]">{rate}% </span>
                    )}
                    {manwon(r.price!)}
                  </>
                ) : r.link_url ? (
                  "✅ 체크리스트 열기"
                ) : (
                  <>
                    {r.price ? "⬇ 받기" : "⬇ 무료로 받기"}{" "}
                    <span className="font-normal opacity-80">
                      {formatSize(r.size_bytes)}
                    </span>
                  </>
                )}
              </span>
            </a>
          );
        })}
      </section>

      {free && (
        <section className="flex flex-col gap-3 overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50 py-4 text-zinc-900 shadow-sm">
          <div className="flex items-end justify-between gap-2 px-4">
            <div>
              <p className="text-xs text-zinc-500">
                먼저 들은 분들의 진짜 후기
              </p>
              <p className="text-2xl font-extrabold text-brand-700">
                ⭐ 진짜 수강생 후기
              </p>
            </div>
            <Link
              href="/student#all-reviews"
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-zinc-700 hover:bg-slate-100"
            >
              전체 보기 →
            </Link>
          </div>
          <ReviewMarquee />
        </section>
      )}

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
