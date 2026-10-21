import { NextResponse, type NextRequest } from "next/server";
import { getVerifiedStudent } from "@/lib/classroom/dal";
import { createServerSupabaseClient } from "@/lib/supabase";
import { kstDate } from "@/lib/classroom/stats";
import { DAILY_LIMIT, scenario } from "@/lib/classroom/interview-scenarios";
import { aiReady } from "@/lib/classroom/interview-ai";

/** 새 대화 시작: 하루 횟수 확인 → 기록 만들고 첫 인사 */
export async function POST(request: NextRequest) {
  const student = await getVerifiedStudent();
  if (!student) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  if (!aiReady()) return NextResponse.json({ error: "AI 대화가 아직 준비 중이에요. 곧 열려요!" }, { status: 503 });
  const { scenario: id } = (await request.json().catch(() => ({}))) as { scenario?: string };
  const s = scenario(String(id));
  if (!s) return NextResponse.json({ error: "없는 상황이에요." }, { status: 400 });

  const supabase = createServerSupabaseClient();
  const todayStart = new Date(`${kstDate(new Date())}T00:00:00+09:00`).toISOString();
  const { count } = await supabase
    .from("interview_sessions")
    .select("id", { count: "exact", head: true })
    .eq("student_id", student.id)
    .gte("created_at", todayStart);
  const limit = student.courses.length === 0 ? DAILY_LIMIT.free : DAILY_LIMIT.student;
  if ((count ?? 0) >= limit) {
    return NextResponse.json(
      { error: `오늘은 ${limit}번 다 했어요. 내일 또 만나요! 🙌${student.courses.length === 0 ? " (수강생은 하루 5번)" : ""}` },
      { status: 429 },
    );
  }
  const { data, error } = await supabase
    .from("interview_sessions")
    .insert({ student_id: student.id, scenario: s.id, transcript: [{ role: "ai", text: s.opening }] })
    .select("id")
    .single();
  if (error || !data) return NextResponse.json({ error: "시작하지 못했어요. 다시 시도해 주세요." }, { status: 500 });
  return NextResponse.json({ sessionId: data.id, reply: s.opening, left: limit - (count ?? 0) - 1 });
}
