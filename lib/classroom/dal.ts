import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getSession } from "./session";

/** 선생님 권한 확인. 아니면 로그인 페이지로 */
export const requireTeacher = cache(async () => {
  const session = await getSession();
  if (session?.role !== "teacher") {
    redirect("/login?role=teacher");
  }
  return session;
});

/** 학생 권한 확인 + 학생 정보 반환 (비활성 학생은 차단) */
export const requireStudent = cache(async () => {
  const session = await getSession();
  if (session?.role !== "student") {
    redirect("/login");
  }
  const supabase = createServerSupabaseClient();
  const { data: student } = await supabase
    .from("students")
    .select("id, name, is_active")
    .eq("id", session.studentId)
    .maybeSingle();

  if (!student || !student.is_active) {
    redirect("/login?error=inactive");
  }
  return { id: student.id as string, name: student.name as string };
});
