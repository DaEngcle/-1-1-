import { catPixels, type CatBreed, type CatMood } from "@/lib/classroom/cat";

/** 도트 고양이 한 마리. 서버·클라이언트 어디서나 쓸 수 있다 */
export function CatSprite({
  breed,
  mood = "default",
  className = "h-20 w-24",
  title,
}: {
  breed: CatBreed;
  mood?: CatMood;
  className?: string;
  title?: string;
}) {
  const { pixels, z } = catPixels(breed, mood);
  return (
    <svg
      viewBox="-3 -3 24 18"
      className={className}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect x={1} y={14} width={16} height={0.6} fill="#000" opacity={0.08} />
      {pixels.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} fill={p.fill} />
      ))}
      {z && (
        <text x={16} y={-0.2} fontFamily="Menlo,monospace" fontWeight={900} fontSize={2.4} fill="#2453EB">
          z
        </text>
      )}
    </svg>
  );
}
