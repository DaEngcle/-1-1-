import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";
import { COURSE_SHORT } from "@/lib/classroom/plans";
import {
  LOST_REASONS,
  PROFILE_SELECT,
  STAGES,
  isLostReason,
  isStage,
  stars,
  type Profile,
  type StageId,
} from "@/lib/classroom/profile";
import { cardClass, inputClass, primaryButtonClass } from "@/app/_ui/styles";
import { CopyButton } from "@/app/_ui/copy-button";
import { ConfirmButton } from "@/app/_ui/confirm-button";
import { ProfileFields } from "../_ui/profile-fields";
import { addCohort, addLead, deleteLead, updateFollowUp } from "./actions";
import { SubmitButton } from "@/app/_ui/submit-button";

type Person = Profile & {
  id: string;
  name: string;
  phone: string | null;
  approval: string;
  password_hash: string | null;
  login_code_hash: string | null;
};

type View = StageId | "all";
const VIEWS: View[] = ["consulted", "lead", "enrolled", "lost", "all"];
const small = inputClass.replace("text-base", "text-sm").replace("px-3 py-2", "px-2 py-1");

export default async function CrmPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; cohort?: string; q?: string }>;
}) {
  await requireTeacher();
  const params = await searchParams;
  const view: View = VIEWS.includes(params.view as View) ? (params.view as View) : "consulted";
  const q = (params.q ?? "").trim();
  const supabase = createServerSupabaseClient();
  const [{ data: peopleRows }, { data: cohortRows }, { data: noteRows }, { data: buyRows }] = await Promise.all([
    supabase
      .from("students")
      .select(`id, name, phone, approval, password_hash, login_code_hash, ${PROFILE_SELECT}`)
      .neq("approval", "rejected")
      .order("consulted_on", { ascending: false, nullsFirst: false })
      .order("name"),
    supabase.from("cohorts").select("id, name, course_id, starts_on").order("created_at"),
    supabase.from("teacher_notes").select("student_id, body, created_at").order("created_at", { ascending: false }),
    supabase.from("purchases").select("student_id, amount, product"),
  ]);
  // 가입 신청(pending) 중인 사람은 학생 탭에서 처리하므로 여기선 뺀다
  const people = ((peopleRows ?? []) as unknown as Person[]).filter((p) => p.approval !== "pending");
  const cohorts = cohortRows ?? [];
  const cohortName = new Map(cohorts.map((c) => [c.id as string, c.name as string]));
  const lastNote = new Map<string, string>();
  for (const n of noteRows ?? []) if (!lastNote.has(n.student_id)) lastNote.set(n.student_id, n.body);
  const paid = new Map<string, { total: number; products: string[] }>();
  for (const b of buyRows ?? []) {
    if (!b.student_id) continue;
    const cur = paid.get(b.student_id) ?? { total: 0, products: [] };
    cur.total += Number(b.amount ?? 0);
    if (b.product && !cur.products.includes(b.product)) cur.products.push(b.product);
    paid.set(b.student_id, cur);
  }

  // ── 분석: 단계별 수, 전환율, 미등록 사유, 유입 경로별 전환 ──
  const byStage = (s: StageId) => people.filter((p) => p.stage === s).length;
  const decided = byStage("enrolled") + byStage("consulted") + byStage("lost");
  const conversion = decided ? Math.round((byStage("enrolled") / decided) * 100) : 0;
  const notEnrolled = people.filter((p) => p.stage === "consulted" || p.stage === "lost");
  const reasonCount = new Map<string, number>();
  for (const p of notEnrolled) {
    const k = isLostReason(p.lost_reason) ? p.lost_reason : "none";
    reasonCount.set(k, (reasonCount.get(k) ?? 0) + 1);
  }
  const sources = new Map<string, { all: number; enrolled: number }>();
  for (const p of people) {
    const k = p.source?.trim() || "모름";
    const cur = sources.get(k) ?? { all: 0, enrolled: 0 };
    cur.all++;
    if (p.stage === "enrolled") cur.enrolled++;
    sources.set(k, cur);
  }
  const hot = notEnrolled.filter((p) => (p.buy_probability ?? 0) >= 70);

  let shown = view === "all" ? people : people.filter((p) => p.stage === view);
  if (params.cohort) shown = shown.filter((p) => p.cohort_id === params.cohort);
  if (q) shown = shown.filter((p) => p.name.includes(q) || (p.phone ?? "").includes(q.replace(/-/g, "")));
  if (view === "consulted") shown = [...shown].sort((a, b) => (b.buy_probability ?? -1) - (a.buy_probability ?? -1));

  const href = (next: { view?: string; cohort?: string | null }) => {
    const sp = new URLSearchParams({ view: next.view ?? view });
    const c = next.cohort === undefined ? params.cohort : next.cohort;
    if (c) sp.set("cohort", c);
    if (q) sp.set("q", q);
    return `/teacher/crm?${sp}`;
  };

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-zinc-900">상담 · 고객 관리</h1>
        <p className="text-xs text-zinc-500">
          상담한 사람부터 등록한 학생까지 한 곳에서 봐요. 시트·메모에 있던 정보는 이미 옮겨 두었어요.
        </p>
      </div>

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {(["lead", "consulted", "enrolled", "lost"] as StageId[]).map((s) => (
          <Link
            key={s}
            href={href({ view: s })}
            className={`${cardClass} flex flex-col gap-0.5 !p-3 ${view === s ? "ring-2 ring-brand-400" : "hover:border-brand-300"}`}
          >
            <span className="text-xs text-zinc-500">
              {STAGES[s].icon} {STAGES[s].label}
            </span>
            <span className="text-2xl font-extrabold text-zinc-900">{byStage(s)}</span>
          </Link>
        ))}
        <div className={`${cardClass} col-span-2 flex flex-col gap-0.5 !p-3 sm:col-span-1`}>
          <span className="text-xs text-zinc-500">📈 상담 → 등록 전환율</span>
          <span className="text-2xl font-extrabold text-brand-700">{conversion}%</span>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className={cardClass}>
          <h2 className="mb-2 font-bold text-zinc-900">🤔 왜 등록 안 했을까?</h2>
          <ul className="flex flex-col gap-1.5 text-sm">
            {[...reasonCount.entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([k, n]) => (
                <li key={k} className="flex items-center gap-2">
                  <span className="w-40 shrink-0 text-zinc-700">
                    {k === "none" ? "❔ 사유 아직 안 적음" : LOST_REASONS[k as keyof typeof LOST_REASONS].label}
                  </span>
                  <span className="h-2 rounded-full bg-amber-300" style={{ width: `${(n / Math.max(1, notEnrolled.length)) * 100}%` }} />
                  <span className="text-xs text-zinc-500">{n}명</span>
                </li>
              ))}
          </ul>
          <p className="mt-2 text-xs text-zinc-500">
            카드에서 사유를 골라두면 그 사유에 맞는 선물 메시지가 자동으로 만들어져요.
          </p>
        </div>
        <div className={cardClass}>
          <h2 className="mb-2 font-bold text-zinc-900">📣 어디서 온 사람이 많이 등록할까?</h2>
          <ul className="flex flex-col gap-1 text-sm">
            {[...sources.entries()]
              .sort((a, b) => b[1].all - a[1].all)
              .slice(0, 8)
              .map(([k, v]) => (
                <li key={k} className="flex justify-between gap-2">
                  <span className="truncate text-zinc-700">{k}</span>
                  <span className="shrink-0 text-xs text-zinc-500">
                    {v.enrolled}/{v.all}명 등록 · <b>{Math.round((v.enrolled / v.all) * 100)}%</b>
                  </span>
                </li>
              ))}
          </ul>
          {hot.length > 0 && (
            <p className="mt-2 rounded-lg bg-brand-50 px-2 py-1.5 text-xs text-brand-800">
              🔥 등록 가능성 70% 이상인데 아직 미등록: <b>{hot.map((p) => p.name).join(", ")}</b>
            </p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1 text-sm">
          {VIEWS.map((v) => (
            <Link
              key={v}
              href={href({ view: v })}
              className={`rounded-full border px-3 py-1 ${
                view === v ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {v === "all" ? "전체" : STAGES[v].label}
            </Link>
          ))}
          <form className="ml-auto flex gap-1">
            <input type="hidden" name="view" value={view} />
            {params.cohort && <input type="hidden" name="cohort" value={params.cohort} />}
            <input name="q" defaultValue={q} placeholder="이름·전화 검색" className={`${small} w-32`} />
          </form>
        </div>
        <div className="flex flex-wrap gap-1 text-xs">
          <Link
            href={href({ cohort: null })}
            className={`rounded-full border px-2.5 py-0.5 ${!params.cohort ? "border-brand-400 bg-brand-50 text-brand-800" : "border-slate-200 text-slate-500"}`}
          >
            모든 기수
          </Link>
          {cohorts.map((c) => (
            <Link
              key={c.id}
              href={href({ cohort: c.id })}
              className={`rounded-full border px-2.5 py-0.5 ${
                params.cohort === c.id ? "border-brand-400 bg-brand-50 text-brand-800" : "border-slate-200 text-slate-500"
              }`}
            >
              👥 {c.name} ({people.filter((p) => p.cohort_id === c.id).length})
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        {shown.length === 0 && <p className="text-sm text-zinc-500">해당하는 사람이 없어요.</p>}
        {shown.map((p) => {
          const stage = isStage(p.stage) ? p.stage : "consulted";
          const reason = isLostReason(p.lost_reason) ? p.lost_reason : null;
          const hasAccount = Boolean(p.password_hash || p.login_code_hash);
          const pay = paid.get(p.id);
          const facts = [
            p.age && `${p.age}세`,
            p.departure && `✈️ ${p.departure}`,
            p.korea_city && `🏠 ${p.korea_city}`,
            p.aus_city && `🇦🇺 ${p.aus_city}`,
            p.current_job && `💼 ${p.current_job}`,
            p.major && `🎓 ${p.major}`,
            p.hope_job && `🎯 ${p.hope_job}`,
            p.mbti,
          ].filter(Boolean);
          return (
            <article key={p.id} className={`${cardClass} flex flex-col gap-2`}>
              <div className="flex flex-wrap items-center gap-1.5">
                <Link href={`/teacher/students/${p.id}`} className="text-base font-bold text-zinc-900 hover:underline">
                  {p.name}
                </Link>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${STAGES[stage].tone}`}>
                  {STAGES[stage].icon} {STAGES[stage].label}
                </span>
                {p.cohort_id && (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">
                    👥 {cohortName.get(p.cohort_id)}
                  </span>
                )}
                {stage !== "enrolled" && hasAccount && p.approval === "approved" && (
                  <span className="rounded bg-[#ffd23f] px-1.5 py-0.5 text-xs font-semibold text-zinc-900">🎁 무료회원</span>
                )}
                {stage === "enrolled" && !hasAccount && (
                  <span className="rounded bg-violet-50 px-1.5 py-0.5 text-xs text-violet-800">🔑 아직 가입 전</span>
                )}
                {p.test_grade && <span className="rounded bg-brand-100 px-1.5 py-0.5 text-xs text-brand-800">테스트 {p.test_grade}</span>}
                {p.buy_probability != null && stage !== "enrolled" && (
                  <span className="text-xs text-zinc-500">🔮 {p.buy_probability}%</span>
                )}
                {p.consulted_on && <span className="ml-auto text-xs text-zinc-400">상담 {p.consulted_on}</span>}
              </div>
              {facts.length > 0 && <p className="text-xs text-zinc-600">{facts.join(" · ")}</p>}
              {(p.star_speaking != null || p.star_listening != null || p.star_confidence != null) && (
                <p className="text-xs text-amber-600">
                  🗣 {stars(p.star_speaking)} · 👂 {stars(p.star_listening)} · 💪 {stars(p.star_confidence)}
                </p>
              )}
              {pay && (
                <p className="text-xs text-zinc-500">
                  💳 {pay.products.join(", ")} · {pay.total.toLocaleString("ko-KR")}원
                </p>
              )}
              {lastNote.get(p.id) && (
                <p className="line-clamp-2 rounded-lg bg-slate-50 px-2 py-1 text-xs text-zinc-600">📝 {lastNote.get(p.id)}</p>
              )}

              <form action={updateFollowUp} className="flex flex-wrap items-center gap-1.5 text-xs">
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="toggles" value="1" />
                <select name="stage" defaultValue={stage} className={small}>
                  {(Object.keys(STAGES) as StageId[]).map((s) => (
                    <option key={s} value={s}>
                      {STAGES[s].label}
                    </option>
                  ))}
                </select>
                {stage !== "enrolled" && (
                  <select name="lost_reason" defaultValue={reason ?? ""} className={small}>
                    <option value="">미등록 사유 고르기</option>
                    {Object.entries(LOST_REASONS).map(([k, r]) => (
                      <option key={k} value={k}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                )}
                {(
                  [
                    ["called", "📞 통화함"],
                    ["link_sent", "🔗 링크 보냄"],
                    ["free_vod", "🎬 무료 VOD"],
                  ] as const
                ).map(([k, label]) => (
                  <label key={k} className="flex items-center gap-1 text-zinc-600">
                    <input type="checkbox" name={k} value="true" defaultChecked={p[k]} />
                    {label}
                  </label>
                ))}
                {stage !== "enrolled" && (
                  <input
                    name="gift_sent"
                    defaultValue={p.gift_sent ?? ""}
                    placeholder="보낸 선물 (예: 체크리스트 PDF)"
                    className={`${small} w-44`}
                  />
                )}
                <SubmitButton className="rounded-lg bg-brand-600 px-2.5 py-1 font-bold text-white">
                  저장
                </SubmitButton>
              </form>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {stage !== "enrolled" && (
                  <CopyButton
                    text={LOST_REASONS[reason ?? "other"].message(p.name)}
                    label={`🎁 ${reason ? LOST_REASONS[reason].gift || "안부" : "안부"} 메시지 복사`}
                    className="rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-1.5 font-semibold text-brand-700"
                  />
                )}
                {p.phone && (
                  <CopyButton
                    text={p.phone}
                    label={`📱 ${p.phone.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3")}`}
                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-zinc-600"
                  />
                )}
                <Link href={`/teacher/students/${p.id}`} className="ml-auto font-semibold text-brand-700">
                  프로필·메모 →
                </Link>
                {p.approval === "lead" && (
                  <form action={deleteLead}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmButton message={`${p.name} 님의 상담 카드를 지울까요?`} className="text-red-500 underline">
                      삭제
                    </ConfirmButton>
                  </form>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <details className={cardClass}>
        <summary className="cursor-pointer font-bold text-zinc-900">➕ 상담 카드 추가 (레벨테스트 상담할 때)</summary>
        <form action={addLead} className="mt-3 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-xs text-zinc-500">
              이름 *
              <input name="name" required maxLength={40} className={small} />
            </label>
            <label className="flex flex-col gap-1 text-xs text-zinc-500">
              📱 전화번호
              <input name="phone" inputMode="tel" placeholder="010-0000-0000" className={small} />
            </label>
            <label className="flex flex-col gap-1 text-xs text-zinc-500">
              단계
              <select name="stage" defaultValue="consulted" className={small}>
                {(Object.keys(STAGES) as StageId[]).map((s) => (
                  <option key={s} value={s}>
                    {STAGES[s].label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ProfileFields cohorts={cohorts.map((c) => ({ id: c.id, name: c.name }))} />
          <label className="flex flex-col gap-1 text-xs text-zinc-500">
            📝 상담 메모 (노트앱 내용 그대로 붙여넣어도 돼요)
            <textarea name="note" rows={4} maxLength={2000} className={small} />
          </label>
          <SubmitButton className={`${primaryButtonClass} self-start`}>
            상담 카드 저장
          </SubmitButton>
        </form>
      </details>

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">👥 기수</h2>
        <ul className="mb-3 flex flex-col gap-1 text-sm">
          {cohorts.map((c) => (
            <li key={c.id} className="flex justify-between gap-2">
              <Link href={href({ view: "all", cohort: c.id })} className="text-zinc-800 hover:underline">
                {c.name}
                {c.course_id && <span className="ml-1 text-xs text-zinc-400">{COURSE_SHORT[c.course_id]}</span>}
              </Link>
              <span className="text-xs text-zinc-500">
                {c.starts_on && `${c.starts_on} 시작 · `}
                {people.filter((p) => p.cohort_id === c.id).length}명
              </span>
            </li>
          ))}
        </ul>
        <form action={addCohort} className="flex flex-wrap items-center gap-1.5 text-xs">
          <input name="name" required maxLength={40} placeholder="예: 부트캠프 5기" className={`${small} w-36`} />
          <select name="course_id" defaultValue="bootcamp" className={small}>
            <option value="">과정 없음</option>
            {Object.entries(COURSE_SHORT).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <input type="date" name="starts_on" className={small} />
          <SubmitButton className="rounded-lg bg-brand-600 px-2.5 py-1 font-bold text-white">
            기수 만들기
          </SubmitButton>
        </form>
        <p className="mt-2 text-xs text-zinc-500">학생을 기수에 넣으려면 학생 프로필에서 ‘기수’를 골라주세요.</p>
      </section>
    </>
  );
}
