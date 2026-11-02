import Link from "next/link";
import { cardClass } from "@/app/_ui/styles";
import { requireTeacher } from "@/lib/classroom/dal";
import { COURSE_SHORT } from "@/lib/classroom/plans";
import { getProgressBoard, type BoardCell } from "@/lib/classroom/progress-board";
import { createServerSupabaseClient } from "@/lib/supabase";

const CELL: Record<BoardCell["state"], { mark: string; cls: string }> = {
  2: { mark: "O", cls: "bg-green-500 text-white" },
  1: { mark: "△", cls: "bg-amber-200 text-amber-900" },
  0: { mark: "", cls: "bg-slate-100" },
  [-1]: { mark: "", cls: "bg-slate-300/60" },
};

function inactiveText(days: number | null) {
  if (days == null) return "기록 없음";
  if (days === 0) return "오늘";
  return `${days}일 전`;
}

/** 진도표: 엑셀 대신 학생 × Day 표. 영상 시청·쉐도잉 제출로 자동으로 채워진다 */
export default async function ProgressBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; cohort?: string; sort?: string }>;
}) {
  await requireTeacher();
  const params = await searchParams;
  const supabase = createServerSupabaseClient();
  const { data: courseRows } = await supabase
    .from("courses")
    .select("id, status")
    .eq("status", "open")
    .order("sort_order");
  const courses = (courseRows ?? []).map((c) => c.id as string);
  const course = params.course && courses.includes(params.course) ? params.course : (courses[0] ?? "bootcamp");
  const cohort = params.cohort && /^([0-9a-f-]{36}|none)$/.test(params.cohort) ? params.cohort : null;
  const sort = params.sort === "low" || params.sort === "inactive" ? params.sort : "name";

  const { days, rows, cohorts, unassigned, allCount } = await getProgressBoard(course, cohort);
  const sorted = [...rows].sort((a, b) => {
    if (a.ended !== b.ended) return a.ended ? 1 : -1;
    if (sort === "low") return a.percent - b.percent;
    if (sort === "inactive") return (b.daysInactive ?? 9999) - (a.daysInactive ?? 9999);
    return a.name.localeCompare(b.name, "ko");
  });
  const current = rows.filter((r) => !r.ended);
  const average = current.length ? Math.round(current.reduce((n, r) => n + r.percent, 0) / current.length) : 0;
  const away = current.filter((r) => r.daysInactive == null || r.daysInactive >= 7).length;

  const href = (next: { course?: string; cohort?: string | null; sort?: string }) => {
    const q = new URLSearchParams();
    q.set("course", next.course ?? course);
    const c = next.cohort === undefined ? cohort : next.cohort;
    if (c) q.set("cohort", c);
    const s = next.sort ?? sort;
    if (s !== "name") q.set("sort", s);
    return `/teacher/progress?${q}`;
  };
  const pill = (on: boolean) =>
    `shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold ${
      on ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-700"
    }`;

  return (
    <>
      <h1 className="text-xl font-bold text-zinc-900">📊 진도표</h1>
      <nav className="flex gap-1.5 overflow-x-auto">
        {courses.map((c) => (
          <Link key={c} href={href({ course: c })} className={pill(c === course)}>
            {COURSE_SHORT[c] ?? c}
          </Link>
        ))}
      </nav>
      <nav className="flex gap-1.5 overflow-x-auto">
        <Link href={href({ cohort: null })} className={pill(!cohort)}>
          전체 {allCount}
        </Link>
        {cohorts.map((c) => (
          <Link key={c.id} href={href({ cohort: c.id })} className={pill(cohort === c.id)}>
            {c.name} {c.count}
          </Link>
        ))}
        {unassigned > 0 && (
          <Link href={href({ cohort: "none" })} className={pill(cohort === "none")}>
            기수 미지정 {unassigned}
          </Link>
        )}
      </nav>

      <section className="grid grid-cols-3 gap-2">
        {[
          ["학생", `${current.length}명`],
          ["평균 진도", `${average}%`],
          ["7일 넘게 쉼", `${away}명`],
        ].map(([label, value]) => (
          <div key={label} className={`${cardClass} !p-3 text-center`}>
            <p className="text-xs text-zinc-500">{label}</p>
            <p className="text-xl font-bold tabular-nums text-zinc-900">{value}</p>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600">
          <span><b className="text-green-600">O</b> 영상·쉐도잉 끝냄</span>
          <span><b className="text-amber-600">△</b> 하는 중</span>
          <span>빈칸 시작 전</span>
          <span className="text-zinc-400">회색 체험이라 잠김</span>
        </p>
        <div className="flex gap-1 text-xs">
          {([["name", "이름순"], ["low", "진도 낮은순"], ["inactive", "오래 쉰 순"]] as const).map(([key, label]) => (
            <Link
              key={key}
              href={href({ sort: key })}
              className={`rounded-full px-2.5 py-1 font-semibold ${sort === key ? "bg-zinc-800 text-white" : "bg-slate-100 text-zinc-700"}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-zinc-500">이 조건에 해당하는 학생이 없어요.</p>
      ) : (
        <div className="isolate max-h-[75vh] overflow-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <table className="border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 top-0 z-20 min-w-36 bg-white px-3 py-2 text-left text-xs font-semibold text-zinc-500">학생</th>
                <th className="sticky top-0 z-10 bg-white px-2 py-2 text-xs font-semibold text-zinc-500">진도</th>
                <th className="sticky top-0 z-10 whitespace-nowrap bg-white px-2 py-2 text-xs font-semibold text-zinc-500">마지막</th>
                {days.map((d, i) => (
                  <th
                    key={d.id}
                    className={`sticky top-0 z-10 min-w-7 bg-white py-2 text-center text-[11px] font-medium tabular-nums text-zinc-500 ${
                      i > 0 && days[i - 1].week !== d.week ? "border-l border-slate-200" : ""
                    }`}
                  >
                    {d.day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.id} className={r.ended ? "opacity-50" : ""}>
                  <td className="sticky left-0 z-10 border-t border-slate-100 bg-white px-3 py-1.5">
                    <Link href={`/teacher/students/${r.id}`} className="font-semibold text-zinc-900 hover:underline">
                      {r.name}
                    </Link>
                    <span className="block text-[11px] text-zinc-500">
                      {r.isTrial ? "🎁 " : ""}
                      {r.planLabel || "수강권 없음"}
                      {r.ended ? " · 종료" : ""}
                    </span>
                  </td>
                  <td className="border-t border-slate-100 px-2 text-center tabular-nums">
                    <b className="text-zinc-900">{r.percent}%</b>
                    <span className="block whitespace-nowrap text-[11px] text-zinc-500">
                      {r.done}/{r.total}
                      {r.furthest != null ? ` · D${r.furthest}` : ""}
                    </span>
                  </td>
                  <td
                    className={`whitespace-nowrap border-t border-slate-100 px-2 text-center text-xs ${
                      r.daysInactive == null || r.daysInactive >= 7 ? "font-semibold text-red-600" : "text-zinc-600"
                    }`}
                  >
                    {inactiveText(r.daysInactive)}
                  </td>
                  {r.cells.map((c, i) => (
                    <td
                      key={days[i].id}
                      className={`border-t border-slate-100 p-0.5 ${
                        i > 0 && days[i - 1].week !== days[i].week ? "border-l border-l-slate-200" : ""
                      }`}
                    >
                      <span
                        title={c.label}
                        className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${CELL[c.state].cls}`}
                      >
                        {CELL[c.state].mark}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-zinc-500">
        진도는 끝낸 Day ÷ 그 학생이 들을 수 있는 Day입니다. 앱에서 영상을 90% 이상 보고 쉐도잉 문장을 모두 내면 O가 돼요. 칸에 마우스를 올리면 자세히 나와요. 줌 수업 출석과 앱 밖에서 한 공부는 들어가지 않아요.
      </p>
    </>
  );
}
