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

/**
 * 실제 호주 워홀 면접에서 자주 나오는 질문 (면접관이 그대로 읽지 않고 자연스럽게 바꿔서 쓴다).
 * 앞쪽은 쉬운 질문, 뒤쪽은 상황 질문.
 */
export const QUESTION_BANK: Record<string, string[]> = {
  cafe: [
    "How long have you been in Australia, and how long are you planning to stay?",
    "Have you worked in a café before? What did you do there?",
    "Can you make coffee? What's your go-to coffee?",
    "How would you make a flat white, step by step?",
    "We get really slammed on weekends. How do you handle a long queue?",
    "A customer says their coffee is too cold. What do you do?",
    "What would you do if you saw a co-worker taking money from the till?",
    "Which days can you work? Are you okay with 6am starts?",
    "Have you got your RSA, or anything like that?",
    "Why do you want to work here, in this café?",
  ],
  chef: [
    "What kitchens have you worked in before?",
    "Which sections have you worked on? Grill, fryer, larder?",
    "How do you keep your station clean during a busy service?",
    "What would you do if you ran out of something in the middle of service?",
    "How do you store raw meat and veggies in the cool room?",
    "The head chef yells 'behind!' What does that mean?",
    "Can you handle long shifts on your feet, like ten hours?",
    "Are you okay with split shifts and late finishes?",
    "Have you ever cut yourself or had a burn at work? What did you do?",
    "When could you come in for a trial shift?",
  ],
  hotel: [
    "Tell me about yourself and why you want to work in a hotel.",
    "Have you had any customer service experience?",
    "A guest's room isn't ready but they want to check in now. What do you say?",
    "How would you deal with a guest complaining about noise at 2am?",
    "Housekeeping: how many rooms do you think you could clean in a shift?",
    "How would you describe good customer service?",
    "Can you work night shifts or public holidays?",
    "What would you do if a guest left something valuable in their room?",
    "How do you handle stress when it's really busy?",
    "Do you have any questions for me about the role?",
  ],
  carpenter: [
    "Have you got your White Card?",
    "What construction or labouring work have you done before?",
    "What tools are you comfortable using?",
    "Do you have your own boots, hi-vis and tools?",
    "What would you do if you saw something unsafe on site?",
    "It's 38 degrees today. How do you look after yourself on a hot day?",
    "Can you read a tape measure in millimetres?",
    "Have you got your own car to get to different sites?",
    "We start at 6:30 sharp. Is that okay for you?",
    "How long can you work for us? Are you doing your 88 days?",
  ],
  farm: [
    "Have you done any farm work or picking before?",
    "Are you doing your 88 days for your second visa?",
    "Picking is hard work in the sun. Are you physically fit?",
    "We pay by the bucket, not by the hour. Is that okay with you?",
    "How would you make sure you're picking the right fruit, not damaged ones?",
    "Have you got your own transport to the farm?",
    "Where are you staying at the moment?",
    "Can you work six days a week during the season?",
    "What would you do if you felt sick or dizzy while working?",
    "When can you start?",
  ],
  retail: [
    "Have you worked in a shop before?",
    "How would you approach a customer who's just looking around?",
    "A customer wants to return something without a receipt. What do you do?",
    "Have you used a register or POS system?",
    "What would you do if you saw someone shoplifting?",
    "How do you stay busy when the store is quiet?",
    "Tell me about a time you gave great customer service.",
    "Can you work weekends and late-night trading on Thursdays?",
    "What do you know about our store?",
    "Why should we hire you?",
  ],
  sharehouse: [
    "So what brings you to Australia?",
    "What do you do for work, and what are your hours?",
    "How long are you looking to stay?",
    "Are you a tidy person? How do you feel about a cleaning roster?",
    "Do you smoke, or have any pets?",
    "Do you cook much? We share the kitchen.",
    "Are you okay with the bond and paying rent fortnightly?",
    "Do you usually have friends over or partners staying the night?",
    "What do you like to do in your free time?",
    "When would you want to move in?",
  ],
};
