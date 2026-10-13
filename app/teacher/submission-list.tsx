import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";

type Row = {
  id: string;
  audio_path: string;
  status: "pending" | "scored" | "failed";
  overall_score: number | null;
  feedback_text: string | null;
  created_at: string;
  students: { id: string; name: string } | null;
  lesson_items: { sentence: string } | null;
};

/** 최근 제출 목록 (선생님용, 녹음 재생 포함) */
export async function SubmissionList({ studentId, limit = 20 }: { studentId?: string; limit?: number }) {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("submissions")
    .select("id, audio_path, status, overall_score, feedback_text, created_at, students(id, name), lesson_items(sentence)")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (studentId) query = query.eq("student_id", studentId);
  const { data } = await query;
  const rows = (data ?? []) as unknown as Row[];

  if (rows.length === 0) return <p className="text-sm text-zinc-500">아직 제출이 없어요.</p>;

  const { data: signed } = await supabase.storage
    .from("shadowing")
    .createSignedUrls(rows.map((r) => r.audio_path), 60 * 60);
  const urlByPath = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  return (
    <ul className="flex flex-col gap-2">
      {rows.map((r) => (
        <li key={r.id} className="flex flex-col gap-1.5 rounded-xl border border-zinc-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              {!studentId && r.students && (
                <Link href={`/teacher/students/${r.students.id}`} className="text-sm font-semibold underline-offset-2 hover:underline">
                  {r.students.name}
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
      ))}
    </ul>
  );
}
