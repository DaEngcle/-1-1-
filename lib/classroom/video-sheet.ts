import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";

/**
 * 강의 링크 구글 시트 → 레슨 영상 자동 반영
 * 시트 형식: B열 "Day 01 - 제목" 또는 "Lv1.0 - Day 01-05 drill", C열 Live 녹화, E열 VOD.
 * VOD가 있으면 VOD, 없으면 Live. 시트는 '링크가 있는 모든 사용자: 뷰어'로 공유돼 있어야 한다.
 */

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  row.push(cell);
  rows.push(row);
  return rows;
}

const youTubeId = (url: string) =>
  url.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/live\/)([\w-]{11})/)?.[1] ?? null;

export function sheetCsvUrl(sheet: string) {
  const id = sheet.match(/\/spreadsheets\/d\/([\w-]+)/)?.[1] ?? (/^[\w-]{20,}$/.test(sheet) ? sheet : null);
  if (!id) return null;
  const gid = sheet.match(/[#?&]gid=(\d+)/)?.[1] ?? "0";
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
}

export function parseVideoSheet(csv: string) {
  const days = new Map<number, string>();
  const drills = new Map<number, string>(); // 시작 Day → 영상
  for (const cols of parseCsv(csv)) {
    const label = cols.find((c) => /day\s*\d+/i.test(c)) ?? "";
    const links = cols.map((c) => youTubeId(c.trim()));
    // 링크 칸 중 마지막(VOD)이 있으면 우선, 없으면 앞쪽(Live)
    const chosen = [...links].reverse().find(Boolean);
    if (!label || !chosen) continue;
    const url = `https://youtu.be/${chosen}`;
    const drill = label.match(/day\s*(\d+)\s*[-~]\s*\d+\s*drill/i);
    if (drill) drills.set(Number(drill[1]), url);
    else {
      const day = label.match(/day\s*(\d+)\s*-/i);
      if (day) days.set(Number(day[1]), url);
    }
  }
  return { days, drills };
}

export type SyncResult = { ok: true; changed: number; checked: number } | { ok: false; message: string };

/** 시트를 읽어 바뀐 영상만 업데이트. force=false면 시트를 1시간 캐시 */
export async function syncCourseVideos(courseId: string, { force = false } = {}): Promise<SyncResult> {
  const supabase = createServerSupabaseClient();
  const { data: course } = await supabase.from("courses").select("video_sheet").eq("id", courseId).maybeSingle();
  const csvUrl = course?.video_sheet ? sheetCsvUrl(course.video_sheet) : null;
  if (!csvUrl) return { ok: false, message: "연결된 시트가 없어요." };

  let csv: string;
  try {
    const res = await fetch(csvUrl, force ? { cache: "no-store" } : { next: { revalidate: 3600 } });
    csv = await res.text();
    if (!res.ok || csv.trimStart().startsWith("<")) {
      return { ok: false, message: "시트를 열 수 없어요. 공유를 '링크가 있는 모든 사용자 · 뷰어'로 바꿔주세요." };
    }
  } catch {
    return { ok: false, message: "시트를 불러오지 못했어요. 잠시 후 다시 시도해주세요." };
  }

  const { days, drills } = parseVideoSheet(csv);
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, kind, day_number, title, video_url")
    .eq("course_id", courseId);
  let changed = 0;
  for (const l of lessons ?? []) {
    let url: string | undefined;
    if (l.kind === "day" && l.day_number != null) url = days.get(l.day_number);
    else {
      const start = (l.title as string).match(/day\s*(\d+)\s*[~-]\s*\d+\s*drill/i)?.[1];
      if (start) url = drills.get(Number(start));
    }
    if (url && url !== l.video_url) {
      await supabase.from("lessons").update({ video_url: url }).eq("id", l.id);
      changed++;
    }
  }
  return { ok: true, changed, checked: days.size + drills.size };
}
