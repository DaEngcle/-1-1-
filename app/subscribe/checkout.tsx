"use client";

import { useState } from "react";
import Link from "next/link";
import { startCheckout } from "./actions";

type TossBilling = {
  requestBillingAuth(opts: { method: "CARD"; successUrl: string; failUrl: string; customerName?: string }): Promise<void>;
};
declare global {
  interface Window {
    TossPayments?: (clientKey: string) => { payment(opts: { customerKey: string }): TossBilling };
  }
}

const SDK_URL = "https://js.tosspayments.com/v2/standard";

function loadSdk(): Promise<void> {
  if (window.TossPayments) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SDK_URL;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("결제창을 불러오지 못했어요."));
    document.head.appendChild(s);
  });
}

export function Checkout({ price, nextPayDay, disabled }: { price: number; nextPayDay: string; disabled?: boolean }) {
  const [terms, setTerms] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setBusy(true);
    setError(null);
    try {
      const started = await startCheckout({ terms, recurring });
      if ("error" in started) throw new Error(started.error);
      await loadSdk();
      const toss = window.TossPayments?.(started.clientKey);
      if (!toss) throw new Error("결제창을 불러오지 못했어요.");
      await toss.payment({ customerKey: started.customerKey }).requestBillingAuth({
        method: "CARD",
        successUrl: `${location.origin}/subscribe/success`,
        failUrl: `${location.origin}/subscribe?fail=1`,
        customerName: started.customerName,
      });
    } catch (e) {
      // 사용자가 창을 닫은 경우도 여기로 온다
      const message = e instanceof Error ? e.message : "결제를 시작하지 못했어요.";
      setError(message.includes("취소") ? null : message);
      setBusy(false);
    }
  }

  const ready = terms && recurring && !disabled && !busy;
  return (
    <div className="flex w-full flex-col gap-3">
      <label className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-left text-xs leading-relaxed text-zinc-600">
        <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-0.5" />
        <span>
          <b>[필수]</b>{" "}
          <Link href="/terms" target="_blank" className="underline">이용약관</Link>과{" "}
          <Link href="/privacy" target="_blank" className="underline">개인정보 처리방침</Link>에 동의해요.
        </span>
      </label>
      <label className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-left text-xs leading-relaxed text-zinc-600">
        <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} className="mt-0.5" />
        <span>
          <b>[필수] 정기결제 동의</b> · 오늘 {price.toLocaleString("ko-KR")}원이 결제되고, 해지하기 전까지 매달 같은 날({nextPayDay}부터) 같은 금액이
          등록한 카드로 자동 결제돼요. 언제든 [더보기 → 내 멤버십]에서 해지할 수 있고, 해지해도 결제한 기간 끝까지 쓸 수 있어요.{" "}
          <Link href="/terms#refund" target="_blank" className="underline">환불 규정</Link>
        </span>
      </label>
      <button
        type="button"
        onClick={pay}
        disabled={!ready}
        className="w-full rounded-2xl bg-brand-600 px-4 py-4 text-base font-extrabold text-white shadow-md disabled:bg-zinc-300"
      >
        {busy ? "결제창 여는 중..." : disabled ? "판매 준비 중" : `월 ${price.toLocaleString("ko-KR")}원으로 시작하기`}
      </button>
      {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
    </div>
  );
}
