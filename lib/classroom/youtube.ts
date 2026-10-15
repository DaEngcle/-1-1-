/** 유튜브 링크에서 영상 ID 추출. 유튜브가 아니면 null */
export function youTubeVideoId(url: string | null | undefined) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.hostname.endsWith("youtube.com")) {
      return u.searchParams.get("v") ?? u.pathname.match(/\/(?:embed|live|shorts)\/([^/]+)/)?.[1] ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

/** 유튜브 링크면 embed URL, 아니면 null */
export function toYouTubeEmbedUrl(url: string | null | undefined) {
  const id = youTubeVideoId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
}

/** 재생목록 링크(또는 ID)에서 재생목록 ID 추출 */
export function youTubePlaylistId(input: string) {
  const trimmed = input.trim();
  if (/^[\w-]{10,64}$/.test(trimmed)) return trimmed;
  try {
    return new URL(trimmed).searchParams.get("list");
  } catch {
    return null;
  }
}

export interface PlaylistVideo {
  videoId: string;
  title: string;
}

/** 재생목록 페이지에 들어있는 영상 목록 (최대 100개) */
async function fetchFromPlaylistPage(playlistId: string): Promise<PlaylistVideo[]> {
  const res = await fetch(`https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`, {
    headers: { "Accept-Language": "ko,en;q=0.8" },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const html = await res.text();
  const match = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
  if (!match) return [];

  const videos: PlaylistVideo[] = [];
  const walk = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!node || typeof node !== "object") return;
    const obj = node as Record<string, unknown>;
    const lockup = obj.lockupViewModel as
      | {
          contentType?: string;
          contentId?: string;
          metadata?: { lockupMetadataViewModel?: { title?: { content?: string } } };
        }
      | undefined;
    if (lockup?.contentType === "LOCKUP_CONTENT_TYPE_VIDEO" && typeof lockup.contentId === "string") {
      videos.push({
        videoId: lockup.contentId,
        title: lockup.metadata?.lockupMetadataViewModel?.title?.content ?? lockup.contentId,
      });
    }
    const legacy = obj.playlistVideoRenderer as
      | { videoId?: string; title?: { runs?: { text?: string }[] } }
      | undefined;
    if (typeof legacy?.videoId === "string") {
      videos.push({ videoId: legacy.videoId, title: legacy.title?.runs?.[0]?.text ?? legacy.videoId });
    }
    Object.values(obj).forEach(walk);
  };
  try {
    walk(JSON.parse(match[1]));
  } catch {
    return [];
  }
  return videos;
}

/** 재생목록 RSS (최대 15개, 페이지 분석이 실패했을 때 대비용) */
async function fetchFromPlaylistFeed(playlistId: string): Promise<PlaylistVideo[]> {
  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  const xml = await res.text();
  const decode = (s: string) =>
    s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  return [...xml.matchAll(/<entry>[\s\S]*?<yt:videoId>([\w-]+)<\/yt:videoId>[\s\S]*?<title>([\s\S]*?)<\/title>/g)].map(
    (m) => ({ videoId: m[1], title: decode(m[2]) }),
  );
}

/** 재생목록 영상 목록 (재생목록 순서, 중복 제거) */
export async function fetchPlaylistVideos(playlistId: string): Promise<PlaylistVideo[]> {
  let videos = await fetchFromPlaylistPage(playlistId).catch(() => []);
  if (videos.length === 0) videos = await fetchFromPlaylistFeed(playlistId).catch(() => []);
  const seen = new Set<string>();
  return videos.filter((v) => !seen.has(v.videoId) && seen.add(v.videoId));
}
