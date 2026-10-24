import { catPixels, type CatBreed, type CatMood, type CatPart } from "@/lib/classroom/cat";

/** 모자·옷 그림 (고양이 집에서 입힌 것) */
type WearArt = { rows: string[]; pal: Record<string, string> };

function wearRects(art: WearArt, x0: number, y0: number, key: string) {
  const out: React.ReactNode[] = [];
  art.rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const fill = art.pal[row[x]];
      if (fill) out.push(<rect key={`${key}${x}-${y}`} x={x0 + x} y={y0 + y} width={1} height={1} fill={fill} />);
    }
  });
  return out;
}

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
  hat,
  outfit,
  place,
}: {
  breed: CatBreed;
  mood?: CatMood;
  className?: string;
  title?: string;
  /** 여러 마리가 같이 있을 때 박자를 어긋나게 (초) */
  delay?: number;
  /** 머리 위 모자 (가로 14 이하, 맨 아래 줄이 머리 위에 닿는다) */
  hat?: WearArt;
  /** 목·몸에 입는 옷 (가로 14 이하) */
  outfit?: WearArt;
  /** 다른 그림(방) 안에 넣을 때 위치·크기 (SVG 좌표) */
  place?: { x: number; y: number; width: number };
}) {
  const { pixels, z } = catPixels(breed, mood);
  return (
    <svg
      viewBox="-3 -3 24 18"
      {...(place ? { x: place.x, y: place.y, width: place.width, height: (place.width * 18) / 24 } : {})}
      className={`cat-sprite cat-${mood} ${place ? "" : className}`}
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
      {(hat || outfit) && (
        <g className="cat-bob">
          {outfit && wearRects(outfit, 2, 9, "o")}
          {hat && wearRects(hat, Math.round(9 - Math.max(...hat.rows.map((r) => r.length)) / 2), 3 - hat.rows.length, "h")}
        </g>
      )}
      {z && (
        <text className="cat-z" x={16} y={-0.2} fontFamily="Menlo,monospace" fontWeight={900} fontSize={2.4} fill="#2453EB">
          z
        </text>
      )}
    </svg>
  );
}
