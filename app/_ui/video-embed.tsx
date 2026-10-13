import { toYouTubeEmbedUrl } from "@/lib/classroom/youtube";

export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const embed = toYouTubeEmbedUrl(url);
  if (!embed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-6 text-sm font-semibold text-white"
      >
        ▶ {title} 영상 열기
      </a>
    );
  }
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
      <iframe
        src={embed}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
