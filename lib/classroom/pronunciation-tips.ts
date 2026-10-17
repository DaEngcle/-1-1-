export type MouthVariant = "th" | "l" | "r" | "fv" | "z" | "flap";

export interface PronunciationTip {
  id: string;
  label: string;
  ipa: string;
  title: string;
  summary: string;
  /** 한국인이 흔히 내는 잘못된 소리 */
  commonMistake: string;
  steps: string[];
  diagram: MouthVariant;
  /** 비교해서 들어볼 단어쌍 [목표 소리, 헷갈리는 소리] */
  minimalPairs: [string, string][];
  practiceWords: string[];
  /** 선생님 설명 영상 (유튜브 링크를 넣으면 가이드 페이지에 표시) */
  videoUrl?: string;
  /** 단어에 이 소리가 들어있는지 (소문자 단어 기준) */
  match: (word: string) => boolean;
}

export const PRONUNCIATION_TIPS: PronunciationTip[] = [
  {
    id: "th",
    label: "th",
    ipa: "/θ/ /ð/",
    title: "th 발음 — 혀를 이 사이로",
    summary:
      "한국어에 없는 소리라 'ㅆ'나 'ㄷ'으로 바뀌기 쉬워요. 혀끝을 윗니와 아랫니 사이에 살짝 내밀고 바람을 내보내면 끝!",
    commonMistake: "think → '씽크', this → '디스'",
    steps: [
      "혀끝을 윗니 끝에 가볍게 대고, 앞니 사이로 1~2mm 살짝 내밀어요.",
      "혀를 누르지 말고, 혀와 윗니 사이 틈으로 바람을 '스~' 하고 흘려보내요.",
      "think, thanks처럼 목이 울리지 않으면 /θ/, this, that처럼 목이 울리면 /ð/예요.",
      "거울을 보면서 혀끝이 살짝 보이는지 확인하세요.",
    ],
    diagram: "th",
    minimalPairs: [
      ["think", "sink"],
      ["thank", "sank"],
      ["three", "tree"],
      ["they", "day"],
      ["breathe", "breeze"],
    ],
    practiceWords: ["thanks", "think", "the", "that", "though", "anything", "month"],
    match: (w) => w.includes("th"),
  },
  {
    id: "r",
    label: "r",
    ipa: "/r/",
    title: "r 발음 — 혀끝이 어디에도 닿지 않게",
    summary:
      "한국어 'ㄹ'은 혀끝이 입천장을 치지만, 영어 r은 혀끝이 아무 데도 닿지 않아요. 입술을 살짝 오므리고 혀를 뒤로 당겨요.",
    commonMistake: "right → '라잇' (혀가 입천장을 침)",
    steps: [
      "입술을 '우' 하듯 살짝 오므려요.",
      "혀끝을 위로 살짝 말아 올리되, 입천장에 절대 닿지 않게 해요.",
      "혀 옆부분이 윗어금니 안쪽에 닿는 느낌으로 '우r~' 소리를 내요.",
      "'우라잇'처럼 앞에 '우'를 살짝 붙이면 쉽게 시작할 수 있어요.",
    ],
    diagram: "r",
    minimalPairs: [
      ["right", "light"],
      ["rice", "lice"],
      ["road", "load"],
      ["pray", "play"],
    ],
    practiceWords: ["roster", "rent", "really", "reckon", "price", "around"],
    match: (w) => /r/.test(w),
  },
  {
    id: "l",
    label: "l",
    ipa: "/l/",
    title: "l 발음 — 혀끝을 윗잇몸에 꾹",
    summary:
      "혀끝을 윗니 바로 뒤 잇몸에 확실히 붙인 채로 소리를 내요. 단어 끝 l(feel, bill)은 '어'를 살짝 붙여 '피얼'처럼.",
    commonMistake: "light → '라잇' (r처럼 들림)",
    steps: [
      "혀끝을 윗니 바로 뒤 볼록한 잇몸(치조)에 붙여요.",
      "혀끝을 붙인 채로 혀 양옆으로 소리를 흘려보내요.",
      "단어 첫소리 l은 '을라잇'처럼 '을'을 살짝 붙이면 정확해져요.",
      "단어 끝 l은 혀를 붙이면서 '어우' 같은 어두운 소리가 나요 (bills → '비얼즈').",
    ],
    diagram: "l",
    minimalPairs: [
      ["light", "right"],
      ["lead", "read"],
      ["collect", "correct"],
      ["glass", "grass"],
    ],
    practiceWords: ["living", "look", "bills", "available", "allergies", "really"],
    match: (w) => /l/.test(w),
  },
  {
    id: "fv",
    label: "f / v",
    ipa: "/f/ /v/",
    title: "f · v 발음 — 윗니로 아랫입술을 살짝",
    summary:
      "'ㅍ', 'ㅂ'처럼 입술을 붙였다 떼면 안 돼요. 윗니를 아랫입술 안쪽에 살짝 얹고 바람을 내보내요.",
    commonMistake: "coffee → '커피', very → '베리'",
    steps: [
      "윗니 끝을 아랫입술 안쪽(촉촉한 부분)에 가볍게 얹어요.",
      "입술을 다물지 말고, 이와 입술 사이로 바람을 '프~' 흘려요 → /f/",
      "같은 모양에서 목을 울리면 /v/ 예요. 입술이 간지러운 느낌이면 성공!",
    ],
    diagram: "fv",
    minimalPairs: [
      ["fan", "pan"],
      ["coffee", "copy"],
      ["very", "berry"],
      ["vest", "best"],
    ],
    practiceWords: ["favour", "coffee", "fortnightly", "available", "even", "have"],
    match: (w) => /f|ph|v/.test(w),
  },
  {
    id: "z",
    label: "z",
    ipa: "/z/",
    title: "z 발음 — 벌 소리처럼 목을 울리며",
    summary:
      "'ㅈ'이 아니라 's' 모양 그대로 목을 울리는 소리예요. 복수형·동사 끝의 -s도 z로 나는 경우가 많아요 (bills, days).",
    commonMistake: "zero → '제로', days → '데이스'",
    steps: [
      "s를 낼 때처럼 혀끝을 윗잇몸 가까이 두되, 붙이지 않아요.",
      "목에 손을 대고 '즈~~' 하고 벌 소리처럼 진동을 느껴요.",
      "'ㅈ'처럼 혀를 붙였다 떼면 안 되고, 바람이 계속 흘러야 해요.",
    ],
    diagram: "z",
    minimalPairs: [
      ["zoo", "sue"],
      ["prize", "price"],
      ["eyes", "ice"],
      ["rise", "rice"],
    ],
    practiceWords: ["days", "bills", "is", "heaps", "allergies", "these"],
    match: (w) => /z|[^s]s$/.test(w) && !/(?:ts|ks|ps|fs)$/.test(w),
  },
  {
    id: "flap",
    label: "부드러운 t",
    ipa: "/ɾ/",
    title: "모음 사이 t — 'ㄹ'처럼 가볍게 튕기기",
    summary:
      "water, better처럼 t가 모음 사이에 오면 원어민은 혀를 한 번 가볍게 튕겨 'ㄹ/ㄷ' 중간 소리로 자주 말해요. 꼭 따라 할 필요는 없고, 알아듣는 데 익숙해지면 충분해요.",
    commonMistake: "water → '워터'로 t를 세게 발음",
    steps: [
      "혀끝으로 윗잇몸을 아주 짧게 '톡' 한 번만 쳐요.",
      "세게 터뜨리지 말고 한국어 '나라'의 'ㄹ'처럼 가볍게.",
      "water → '워러', got a → '가러', a lot of → '얼라러'.",
    ],
    diagram: "flap",
    minimalPairs: [
      ["water", "wadder"],
      ["better", "bedder"],
    ],
    practiceWords: ["water", "better", "a lot of", "get it", "started"],
    match: (w) => /[aeiouy]t+[aeiouy]/.test(w),
  },
];

export function getTip(id: string) {
  return PRONUNCIATION_TIPS.find((t) => t.id === id);
}

/** 문장에 들어있는 어려운 소리 팁 (우선순위 순, 최대 limit개) */
export function findTipsForSentence(sentence: string, limit = 2) {
  const words = sentence.toLowerCase().match(/[a-z']+/g) ?? [];
  return PRONUNCIATION_TIPS.map((tip) => ({
    tip,
    words: [...new Set(words.filter((w) => tip.match(w)))],
  }))
    .filter((t) => t.words.length > 0)
    .slice(0, limit);
}
