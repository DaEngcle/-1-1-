import type { AttendanceStatus } from "@/lib/supabase";

export const ATTENDANCE_LABEL: Record<AttendanceStatus, { label: string; icon: string }> = {
  present: { label: "출석", icon: "✅" },
  late: { label: "지각", icon: "⏰" },
  absent: { label: "결석", icon: "❌" },
  excused: { label: "공결", icon: "📝" },
};
