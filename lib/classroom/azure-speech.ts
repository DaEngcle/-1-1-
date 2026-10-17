import "server-only";

export const TTS_VOICE = "en-AU-NatashaNeural";
// 대화 듣기용 두 목소리 (A: 여성, B: 남성)
export const TTS_VOICES = { a: "en-AU-NatashaNeural", b: "en-AU-WilliamNeural" } as const;
export type TtsVoice = keyof typeof TTS_VOICES;
export const TTS_SPEEDS = { normal: "0%", slow: "-35%" } as const;
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
export async function synthesizeSpeech(text: string, speed: TtsSpeed, voice: TtsVoice = "a") {
  const config = getConfig();
  if (!config) throw new Error("Azure Speech가 설정되지 않았습니다.");

  const ssml =
    `<speak version="1.0" xml:lang="en-AU"><voice name="${TTS_VOICES[voice]}">` +
    `<prosody rate="${TTS_SPEEDS[speed]}">${escapeXml(text)}</prosody>` +
    `</voice></speak>`;

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
    throw new Error(`Azure TTS 실패: ${res.status} ${await res.text()}`);
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
