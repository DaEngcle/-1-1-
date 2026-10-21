// 보카 표현 단어장: 호주 슬랭 · 상황별 생존 표현 · 필수 구동사. 서버·브라우저 공용
// 예문에는 표현(term)이 그대로 들어가야 '빈칸 채우기' 문제가 만들어진다.

import { SLANG_SETS, type Slang } from "./slang";

export type Phrase = Slang;
export type PhraseSet = { id: number; title: string; emoji: string; items: Phrase[] };
export type PhraseDeck = {
  id: "slang" | "survival" | "phrasal";
  title: string;
  emoji: string;
  desc: string;
  /** 문제 칩에 쓰는 이름 */
  quizLabel: string;
  sets: PhraseSet[];
};

const p = (term: string, ko: string, example: string, example_ko: string, note?: string): Phrase => ({
  term, ko, example, example_ko, ...(note ? { note } : {}),
});

const SURVIVAL: PhraseSet[] = [
  {
    id: 1,
    title: "카페 주문",
    emoji: "☕",
    items: [
      p("Can I get", "~ 주세요 (주문할 때)", "Can I get a large flat white, please?", "라지 플랫화이트 하나 주세요."),
      p("dine in or takeaway", "드시고 가세요, 가져가세요?", "Is that dine in or takeaway?", "드시고 가세요, 가져가세요?", "미국식 to go 대신 호주는 takeaway"),
      p("an extra shot", "샷 추가", "Could I get an extra shot in that?", "거기에 샷 추가해 주실래요?"),
      p("swap to", "~로 바꾸다", "Can I swap to oat milk?", "귀리 우유로 바꿀 수 있어요?"),
      p("That's all", "그게 다예요", "That's all, thanks.", "그게 다예요, 감사합니다."),
      p("pay by card", "카드로 계산하다", "Can I pay by card?", "카드로 계산해도 돼요?"),
      p("tap", "(카드를) 대다, 찍다", "You can just tap your card there.", "거기 카드 대시면 돼요.", "호주는 대부분 탭 결제"),
      p("name for the order", "주문하신 분 성함", "What's the name for the order?", "주문하신 분 성함이 어떻게 되세요?"),
      p("keep cup", "개인 컵, 텀블러", "Can you use my keep cup?", "제 텀블러에 담아 주실 수 있어요?", "가져가면 할인해 주는 카페도 있어요"),
      p("I ordered", "제가 주문한 건 ~예요 (잘못 나왔을 때)", "Sorry, I think I ordered a latte, not a cappuccino.", "죄송한데, 저 카푸치노 말고 라테 시킨 것 같아요."),
    ],
  },
  {
    id: 2,
    title: "면접·구직",
    emoji: "💼",
    items: [
      p("Are you hiring", "사람 구하세요?", "Hi, are you hiring at the moment?", "안녕하세요, 지금 사람 구하세요?"),
      p("drop off my resume", "이력서를 두고 가다", "Can I drop off my resume?", "이력서 드리고 가도 될까요?"),
      p("trial shift", "트라이얼 근무 (하루 시범 근무)", "Can you come in for a trial shift on Friday?", "금요일에 트라이얼 와줄 수 있어요?", "트라이얼도 일한 시간만큼 돈 받는 게 원칙이에요"),
      p("availability", "근무 가능한 시간", "What's your availability like?", "언제 일할 수 있어요?"),
      p("I'm available", "~에 일할 수 있어요", "I'm available on weekends and weekday mornings.", "주말이랑 평일 아침에 일할 수 있어요."),
      p("work rights", "일할 수 있는 비자(권한)", "Do you have full work rights?", "제한 없이 일할 수 있는 비자예요?"),
      p("experience in", "~ 경력", "I have two years of experience in hospitality.", "서비스업 경력 2년 있어요."),
      p("RSA", "주류 서빙 자격증", "Do you have your RSA?", "RSA 있어요?", "술 파는 곳에서 일하려면 필수"),
      p("hourly rate", "시급", "What's the hourly rate?", "시급이 얼마예요?"),
      p("cash in hand", "현금으로 (비공식) 지급", "They offered to pay me cash in hand.", "현금으로 준다고 했어.", "최저임금 미달·세금 문제가 생길 수 있어요"),
    ],
  },
  {
    id: 3,
    title: "쉐어하우스·렌트",
    emoji: "🏠",
    items: [
      p("still available", "아직 있어요? (매물)", "Hi, is the room still available?", "안녕하세요, 방 아직 있어요?"),
      p("inspection", "집 보기, 방문", "Can I book an inspection this weekend?", "이번 주말에 집 보러 가도 될까요?"),
      p("bond", "보증금", "The bond is two weeks' rent.", "보증금은 2주치 월세예요."),
      p("bills included", "공과금 포함", "Is that bills included?", "그거 공과금 포함이에요?"),
      p("per week", "주당", "It's $250 per week.", "주에 250달러예요.", "호주 렌트는 주 단위로 말해요"),
      p("lease", "임대 계약", "How long is the lease?", "계약 기간이 얼마나 돼요?"),
      p("move in", "입주하다", "When can I move in?", "언제 들어갈 수 있어요?"),
      p("flatmates", "같이 사는 사람들", "How many flatmates are there?", "같이 사는 사람 몇 명이에요?"),
      p("house rules", "집 규칙", "Are there any house rules?", "집 규칙 같은 거 있어요?"),
      p("notice", "(나가기 전에) 미리 알림", "I need to give two weeks' notice before I move out.", "나가기 2주 전에 말해야 해."),
    ],
  },
  {
    id: 4,
    title: "은행·TFN·폰",
    emoji: "🏦",
    items: [
      p("open a bank account", "은행 계좌를 만들다", "I'd like to open a bank account.", "은행 계좌를 만들고 싶어요."),
      p("TFN", "세금 번호 (Tax File Number)", "Have you applied for your TFN yet?", "TFN 신청했어?", "일하려면 꼭 필요해요"),
      p("BSB", "은행 지점 번호", "Can you send me your BSB and account number?", "BSB랑 계좌번호 보내줄래요?"),
      p("transfer", "송금하다, 이체하다", "I'll transfer the money tonight.", "오늘 밤에 돈 보낼게."),
      p("SIM card", "유심", "Where can I get a SIM card?", "유심 어디서 사요?"),
      p("prepaid plan", "선불 요금제", "I'm on a prepaid plan.", "저 선불 요금제 써요."),
      p("top up", "(요금을) 충전하다", "I need to top up my phone.", "폰 요금 충전해야 해."),
      p("payslip", "급여 명세서", "Can I get a copy of my payslip?", "급여 명세서 받을 수 있을까요?"),
      p("super", "퇴직연금 (superannuation)", "Is super included in that rate?", "그 시급에 퇴직연금 포함이에요?", "워홀러는 출국할 때 돌려받을 수 있어요"),
      p("tax return", "세금 신고 (환급)", "Don't forget to do your tax return in July.", "7월에 세금 신고 잊지 마."),
    ],
  },
  {
    id: 5,
    title: "병원·약국",
    emoji: "🏥",
    items: [
      p("make an appointment", "진료 예약하다", "I'd like to make an appointment with a GP.", "GP 진료 예약하고 싶어요."),
      p("GP", "동네 일반의 (가정의)", "You should see a GP first.", "먼저 GP한테 가봐."),
      p("bulk bill", "본인 부담 없이 진료 (정부가 냄)", "Do you bulk bill?", "여기 본인 부담 없어요?", "워홀은 보통 해당 안 돼요. 보험을 확인하세요"),
      p("sore throat", "목 아픔", "I've got a sore throat and a runny nose.", "목이 아프고 콧물이 나요."),
      p("feel dizzy", "어지럽다", "I feel dizzy when I stand up.", "일어나면 어지러워요."),
      p("prescription", "처방전", "Do I need a prescription for this?", "이거 처방전 필요해요?"),
      p("over the counter", "처방전 없이 사는", "You can get it over the counter.", "처방전 없이 살 수 있어요."),
      p("side effects", "부작용", "Are there any side effects?", "부작용 있어요?"),
      p("medical certificate", "진단서 (병가용)", "Can I get a medical certificate for work?", "회사에 낼 진단서 받을 수 있을까요?"),
      p("allergic to", "~에 알레르기가 있는", "I'm allergic to penicillin.", "저 페니실린 알레르기 있어요."),
    ],
  },
  {
    id: 6,
    title: "교통·길찾기",
    emoji: "🚌",
    items: [
      p("tap on", "(교통카드를) 찍고 타다", "Don't forget to tap on when you get on.", "탈 때 카드 찍는 거 잊지 마."),
      p("tap off", "내릴 때 찍다", "You have to tap off at the end.", "내릴 때 찍어야 해요."),
      p("Does this bus go to", "이 버스 ~ 가요?", "Does this bus go to the city?", "이 버스 시내 가요?"),
      p("next stop", "다음 정류장", "Is the next stop Central?", "다음 정거장이 센트럴이에요?"),
      p("How do I get to", "~에 어떻게 가요?", "How do I get to Bondi Beach from here?", "여기서 본다이 비치 어떻게 가요?"),
      p("a five-minute walk", "걸어서 5분", "It's about a five-minute walk.", "걸어서 5분쯤이에요."),
      p("turn left", "왼쪽으로 돌다", "Turn left at the lights.", "신호등에서 왼쪽으로 가세요.", "lights = 신호등"),
      p("get off", "내리다", "Where should I get off?", "어디서 내려야 돼요?"),
      p("running late", "늦어지고 있는 (지연)", "The train is running late.", "기차가 늦어지고 있어."),
      p("pick me up", "날 데리러 오다", "Can you pick me up from the station?", "역으로 데리러 와줄 수 있어?"),
    ],
  },
  {
    id: 7,
    title: "일터 (카페·농장·공장)",
    emoji: "🧺",
    items: [
      p("roster", "근무표", "Have you checked the roster?", "근무표 확인했어?"),
      p("early shift", "아침 근무", "I've got an early shift tomorrow.", "내일 아침 근무야."),
      p("swap shifts", "근무를 바꾸다", "Can I swap shifts with you?", "나랑 근무 바꿔줄 수 있어?"),
      p("call in sick", "아파서 못 간다고 연락하다", "I need to call in sick today.", "오늘 아파서 못 간다고 연락해야 해."),
      p("on the clock", "근무 시간 중", "No phones while you're on the clock.", "근무 중엔 폰 금지야."),
      p("piece rate", "성과급 (딴 만큼 받음)", "Is it hourly or piece rate?", "시급이에요, 성과급이에요?", "농장에서 자주 들어요"),
      p("per bin", "(수확) 통 하나당", "We get paid per bin.", "통 하나당 돈 받아."),
      p("show me how", "어떻게 하는지 보여주다", "Could you show me how to use this machine?", "이 기계 어떻게 쓰는지 보여줄래요?"),
      p("I'm on it", "제가 할게요, 바로 할게요", "Table five needs cleaning. — I'm on it!", "5번 테이블 치워야 해. — 제가 할게요!"),
      p("finish up", "마무리하다", "Let's finish up and close the shop.", "마무리하고 가게 닫자."),
    ],
  },
];

const PHRASAL: PhraseSet[] = [
  {
    id: 1,
    title: "매일 쓰는 TOP 10",
    emoji: "⭐",
    items: [
      p("pick up", "가지러 가다, 사 오다", "Can you pick up some milk on the way home?", "집에 오는 길에 우유 좀 사 올래?"),
      p("find out", "알아내다", "I'll find out what time it starts.", "몇 시에 시작하는지 알아볼게."),
      p("figure out", "이해하다, 해결하다", "I can't figure out how this works.", "이게 어떻게 되는 건지 모르겠어."),
      p("come up with", "(생각을) 떠올리다", "Did you come up with a plan?", "계획 생각해냈어?"),
      p("hang out", "놀다, 어울리다", "Do you want to hang out this weekend?", "이번 주말에 놀래?"),
      p("check out", "확인해 보다, 구경하다", "You should check out the night market.", "야시장 꼭 가봐."),
      p("sort out", "해결하다, 정리하다", "Don't worry, I'll sort out the bills.", "걱정 마, 공과금은 내가 처리할게."),
      p("run out of", "~이 다 떨어지다", "We've run out of coffee beans.", "원두 다 떨어졌어."),
      p("look for", "찾다", "I need to look for a part-time job.", "아르바이트 찾아봐야 해."),
      p("turn up", "나타나다, 오다", "He didn't turn up to work today.", "걔 오늘 출근 안 했어."),
    ],
  },
  {
    id: 2,
    title: "일·약속",
    emoji: "📅",
    items: [
      p("put off", "미루다", "Don't put off your tax return.", "세금 신고 미루지 마."),
      p("call off", "취소하다", "They had to call off the event because of the rain.", "비 때문에 행사를 취소해야 했어."),
      p("show up", "나타나다, 오다", "Please show up ten minutes early.", "10분 일찍 와주세요."),
      p("catch up", "밀린 걸 따라잡다, 근황을 나누다", "Let's catch up over coffee.", "커피 마시면서 얘기 좀 하자."),
      p("fill in", "(서류를) 작성하다, 대신 일하다", "Please fill in this form.", "이 서류 작성해 주세요."),
      p("hand in", "제출하다", "I need to hand in my resignation.", "사직서 내야 해."),
      p("take over", "맡다, 인계받다", "Can you take over the register for a minute?", "잠깐 계산대 좀 맡아줄래?"),
      p("drop by", "잠깐 들르다", "Feel free to drop by anytime.", "아무 때나 들러."),
      p("set up", "준비하다, 설치하다", "We need to set up the tables before nine.", "9시 전에 테이블 세팅해야 해."),
      p("work out", "잘 풀리다, 운동하다", "Don't stress, it'll work out.", "걱정 마, 잘 될 거야."),
    ],
  },
  {
    id: 3,
    title: "관계·감정",
    emoji: "💛",
    items: [
      p("get along", "잘 지내다", "I get along with my flatmates.", "하우스메이트들이랑 잘 지내."),
      p("look up to", "존경하다", "I really look up to my manager.", "우리 매니저 진짜 존경해."),
      p("let down", "실망시키다", "I felt let down by my boss.", "사장님한테 실망했어."),
      p("cheer up", "기운 내다", "Cheer up! It's not that bad.", "힘내! 그렇게 나쁘지 않아."),
      p("calm down", "진정하다", "Just calm down and tell me what happened.", "일단 진정하고 무슨 일인지 말해봐."),
      p("break up", "헤어지다", "They decided to break up last month.", "걔네 지난달에 헤어지기로 했어."),
      p("make up", "화해하다", "Did you two make up yet?", "너네 화해했어?"),
      p("put up with", "참다, 견디다", "I can't put up with the noise anymore.", "더 이상 소음 못 참겠어."),
      p("count on", "믿다, 의지하다", "You can always count on me.", "언제든 나 믿어도 돼."),
      p("open up", "마음을 열다, 털어놓다", "It took a while for him to open up.", "걔가 마음 여는 데 시간이 좀 걸렸어."),
    ],
  },
  {
    id: 4,
    title: "생활",
    emoji: "🏡",
    items: [
      p("get up", "일어나다", "I get up at six for work.", "출근하려고 6시에 일어나."),
      p("eat out", "외식하다", "Let's eat out tonight.", "오늘 밤엔 외식하자."),
      p("dress up", "차려입다", "You don't need to dress up for the party.", "파티라고 차려입을 필요 없어."),
      p("clean up", "치우다", "Can you clean up the kitchen after dinner?", "저녁 먹고 부엌 좀 치워줄래?"),
      p("throw away", "버리다", "Don't throw away the receipt.", "영수증 버리지 마."),
      p("give up", "포기하다", "Don't give up on your English.", "영어 포기하지 마."),
      p("look after", "돌보다, 챙기다", "Can you look after my bag for a sec?", "잠깐 내 가방 좀 봐줄래?"),
      p("go through", "겪다, 훑어보다", "We all go through tough times.", "누구나 힘든 시기를 겪어."),
      p("end up", "결국 ~하게 되다", "We might end up staying until midnight.", "결국 자정까지 있게 될지도 몰라."),
      p("settle in", "(새 곳에) 적응하다", "It takes time to settle in.", "적응하는 데는 시간이 걸려."),
    ],
  },
  {
    id: 5,
    title: "이동",
    emoji: "🚗",
    items: [
      p("get on", "(버스·기차를) 타다", "Get on the train at platform two.", "2번 플랫폼에서 기차 타."),
      p("get in", "(차에) 타다", "Get in, I'll give you a lift.", "타, 태워줄게."),
      p("check in", "체크인하다", "What time can we check in?", "몇 시에 체크인할 수 있어요?"),
      p("drop off", "내려주다, 갖다 놓다", "I'll drop off the keys tomorrow.", "내일 열쇠 갖다 놓을게."),
      p("head off", "출발하다, 가다", "I'm going to head off now.", "나 이제 갈게."),
      p("come over", "(집에) 놀러 오다", "Do you want to come over for dinner?", "저녁 먹으러 우리 집 올래?"),
      p("pull over", "차를 길가에 세우다", "The police told me to pull over.", "경찰이 차 세우라고 했어."),
      p("get around", "돌아다니다", "It's easy to get around by tram.", "트램으로 돌아다니기 편해."),
      p("set off", "(여행을) 떠나다", "We set off early to avoid traffic.", "차 막히는 거 피하려고 일찍 출발했어."),
      p("get back", "돌아오다", "What time did you get back last night?", "어젯밤에 몇 시에 들어왔어?"),
    ],
  },
  {
    id: 6,
    title: "말·정보",
    emoji: "💬",
    items: [
      p("bring up", "(이야기를) 꺼내다", "Don't bring up money at dinner.", "저녁 먹을 때 돈 얘기 꺼내지 마."),
      p("point out", "짚어 주다, 지적하다", "Can you point out my mistakes?", "내가 틀린 거 짚어줄래?"),
      p("speak up", "크게 말하다, 의견을 말하다", "Could you speak up a bit?", "조금만 크게 말해줄래요?"),
      p("look up", "(사전·인터넷에서) 찾아보다", "I'll look up the word later.", "그 단어 나중에 찾아볼게."),
      p("write down", "적다", "Let me write down your number.", "네 번호 적어둘게."),
      p("go over", "검토하다, 다시 보다", "Let's go over the plan one more time.", "계획 한 번만 더 보자."),
      p("turn down", "거절하다, (소리를) 줄이다", "I had to turn down the job offer.", "그 일자리 제안은 거절해야 했어."),
      p("pass on", "전하다", "I'll pass on the message.", "메시지 전해줄게."),
      p("run into", "우연히 마주치다", "You might run into your boss at the shops.", "마트에서 사장님을 마주칠 수도 있어."),
      p("back up", "백업하다, 편들어 주다", "Don't forget to back up your photos.", "사진 백업하는 거 잊지 마."),
    ],
  },
];

export const PHRASE_DECKS: PhraseDeck[] = [
  {
    id: "survival",
    title: "상황별 생존 표현",
    emoji: "🧳",
    desc: "카페·면접·쉐어하우스·은행·병원·교통·일터. 호주 도착 첫 주에 바로 쓰는 말 70개.",
    quizLabel: "🧳 생존 표현",
    sets: SURVIVAL,
  },
  {
    id: "phrasal",
    title: "필수 구동사",
    emoji: "🔗",
    desc: "pick up, figure out, run out of… 원어민이 매일 쓰는데 교과서엔 잘 안 나오는 60개.",
    quizLabel: "🔗 구동사",
    sets: PHRASAL,
  },
  {
    id: "slang",
    title: "호주 슬랭",
    emoji: "🦘",
    desc: "arvo, servo, no worries, Yeah nah… 호주에서 매일 듣는 말 60개.",
    quizLabel: "🦘 호주 슬랭",
    sets: SLANG_SETS,
  },
];

export function phraseDeck(id: string) {
  return PHRASE_DECKS.find((d) => d.id === id) ?? null;
}
