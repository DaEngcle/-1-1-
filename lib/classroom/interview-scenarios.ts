// AI 면접·대화 시뮬레이션: 면접관 캐릭터와 상황. 서버·브라우저 공용

export type Look = {
  skin: string;
  hair: string;
  hairStyle: "short" | "long" | "bun" | "curly" | "ponytail" | "buzz";
  outfit: string;
  accent: string;
  hat?: "chef" | "hardhat" | "brim" | "cap";
  beard?: boolean;
  glasses?: boolean;
  bg: string;
};

export type Scenario = {
  id: string;
  title: string;
  emoji: string;
  job: string;
  place: string;
  level: "쉬움" | "보통" | "어려움";
  name: string;
  roleKo: string;
  /** azure-speech.ts의 TTS_VOICES 키 (사람 같은 다국어 목소리 + 호주 억양) */
  voice: "ava_au" | "andrew_au" | "emma_au" | "brian_au" | "serena_au" | "phoebe_au" | "davis_au";
  look: Look;
  /** 첫 인사 (AI 없이 바로 나온다) */
  opening: string;
  /** 면접관 성격·말투 */
  persona: string;
  /** 물어볼 주제 */
  topics: string[];
  /** 미리 보는 핵심 표현 */
  prep: { en: string; ko: string }[];
};

export const SCENARIOS: Scenario[] = [
  {
    id: "cafe",
    title: "카페 바리스타 면접",
    emoji: "☕",
    job: "barista / all-rounder",
    place: "a busy brunch café in Melbourne",
    level: "쉬움",
    name: "Mia",
    roleKo: "카페 매니저",
    voice: "ava_au",
    look: { skin: "#F2C9A5", hair: "#5A3825", hairStyle: "bun", outfit: "#3D5A40", accent: "#E9D8B4", bg: "#FFE9C7" },
    opening: "Hey, thanks for coming in! I'm Mia, the manager here. Grab a seat. So, how's your day going so far?",
    persona: "warm, chatty and upbeat; uses casual Aussie words like 'no worries', 'heaps', 'reckon'",
    topics: [
      "small talk and how long they've been in Australia",
      "barista or hospitality experience",
      "how they make a flat white or handle a big coffee order rush",
      "dealing with an unhappy customer",
      "availability, weekends and early starts",
      "when they could do a trial shift",
    ],
    prep: [
      { en: "I've got about a year of barista experience.", ko: "바리스타 경력이 1년 정도 있어요." },
      { en: "I'm available on weekends.", ko: "주말에 일할 수 있어요." },
      { en: "I work well under pressure.", ko: "바쁠 때도 잘 해요." },
      { en: "I'd love to do a trial shift.", ko: "트라이얼 꼭 해보고 싶어요." },
    ],
  },
  {
    id: "chef",
    title: "주방 (셰프·키친핸드) 면접",
    emoji: "👨‍🍳",
    job: "kitchen hand / commis chef",
    place: "a modern Italian restaurant in Sydney",
    level: "보통",
    name: "Marco",
    roleKo: "헤드 셰프",
    voice: "andrew_au",
    look: { skin: "#E0B08A", hair: "#2B2B2B", hairStyle: "short", outfit: "#FFFFFF", accent: "#1F2937", hat: "chef", beard: true, bg: "#FFE1DC" },
    opening: "G'day, I'm Marco, head chef. We haven't got long before service, so let's crack on. Tell me a bit about your kitchen experience?",
    persona: "busy and direct but fair; short sentences; kitchen slang like 'service', 'prep', 'behind'",
    topics: [
      "kitchen experience and what stations they've worked",
      "food safety and hygiene basics",
      "working fast during a busy service",
      "how they handle being yelled at or a mistake",
      "split shifts and late nights",
      "knife skills or what dish they cook best",
    ],
    prep: [
      { en: "I've worked as a kitchen hand for six months.", ko: "키친핸드로 6개월 일했어요." },
      { en: "I'm a fast learner.", ko: "빨리 배워요." },
      { en: "I always keep my station clean.", ko: "제 자리는 항상 깨끗하게 해요." },
      { en: "I'm happy to do split shifts.", ko: "분할 근무도 괜찮아요." },
    ],
  },
  {
    id: "hotel",
    title: "호텔 (프런트·하우스키핑) 면접",
    emoji: "🏨",
    job: "front desk / housekeeping",
    place: "a four-star hotel in Brisbane",
    level: "보통",
    name: "Sophie",
    roleKo: "프런트 오피스 매니저",
    voice: "emma_au",
    look: { skin: "#F5D3B8", hair: "#C68A3C", hairStyle: "long", outfit: "#1E3A5F", accent: "#D4AF37", glasses: true, bg: "#DCE9FF" },
    opening: "Good morning, and welcome. I'm Sophie, the front office manager. Thanks for applying. Could you start by introducing yourself?",
    persona: "polite, professional and calm; slightly more formal language",
    topics: [
      "introduction and why they want to work in a hotel",
      "customer service experience",
      "a guest complaining that their room isn't clean",
      "speaking other languages",
      "working night shifts and weekends",
      "attention to detail",
    ],
    prep: [
      { en: "I really enjoy helping people.", ko: "사람 돕는 걸 정말 좋아해요." },
      { en: "I'd apologise and fix it right away.", ko: "사과하고 바로 해결할게요." },
      { en: "I speak Korean and English.", ko: "한국어와 영어를 해요." },
      { en: "I'm very detail-oriented.", ko: "꼼꼼한 편이에요." },
    ],
  },
  {
    id: "carpenter",
    title: "건설 현장 (목수·레이버러) 면접",
    emoji: "🔨",
    job: "carpenter's labourer",
    place: "a residential building site in Perth",
    level: "어려움",
    name: "Gaz",
    roleKo: "현장 반장",
    voice: "brian_au",
    look: { skin: "#D9A47A", hair: "#8A5A2B", hairStyle: "buzz", outfit: "#F97316", accent: "#FDE047", hat: "hardhat", beard: true, bg: "#FFE8CC" },
    opening: "Mate, how ya going? I'm Gaz, I run the site. Quick chat, then I'll show you around. You got your White Card?",
    persona: "very laid-back, strong Aussie slang ('mate', 'arvo', 'smoko', 'no dramas'), talks fast but friendly",
    topics: [
      "White Card and safety gear",
      "experience with tools or building",
      "early starts (6am) and working in the heat",
      "lifting heavy stuff and physical fitness",
      "whether they have a car or can get to site",
      "how long they're staying in town",
    ],
    prep: [
      { en: "Yeah, I've got my White Card.", ko: "네, 화이트카드 있어요." },
      { en: "I'm fine with early starts.", ko: "일찍 시작하는 거 괜찮아요." },
      { en: "I've used power tools before.", ko: "전동 공구 써봤어요." },
      { en: "No dramas, I can get there.", ko: "문제없어요, 갈 수 있어요." },
    ],
  },
  {
    id: "farm",
    title: "농장 (과일 피킹) 면접",
    emoji: "🍓",
    job: "fruit picker / packer",
    place: "a strawberry farm near Caboolture, Queensland",
    level: "쉬움",
    name: "Bec",
    roleKo: "농장 슈퍼바이저",
    voice: "serena_au",
    look: { skin: "#EDBE95", hair: "#B5651D", hairStyle: "ponytail", outfit: "#4D7C0F", accent: "#FACC15", hat: "brim", bg: "#E6F7D9" },
    opening: "Hi there! I'm Bec, I look after the pickers. Thanks for calling back. So, have you done any farm work before?",
    persona: "friendly, practical and straight to the point; explains things simply",
    topics: [
      "farm or physical work experience",
      "working outside in the sun and rain",
      "piece rate vs hourly pay",
      "accommodation and transport to the farm",
      "how many days a week and for how long (88 days?)",
      "start date",
    ],
    prep: [
      { en: "I don't mind working outside.", ko: "밖에서 일하는 거 괜찮아요." },
      { en: "Is it hourly or piece rate?", ko: "시급이에요, 성과급이에요?" },
      { en: "I need to do my 88 days.", ko: "88일 채워야 해요." },
      { en: "I can start next Monday.", ko: "다음 주 월요일부터 할 수 있어요." },
    ],
  },
  {
    id: "retail",
    title: "매장 (리테일) 면접",
    emoji: "🛍️",
    job: "retail assistant",
    place: "a clothing store in Gold Coast",
    level: "보통",
    name: "Jess",
    roleKo: "매장 매니저",
    voice: "phoebe_au",
    look: { skin: "#C98E62", hair: "#1F1A17", hairStyle: "curly", outfit: "#BE185D", accent: "#FBCFE8", bg: "#FCE7F3" },
    opening: "Hi! Welcome in, I'm Jess. Love that you dropped your resume off in person. So, what kind of shopping do you like doing?",
    persona: "bubbly and friendly; likes people with energy; casual",
    topics: [
      "why they want to work in retail",
      "helping a customer find the right size",
      "handling cash and the register",
      "a customer wanting a refund without a receipt",
      "working on busy weekends and sale days",
      "teamwork",
    ],
    prep: [
      { en: "Can I help you find anything?", ko: "찾으시는 거 도와드릴까요?" },
      { en: "I love chatting with customers.", ko: "손님이랑 얘기하는 거 좋아해요." },
      { en: "I've used a till before.", ko: "계산대 써봤어요." },
      { en: "I'm a real team player.", ko: "팀워크 좋아해요." },
    ],
  },
  {
    id: "sharehouse",
    title: "쉐어하우스 집 인터뷰",
    emoji: "🏠",
    job: "a room in their sharehouse",
    place: "a sharehouse in Bondi, Sydney",
    level: "쉬움",
    name: "Liam",
    roleKo: "하우스메이트",
    voice: "davis_au",
    look: { skin: "#F1C7A2", hair: "#D4A017", hairStyle: "short", outfit: "#0EA5E9", accent: "#FFFFFF", hat: "cap", bg: "#D9F2FF" },
    opening: "Hey, you must be here about the room! I'm Liam. Come in, come in. So, where are you from?",
    persona: "chilled surfer type, relaxed and friendly; asks about lifestyle more than money",
    topics: [
      "where they're from and what they do in Australia",
      "work or study schedule",
      "cleaning and cooking habits",
      "guests, partying and quiet hours",
      "how long they want to stay, bond and move-in date",
      "hobbies (surfing, gym)",
    ],
    prep: [
      { en: "I'm pretty tidy.", ko: "저 꽤 깔끔해요." },
      { en: "I work during the day.", ko: "낮에 일해요." },
      { en: "I'm looking to stay for six months.", ko: "6개월 정도 살려고요." },
      { en: "When could I move in?", ko: "언제 들어갈 수 있어요?" },
    ],
  },
];

export function scenario(id: string) {
  return SCENARIOS.find((s) => s.id === id) ?? null;
}

/** 하루에 할 수 있는 횟수: 수강생 · AI 면접 패스 */
export const DAILY_LIMIT = { student: 5, pass: 3 };
/** 무료회원 무료 체험 횟수 (전체 기간) */
export const FREE_TRIALS = 1;
/** AI 면접 패스 (계좌이체 → 선생님이 열어줌) */
export const TALK_PASS = { price: 9900, months: 1, name: "AI 면접 패스 1개월" };
export const MAX_TURNS = 10;
