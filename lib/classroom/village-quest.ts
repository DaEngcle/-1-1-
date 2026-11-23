// 고양이 마을 오늘의 의뢰 3개: 오늘의 가게 · 오늘 강의 문장 · 어제 복습. 서버·브라우저 공용 순수 함수
import { VILLAGE_TALKS } from "./village-talk";

export const QUEST_KINDS = ["shop", "lesson", "review"] as const;
export type QuestKind = (typeof QUEST_KINDS)[number];

export const QUEST_CHURU = 5;
export const QUEST_BONUS = 10;

const SHOP_ORDER = Object.keys(VILLAGE_TALKS);

/** 날짜(YYYY-MM-DD) → 날 번호. 가게가 매일 하나씩 돌아가며 나온다 */
function dayIndex(day: string) {
  return Math.floor(Date.parse(`${day}T00:00:00Z`) / 86_400_000);
}

export function shopForDay(day: string) {
  return SHOP_ORDER[((dayIndex(day) % SHOP_ORDER.length) + SHOP_ORDER.length) % SHOP_ORDER.length];
}

/** 하루 츄르: 의뢰 하나 5, 3개 다 하면 보너스 10 */
export function questChuru(done: string[]) {
  const n = new Set(done.filter((d) => (QUEST_KINDS as readonly string[]).includes(d))).size;
  return n * QUEST_CHURU + (n >= QUEST_KINDS.length ? QUEST_BONUS : 0);
}

export function isComplete(done: string[]) {
  return QUEST_KINDS.every((k) => done.includes(k));
}

/** 연속 기록: 오늘(또는 아직 안 했으면 어제)부터 거꾸로 3개를 다 한 날이 며칠 이어지는지 */
export function questStreak(completeDays: Set<string>, today: string, addDays: (d: string, n: number) => string) {
  let d = completeDays.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (completeDays.has(d) && n < 3650) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

/** 강의 문장 고르기: 너무 길지 않은 문장 중 날마다 하나 */
export function pickLessonSentence<T extends { sentence: string }>(items: T[], day: string): T | null {
  if (!items.length) return null;
  const short = items.filter((i) => i.sentence.split(/\s+/).length <= 14);
  const pool = short.length ? short : items;
  return pool[dayIndex(day) % pool.length];
}

/** 지도 이름 (village.js PLACES와 같게) */
export const SHOP_NAMES: Record<string, string> = {
  hosier: "🎨 Hosier Lane 카페",
  bakery: "🥐 크루아상 베이커리",
  china: "🏮 차이나타운",
  hotel: "🏨 호텔",
  chemist: "💊 케미스트 웨어하우스",
  coles: "🛒 콜스",
  woolies: "🛒 울워스",
  qvm: "🛒 퀸 빅토리아 마켓",
  cake: "🍰 케이크 가게",
  site: "🏗 공사 현장",
  park: "🌳 공원",
  huts: "🏖 비치 오두막",
  pier: "⛵ 부두",
};
