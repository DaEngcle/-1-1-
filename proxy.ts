import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS, decryptSession, refreshedSessionToken } from "@/lib/classroom/session";

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
  // 계속 쓰는 동안은 로그인 유지 기간을 다시 30일로 늘린다 (실제 권한 확인은 여전히 dal.ts에서)
  const res = NextResponse.next();
  const fresh = await refreshedSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (fresh) res.cookies.set(SESSION_COOKIE, fresh, SESSION_COOKIE_OPTIONS);
  return res;
}

export const config = {
  matcher: ["/teacher/:path*", "/student/:path*"],
};
