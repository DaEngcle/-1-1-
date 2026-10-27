import "server-only";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM = `You are a strict English speaking examiner for Korean working-holiday students going to Australia.
You get ONE spoken answer (speech-to-text transcript, so ignore punctuation and filler like "um").
Rate the LANGUAGE only (pronunciation is graded separately), 0-100:
- grammar accuracy (tense, articles, word order, agreement)
- vocabulary range and naturalness
- task completion: did they actually answer the question with relevant content?
Anchors: 0-20 = no real answer / one or two words / off-topic. 21-40 = broken phrases, many basic errors.
41-60 = simple sentences, frequent errors but understandable. 61-75 = mostly correct simple sentences, some errors.
76-88 = accurate, natural, some complex sentences. 89-100 = near-native, rich and precise.
Be strict: a short answer can never score above 50, and repeated basic errors keep it under 60.
Reply with JSON only: {"language": number, "note_ko": "한 줄 한국어 코멘트"}`;

let client: Anthropic | null = null;

/** 레벨테스트 말하기 한 문항의 문법·어휘·과제 수행 점수 (실패하면 null → 기존 방식으로 채점) */
export async function gradeSpeakingLanguage(
  question: string,
  transcript: string,
): Promise<{ language: number; note: string } | null> {
  if (!process.env.ANTHROPIC_API_KEY || !transcript.trim()) return null;
  client ??= new Anthropic();
  try {
    const response = await client.beta.messages.create({
      model: "claude-sonnet-5-5",
      max_tokens: 300,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM,
      messages: [{ role: "user", content: `Question: ${question}\nAnswer transcript: ${transcript.slice(0, 1500)}` }],
    });
    const text = response.content
      .flatMap((b) => (b.type === "text" ? [b.text] : []))
      .join("");
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)) as { language?: unknown; note_ko?: unknown };
    const n = Number(json.language);
    if (!Number.isFinite(n)) return null;
    return { language: Math.max(0, Math.min(100, Math.round(n))), note: String(json.note_ko ?? "").slice(0, 200) };
  } catch (error) {
    console.error("레벨테스트 언어 채점 실패:", error);
    return null;
  }
}
