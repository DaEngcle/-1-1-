import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { MAX_TURNS, type Scenario } from "./interview-scenarios";

export type Turn = { role: "ai" | "me"; text: string };

export type InterviewFeedback = {
  result: string;
  score: number;
  scores: { communication: number; answers: number; grammar: number };
  summary_ko: string;
  good_ko: string[];
  fixes: { you_said: string; better: string; why_ko: string }[];
  expressions: { en: string; ko: string }[];
};

export function aiReady() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;

async function ask(model: string, system: string, user: string, maxTokens: number) {
  client ??= new Anthropic();
  const response = await client.beta.messages.create({
    model,
    max_tokens: maxTokens,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system,
    messages: [{ role: "user", content: user }],
  });
  return response.content
    .flatMap((b) => (b.type === "text" ? [b.text] : []))
    .join("")
    .trim();
}

/** 응답에서 JSON만 꺼내기 (```json 감싸기·앞뒤 말 제거) */
function parseJson<T>(text: string): T | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

function transcriptText(turns: Turn[], s: Scenario) {
  return turns.map((t) => `${t.role === "ai" ? s.name : "Candidate"}: ${t.text}`).join("\n");
}

/** 면접관의 다음 말 */
export async function interviewerReply(s: Scenario, turns: Turn[]) {
  const asked = turns.filter((t) => t.role === "ai").length;
  const mustEnd = asked >= MAX_TURNS - 1;
  const system = `You are ${s.name}, the ${s.roleKo === "하우스메이트" ? "person living in" : "person hiring for"} ${s.job} at ${s.place}, Australia.
You are having a real, spoken ${s.id === "sharehouse" ? "chat with someone who wants a room" : "job interview"} with a Korean working holiday maker whose English is beginner-to-intermediate.
Personality: ${s.persona}.
Topics to cover naturally, one at a time: ${s.topics.join("; ")}.

Rules:
- Speak natural Australian English, but keep it simple and clear. 1-2 short sentences, max 30 words.
- React briefly to what they just said (like a real person), then ask ONE question.
- If their answer is very short or unclear, gently ask a follow-up or rephrase more simply. If it's empty or makes no sense, say you didn't catch that and ask again.
- NEVER ask again about something already asked or already answered in the conversation (check the whole conversation, including details they volunteered). Move on to a NEW topic from the list.
- If they ask you to repeat or say they didn't understand, repeat ONLY your last question in simpler words (don't start a new or old topic).
- Never correct their English and never speak Korean. Stay in character.
- After about 6-8 questions${mustEnd ? " (you must finish NOW)" : ""}, wrap up warmly: tell them what happens next (e.g. trial shift, call back) and say goodbye. Then set "done" to true.
Reply ONLY with JSON: {"reply": "...", "done": false, "mood": "smile" | "neutral" | "thinking"}`;
  const askedBefore = turns.filter((t) => t.role === "ai").map((t, i) => `${i + 1}. ${t.text}`).join("\n");
  const text = await ask(
    "claude-haiku-5-5",
    system,
    `Conversation so far:\n${transcriptText(turns, s)}\n\nThings you already said/asked (don't repeat these topics):\n${askedBefore}\n\nYour next line as ${s.name}:`,
    300,
  );
  const data = parseJson<{ reply?: string; done?: boolean; mood?: string }>(text);
  const reply = (data?.reply ?? text.replace(/[{}"]/g, "")).trim().slice(0, 400);
  return {
    reply,
    done: Boolean(data?.done) || mustEnd,
    mood: data?.mood === "thinking" || data?.mood === "neutral" ? data.mood : "smile",
  };
}

/** 끝난 뒤 한국어 코칭 리포트 */
export async function interviewFeedback(s: Scenario, turns: Turn[]): Promise<InterviewFeedback | null> {
  const system = `당신은 호주 워킹홀리데이를 준비하는 한국인 학생을 가르치는 영어 면접 코치입니다.
학생이 '${s.title}' 상황(${s.place}, 면접관 ${s.name})으로 AI와 말하기 연습을 했습니다. 학생 말은 음성 인식으로 받아 적은 거라 철자·문장부호 실수는 무시하세요.

평가해서 JSON으로만 답하세요:
{"result": "합격이에요! 🎉" 또는 "아쉽게 불합격 😢" 또는 "조금만 더! 💪",
 "score": 0-100,
 "scores": {"communication": 0-100, "answers": 0-100, "grammar": 0-100},
 "summary_ko": "2~3문장 총평 (친근한 존댓말)",
 "good_ko": ["잘한 점 1~3개"],
 "fixes": [{"you_said": "학생이 실제로 한 말 그대로", "better": "더 자연스러운 호주식 답변 (짧게)", "why_ko": "왜 더 나은지 한 줄"}]  (가장 도움 될 것 2~4개),
 "expressions": [{"en": "이 면접에서 쓰면 좋은 표현", "ko": "뜻"}] (3~5개)}

기준: communication = 대화가 이어지는지·자신감, answers = 질문에 맞게 구체적으로 답했는지, grammar = 문법·단어. 초중급 학생이니 너무 박하지 않게, 하지만 솔직하게.`;
  const text = await ask("claude-sonnet-5-5", system, transcriptText(turns, s), 2500);
  const data = parseJson<InterviewFeedback>(text);
  if (!data || typeof data.score !== "number") return null;
  return {
    result: String(data.result ?? ""),
    score: Math.max(0, Math.min(100, Math.round(data.score))),
    scores: {
      communication: Math.round(data.scores?.communication ?? 0),
      answers: Math.round(data.scores?.answers ?? 0),
      grammar: Math.round(data.scores?.grammar ?? 0),
    },
    summary_ko: String(data.summary_ko ?? ""),
    good_ko: (data.good_ko ?? []).slice(0, 3).map(String),
    fixes: (data.fixes ?? []).slice(0, 4),
    expressions: (data.expressions ?? []).slice(0, 5),
  };
}
