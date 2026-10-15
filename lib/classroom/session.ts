import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "classroom_session";
const SESSION_DAYS = 30;

// teacher.pv: 선생님 비밀번호 지문 (비밀번호를 바꾸면 기존 로그인이 끊김)
// student.v: 학생 세션 버전 (코드를 재발급하면 기존 로그인이 끊김)
export type SessionPayload =
  | { role: "teacher"; pv: string }
  | { role: "student"; studentId: string; v: number };

function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET 환경변수가 필요합니다.");
  }
  return new TextEncoder().encode(secret);
}

export async function encryptSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getKey());
}

export async function decryptSession(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
    });
    if (payload.role === "teacher" && typeof payload.pv === "string") {
      return { role: "teacher", pv: payload.pv };
    }
    if (
      payload.role === "student" &&
      typeof payload.studentId === "string" &&
      typeof payload.v === "number"
    ) {
      return { role: "student", studentId: payload.studentId, v: payload.v };
    }
    return null;
  } catch {
    return null;
  }
}

export async function createSession(payload: SessionPayload) {
  const token = await encryptSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  return decryptSession(cookieStore.get(SESSION_COOKIE)?.value);
}
