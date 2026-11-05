import { NextResponse, type NextRequest } from "next/server";
import { getVerifiedStudent } from "@/lib/classroom/dal";
import { createServerSupabaseClient } from "@/lib/supabase";
import { assessPronunciation, isAzureConfigured } from "@/lib/classroom/azure-speech";
import { kstDate } from "@/lib/classroom/stats";
import { VILLAGE_DAILY_SPEAK_LIMIT, VILLAGE_PHRASES } from "@/lib/classroom/village";

export const maxDuration = 30;

/** 마을 가게 안에서 말한 영어를 듣고 정답 문장과 비교해 점수를 준다 */
export async function POST(request: NextRequest) {
  const student = await getVerifiedStudent();
  if (!student) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  if (!isAzureConfigured()) return NextResponse.json({ error: "채점 준비 중이에요." }, { status: 503 });
  const form = await request.formData();
  const text = String(form.get("text") ?? "");
  const audio = form.get("audio");
  if (!VILLAGE_PHRASES.includes(text)) return NextResponse.json({ error: "연습할 문장을 찾지 못했어요." }, { status: 400 });
  if (!(audio instanceof Blob) || audio.size === 0 || audio.size > 1_000_000) {
    return NextResponse.json({ error: "다시 녹음해 주세요." }, { status: 400 });
  }
  // 횟수를 먼저 올려서 잡는다 (같은 값일 때만 올라가서 동시에 보내도 한도를 못 넘는다)
  const supabase = createServerSupabaseClient();
  const day = kstDate(new Date());
  await supabase.from("village_speak_usage").upsert({ student_id: student.id, day }, { onConflict: "student_id,day", ignoreDuplicates: true });
  const { data: usage } = await supabase.from("village_speak_usage").select("count").eq("student_id", student.id).eq("day", day).maybeSingle();
  const used = (usage?.count as number | undefined) ?? 0;
  if (!usage || used >= VILLAGE_DAILY_SPEAK_LIMIT) {
    return NextResponse.json({ error: `오늘 말하기 연습 ${VILLAGE_DAILY_SPEAK_LIMIT}번을 다 했어요. 내일 또 해 봐요 💪` }, { status: 429 });
  }
  const { data: claimed } = await supabase
    .from("village_speak_usage")
    .update({ count: used + 1 })
    .eq("student_id", student.id)
    .eq("day", day)
    .eq("count", used)
    .select("count");
  if (!claimed?.length) return NextResponse.json({ error: "잠깐 뒤에 다시 해 주세요." }, { status: 429 });
  try {
    const r = await assessPronunciation(new Uint8Array(await audio.arrayBuffer()), text);
    return NextResponse.json({
      heard: r.recognizedText,
      score: Math.round(r.overall),
      completeness: Math.round(r.completeness),
      weak: r.words.filter((w) => w.errorType !== "None" || w.accuracy < 60).map((w) => w.word).slice(0, 6),
      left: VILLAGE_DAILY_SPEAK_LIMIT - used - 1,
    });
  } catch (e) {
    console.error("마을 말하기 채점 실패:", e);
    return NextResponse.json({ error: "잘 안 들렸어요. 조용한 곳에서 다시 말해 주세요." }, { status: 422 });
  }
}
