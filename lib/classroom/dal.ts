import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getSession } from "./session";
import { teacherPasswordFingerprint } from "./login-code";

/** 선생님 세션이 유효한지 (비밀번호가 바뀌면 기존 세션은 무효) */
export const isTeacher = cache(async () => {
  const session = await getSession();
  return session?.role === "teacher" && session.pv === teacherPasswordFingerprint();
});

/** 선생님 권한 확인. 아니면 로그인 페이지로 */
export const requireTeacher = cache(async () => {
  if (!(await isTeacher())) {
    redirect("/login?role=teacher");
  }
});

/**
 * 학생 세션 확인 + 학생 정보 반환. 실패하면 null.
 * 비활성 학생, 코드가 재발급된(세션 버전이 바뀐) 학생은 거부한다.
 */
export const getVerifiedStudent = cache(async () => {
  const session = await getSession();
  if (session?.role !== "student") return null;
  const supabase = createServerSupabaseClient();
  const { data: student } = await supabase
    .from("students")
    .select("id, name, is_active, session_version")
    .eq("id", session.studentId)
    .maybeSingle();

  if (!student || !student.is_active || student.session_version !== session.v) {
    return null;
  }
  return { id: student.id as string, name: student.name as string };
});

/** 학생 권한 확인. 아니면 로그인 페이지로 */
export const requireStudent = cache(async () => {
  const student = await getVerifiedStudent();
  if (!student) {
    redirect("/login?error=expired");
  }
  return student;
});
