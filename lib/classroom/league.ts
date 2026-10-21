// 롤처럼 나누는 리그 티어. 매달 1일에 시즌이 새로 시작하고, 이번 달 학습 포인트로 티어가 정해진다. 서버·브라우저 공용

export type TierId =
  | "iron"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "emerald"
  | "diamond"
  | "master"
  | "challenger";

export const TIERS: { id: TierId; name: string; min: number; from: string; to: string; ink: string }[] = [
  { id: "iron", name: "아이언", min: 0, from: "#6B7280", to: "#C7CCD4", ink: "#4B5563" },
  { id: "bronze", name: "브론즈", min: 100, from: "#9A5B2E", to: "#F0B27A", ink: "#8A4B1F" },
  { id: "silver", name: "실버", min: 300, from: "#8A97A8", to: "#EEF2F7", ink: "#5B6676" },
  { id: "gold", name: "골드", min: 600, from: "#D9900B", to: "#FFE48A", ink: "#A16207" },
  { id: "platinum", name: "플래티넘", min: 1000, from: "#0E9F9A", to: "#9FF3E6", ink: "#0F766E" },
  { id: "emerald", name: "에메랄드", min: 1500, from: "#047857", to: "#6EF0B4", ink: "#047857" },
  { id: "diamond", name: "다이아몬드", min: 2200, from: "#4F46E5", to: "#B9C2FF", ink: "#4338CA" },
  { id: "master", name: "마스터", min: 3000, from: "#7E22CE", to: "#F0C6FF", ink: "#7E22CE" },
  // 챌린저: 마스터 점수를 넘긴 사람 중 시즌 1등
  { id: "challenger", name: "챌린저", min: 3000, from: "#1D4ED8", to: "#FCD34D", ink: "#1E3A8A" },
];

export function tierFor(points: number, rank: number) {
  const master = TIERS.find((t) => t.id === "master")!;
  if (rank === 1 && points >= master.min) return TIERS[TIERS.length - 1];
  return [...TIERS].reverse().find((t) => t.id !== "challenger" && points >= t.min) ?? TIERS[0];
}

/** 다음 티어까지 남은 포인트 (마스터 이상이면 null) */
export function nextTier(points: number) {
  const next = TIERS.find((t) => t.id !== "challenger" && t.min > points);
  return next ? { tier: next, left: next.min - points } : null;
}

/** 이번 시즌 이름·남은 날 (한국 날짜 기준) */
export function seasonInfo(today: string) {
  const [y, m] = today.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { label: `${y} ${m}월 시즌`, daysLeft: last - Number(today.slice(8, 10)) };
}
