import type { NextConfig } from "next";

// PostHog 지역: 가입할 때 고른 곳 (기본 미국, "eu"면 유럽)
const posthogRegion = process.env.NEXT_PUBLIC_POSTHOG_HOST === "eu" ? "eu" : "us";

const nextConfig: NextConfig = {
  // PostHog 수집 요청을 우리 도메인으로 받아 넘긴다 (광고 차단기 대비)
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: `https://${posthogRegion}-assets.i.posthog.com/static/:path*` },
      { source: "/ingest/:path*", destination: `https://${posthogRegion}.i.posthog.com/:path*` },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
