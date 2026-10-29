import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { coverUrl } from "@/lib/classroom/resources";
import { discountRate, manwon } from "@/lib/classroom/price";
import { SubmitButton } from "@/app/_ui/submit-button";
import { requestPurchase } from "../actions";

/** 유료 전자책 상세: 미리보기 + 구매 신청 */
export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await requireStudent();
  const supabase = createServerSupabaseClient();
  const { data: r } = await supabase
    .from("resources")
    .select(
      "id, title, description, cover_path, price, list_price, preview_dir, preview_count, size_bytes, required_course",
    )
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();
  // 수강생 한정 자료는 그 과정 학생에게만
  if (!r) notFound();
  const [{ data: access }, { data: request }] = await Promise.all([
    supabase
      .from("resource_access")
      .select("granted_at")
      .eq("resource_id", id)
      .eq("student_id", student.id)
      .maybeSingle(),
    supabase
      .from("resource_requests")
      .select("created_at")
      .eq("resource_id", id)
      .eq("student_id", student.id)
      .maybeSingle(),
  ]);
  // 수강생 한정 자료는 그 과정 학생이나, 선생님이 따로 열어준 학생에게만
  if (r.required_course && !student.courses.includes(r.required_course as never) && !access) notFound();
  const owned = !r.price || Boolean(access);
  const cover = coverUrl(r.cover_path);
  const rate = discountRate(r.list_price, r.price);
  const pages = Array.from(
    { length: r.preview_count ?? 0 },
    (_, i) => `${r.preview_dir}/p${String(i + 1).padStart(2, "0")}.jpg`,
  );

  const action = owned ? (
    <a
      href={`/api/resources/${r.id}`}
      className="rounded-xl border-b-4 border-brand-800 bg-brand-600 px-5 py-3 text-center font-bold text-white"
    >
      ⬇ 전자책 받기
    </a>
  ) : request ? (
    <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
      ✅ 구매 신청 완료! 선생님이 카톡으로 결제 안내를 보내드려요. 결제가
      확인되면 여기서 바로 받을 수 있어요.
    </p>
  ) : (
    <form action={requestPurchase}>
      <input type="hidden" name="id" value={r.id} />
      <SubmitButton className="w-full rounded-xl border-b-4 border-amber-500 bg-[#ffd23f] px-5 py-3 font-extrabold text-zinc-900">
        🛒 {manwon(r.price!)}에 구매 신청하기
      </SubmitButton>
    </form>
  );

  return (
    <>
      <Link href="/student/resources" className="text-xs text-zinc-500">
        ← 자료실
      </Link>
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element -- 공개 표지
          <img
            src={cover}
            alt={`${r.title} 표지`}
            className="w-40 shrink-0 self-center rounded-lg shadow-md sm:self-start"
          />
        )}
        <div className="flex flex-1 flex-col gap-2">
          <h1 className="text-xl font-bold text-zinc-900">📕 {r.title}</h1>
          {r.description && (
            <p className="text-sm text-zinc-600">{r.description}</p>
          )}
          {r.price && !owned ? (
            <p className="flex items-baseline gap-2">
              {rate > 0 && (
                <span className="text-lg font-extrabold text-red-500">
                  {rate}%
                </span>
              )}
              <span className="text-2xl font-extrabold text-zinc-900">
                {manwon(r.price)}
              </span>
              {r.list_price && r.list_price > r.price && (
                <span className="text-sm text-zinc-400 line-through">
                  {manwon(r.list_price)}
                </span>
              )}
            </p>
          ) : (
            <p className="text-sm font-semibold text-green-700">
              ✅ 내 자료실에 있어요
            </p>
          )}
          {action}
        </div>
      </section>

      {pages.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-bold text-zinc-900">
            👀 미리보기 (앞부분 {pages.length}쪽)
          </h2>
          {pages.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- 미리보기 페이지
            <img
              key={src}
              src={src}
              alt={`미리보기 ${i + 1}쪽`}
              loading={i < 2 ? "eager" : "lazy"}
              className="w-full rounded-xl border border-slate-200 bg-white shadow-sm"
            />
          ))}
          {!owned && (
            <div className="flex flex-col gap-2 rounded-2xl bg-[#fff8db] p-4 text-center">
              <p className="font-bold text-zinc-900">
                뒷부분이 궁금하다면? 전체를 받아보세요
              </p>
              {action}
            </div>
          )}
        </section>
      )}
    </>
  );
}
