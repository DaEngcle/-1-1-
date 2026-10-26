"use client";

import { useState } from "react";
import { COURSE_IDS, COURSE_SHORT, PLANS, accessUntil, planForCourses, planName, type CourseId, type PlanId } from "@/lib/classroom/plans";
import { SubmitButton } from "@/app/_ui/submit-button";
import { updatePlan } from "../actions";

const PRESETS = (Object.keys(PLANS) as PlanId[]).filter((id) => id !== "custom");

function today() {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

/** 날짜에 n개월 더하기 (끝나는 날 기준) */
function addMonths(day: string, n: number) {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString().slice(0, 10);
}

/** 수강권: 열 과정 체크 + 종료일. 위 버튼은 자주 쓰는 조합을 한 번에 채워 준다 */
export function PlanEditor({
  id,
  plan,
  courses: initialCourses,
  until: initialUntil,
}: {
  id: string;
  plan: string | null;
  courses: CourseId[];
  until: string | null;
}) {
  const [courses, setCourses] = useState<CourseId[]>(initialCourses);
  const [trial, setTrial] = useState(plan === "trial1");
  const [until, setUntil] = useState(initialUntil ?? "");

  function preset(pid: PlanId) {
    setCourses([...PLANS[pid].courses]);
    setTrial(pid === "trial1");
    setUntil(accessUntil(pid, today()));
  }
  function toggle(c: CourseId) {
    setTrial(false);
    setCourses((l) => (l.includes(c) ? l.filter((x) => x !== c) : COURSE_IDS.filter((x) => x === c || l.includes(x))));
  }

  const next = trial ? "trial1" : planForCourses(courses, plan);
  const pill = (on: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm font-semibold ${on ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-zinc-700"}`;

  return (
    <form action={updatePlan} className="flex flex-col gap-3 text-sm">
      <input type="hidden" name="id" value={id} />
      <div>
        <p className="mb-1 text-xs font-semibold text-zinc-500">빠르게 채우기 (누르면 과정·종료일이 오늘부터 채워져요)</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((pid) => (
            <button
              key={pid}
              type="button"
              onClick={() => preset(pid)}
              className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-slate-200"
            >
              {PLANS[pid].name.replace("다잉클 ", "")} · {PLANS[pid].months}개월
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold text-zinc-500">열어 줄 과정</p>
        <div className="flex flex-wrap gap-2">
          {COURSE_IDS.map((c) => (
            <label key={c} className={`${pill(courses.includes(c))} cursor-pointer`}>
              <input
                type="checkbox"
                name="courses"
                value={c}
                checked={courses.includes(c)}
                onChange={() => toggle(c)}
                className="sr-only"
              />
              {courses.includes(c) ? "✓ " : ""}
              {COURSE_SHORT[c]}
            </label>
          ))}
          <label className={`${pill(trial)} cursor-pointer`}>
            <input
              type="checkbox"
              name="trial"
              checked={trial}
              onChange={(e) => {
                setTrial(e.target.checked);
                if (e.target.checked) setCourses(["bootcamp"]);
              }}
              className="sr-only"
            />
            🎁 무료 체험
          </label>
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold text-zinc-500">종료일</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <input
            type="date"
            name="until"
            value={until}
            onChange={(e) => setUntil(e.target.value)}
            required
            className="rounded-lg border border-slate-200 px-2 py-1"
          />
          {[1, 3, 6, 12].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setUntil(addMonths(until && until > today() ? until : today(), m))}
              className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-zinc-600"
            >
              +{m}개월
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-2.5">
        <p className="text-sm text-zinc-700">
          {courses.length === 0 ? (
            <span className="font-semibold text-red-600">과정을 하나 이상 골라 주세요</span>
          ) : (
            <>
              저장하면 <b>{planName(next, courses).replace("다잉클 ", "")}</b>
              {until && ` · ${until.replaceAll("-", ".")}까지`}
            </>
          )}
        </p>
        <SubmitButton disabled={courses.length === 0 || !until} className="rounded-lg bg-zinc-900 px-4 py-1.5 font-semibold text-white disabled:bg-zinc-300">
          저장
        </SubmitButton>
      </div>
    </form>
  );
}
