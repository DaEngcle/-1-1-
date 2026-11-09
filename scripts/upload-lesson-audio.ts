import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServerSupabaseClient } from "../lib/supabase";

/**
 * 강의 영상 파일 → 음성(.m4a) → lesson-audio 버킷 업로드 → lessons.audio_path 기록.
 *
 *   npm run audio:upload -- level1 "<강의 영상 폴더>"          (미리보기만)
 *   npm run audio:upload -- level1 "<강의 영상 폴더>" --apply  (실제 업로드)
 *
 * - 파일 이름의 "Day 05 / Day05 / Day5"로 Day를 찾는다. "Day 23, 24" 같은 합본은 건너뛴다.
 * - 같은 Day 파일이 여럿이면 가장 최근에 수정한 파일.
 * - 원본 파일은 읽기만 한다. 변환본은 임시 폴더에 만든다.
 * - 짧은 클립(교재 영상 등)이 강의로 올라가지 않게 MIN_MINUTES보다 짧은 파일은 건너뛴다.
 */
const MIN_MINUTES = 3;
const VIDEO = /\.(mp4|mov|m4v|mkv)$/i;

function probeSeconds(file: string) {
  const out = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]);
  return Number(out.toString().trim());
}

async function main() {
  const [courseId, dir, flag] = process.argv.slice(2);
  if (!courseId || !dir) throw new Error('사용법: npm run audio:upload -- <course_id> "<폴더>" [--apply]');
  const apply = flag === "--apply";

  const byDay = new Map<number, { file: string; mtime: number }[]>();
  const skipped: string[] = [];
  for (const name of readdirSync(dir).sort()) {
    const file = join(dir, name);
    if (!VIDEO.test(name) || !statSync(file).isFile()) continue;
    if (/day\s*\d+\s*[,&~-]\s*\d+/i.test(name)) {
      skipped.push(`${name} (합본)`);
      continue;
    }
    const m = name.match(/^day\s*0*(\d{1,2})(?!\d)/i);
    if (!m) {
      skipped.push(`${name} (Day 번호 없음)`);
      continue;
    }
    const day = Number(m[1]);
    byDay.set(day, [...(byDay.get(day) ?? []), { file, mtime: statSync(file).mtimeMs }]);
  }

  const supabase = createServerSupabaseClient();
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("id, day_number, video_url")
    .eq("course_id", courseId)
    .eq("kind", "day")
    .eq("is_published", true)
    .not("video_url", "is", null);
  if (error) throw error;
  const lessonOf = new Map((lessons ?? []).filter((l) => l.video_url).map((l) => [l.day_number as number, l.id as string]));

  const outDir = join(tmpdir(), "lesson-audio", courseId);
  mkdirSync(outDir, { recursive: true });

  for (const [day, files] of [...byDay].sort((a, b) => a[0] - b[0])) {
    const pick = files.sort((a, b) => b.mtime - a.mtime)[0];
    const label = `Day ${String(day).padStart(2, "0")}`;
    if (files.length > 1) console.log(`${label}: 중복 ${files.length}개 → 최신 파일 ${pick.file}`);
    const lessonId = lessonOf.get(day);
    if (!lessonId) {
      skipped.push(`${pick.file} (공개된 영상 레슨 없음)`);
      continue;
    }
    const seconds = probeSeconds(pick.file);
    if (!(seconds >= MIN_MINUTES * 60)) {
      skipped.push(`${pick.file} (${Math.round(seconds)}초, 강의라기엔 너무 짧음)`);
      continue;
    }
    const path = `${courseId}/day${String(day).padStart(2, "0")}.m4a`;
    if (!apply) {
      console.log(`${label}: ${pick.file} (${Math.round(seconds / 60)}분) → ${path}`);
      continue;
    }
    const out = join(outDir, `day${String(day).padStart(2, "0")}.m4a`);
    execFileSync("ffmpeg", ["-y", "-v", "error", "-i", pick.file, "-vn", "-ac", "1", "-ar", "16000", "-c:a", "aac", "-b:a", "24k", "-movflags", "+faststart", out]);
    const up = await supabase.storage
      .from("lesson-audio")
      .upload(path, readFileSync(out), { contentType: "audio/mp4", upsert: true });
    if (up.error) throw new Error(`${label} 업로드 실패: ${up.error.message}`);
    const { error: e2 } = await supabase.from("lessons").update({ audio_path: path }).eq("id", lessonId);
    if (e2) throw e2;
    console.log(`${label}: 업로드 완료 ${path} (${(statSync(out).size / 1e6).toFixed(1)}MB)`);
  }

  if (skipped.length) console.log(`\n건너뜀 ${skipped.length}개:\n- ${skipped.join("\n- ")}`);
  if (!apply) console.log("\n미리보기였어요. 실제로 올리려면 끝에 --apply");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
