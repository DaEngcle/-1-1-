"use client";

import { useState } from "react";

const W = 600;
const H = 180;
const PAD = { top: 12, right: 12, bottom: 24, left: 32 };
const LINE = "#b45309";

/** 최근 30일 일별 평균 종합 점수 (단일 시리즈, 크로스헤어 툴팁) */
export function ScoreTrendChart({
  data,
}: {
  data: { date: string; score: number | null; count: number }[];
}) {
  const [hover, setHover] = useState<number | null>(null);
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (i / (data.length - 1)) * innerW;
  const y = (v: number) => PAD.top + (1 - v / 100) * innerH;

  // 제출 없는 날은 선을 끊지 않고 이어서 그림 (점은 있는 날만)
  const points = data
    .map((d, i) => (d.score == null ? null : { i, v: d.score }))
    .filter((p): p is { i: number; v: number } => p !== null);
  const path = points.map((p, k) => `${k === 0 ? "M" : "L"}${x(p.i)},${y(p.v)}`).join(" ");
  const hovered = hover != null ? data[hover] : null;

  function onMove(e: React.PointerEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setHover(Math.max(0, Math.min(data.length - 1, Math.round(ratio * (data.length - 1)))));
  }

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="최근 30일 일별 평균 발음 점수">
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="#e4e4e7" strokeWidth="1" />
            <text x={PAD.left - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#71717a">
              {v}
            </text>
          </g>
        ))}
        {[0, 14, 29].map((i) => (
          <text key={i} x={x(i)} y={H - 6} textAnchor={i === 0 ? "start" : i === 29 ? "end" : "middle"} fontSize="11" fill="#71717a">
            {data[i].date.slice(5).replace("-", "/")}
          </text>
        ))}
        {points.length > 1 && (
          <path d={path} fill="none" stroke={LINE} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        )}
        {points.map((p) => (
          <circle key={p.i} cx={x(p.i)} cy={y(p.v)} r="4" fill={LINE} stroke="#ffffff" strokeWidth="2" />
        ))}
        {hover != null && (
          <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} stroke="#a1a1aa" strokeWidth="1" />
        )}
        <rect
          x={PAD.left}
          y={PAD.top}
          width={innerW}
          height={innerH}
          fill="transparent"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        />
      </svg>
      {hovered && hover != null && (
        <div
          className="pointer-events-none absolute top-0 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs shadow-sm"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            transform: hover > 20 ? "translateX(-105%)" : "translateX(5%)",
          }}
        >
          <div className="font-bold text-zinc-900">
            {hovered.score == null ? "제출 없음" : `${hovered.score}점`}
          </div>
          <div className="text-zinc-500">
            {hovered.date.slice(5).replace("-", "/")}
            {hovered.count > 0 && ` · ${hovered.count}회 제출`}
          </div>
        </div>
      )}
      {points.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">
          아직 채점된 제출이 없어요. 첫 쉐도잉을 제출해보세요!
        </p>
      )}
    </div>
  );
}
