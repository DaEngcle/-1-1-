import { NextResponse, type NextRequest } from "next/server";
import { sendDailyReminders } from "@/lib/classroom/reminders";

/** Vercel Cron이 매일 저녁(한국 20시) 호출. CRON_SECRET으로 보호 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const result = await sendDailyReminders();
  return NextResponse.json(result);
}
