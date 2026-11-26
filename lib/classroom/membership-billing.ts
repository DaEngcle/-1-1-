import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";
import { chargeBilling, findPaymentByOrder, issueBillingKey, TossError } from "@/lib/toss";
import { MEMBERSHIP, addDays, isMembershipPlan, periodEndFrom } from "./membership";
import { isTrialPlan } from "./plans";
import { kstDate } from "./stats";

export type Subscription = {
  id: string;
  student_id: string;
  customer_key: string;
  billing_key: string | null;
  card_label: string | null;
  amount: number;
  status: "pending" | "active" | "past_due" | "ended";
  cancel_at_period_end: boolean;
  current_period_end: string | null;
  failed_count: number;
};

export type MembershipPayment = {
  id: string;
  amount: number;
  status: "pending" | "done" | "failed" | "cancelled";
  period_end: string | null;
  receipt_url: string | null;
  failure_message: string | null;
  paid_at: string | null;
  created_at: string;
};

const SUB_COLUMNS =
  "id, student_id, customer_key, billing_key, card_label, amount, status, cancel_at_period_end, current_period_end, failed_count";

const db = () => createServerSupabaseClient();

/** 살아 있는 구독(이용 중·결제 재시도 중) */
export async function liveSubscription(studentId: string): Promise<Subscription | null> {
  const { data, error } = await db()
    .from("membership_subscriptions")
    .select(SUB_COLUMNS)
    .eq("student_id", studentId)
    .in("status", ["active", "past_due"])
    .maybeSingle();
  if (error) console.error("구독 조회 실패:", error.message);
  return (data as Subscription | null) ?? null;
}

export async function paymentHistory(studentId: string): Promise<MembershipPayment[]> {
  const { data, error } = await db()
    .from("membership_payments")
    .select("id, amount, status, period_end, receipt_url, failure_message, paid_at, created_at")
    .eq("student_id", studentId)
    .in("status", ["done", "failed", "cancelled"])
    .order("created_at", { ascending: false })
    .limit(24);
  if (error) console.error("결제 내역 조회 실패:", error.message);
  return (data as MembershipPayment[] | null) ?? [];
}

type StudentRow = { id: string; name: string; plan: string | null; access_until: string | null };

/** 이미 웨비나 과정을 듣고 있어서 멤버십이 필요 없는 학생인지 (과정 수강생은 앱 기능이 다 열려 있다) */
export function hasActiveCoursePlan(s: { plan: string | null; access_until: string | null }) {
  if (!s.plan || isMembershipPlan(s.plan) || isTrialPlan(s.plan)) return false;
  return !s.access_until || s.access_until >= kstDate(new Date());
}

/** 무료 체험 중인지 (체험 중에 결제하면 체험 강의가 잠기므로 체험이 끝난 뒤 시작하게 한다) */
export function inActiveTrial(s: { plan: string | null; access_until: string | null }) {
  return isTrialPlan(s.plan) && Boolean(s.access_until && s.access_until >= kstDate(new Date()));
}

/** 카드 등록 전에 구독 줄을 만들고 customerKey를 돌려준다 */
export async function prepareSubscription(student: StudentRow): Promise<{ customerKey: string } | { error: string }> {
  if (hasActiveCoursePlan(student)) return { error: "이미 과정을 수강 중이라 앱 기능이 모두 열려 있어요." };
  if (inActiveTrial(student)) return { error: "무료 체험이 끝난 다음 날부터 멤버십을 시작할 수 있어요." };
  if (await liveSubscription(student.id)) return { error: "이미 멤버십을 이용 중이에요." };
  const supabase = db();
  const { data: pending } = await supabase
    .from("membership_subscriptions")
    .select("customer_key")
    .eq("student_id", student.id)
    .eq("status", "pending")
    .is("billing_key", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (pending) {
    // 가격이 바뀌었을 수 있으니 지금 가격으로 맞춘다
    await supabase.from("membership_subscriptions").update({ amount: MEMBERSHIP.price }).eq("customer_key", pending.customer_key);
    return { customerKey: pending.customer_key as string };
  }
  const { data, error } = await supabase
    .from("membership_subscriptions")
    .insert({ student_id: student.id, amount: MEMBERSHIP.price })
    .select("customer_key")
    .single();
  if (error || !data) {
    console.error("구독 준비 실패:", error?.message);
    return { error: "잠시 후 다시 시도해 주세요." };
  }
  return { customerKey: data.customer_key as string };
}

/** 응답 없는 결제를 '실패'로 볼 수 있을 만큼 지난 시간 (결제 요청 제한 시간 30초보다 충분히 길게) */
const STALE_PENDING_MS = 10 * 60 * 1000;

type ChargeResult = { ok: true } | { ok: false; unknown?: boolean; busy?: boolean; message: string };

function orderIdFor(subId: string, periodEnd: string, attempt: number) {
  return `dingle-${subId.slice(0, 8)}-${periodEnd.replaceAll("-", "")}-${attempt}`;
}

/** 이 기간 결제. 이미 결제됐으면 그대로 성공, 응답을 못 받은 결제가 있으면 먼저 토스에 확인한다 */
async function chargePeriod(sub: Subscription, studentName: string, periodEnd: string): Promise<ChargeResult> {
  if (!sub.billing_key) return { ok: false, message: "등록된 카드가 없어요." };
  const supabase = db();
  const { data: rows } = await supabase
    .from("membership_payments")
    .select("id, order_id, status, created_at")
    .eq("subscription_id", sub.id)
    .eq("period_end", periodEnd);
  const list = rows ?? [];
  if (list.some((r) => r.status === "done")) return { ok: true };

  const pendings = list.filter((r) => r.status === "pending");
  // 방금 시작한 결제가 있으면 다른 요청이 진행 중 → 결과가 나올 때까지 새 결제를 하지 않는다
  const staleBefore = Date.now() - STALE_PENDING_MS;
  if (pendings.some((p) => new Date(p.created_at as string).getTime() > staleBefore)) {
    return { ok: false, busy: true, message: "결제가 이미 진행 중이에요." };
  }
  for (const p of pendings) {
    let found;
    try {
      found = await findPaymentByOrder(p.order_id as string);
    } catch {
      return { ok: false, unknown: true, message: "이전 결제 결과를 아직 확인하지 못했어요." };
    }
    if (found?.status === "DONE") {
      await supabase
        .from("membership_payments")
        .update({ status: "done", payment_key: found.paymentKey, paid_at: found.approvedAt, receipt_url: found.receipt?.url ?? null })
        .eq("id", p.id);
      return { ok: true };
    }
    await supabase
      .from("membership_payments")
      .update({ status: "failed", failure_message: "결제가 완료되지 않음 (조회 확인)" })
      .eq("id", p.id);
  }

  const orderId = orderIdFor(sub.id, periodEnd, list.length + 1);
  const { data: row, error: insertError } = await supabase
    .from("membership_payments")
    .insert({ subscription_id: sub.id, student_id: sub.student_id, order_id: orderId, amount: sub.amount, period_end: periodEnd })
    .select("id")
    .single();
  // 같은 주문번호가 이미 있으면 다른 요청이 결제 중
  if (insertError || !row) return { ok: false, busy: true, message: "결제가 이미 진행 중이에요." };

  try {
    const paid = await chargeBilling({
      billingKey: sub.billing_key,
      customerKey: sub.customer_key,
      amount: sub.amount,
      orderId,
      orderName: `${MEMBERSHIP.name} 1개월`,
      customerName: studentName,
    });
    if (paid.status !== "DONE") throw new TossError(paid.status, `결제 상태: ${paid.status}`);
    await supabase
      .from("membership_payments")
      .update({ status: "done", payment_key: paid.paymentKey, paid_at: paid.approvedAt ?? new Date().toISOString(), receipt_url: paid.receipt?.url ?? null })
      .eq("id", row.id);
    return { ok: true };
  } catch (error) {
    const e = error instanceof TossError ? error : new TossError("UNKNOWN", String(error), true);
    if (e.unknown) {
      console.error("결제 응답 없음 (나중에 확인):", orderId, e.message);
      return { ok: false, unknown: true, message: "결제 결과를 확인하는 중이에요. 잠시 후 다시 확인해 주세요." };
    }
    await supabase.from("membership_payments").update({ status: "failed", failure_message: `${e.code}: ${e.message}`.slice(0, 300) }).eq("id", row.id);
    return { ok: false, message: e.message };
  }
}

/** 결제가 끝난 기간을 구독과 학생 수강권에 반영. 실패하면 false (다음 정리 때 다시 반영된다)
 *  학생 이용 마지막 날은 하루 여유를 둔다: 다음 결제는 기간 다음 날 새벽에 하므로 그 사이 잠기지 않게 */
async function applyPaid(sub: Subscription, periodEnd: string): Promise<boolean> {
  const supabase = db();
  const now = new Date().toISOString();
  const { error: subError } = await supabase
    .from("membership_subscriptions")
    .update({ status: "active", current_period_end: periodEnd, failed_count: 0, updated_at: now })
    .eq("id", sub.id);
  const { error: studentError } = await supabase
    .from("students")
    .update({ plan: MEMBERSHIP.plan, access_until: addDays(periodEnd, 1), approval: "approved", is_active: true })
    .eq("id", sub.student_id);
  if (subError || studentError) {
    console.error("멤버십 반영 실패:", sub.id, subError?.message, studentError?.message);
    return false;
  }
  return true;
}

/** 카드 등록 성공 → 빌링키 발급 → 첫 달 결제 → 바로 열기 */
export async function completeFirstPayment(studentId: string, customerKey: string, authKey: string): Promise<ChargeResult> {
  const supabase = db();
  const { data: subRow } = await supabase
    .from("membership_subscriptions")
    .select(SUB_COLUMNS)
    .eq("customer_key", customerKey)
    .eq("student_id", studentId)
    .maybeSingle();
  const sub = subRow as Subscription | null;
  if (!sub) return { ok: false, message: "구독 정보를 찾지 못했어요. 처음부터 다시 시도해 주세요." };
  if (sub.status === "active" || sub.status === "past_due") return { ok: true }; // 새로고침
  if (sub.status === "ended") return { ok: false, message: "끝난 구독이에요. 다시 신청해 주세요." };

  const { data: student } = await supabase.from("students").select("id, name, plan, access_until").eq("id", studentId).maybeSingle();
  if (!student) return { ok: false, message: "학생 정보를 찾지 못했어요." };
  if (hasActiveCoursePlan(student as StudentRow)) return { ok: false, message: "이미 과정을 수강 중이라 결제하지 않았어요." };
  if (inActiveTrial(student as StudentRow)) return { ok: false, message: "무료 체험이 끝난 다음 날부터 시작할 수 있어요. 결제하지 않았어요." };
  const other = await liveSubscription(studentId);
  if (other && other.id !== sub.id) return { ok: false, message: "이미 멤버십을 이용 중이에요." };

  if (!sub.billing_key) {
    let issued;
    try {
      issued = await issueBillingKey(authKey, customerKey);
    } catch (error) {
      const message = error instanceof TossError ? error.message : "카드 등록에 실패했어요.";
      console.error("빌링키 발급 실패:", message);
      return { ok: false, message };
    }
    // 빌링키는 한 번만 저장 (동시에 두 요청이 와도 하나만 이긴다)
    const { data: saved } = await supabase
      .from("membership_subscriptions")
      .update({ billing_key: issued.billingKey, card_label: issued.cardLabel, updated_at: new Date().toISOString() })
      .eq("id", sub.id)
      .is("billing_key", null)
      .select(SUB_COLUMNS)
      .maybeSingle();
    if (!saved) return { ok: false, busy: true, message: "결제가 이미 진행 중이에요. 잠시 후 내 멤버십 화면을 확인해 주세요." };
    Object.assign(sub, saved);
  }

  // 첫 결제는 구독당 한 번: 이미 시작된(또는 끝난) 첫 결제가 있으면 날짜가 바뀌었어도 그 기간으로 이어 간다
  const { data: earlier } = await supabase
    .from("membership_payments")
    .select("period_end")
    .eq("subscription_id", sub.id)
    .in("status", ["pending", "done"])
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  const periodEnd = (earlier?.period_end as string | undefined) ?? periodEndFrom(kstDate(new Date()));
  const result = await chargePeriod(sub, student.name as string, periodEnd);
  if (!result.ok) return result;
  await supabase.from("students").update({ terms_agreed_at: new Date().toISOString() }).eq("id", studentId);
  if (!(await applyPaid(sub, periodEnd))) {
    return { ok: false, unknown: true, message: "결제는 됐고 이용 권한을 여는 중이에요. 잠시 후 다시 확인해 주세요." };
  }
  return result;
}

/** 구독 종료: 카드 정보 지우고 학생은 무료회원으로 */
export async function endSubscription(subId: string) {
  const supabase = db();
  const now = new Date().toISOString();
  const { data: sub } = await supabase
    .from("membership_subscriptions")
    .update({ status: "ended", billing_key: null, ended_at: now, updated_at: now })
    .eq("id", subId)
    .neq("status", "ended")
    .select("student_id")
    .maybeSingle();
  if (!sub) return;
  const { data: student } = await supabase.from("students").select("plan").eq("id", sub.student_id).maybeSingle();
  if (isMembershipPlan(student?.plan as string | null)) {
    await supabase.from("students").update({ plan: null, access_until: null }).eq("id", sub.student_id);
  }
}

/** 학생이 해지: 이번 기간 끝까지는 이용, 다음 결제는 안 함. 결제 실패 중이면 바로 끝낸다 */
export async function cancelMembership(studentId: string) {
  const sub = await liveSubscription(studentId);
  if (!sub) return { error: "이용 중인 멤버십이 없어요." };
  if (sub.status === "past_due") {
    await endSubscription(sub.id);
    return { ended: true };
  }
  const now = new Date().toISOString();
  const { error } = await db()
    .from("membership_subscriptions")
    .update({ cancel_at_period_end: true, cancelled_at: now, updated_at: now })
    .eq("id", sub.id);
  if (error) return { error: "해지 중 오류가 났어요. 잠시 후 다시 시도해 주세요." };
  return { until: sub.current_period_end };
}

/** 해지 취소 (기간이 끝나기 전에만) */
export async function resumeMembership(studentId: string) {
  const sub = await liveSubscription(studentId);
  if (!sub || sub.status !== "active" || !sub.cancel_at_period_end) return { error: "다시 이어 갈 멤버십이 없어요." };
  const { error } = await db()
    .from("membership_subscriptions")
    .update({ cancel_at_period_end: false, cancelled_at: null, updated_at: new Date().toISOString() })
    .eq("id", sub.id);
  return error ? { error: "잠시 후 다시 시도해 주세요." } : { ok: true };
}

/** 첫 결제 때 응답을 못 받았거나 결제 후 반영에 실패한 건: 토스에 확인해서 결제됐으면 열어 준다 */
async function reconcileFirstPayments() {
  const supabase = db();
  const { data: paidButPending } = await supabase
    .from("membership_payments")
    .select(`period_end, membership_subscriptions!inner(${SUB_COLUMNS})`)
    .eq("status", "done")
    .eq("membership_subscriptions.status", "pending");
  for (const row of paidButPending ?? []) {
    await applyPaid((row as unknown as { membership_subscriptions: Subscription }).membership_subscriptions, row.period_end as string);
  }
  const before = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from("membership_payments")
    .select(`id, order_id, period_end, membership_subscriptions!inner(${SUB_COLUMNS})`)
    .eq("status", "pending")
    .lt("created_at", before)
    .eq("membership_subscriptions.status", "pending");
  for (const row of data ?? []) {
    const sub = (row as unknown as { membership_subscriptions: Subscription }).membership_subscriptions;
    let found;
    try {
      found = await findPaymentByOrder(row.order_id as string);
    } catch {
      continue; // 다음에 다시 확인
    }
    if (found?.status === "DONE") {
      await supabase
        .from("membership_payments")
        .update({ status: "done", payment_key: found.paymentKey, paid_at: found.approvedAt, receipt_url: found.receipt?.url ?? null })
        .eq("id", row.id);
      await applyPaid(sub, row.period_end as string);
    } else {
      await supabase.from("membership_payments").update({ status: "failed", failure_message: "결제가 완료되지 않음 (조회 확인)" }).eq("id", row.id);
    }
  }
}

/** 매일 새벽: 갱신 결제, 실패 재시도, 해지·실패한 구독 종료 */
export async function runMembershipBilling() {
  const today = kstDate(new Date());
  const supabase = db();
  await reconcileFirstPayments();
  const { data } = await supabase
    .from("membership_subscriptions")
    .select(`${SUB_COLUMNS}, students!inner(name)`)
    .in("status", ["active", "past_due"])
    .lt("current_period_end", today); // 다음 결제일 = 이용 마지막 날의 다음 날
  const summary = { renewed: 0, failed: 0, ended: 0, unknown: 0 };

  for (const row of data ?? []) {
    const sub = row as unknown as Subscription & { students: { name: string } };
    const end = sub.current_period_end as string;
    const graceOver = addDays(end, MEMBERSHIP.graceDays) < today;
    if (sub.cancel_at_period_end) {
      await endSubscription(sub.id);
      summary.ended++;
      continue;
    }
    if (sub.failed_count >= MEMBERSHIP.graceDays || graceOver || !sub.billing_key) {
      await endSubscription(sub.id);
      summary.ended++;
      continue;
    }
    const nextEnd = periodEndFrom(addDays(end, 1));
    const result = await chargePeriod(sub, sub.students.name, nextEnd);
    if (result.ok) {
      // 반영에 실패해도 다음 날 같은 기간을 다시 보면 '이미 결제됨'으로 반영만 한다
      if (await applyPaid(sub, nextEnd)) summary.renewed++;
      else summary.unknown++;
    } else if (result.unknown || result.busy) {
      summary.unknown++;
    } else {
      summary.failed++;
      await supabase
        .from("membership_subscriptions")
        .update({ status: "past_due", failed_count: sub.failed_count + 1, updated_at: new Date().toISOString() })
        .eq("id", sub.id);
      // 다시 시도하는 동안은 계속 이용할 수 있게
      await supabase.from("students").update({ access_until: addDays(end, MEMBERSHIP.graceDays) }).eq("id", sub.student_id);
    }
  }
  return summary;
}
