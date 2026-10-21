import { TIERS, type TierId } from "@/lib/classroom/league";

/** 롤 느낌 티어 엠블럼 (방패 + 보석, 높은 티어는 날개·왕관) */
export function TierEmblem({ tier, className = "h-12 w-12", dim = false }: { tier: TierId; className?: string; dim?: boolean }) {
  const t = TIERS.find((x) => x.id === tier)!;
  const level = TIERS.findIndex((x) => x.id === tier);
  const id = `tier-${tier}`;
  return (
    <svg viewBox="0 0 100 100" className={`${className} ${dim ? "opacity-30 grayscale" : ""}`} aria-label={t.name} role="img">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={t.to} />
          <stop offset="1" stopColor={t.from} />
        </linearGradient>
        <linearGradient id={`${id}-gem`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor={t.to} />
        </linearGradient>
      </defs>
      {/* 날개 (플래티넘 이상) */}
      {level >= 4 && (
        <g fill={`url(#${id}-g)`} opacity="0.9">
          <path d="M22 40 Q4 34 2 18 Q14 26 26 28Z" />
          <path d="M78 40 Q96 34 98 18 Q86 26 74 28Z" />
          {level >= 6 && <path d="M20 54 Q2 52 0 38 Q12 44 24 44Z" />}
          {level >= 6 && <path d="M80 54 Q98 52 100 38 Q88 44 76 44Z" />}
        </g>
      )}
      {/* 왕관 (마스터 이상) */}
      {level >= 7 && <path d="M34 14 L40 4 L50 12 L60 4 L66 14Z" fill="#FCD34D" stroke="#B45309" strokeWidth="1.5" />}
      {/* 방패 */}
      <path
        d="M50 12 L82 24 L80 56 Q76 80 50 94 Q24 80 20 56 L18 24Z"
        fill={`url(#${id}-g)`}
        stroke={t.ink}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M50 20 L74 29 L72 55 Q69 73 50 85 Q31 73 28 55 L26 29Z" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="2" />
      {/* 가운데 보석 */}
      <path d="M50 34 L64 48 L50 66 L36 48Z" fill={`url(#${id}-gem)`} stroke={t.ink} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M50 34 L56 48 L50 66 M36 48 L64 48" stroke={t.ink} strokeOpacity="0.35" strokeWidth="1.5" fill="none" />
      {/* 반짝 */}
      <circle cx="40" cy="30" r="3" fill="#fff" opacity="0.8" />
    </svg>
  );
}
