import "server-only";
import { createHash, randomInt, timingSafeEqual } from "node:crypto";

// 헷갈리는 문자(0/O, 1/I/L) 제외
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;

/** 학생 로그인 코드 생성. 표시용 형식: ABCD-EFGH */
export function generateLoginCode() {
  let raw = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    raw += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}

export function normalizeLoginCode(input: string) {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function hashLoginCode(code: string) {
  return createHash("sha256").update(normalizeLoginCode(code)).digest("hex");
}

/** 선생님 비밀번호 비교 (타이밍 공격 방지) */
export function isTeacherPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/** 세션에 넣을 선생님 비밀번호 지문. 비밀번호 자체는 드러나지 않음 */
export function teacherPasswordFingerprint() {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  return createHash("sha256")
    .update(`teacher-session:${process.env.SESSION_SECRET ?? ""}:${secret}`)
    .digest("hex")
    .slice(0, 32);
}
