"use server";

import { getPayingStudent } from "@/lib/classroom/dal";
import { MEMBERSHIP } from "@/lib/classroom/membership";
import { prepareSubscription } from "@/lib/classroom/membership-billing";
import { isTossConfigured, tossClientKey } from "@/lib/toss";

export type CheckoutStart = { customerKey: string; clientKey: string; customerName: string } | { error: string };

/** 카드 등록 창을 열기 전: 동의 확인 + 구독 준비 */
export async function startCheckout(agreed: { terms: boolean; recurring: boolean }): Promise<CheckoutStart> {
  if (!agreed.terms || !agreed.recurring) return { error: "필수 항목에 모두 동의해 주세요." };
  if (!MEMBERSHIP.onSale) return { error: "아직 판매 준비 중이에요." };
  if (!isTossConfigured()) return { error: "결제 설정이 아직 안 됐어요. 카카오톡으로 문의해 주세요." };
  const student = await getPayingStudent();
  if (!student) return { error: "먼저 로그인해 주세요." };
  const prepared = await prepareSubscription(student);
  if ("error" in prepared) return prepared;
  return { customerKey: prepared.customerKey, clientKey: tossClientKey(), customerName: student.name };
}
