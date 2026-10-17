// 발음 평가 결과(단어·소리별 점수)로 만드는 자세한 피드백. 서버·브라우저 공용, 외부 API 없음

interface Word {
  word: string;
  accuracy: number;
  errorType: string;
  phonemes: { phoneme: string; accuracy: number }[];
}

interface Scores {
  accuracy?: number | null;
  fluency?: number | null;
  completeness?: number | null;
  prosody?: number | null;
}

// Azure 발음 평가(en-US)의 소리 기호 → 한국어 이름과 고치는 법
const SOUNDS: Record<string, { name: string; how: string }> = {
  r: { name: "r", how: "혀끝을 어디에도 닿지 않게 뒤로 살짝 말고, 입술을 둥글게 '(우)r'" },
  l: { name: "l", how: "혀끝을 윗니 뒤 잇몸에 확실히 붙였다 떼요" },
  th: { name: "th", how: "혀끝을 윗니 끝에 살짝 대고 바람만 내보내요 ('ㅆ' 아님)" },
  dh: { name: "th", how: "혀끝을 윗니 끝에 살짝 대고 목을 울려요 ('ㄷ' 아님)" },
  f: { name: "f", how: "윗니로 아랫입술을 살짝 물고 바람을 내보내요 ('ㅍ' 아님)" },
  v: { name: "v", how: "윗니로 아랫입술을 물고 목을 울려요 ('ㅂ' 아님)" },
  z: { name: "z", how: "'ㅈ'이 아니라 's'를 내면서 목을 울려요 (벌 소리 '즈~')" },
  w: { name: "w", how: "입술을 동그랗게 모았다가 풀면서 시작해요" },
  y: { name: "y", how: "'이'를 짧게 붙여 시작해요" },
  ae: { name: "애", how: "'에'보다 입을 위아래로 크게 벌려 '애~'" },
  eh: { name: "에", how: "입을 옆으로 살짝 벌려 짧게 '에'" },
  ih: { name: "짧은 이", how: "힘을 빼고 짧게 '이' (길게 끌지 않기)" },
  iy: { name: "긴 이", how: "입꼬리를 옆으로 당겨 길게 '이-'" },
  ah: { name: "어", how: "입을 살짝 벌리고 짧게 '어'" },
  ax: { name: "약한 어", how: "힘을 완전히 빼고 아주 짧게 '어' (강세 없는 소리)" },
  aa: { name: "아", how: "입을 크게 벌려 '아'" },
  ao: { name: "오", how: "입을 둥글게 크게 '오'" },
  er: { name: "얼", how: "혀를 뒤로 말면서 '얼'" },
  ow: { name: "오우", how: "'오'로 끝내지 말고 '오우'로 미끄러지듯" },
  ey: { name: "에이", how: "'에'에서 멈추지 말고 '에이'" },
  ay: { name: "아이", how: "'아'에서 '이'로 또렷하게 '아이'" },
  aw: { name: "아우", how: "'아'에서 '우'로 '아우'" },
  oy: { name: "오이", how: "'오'에서 '이'로 '오이'" },
  uw: { name: "긴 우", how: "입술을 앞으로 모아 길게 '우-'" },
  uh: { name: "짧은 우", how: "힘을 빼고 짧게 '우'" },
  ng: { name: "ng", how: "끝을 '응'처럼 콧소리로 (뒤에 'ㄱ' 붙이지 않기)" },
  sh: { name: "sh", how: "입술을 앞으로 내밀고 '쉬'" },
  ch: { name: "ch", how: "입술을 내밀고 '취'" },
  jh: { name: "j", how: "입술을 내밀고 '쥐'" },
  zh: { name: "zh", how: "입술을 내밀고 목을 울려 '쥬'" },
  s: { name: "s", how: "'ㅅ'을 바람 새듯 또렷하게" },
  t: { name: "t", how: "혀끝으로 윗잇몸을 톡 쳐서 또렷하게" },
  d: { name: "d", how: "혀끝으로 윗잇몸을 톡 치며 목을 울려요" },
  p: { name: "p", how: "입술을 붙였다가 바람과 함께 터뜨려요" },
  b: { name: "b", how: "입술을 붙였다가 목을 울리며 터뜨려요" },
  k: { name: "k", how: "혀 뒤쪽으로 막았다가 터뜨려요" },
  g: { name: "g", how: "혀 뒤쪽으로 막았다가 목을 울리며 터뜨려요" },
  m: { name: "m", how: "입술을 다물고 콧소리로" },
  n: { name: "n", how: "혀끝을 윗잇몸에 대고 콧소리로" },
  hh: { name: "h", how: "목에서 바람을 '흐' 하고 내보내요" },
  h: { name: "h", how: "목에서 바람을 '흐' 하고 내보내요" },
};

const STOP_WORDS = new Set([
  "a", "an", "the", "i", "you", "he", "she", "it", "we", "they", "to", "of", "in", "on", "at", "for",
  "and", "or", "but", "is", "are", "was", "be", "do", "so", "my", "your", "me", "just", "that", "this",
]);

export interface FeedbackLine {
  /** 단어 (전체 피드백이면 null) */
  word: string | null;
  text: string;
}

/** 점수가 낮은 단어와 소리를 골라 고치는 법을 알려준다 (최대 3단어 + 전체 조언 2개) */
export function buildDetailedFeedback(words: Word[], scores: Scores): FeedbackLine[] {
  const lines: FeedbackLine[] = [];
  const spoken = words.filter((w) => w.errorType !== "Insertion");

  const missing = spoken.filter((w) => w.errorType === "Omission").map((w) => `'${w.word}'`);
  if (missing.length) {
    lines.push({
      word: null,
      text: `${missing.join(", ")}를 빠뜨렸어요. 작은 단어도 살짝이라도 소리 내 주세요.`,
    });
  }

  // the·a·to 같은 작은 단어는 초보에게 너무 세세해서 소리 교정 대상에서 뺀다
  const weak = spoken
    .filter((w) => w.errorType !== "Omission" && w.accuracy < 80 && !STOP_WORDS.has(w.word.toLowerCase()))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);
  for (const w of weak) {
    const sounds = [...w.phonemes]
      .filter((p) => p.accuracy < 60 && SOUNDS[p.phoneme])
      .sort((a, b) => a.accuracy - b.accuracy);
    // 같은 이름(th/dh 등)은 한 번만, 가장 약한 소리 2개까지
    const seen = new Set<string>();
    const picked = sounds.filter((p) => !seen.has(SOUNDS[p.phoneme].name) && seen.add(SOUNDS[p.phoneme].name)).slice(0, 2);
    const detail = picked.length
      ? picked.map((p) => `'${SOUNDS[p.phoneme].name}' 소리 → ${SOUNDS[p.phoneme].how}`).join(" / ")
      : "단어를 한 음절씩 또박또박 다시 말해 보세요. 단어를 누르면 천천히 들을 수 있어요.";
    lines.push({ word: w.word, text: `${Math.round(w.accuracy)}점 · ${detail}` });
  }

  const tips: string[] = [];
  if (scores.fluency != null && scores.fluency < 70) {
    tips.push("중간에 멈춘 곳이 있어요. 🐢 천천히 듣기로 리듬을 익힌 뒤, 문장을 한 호흡으로 쭉 이어 말해 보세요.");
  }
  if (scores.prosody != null && scores.prosody < 70) {
    const key = spoken
      .map((w) => w.word)
      .filter((w) => !STOP_WORDS.has(w.toLowerCase()))
      .sort((a, b) => b.length - a.length)[0];
    tips.push(
      `억양이 조금 평평하게 들려요.${key ? ` 중요한 단어 '${key}'를` : " 중요한 단어를"} 더 크고 길게 말하면 훨씬 자연스러워요.`,
    );
  }
  if (tips.length === 0 && lines.length === 0) {
    tips.push("아주 좋아요! 이번엔 원어민 속도에 맞춰 한 번 더 녹음해 보세요.");
  }
  for (const t of tips.slice(0, 2)) lines.push({ word: null, text: t });
  return lines;
}
