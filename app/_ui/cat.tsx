import { catPixels, type CatBreed, type CatMood, type CatPart } from "@/lib/classroom/cat";

const PARTS: CatPart[] = ["tail", "arm", "feet", "body", "eye"];

/**
 * 도트 고양이 한 마리. 서버·클라이언트 어디서나 쓸 수 있다.
 * 클로드 로딩 캐릭터처럼 살짝 움직인다: 몸 통통, 눈 깜빡, 꼬리 살랑 (globals.css의 .cat-*)
 */
export function CatSprite({
  breed,
  mood = "default",
  className = "h-20 w-24",
  title,
  delay = 0,
}: {
  breed: CatBreed;
  mood?: CatMood;
  className?: string;
  title?: string;
  /** 여러 마리가 같이 있을 때 박자를 어긋나게 (초) */
  delay?: number;
}) {
  const { pixels, z } = catPixels(breed, mood);
  return (
    <svg
      viewBox="-3 -3 24 18"
      className={`cat-sprite cat-${mood} ${className}`}
      style={{ "--cat-delay": `${-delay}s` } as React.CSSProperties}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect x={1} y={14} width={16} height={0.6} fill="#000" opacity={0.08} />
      {PARTS.map((part) => {
        const own = pixels.filter((p) => p.part === part);
        if (own.length === 0) return null;
        const g = (
          <g key={part} className={`cat-${part}`}>
            {own.map((p, i) => (
              <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} fill={p.fill} />
            ))}
          </g>
        );
        // 눈·꼬리도 몸이랑 같이 튀어야 해서 몸 그룹 안에 넣는다
        return part === "body" || part === "eye" || part === "tail" || part === "arm" ? (
          <g key={part} className="cat-bob">
            {g}
          </g>
        ) : (
          g
        );
      })}
      {z && (
        <text className="cat-z" x={16} y={-0.2} fontFamily="Menlo,monospace" fontWeight={900} fontSize={2.4} fill="#2453EB">
          z
        </text>
      )}
    </svg>
  );
}
