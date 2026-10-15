import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getVerifiedStudent, isTeacher } from "@/lib/classroom/dal";
import {
  TTS_SPEEDS,
  TTS_VOICE,
  isAzureConfigured,
  synthesizeSpeech,
  type TtsSpeed,
} from "@/lib/classroom/azure-speech";

const MAX_TEXT_LENGTH = 300;

/**
 * 원어민 음성(mp3) 반환. GET /api/tts?text=...&speed=normal|slow
 * 로그인한 학생/선생님만 사용 가능. 생성된 음성은 Storage(tts 버킷)에 캐시.
 * Azure 미설정 시 503 → 클라이언트가 브라우저 내장 음성으로 대체.
 */
export async function GET(request: NextRequest) {
  if (!(await isTeacher()) && !(await getVerifiedStudent())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isAzureConfigured()) {
    return NextResponse.json({ error: "tts_unavailable" }, { status: 503 });
  }

  const text = (request.nextUrl.searchParams.get("text") ?? "").trim();
  const speedParam = request.nextUrl.searchParams.get("speed") ?? "normal";
  if (!text || text.length > MAX_TEXT_LENGTH || !(speedParam in TTS_SPEEDS)) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const speed = speedParam as TtsSpeed;

  const hash = createHash("sha256")
    .update(`${TTS_VOICE}|${speed}|${text}`)
    .digest("hex");
  const path = `${hash}.mp3`;
  const supabase = createServerSupabaseClient();

  let audio: Uint8Array;
  const cached = await supabase.storage.from("tts").download(path);
  if (cached.data) {
    audio = new Uint8Array(await cached.data.arrayBuffer());
  } else {
    try {
      audio = await synthesizeSpeech(text, speed);
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: "tts_failed" }, { status: 502 });
    }
    await supabase.storage
      .from("tts")
      .upload(path, audio, { contentType: "audio/mpeg", upsert: true });
  }

  return new NextResponse(Buffer.from(audio), {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "private, max-age=604800, immutable",
    },
  });
}
