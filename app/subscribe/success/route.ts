import { NextResponse, type NextRequest } from "next/server";
import { getPayingStudent } from "@/lib/classroom/dal";
import { completeFirstPayment } from "@/lib/classroom/membership-billing";

// 토스 카드 등록 성공 → 여기로 돌아온다 (?customerKey&authKey). 첫 달 결제 후 바로 열어 준다
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const customerKey = url.searchParams.get("customerKey") ?? "";
  const authKey = url.searchParams.get("authKey") ?? "";
  const back = (error: string) => NextResponse.redirect(new URL(`/subscribe?error=${encodeURIComponent(error)}`, url));

  const student = await getPayingStudent();
  if (!student) return NextResponse.redirect(new URL("/login", url));
  if (!customerKey || !authKey) return back("카드 등록 정보가 없어요. 다시 시도해 주세요.");

  const result = await completeFirstPayment(student.id, customerKey, authKey);
  if (result.ok) return NextResponse.redirect(new URL("/student/membership?welcome=1", url));
  if (result.unknown || result.busy) return NextResponse.redirect(new URL("/student/membership?checking=1", url));
  return back(result.message);
}
