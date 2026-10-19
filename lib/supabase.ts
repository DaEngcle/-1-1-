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

// ===== 클래스룸 =====

export interface Student {
  id: string;
  name: string;
  phone: string | null;
  memo: string | null;
  login_code_hash: string;
  is_active: boolean;
  session_version: number;
  created_at: string;
}

export interface VideoProgress {
  student_id: string;
  lesson_id: string;
  watched_segments: number[];
  duration_seconds: number;
  percent: number;
  completed_at: string | null;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  sort_order: number;
  week_number: number;
  week_title: string;
  kind: "day" | "drill";
  day_number: number | null;
  title: string;
  /** 목차에 함께 보이는 한국어 해석 */
  title_ko?: string | null;
  video_url: string | null;
  /** Live 수업 녹화본 (VOD 준비되면 교체 예정) */
  video_live?: boolean;
  description: string | null;
  is_published: boolean;
  created_at: string;
}

export interface LessonItem {
  id: string;
  lesson_id: string;
  item_order: number;
  sentence: string;
  translation: string | null;
  note: string | null;
  content_id: string | null;
  created_at: string;
}

export interface Submission {
  id: string;
  student_id: string;
  lesson_item_id: string;
  audio_path: string;
  status: "pending" | "scored" | "failed";
  overall_score: number | null;
  accuracy_score: number | null;
  fluency_score: number | null;
  completeness_score: number | null;
  prosody_score: number | null;
  word_details: unknown;
  feedback_text: string | null;
  created_at: string;
  scored_at: string | null;
}

export type AttendanceStatus = "present" | "late" | "absent" | "excused";

export interface Attendance {
  id: string;
  student_id: string;
  class_date: string;
  status: AttendanceStatus;
  note: string | null;
  created_at: string;
}

export interface ClassRecording {
  id: string;
  course_id: string;
  week_number: number;
  title: string;
  video_url: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string | null;
  sort_order: number;
  status: "open" | "preparing";
}
