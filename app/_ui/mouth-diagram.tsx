import type { MouthVariant } from "@/lib/classroom/pronunciation-tips";

/**
 * 입 옆모습 단면도 (왼쪽이 입 앞쪽).
 * 혀(빨강) 위치와 입술/치아 모양으로 발음 방법을 보여준다.
 */
const TONGUE: Record<MouthVariant, string> = {
  // 혀끝이 윗니·아랫니 사이로 살짝 나옴
  th: "M150 118 C120 112 90 104 70 92 C58 85 46 80 36 77 C33 76 33 72 37 71 C50 70 64 74 78 80 C100 88 130 96 160 100",
  // 혀끝이 윗잇몸(치조)에 붙음
  l: "M150 118 C120 112 96 102 82 90 C72 80 64 68 60 60 C58 56 62 54 65 57 C74 66 86 76 100 84 C120 94 140 98 160 100",
  // 혀끝을 뒤로 말아 올리되 닿지 않음
  r: "M150 118 C124 112 104 104 94 92 C88 84 86 76 90 70 C93 66 98 68 96 72 C94 78 100 86 112 90 C130 96 146 99 160 100",
  // 혀는 편하게 바닥에
  fv: "M150 118 C120 114 96 108 78 100 C66 95 56 92 52 90 C50 88 53 85 57 86 C70 88 90 92 110 95 C130 98 146 99 160 100",
  // 혀끝이 윗잇몸 가까이, 틈을 둠
  z: "M150 118 C120 112 96 104 80 94 C70 87 62 78 58 70 C56 66 60 64 63 67 C72 76 86 84 100 88 C120 94 140 98 160 100",
  // 혀끝으로 윗잇몸을 톡 (l과 비슷, 짧게)
  flap: "M150 118 C120 112 96 102 82 90 C72 80 64 68 60 60 C58 56 62 54 65 57 C74 66 86 76 100 84 C120 94 140 98 160 100",
};

const CAPTION: Record<MouthVariant, string> = {
  th: "혀끝을 윗니와 아랫니 사이로 살짝",
  l: "혀끝을 윗잇몸에 꾹 붙이기",
  r: "혀끝을 말아 올리되 어디에도 닿지 않게",
  fv: "윗니를 아랫입술 안쪽에 살짝",
  z: "혀끝은 잇몸 가까이, 틈으로 바람 + 목 울림",
  flap: "혀끝으로 윗잇몸을 '톡' 한 번",
};

export function MouthDiagram({ variant }: { variant: MouthVariant }) {
  const lowerLipY = variant === "fv" ? 70 : 84;
  const lipsRounded = variant === "r";

  return (
    <figure className="flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 200 140"
        className="w-full max-w-xs"
        role="img"
        aria-label={CAPTION[variant]}
      >
        {/* 입천장 */}
        <path
          d="M52 52 C70 40 110 34 175 38"
          fill="none"
          stroke="#a1a1aa"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <text x="120" y="30" fontSize="9" fill="#71717a">
          입천장
        </text>
        {/* 윗잇몸(치조) 표시 */}
        <circle cx="56" cy="53" r="3" fill="#f59e0b" />
        <text x="62" y="49" fontSize="8" fill="#b45309">
          윗잇몸
        </text>
        {/* 윗입술 */}
        <path
          d={lipsRounded ? "M50 46 C34 46 18 54 18 62 C18 66 26 66 40 64" : "M50 46 C36 46 24 54 24 62 C24 66 32 66 44 64"}
          fill="#fda4af"
          stroke="#e11d48"
          strokeWidth="1.5"
        />
        {/* 윗니 */}
        <rect x="42" y="54" width="10" height="17" rx="3" fill="#ffffff" stroke="#71717a" strokeWidth="1.5" />
        {/* 아랫니 */}
        <rect x="44" y="79" width="10" height="15" rx="3" fill="#ffffff" stroke="#71717a" strokeWidth="1.5" />
        {/* 아랫입술 */}
        <path
          d={
            lipsRounded
              ? `M52 100 C36 100 18 ${lowerLipY + 6} 18 ${lowerLipY - 2} C18 ${lowerLipY - 6} 28 ${lowerLipY - 6} 40 ${lowerLipY - 4}`
              : `M52 100 C38 100 26 ${lowerLipY + 6} 26 ${lowerLipY - 2} C26 ${lowerLipY - 6} 34 ${lowerLipY - 6} 44 ${lowerLipY - 4}`
          }
          fill="#fda4af"
          stroke="#e11d48"
          strokeWidth="1.5"
        />
        {/* 혀 */}
        <path
          d={TONGUE[variant]}
          fill="#f87171"
          fillOpacity="0.85"
          stroke="#b91c1c"
          strokeWidth="1.5"
        />
        <text x="118" y="128" fontSize="9" fill="#b91c1c">
          혀
        </text>
        {/* 바람/진동 표시 */}
        {(variant === "th" || variant === "fv" || variant === "z") && (
          <g stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round">
            <line x1="14" y1={variant === "fv" ? 68 : 74} x2="4" y2={variant === "fv" ? 66 : 72} />
            <line x1="14" y1={variant === "fv" ? 72 : 78} x2="4" y2={variant === "fv" ? 74 : 80} />
          </g>
        )}
        {variant === "flap" && (
          <path d="M70 70 L62 60 M62 60 L70 62" stroke="#0ea5e9" strokeWidth="1.5" fill="none" />
        )}
      </svg>
      <figcaption className="text-sm text-zinc-600">{CAPTION[variant]}</figcaption>
    </figure>
  );
}
