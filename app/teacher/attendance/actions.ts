"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient, type AttendanceStatus } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";

const STATUSES: AttendanceStatus[] = ["present", "late", "absent", "excused"];

/** 한 수업일의 출결을 한 번에 저장 (입력하지 않은 학생은 기록 삭제) */
export async function saveAttendance(formData: FormData) {
  await requireTeacher();
  const classDate = String(formData.get("class_date"));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(classDate)) return;
  const studentIds = formData.getAll("student_id").map(String);

  const rows: { student_id: string; class_date: string; status: AttendanceStatus; note: string | null }[] = [];
  const cleared: string[] = [];
  for (const studentId of studentIds) {
    const status = String(formData.get(`status_${studentId}`) ?? "") as AttendanceStatus;
    if (STATUSES.includes(status)) {
      const note = String(formData.get(`note_${studentId}`) ?? "").trim();
      rows.push({ student_id: studentId, class_date: classDate, status, note: note || null });
    } else {
      cleared.push(studentId);
    }
  }

  const supabase = createServerSupabaseClient();
  if (rows.length > 0) {
    await supabase.from("attendance").upsert(rows, { onConflict: "student_id,class_date" });
  }
  if (cleared.length > 0) {
    await supabase.from("attendance").delete().eq("class_date", classDate).in("student_id", cleared);
  }
  revalidatePath("/teacher/attendance");
}
