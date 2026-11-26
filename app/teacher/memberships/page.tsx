import Link from "next/link";
import { ConfirmButton } from "@/app/_ui/confirm-button";
import { cardClass } from "@/app/_ui/styles";
import { requireTeacher } from "@/lib/classroom/dal";
import { MEMBERSHIP } from "@/lib/classroom/membership";
import { kstDate } from "@/lib/classroom/stats";
import { createServerSupabaseClient } from "@/lib/supabase";
import { isTossConfigured } from "@/lib/toss";
import { endMembership } from "./actions";

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
const STATUS: Record<string, string> = { active: "이용 중", past_due: "결제 실패(재시도)", ended: "종료", pending: "카드 등록 전" };

export default async function MembershipsPage() {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  const [{ data: subs }, { data: pays }] = await Promise.all([
    supabase
      .from("membership_subscriptions")
      .select("id, student_id, status, amount, card_label, current_period_end, cancel_at_period_end, failed_count, created_at, students!inner(name, phone)")
      .neq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("membership_payments")
      .select("id, amount, status, paid_at, created_at, failure_message, students!inner(name)")
      .neq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);
  type Sub = { id: string; student_id: string; status: string; amount: number; card_label: string | null; current_period_end: string | null; cancel_at_period_end: boolean; failed_count: number; students: { name: string; phone: string | null } };
  type Pay = { id: string; amount: number; status: string; paid_at: string | null; created_at: string; failure_message: string | null; students: { name: string } };
  const list = (subs ?? []) as unknown as Sub[];
  const live = list.filter((s) => s.status === "active" || s.status === "past_due");
  const monthly = live.filter((s) => !s.cancel_at_period_end).reduce((sum, s) => sum + s.amount, 0);
  const month = kstDate(new Date()).slice(0, 7);
  const paidThisMonth = ((pays ?? []) as unknown as Pay[])
    .filter((p) => p.status === "done" && p.paid_at && kstDate(new Date(p.paid_at)).slice(0, 7) === month)
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-zinc-900">💳 앱 멤버십</h1>
      <div className={`${cardClass} flex flex-col gap-1 text-sm text-zinc-700`}>
        <p>
          판매 상태: <b>{MEMBERSHIP.onSale ? "판매 중" : "준비 중 (학생에게 결제 버튼이 안 보임)"}</b> · 월 {won(MEMBERSHIP.price)} · 결제 키{" "}
          <b>{isTossConfigured() ? "설정됨" : "아직 없음"}</b>
        </p>
        <p>
          이용 중 <b>{live.length}명</b> · 다음 달 예상 결제 <b>{won(monthly)}</b> · 이번 달 결제 완료 <b>{won(paidThisMonth)}</b>
        </p>
        <p className="text-xs text-zinc-500">환불은 토스페이먼츠 상점관리자에서 결제 취소로 해 주세요. 아래 &apos;바로 종료&apos;는 다음 결제만 막아요.</p>
      </div>

      <section className={`${cardClass} overflow-x-auto p-0`}>
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-slate-50 text-xs text-zinc-500">
            <tr>
              <th className="p-2">학생</th><th className="p-2">상태</th><th className="p-2">이용 마지막 날</th><th className="p-2">금액</th><th className="p-2">카드</th><th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="p-2"><Link href={`/teacher/students/${s.student_id}`} className="font-semibold underline">{s.students.name}</Link></td>
                <td className="p-2">{STATUS[s.status] ?? s.status}{s.cancel_at_period_end && s.status !== "ended" ? " · 해지 예정" : ""}{s.failed_count ? ` · 실패 ${s.failed_count}회` : ""}</td>
                <td className="p-2">{s.current_period_end ?? "-"}</td>
                <td className="p-2">{won(s.amount)}</td>
                <td className="p-2 text-xs text-zinc-500">{s.card_label ?? "-"}</td>
                <td className="p-2">
                  {(s.status === "active" || s.status === "past_due") && (
                    <form action={endMembership}>
                      <input type="hidden" name="id" value={s.id} />
                      <ConfirmButton message={`${s.students.name} 학생 멤버십을 바로 끝낼까요? 다음 결제가 안 되고 무료회원이 돼요. (환불은 따로)`} className="rounded-lg border border-slate-200 px-2 py-1 text-xs">
                        바로 종료
                      </ConfirmButton>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr><td colSpan={6} className="p-4 text-center text-zinc-400">아직 멤버십 결제가 없어요.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <h2 className="text-lg font-extrabold text-zinc-900">최근 결제</h2>
      <ul className={`${cardClass} flex flex-col divide-y divide-slate-100 p-0 text-sm`}>
        {((pays ?? []) as unknown as Pay[]).map((p) => (
          <li key={p.id} className="flex justify-between gap-3 px-4 py-2">
            <span>{(p.paid_at ?? p.created_at).slice(0, 10)} · {p.students.name}</span>
            <span className={p.status === "done" ? "font-semibold" : "text-rose-600"} title={p.failure_message ?? ""}>
              {p.status === "done" ? won(p.amount) : p.status === "cancelled" ? "환불" : "실패"}
            </span>
          </li>
        ))}
        {!pays?.length && <li className="px-4 py-3 text-center text-zinc-400">없음</li>}
      </ul>
    </div>
  );
}
