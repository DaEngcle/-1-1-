import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { cardClass } from "@/app/_ui/styles";

const LEVEL_COLOR: Record<string, string> = {
  쉬움: "bg-green-50 text-green-700",
  보통: "bg-amber-50 text-amber-700",
  어려움: "bg-red-50 text-red-700",
};

export default async function NewsListPage() {
  const student = await requireStudent();
  const supabase = createServerSupabaseClient();
  const [{ data: rows }, { data: reads }] = await Promise.all([
    supabase
      .from("news_lessons")
      .select("id, source_title, title_ko, topic, level, published_on, expressions, image_url")
      .eq("is_published", true)
      .order("published_on", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(60),
    supabase.from("news_reads").select("news_id, quiz_score").eq("student_id", student.id),
  ]);
  const done = new Map((reads ?? []).map((r) => [r.news_id as string, r.quiz_score as number | null]));

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-zinc-900">📰 뉴스로 공부하기</h1>
        <p className="text-sm text-zinc-500">
          진짜 호주 뉴스를 쉬운 영어로 읽고, 호주에서 바로 쓰는 표현 5개씩 챙겨가요.
        </p>
      </div>
      <section className="flex flex-col gap-2">
        {(rows ?? []).length === 0 && <p className="text-sm text-zinc-500">곧 뉴스가 올라와요!</p>}
        {(rows ?? []).map((n) => {
          const score = done.get(n.id);
          const phrases = ((n.expressions as { phrase: string }[]) ?? []).slice(0, 3).map((e) => e.phrase);
          return (
            <Link
              key={n.id}
              href={`/student/news/${n.id}`}
              className={`${cardClass} flex flex-col gap-1.5 overflow-hidden hover:border-brand-300`}
            >
              {n.image_url && (
                // eslint-disable-next-line @next/next/no-img-element -- ABC 대표 사진 (출처 표기)
                <img
                  src={n.image_url}
                  alt=""
                  loading="lazy"
                  className="-mx-4 -mt-4 mb-1 aspect-[16/9] w-[calc(100%+2rem)] max-w-none object-cover"
                />
              )}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-zinc-700">{n.topic}</span>
                <span className={`rounded-full px-2 py-0.5 font-semibold ${LEVEL_COLOR[n.level] ?? ""}`}>{n.level}</span>
                <span className="text-zinc-400">{n.published_on}</span>
                {done.has(n.id) && (
                  <span className="ml-auto rounded-full bg-brand-50 px-2 py-0.5 font-bold text-brand-700">
                    ✅ 완료{score != null ? ` · ${score}점` : ""}
                  </span>
                )}
              </div>
              <p className="font-bold leading-snug text-zinc-900">{n.title_ko}</p>
              <p className="text-sm text-zinc-500">{n.source_title}</p>
              {phrases.length > 0 && (
                <p className="text-xs text-brand-700">
                  핵심 표현: {phrases.join(" · ")} …
                </p>
              )}
            </Link>
          );
        })}
      </section>
    </>
  );
}
