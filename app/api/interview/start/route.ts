import { NextResponse, type NextRequest } from "next/server";
import { getVerifiedStudent } from "@/lib/classroom/dal";
import { createServerSupabaseClient } from "@/lib/supabase";
import { scenario } from "@/lib/classroom/interview-scenarios";
import { talkAccess } from "@/lib/classroom/talk-access";
import { aiReady, interviewerOpening } from "@/lib/classroom/interview-ai";

export const maxDuration = 30;

/** 새 대화 시작: 하루 횟수 확인 → 기록 만들고 첫 인사 */
export async function POST(request: NextRequest) {
  const student = await getVerifiedStudent();
  if (!student) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  if (!aiReady()) return NextResponse.json({ error: "AI 대화가 아직 준비 중이에요. 곧 열려요!" }, { status: 503 });
  const { scenario: id } = (await request.json().catch(() => ({}))) as { scenario?: string };
  const s = scenario(String(id));
  if (!s) return NextResponse.json({ error: "없는 상황이에요." }, { status: 400 });

  const access = await talkAccess(student);
  if (!access.canStart) {
    return NextResponse.json(
      {
        error:
          access.kind === "free"
            ? "무료 체험을 다 썼어요. AI 면접 패스를 신청하면 계속할 수 있어요 🙌"
            : `오늘은 ${access.limit}번 다 했어요. 내일 또 만나요! 🙌`,
      },
      { status: 429 },
    );
  }
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("interview_sessions")
    .insert({ student_id: student.id, scenario: s.id, transcript: [{ role: "ai", text: s.opening }] })
    .select("id")
    .single();
  if (error || !data) return NextResponse.json({ error: "시작하지 못했어요. 다시 시도해 주세요." }, { status: 500 });
  // 첫 인사도 면접마다 다르게 (AI가 안 되면 기본 인사)
  let opening = s.opening;
  try {
    opening = await interviewerOpening(s, data.id);
    await supabase.from("interview_sessions").update({ transcript: [{ role: "ai", text: opening }] }).eq("id", data.id);
  } catch (e) {
    console.error("첫 인사 만들기 실패:", e);
  }
  return NextResponse.json({ sessionId: data.id, reply: opening, left: access.left - 1 });
}
