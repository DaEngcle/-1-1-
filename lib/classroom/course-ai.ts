import "server-only";
// 내 워홀 코스 AI: 고양이가 짧게 되묻고(최대 3번), 토픽 목록 안에서만 골라 이름을 맞춰 준다.
// 싼 모델(haiku)만 쓰고, 실패하면 부르는 쪽이 규칙 추천으로 넘어간다.
import { aiReady, ask, parseJson } from "./interview-ai";
import { CITIES, COURSE_LEVELS, GOALS, JOBS, MINUTES, STAGES, WORRIES, departureLabel, type CourseAnswers } from "./course-questions";
import { COURSE_TOPICS, validateAiCourse, type AiCourse } from "./course-topics";
import { phraseDeck } from "./phrase-decks";

const MODEL = "claude-haiku-5-5";
export const MAX_CHAT_TURNS = 3;
export const MAX_ANSWER_CHARS = 300;
/** 학생 한 명이 하루에 AI 코스 대화를 시작할 수 있는 횟수 */
export const AI_ONBOARDING_PER_DAY = 3;
/** 하루 AI 호출 상한 (대화 3번 x (질문 3 + 추천 1) + 여유) */
export const AI_CALLS_PER_DAY = 15;

export type ChatTurn = { role: "cat" | "me"; text: string };

export { aiReady };

/** 전화번호·이메일·주소창 링크처럼 개인정보로 보이는 것은 지우고 보낸다 */
export function stripPersonal(text: string) {
  return text
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[삭제]")
    .replace(/https?:\/\/\S+/g, "[삭제]")
    .replace(/\d{6}\s*-\s*\d{7}/g, "[삭제]")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, "[삭제]")
    .slice(0, MAX_ANSWER_CHARS);
}

const label = <T extends { id: string | number; label: string }>(list: readonly T[], id: string | number) =>
  list.find((x) => x.id === id)?.label ?? String(id);

function answersText(a: CourseAnswers) {
  return [
    ...(a.startMonth ? [`출국: ${departureLabel(a.startMonth)}`] : []),
    `가는 곳: ${a.cities.map((c) => label(CITIES, c)).join(", ") || "안 고름"}`,
    `지금 단계: ${label(STAGES, a.stage)}`,
    `하고 싶은 일: ${a.jobs.map((j) => label(JOBS, j)).join(", ") || "안 고름"}`,
    ...(a.jobOther ? [`직접 적은 일: ${stripPersonal(a.jobOther)}`] : []),
    `워홀 목표: ${(a.goals ?? []).map((g) => label(GOALS, g)).join(", ") || "안 고름"}`,
    `영어: ${label(COURSE_LEVELS, a.level)}`,
    `걱정되는 순간: ${a.worries.map((w) => label(WORRIES, w)).join(", ") || "안 고름"}`,
    `하루: ${label(MINUTES, a.minutes)}`,
  ].join("\n");
}

function chatText(turns: ChatTurn[]) {
  return turns.map((t) => `${t.role === "cat" ? "고양이" : "학생"}: ${t.role === "me" ? stripPersonal(t.text) : t.text}`).join("\n");
}

const CAT_SYSTEM = `너는 호주 워킹홀리데이를 준비하거나 가 있는 한국 학생을 돕는 작은 고양이야. 다잉클 영어 수업 앱 안에 산다.
학생이 고른 답을 보고, 어떤 영어가 제일 급한지 알기 위해 짧게 되묻는다.
- 한 번에 질문 하나만. 한국어 존댓말(~요). 40자 안팎으로 짧게.
- 학생 답을 바탕으로 더 구체적인 상황을 묻는다 (예: 일터에서 맡는 일, 영어가 막히는 순간, 자주 만나는 사람).
- 과장, 약속, 칭찬 늘어놓기 금지. 이모지는 많아야 1개.
- 개인정보(전화번호·주소·여권 등)는 묻지 않는다.
- 이미 충분히 알았으면 질문 대신 DONE 한 단어만 쓴다.
질문 문장만 출력한다.`;

/** 다음 질문 한 줄. 끝내도 되면 null */
export async function catFollowUp(a: CourseAnswers, turns: ChatTurn[]): Promise<string | null> {
  const asked = turns.filter((t) => t.role === "cat").length;
  if (asked >= MAX_CHAT_TURNS) return null;
  const text = await ask(
    MODEL,
    CAT_SYSTEM,
    `학생이 고른 답:\n${answersText(a)}\n\n지금까지 대화:\n${chatText(turns) || "(아직 없음)"}\n\n${asked === 0 ? "첫 질문을 해 줘." : asked >= 2 ? "마지막 질문 하나만 하거나 DONE." : "다음 질문 하나, 또는 DONE."}`,
    150,
  );
  const line = text.split("\n").map((l) => l.trim()).find(Boolean) ?? "";
  if (!line || /^DONE\b/i.test(line)) return asked >= 1 ? null : "영어 쓸 때 제일 막히는 순간이 언제예요?";
  return line.replace(/^["'“]|["'”]$/g, "").slice(0, 120);
}


/** 토픽 목록 안에서만 3~6개 고르고, 학생에게 맞는 이름·한 줄 설명·요약을 받는다 */
export async function aiCourse(a: CourseAnswers, turns: ChatTurn[], allowed: string[], name: string): Promise<AiCourse | null> {
  const catalog = COURSE_TOPICS.filter((t) => allowed.includes(t.id))
    .map((t) => `- ${t.id}: ${t.title} (표현 묶음: ${t.sets.map(([d, s]) => phraseDeck(d)?.sets.find((x) => x.id === s)?.title ?? `${d}:${s}`).join(", ")})`)
    .join("\n");
  const text = await ask(
    MODEL,
    `너는 한국 워홀 학생의 영어 코스를 짜는 고양이야. 아래 토픽 목록의 id 안에서만 고른다. 새 토픽을 만들지 않는다.
JSON 하나만 출력한다: {"summary": "...", "topics": [{"id": "...", "title": "...", "desc": "..."}]}
- topics: 3~6개, 제일 급한 것부터.
- title: 이 학생 상황에 맞춘 한국어 토픽 이름, 25자 이내 (예: "라테 만들며 손님이랑 수다 떨기").
- desc: 무엇을 연습하는지 한국어 한 줄, 45자 이내.
- summary: "${name}님은 …이 제일 급해요"처럼 이 학생에게 지금 필요한 영어를 한국어 한 문장, 60자 이내. 과장 금지.`,
    `토픽 목록:\n${catalog}\n\n학생이 고른 답:\n${answersText(a)}\n\n고양이와 나눈 대화:\n${chatText(turns) || "(없음)"}`,
    700,
  );
  return validateAiCourse(parseJson<unknown>(text), allowed);
}
