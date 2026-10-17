import "server-only";
import type { TtsVoice } from "./azure-speech";

// 레벨테스트 v2: 듣기(받아쓰기·대화) → 문법·어휘 → 자유 말하기
// 수강 전·후 같은 문제로 비교하므로 기수 중간에는 문제를 바꾸지 않는다.
// 정답·받아쓰기 원문은 이 파일(서버)에만 있고 브라우저로 보내지 않는다.

export const TEST_VERSION = 2;

/** 받아쓰기: 듣고 그대로 타이핑 (짧은 문장 → 긴 문장) */
export const DICTATION = [
  { id: "d1", text: "I'll grab a flat white, please." },
  { id: "d2", text: "Do you reckon we could swap shifts this Friday?" },
  { id: "d3", text: "I've been meaning to ask, are bills included in the rent or not?" },
];

/** 대화 듣기: A(여)·B(남) 대화를 듣고 영어 질문에 답하기 (쉬운 것 → 어려운 것) */
export const DIALOGUES: {
  id: string;
  lines: { voice: TtsVoice; text: string }[];
  question: string;
  choices: string[];
  answer: number;
}[] = [
  {
    id: "l1",
    lines: [
      { voice: "a", text: "Hi, I'd like to book a table for two tonight." },
      { voice: "b", text: "Sure, what time were you after?" },
      { voice: "a", text: "Around seven thirty, if that's possible." },
      { voice: "b", text: "Seven thirty works. Can I grab a name?" },
    ],
    question: "What time is the booking for?",
    choices: ["7:00", "7:30", "2:00", "8:30"],
    answer: 1,
  },
  {
    id: "l2",
    lines: [
      { voice: "a", text: "Hey, are you still keen for the beach tomorrow?" },
      { voice: "b", text: "I'd love to, but I've been called in to work." },
      { voice: "a", text: "Ah, bummer. What about Sunday?" },
      { voice: "b", text: "Sunday's perfect. I'm free all day." },
    ],
    question: "Why can't B go to the beach tomorrow?",
    choices: ["B is sick.", "B has to work.", "The weather is bad.", "B doesn't like the beach."],
    answer: 1,
  },
  {
    id: "l3",
    lines: [
      { voice: "a", text: "The rent's two hundred and sixty a week, and the bond is four weeks' rent." },
      { voice: "b", text: "So I'd need to pay the bond upfront?" },
      { voice: "a", text: "Yep, plus the first two weeks of rent before you move in." },
      { voice: "b", text: "Okay, that's a bit more than I expected." },
    ],
    question: "Not counting the bond, how much rent does B pay before moving in?",
    choices: ["$260", "$520", "$1,040", "$1,560"],
    answer: 1,
  },
  {
    id: "l4",
    lines: [
      { voice: "a", text: "Mate, you look knackered. Big night?" },
      { voice: "b", text: "Nah, I did a double shift. Twelve hours straight." },
      { voice: "a", text: "Fair dinkum? You should chuck a sickie tomorrow." },
      { voice: "b", text: "Can't, we're short-staffed. I'll just have an early one tonight." },
    ],
    question: "What will B probably do tonight?",
    choices: ["Go to a party", "Call in sick", "Go to bed early", "Work another shift"],
    answer: 2,
  },
  {
    id: "l5",
    lines: [
      { voice: "a", text: "Did you end up getting that job at the cafe?" },
      { voice: "b", text: "They offered it to me, but the pay was below award wage, so I turned it down." },
      { voice: "a", text: "Good on you. Plenty of places pay properly." },
      { voice: "b", text: "Yeah, I've got another trial on Thursday, so fingers crossed." },
    ],
    question: "Why didn't B take the cafe job?",
    choices: ["The hours were too long.", "The pay was too low.", "The cafe was too far.", "B failed the trial."],
    answer: 1,
  },
];

/** 문법·어휘 ① 가장 자연스러운 대답 고르기 */
export const RESPONSES = [
  {
    id: "g1",
    prompt: "How's it going?",
    choices: ["Yes, I'm going.", "Not bad, thanks. You?", "I'm going to the shop.", "It goes well to me."],
    answer: 1,
  },
  {
    id: "g2",
    prompt: "Is this seat taken?",
    choices: ["No, go for it.", "Yes, I take it.", "I'm sitting on it yesterday.", "No, it's my seat taking."],
    answer: 0,
  },
  {
    id: "g3",
    prompt: "Would you mind closing the window?",
    choices: ["Yes, I'll close it right now.", "Not at all. I'll close it.", "No, I mind it.", "Sure, I don't close it."],
    answer: 1,
  },
  {
    id: "g4",
    prompt: "I'm so sorry, I completely forgot about our catch-up.",
    choices: [
      "Don't worry, it's all good. Let's reschedule.",
      "Yes, you forgot it.",
      "I'm sorry too about it.",
      "It doesn't matter for you.",
    ],
    answer: 0,
  },
];

/** 문법·어휘 ② 빈칸에 한 단어 쓰기 */
export const BLANKS = [
  { id: "b1", sentence: "I ___ been in Melbourne for six months.", ko: "멜버른에 온 지 6개월 됐어요.", answers: ["have", "ve"] },
  { id: "b2", sentence: "Can you give me a ___ with these boxes?", ko: "이 상자들 좀 도와줄래?", answers: ["hand"] },
  { id: "b3", sentence: "If I ___ more money, I'd travel around Australia.", ko: "돈이 더 있으면 호주 여행할 텐데.", answers: ["had"] },
  { id: "b4", sentence: "I'm not used to ___ up so early.", ko: "이렇게 일찍 일어나는 게 익숙하지 않아.", answers: ["getting", "waking"] },
];

/** 자유 말하기: 영어 질문에 자유롭게 대답 (target = 이만큼 다양한 단어를 쓰면 '말한 양' 만점) */
export const SPEAKING = [
  { id: "s1", question: "Can you introduce yourself? Where are you from, and what do you do?", ko: "자기소개를 해주세요. 어디서 왔고, 무슨 일을 하나요?", target: 15 },
  { id: "s2", question: "What do you usually do on your days off?", ko: "쉬는 날엔 보통 뭐 하나요?", target: 18 },
  { id: "s3", question: "You're at a café. Order a drink and ask how long it'll take.", ko: "카페에 있어요. 음료를 주문하고 얼마나 걸리는지 물어보세요.", target: 15 },
  { id: "s4", question: "Your housemate keeps leaving dirty dishes in the sink. What would you say to them?", ko: "하우스메이트가 계속 설거지를 안 하고 싱크대에 그릇을 쌓아둬요. 뭐라고 말할까요?", target: 20 },
];

export const WEIGHTS = { listening: 0.35, grammar: 0.25, speaking: 0.4 };

/** 브라우저로 보낼 문제 (정답·받아쓰기 원문·대화 대본 제외) */
export function publicQuestions() {
  return {
    dictation: DICTATION.map(({ id }) => ({ id })),
    dialogues: DIALOGUES.map(({ id, lines, question, choices }) => ({ id, lineCount: lines.length, question, choices })),
    responses: RESPONSES.map(({ id, prompt, choices }) => ({ id, prompt, choices })),
    blanks: BLANKS.map(({ id, sentence, ko }) => ({ id, sentence, ko })),
    speaking: SPEAKING.map(({ id, question, ko }) => ({ id, question, ko })),
  };
}

/** 문제 음성: 받아쓰기 id 또는 "대화id:줄번호" */
export function audioFor(audioId: string): { text: string; voice: TtsVoice } | null {
  const d = DICTATION.find((x) => x.id === audioId);
  if (d) return { text: d.text, voice: "a" };
  const [dialogueId, line] = audioId.split(":");
  const l = DIALOGUES.find((x) => x.id === dialogueId)?.lines[Number(line)];
  if (l) return l;
  const s = SPEAKING.find((x) => x.id === audioId);
  return s ? { text: s.question, voice: "b" } : null;
}

const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

/** 받아쓰기 점수: 원문 단어 중 순서대로 맞게 쓴 비율 (최장 공통 부분열) */
export function dictationScore(id: string, typed: string) {
  const item = DICTATION.find((x) => x.id === id);
  if (!item) return null;
  const a = words(item.text);
  const b = words(typed);
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  const matched = dp[a.length][b.length];
  // 엉뚱한 단어를 잔뜩 써서 맞추는 것 방지: 쓴 단어가 원문보다 많으면 그만큼 감점
  const extra = Math.max(0, b.length - a.length);
  return Math.max(0, Math.round(((matched - extra * 0.5) / a.length) * 100));
}

export function choiceScore(id: string, choice: number) {
  const q = DIALOGUES.find((x) => x.id === id) ?? RESPONSES.find((x) => x.id === id);
  if (!q) return null;
  return q.answer === choice ? 100 : 0;
}

export function blankScore(id: string, typed: string) {
  const q = BLANKS.find((x) => x.id === id);
  if (!q) return null;
  const w = words(typed)[0] ?? "";
  return q.answers.includes(w) ? 100 : 0;
}

export interface SpeakingDetail {
  transcript: string;
  uniqueWords: number;
  accuracy: number;
  fluency: number;
  prosody: number | null;
  pron: number;
  range: number;
}

/** 자유 말하기 한 문항: 발음 평가 70% + 말한 양(다양한 단어 수) 30% */
export function speakingDetail(
  id: string,
  result: { transcript: string; overall: number; accuracy: number; fluency: number; prosody: number | null } | null,
): { score: number; detail: SpeakingDetail } {
  const target = SPEAKING.find((x) => x.id === id)?.target ?? 15;
  if (!result) {
    return {
      score: 0,
      detail: { transcript: "", uniqueWords: 0, accuracy: 0, fluency: 0, prosody: null, pron: 0, range: 0 },
    };
  }
  const uniqueWords = new Set(words(result.transcript)).size;
  const range = Math.min(100, Math.round((uniqueWords / target) * 100));
  const pron = Math.round(result.overall);
  return {
    score: Math.round(pron * 0.7 + range * 0.3),
    detail: {
      transcript: result.transcript,
      uniqueWords,
      accuracy: Math.round(result.accuracy),
      fluency: Math.round(result.fluency),
      prosody: result.prosody == null ? null : Math.round(result.prosody),
      pron,
      range,
    },
  };
}

export interface Skills {
  listening: number;
  grammar: number;
  pronunciation: number;
  fluency: number;
  range: number;
}

/** 문항 점수로 영역 점수·5가지 실력·종합 점수 계산. 안 푼 문항은 0점 */
export function summarize(answers: { question_id: string; score: number; detail?: unknown }[]) {
  const byId = new Map(answers.map((a) => [a.question_id, a]));
  const avg = (ids: string[]) => Math.round(ids.reduce((sum, id) => sum + (byId.get(id)?.score ?? 0), 0) / ids.length);
  const listening = avg([...DICTATION, ...DIALOGUES].map((q) => q.id));
  const grammar = avg([...RESPONSES, ...BLANKS].map((q) => q.id));
  const speaking = avg(SPEAKING.map((q) => q.id));
  const details = SPEAKING.map((q) => byId.get(q.id)?.detail as SpeakingDetail | undefined);
  const avgDetail = (key: "accuracy" | "fluency" | "range") =>
    Math.round(details.reduce((sum, d) => sum + (d?.[key] ?? 0), 0) / SPEAKING.length);
  const skills: Skills = {
    listening,
    grammar,
    pronunciation: avgDetail("accuracy"),
    fluency: avgDetail("fluency"),
    range: avgDetail("range"),
  };
  const total = Math.round(
    listening * WEIGHTS.listening + grammar * WEIGHTS.grammar + speaking * WEIGHTS.speaking,
  );
  return { listening, grammar, speaking, total, skills };
}
