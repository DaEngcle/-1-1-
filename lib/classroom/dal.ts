import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getSession } from "./session";
import { teacherPasswordFingerprint } from "./login-code";
import { coursesForPlan } from "./plans";
import { kstDate } from "./stats";
import { isCatBreed } from "./cat";

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

export type StudentDenial = "expired" | "inactive" | "pending" | "plan-ended";

/**
 * 학생 세션 확인 + 학생 정보와 볼 수 있는 과정. 거부 사유가 있으면 { denied }.
 * 비활성·승인 전·수강 기간이 끝난 학생, 코드가 재발급된(세션 버전이 바뀐) 학생은 거부한다.
 */
export const checkStudent = cache(async () => {
  const session = await getSession();
  if (session?.role !== "student") return { denied: "expired" as StudentDenial };
  const supabase = createServerSupabaseClient();
  const { data: student, error } = await supabase
    .from("students")
    .select("id, name, nickname, is_active, session_version, approval, plan, access_until, early_courses, cat_breed")
    .eq("id", session.studentId)
    .maybeSingle();
  // DB 오류(예: 새 칸이 아직 없음)를 '로그인 만료'로 착각하지 않도록 기록
  if (error) console.error("학생 정보 조회 실패:", error.message);

  if (!student || student.session_version !== session.v) return { denied: "expired" as StudentDenial };
  if (!student.is_active || student.approval === "rejected") return { denied: "inactive" as StudentDenial };
  if (student.approval !== "approved") return { denied: "pending" as StudentDenial };
  if (student.access_until && student.access_until < kstDate(new Date())) {
    return { denied: "plan-ended" as StudentDenial };
  }
  return {
    student: {
      id: student.id as string,
      name: student.name as string,
      nickname: (student.nickname as string | null) ?? null,
      /** 고른 응원 고양이 (아직 안 골랐으면 null) */
      catBreed: isCatBreed(student.cat_breed) ? student.cat_breed : null,
      plan: (student.plan as string | null) ?? null,
      accessUntil: (student.access_until as string | null) ?? null,
      courses: coursesForPlan(student.plan),
      /** 준비 중이어도 이 학생에게만 미리 열린 과정 */
      earlyCourses: ((student.early_courses as string[] | null) ?? []) as string[],
    },
  };
});

/** 학생 세션 확인. 실패하면 null (API용) */
export const getVerifiedStudent = cache(async () => (await checkStudent()).student ?? null);

/** 학생 권한 확인. 아니면 사유와 함께 로그인 페이지로 */
export const requireStudent = cache(async () => {
  const result = await checkStudent();
  if (!result.student) {
    redirect(`/login?error=${result.denied}`);
  }
  return result.student;
});
