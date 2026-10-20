import "server-only";
import webpush from "web-push";
import { createServerSupabaseClient } from "@/lib/supabase";

export type PushPayload = { title: string; body: string; url?: string; tag?: string };

let configured = false;
export function pushReady() {
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return false;
  if (!configured) {
    webpush.setVapidDetails("mailto:daengcle@users.noreply.github.com", pub, priv);
    configured = true;
  }
  return true;
}

/** 학생의 모든 기기로 알림. 만료된 구독(404/410)은 지운다. 보낸 기기 수를 돌려준다 */
export async function sendPushToStudent(studentId: string, payload: PushPayload, kind: string) {
  if (!pushReady()) return 0;
  const supabase = createServerSupabaseClient();
  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("student_id", studentId);
  let sent = 0;
  for (const s of subs ?? []) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify({ url: "/student", ...payload }),
        { TTL: 60 * 60 * 6 },
      );
      sent++;
    } catch (e) {
      const code = (e as { statusCode?: number }).statusCode;
      if (code === 404 || code === 410) await supabase.from("push_subscriptions").delete().eq("id", s.id);
      else console.error("푸시 실패:", code, (e as Error).message);
    }
  }
  if (sent > 0) {
    await supabase.from("push_log").insert({ student_id: studentId, kind, title: payload.title, body: payload.body });
  }
  return sent;
}
