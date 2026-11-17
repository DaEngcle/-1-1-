import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { isTeacher } from "@/lib/classroom/dal";
import { assessPronunciation, isAzureConfigured } from "@/lib/classroom/azure-speech";
import { generateCoachFeedback } from "@/lib/classroom/coach-feedback";

export const maxDuration = 60;

/**
 * 선생님 전용: 채점 서버 장애로 실패한 제출을 저장된 녹음으로 다시 채점한다.
 * GET /api/submissions/rescore?since=2026-11-16T21:00:00Z&limit=6 (한 번에 몇 건씩, 남은 수를 돌려준다)
 */
export async function GET(request: NextRequest) {
  // 선생님 로그인 또는 일회용 열쇠(해시만 코드에 둔다, 2026-11 장애 복구용)
  const key = request.nextUrl.searchParams.get("key") ?? "";
  const keyOk = createHash("sha256").update(key).digest("hex") === "9509578aa5c5d89e5152f3a2b329936e7c6d82ccd35528bf296f45d55bc8fcc8";
  if (!keyOk && !(await isTeacher())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isAzureConfigured()) return NextResponse.json({ error: "azure_unavailable" }, { status: 503 });

  const since = request.nextUrl.searchParams.get("since") ?? new Date(Date.now() - 86400000).toISOString();
  const limit = Math.min(10, Math.max(1, Number(request.nextUrl.searchParams.get("limit") ?? 6)));
  const supabase = createServerSupabaseClient();

  const { data: rows } = await supabase
    .from("submissions")
    .select("id, audio_path, lesson_items!inner(sentence)")
    .eq("status", "failed")
    .gte("created_at", since)
    .order("created_at")
    .limit(limit);

  const done: string[] = [];
  const stillFailed: { id: string; error: string }[] = [];
  for (const r of rows ?? []) {
    const sentence = (r.lesson_items as unknown as { sentence: string }).sentence;
    try {
      const file = await supabase.storage.from("shadowing").download(r.audio_path);
      if (file.error || !file.data) throw new Error(`녹음 없음: ${file.error?.message}`);
      const bytes = new Uint8Array(await file.data.arrayBuffer());
      const result = await assessPronunciation(bytes, sentence);
      const feedback = await generateCoachFeedback(sentence, result);
      await supabase
        .from("submissions")
        .update({
          status: "scored",
          overall_score: result.overall,
          accuracy_score: result.accuracy,
          fluency_score: result.fluency,
          completeness_score: result.completeness,
          prosody_score: result.prosody,
          word_details: result.words,
          feedback_text: feedback,
          scored_at: new Date().toISOString(),
        })
        .eq("id", r.id);
      done.push(r.id);
    } catch (e) {
      stillFailed.push({ id: r.id, error: String(e).slice(0, 200) });
    }
  }

  const { count } = await supabase
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("status", "failed")
    .gte("created_at", since);
  return NextResponse.json({ rescored: done.length, stillFailed, remainingFailed: count ?? null });
}
