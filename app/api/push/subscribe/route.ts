import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getVerifiedStudent } from "@/lib/classroom/dal";
import { sendPushToStudent } from "@/lib/classroom/push";

type Body = { endpoint?: string; keys?: { p256dh?: string; auth?: string }; test?: boolean };

/** 이 기기에서 학습 알림 받기 (구독 저장 + 환영 알림) */
export async function POST(request: NextRequest) {
  const student = await getVerifiedStudent();
  if (!student) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as Body;
  const endpoint = body.endpoint ?? "";
  const p256dh = body.keys?.p256dh ?? "";
  const auth = body.keys?.auth ?? "";
  if (!/^https:\/\//.test(endpoint) || !p256dh || !auth || endpoint.length > 1000) {
    return NextResponse.json({ error: "bad_subscription" }, { status: 400 });
  }
  const supabase = createServerSupabaseClient();
  await supabase.from("push_subscriptions").upsert(
    { student_id: student.id, endpoint, p256dh, auth, user_agent: request.headers.get("user-agent")?.slice(0, 200) ?? null },
    { onConflict: "endpoint" },
  );
  await sendPushToStudent(
    student.id,
    { title: "🔔 알림이 켜졌어요!", body: "공부를 깜빡한 날 저녁에 살짝 알려드릴게요. 오늘도 한 문장! 💙", tag: "welcome" },
    "test",
  );
  return NextResponse.json({ ok: true });
}

/** 이 기기 알림 끄기 */
export async function DELETE(request: NextRequest) {
  const student = await getVerifiedStudent();
  if (!student) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { endpoint } = (await request.json().catch(() => ({}))) as Body;
  if (endpoint) {
    const supabase = createServerSupabaseClient();
    await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint).eq("student_id", student.id);
  }
  return NextResponse.json({ ok: true });
}
