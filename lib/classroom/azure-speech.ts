import "server-only";

export const TTS_VOICE = "en-AU-FreyaNeural";
// 쉐도잉·대화 듣기용 두 목소리 (A: 여성, B: 남성). 예전엔 Natasha·William (AI 같다는 의견이 있어 바꿈)
export const TTS_VOICES = {
  a: "en-AU-FreyaNeural",
  // Andrew(다국어 목소리)에게 호주 억양으로 읽게 한다 (아래 AU_ACCENT)
  b: "en-US-AndrewMultilingualNeural",
  // AI 면접관 목소리 (호주 억양)
  freya: "en-AU-FreyaNeural", // (Carly는 아이 목소리라 쓰지 않는다)
  duncan: "en-AU-DuncanNeural",
  annette: "en-AU-AnnetteNeural",
  ken: "en-AU-KenNeural",
  elsie: "en-AU-ElsieNeural",
  tina: "en-AU-TinaNeural",
  tim: "en-AU-TimNeural",
  // 더 자연스러운 목소리 후보 (선생님 '목소리 비교' 화면에서 들어보고 고른다)
  ava_hd: "en-US-Ava:DragonHDLatestNeural",
  andrew_hd: "en-US-Andrew:DragonHDLatestNeural",
  emma_hd: "en-US-Emma:DragonHDLatestNeural",
  brian_hd: "en-US-Brian:DragonHDLatestNeural",
  ava_ml: "en-US-AvaMultilingualNeural",
  andrew_ml: "en-US-AndrewMultilingualNeural",
  andrew_au: "en-US-AndrewMultilingualNeural",
  ava_au: "en-US-AvaMultilingualNeural",
  // AI 면접관용: 사람 같은 다국어 목소리 + 호주 억양
  emma_au: "en-US-EmmaMultilingualNeural",
  brian_au: "en-US-BrianMultilingualNeural",
  serena_au: "en-US-SerenaMultilingualNeural",
  phoebe_au: "en-US-PhoebeMultilingualNeural",
  davis_au: "en-US-DavisMultilingualNeural",
} as const;
/** 다국어 목소리에 호주 억양(en-AU)을 입힐 목소리들 */
export function hasAuAccent(voice: string) {
  return voice === "b" || voice.endsWith("_au");
}
/** 새 목소리가 안 되면(지역 미지원 등) 대신 쓸 기존 호주 목소리 */
const FALLBACK: Partial<Record<TtsVoiceKey, TtsVoiceKey>> = {
  b: "duncan",
  ava_au: "freya",
  andrew_au: "duncan",
  emma_au: "annette",
  brian_au: "ken",
  serena_au: "elsie",
  phoebe_au: "tina",
  davis_au: "tim",
};
type TtsVoiceKey = keyof typeof TTS_VOICES;
export type TtsVoice = keyof typeof TTS_VOICES;
export const TTS_SPEEDS = { normal: "0%", slow: "-25%" } as const;
export type TtsSpeed = keyof typeof TTS_SPEEDS;

function getConfig() {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  return key && region ? { key, region } : null;
}

export function isAzureConfigured() {
  return getConfig() !== null;
}

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Azure 신경망 TTS로 mp3 생성 */
export async function synthesizeSpeech(
  text: string,
  speed: TtsSpeed,
  voice: TtsVoice = "a",
  opts: { noFallback?: boolean } = {},
): Promise<Uint8Array & { fellBack?: boolean }> {
  const config = getConfig();
  if (!config) throw new Error("Azure Speech가 설정되지 않았습니다.");

  const name = TTS_VOICES[voice];
  const lang = name.slice(0, 5);
  // 보통 속도는 그대로 읽게 둔다 (속도 태그를 안 씌우는 게 더 자연스럽다)
  let body = speed === "normal" ? escapeXml(text) : `<prosody rate="${TTS_SPEEDS[speed]}">${escapeXml(text)}</prosody>`;
  if (hasAuAccent(voice)) body = `<lang xml:lang="en-AU">${body}</lang>`;
  const ssml = `<speak version="1.0" xml:lang="${lang}"><voice name="${name}">${body}</voice></speak>`;

  const res = await fetch(
    `https://${config.region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": config.key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "dingle-classroom",
      },
      body: ssml,
    },
  );
  if (!res.ok) {
    const detail = `${res.status} ${await res.text()}`;
    const fallback = FALLBACK[voice];
    if (fallback && !opts.noFallback) {
      console.error(`Azure TTS ${voice} 실패 → ${fallback}로 대신: ${detail}`);
      const audio = await synthesizeSpeech(text, speed, fallback);
      return Object.assign(audio, { fellBack: true });
    }
    throw new Error(`Azure TTS 실패: ${detail}`);
  }
  return new Uint8Array(await res.arrayBuffer());
}

export interface WordResult {
  word: string;
  accuracy: number;
  /** None | Mispronunciation | Omission | Insertion */
  errorType: string;
  phonemes: { phoneme: string; accuracy: number }[];
}

export interface AssessmentResult {
  recognizedText: string;
  overall: number;
  accuracy: number;
  fluency: number;
  completeness: number;
  prosody: number | null;
  words: WordResult[];
}

type AzureScores = {
  AccuracyScore?: number;
  FluencyScore?: number;
  CompletenessScore?: number;
  PronScore?: number;
  ProsodyScore?: number;
  ErrorType?: string;
};

type AzureWord = AzureScores & {
  Word: string;
  PronunciationAssessment?: AzureScores;
  Phonemes?: (AzureScores & {
    Phoneme: string;
    PronunciationAssessment?: AzureScores;
  })[];
};

/**
 * Azure 발음 평가 (짧은 음성 REST API, 60초 이하).
 * audio: 16kHz 모노 16bit PCM WAV. 운율(prosody) 평가는 en-US에서만 지원.
 */
export async function assessPronunciation(
  audio: Uint8Array,
  referenceText: string,
): Promise<AssessmentResult> {
  const config = getConfig();
  if (!config) throw new Error("Azure Speech가 설정되지 않았습니다.");

  const params = Buffer.from(
    JSON.stringify({
      ReferenceText: referenceText,
      GradingSystem: "HundredMark",
      Granularity: "Phoneme",
      Dimension: "Comprehensive",
      EnableMiscue: true,
      EnableProsodyAssessment: true,
    }),
  ).toString("base64");

  const res = await fetch(
    `https://${config.region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": config.key,
        "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
        "Pronunciation-Assessment": params,
        Accept: "application/json",
      },
      body: Buffer.from(audio),
    },
  );
  if (!res.ok) {
    throw new Error(`Azure 발음 평가 실패: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as {
    RecognitionStatus: string;
    NBest?: (AzureScores & {
      Display?: string;
      PronunciationAssessment?: AzureScores;
      Words?: AzureWord[];
    })[];
  };
  const best = data.NBest?.[0];
  if (data.RecognitionStatus !== "Success" || !best) {
    throw new Error(`음성을 인식하지 못했어요 (${data.RecognitionStatus})`);
  }

  // API 버전에 따라 점수가 PronunciationAssessment 안/밖에 있음
  const scores = { ...best, ...best.PronunciationAssessment };
  const pick = (s: AzureScores & { PronunciationAssessment?: AzureScores }) => ({
    ...s,
    ...s.PronunciationAssessment,
  });

  return {
    recognizedText: best.Display ?? "",
    overall: scores.PronScore ?? 0,
    accuracy: scores.AccuracyScore ?? 0,
    fluency: scores.FluencyScore ?? 0,
    completeness: scores.CompletenessScore ?? 0,
    prosody: scores.ProsodyScore ?? null,
    words: (best.Words ?? []).map((w) => {
      const ws = pick(w);
      return {
        word: w.Word,
        accuracy: ws.AccuracyScore ?? 0,
        errorType: ws.ErrorType ?? "None",
        phonemes: (w.Phonemes ?? []).map((p) => ({
          phoneme: p.Phoneme,
          accuracy: pick(p).AccuracyScore ?? 0,
        })),
      };
    }),
  };
}

/** 음성을 글자로 받아 적기 (자유 발화용) */
export async function transcribe(audio: Uint8Array): Promise<string> {
  const config = getConfig();
  if (!config) throw new Error("Azure Speech가 설정되지 않았습니다.");
  const res = await fetch(
    `https://${config.region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": config.key,
        "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
        Accept: "application/json",
      },
      body: Buffer.from(audio),
    },
  );
  if (!res.ok) throw new Error(`Azure 받아쓰기 실패: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { RecognitionStatus: string; NBest?: { Display?: string }[] };
  return data.RecognitionStatus === "Success" ? (data.NBest?.[0]?.Display ?? "").trim() : "";
}

/**
 * 대본 없는 자유 발화 평가: 먼저 받아 적고, 받아 적은 문장을 기준으로 발음·유창성·억양을 채점.
 * 아무 말도 인식되지 않으면 null.
 */
export async function assessFreeSpeech(audio: Uint8Array) {
  const transcript = await transcribe(audio);
  if (!transcript) return null;
  const result = await assessPronunciation(audio, transcript);
  return { ...result, transcript };
}
