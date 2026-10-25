import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";
import { cardClass } from "@/app/_ui/styles";
import { SubmitButton } from "@/app/_ui/submit-button";
import { ConfirmButton } from "@/app/_ui/confirm-button";
import { deleteNews, setNewsPublished } from "./actions";
import { GenerateButton } from "./generate-button";

export default async function TeacherNewsPage() {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  const [{ data: rows }, { data: reads }] = await Promise.all([
    supabase
      .from("news_lessons")
      .select("id, title_ko, source_title, source_url, topic, level, published_on, is_published")
      .order("published_on", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("news_reads").select("news_id, quiz_score"),
  ]);
  const hasKey = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <>
      <h1 className="text-xl font-bold text-zinc-900">📰 뉴스로 배우는 영어</h1>
      <section className={`${cardClass} flex flex-col gap-2`}>
        <p className="text-sm text-zinc-700">
          매일 아침 6시(한국)에 ABC News 헤드라인 중 워홀러에게 쓸모 있는 가벼운 기사 2개를 골라, AI가 쉬운 요약·핵심
          표현·퀴즈를 만들어요. 기사 본문은 가져오지 않고 제목과 원문 링크만 써요.
        </p>
        {hasKey ? (
          <GenerateButton />
        ) : (
          <p className="rounded-lg bg-[#fff8db] p-2 text-sm text-zinc-800">
            ⚠️ 자동 생성은 Vercel에 <b>ANTHROPIC_API_KEY</b>를 넣어야 켜져요. 지금은 직접 올린 뉴스만 보여요.
          </p>
        )}
      </section>
      <section className="flex flex-col gap-2">
        {(rows ?? []).map((n) => {
          const r = (reads ?? []).filter((x) => x.news_id === n.id);
          const avg = r.length ? Math.round(r.reduce((a, b) => a + (b.quiz_score ?? 0), 0) / r.length) : null;
          return (
            <article key={n.id} className={`${cardClass} flex flex-col gap-1 ${n.is_published ? "" : "opacity-60"}`}>
              <p className="text-xs text-zinc-500">
                {n.topic} · {n.level} · {n.published_on} · 👀 {r.length}명 완료{avg != null ? ` · 퀴즈 평균 ${avg}점` : ""}
              </p>
              <Link href={`/student/news/${n.id}`} className="font-bold text-zinc-900 hover:underline">
                {n.title_ko}
              </Link>
              <a href={n.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 underline">
                {n.source_title}
              </a>
              <div className="mt-1 flex gap-2 text-xs">
                <form action={setNewsPublished}>
                  <input type="hidden" name="id" value={n.id} />
                  <input type="hidden" name="publish" value={String(!n.is_published)} />
                  <SubmitButton className="rounded-lg border border-slate-300 px-2.5 py-1">
                    {n.is_published ? "숨기기" : "다시 보이기"}
                  </SubmitButton>
                </form>
                <form action={deleteNews}>
                  <input type="hidden" name="id" value={n.id} />
                  <ConfirmButton message="이 뉴스를 지울까요?" className="text-red-600 underline">
                    삭제
                  </ConfirmButton>
                </form>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
