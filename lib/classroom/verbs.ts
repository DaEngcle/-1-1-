// 왕초보를 위한 불규칙 동사 3단변화 — 많이 쓰는 순서로 10개씩 9세트. 서버·브라우저 공용

/** AAA: 셋 다 같음 · ABB: 과거=과거분사 · ABC: 셋 다 다름 · ABA: 원형=과거분사 */
export type VerbPattern = "AAA" | "ABB" | "ABC" | "ABA";
export type Verb = { base: string; past: string; pp: string; ko: string; pattern: VerbPattern; note?: string };

export const PATTERN_INFO: Record<VerbPattern, { label: string; tip: string; color: string }> = {
  AAA: { label: "A-A-A", tip: "셋 다 똑같아요", color: "bg-sky-100 text-sky-800" },
  ABB: { label: "A-B-B", tip: "과거 = 과거분사", color: "bg-emerald-100 text-emerald-800" },
  ABC: { label: "A-B-C", tip: "셋 다 달라요", color: "bg-rose-100 text-rose-800" },
  ABA: { label: "A-B-A", tip: "원형 = 과거분사", color: "bg-amber-100 text-amber-800" },
};

const v = (base: string, past: string, pp: string, ko: string, pattern: VerbPattern, note?: string): Verb => ({
  base, past, pp, ko, pattern, ...(note ? { note } : {}),
});

export const VERB_SETS: { id: number; title: string; verbs: Verb[] }[] = [
  {
    id: 1,
    title: "필수 TOP 10",
    verbs: [
      v("be", "was / were", "been", "~이다, 있다", "ABC", "I·he·she·it은 was, you·we·they는 were"),
      v("have", "had", "had", "가지다, 먹다", "ABB"),
      v("do", "did", "done", "하다", "ABC"),
      v("go", "went", "gone", "가다", "ABC"),
      v("get", "got", "got", "얻다, 되다", "ABB", "미국은 p.p.로 gotten도 써요. 호주는 주로 got"),
      v("make", "made", "made", "만들다", "ABB"),
      v("say", "said", "said", "말하다", "ABB", "said는 [세드]로 읽어요"),
      v("see", "saw", "seen", "보다", "ABC"),
      v("take", "took", "taken", "가져가다, 타다", "ABC"),
      v("come", "came", "come", "오다", "ABA"),
    ],
  },
  {
    id: 2,
    title: "매일 쓰는 동사",
    verbs: [
      v("know", "knew", "known", "알다", "ABC", "k는 소리 안 나요: [노우]"),
      v("think", "thought", "thought", "생각하다", "ABB"),
      v("give", "gave", "given", "주다", "ABC"),
      v("find", "found", "found", "찾다", "ABB"),
      v("tell", "told", "told", "말해주다", "ABB"),
      v("become", "became", "become", "~이 되다", "ABA"),
      v("leave", "left", "left", "떠나다, 두고 가다", "ABB"),
      v("feel", "felt", "felt", "느끼다", "ABB"),
      v("put", "put", "put", "놓다, 두다", "AAA"),
      v("bring", "brought", "brought", "가져오다", "ABB"),
    ],
  },
  {
    id: 3,
    title: "대화 필수",
    verbs: [
      v("begin", "began", "begun", "시작하다", "ABC"),
      v("keep", "kept", "kept", "유지하다, 계속하다", "ABB"),
      v("hold", "held", "held", "잡다, 들다", "ABB"),
      v("write", "wrote", "written", "쓰다", "ABC"),
      v("stand", "stood", "stood", "서다", "ABB"),
      v("hear", "heard", "heard", "듣다", "ABB", "heard는 [허드]"),
      v("let", "let", "let", "~하게 두다", "AAA"),
      v("mean", "meant", "meant", "의미하다", "ABB", "meant는 [멘트]"),
      v("set", "set", "set", "놓다, 정하다", "AAA"),
      v("meet", "met", "met", "만나다", "ABB"),
    ],
  },
  {
    id: 4,
    title: "생활·돈",
    verbs: [
      v("run", "ran", "run", "달리다, 운영하다", "ABA"),
      v("pay", "paid", "paid", "내다, 지불하다", "ABB"),
      v("sit", "sat", "sat", "앉다", "ABB"),
      v("speak", "spoke", "spoken", "말하다", "ABC"),
      v("lose", "lost", "lost", "잃어버리다, 지다", "ABB"),
      v("buy", "bought", "bought", "사다", "ABB"),
      v("send", "sent", "sent", "보내다", "ABB"),
      v("build", "built", "built", "짓다", "ABB"),
      v("understand", "understood", "understood", "이해하다", "ABB"),
      v("spend", "spent", "spent", "(돈·시간을) 쓰다", "ABB"),
    ],
  },
  {
    id: 5,
    title: "워홀 일상",
    verbs: [
      v("eat", "ate", "eaten", "먹다", "ABC"),
      v("drink", "drank", "drunk", "마시다", "ABC"),
      v("drive", "drove", "driven", "운전하다", "ABC"),
      v("ride", "rode", "ridden", "타다", "ABC"),
      v("sleep", "slept", "slept", "자다", "ABB"),
      v("wake", "woke", "woken", "깨다", "ABC"),
      v("wear", "wore", "worn", "입다", "ABC"),
      v("sell", "sold", "sold", "팔다", "ABB"),
      v("teach", "taught", "taught", "가르치다", "ABB"),
      v("swim", "swam", "swum", "수영하다", "ABC"),
    ],
  },
  {
    id: 6,
    title: "움직임",
    verbs: [
      v("break", "broke", "broken", "깨다, 부러지다", "ABC"),
      v("choose", "chose", "chosen", "고르다", "ABC"),
      v("forget", "forgot", "forgotten", "잊다", "ABC"),
      v("catch", "caught", "caught", "잡다", "ABB"),
      v("fight", "fought", "fought", "싸우다", "ABB"),
      v("throw", "threw", "thrown", "던지다", "ABC"),
      v("fall", "fell", "fallen", "떨어지다, 넘어지다", "ABC"),
      v("grow", "grew", "grown", "자라다, 기르다", "ABC"),
      v("draw", "drew", "drawn", "그리다", "ABC"),
      v("fly", "flew", "flown", "날다", "ABC"),
    ],
  },
  {
    id: 7,
    title: "셋 다 같은 동사",
    verbs: [
      v("cut", "cut", "cut", "자르다", "AAA"),
      v("hit", "hit", "hit", "치다", "AAA"),
      v("hurt", "hurt", "hurt", "다치게 하다, 아프다", "AAA"),
      v("cost", "cost", "cost", "(값이) 들다", "AAA"),
      v("shut", "shut", "shut", "닫다", "AAA"),
      v("quit", "quit", "quit", "그만두다", "AAA"),
      v("read", "read", "read", "읽다", "AAA", "쓰기는 같지만 과거·과거분사는 [레드]로 읽어요"),
      v("spread", "spread", "spread", "펴다, 퍼지다", "AAA"),
      v("bet", "bet", "bet", "내기하다, 장담하다", "AAA", "I bet! = 그럴 줄 알았어!"),
      v("upset", "upset", "upset", "속상하게 하다", "AAA"),
    ],
  },
  {
    id: 8,
    title: "모음이 바뀌는 동사",
    verbs: [
      v("sing", "sang", "sung", "노래하다", "ABC"),
      v("ring", "rang", "rung", "울리다, 전화하다", "ABC"),
      v("steal", "stole", "stolen", "훔치다", "ABC"),
      v("hide", "hid", "hidden", "숨다, 숨기다", "ABC"),
      v("bite", "bit", "bitten", "물다", "ABC"),
      v("shake", "shook", "shaken", "흔들다", "ABC"),
      v("freeze", "froze", "frozen", "얼다", "ABC"),
      v("forgive", "forgave", "forgiven", "용서하다", "ABC"),
      v("lend", "lent", "lent", "빌려주다", "ABB"),
      v("win", "won", "won", "이기다", "ABB", "won은 [원]"),
    ],
  },
  {
    id: 9,
    title: "한 단계 더",
    verbs: [
      v("dig", "dug", "dug", "파다", "ABB"),
      v("hang", "hung", "hung", "걸다, 매달다", "ABB"),
      v("stick", "stuck", "stuck", "붙이다, 꽂히다", "ABB", "I'm stuck = 막혔어, 꼼짝 못 해"),
      v("shoot", "shot", "shot", "쏘다, 찍다", "ABB"),
      v("feed", "fed", "fed", "먹이다", "ABB"),
      v("lead", "led", "led", "이끌다", "ABB"),
      v("sweep", "swept", "swept", "쓸다", "ABB"),
      v("bend", "bent", "bent", "구부리다", "ABB"),
      v("light", "lit", "lit", "불을 붙이다", "ABB"),
      v("show", "showed", "shown", "보여주다", "ABC", "과거는 규칙(showed), 과거분사만 shown"),
    ],
  },
];

/** 무료회원은 앞 2세트만 */
export const FREE_VERB_SETS = 2;

export function verbSet(id: number) {
  return VERB_SETS.find((s) => s.id === id) ?? null;
}

/** 'make'에 규칙(-ed)을 잘못 붙인 형태 — 오답 보기용 */
export function regularized(base: string) {
  if (base.endsWith("e")) return `${base}d`;
  if (/[^aeiou]y$/.test(base)) return `${base.slice(0, -1)}ied`;
  return `${base}ed`;
}

export function starsFor(percent: number) {
  return percent >= 90 ? 3 : percent >= 70 ? 2 : percent >= 50 ? 1 : 0;
}
