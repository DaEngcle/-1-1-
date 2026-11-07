import { NextResponse, type NextRequest } from "next/server";
import { getVerifiedStudent } from "@/lib/classroom/dal";
import { listVillageChat } from "@/lib/classroom/village-chat";

/**
 * 고양이 마을 채팅 받아 오기: GET ?after=ISO시각 → { messages } (오래된 것부터, 최근 24시간 중 최대 20개)
 * 서버 액션은 한 번에 하나씩만 보내져서 4초마다 묻는 용도로는 GET을 쓴다.
 */
export async function GET(request: NextRequest) {
  const student = await getVerifiedStudent();
  if (!student) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  const messages = await listVillageChat(student.id, request.nextUrl.searchParams.get("after"));
  return NextResponse.json({ messages }, { headers: { "Cache-Control": "no-store" } });
}
