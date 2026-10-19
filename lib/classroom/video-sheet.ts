import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";

/**
 * 강의 링크 시트에서 복사한 줄 → 레슨 영상 교체 (시트는 비공개 그대로 둔다)
 * 줄 형식: "Day 01 - 제목" 또는 "Lv1.0 - Day 01-05 drill", 그 뒤에 Live 녹화, VOD 링크.
 * VOD가 있으면 VOD, 없으면 Live.
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

export function parseVideoSheet(csv: string) {
  // 구글 시트에서 복사해 붙여넣으면 탭으로 구분된다
  if (csv.includes("\t")) csv = csv.split(/\r?\n/).map((l) => l.split("\t").map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
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

/** 붙여넣은 시트 내용으로 바뀐 영상만 업데이트 */
export async function applyVideoRows(courseId: string, text: string): Promise<SyncResult> {
  const { days, drills } = parseVideoSheet(text);
  if (days.size + drills.size === 0) return { ok: false, message: "Day와 유튜브 링크가 있는 줄을 찾지 못했어요." };
  return { ok: true, ...(await updateLessons(courseId, days, drills)), checked: days.size + drills.size };
}

async function updateLessons(courseId: string, days: Map<number, string>, drills: Map<number, string>) {
  const supabase = createServerSupabaseClient();
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
  return { changed };
}

export type SyncResult = { ok: true; changed: number; checked: number } | { ok: false; message: string };
