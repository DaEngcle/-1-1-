import "server-only";

// 토스페이먼츠 자동결제(빌링) API. 시크릿 키는 서버 환경변수에만 있다
const API = "https://api.tosspayments.com/v1";

export function isTossConfigured() {
  return Boolean(process.env.TOSS_SECRET_KEY && process.env.TOSS_CLIENT_KEY);
}

export function tossClientKey() {
  return process.env.TOSS_CLIENT_KEY ?? "";
}

export class TossError extends Error {
  constructor(
    public code: string,
    message: string,
    /** 응답을 못 받음 (결제가 됐는지 모름) */
    public unknown = false,
  ) {
    super(message);
  }
}

async function call<T>(path: string, init: { method: "GET" | "POST"; body?: unknown; idempotencyKey?: string }): Promise<T> {
  const secret = process.env.TOSS_SECRET_KEY;
  if (!secret) throw new TossError("NOT_CONFIGURED", "결제 키가 설정되지 않았어요.");
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      method: init.method,
      headers: {
        Authorization: `Basic ${Buffer.from(`${secret}:`).toString("base64")}`,
        "Content-Type": "application/json",
        ...(init.idempotencyKey ? { "Idempotency-Key": init.idempotencyKey } : {}),
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
      signal: AbortSignal.timeout(30_000),
      cache: "no-store",
    });
  } catch (error) {
    throw new TossError("NETWORK", `결제 서버 응답 없음: ${String(error)}`, true);
  }
  const data = (await res.json().catch(() => null)) as (T & { code?: string; message?: string }) | null;
  if (!res.ok || !data) {
    // 5xx는 결제가 됐는지 알 수 없다 → 나중에 주문번호로 확인
    throw new TossError(data?.code ?? `HTTP_${res.status}`, data?.message ?? "결제 서버 오류", res.status >= 500);
  }
  return data;
}

export type TossPayment = {
  paymentKey: string;
  orderId: string;
  status: string;
  totalAmount: number;
  approvedAt: string | null;
  receipt?: { url?: string } | null;
};

/** 카드 등록 후 받은 authKey로 빌링키 발급 */
export async function issueBillingKey(authKey: string, customerKey: string) {
  const data = await call<{
    billingKey: string;
    cardCompany?: string;
    cardNumber?: string;
    card?: { number?: string; issuerCode?: string };
  }>("/billing/authorizations/issue", { method: "POST", body: { authKey, customerKey } });
  const number = data.cardNumber ?? data.card?.number ?? "";
  const last4 = number.replace(/[^0-9*]/g, "").slice(-4);
  return { billingKey: data.billingKey, cardLabel: [data.cardCompany, last4].filter(Boolean).join(" ") || "등록된 카드" };
}

/** 빌링키로 결제 */
export async function chargeBilling(params: {
  billingKey: string;
  customerKey: string;
  amount: number;
  orderId: string;
  orderName: string;
  customerName: string;
}) {
  return call<TossPayment>(`/billing/${encodeURIComponent(params.billingKey)}`, {
    method: "POST",
    idempotencyKey: params.orderId,
    body: {
      customerKey: params.customerKey,
      amount: params.amount,
      orderId: params.orderId,
      orderName: params.orderName,
      customerName: params.customerName,
    },
  });
}

/** 주문번호로 결제 조회 (응답을 못 받은 결제 확인용). 없으면 null */
export async function findPaymentByOrder(orderId: string): Promise<TossPayment | null> {
  try {
    return await call<TossPayment>(`/payments/orders/${encodeURIComponent(orderId)}`, { method: "GET" });
  } catch (error) {
    if (error instanceof TossError && !error.unknown) return null;
    throw error;
  }
}
