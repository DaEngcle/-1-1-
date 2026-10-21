import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { AssessmentResult } from "./azure-speech";

const SYSTEM_PROMPT = `당신은 호주 워킹홀리데이를 준비하는 한국인 학생들을 가르치는 영어 발음 코치입니다.
학생이 쉐도잉한 문장의 발음 평가 결과(점수 0~100, 단어·음소별 정확도)를 보고 한국어로 짧은 코칭 피드백을 씁니다.

작성 원칙:
- 3~5문장, 친근한 존댓말. 먼저 잘한 점 하나를 구체적으로 칭찬하세요.
- 가장 점수가 낮은 단어 1~2개를 골라, 한국인이 흔히 하는 실수와 연결해 입모양·혀 위치를 쉽게 설명하세요 (예: th는 혀끝을 이 사이로).
- 유창성·운율 점수가 낮으면 연음, 강세, 끊어 읽기 팁을 하나 주세요.
- 발음 기호(IPA) 대신 한국어 소리로 비유하세요.
- 마크다운 없이 평문으로만 쓰세요.`;

let client: Anthropic | null = null;

/** 발음 평가 결과로 한국어 코칭 피드백 생성. API 키가 없거나 실패하면 null */
export async function generateCoachFeedback(
  sentence: string,
  result: AssessmentResult,
): Promise<string | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  client ??= new Anthropic();

  const summary = {
    reference: sentence,
    recognized: result.recognizedText,
    scores: {
      overall: result.overall,
      accuracy: result.accuracy,
      fluency: result.fluency,
      completeness: result.completeness,
      prosody: result.prosody,
    },
    words: result.words.map((w) => ({
      word: w.word,
      accuracy: w.accuracy,
      error: w.errorType,
      weakPhonemes: w.phonemes
        .filter((p) => p.accuracy < 70)
        .map((p) => `${p.phoneme}(${Math.round(p.accuracy)})`),
    })),
  };

  try {
    const response = await client.beta.messages.create({
      model: "claude-sonnet-5-5",
      max_tokens: 2000,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: JSON.stringify(summary) }],
    });
    if (response.stop_reason === "refusal") return null;
    const text = response.content
      .flatMap((b) => (b.type === "text" ? [b.text] : []))
      .join("")
      .trim();
    return text || null;
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error(`코칭 피드백 생성 실패 (${error.status}):`, error.message);
    } else {
      console.error("코칭 피드백 생성 실패:", error);
    }
    return null;
  }
}
