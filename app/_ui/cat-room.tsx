import { CatSprite } from "@/app/_ui/cat";
import type { CatBreed, CatMood } from "@/lib/classroom/cat";
import { ITEM_BY_ID, WALL_H, artSize, roomDims, type Art, type Layout } from "@/lib/classroom/cat-house";

/** 픽셀 그림 (문자 격자) → 사각형들. 같은 줄에서 같은 색은 한 칸으로 합친다 */
function Pixels({ art, x, y, flip = false }: { art: Art; x: number; y: number; flip?: boolean }) {
  const rects: React.ReactNode[] = [];
  art.rows.forEach((row, ry) => {
    let start = 0;
    for (let i = 1; i <= row.length; i++) {
      if (i === row.length || row[i] !== row[start]) {
        const c = row[start];
        const fill = art.pal[c];
        if (fill) rects.push(<rect key={`${ry}-${start}`} x={x + start} y={y + ry} width={i - start} height={1} fill={fill} />);
        start = i;
      }
    }
  });
  if (flip) {
    const w = Math.max(...art.rows.map((r) => r.length));
    return <g transform={`translate(${2 * x + w} 0) scale(-1 1)`}>{rects}</g>;
  }
  return <g>{rects}</g>;
}

type Dims = { w: number; h: number; wall: number };
const D1: Dims = roomDims(1);

function Wall({ id, d = D1 }: { id: string; d?: Dims }) {
  const W = d.w;
  const WALL_H = d.wall;
  const it = ITEM_BY_ID.get(id);
  const [a, b] = it?.colors ?? ["#FFF4E0", "#FBEBD0"];
  const out: React.ReactNode[] = [<rect key="base" x={0} y={0} width={W} height={WALL_H} fill={a} />];
  if (it?.pattern === "stripe") for (let x = 0; x < W; x += 4) out.push(<rect key={x} x={x} y={0} width={2} height={WALL_H} fill={b} />);
  if (it?.pattern === "check")
    for (let x = 0; x < W; x += 4) for (let y = 0; y < WALL_H; y += 4) if ((x + y) % 8 === 0) out.push(<rect key={`${x}-${y}`} x={x} y={y} width={4} height={4} fill={b} />);
  if (it?.pattern === "plain") out.push(<rect key="shade" x={0} y={WALL_H - 3} width={W} height={3} fill={b} />);
  out.push(<rect key="board" x={0} y={WALL_H - 1} width={W} height={1} fill="#E2CFAF" />);
  return <g>{out}</g>;
}

function Floor({ id, d = D1 }: { id: string; d?: Dims }) {
  const { w: W, h: H, wall: WALL_H } = d;
  const it = ITEM_BY_ID.get(id);
  const [a, b] = it?.colors ?? ["#C99A6B", "#B5865A"];
  const out: React.ReactNode[] = [<rect key="base" x={0} y={WALL_H} width={W} height={H - WALL_H} fill={a} />];
  if (it?.pattern === "plank")
    for (let y = WALL_H + 3; y < H; y += 4) {
      out.push(<rect key={`l${y}`} x={0} y={y} width={W} height={1} fill={b} />);
      for (let x = (y / 4) % 2 ? 6 : 16; x < W; x += 20) out.push(<rect key={`v${y}-${x}`} x={x} y={y - 3} width={1} height={3} fill={b} />);
    }
  if (it?.pattern === "tile") {
    for (let y = WALL_H + 4; y < H; y += 4) out.push(<rect key={`h${y}`} x={0} y={y} width={W} height={1} fill={b} />);
    for (let x = 8; x < W; x += 8) out.push(<rect key={`v${x}`} x={x} y={WALL_H} width={1} height={H - WALL_H} fill={b} />);
  }
  if (it?.pattern === "dots")
    for (let y = WALL_H + 2; y < H; y += 3) for (let x = (y % 2) * 2; x < W; x += 4) out.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={b} />);
  return <g>{out}</g>;
}

function Window({ id, d = D1 }: { id: string; d?: Dims }) {
  const scene = ITEM_BY_ID.get(id)?.scene ?? "bondi";
  const X = Math.round((d.w - 16) / 2);
  const Y = 9;
  const inner: React.ReactNode[] = [];
  const r = (k: string, x: number, y: number, w: number, h: number, fill: string) =>
    inner.push(<rect key={k} x={X + x} y={Y + y} width={w} height={h} fill={fill} />);
  if (scene === "bondi") {
    r("sky", 1, 1, 14, 6, "#8FD3FF");
    r("sun", 11, 2, 2, 2, "#FFE066");
    r("sea", 1, 7, 14, 3, "#2E9BD6");
    r("wave", 3, 8, 3, 1, "#BFE8FF");
    r("wave2", 9, 7, 3, 1, "#BFE8FF");
    r("sand", 1, 10, 14, 3, "#F2D58A");
  } else if (scene === "opera") {
    r("sky", 1, 1, 14, 4, "#FFB37A");
    r("sky2", 1, 5, 14, 2, "#FF8F6B");
    r("water", 1, 7, 14, 6, "#3A6EA5");
    r("s1", 4, 5, 2, 2, "#FFFFFF");
    r("s2", 6, 4, 2, 3, "#FFFFFF");
    r("s3", 8, 5, 3, 2, "#FFFFFF");
    r("base", 3, 7, 9, 1, "#E8E2D8");
    r("glow", 3, 9, 8, 1, "#5C8FCC");
  } else {
    r("sky", 1, 1, 14, 4, "#FF8A50");
    r("sky2", 1, 5, 14, 3, "#FFC46B");
    r("rock", 4, 6, 8, 3, "#B5442A");
    r("rocktop", 5, 5, 6, 1, "#B5442A");
    r("ground", 1, 9, 14, 4, "#D9773F");
    r("bush", 2, 10, 2, 1, "#8A9A3C");
    r("bush2", 11, 11, 2, 1, "#8A9A3C");
  }
  return (
    <g>
      <rect x={X - 1} y={Y - 1} width={18} height={16} fill="#C9B79C" />
      <rect x={X} y={Y} width={16} height={14} fill="#FFFFFF" />
      {inner}
      <rect x={X + 8} y={Y + 1} width={1} height={12} fill="#FFFFFF" />
      <rect x={X + 1} y={Y + 6} width={14} height={1} fill="#FFFFFF" opacity={0.7} />
      <rect x={X - 2} y={Y + 14} width={20} height={2} fill="#E2CFAF" />
    </g>
  );
}

/** 고양이 크기·위치 (방 좌표, 방 크기에 맞춰) */
function catPlace(d: Dims) {
  return {
    cat: { x: Math.round((d.w - 26) / 2), width: 26, base: d.h - 5 },
    guest: { x: Math.round(d.w * 0.67), width: 17, base: d.h - 8 },
  };
}

/** 고양이 방 한 장면 (서버·클라이언트 공용). 바닥 물건은 아래쪽(앞)에 있을수록 나중에 그려진다 */
export function CatRoom({
  layout,
  breed,
  mood = "default",
  guest,
  selected,
  onItemPointerDown,
  svgRef,
  className = "",
}: {
  layout: Layout;
  breed: CatBreed | null;
  mood?: CatMood;
  /** 놀러 온 손님 고양이 */
  guest?: CatBreed | null;
  /** 꾸미기에서 고른 물건 (방 안 순서) */
  selected?: number | null;
  /** 꾸미기: 물건을 눌렀을 때 (끌어서 옮기기) */
  onItemPointerDown?: (index: number, e: React.PointerEvent<SVGGElement>) => void;
  svgRef?: React.Ref<SVGSVGElement>;
  className?: string;
}) {
  const d = roomDims(layout.size ?? 1);
  const { w: W, h: H } = d;
  const { cat: CAT, guest: GUEST } = catPlace(d);
  // 고양이가 방 안을 천천히 돌아다닌다 (편집 중엔 가만히)
  const roam = Math.round(d.w * 0.22);
  type Node = { z: number; order: number; el: React.ReactNode };
  const nodes: Node[] = [];
  layout.items.forEach((p, i) => {
    const it = ITEM_BY_ID.get(p.id);
    if (!it?.art) return;
    const { w, h } = artSize(it.art);
    const back = it.kind === "wallItem" || it.kind === "lightItem";
    nodes.push({
      z: back ? -1 : p.y + h,
      order: i,
      el: (
        <g
          key={`i${i}`}
          onPointerDown={onItemPointerDown ? (e) => onItemPointerDown(i, e) : undefined}
          style={onItemPointerDown ? { cursor: "grab", touchAction: "none" } : undefined}
        >
          <Pixels art={it.art} x={p.x} y={p.y} flip={p.f} />
          {selected === i && (
            <rect x={p.x - 0.5} y={p.y - 0.5} width={w + 1} height={h + 1} fill="none" stroke="#6C5CFF" strokeWidth={0.5} strokeDasharray="1.2 0.8" />
          )}
          {onItemPointerDown && <rect x={p.x} y={p.y} width={w} height={h} fill="transparent" />}
        </g>
      ),
    });
  });
  const hat = layout.wear?.hat ? ITEM_BY_ID.get(layout.wear.hat)?.art : undefined;
  const outfit = layout.wear?.outfit ? ITEM_BY_ID.get(layout.wear.outfit)?.art : undefined;
  if (guest) {
    const gh = (GUEST.width * 18) / 24;
    nodes.push({
      z: GUEST.base,
      order: 998,
      el: <CatSprite key="guest" breed={guest} mood="happy" delay={0.5} place={{ x: GUEST.x, y: GUEST.base - gh, width: GUEST.width }} />,
    });
  }
  if (breed) {
    const ch = (CAT.width * 18) / 24;
    nodes.push({
      z: CAT.base,
      order: 999,
      el: (
        <g key="cat" pointerEvents="none">
          {!onItemPointerDown && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0 0; 0 0; ${-roam} 0; ${-roam} 0; ${roam} 0; ${roam} 0; 0 0`}
              keyTimes="0; 0.15; 0.3; 0.5; 0.7; 0.85; 1"
              dur="30s"
              repeatCount="indefinite"
            />
          )}
          <CatSprite breed={breed} mood={mood} hat={hat} outfit={outfit} place={{ x: CAT.x, y: CAT.base - ch, width: CAT.width }} />
        </g>
      ),
    });
  }
  nodes.sort((a, b) => a.z - b.z || a.order - b.order);

  return (
    <div className={`relative w-full overflow-hidden rounded-3xl ${className}`} style={{ aspectRatio: `${W} / ${H}` }}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full select-none" shapeRendering="crispEdges">
        <Wall id={layout.wall} d={d} />
        <Floor id={layout.floor} d={d} />
        <Window id={layout.window} d={d} />
        {nodes.map((n) => n.el)}
      </svg>
    </div>
  );
}

/** 상점·꾸미기 목록의 작은 미리보기 */
export function ItemPreview({ id, className = "h-14 w-14" }: { id: string; className?: string }) {
  const it = ITEM_BY_ID.get(id);
  if (!it) return null;
  if (it.kind === "window") {
    return (
      <svg viewBox="38 7 20 18" className={className} shapeRendering="crispEdges" aria-hidden>
        <Window id={id} />
      </svg>
    );
  }
  if (it.kind === "wall" || it.kind === "floor") {
    return (
      <svg viewBox={it.kind === "wall" ? "0 0 16 16" : `0 ${WALL_H} 16 16`} className={className} shapeRendering="crispEdges" aria-hidden>
        {it.kind === "wall" ? <Wall id={id} /> : <Floor id={id} />}
      </svg>
    );
  }
  if (it.kind === "room") {
    // 방 넓히기: 작은 방 → 큰 방 그림
    const big = it.id === "room-3";
    return (
      <svg viewBox="0 0 20 20" className={className} shapeRendering="crispEdges" aria-hidden>
        <rect x={big ? 1 : 3} y={big ? 4 : 6} width={big ? 18 : 14} height={big ? 14 : 12} fill="#FFF4E0" />
        <rect x={big ? 1 : 3} y={big ? 12 : 13} width={big ? 18 : 14} height={big ? 6 : 5} fill="#C99A6B" />
        <rect x={8} y={big ? 6 : 8} width={4} height={4} fill="#8FD3FF" />
        <rect x={big ? 0 : 2} y={big ? 3 : 5} width={big ? 20 : 16} height={1} fill="#6C5CFF" />
        <rect x={big ? 0 : 2} y={big ? 18 : 18} width={big ? 20 : 16} height={1} fill="#6C5CFF" />
      </svg>
    );
  }
  if (!it.art) return null;
  const art = it.art;
  const w = Math.max(...art.rows.map((r) => r.length));
  const h = art.rows.length;
  const s = Math.max(w, h) + 2;
  return (
    <svg viewBox={`${-(s - w) / 2} ${-(s - h) / 2} ${s} ${s}`} className={className} shapeRendering="crispEdges" aria-hidden>
      <Pixels art={art} x={0} y={0} />
    </svg>
  );
}
