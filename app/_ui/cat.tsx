import { catAnchors, catBox, catPixels, type CatAnchor, type CatBreed, type CatMood, type CatPart, type CatStage } from "@/lib/classroom/cat";

/** 모자·옷 그림 (고양이 집에서 입힌 것) */
type WearArt = { rows: string[]; pal: Record<string, string> };
/** 고양이 격자 위 아무 데나 얹는 그림 (직군 소품 등). x·y는 고양이 격자 좌표 */
export type CatGearLayer = WearArt & {
  x: number;
  y: number;
  /** 자란 단계에서 어디를 따라 옮길지 (머리·가슴·왼손·오른손). 없으면 가슴 */
  anchor?: CatAnchor;
};

/** 모자를 큰 머리에 맞게 가운데 칸을 늘린다 */
function stretchRows(rows: string[], extra: number) {
  if (extra <= 0) return rows;
  return rows.map((r) => {
    const mid = Math.floor(r.length / 2);
    return r.slice(0, mid) + r[mid].repeat(extra) + r.slice(mid);
  });
}

/** 1단계 좌표로 만든 소품을 지금 단계 위치로 */
function placeLayer(g: CatGearLayer, stage: CatStage): CatGearLayer {
  if (stage === 1) return g;
  const a = catAnchors(stage);
  const anchor = g.anchor ?? "chest";
  if (anchor === "head") {
    const [dx, dy, extra] = a.head;
    return { ...g, rows: stretchRows(g.rows, extra), x: g.x + dx - Math.floor(extra / 2), y: g.y + dy };
  }
  const [dx, dy] = a[anchor];
  return { ...g, x: g.x + dx, y: g.y + dy };
}

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
  gear,
  stage = 1,
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
  /** 몸과 같이 움직이는 소품 그림 (예: 내 워홀 코스의 직군 소품) */
  gear?: CatGearLayer[];
  /** 성장 단계 1~5 (공부한 날이 쌓이면 자란다). 없으면 1단계 */
  stage?: CatStage;
}) {
  const { pixels, z } = catPixels(breed, mood, stage);
  const box = catBox(stage);
  // 고양이 집 모자·옷도 소품처럼 단계에 맞춰 옮긴다
  const hatW = hat ? Math.max(...hat.rows.map((r) => r.length)) : 0;
  const layers: CatGearLayer[] = [
    ...(outfit ? [{ ...outfit, x: 2, y: 9, anchor: "chest" as const }] : []),
    ...(hat ? [{ ...hat, x: Math.round(9 - hatW / 2), y: 3 - hat.rows.length, anchor: "head" as const }] : []),
    ...(gear ?? []),
  ].map((g) => placeLayer(g, stage));
  const groundY = box.h + box.y - 1;
  return (
    <svg
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      {...(place ? { x: place.x, y: place.y, width: place.width, height: (place.width * box.h) / box.w } : {})}
      className={`cat-sprite cat-${mood} ${place ? "" : className}`}
      style={{ "--cat-delay": `${-delay}s` } as React.CSSProperties}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect x={1} y={groundY} width={box.w - 8} height={0.6} fill="#000" opacity={0.08} />
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
      {layers.length > 0 && <g className="cat-bob">{layers.map((g, i) => wearRects(g, g.x, g.y, `g${i}-`))}</g>}
      {z && (
        <text className="cat-z" x={box.w - 8} y={-0.2} fontFamily="Menlo,monospace" fontWeight={900} fontSize={2.4} fill="#2453EB">
          z
        </text>
      )}
    </svg>
  );
}
