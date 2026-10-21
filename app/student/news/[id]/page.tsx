import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireStudent } from "@/lib/classroom/dal";
import { cardClass } from "@/app/_ui/styles";
import type { NewsLesson } from "@/lib/classroom/news";
import { ExpressionList, NewsQuiz, NewsSummary } from "./news-study";

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStudent();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("news_lessons").select("*").eq("id", id).eq("is_published", true).maybeSingle();
  if (!data) notFound();
  const n = data as NewsLesson;

  return (
    <>
      <Link href="/student/news" className="text-sm text-zinc-600 underline">
        ← 뉴스 목록
      </Link>
      <header className="flex flex-col gap-1">
        <p className="text-xs text-zinc-500">
          {n.topic} · {n.level} · {n.published_on}
        </p>
        <h1 className="text-xl font-extrabold leading-snug text-zinc-900">{n.title_ko}</h1>
        <p className="text-sm text-zinc-500">
          “{n.source_title}”{" "}
          <a href={n.source_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 underline">
            원문 보기 ({n.source_name}) ↗
          </a>
        </p>
      </header>

      <section className={`${cardClass} flex flex-col gap-2`}>
        <h2 className="font-bold text-zinc-900">① 쉬운 영어로 읽기</h2>
        <NewsSummary en={n.summary_en} ko={n.summary_ko} />
      </section>

      <section className={`${cardClass} flex flex-col gap-2`}>
        <h2 className="font-bold text-zinc-900">② 핵심 표현 {n.expressions.length}개</h2>
        <p className="text-xs text-zinc-500">🔊를 눌러 듣고 따라 말해보세요. 예문은 호주 생활에서 바로 쓸 수 있게 만들었어요.</p>
        <ExpressionList items={n.expressions} />
      </section>

      {n.quiz.length > 0 && (
        <section className={`${cardClass} flex flex-col gap-2`}>
          <h2 className="font-bold text-zinc-900">③ 1분 퀴즈</h2>
          <NewsQuiz newsId={n.id} quiz={n.quiz} />
        </section>
      )}

      <p className="text-center text-xs text-zinc-400">
        요약은 다잉클이 학습용으로 쉽게 다시 쓴 글이에요. 기사 전체는 {n.source_name}에서 읽을 수 있어요.
      </p>
    </>
  );
}
