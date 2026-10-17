import "server-only";
import { createHash } from "node:crypto";
import { createServerSupabaseClient } from "@/lib/supabase";
import { TTS_VOICES, synthesizeSpeech, type TtsSpeed, type TtsVoice } from "./azure-speech";

/** 원어민 음성 mp3. 같은 문장·속도·목소리는 Storage(tts 버킷)에 한 번만 만들어 둔다 */
export async function getSpeechAudio(text: string, speed: TtsSpeed, voice: TtsVoice = "a") {
  const hash = createHash("sha256").update(`${TTS_VOICES[voice]}|${speed}|${text}`).digest("hex");
  const path = `${hash}.mp3`;
  const supabase = createServerSupabaseClient();

  const cached = await supabase.storage.from("tts").download(path);
  if (cached.data) return new Uint8Array(await cached.data.arrayBuffer());

  const audio = await synthesizeSpeech(text, speed, voice);
  await supabase.storage.from("tts").upload(path, audio, { contentType: "audio/mpeg", upsert: true });
  return audio;
}

export function mp3Response(audio: Uint8Array) {
  return new Response(Buffer.from(audio), {
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "private, max-age=604800, immutable" },
  });
}
