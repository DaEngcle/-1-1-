import Link from "next/link";
import { requireStudent } from "@/lib/classroom/dal";
import { MEMBERSHIP, addDays, koDay } from "@/lib/classroom/membership";
import { hasActiveCoursePlan, liveSubscription, paymentHistory } from "@/lib/classroom/membership-billing";
import { ConfirmButton } from "@/app/_ui/confirm-button";
import { SubmitButton } from "@/app/_ui/submit-button";
import { BusinessFooter } from "@/app/_ui/legal";
import { cardClass } from "@/app/_ui/styles";
import { cancelAction, resumeAction } from "./actions";

const NOTICE: Record<string, [string, string]> = {
  welcome: ["🎉 멤버십이 시작됐어요! 지금 바로 모든 앱 기능을 쓸 수 있어요.", "bg-emerald-50 text-emerald-800"],
  checking: ["결제 결과를 확인하는 중이에요. 몇 분 뒤 다시 열어 주세요. 두 번 결제되지 않으니 다시 결제하지 마세요.", "bg-amber-50 text-amber-800"],
  cancelled: ["해지했어요. 다음 결제는 되지 않고, 남은 기간까지는 계속 쓸 수 있어요.", "bg-slate-100 text-zinc-700"],
  ended: ["멤버십을 끝냈어요. 다음 결제는 되지 않아요.", "bg-slate-100 text-zinc-700"],
  resumed: ["해지를 취소했어요. 멤버십이 그대로 이어져요.", "bg-emerald-50 text-emerald-800"],
};

function won(n: number) {
  return `${n.toLocaleString("ko-KR")}원`;
}

export default async function MembershipPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const student = await requireStudent();
  const [sub, payments] = await Promise.all([liveSubscription(student.id), paymentHistory(student.id)]);
  const notice = Object.keys(NOTICE).find((k) => params[k]);
  const course = hasActiveCoursePlan({ plan: student.plan, access_until: student.accessUntil });

  return (
    <>
      <Link href="/student/more" className="text-sm text-zinc-600 underline">
        ← 더보기
      </Link>
      <h1 className="text-xl font-extrabold text-zinc-900">💳 내 멤버십</h1>

      {notice && <p className={`rounded-2xl p-4 text-sm font-semibold ${NOTICE[notice][1]}`}>{NOTICE[notice][0]}</p>}
      {params.error && <p className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{params.error.slice(0, 120)}</p>}

      {sub ? (
        <section className={`${cardClass} flex flex-col gap-3`}>
          <div className="flex items-center justify-between">
            <p className="text-lg font-extrabold text-zinc-900">{MEMBERSHIP.name}</p>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                sub.status === "past_due" ? "bg-rose-100 text-rose-700" : sub.cancel_at_period_end ? "bg-slate-100 text-zinc-600" : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {sub.status === "past_due" ? "결제 실패" : sub.cancel_at_period_end ? "해지 예정" : "이용 중"}
            </span>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-zinc-500">월 요금</dt>
            <dd className="font-semibold text-zinc-900">{won(sub.amount)}</dd>
            <dt className="text-zinc-500">결제 카드</dt>
            <dd className="font-semibold text-zinc-900">{sub.card_label ?? "등록된 카드"}</dd>
            {sub.current_period_end && (
              <>
                <dt className="text-zinc-500">이용 기간</dt>
                <dd className="font-semibold text-zinc-900">{koDay(sub.current_period_end)}까지</dd>
                <dt className="text-zinc-500">다음 결제</dt>
                <dd className="font-semibold text-zinc-900">
                  {sub.cancel_at_period_end ? "없음 (해지 예정)" : `${koDay(addDays(sub.current_period_end, 1))} · ${won(sub.amount)}`}
                </dd>
              </>
            )}
          </dl>
          {sub.status === "past_due" && (
            <p className="rounded-xl bg-rose-50 p-3 text-xs leading-relaxed text-rose-700">
              카드 결제가 실패했어요. {MEMBERSHIP.graceDays}일 동안 매일 다시 시도해요. 카드 한도·잔액을 확인해 주세요. 계속 실패하면 멤버십이 끝나요.
            </p>
          )}
          {sub.cancel_at_period_end ? (
            <form action={resumeAction}>
              <SubmitButton className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white">해지 취소하고 계속 이용하기</SubmitButton>
            </form>
          ) : (
            <form action={cancelAction}>
              <ConfirmButton
                message={
                  sub.status === "past_due"
                    ? "멤버십을 지금 끝낼까요? 다음 결제 시도는 하지 않아요."
                    : `해지할까요? 다음 결제는 되지 않고, ${sub.current_period_end ? koDay(sub.current_period_end) : "이번 기간"}까지는 계속 쓸 수 있어요.`
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-zinc-600"
              >
                멤버십 해지하기
              </ConfirmButton>
            </form>
          )}
          <p className="text-[11px] leading-relaxed text-zinc-400">
            환불은 <Link href="/terms#refund" className="underline">환불 규정</Link>에 따라 카카오톡 채널로 요청해 주세요.
          </p>
        </section>
      ) : course ? (
        <section className={`${cardClass} text-sm text-zinc-700`}>과정 수강 중이라 앱 기능이 모두 열려 있어요. 멤버십은 필요 없어요.</section>
      ) : (
        <section className={`${cardClass} flex flex-col gap-3 text-sm text-zinc-700`}>
          <p>지금은 무료회원이에요. 앱 멤버십을 시작하면 AI 면접, 상황극, 보카 전체를 쓸 수 있어요.</p>
          <Link href="/subscribe" className="rounded-xl bg-brand-600 px-4 py-3 text-center font-bold text-white">
            월 {won(MEMBERSHIP.price)} 멤버십 보기
          </Link>
        </section>
      )}

      {payments.length > 0 && (
        <>
          <h2 className="text-lg font-extrabold text-zinc-900">결제 내역</h2>
          <ul className={`${cardClass} flex flex-col divide-y divide-slate-100 p-0`}>
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <div className="flex flex-col">
                  <span className="font-semibold text-zinc-900">{(p.paid_at ?? p.created_at).slice(0, 10)}</span>
                  <span className="text-xs text-zinc-500">
                    {p.status === "done" ? (p.period_end ? `${koDay(p.period_end)}까지 이용` : "결제 완료") : p.status === "cancelled" ? "환불됨" : "결제 실패"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={p.status === "done" ? "font-bold text-zinc-900" : "text-zinc-400 line-through"}>{won(p.amount)}</span>
                  {p.receipt_url && (
                    <a href={p.receipt_url} target="_blank" rel="noopener" className="text-xs text-brand-700 underline">
                      영수증
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <BusinessFooter className="mt-4" />
    </>
  );
}
