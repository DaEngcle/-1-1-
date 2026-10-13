/** 유튜브 링크면 embed URL, 아니면 null */
export function toYouTubeEmbedUrl(url: string | null | undefined) {
  if (!url) return null;
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname === "youtu.be") id = u.pathname.slice(1);
    else if (u.hostname.endsWith("youtube.com")) {
      id = u.searchParams.get("v") ?? u.pathname.match(/\/(?:embed|live|shorts)\/([^/]+)/)?.[1] ?? null;
    }
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
  } catch {
    return null;
  }
}
