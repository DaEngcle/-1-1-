// 호주 슬랭·줄임말 60개 (10개씩 6세트). 서버·브라우저 공용

export type Slang = { term: string; ko: string; example: string; example_ko: string; note?: string };

const s = (term: string, ko: string, example: string, example_ko: string, note?: string): Slang => ({
  term, ko, example, example_ko, ...(note ? { note } : {}),
});

export const SLANG_SETS: { id: number; title: string; emoji: string; items: Slang[] }[] = [
  {
    id: 1,
    title: "인사·대답",
    emoji: "👋",
    items: [
      s("G'day", "안녕 (하루 중 언제든)", "G'day mate, how's it going?", "안녕 친구, 잘 지내?"),
      s("mate", "친구 (모르는 사람에게도 친근하게)", "Thanks, mate!", "고마워요!", "가게 직원·처음 본 사람에게도 써요"),
      s("No worries", "괜찮아요 / 천만에요", "No worries, I'll sort it out.", "괜찮아요, 제가 처리할게요."),
      s("How ya going?", "잘 지내? (How are you?)", "Hey, how ya going? — Good, thanks!", "안녕, 잘 지내? — 응, 고마워!", "대답은 Good / Not bad로 짧게"),
      s("Cheers", "고마워 / 건배 / 잘 가", "Cheers for the coffee!", "커피 고마워!"),
      s("heaps", "엄청, 아주 많이", "Thanks heaps!", "정말 고마워!"),
      s("reckon", "~라고 생각하다", "I reckon it'll rain later.", "이따 비 올 것 같아."),
      s("keen", "하고 싶은, 관심 있는", "Are you keen for a beach day?", "바다 갈래?"),
      s("Too easy", "문제없지, 쉽지, 좋아", "Can you start at 7? — Too easy.", "7시 출근 돼요? — 그럼요."),
      s("She'll be right", "괜찮을 거야, 잘 될 거야", "Don't stress, she'll be right.", "걱정 마, 다 잘 될 거야."),
    ],
  },
  {
    id: 2,
    title: "음식·장소 줄임말",
    emoji: "🍳",
    items: [
      s("arvo", "오후 (afternoon)", "See you this arvo!", "오늘 오후에 봐!"),
      s("brekkie", "아침밥 (breakfast)", "Let's grab brekkie before work.", "출근 전에 아침 먹자."),
      s("avo", "아보카도", "I'll have the smashed avo on toast.", "으깬 아보카도 토스트 주세요."),
      s("barbie", "바비큐", "We're having a barbie on Sunday.", "일요일에 바비큐 해."),
      s("snag", "소시지", "Grab a snag from the barbie!", "바비큐에서 소시지 하나 가져가!", "선거날 '소시지 시즐'도 유명해요"),
      s("Macca's", "맥도날드", "Wanna get Macca's after the movie?", "영화 끝나고 맥도날드 갈래?"),
      s("bottle-o", "주류 판매점", "I'll stop at the bottle-o on the way.", "가는 길에 술 가게 들를게."),
      s("servo", "주유소 (편의점 겸용)", "Let's get snacks at the servo.", "주유소에서 간식 사자."),
      s("sanga", "샌드위치", "I made a ham sanga for lunch.", "점심으로 햄 샌드위치 쌌어."),
      s("cuppa", "차·커피 한 잔", "Fancy a cuppa?", "차 한잔할래?"),
    ],
  },
  {
    id: 3,
    title: "생활 물건",
    emoji: "🩴",
    items: [
      s("thongs", "슬리퍼, 쪼리", "Don't wear thongs to the job interview.", "면접에 쪼리 신고 가지 마.", "속옷이 아니에요!"),
      s("sunnies", "선글라스", "Grab your sunnies, it's bright out.", "선글라스 챙겨, 밖에 눈부셔."),
      s("togs", "수영복", "Bring your togs, we're going to the beach.", "수영복 챙겨, 바다 가."),
      s("ute", "픽업트럭", "He drives a ute for work.", "그는 일 때문에 픽업트럭을 몰아."),
      s("esky", "아이스박스", "Put the drinks in the esky.", "음료는 아이스박스에 넣어."),
      s("bikkie", "비스킷, 과자", "Want a bikkie with your tea?", "차랑 과자 먹을래?"),
      s("uni", "대학교", "She's studying nursing at uni.", "걔 대학에서 간호학 공부해."),
      s("footy", "풋볼 (호주식 풋볼·럭비)", "Are you watching the footy tonight?", "오늘 밤 풋볼 볼 거야?"),
      s("rego", "차량 등록 (registration)", "My car rego is due next month.", "다음 달에 차 등록 갱신해야 해."),
      s("Woolies", "울워스 (마트)", "I'm doing a Woolies run, need anything?", "울워스 장 보러 가는데 필요한 거 있어?", "콜스(Coles)와 함께 2대 마트"),
    ],
  },
  {
    id: 4,
    title: "감정·상태",
    emoji: "😆",
    items: [
      s("stoked", "엄청 기쁜", "I'm stoked I got the job!", "일 구해서 너무 기뻐!"),
      s("knackered", "완전 지친", "I'm knackered after that double shift.", "더블 근무 했더니 완전 녹초야."),
      s("crook", "아픈", "I'm feeling a bit crook today.", "오늘 몸이 좀 안 좋아."),
      s("dodgy", "수상한, 질 나쁜", "That rental ad looks a bit dodgy.", "그 집 광고 좀 수상해 보여."),
      s("fair dinkum", "진짜로, 정말이야", "Fair dinkum, I saw a kangaroo in the street!", "진짜야, 길에서 캥거루 봤어!"),
      s("Strewth", "세상에! 맙소사!", "Strewth, that's expensive!", "세상에, 그거 비싸다!"),
      s("ripper", "최고의, 끝내주는", "That was a ripper of a weekend.", "끝내주는 주말이었어."),
      s("whinge", "징징대다, 불평하다", "Stop whingeing about the weather.", "날씨 가지고 그만 징징대."),
      s("devo", "엄청 아쉬운 (devastated)", "The café closed? I'm devo.", "그 카페 문 닫았어? 너무 아쉽다."),
      s("suss", "수상한 / 알아보다", "That guy seems a bit suss.", "저 사람 좀 수상해 보여.", "suss it out = 알아보다"),
    ],
  },
  {
    id: 5,
    title: "대화 필수 표현",
    emoji: "💬",
    items: [
      s("Yeah, nah", "아니 (거절)", "Want another drink? — Yeah, nah, I'm good.", "한 잔 더? — 아니, 괜찮아.", "끝에 오는 말이 진짜 대답!"),
      s("Nah, yeah", "응 (긍정)", "Is it good? — Nah, yeah, it's great.", "괜찮아? — 응, 좋아."),
      s("It's my shout", "내가 살게", "Put your wallet away, it's my shout.", "지갑 넣어, 내가 살게."),
      s("chuck", "던지다, 하다", "Chuck it in the bin.", "쓰레기통에 버려.", "chuck a U-ey = 유턴하다"),
      s("bail", "약속 취소하다, 먼저 가다", "Sorry, I have to bail tonight.", "미안, 오늘 밤 못 가겠어."),
      s("defo", "확실히, 무조건 (definitely)", "I'm defo coming to your party.", "네 파티 무조건 갈게."),
      s("How good is that!", "진짜 좋다! (감탄)", "Free coffee on Fridays — how good is that!", "금요일마다 커피 공짜라니, 대박!"),
      s("Heaps good", "엄청 좋은 (남호주에서 많이 씀)", "This pie is heaps good.", "이 파이 진짜 맛있다."),
      s("Good on ya", "잘했어, 멋지다", "You passed your test? Good on ya!", "시험 붙었어? 잘했다!"),
      s("Catch ya later", "나중에 봐", "I'm off. Catch ya later!", "나 간다. 이따 봐!"),
    ],
  },
  {
    id: 6,
    title: "직장·워홀",
    emoji: "🧰",
    items: [
      s("smoko", "(일 중간) 쉬는 시간", "We'll have smoko at 10.", "10시에 쉬자.", "담배 안 피워도 smoko예요"),
      s("tradie", "기술직 노동자 (배관공·목수 등)", "Tradies start work really early.", "기술직은 엄청 일찍 일을 시작해."),
      s("sparky", "전기 기술자", "We need a sparky to fix the lights.", "전등 고치려면 전기 기술자가 필요해."),
      s("chippie", "목수 (carpenter)", "My housemate works as a chippie.", "내 하우스메이트는 목수로 일해."),
      s("flat out", "엄청 바쁜", "We've been flat out all morning.", "아침 내내 정신없이 바빴어."),
      s("rostered on", "근무가 잡힌", "Am I rostered on this weekend?", "저 이번 주말에 근무 있어요?", "roster = 근무표"),
      s("knock off", "퇴근하다, 일 끝내다", "What time do you knock off?", "몇 시에 퇴근해?"),
      s("have a go", "한번 해보다", "Just have a go, you'll be fine.", "그냥 한번 해봐, 괜찮을 거야."),
      s("a fair go", "공정한 기회", "Everyone deserves a fair go.", "누구나 공정한 기회를 받을 자격이 있어."),
      s("chuck a sickie", "(꾀병으로) 아프다고 하고 쉬다", "Did he chuck a sickie on Monday?", "걔 월요일에 아프다고 하고 쉰 거야?"),
    ],
  },
];

export function slangSet(id: number) {
  return SLANG_SETS.find((x) => x.id === id) ?? null;
}
