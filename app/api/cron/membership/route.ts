import { NextResponse, type NextRequest } from "next/server";
import { runMembershipBilling } from "@/lib/classroom/membership-billing";

/** Vercel Cron이 매일 새벽(한국 5시) 호출: 멤버십 자동 결제·재시도·종료. CRON_SECRET으로 보호 */
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const summary = await runMembershipBilling();
  console.log("멤버십 결제 정리:", summary);
  return NextResponse.json(summary);
}
