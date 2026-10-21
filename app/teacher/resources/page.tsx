import { headers } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";
import { cardClass, inputClass } from "@/app/_ui/styles";
import { CopyButton } from "@/app/_ui/copy-button";
import { ConfirmButton } from "@/app/_ui/confirm-button";
import { SubmitButton } from "@/app/_ui/submit-button";
import { ResourceUploadForm } from "./upload-form";
import { CoverButtons } from "./cover-buttons";
import { bookIcon, coverUrl } from "@/lib/classroom/resources";
import {
  addLinkResource,
  deleteResource,
  dismissRequest,
  grantAccess,
  setResourcePublished,
  updatePrice,
} from "./actions";
import { manwon } from "@/lib/classroom/price";

export default async function TeacherResourcesPage() {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  const [
    { data: rows },
    { data: downloads },
    { count: freeMembers },
    { data: requests },
    { data: grants },
  ] = await Promise.all([
    supabase
      .from("resources")
      .select("*")
      .order("sort_order")
      .order("created_at"),
    supabase
      .from("resource_downloads")
      .select("resource_id, student_id, created_at, students(name, phone, stage, plan)")
      .order("created_at", { ascending: false }),
    supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("approval", "approved")
      .neq("stage", "enrolled")
      .not("password_hash", "is", null),
    supabase
      .from("resource_requests")
      .select("resource_id, student_id, created_at, students(name, phone)")
      .order("created_at"),
    supabase.from("resource_access").select("resource_id, students(name)"),
  ]);
  const host = (await headers()).get("host") ?? "dingle-classroom.vercel.app";
  const freeUrl = `https://${host}/free`;
  type Who = {
    id: string;
    name: string;
    phone: string | null;
    member: string;
    count: number;
    last: string;
  };
  const stats = new Map<
    string,
    { total: number; people: Set<string>; who: Map<string, Who> }
  >();
  // 최신순으로 오므로 처음 본 날짜가 마지막으로 받은 날
  for (const d of downloads ?? []) {
    const s = stats.get(d.resource_id) ?? {
      total: 0,
      people: new Set<string>(),
      who: new Map<string, Who>(),
    };
    s.total++;
    if (d.student_id) {
      s.people.add(d.student_id);
      const st = d.students as unknown as {
        name: string;
        phone: string | null;
        stage: string | null;
        plan: string | null;
      } | null;
      const w = s.who.get(d.student_id) ?? {
        id: d.student_id,
        name: st?.name ?? "(지워진 학생)",
        phone: st?.phone ?? null,
        member: st?.stage === "enrolled" || st?.plan ? "수강생" : "무료회원",
        count: 0,
        last: d.created_at,
      };
      w.count++;
      s.who.set(d.student_id, w);
    }
    stats.set(d.resource_id, s);
  }

  return (
    <>
      <h1 className="text-xl font-bold text-zinc-900">🎁 자료실</h1>

      <section
        className={`${cardClass} flex flex-col gap-2 border-[#f5c518] bg-[#fff8db]`}
      >
        <h2 className="font-bold text-zinc-900">
          📣 웨비나·무료 자료 신청 링크
        </h2>
        <p className="text-sm text-zinc-700">
          이 주소를 웨비나 채팅·단톡방에 주세요. 가입하면 승인 없이 바로{" "}
          <b>무료회원</b>으로 들어와 자료를 받고, 강의 맛보기(Day 1~3)와
          레벨테스트를 할 수 있어요. 가입한 사람은 상담·고객 탭에 자동으로
          쌓여요.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <code className="rounded-lg bg-white px-2 py-1 text-sm">
            {freeUrl}
          </code>
          <CopyButton
            text={freeUrl}
            label="📋 링크 복사"
            className="rounded-lg bg-[#ffd23f] px-3 py-1.5 text-sm font-bold text-zinc-900"
          />
        </div>
        <p className="text-xs text-zinc-500">
          유입 경로를 나눠 보고 싶으면 뒤에 붙여 주세요. 예: {freeUrl}
          ?from=1021웨비나 · 지금까지 무료회원 {freeMembers ?? 0}명
        </p>
      </section>

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">
          ⬆ 자료 올리기 (PDF, 50MB까지)
        </h2>
        <ResourceUploadForm />
      </section>

      <section className={cardClass}>
        <h2 className="mb-1 font-bold text-zinc-900">
          🔗 링크 자료 추가 (노션 체크리스트 등)
        </h2>
        <p className="mb-2 text-xs text-zinc-500">
          노션 페이지는 &lsquo;공유 → 웹에 게시&rsquo;가 켜져 있어야 학생이 열
          수 있어요. 누가 몇 번 열었는지도 기록돼요.
        </p>
        <form action={addLinkResource} className="flex flex-col gap-2">
          <input
            name="title"
            required
            maxLength={80}
            placeholder="제목 (예: 호주 워홀 출국 준비 체크리스트)"
            className={inputClass}
          />
          <input
            name="description"
            maxLength={200}
            placeholder="한 줄 설명 (선택)"
            className={inputClass}
          />
          <input
            name="url"
            type="url"
            required
            placeholder="https://..."
            className={inputClass}
          />
          <SubmitButton className="self-start rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">
            링크 자료 추가
          </SubmitButton>
        </form>
      </section>

      <section className="flex flex-col gap-2">
        {(rows ?? []).length === 0 && (
          <p className="text-sm text-zinc-500">아직 올린 자료가 없어요.</p>
        )}
        {(rows ?? []).map((r, i) => {
          const s = stats.get(r.id);
          const cover = coverUrl(r.cover_path);
          return (
            <article
              key={r.id}
              className={`${cardClass} flex flex-col gap-2 ${r.is_published ? "" : "opacity-60"}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element -- Supabase 공개 표지
                    <img
                      src={cover}
                      alt=""
                      className="h-20 w-14 shrink-0 rounded-md object-cover shadow"
                    />
                  ) : (
                    <span className="flex h-20 w-14 shrink-0 items-center justify-center rounded-md bg-slate-100 text-center text-[10px] text-zinc-400">
                      표지 없음
                    </span>
                  )}
                  <div>
                    <p className="font-bold text-zinc-900">
                      {bookIcon(i)} {r.title}
                    </p>
                    {r.description && (
                      <p className="text-sm text-zinc-600">{r.description}</p>
                    )}
                    <p className="break-all text-xs text-zinc-400">
                      {r.link_url
                        ? `🔗 ${r.link_url}`
                        : `${r.file_name} · ${r.size_bytes ? `${(r.size_bytes / 1024 / 1024).toFixed(1)}MB` : ""}`}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">
                  ⬇ {s?.people.size ?? 0}명 · {s?.total ?? 0}회
                </span>
              </div>
              {s && s.who.size > 0 && (
                <details className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <summary className="cursor-pointer font-semibold text-brand-700">
                    👀 받아간 사람 {s.who.size}명 보기
                  </summary>
                  <ul className="mt-2 flex flex-col divide-y divide-slate-200">
                    {[...s.who.values()].map((w) => (
                      <li
                        key={w.id}
                        className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 py-1.5"
                      >
                        <span className="flex items-center gap-1.5">
                          <a
                            href={`/teacher/students/${w.id}`}
                            className="font-bold text-zinc-900 underline-offset-2 hover:underline"
                          >
                            {w.name}
                          </a>
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                              w.member === "수강생"
                                ? "bg-brand-50 text-brand-700"
                                : "bg-[#fff8db] text-amber-800"
                            }`}
                          >
                            {w.member}
                          </span>
                          {w.phone && (
                            <span className="text-xs text-zinc-500">{w.phone}</span>
                          )}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {w.count}회 · 마지막{" "}
                          {new Date(w.last).toLocaleDateString("ko-KR", {
                            timeZone: "Asia/Seoul",
                            month: "numeric",
                            day: "numeric",
                          })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <a
                  href={`/api/resources/${r.id}`}
                  className="font-semibold text-brand-700 underline"
                >
                  미리 받아보기
                </a>
                {r.link_url ? null : <CoverButtons resourceId={r.id} />}
                <form action={setResourcePublished}>
                  <input type="hidden" name="id" value={r.id} />
                  <input
                    type="hidden"
                    name="publish"
                    value={String(!r.is_published)}
                  />
                  <SubmitButton className="rounded-lg border border-slate-300 px-2.5 py-1">
                    {r.is_published ? "숨기기" : "다시 보이기"}
                  </SubmitButton>
                </form>
                <form action={deleteResource}>
                  <input type="hidden" name="id" value={r.id} />
                  <ConfirmButton
                    message={`'${r.title}' 자료를 지울까요?`}
                    className="text-red-600 underline"
                  >
                    삭제
                  </ConfirmButton>
                </form>
              </div>

              {!r.link_url && (
                <div className="flex flex-col gap-2 border-t border-slate-100 pt-2 text-xs">
                  <form
                    action={updatePrice}
                    className="flex flex-wrap items-center gap-1.5"
                  >
                    <input type="hidden" name="id" value={r.id} />
                    <span className="font-semibold text-zinc-700">💰 판매</span>
                    <input
                      name="list_price"
                      defaultValue={r.list_price ?? ""}
                      placeholder="정가"
                      inputMode="numeric"
                      className="w-24 rounded-lg border border-slate-200 px-2 py-1"
                    />
                    <span>→</span>
                    <input
                      name="price"
                      defaultValue={r.price ?? ""}
                      placeholder="판매가 (비우면 무료)"
                      inputMode="numeric"
                      className="w-36 rounded-lg border border-slate-200 px-2 py-1"
                    />
                    <SubmitButton className="rounded-lg border border-slate-300 px-2.5 py-1">
                      저장
                    </SubmitButton>
                    <span className="text-zinc-500">
                      {r.price
                        ? `유료 · ${manwon(r.price)}${r.preview_count ? ` · 미리보기 ${r.preview_count}쪽` : ""}`
                        : "무료 자료"}
                    </span>
                  </form>
                  {(requests ?? [])
                    .filter((q) => q.resource_id === r.id)
                    .map((q) => {
                      const who = q.students as unknown as {
                        name: string;
                        phone: string | null;
                      } | null;
                      return (
                        <div
                          key={q.student_id}
                          className="flex flex-wrap items-center gap-2 rounded-lg bg-[#fff8db] px-2 py-1.5"
                        >
                          <span>
                            🛒 <b>{who?.name}</b> {who?.phone} · 구매 신청{" "}
                            {new Date(q.created_at).toLocaleDateString(
                              "ko-KR",
                              { timeZone: "Asia/Seoul" },
                            )}
                          </span>
                          <form action={grantAccess}>
                            <input
                              type="hidden"
                              name="resource_id"
                              value={r.id}
                            />
                            <input
                              type="hidden"
                              name="student_id"
                              value={q.student_id}
                            />
                            <SubmitButton className="rounded-md bg-green-600 px-2 py-1 font-bold text-white">
                              결제 확인 · 열어주기
                            </SubmitButton>
                          </form>
                          <form action={dismissRequest}>
                            <input
                              type="hidden"
                              name="resource_id"
                              value={r.id}
                            />
                            <input
                              type="hidden"
                              name="student_id"
                              value={q.student_id}
                            />
                            <SubmitButton className="text-zinc-500 underline">
                              신청 지우기
                            </SubmitButton>
                          </form>
                        </div>
                      );
                    })}
                  {r.price && (
                    <p className="text-zinc-500">
                      ✅ 구매자{" "}
                      {
                        (grants ?? []).filter((g) => g.resource_id === r.id)
                          .length
                      }
                      명
                      {(grants ?? []).some((g) => g.resource_id === r.id) &&
                        `: ${(grants ?? [])
                          .filter((g) => g.resource_id === r.id)
                          .map(
                            (g) =>
                              (g.students as unknown as { name: string } | null)
                                ?.name,
                          )
                          .join(", ")}`}
                    </p>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </section>
    </>
  );
}
