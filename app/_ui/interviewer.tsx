import type { Look } from "@/lib/classroom/interview-scenarios";

/** 살짝 어둡게 (그림자·목) */
function shade(hex: string, amount = 0.12) {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.max(0, Math.round(c * (1 - amount)));
  return `rgb(${f(n >> 16)}, ${f((n >> 8) & 255)}, ${f(n & 255)})`;
}

/**
 * 면접관 일러스트 캐릭터 (듀오링고 느낌의 납작한 그림).
 * talking이면 입이 움직이고, 평소엔 눈을 깜빡인다 (globals.css의 .iv-*)
 */
export function Interviewer({
  look,
  talking = false,
  mood = "smile",
  className = "h-40 w-40",
}: {
  look: Look;
  talking?: boolean;
  mood?: "smile" | "neutral" | "thinking";
  className?: string;
}) {
  const { skin, hair, hairStyle, outfit, accent, hat, beard, glasses, bg } = look;
  const skinDark = shade(skin, 0.14);
  return (
    <svg viewBox="0 0 200 210" className={`${className} ${talking ? "iv-talking" : ""}`} aria-hidden>
      <circle cx="100" cy="100" r="96" fill={bg} />
      {/* 뒷머리 (긴 머리·포니테일) */}
      {hairStyle === "long" && <path d="M46 92 Q40 160 66 182 L134 182 Q160 160 154 92 Q150 34 100 32 Q50 34 46 92Z" fill={hair} />}
      {hairStyle === "ponytail" && <path d="M138 62 Q178 80 160 140 Q150 120 140 96Z" fill={hair} />}
      {/* 몸 */}
      <path d="M26 210 Q28 156 100 148 Q172 156 174 210Z" fill={outfit} />
      {outfit.toUpperCase() === "#FFFFFF" ? (
        // 셰프복: 단추 두 줄
        <g fill={accent}>
          {[166, 182, 198].map((y) => (
            <g key={y}>
              <circle cx="88" cy={y} r="3" />
              <circle cx="112" cy={y} r="3" />
            </g>
          ))}
        </g>
      ) : hat === "hardhat" ? (
        // 형광 조끼 줄
        <g fill={accent}>
          <rect x="40" y="176" width="120" height="8" rx="2" />
          <rect x="66" y="152" width="8" height="58" />
          <rect x="126" y="152" width="8" height="58" />
        </g>
      ) : (
        // 셔츠 깃 + 이름표
        <g>
          <path d="M80 152 L100 176 L120 152 L112 150 L100 164 L88 150Z" fill={accent} />
          <rect x="120" y="172" width="26" height="12" rx="3" fill="#fff" opacity="0.9" />
        </g>
      )}
      {/* 목 */}
      <rect x="88" y="126" width="24" height="30" rx="8" fill={skinDark} />
      {/* 귀 */}
      <circle cx="55" cy="98" r="9" fill={skin} />
      <circle cx="145" cy="98" r="9" fill={skin} />
      {/* 머리 */}
      <ellipse cx="100" cy="94" rx="46" ry="50" fill={skin} />
      {/* 앞머리 */}
      {hairStyle === "short" && <path d="M54 92 Q50 36 100 34 Q150 36 146 92 Q142 60 112 56 Q88 64 62 60 Q56 72 54 92Z" fill={hair} />}
      {hairStyle === "buzz" && <path d="M56 86 Q54 42 100 40 Q146 42 144 86 Q138 58 100 54 Q62 58 56 86Z" fill={hair} opacity="0.85" />}
      {(hairStyle === "long" || hairStyle === "bun" || hairStyle === "ponytail") && (
        <path d="M54 94 Q50 36 100 34 Q150 36 146 94 Q138 62 118 56 Q96 74 66 64 Q58 76 54 94Z" fill={hair} />
      )}
      {hairStyle === "bun" && <circle cx="100" cy="30" r="17" fill={hair} />}
      {hairStyle === "curly" && (
        <g fill={hair}>
          {[
            [60, 70], [70, 52], [86, 42], [100, 38], [114, 42], [130, 52], [140, 70], [56, 88], [144, 88], [78, 58], [122, 58],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="14" />
          ))}
        </g>
      )}
      {/* 모자 */}
      {hat === "chef" && (
        <g>
          <rect x="62" y="40" width="76" height="22" rx="4" fill="#fff" stroke="#E5E7EB" strokeWidth="2" />
          <path d="M60 44 Q48 10 76 14 Q84 -4 100 6 Q116 -4 124 14 Q152 10 140 44Z" fill="#fff" stroke="#E5E7EB" strokeWidth="2" />
        </g>
      )}
      {hat === "hardhat" && (
        <g>
          <path d="M52 62 Q52 18 100 16 Q148 18 148 62Z" fill="#FACC15" />
          <rect x="44" y="58" width="112" height="10" rx="5" fill="#EAB308" />
          <rect x="94" y="18" width="12" height="40" rx="5" fill="#FDE047" />
        </g>
      )}
      {hat === "brim" && (
        <g>
          <ellipse cx="100" cy="56" rx="72" ry="14" fill="#E9C46A" />
          <path d="M64 56 Q66 18 100 18 Q134 18 136 56Z" fill="#F4D58D" />
          <rect x="64" y="44" width="72" height="8" fill="#B45309" opacity="0.8" />
        </g>
      )}
      {hat === "cap" && (
        <g>
          <path d="M56 66 Q56 24 100 22 Q144 24 144 66Z" fill={outfit} />
          <path d="M120 60 Q160 58 176 70 Q150 72 126 70Z" fill={shade(outfit, 0.2)} />
        </g>
      )}
      {/* 눈썹 */}
      <g stroke={shade(hair, 0.1)} strokeWidth="4" strokeLinecap="round" fill="none">
        {mood === "thinking" ? (
          <>
            <path d="M72 78 Q82 72 92 76" />
            <path d="M108 80 Q118 80 128 82" />
          </>
        ) : (
          <>
            <path d="M72 80 Q82 75 92 79" />
            <path d="M108 79 Q118 75 128 80" />
          </>
        )}
      </g>
      {/* 눈 (깜빡) */}
      <g className="iv-eyes" fill="#1F2937">
        <ellipse cx="82" cy="94" rx="5.5" ry="6.5" />
        <ellipse cx="118" cy="94" rx="5.5" ry="6.5" />
        <circle cx="84" cy="92" r="1.8" fill="#fff" />
        <circle cx="120" cy="92" r="1.8" fill="#fff" />
      </g>
      {glasses && (
        <g fill="none" stroke="#374151" strokeWidth="3">
          <rect x="68" y="84" width="28" height="20" rx="7" />
          <rect x="104" y="84" width="28" height="20" rx="7" />
          <path d="M96 92 L104 92" />
        </g>
      )}
      {/* 볼·코 */}
      <ellipse cx="70" cy="110" rx="8" ry="5" fill="#F9A8B8" opacity="0.55" />
      <ellipse cx="130" cy="110" rx="8" ry="5" fill="#F9A8B8" opacity="0.55" />
      <path d="M100 100 Q96 110 102 111" stroke={skinDark} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* 수염 */}
      {beard && <path d="M64 112 Q68 146 100 148 Q132 146 136 112 Q124 132 100 132 Q76 132 64 112Z" fill={hair} opacity="0.75" />}
      {/* 입: 말할 땐 열렸다 닫혔다 */}
      <g className="iv-mouth-closed">
        {mood === "neutral" || mood === "thinking" ? (
          <path d="M90 122 Q100 126 110 122" stroke="#7F1D1D" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M86 118 Q100 132 114 118 Q100 124 86 118Z" fill="#7F1D1D" />
        )}
      </g>
      <g className="iv-mouth-open">
        <ellipse cx="100" cy="122" rx="10" ry="8" fill="#7F1D1D" />
        <ellipse cx="100" cy="126" rx="6" ry="3" fill="#F87171" />
      </g>
    </svg>
  );
}
