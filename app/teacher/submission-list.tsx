import Link from "next/link";
import { createServerSupabaseClient, type Submission } from "@/lib/supabase";

type Row = {
  id: string;
  audio_path: string;
  status: Submission["status"];
  overall_score: number | null;
  feedback_text: string | null;
  created_at: string;
  students: { id: string; name: string } | null;
  lesson_items: {
    sentence: string;
    lessons: { id: string; week_number: number; day_number: number | null; kind: "day" | "drill" } | null;
  } | null;
};

function lessonLabel(l: NonNullable<NonNullable<Row["lesson_items"]>["lessons"]>) {
  return `Week ${l.week_number} · ${l.kind === "day" ? `Day ${String(l.day_number).padStart(2, "0")}` : "Drill"}`;
}

/**
 * 쉐도잉 제출 목록 (녹음 재생 포함).
 * studentId를 주면 그 학생 것만 (학생 이름 숨김), weekNumber/status로 거르기, page로 넘기기.
 */
export async function SubmissionList({
  studentId,
  weekNumber,
  status,
  limit = 20,
  page = 1,
  pageHref,
  lessonHref = (lessonId) => `/teacher/lessons/${lessonId}`,
}: {
  studentId?: string;
  weekNumber?: number;
  status?: Submission["status"];
  limit?: number;
  page?: number;
  pageHref?: (page: number) => string;
  lessonHref?: (lessonId: string) => string;
}) {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("submissions")
    .select(
      "id, audio_path, status, overall_score, feedback_text, created_at, students(id, name), lesson_items!inner(sentence, lessons!inner(id, week_number, day_number, kind))",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  if (studentId) query = query.eq("student_id", studentId);
  if (weekNumber) query = query.eq("lesson_items.lessons.week_number", weekNumber);
  if (status) query = query.eq("status", status);
  const { data, count } = await query;
  const rows = (data ?? []) as unknown as Row[];

  if (rows.length === 0) return <p className="text-sm text-zinc-500">아직 제출이 없어요.</p>;

  const { data: signed } = await supabase.storage
    .from("shadowing")
    .createSignedUrls(rows.map((r) => r.audio_path), 60 * 60);
  const urlByPath = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / limit));

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {rows.map((r) => {
          const lesson = r.lesson_items?.lessons;
          return (
            <li key={r.id} className="flex flex-col gap-1.5 rounded-xl border border-zinc-200 bg-white p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  {!studentId && r.students && (
                    <Link href={`/teacher/students/${r.students.id}`} className="text-sm font-semibold underline-offset-2 hover:underline">
                      {r.students.name}
                    </Link>
                  )}
                  {lesson && (
                    <Link href={lessonHref(lesson.id)} className="text-xs text-zinc-500 hover:underline">
                      {lessonLabel(lesson)}
                    </Link>
                  )}
                  <span className="text-sm text-zinc-800">{r.lesson_items?.sentence}</span>
                  <span className="text-xs text-zinc-400">
                    {new Date(r.created_at).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
                  </span>
                </div>
                <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-sm font-bold text-zinc-800">
                  {r.status === "scored" ? `${Math.round(Number(r.overall_score))}점` : r.status === "failed" ? "인식 실패" : "채점 대기"}
                </span>
              </div>
              {urlByPath.get(r.audio_path) && (
                <audio src={urlByPath.get(r.audio_path) ?? undefined} controls preload="none" className="h-9 w-full" />
              )}
              {r.feedback_text && (
                <details className="text-sm text-zinc-600">
                  <summary className="cursor-pointer text-xs">AI 피드백 보기</summary>
                  <p className="mt-1 whitespace-pre-line">{r.feedback_text}</p>
                </details>
              )}
            </li>
          );
        })}
      </ul>
      {pageHref && totalPages > 1 && (
        <nav className="flex items-center justify-between text-sm">
          {page > 1 ? <Link href={pageHref(page - 1)} className="underline">← 최근</Link> : <span />}
          <span className="text-zinc-500">
            {page} / {totalPages} 페이지 · 총 {count}건
          </span>
          {page < totalPages ? <Link href={pageHref(page + 1)} className="underline">이전 →</Link> : <span />}
        </nav>
      )}
    </div>
  );
}
