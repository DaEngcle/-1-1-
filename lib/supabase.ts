import { createClient } from "@supabase/supabase-js";

export type SubscriberStatus = "trial" | "active" | "cancelled" | "expired";

export interface Subscriber {
  id: string;
  name: string;
  phone: string;
  status: SubscriberStatus;
  trial_start_date: string;
  subscription_start_date: string | null;
  content_day_index: number;
  created_at: string;
}

export interface Content {
  id: string;
  day_order: number;
  expression: string;
  pronunciation_tip: string | null;
  example_sentence: string | null;
  situation_note: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  subscriber_id: string;
  toss_billing_key: string | null;
  amount: number;
  status: "success" | "failed" | "cancelled";
  paid_at: string | null;
  created_at: string;
}

export interface SendLog {
  id: string;
  subscriber_id: string;
  content_id: string | null;
  sent_at: string;
  status: "sent" | "failed";
}

/**
 * 서버 전용 클라이언트 (service role key, RLS 우회).
 * Server Component, Server Action, Route Handler에서만 사용. 클라이언트 번들에 절대 노출 금지.
 */
export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase 서버 클라이언트를 생성하려면 NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
