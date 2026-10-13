import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, decryptSession } from "@/lib/classroom/session";

// 낙관적 체크만 수행 (쿠키 서명 확인). 실제 권한 확인은 lib/classroom/dal.ts에서.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await decryptSession(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (pathname.startsWith("/teacher") && session?.role !== "teacher") {
    return NextResponse.redirect(new URL("/login?role=teacher", request.url));
  }
  if (pathname.startsWith("/student") && session?.role !== "student") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/teacher/:path*", "/student/:path*"],
};
