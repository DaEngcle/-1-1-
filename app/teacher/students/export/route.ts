import { NextResponse } from "next/server";
import { isTeacher } from "@/lib/classroom/dal";
import { getRoster, STATUS_INFO } from "@/lib/classroom/roster";
import { kstDate } from "@/lib/classroom/stats";

/** 학생 관리판을 엑셀에서 열 수 있는 CSV로 */
export async function GET() {
  if (!(await isTeacher())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rows = await getRoster();
  const header = [
    "이름", "닉네임", "전화번호", "상태", "수강권", "종료일", "남은 일수", "최근 활동", "최근 7일 공부한 날",
    "이번 주 제출", "누적 제출", "쉐도잉 진도(%)", "강의 수강(%)", "평균 점수(30일)", "출석률(%)", "레벨(전)", "레벨(후)", "메모",
  ];
  const cell = (v: unknown) => {
    const s = v == null ? "" : String(v);
    // 엑셀 수식 주입 방지 + 쉼표·따옴표·줄바꿈 처리
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  const lines = rows.map((r) =>
    [
      r.name,
      r.nickname,
      r.phone,
      STATUS_INFO[r.status].label,
      r.planLabel,
      r.accessUntil,
      r.daysLeft,
      r.lastActive,
      r.week.filter(Boolean).length,
      r.weekSubmissions,
      r.totalSubmissions,
      r.progress?.submitPercent,
      r.progress?.videoPercent,
      r.avgScore30,
      r.attendanceRate,
      r.levelPre,
      r.levelPost,
      r.memo,
    ]
      .map(cell)
      .join(","),
  );
  const csv = "﻿" + [header.join(","), ...lines].join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="dingle-students-${kstDate(new Date())}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
