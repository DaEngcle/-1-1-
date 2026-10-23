import "server-only";
import { createHash } from "node:crypto";
import { createServerSupabaseClient } from "@/lib/supabase";
import { TTS_VOICES, hasAuAccent, synthesizeSpeech, type TtsSpeed, type TtsVoice } from "./azure-speech";

/** 원어민 음성 mp3. 같은 문장·속도·목소리는 Storage(tts 버킷)에 한 번만 만들어 둔다 */
export async function getSpeechAudio(text: string, speed: TtsSpeed, voice: TtsVoice = "a") {
  const hash = createHash("sha256").update(`${TTS_VOICES[voice]}${hasAuAccent(voice) ? "|en-AU" : ""}|${speed}|${text}`).digest("hex");
  const path = `${hash}.mp3`;
  const supabase = createServerSupabaseClient();

  const cached = await supabase.storage.from("tts").download(path);
  if (cached.data) return new Uint8Array(await cached.data.arrayBuffer());

  const audio = await synthesizeSpeech(text, speed, voice);
  // 대신 쓴 목소리는 저장하지 않는다 (나중에 원래 목소리로 다시 만들 수 있게)
  if (audio.fellBack) return audio;
  await supabase.storage.from("tts").upload(path, audio, { contentType: "audio/mpeg", upsert: true });
  return audio;
}

export function mp3Response(audio: Uint8Array & { fellBack?: boolean }) {
  return new Response(Buffer.from(audio), {
    headers: audio.fellBack
      ? { "Content-Type": "audio/mpeg", "Cache-Control": "no-store", "X-Voice-Fallback": "1" }
      : { "Content-Type": "audio/mpeg", "Cache-Control": "private, max-age=604800, immutable" },
  });
}
