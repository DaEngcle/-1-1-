import { NextResponse, type NextRequest } from "next/server";
import { ensureSeedNews, generateNewsLessons } from "@/lib/classroom/news";

export const maxDuration = 300;

/** Vercel Cron이 매일 아침(한국 6시) 호출: ABC 뉴스로 새 레슨 2개. CRON_SECRET으로 보호 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  await ensureSeedNews();
  return NextResponse.json(await generateNewsLessons(2));
}
