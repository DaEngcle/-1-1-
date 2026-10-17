/** 상담 때 받는 학생 프로필 항목 + 고객 단계 (CRM) */

export const STAGES = {
  lead: { label: "상담 예정", icon: "📞", tone: "bg-slate-50 text-slate-700 border-slate-200" },
  consulted: { label: "상담 완료 · 미등록", icon: "🤔", tone: "bg-amber-50 text-amber-800 border-amber-200" },
  enrolled: { label: "등록 ✅", icon: "🎓", tone: "bg-green-50 text-green-800 border-green-200" },
  lost: { label: "등록 안 함", icon: "💤", tone: "bg-zinc-100 text-zinc-600 border-zinc-200" },
} as const;
export type StageId = keyof typeof STAGES;
export const isStage = (v: unknown): v is StageId => typeof v === "string" && v in STAGES;

/** 미등록 사유 → 다시 다가갈 때 쓰는 작은 선물·메시지 */
export const LOST_REASONS = {
  price: {
    label: "💸 가격 부담",
    gift: "무료 7일 체험 + 분납 안내",
    message: (n: string) =>
      `${n}님, 상담 때 이야기 나눠서 정말 반가웠어요 😊 부담 없이 먼저 경험해 보시라고 다잉클 클래스룸 7일 무료 체험을 열어드렸어요. 하루 10분 쉐도잉만 해보셔도 차이가 느껴질 거예요! 분납도 가능하니 편하게 물어봐 주세요 💙`,
  },
  timing: {
    label: "⏰ 아직 출국이 멀어서",
    gift: "출국 전 체크리스트 PDF",
    message: (n: string) =>
      `${n}님, 출국 준비는 잘 되고 있나요? ✈️ 미리 챙겨두면 좋은 '워홀 출국 전 체크리스트'를 선물로 보내드려요. 영어는 출국 3~6개월 전부터 시작하면 현지 적응이 훨씬 빨라요. 궁금한 거 있으면 언제든 연락 주세요 💙`,
  },
  confidence: {
    label: "😰 자신감·실력 걱정",
    gift: "레벨테스트 상세 피드백",
    message: (n: string) =>
      `${n}님, 상담 때 레벨테스트 정말 잘 해주셨어요 👏 지금 실력에서 딱 무엇부터 하면 되는지 상세 피드백을 정리해서 보내드려요. 처음엔 다들 비슷하게 시작해요. 한 문장씩 같이 가면 충분해요 💪`,
  },
  compare: {
    label: "🔍 다른 곳과 비교 중",
    gift: "실제 수강생 쉐도잉 전후 영상",
    message: (n: string) =>
      `${n}님, 고민 중이시죠? 😊 결정에 도움이 되도록 실제 다잉클 수강생들의 쉐도잉 전·후 변화를 모아서 보내드려요. 호주 현장에서 바로 쓰는 문장만 골라서 연습하는 게 다잉클의 차이예요 🇦🇺`,
  },
  busy: {
    label: "📅 바빠서 시간이 없음",
    gift: "하루 5분 쉐도잉 루틴표",
    message: (n: string) =>
      `${n}님, 요즘 많이 바쁘시죠? 바쁜 분들을 위해 '하루 5분 쉐도잉 루틴표'를 만들어 봤어요 🎁 출퇴근길에 한 문장만 따라 해도 충분해요. 여유 생기면 언제든 편하게 연락 주세요 💙`,
  },
  noreply: {
    label: "🙈 연락 안 됨",
    gift: "무료 강의 1편 (VOD)",
    message: (n: string) =>
      `${n}님 안녕하세요! 다잉클이에요 😊 상담 때 말씀하신 호주 생활에 바로 도움이 될 무료 강의 1편을 선물로 보내드려요. 편할 때 가볍게 들어보시고, 궁금한 점 있으면 답장 주세요 💙`,
  },
  other: {
    label: "기타",
    gift: "",
    message: (n: string) =>
      `${n}님, 상담 때 이야기 나눠서 반가웠어요 😊 호주 준비하면서 영어 때문에 고민될 때 언제든 편하게 연락 주세요. 다잉클이 응원할게요 💙`,
  },
} as const;
export type LostReasonId = keyof typeof LOST_REASONS;
export const isLostReason = (v: unknown): v is LostReasonId => typeof v === "string" && v in LOST_REASONS;

/** 폼·화면에서 공통으로 쓰는 프로필 텍스트 항목 */
export const PROFILE_TEXT_FIELDS = [
  { key: "departure", label: "✈️ 출국 예정", placeholder: "2027.04" },
  { key: "korea_city", label: "🏠 사는 지역", placeholder: "서울 노원" },
  { key: "aus_city", label: "🇦🇺 호주 희망 도시", placeholder: "멜버른" },
  { key: "current_job", label: "💼 현재 직업", placeholder: "카페 바리스타" },
  { key: "major", label: "🎓 전공", placeholder: "간호" },
  { key: "hope_job", label: "🎯 호주에서 하고 싶은 일", placeholder: "카페, 하우스키핑" },
  { key: "future_job", label: "🌱 미래 희망 직군", placeholder: "간호사 (이민)" },
  { key: "mbti", label: "🧩 MBTI", placeholder: "ENFP" },
  { key: "test_grade", label: "📝 상담 테스트 등급", placeholder: "B+" },
  { key: "source", label: "📣 어디서 알게 됐는지", placeholder: "웨비나, 인스타, 프롬오지 …" },
] as const;

export const STAR_FIELDS = [
  { key: "star_speaking", label: "🗣 스피킹" },
  { key: "star_listening", label: "👂 리스닝" },
  { key: "star_confidence", label: "💪 자신감" },
] as const;

export const PROFILE_SELECT =
  "age, departure, korea_city, aus_city, current_job, major, hope_job, future_job, mbti, test_grade, " +
  "star_speaking, star_listening, star_confidence, buy_probability, source, consulted_on, stage, cohort_id, " +
  "called, link_sent, free_vod, lost_reason, gift_sent";

export interface Profile {
  age: number | null;
  departure: string | null;
  korea_city: string | null;
  aus_city: string | null;
  current_job: string | null;
  major: string | null;
  hope_job: string | null;
  future_job: string | null;
  mbti: string | null;
  test_grade: string | null;
  star_speaking: number | null;
  star_listening: number | null;
  star_confidence: number | null;
  buy_probability: number | null;
  source: string | null;
  consulted_on: string | null;
  stage: StageId;
  cohort_id: string | null;
  called: boolean;
  link_sent: boolean;
  free_vod: boolean;
  lost_reason: string | null;
  gift_sent: string | null;
}

export const stars = (n: number | null) => (n == null ? "-" : "★".repeat(n) + "☆".repeat(Math.max(0, 5 - n)));

/** 폼 데이터 → students 컬럼 (빈칸은 null) */
export function profileFromForm(formData: FormData) {
  const text = (k: string, max = 80) => {
    const v = String(formData.get(k) ?? "").trim().slice(0, max);
    return v || null;
  };
  const int = (k: string, min: number, max: number) => {
    const raw = String(formData.get(k) ?? "").trim();
    if (!raw) return null;
    const n = Math.round(Number(raw));
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : null;
  };
  const out: Record<string, unknown> = {};
  for (const f of PROFILE_TEXT_FIELDS) out[f.key] = text(f.key);
  for (const f of STAR_FIELDS) out[f.key] = int(f.key, 0, 5);
  out.age = int("age", 1, 99);
  out.buy_probability = int("buy_probability", 0, 100);
  const consulted = String(formData.get("consulted_on") ?? "");
  out.consulted_on = /^\d{4}-\d{2}-\d{2}$/.test(consulted) ? consulted : null;
  const cohort = String(formData.get("cohort_id") ?? "");
  out.cohort_id = /^[0-9a-f-]{36}$/.test(cohort) ? cohort : null;
  return out;
}
