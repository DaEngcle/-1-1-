import Link from "next/link";
import { createServerSupabaseClient, type Student } from "@/lib/supabase";
import { approveStudent, mergeSignup, rejectStudent } from "./actions";
import { PLANS, isPlanId } from "@/lib/classroom/plans";
import { kstDate } from "@/lib/classroom/stats";
import { ConfirmButton } from "@/app/_ui/confirm-button";
import { CreateStudentForm } from "./student-forms";
import { headers } from "next/headers";
import {
  getRoster,
  nudgeMessage,
  STATUS_INFO,
  type RosterRow,
  type RosterStatus,
} from "@/lib/classroom/roster";
import { CopyButton } from "@/app/_ui/copy-button";
import { cardClass } from "@/app/_ui/styles";
import { requireTeacher } from "@/lib/classroom/dal";
import { SubmitButton } from "@/app/_ui/submit-button";

type Filter = "all" | "good" | "slow" | "risk" | "noaccount" | "expiring";
const FILTERS: Filter[] = [
  "all",
  "good",
  "slow",
  "risk",
  "noaccount",
  "expiring",
];
type SortKey = "attention" | "recent" | "shadowing" | "score" | "name";
const SORTS: { key: SortKey; label: string }[] = [
  { key: "attention", label: "챙길 학생 먼저" },
  { key: "recent", label: "최근 활동순" },
  { key: "shadowing", label: "이번 주 제출순" },
  { key: "score", label: "평균 점수순" },
  { key: "name", label: "이름순" },
];
const STATUS_ORDER: Record<RosterStatus, number> = {
  risk: 0,
  slow: 1,
  new: 2,
  good: 3,
  noaccount: 4,
};
const SORTERS: Record<SortKey, (a: RosterRow, b: RosterRow) => number> = {
  attention: (a, b) =>
    STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
    (b.daysInactive ?? 99) - (a.daysInactive ?? 99),
  recent: (a, b) => (a.daysInactive ?? 9999) - (b.daysInactive ?? 9999),
  shadowing: (a, b) => b.weekSubmissions - a.weekSubmissions,
  score: (a, b) => (b.avgScore30 ?? -1) - (a.avgScore30 ?? -1),
  name: (a, b) => a.name.localeCompare(b.name, "ko"),
};

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    filter?: string;
    sort?: string;
    cohort?: string;
    q?: string;
    merge_error?: string;
  }>;
}) {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("students")
    .select(
      "id, name, nickname, phone, memo, is_active, created_at, approval, plan, requested_plan, access_until, password_hash, login_code_hash, stage, source",
    )
    .order("is_active", { ascending: false })
    .order("name");
  type Row = Omit<Student, "login_code_hash" | "session_version"> & {
    nickname: string | null;
    approval: "lead" | "pending" | "approved" | "rejected";
    plan: string | null;
    password_hash: string | null;
    login_code_hash: string | null;
    stage: string;
    source: string | null;
    requested_plan: string | null;
    access_until: string | null;
  };
  const all = (data ?? []) as Row[];
  const pendingStudents = all.filter((s) => s.approval === "pending");
  // 세미나 링크(/free)로 가입한 무료회원: 승인 없이 들어와 있음. 수강생이면 여기서 수강권을 준다
  const freeMembers = all
    .filter(
      (s) =>
        s.approval === "approved" &&
        s.stage !== "enrolled" &&
        (s.password_hash || s.login_code_hash),
    )
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  // 시트·상담에서 미리 만든 카드 중 아직 계정이 없는 사람 (가입 신청과 이름이 같으면 합치기 제안)
  const noAccount = all.filter(
    (s) => s.approval !== "pending" && !s.password_hash && !s.login_code_hash,
  );
  const { data: cohortRows } = await supabase
    .from("cohorts")
    .select("id, name")
    .order("created_at");
  const cohorts = cohortRows ?? [];
  const cohortName = new Map(
    cohorts.map((c) => [c.id as string, c.name as string]),
  );
  const today = kstDate(new Date());
  const params = await searchParams;
  const filter = FILTERS.includes(params.filter as Filter)
    ? (params.filter as Filter)
    : "all";
  const sort = SORTS.some((o) => o.key === params.sort)
    ? (params.sort as SortKey)
    : "attention";
  const [roster, { data: pushRows }] = await Promise.all([
    getRoster(),
    supabase.from("push_subscriptions").select("student_id"),
  ]);
  const pushOn = new Set((pushRows ?? []).map((p) => p.student_id as string));
  const count = (st: RosterStatus) =>
    roster.filter((r) => r.status === st).length;
  const expiring = roster.filter(
    (r) => r.daysLeft != null && r.daysLeft >= 0 && r.daysLeft <= 14,
  );
  const cohortId = cohorts.some((c) => c.id === params.cohort)
    ? params.cohort
    : undefined;
  const inCohort = cohortId
    ? roster.filter((r) => r.cohortId === cohortId)
    : roster;
  const filtered =
    filter === "all"
      ? inCohort
      : filter === "expiring"
        ? inCohort.filter((r) => expiring.includes(r))
        : inCohort.filter((r) => r.status === filter);
  // 검색: 이름·닉네임·전화번호 (하이픈 없이도)
  const q = (params.q ?? "").trim();
  const qDigits = q.replace(/[^0-9]/g, "");
  const matchesQ = (
    name: string,
    nickname: string | null,
    phone: string | null,
  ) =>
    !q ||
    name.includes(q) ||
    (nickname ?? "").toLowerCase().includes(q.toLowerCase()) ||
    (qDigits.length >= 3 && (phone ?? "").includes(qDigits));
  const shown = [
    ...(q
      ? filtered.filter((r) => matchesQ(r.name, r.nickname, r.phone))
      : filtered),
  ].sort(SORTERS[sort]);
  // 학생 관리판 밖(무료회원·가입 신청·상담 카드)에서도 찾아준다
  const rosterIds = new Set(roster.map((r) => r.id));
  const elsewhere = q
    ? all.filter(
        (s) => !rosterIds.has(s.id) && matchesQ(s.name, s.nickname, s.phone),
      )
    : [];
  const host = (await headers()).get("host") ?? "dingle-classroom.vercel.app";
  const loginUrl = `https://${host}/login`;
  const href = (next: {
    filter?: string;
    sort?: string;
    cohort?: string | null;
  }) => {
    const q = new URLSearchParams({
      filter: next.filter ?? filter,
      sort: next.sort ?? sort,
    });
    const c = next.cohort === undefined ? cohortId : next.cohort;
    if (c) q.set("cohort", c);
    if (params.q) q.set("q", params.q);
    return `/teacher/students?${q}`;
  };
  return (
    <>
      <form className="flex gap-2" role="search">
        <input type="hidden" name="filter" value={filter} />
        <input type="hidden" name="sort" value={sort} />
        {cohortId && <input type="hidden" name="cohort" value={cohortId} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="🔍 학생 검색 (이름 · 닉네임 · 전화번호)"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white"
        >
          검색
        </button>
        {q && (
          <Link
            href={`/teacher/students?${new URLSearchParams({ filter, sort, ...(cohortId ? { cohort: cohortId } : {}) })}`}
            className="flex items-center rounded-xl border border-slate-200 bg-white px-3 text-sm text-zinc-600"
          >
            지우기
          </Link>
        )}
      </form>

      {q && (
        <section className={`${cardClass} flex flex-col gap-2`}>
          <p className="text-sm font-bold text-zinc-900">
            &lsquo;{q}&rsquo; 검색 결과: 관리 학생 {shown.length}명
            {elsewhere.length > 0 && ` · 그 외 ${elsewhere.length}명`}
          </p>
          {elsewhere.length > 0 && (
            <ul className="flex flex-col gap-1 text-sm">
              {elsewhere.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/teacher/students/${s.id}`}
                    className="font-semibold text-brand-700 hover:underline"
                  >
                    {s.name}
                  </Link>
                  <span className="text-xs text-zinc-500">{s.phone}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                    {s.approval === "pending"
                      ? "🙋 가입 신청"
                      : s.approval === "rejected"
                        ? "거절됨"
                        : s.password_hash || s.login_code_hash
                          ? "🎁 무료회원"
                          : "📋 상담·고객 카드"}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {shown.length === 0 && elsewhere.length === 0 && (
            <p className="text-xs text-zinc-500">
              찾는 학생이 없어요. 철자나 번호를 확인해 주세요.
            </p>
          )}
        </section>
      )}

      {params.merge_error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          ⚠️ 합쳐서 승인하지 못했어요: {params.merge_error}
        </p>
      )}

      {pendingStudents.length > 0 && (
        <section className={`${cardClass} border-brand-200 bg-brand-50/50`}>
          <h2 className="mb-1 font-bold text-zinc-900">
            🙋 가입 신청 ({pendingStudents.length})
          </h2>
          <p className="mb-3 text-xs text-zinc-500">
            결제·수강 등록을 확인한 뒤 승인해 주세요. 시작일부터 수강권 기간만큼
            이용할 수 있어요.
          </p>
          <ul className="flex flex-col gap-2">
            {pendingStudents.map((p) => {
              const matches = noAccount.filter(
                (s) => s.name.replace(/\s/g, "") === p.name.replace(/\s/g, ""),
              );
              const matchPlan = matches
                .map((m) => m.plan)
                .find((pl) => isPlanId(pl));
              const defaultPlan = isPlanId(p.plan)
                ? p.plan
                : isPlanId(p.requested_plan)
                  ? p.requested_plan
                  : isPlanId(matchPlan)
                    ? matchPlan
                    : "bootcamp";
              return (
                <li
                  key={p.id}
                  className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3"
                >
                  <div className="text-sm">
                    <b className="text-zinc-900">{p.name}</b>
                    <span className="ml-2 text-zinc-500">{p.phone}</span>
                    <span className="ml-2 text-xs text-zinc-400">
                      신청:{" "}
                      {isPlanId(p.requested_plan)
                        ? PLANS[p.requested_plan].name
                        : "-"}{" "}
                      ·{" "}
                      {new Date(p.created_at).toLocaleDateString("ko-KR", {
                        timeZone: "Asia/Seoul",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <form
                      action={approveStudent}
                      className="flex flex-wrap items-center gap-2"
                    >
                      <input type="hidden" name="id" value={p.id} />
                      <select
                        name="plan"
                        defaultValue={defaultPlan}
                        className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                      >
                        {Object.entries(PLANS).map(([id, plan]) => (
                          <option key={id} value={id}>
                            {plan.name} ({plan.months}개월)
                          </option>
                        ))}
                      </select>
                      <label className="flex items-center gap-1 text-xs text-zinc-500">
                        시작일
                        <input
                          type="date"
                          name="start"
                          defaultValue={today}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                        />
                      </label>
                      {p.access_until && (
                        <label className="flex items-center gap-1 text-xs text-zinc-500">
                          <input
                            type="checkbox"
                            name="keep"
                            value="1"
                            defaultChecked
                          />
                          기존 종료일({p.access_until}) 유지
                        </label>
                      )}
                      <SubmitButton className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-bold text-white">
                        {matches.length ? "새 학생으로 승인" : "승인"}
                      </SubmitButton>
                      {matches.map((m) => (
                        <span
                          key={m.id}
                          className="flex w-full flex-wrap items-center gap-2 rounded-lg bg-violet-50 px-2 py-1.5 text-xs text-violet-900"
                        >
                          <span>
                            📎 시트에서 가져온 <b>{m.name}</b> 카드가 있어요
                            {isPlanId(m.plan) &&
                              ` (예전: ${PLANS[m.plan].name.replace("다잉클 ", "")}`}
                            {m.access_until && ` ~${m.access_until}`}
                            {isPlanId(m.plan) && ")"}
                          </span>
                          {/* 위에서 고른 수강권·시작일로 합친다 */}
                          <SubmitButton
                            formAction={mergeSignup}
                            name="target_id"
                            value={m.id}
                            className="rounded-md bg-violet-600 px-2 py-1 font-bold text-white"
                          >
                            고른 수강권으로 이 카드와 합쳐서 승인
                          </SubmitButton>
                        </span>
                      ))}
                    </form>
                    <form action={rejectStudent}>
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmButton
                        message={`${p.name} 님의 가입 신청을 거절할까요?`}
                        className="text-xs text-red-600 underline"
                      >
                        거절
                      </ConfirmButton>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {freeMembers.length > 0 && (
        <details
          className={`${cardClass} border-[#f5c518] bg-[#fff8db]/60`}
          open={freeMembers.some((m) => m.created_at.slice(0, 10) >= today)}
        >
          <summary className="cursor-pointer font-bold text-zinc-900">
            🎁 무료회원 ({freeMembers.length}){" "}
            <span className="text-xs font-normal text-zinc-500">
              세미나 링크로 가입 · 수강생이면 수강권을 주세요
            </span>
          </summary>
          <ul className="mt-3 flex flex-col gap-2">
            {freeMembers.slice(0, 40).map((m) => (
              <li
                key={m.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center"
              >
                <div className="flex-1 text-sm">
                  <Link
                    href={`/teacher/students/${m.id}`}
                    className="font-bold text-zinc-900 hover:underline"
                  >
                    {m.name}
                  </Link>
                  <span className="ml-2 text-zinc-500">{m.phone}</span>
                  <span className="ml-2 text-xs text-zinc-400">
                    {m.source ?? "무료 가입"} ·{" "}
                    {new Date(m.created_at).toLocaleDateString("ko-KR", {
                      timeZone: "Asia/Seoul",
                    })}
                  </span>
                </div>
                <form
                  action={approveStudent}
                  className="flex flex-wrap items-center gap-2"
                >
                  <input type="hidden" name="id" value={m.id} />
                  <select
                    name="plan"
                    defaultValue="bootcamp"
                    className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                  >
                    {Object.entries(PLANS).map(([id, plan]) => (
                      <option key={id} value={id}>
                        {plan.name} ({plan.months}개월)
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    name="start"
                    defaultValue={today}
                    className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                  />
                  <SubmitButton className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-bold text-white">
                    수강권 주기
                  </SubmitButton>
                </form>
              </li>
            ))}
          </ul>
        </details>
      )}

      <section className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {[
          { key: "all", label: "전체 학생", value: roster.length, icon: "👥" },
          {
            key: "good",
            label: "잘 따라오는 중",
            value: count("good"),
            icon: "🟢",
          },
          { key: "slow", label: "느슨해짐", value: count("slow"), icon: "🟡" },
          { key: "risk", label: "이탈 위험", value: count("risk"), icon: "🔴" },
          {
            key: "noaccount",
            label: "가입 안내 필요",
            value: count("noaccount"),
            icon: "🔑",
          },
          {
            key: "expiring",
            label: "만료 2주 이내",
            value: expiring.length,
            icon: "⏳",
          },
        ].map((t) => (
          <Link
            key={t.key}
            href={href({ filter: t.key })}
            className={`${cardClass} flex flex-col gap-0.5 !p-3 ${
              filter === t.key
                ? "ring-2 ring-brand-400"
                : "hover:border-brand-300"
            }`}
          >
            <span className="text-xs text-zinc-500">
              {t.icon} {t.label}
            </span>
            <span className="text-2xl font-extrabold text-zinc-900">
              {t.value}
            </span>
          </Link>
        ))}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex flex-wrap gap-1">
          {SORTS.map((o) => (
            <Link
              key={o.key}
              href={href({ sort: o.key })}
              className={`rounded-full border px-3 py-1 ${
                sort === o.key
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {o.label}
            </Link>
          ))}
        </div>
        <Link
          href="/teacher/students/export"
          prefetch={false}
          className="text-xs font-semibold text-brand-700 underline"
        >
          ⬇ 엑셀(CSV)로 받기
        </Link>
      </div>

      {cohorts.length > 0 && (
        <div className="flex flex-wrap gap-1 text-xs">
          <Link
            href={href({ cohort: null })}
            className={`rounded-full border px-2.5 py-0.5 ${!cohortId ? "border-brand-400 bg-brand-50 text-brand-800" : "border-slate-200 text-slate-500"}`}
          >
            모든 기수
          </Link>
          {cohorts.map((c) => (
            <Link
              key={c.id}
              href={href({ cohort: c.id })}
              className={`rounded-full border px-2.5 py-0.5 ${
                cohortId === c.id
                  ? "border-brand-400 bg-brand-50 text-brand-800"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              👥 {c.name} ({roster.filter((r) => r.cohortId === c.id).length})
            </Link>
          ))}
        </div>
      )}

      <section className="flex flex-col gap-2">
        {shown.length === 0 && (
          <p className="text-sm text-zinc-500">해당하는 학생이 없어요.</p>
        )}
        {shown.map((r) => {
          const info = STATUS_INFO[r.status];
          return (
            <article
              key={r.id}
              className={`${cardClass} flex flex-col gap-3 ${r.isActive ? "" : "opacity-50"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Link
                      href={`/teacher/students/${r.id}`}
                      className="text-base font-bold text-zinc-900 hover:underline"
                    >
                      {r.name}
                    </Link>
                    {r.nickname && (
                      <span className="text-xs text-zinc-500">
                        ({r.nickname})
                      </span>
                    )}
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${info.tone}`}
                    >
                      {info.icon} {info.label}
                    </span>
                    {r.cohortId && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">
                        👥 {cohortName.get(r.cohortId)}
                      </span>
                    )}
                    {!r.isActive && (
                      <span className="text-xs text-zinc-500">비활성</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-500">
                    {isPlanId(r.plan) && (
                      <span
                        className={`rounded px-1.5 py-0.5 ${
                          r.daysLeft != null && r.daysLeft < 0
                            ? "bg-red-50 text-red-700"
                            : r.daysLeft != null && r.daysLeft <= 14
                              ? "bg-amber-50 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {PLANS[r.plan].name.replace("다잉클 ", "")}
                        {r.daysLeft != null &&
                          (r.daysLeft < 0 ? " · 만료" : ` · D-${r.daysLeft}`)}
                      </span>
                    )}
                    {r.levelPre != null && (
                      <span className="rounded bg-brand-100 px-1.5 py-0.5 text-brand-800">
                        Lv.{r.levelPre}
                        {r.levelPost != null && ` → ${r.levelPost}`}
                      </span>
                    )}
                    <span>
                      최근 활동:{" "}
                      {r.daysInactive == null
                        ? "없음"
                        : r.daysInactive === 0
                          ? "오늘"
                          : `${r.daysInactive}일 전`}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-zinc-400">최근 7일</span>
                  <span className="flex gap-0.5">
                    {r.week.map((on, i) => (
                      <span
                        key={i}
                        className={`h-3.5 w-3.5 rounded-sm ${on ? "bg-emerald-500" : "bg-slate-200"} ${
                          i === 6 ? "ring-1 ring-brand-400" : ""
                        }`}
                      />
                    ))}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center sm:grid-cols-6">
                {[
                  ["🎤 이번 주 제출", `${r.weekSubmissions}개`],
                  [
                    "🎤 쉐도잉 진도",
                    r.progress ? `${r.progress.submitPercent}%` : "-",
                  ],
                  [
                    "🎬 강의 수강",
                    r.progress ? `${r.progress.videoPercent}%` : "-",
                  ],
                  [
                    "🎯 평균 점수",
                    r.avgScore30 != null ? `${r.avgScore30}점` : "-",
                  ],
                  [
                    "🗓 출석률",
                    r.attendanceRate != null ? `${r.attendanceRate}%` : "-",
                  ],
                  ["📈 누적 제출", `${r.totalSubmissions}개`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 px-1 py-2">
                    <div className="text-[11px] text-zinc-500">{label}</div>
                    <div className="font-bold text-zinc-900">{value}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <CopyButton
                  text={nudgeMessage(r, loginUrl)}
                  label="💬 카톡 응원 메시지 복사"
                  className="rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-1.5 font-semibold text-brand-700"
                />
                {r.phone && (
                  <CopyButton
                    text={r.phone}
                    label={`📱 ${r.phone.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3")}`}
                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-zinc-600"
                  />
                )}
                {r.memo && <span className="text-zinc-500">📝 {r.memo}</span>}
                {pushOn.has(r.id) ? (
                  <Link
                    href={`/teacher/students/${r.id}#push`}
                    className="rounded-lg border border-brand-200 bg-white px-2.5 py-1.5 font-semibold text-brand-700"
                  >
                    🔔 알림 보내기
                  </Link>
                ) : (
                  <span className="text-zinc-400">🔕 알림 꺼짐</span>
                )}
                <Link
                  href={`/teacher/students/${r.id}`}
                  className="ml-auto font-semibold text-brand-700"
                >
                  자세히 →
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <details className={cardClass}>
        <summary className="cursor-pointer font-bold text-zinc-900">
          ➕ 학생 직접 등록 (코드 발급)
        </summary>
        <p className="mt-1 mb-3 text-xs text-zinc-500">
          학생이 직접 가입하기 어려울 때 사용해요. 등록하면 로그인 코드가 한 번
          나와요.
        </p>
        <CreateStudentForm />
      </details>
    </>
  );
}
