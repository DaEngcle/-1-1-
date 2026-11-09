// 상황극 연습: 일터별 짧은 대본 미션 (AI 안 씀, 규칙으로만 채점). 서버 전용으로 읽는다 (화면엔 시나리오 하나만 넘긴다).
// 미션의 핵심 표현(keys)은 되도록 보카 세트(jobs·survival·kitchen)에서 가져와 표현 익히기와 이어지게 했다.
// keys[0]은 모범 답(model)에 꼭 들어 있어야 한다 (힌트에서 굵게 보여 준다).

import type { JobId } from "./course-questions";

export type RoleplayTurn = {
  /** 상대가 하는 말 (영어) */
  line: string;
  /** 상대 말 번역 */
  ko: string;
  /** 학생이 할 말 (한국어 미션) */
  mission: string;
  /** 모범 답 하나 */
  model: string;
  /** 들어가면 인정하는 핵심 표현 (2~3개, 첫 번째가 모범 답 속 표현) */
  keys: string[];
};

export type Roleplay = {
  id: string;
  job: RoleplayJob;
  step: 1 | 2 | 3;
  emoji: string;
  title: string;
  desc: string;
  /** 상대 이름표 (한국어) */
  who: string;
  turns: RoleplayTurn[];
  /** 마지막 답 뒤에 상대가 하는 말 */
  outro: { line: string; ko: string };
};

export type RoleplayJob = Exclude<JobId, "other">;

export const ROLEPLAY_STEPS = [
  { step: 1, title: "STEP 1 · 기본 응대" },
  { step: 2, title: "STEP 2 · 주문·결제 / 작업 루틴" },
  { step: 3, title: "STEP 3 · 문제 상황" },
] as const;

const t = (line: string, ko: string, mission: string, model: string, keys: string[]): RoleplayTurn => ({ line, ko, mission, model, keys });
const o = (line: string, ko: string) => ({ line, ko });
type Def = [id: string, step: 1 | 2 | 3, emoji: string, title: string, desc: string, who: string, turns: RoleplayTurn[], outro: { line: string; ko: string }];

function group(job: RoleplayJob, defs: Def[]): Roleplay[] {
  return defs.map(([id, step, emoji, title, desc, who, turns, outro]) => ({ id: `${job}-${id}`, job, step, emoji, title, desc, who, turns, outro }));
}

const CAFE = group("cafe", [
  ["1", 1, "☕", "문 열자마자 온 손님", "인사하고 주문 받고 이름까지 묻기", "손님", [
    t("Morning! Are you open yet?", "안녕하세요! 문 열었어요?", "열었다고 하고 무엇을 도와드릴지 물어보세요", "Yes, we're open. How can I help?", ["How can I help", "What can I get for you", "What can I get you"]),
    t("Can I get a flat white, please?", "플랫화이트 하나 주세요.", "드시고 가는지 가져가는지 물어보세요", "Sure. Is that dine in or takeaway?", ["dine in or takeaway", "for here or takeaway", "eat in or takeaway"]),
    t("Takeaway, thanks.", "가져갈게요.", "주문하신 분 성함을 물어보세요", "No worries. What's the name for the order?", ["name for the order", "your name", "what's the name"]),
  ], o("It's Jess. Thanks!", "제스예요. 고마워요!")],
  ["2", 1, "🥛", "우유랑 사이즈 묻기", "사이즈·우유 변경·샷 추가 주문 받기", "손님", [
    t("Hi, can I get a latte?", "라테 하나 주세요.", "사이즈를 물어보세요 (레귤러·라지)", "Of course. Regular or large?", ["regular or large", "small or large", "what size"]),
    t("Large, please. Can I swap to oat milk?", "라지요. 귀리 우유로 바꿀 수 있어요?", "된다고 하고 80센트 추가라고 알려 주세요", "Yes, you can. It's an extra 80 cents.", ["extra 80 cents", "it's extra", "80 cents"]),
    t("That's fine. Could I get an extra shot too?", "괜찮아요. 샷 추가도 돼요?", "그럼요 하고 더 필요한 게 있는지 물어보세요", "Sure, an extra shot. Anything else?", ["anything else", "is that all", "what else"]),
  ], o("That's all, thanks.", "그게 다예요, 고마워요.")],
  ["3", 2, "💳", "계산하고 결제 받기", "금액 말하기·카드 탭·텀블러 할인", "손님", [
    t("That's all, thanks. How much is it?", "그게 다예요. 얼마예요?", "7달러 50센트라고 말해 주세요", "That's $7.50, thanks.", ["7.50", "seven fifty"]),
    t("Can I pay by card?", "카드로 돼요?", "된다고 하고 단말기에 카드를 대면 된다고 하세요", "Yes, you can just tap your card there.", ["tap your card", "tap it", "tap there"]),
    t("Oh, can you use my keep cup?", "제 텀블러에 담아 줄 수 있어요?", "좋다고 하고 텀블러면 50센트 할인이라고 하세요", "Yes, of course. You get 50 cents off with a keep cup.", ["50 cents off", "discount"]),
  ], o("Great, here you go.", "좋아요, 여기요.")],
  ["4", 2, "⚙️", "바쁜 시간 머신 앞에서", "동료와 머신·그라인더·밀린 주문 이야기", "동료 Sam", [
    t("Hey, can you jump on the machine for a bit?", "잠깐 머신 좀 맡아 줄래요?", "알겠다고, 바로 하겠다고 하세요", "Sure, I'm on it.", ["I'm on it", "no worries", "on it"]),
    t("The shots are running too fast. Can you dial in the grinder?", "샷이 너무 빨리 나와요. 그라인더 좀 맞춰 줄래요?", "그라인더를 조금 더 곱게 맞추겠다고 하세요", "Okay, I'll dial it in a bit finer.", ["dial it in", "make it finer", "grind finer"]),
    t("We're backed up with six orders. What's next?", "주문이 여섯 개 밀렸어요. 다음 뭐예요?", "다음은 라지 라테 두 잔, 하나는 엑스트라 핫이라고 하세요", "Next is two large lattes, one extra hot.", ["extra hot", "two large lattes"]),
  ], o("Legend, thanks.", "최고예요, 고마워요.")],
  ["5", 3, "😬", "잘못 나온 커피", "사과하고 다시 만들어 주기", "손님", [
    t("Excuse me, I think I ordered a cappuccino, not a latte.", "저 라테 말고 카푸치노 시켰는데요.", "정말 죄송하다고 사과하세요", "I'm really sorry about that.", ["really sorry", "so sorry", "sorry about that"]),
    t("No worries. Can you fix it?", "괜찮아요. 바꿔 줄 수 있어요?", "지금 바로 다시 만들어 드리겠다고 하세요", "Of course. I'll remake it for you right now.", ["remake it", "make you a new one", "make it again"]),
    t("How long will it take?", "얼마나 걸려요?", "2분이면 된다고, 금방 갖다드린다고 하세요", "Just two minutes. I'll be with you in a moment.", ["two minutes", "in a moment", "2 minutes"]),
  ], o("Thanks, I appreciate it.", "고마워요.")],
]);

const SERVING = group("serving", [
  ["1", 1, "🪑", "자리 안내하기", "인원 확인·자리 안내·물 드리기", "손님", [
    t("Hi, table for two, please.", "두 명 자리 있어요?", "있다고 하고 따라오시라고 하세요", "Sure, table for two. Follow me, please.", ["follow me", "this way"]),
    t("Can we sit outside?", "밖에 앉아도 돼요?", "그럼요 하고 메뉴를 드리세요", "Of course. Here are your menus.", ["here are your menus", "here's the menu", "your menus"]),
    t("Thanks. Could we get some water?", "물 좀 주실래요?", "바로 가져다드리겠다고 하세요", "Sure, I'll bring some water right away.", ["bring some water", "get you some water", "right away"]),
  ], o("Lovely, thank you.", "좋아요, 고마워요.")],
  ["2", 1, "📝", "주문 받기", "주문 받고 알레르기 확인하기", "손님", [
    t("I think we're ready.", "주문할게요.", "주문하시겠어요? 하고 물어보세요", "Great. Are you ready to order?", ["ready to order", "what can I get you"]),
    t("I'll have the chicken burger.", "치킨 버거 주세요.", "알레르기가 있는지 물어보세요", "Sure. Any allergies I should know about?", ["any allergies", "allergic to anything"]),
    t("I'm allergic to nuts. Are there nuts in the sauce?", "견과류 알레르기가 있어요. 소스에 들어가요?", "주방에 확인해 보겠다고 하세요", "Let me check with the kitchen.", ["check with the kitchen", "ask the kitchen", "let me check"]),
  ], o("Thanks, I appreciate that.", "고마워요.")],
  ["3", 2, "🍽️", "식사 중 테이블 챙기기", "식사 어떤지 묻기·접시 치우기·디저트", "손님", [
    t("Mm, this is really good.", "음, 정말 맛있네요.", "식사는 어떠신지 물어보세요", "Glad to hear it. How is everything?", ["how is everything", "how's everything", "how is your meal"]),
    t("Great, thanks. Could you take these plates?", "좋아요. 이 접시 좀 치워 주실래요?", "네, 치워 드리겠다고 하세요", "Of course, I'll clear the table for you.", ["clear the table", "take these", "clear these"]),
    t("Can we see the dessert menu?", "디저트 메뉴 볼 수 있어요?", "가져다드리겠다고 하세요", "Sure, I'll grab it for you.", ["grab it", "bring it", "get it for you"]),
  ], o("Perfect, thanks.", "좋아요, 고마워요.")],
  ["4", 2, "🧾", "계산서와 나눠 내기", "따로 계산·금액 안내·마무리 인사", "손님", [
    t("Can we get the bill, please?", "계산서 주세요.", "나눠서 계산하실지 물어보세요", "Sure. Would you like to split the bill?", ["split the bill", "pay separately", "pay together"]),
    t("Yes, half each, please.", "네, 반반이요.", "한 분당 32달러라고 하세요", "No problem. That's $32 each.", ["32 each", "thirty two each"]),
    t("Here's my card.", "카드 여기요.", "카드를 대 달라고 하고 좋은 하루 보내라고 인사하세요", "Thanks, just tap here. Enjoy the rest of your day!", ["tap here", "enjoy the rest of your day", "have a good one"]),
  ], o("You too, thanks!", "당신도요, 고마워요!")],
  ["5", 3, "⏳", "음식이 늦어질 때", "기다린 손님에게 사과하고 상황 알려 주기", "손님", [
    t("Excuse me, we ordered 30 minutes ago.", "저기요, 30분 전에 주문했는데요.", "기다리게 해서 죄송하다고 하세요", "I'm so sorry for the wait.", ["sorry for the wait", "sorry about the wait"]),
    t("Is our food coming soon?", "음식 곧 나와요?", "주방에 확인해 보겠다고 하세요", "Let me check with the kitchen for you.", ["check with the kitchen", "let me check"]),
    t("Okay, thanks.", "네, 고마워요.", "음식이 나오는 중이고 2분 뒤 나온다고 하세요", "Your food is on its way. It'll be out in two minutes.", ["on its way", "two minutes", "2 minutes"]),
  ], o("Great, thank you.", "좋아요, 고마워요.")],
]);

const KITCHEN = group("kitchen", [
  ["1", 1, "🔪", "첫 출근, 셰프 지시", "대답하고 손질·보관 지시 확인하기", "셰프", [
    t("You must be the new kitchen hand. Ready to start?", "새로 온 키친핸드죠? 시작할 준비됐어요?", "네, 셰프 하고 준비됐다고 하세요", "Yes, chef. I'm ready.", ["Yes, chef"]),
    t("Good. First, prep the onions. Dice them small.", "먼저 양파 손질해요. 작게 깍둑썰기로.", "작게 깍둑썰기 하겠다고 확인하세요", "Okay, I'll dice them small.", ["dice them", "dice the onions"]),
    t("When you're done, put them in the walk-in.", "다 하면 워크인에 넣어 둬요.", "워크인에 넣겠다고 하세요", "Got it. I'll put them in the walk-in.", ["walk-in", "walk in"]),
  ], o("Good. Let's go.", "좋아요. 시작해요.")],
  ["2", 1, "🔥", "주방에서 움직일 때", "Behind·Corner 외치고 패스 확인하기", "셰프", [
    t("Careful, hot pan coming through!", "조심, 뜨거운 팬 지나가요!", "내가 뒤에 있다고 알려 주세요", "Behind you!", ["behind"]),
    t("Thanks. Can you grab the tongs from over there?", "고마워요. 저기 집게 좀 갖다줄래요?", "모퉁이 돌 때 외치는 말과 함께 집게를 건네세요", "Corner! Here are the tongs.", ["corner", "here are the tongs"]),
    t("Cheers. Is the docket for table five up?", "고마워요. 5번 테이블 도켓 올라왔어요?", "네, 패스에 있다고 하세요", "Yes, it's on the pass.", ["on the pass"]),
  ], o("Beautiful. Keep it moving.", "좋아요. 계속 가요.")],
  ["3", 2, "🥬", "재료 가져오기", "호주식 채소 이름·다지기·남은 양 말하기", "셰프", [
    t("Can you get me the capsicum and zucchini from the cool room?", "쿨룸에서 피망이랑 애호박 좀 갖다줄래요?", "피망과 애호박을 가져오겠다고 확인하세요", "Sure, capsicum and zucchini. Anything else?", ["capsicum and zucchini", "capsicum"]),
    t("A bag of rocket too. Then chop the coriander.", "루콜라 한 봉지도. 그리고 고수 다져 줘요.", "고수를 다지겠다고 하세요", "No worries. I'll chop the coriander.", ["chop the coriander", "chop it"]),
    t("How much mince is left?", "다진 고기 얼마나 남았어요?", "2킬로쯤 남았다고 하세요", "There's about two kilos of mince left.", ["two kilos", "2 kilos"]),
  ], o("Okay, I'll order more.", "알았어요, 더 주문할게요.")],
  ["4", 2, "🥩", "서비스 중 주문 콜", "주문 복창·레스팅·남은 시간 말하기", "셰프", [
    t("Two steaks, one medium rare, one well done!", "스테이크 둘, 하나는 미디엄레어, 하나는 웰던!", "웰던 하나 맞다고 복창하세요", "Yes, chef. One well done.", ["well done", "yes chef"]),
    t("Let them rest for five minutes before plating.", "담기 전에 5분 레스팅해요.", "5분 레스팅하겠다고 하세요", "Got it. I'll rest them for five minutes.", ["rest them", "rest the steaks"]),
    t("How long on the fries?", "감자튀김 얼마나 남았어요?", "2분 남았다고 하세요", "Two minutes, chef.", ["two minutes", "2 minutes"]),
  ], o("Good. Call it when it's ready.", "좋아요. 다 되면 불러요.")],
  ["5", 3, "🚫", "재료가 떨어졌을 때", "재료 품절 알리고 선입선출 지키기", "셰프", [
    t("Where's the salmon? I need it for table eight.", "연어 어디 있어요? 8번 테이블에 필요해요.", "연어가 다 떨어졌다고 하세요", "Sorry, chef. We've run out of salmon.", ["run out of", "ran out of", "out of salmon"]),
    t("Okay, 86 the salmon. Tell front of house.", "알았어요, 연어 86(품절)이에요. 홀에 알려요.", "홀에 연어가 86이라고 알리겠다고 하세요", "Okay, I'll tell front of house the salmon is 86.", ["86", "eighty six", "sold out"]),
    t("And check the walk-in. First in, first out, yeah?", "워크인도 확인해요. 선입선출, 알죠?", "알겠다고, 오래된 것부터 쓰겠다고 하세요", "Yes, chef. First in, first out. I'll use the old stock first.", ["First in, first out", "old stock first"]),
  ], o("Good stuff.", "잘했어요.")],
]);

const HOUSEKEEPING = group("housekeeping", [
  ["1", 1, "📋", "오늘 방 배정 받기", "체크아웃·스테이오버 확인하고 트롤리 준비", "슈퍼바이저", [
    t("Morning! You've got 12 rooms today. Eight checkouts and four stayovers.", "오늘 방 12개예요. 체크아웃 8개, 스테이오버 4개.", "체크아웃 방부터 할지 물어보세요", "Got it. Should I start with the checkout rooms?", ["checkout rooms", "start with"]),
    t("Yes. Turn over the checkouts first.", "네. 체크아웃 방부터 정리해요.", "먼저 트롤리를 채우겠다고 하세요", "Okay. I'll restock my trolley first.", ["restock my trolley", "restock", "fill my trolley"]),
    t("Great. Call me if you need anything.", "필요한 거 있으면 불러요.", "알겠다고, 고맙다고 하세요", "No worries, thanks.", ["no worries", "thanks", "thank you"]),
  ], o("Have a good one.", "수고해요.")],
  ["2", 1, "🚪", "손님 방 앞에서", "청소 시간 묻고 요청 받기", "투숙객", [
    t("Oh, hi. Are you here to clean?", "아, 청소하러 오셨어요?", "네, 지금 방 청소해도 되는지 물어보세요", "Yes. Is it okay to clean your room now?", ["clean your room", "service your room"]),
    t("Could you come back later?", "나중에 와 줄 수 있어요?", "그럼요 하고 몇 시가 좋은지 물어보세요", "Of course. What time is good for you?", ["what time", "come back later"]),
    t("After 2, please. And can I get extra towels?", "2시 이후에요. 수건 더 받을 수 있어요?", "2시 이후에 수건 가지고 다시 오겠다고 하세요", "Sure. I'll come back after 2 with extra towels.", ["extra towels", "after 2"]),
  ], o("Perfect, thanks so much.", "좋아요, 정말 고마워요.")],
  ["3", 2, "🛏️", "동료와 객실 작업", "침대 시트·린넨·방해 금지 방 처리", "동료", [
    t("Did you strip the beds in 204?", "204호 침대 시트 벗겼어요?", "네, 벗기고 새 시트로 깔았다고 하세요", "Yes, I stripped the beds and put on fresh sheets.", ["stripped the beds", "strip the beds"]),
    t("Nice. I've run out of pillowcases on my trolley.", "제 트롤리에 베갯잇이 다 떨어졌어요.", "린넨실에서 가져다주겠다고 하세요", "I'll grab some from the linen room for you.", ["linen room", "grab some"]),
    t("Thanks. 206 has a Do Not Disturb sign.", "206호에 방해 금지 팻말이 있어요.", "그럼 건너뛰고 나중에 다시 확인하자고 하세요", "Okay, let's skip it and check again later.", ["skip it", "check again later"]),
  ], o("Sounds good.", "좋아요.")],
  ["4", 2, "🔎", "분실물 찾았을 때", "분실물 보고하고 남은 방 말하기", "슈퍼바이저", [
    t("How's it going?", "어떻게 돼 가요?", "310호에서 휴대폰 충전기를 찾았다고 하세요", "Good. I found a phone charger in room 310.", ["found a phone charger", "found a charger"]),
    t("Okay. Take it to lost property.", "분실물 보관소에 갖다 둬요.", "분실물 보관소에 가져가겠다고 하세요", "Sure, I'll take it to lost property.", ["lost property"]),
    t("Thanks. How many rooms are left?", "방 몇 개 남았어요?", "세 개 남았고 3시까지 끝낸다고 하세요", "Three rooms left. I'll finish up by 3.", ["finish up", "three rooms", "3 rooms"]),
  ], o("Great work.", "잘했어요.")],
  ["5", 3, "🚿", "샤워기가 고장 난 방", "불편 사과하고 매니저에게 알리기", "투숙객", [
    t("Hi, the shower in my room isn't working.", "방 샤워기가 안 돼요.", "불편을 드려 정말 죄송하다고 하세요", "I'm really sorry about that.", ["really sorry", "so sorry"]),
    t("Can someone fix it today?", "오늘 고칠 수 있어요?", "지금 바로 매니저에게 알리겠다고 하세요", "I'll let my manager know right now.", ["let my manager know", "tell my manager", "get my manager"]),
    t("Thanks. I'm in room 512.", "512호예요.", "512호 맞다고 하고 곧 누가 올라갈 거라고 하세요", "Room 512, got it. Someone will be up soon.", ["be up soon", "512"]),
  ], o("Thank you.", "고마워요.")],
]);

const HOTEL = group("hotel", [
  ["1", 1, "🛎️", "체크인 받기", "예약 이름·신분증·키카드", "투숙객", [
    t("Hi, I'd like to check in, please.", "체크인하려고요.", "예약자 이름을 물어보세요", "Welcome! What name is the booking under?", ["booking under", "name on the booking"]),
    t("It's under Park.", "박으로 돼 있어요.", "신분증을 보여 달라고 하세요", "Thanks, Ms Park. Can I see some ID, please?", ["see some ID", "your ID", "photo ID"]),
    t("Here you go.", "여기요.", "304호이고 키카드를 드린다고 하세요", "You're in room 304. Here's your key card.", ["key card", "room 304"]),
  ], o("Thanks so much.", "정말 고마워요.")],
  ["2", 1, "📶", "호텔 이용 안내", "조식·와이파이 안내하고 인사하기", "투숙객", [
    t("Is breakfast included?", "조식 포함이에요?", "포함이고 7시부터 10시까지라고 하세요", "Yes, breakfast is included. It's from 7 to 10.", ["breakfast is included", "from 7 to 10"]),
    t("Great. What's the Wi-Fi password?", "와이파이 비밀번호가 뭐예요?", "키카드 뒷면에 있다고 하세요", "The Wi-Fi password is on the back of your key card.", ["on the back", "wi-fi password"]),
    t("Perfect, thanks.", "좋아요, 고마워요.", "즐거운 시간 보내시라고 인사하세요", "My pleasure. Have a pleasant stay!", ["have a pleasant stay", "enjoy your stay"]),
  ], o("Will do!", "그럴게요!")],
  ["3", 2, "🧳", "체크아웃과 짐 보관", "숙박 소감 묻기·짐 맡아 주기", "투숙객", [
    t("Hi, I'm checking out. Room 210.", "체크아웃할게요. 210호요.", "숙박은 어떠셨는지 물어보세요", "Thanks. How was your stay?", ["how was your stay"]),
    t("Lovely. Can you store my luggage until 4?", "좋았어요. 4시까지 짐 맡겨도 돼요?", "그럼요, 보관해 드리겠다고 하세요", "Of course, we can store your luggage.", ["store your luggage", "keep your bags"]),
    t("Thanks heaps.", "정말 고마워요.", "번호표를 드리고 돌아오면 보여 달라고 하세요", "Here's your ticket. Just show it when you come back.", ["here's your ticket", "show it"]),
  ], o("Great, see you later.", "좋아요, 이따 봬요.")],
  ["4", 2, "📞", "레이트 체크아웃 전화", "확인하고 요청 처리하기", "투숙객 (전화)", [
    t("Hi, it's room 415. Can I get a late checkout?", "415호인데요, 레이트 체크아웃 돼요?", "확인해 보겠다고 하세요", "Let me check for you.", ["let me check"]),
    t("Thanks.", "고마워요.", "12시까지 레이트 체크아웃 된다고 하세요", "Yes, you can have a late checkout until 12.", ["late checkout", "until 12"]),
    t("Great. Also, can I get some extra pillows?", "베개도 더 받을 수 있을까요?", "직원을 올려 보내겠다고 하세요", "Sure, I'll send someone up with extra pillows.", ["send someone up"]),
  ], o("Thanks a lot.", "정말 고마워요.")],
  ["5", 3, "🔊", "시끄러운 방 불만", "사과하고 방 바꿔 주기", "투숙객", [
    t("Hi, my room is really noisy. It's right next to the lift.", "방이 너무 시끄러워요. 엘리베이터 바로 옆이에요.", "불편을 드려 죄송하다고 사과하세요", "I'm really sorry about that.", ["really sorry", "so sorry"]),
    t("Can I change rooms?", "방 바꿀 수 있어요?", "잠깐만요, 빈방이 있는지 확인하겠다고 하세요", "Just a moment. Let me check what's available.", ["let me check", "check what's available"]),
    t("Thank you.", "고맙습니다.", "6층에 조용한 방이 있다고, 새 키카드를 드린다고 하세요", "We have a quiet room on level 6. Here's your new key card.", ["quiet room", "new key card"]),
  ], o("That's great, thanks.", "좋네요, 고마워요.")],
]);

const RESORT = group("resort", [
  ["1", 1, "💻", "화상 면접 첫마디", "소리 확인·지금 하는 일·시작 가능일", "리조트 매니저", [
    t("Hi! Can you hear me okay?", "안녕하세요! 잘 들려요?", "잘 들린다고 하고, 내 목소리도 들리는지 물어보세요", "Yes, I can hear you. Can you hear me?", ["can you hear me", "I can hear you"]),
    t("Yep, all good. Tell me a bit about yourself.", "네, 좋아요. 자기소개 좀 해 주세요.", "지금 시드니의 카페에서 일하고 있다고 하세요", "I'm currently working at a cafe in Sydney.", ["I'm currently working", "currently working"]),
    t("Great. When could you start?", "언제부터 일할 수 있어요?", "다음 달 1일부터 가능하다고 하세요", "I'm available from the first of next month.", ["available from"]),
  ], o("Perfect, that works for us.", "좋아요, 저희도 괜찮아요.")],
  ["2", 1, "🏠", "근무 조건 물어보기", "숙소·최소 근무 기간 확인하기", "리조트 매니저", [
    t("Do you have any questions for us?", "저희한테 궁금한 거 있어요?", "직원 숙소가 있는지 물어보세요", "Yes. Is there staff accommodation?", ["staff accommodation"]),
    t("Yes, it's $150 a week, including meals.", "네, 식사 포함 주 150달러예요.", "최소 근무 기간이 있는지 물어보세요", "Great. Is there a minimum commitment?", ["minimum commitment", "how long"]),
    t("Three months. It's a remote location, so that matters.", "3개월이요. 외진 곳이라 중요해요.", "3개월 괜찮다고 하세요", "Three months is fine with me.", ["fine with me", "three months is fine", "3 months is fine"]),
  ], o("Great to hear.", "좋네요.")],
  ["3", 2, "🍷", "리조트 레스토랑 예약", "영업시간·방 번호·예약 확인", "투숙객", [
    t("Hi, is the restaurant open for dinner?", "레스토랑 저녁에 열어요?", "6시에 연다고 하고 예약할지 물어보세요", "Yes, it opens at 6. Would you like to book a table?", ["book a table", "opens at 6"]),
    t("Yes, for two at 7.", "네, 7시에 두 명이요.", "방 번호를 물어보세요", "Sure. What's your room number?", ["room number"]),
    t("Villa 12.", "12번 빌라요.", "7시 두 명 예약됐다고 확인하세요", "All done. A table for two at 7.", ["table for two"]),
  ], o("Lovely, thanks.", "좋아요, 고마워요.")],
  ["4", 2, "🧺", "빌라 청소 요청", "시간 정하고 비품 채우기", "투숙객", [
    t("Hi, could we get our villa cleaned this afternoon?", "오늘 오후에 빌라 청소 돼요?", "그럼요 하고 몇 시가 좋은지 물어보세요", "Of course. What time suits you?", ["what time"]),
    t("Around 2 would be great. We've run out of coffee pods too.", "2시쯤요. 커피 캡슐도 다 떨어졌어요.", "2시에 가서 커피 캡슐도 채워 드리겠다고 하세요", "No problem. I'll come at 2 and restock the coffee pods.", ["restock", "coffee pods"]),
    t("Thanks so much.", "정말 고마워요.", "천만에요, 좋은 하루 보내시라고 하세요", "You're welcome. Have a good one!", ["have a good one", "have a good day", "have a great day"]),
  ], o("You too!", "당신도요!")],
  ["5", 3, "📡", "화상 면접 중 끊길 때", "다시 말해 달라고 하고 경력 말하기", "리조트 매니저", [
    t("So, tell me about your... (화면이 멈췄어요)", "그래서, ...에 대해 말해 줄래요? (끊김)", "중간에 끊겼다고, 다시 말해 달라고 하세요", "Sorry, you cut out. Could you say that again?", ["you cut out", "say that again"]),
    t("Sure. Tell me about your hospitality experience.", "서비스업 경력 말해 주세요.", "서비스업 경력이 1년 있다고 하세요", "I have one year of experience in hospitality.", ["experience in"]),
    t("Great. We'll be in touch by Friday.", "좋아요. 금요일까지 연락드릴게요.", "시간 내 줘서 고맙다고, 연락 기다리겠다고 하세요", "Thanks for your time. I look forward to hearing from you.", ["thanks for your time", "look forward to hearing"]),
  ], o("Talk soon. Bye!", "또 얘기해요. 안녕!")],
]);

const RETAIL = group("retail", [
  ["1", 1, "🛒", "물건 찾는 손님", "호주식으로 말 걸고 위치 안내하기", "손님", [
    t("Excuse me, sorry...", "저기요, 죄송한데...", "도와드릴 게 있는지 호주식으로 물어보세요", "Hi, are you right there?", ["are you right there", "can I help you", "how can I help"]),
    t("Yes, I'm looking for rice noodles.", "쌀국수 면 찾고 있어요.", "5번 통로 소스 옆에 있다고 하세요", "They're in aisle 5, next to the sauces.", ["aisle 5", "aisle five"]),
    t("Thanks!", "고마워요!", "천만에요라고 가볍게 대답하세요", "No worries.", ["no worries"]),
  ], o("Cheers!", "고마워요!")],
  ["2", 1, "🧾", "계산대 지키기", "봉투·금액·영수증", "손님", [
    t("Hi.", "안녕하세요.", "인사하고 봉투가 필요한지 물어보세요", "Hi there. Do you need a bag?", ["need a bag"]),
    t("Yes, please.", "네.", "봉투는 15센트이고 모두 23달러라고 하세요", "Bags are 15 cents. That's $23 altogether.", ["23", "15 cents"]),
    t("Card, thanks.", "카드요.", "카드를 대 달라고 하고 영수증이 필요한지 물어보세요", "Just tap there. Do you want your receipt?", ["receipt", "tap there"]),
  ], o("No thanks. Have a good one.", "괜찮아요. 수고하세요.")],
  ["3", 2, "📦", "재고 확인하기", "창고 확인하고 입고일 알려 주기", "손님", [
    t("Do you have this in a bigger pack?", "이거 더 큰 걸로 있어요?", "창고에 있는지 확인해 보겠다고 하세요", "Let me check out the back for you.", ["out the back", "let me check"]),
    t("Thanks.", "고마워요.", "죄송하지만 지금은 재고가 없다고 하세요", "Sorry, it's not in stock at the moment.", ["not in stock", "out of stock"]),
    t("Oh, okay. When will you get more?", "언제 더 들어와요?", "목요일에 들어온다고 하세요", "We should get more on Thursday.", ["thursday"]),
  ], o("Okay, I'll come back then.", "그럼 그때 올게요.")],
  ["4", 2, "🏷️", "진열·할인 작업", "선반 정리·할인표·계산대 지원", "매니저", [
    t("Can you face up the shelves in aisle 3?", "3번 통로 진열 정리 좀 해 줄래요?", "지금 하겠다고 하세요", "Sure, I'll face up the shelves now.", ["face up"]),
    t("Thanks. The chips are on special this week.", "이번 주에 과자가 할인이에요.", "할인표를 붙이겠다고 하세요", "Okay, I'll put up the special tags.", ["put up", "special tags", "on special"]),
    t("Great. Then help on the registers at 5.", "5시엔 계산대 좀 도와줘요.", "5시에 계산대로 가겠다고 하세요", "No worries. I'll be on the registers at 5.", ["registers", "at 5"]),
  ], o("Thanks, legend.", "고마워요.")],
  ["5", 3, "🔁", "고장 난 물건 환불", "영수증 확인·환불 또는 교환", "손님", [
    t("Hi, I bought this kettle yesterday and it doesn't work.", "어제 이 주전자 샀는데 안 돼요.", "죄송하다고 하고 영수증이 있는지 물어보세요", "I'm sorry about that. Do you have the receipt?", ["have the receipt", "your receipt"]),
    t("Yes, here it is.", "네, 여기요.", "환불과 교환 중 무엇을 원하는지 물어보세요", "Would you like a refund or an exchange?", ["refund or an exchange", "refund"]),
    t("A refund, please.", "환불이요.", "같은 카드로 환불해 드리겠다고 하세요", "No problem. I'll refund it to the same card.", ["refund it", "same card"]),
  ], o("Thanks for your help.", "도와줘서 고마워요.")],
]);

const FARM = group("farm", [
  ["1", 1, "🍓", "첫날 오리엔테이션", "처음이라고 말하고 지시 확인하기", "슈퍼바이저", [
    t("Welcome! Have you done picking before?", "어서 와요! 피킹 해 본 적 있어요?", "처음이라고, 방법을 보여 달라고 하세요", "No, it's my first time. Can you show me how?", ["show me how"]),
    t("Sure. Only pick the ripe ones. Fully red.", "익은 것만 따요. 완전히 빨간 거.", "익은 것만 따겠다고 확인하세요", "Okay, only the ripe ones.", ["ripe ones", "only ripe"]),
    t("And wear your hi-vis at all times.", "그리고 형광 조끼는 항상 입어요.", "지금 입겠다고 하세요", "Got it. I'll put my hi-vis on now.", ["hi-vis", "hi vis"]),
  ], o("Good on ya. Let's go.", "좋아요. 가요.")],
  ["2", 1, "💵", "급여 방식 묻기", "빈당 급여·시작 시간 확인", "슈퍼바이저", [
    t("Any questions before we start?", "시작 전에 질문 있어요?", "시급인지 빈당인지 물어보세요", "Yes. Is it hourly or paid by the bin?", ["paid by the bin", "by the bin", "hourly"]),
    t("Paid by the bin. $40 a bin.", "빈당이에요. 한 빈에 40달러.", "몇 시에 시작하는지 물어보세요", "What time do we start?", ["what time"]),
    t("We start at sunrise, around 6.", "해 뜰 때, 6시쯤 시작해요.", "6시에 오겠다고 하세요", "Okay, I'll be here at 6.", ["at 6"]),
  ], o("See you then.", "그때 봐요.")],
  ["3", 2, "🧺", "작업 중 동료와", "몇 빈 했는지·스모코·줄 번호", "동료", [
    t("How many bins have you done?", "몇 빈 했어요?", "지금까지 세 빈 했다고 하세요", "I've done three bins so far.", ["three bins", "3 bins"]),
    t("Nice! Smoko's at 10, by the way.", "오! 그나저나 스모코는 10시예요.", "고맙다고, 스모코 때 보자고 하세요", "Thanks. See you at smoko.", ["smoko"]),
    t("Which row are you on?", "몇 번째 줄 하고 있어요?", "12번 줄이라고 하세요", "I'm on row 12.", ["row 12", "row twelve"]),
  ], o("Cool, I'm next to you then.", "그럼 제가 옆이네요.")],
  ["4", 2, "📦", "패킹 셰드 작업", "할 일 묻기·불량 빼기·퇴근 시간", "슈퍼바이저", [
    t("Today you're in the packing shed.", "오늘은 패킹 셰드에서 일해요.", "무엇을 하면 되는지 물어보세요", "Okay. What do I need to do?", ["what do I need to do", "what should I do"]),
    t("Check the fruit and take out any bad ones.", "과일 확인하고 상한 건 빼요.", "상한 건 빼겠다고 확인하세요", "Got it. I'll take out the bad ones.", ["take out"]),
    t("We knock off at 4.", "4시에 끝나요.", "4시에 끝나는 거 맞는지 되물어 보세요", "So we knock off at 4?", ["knock off", "finish at 4"]),
  ], o("Yep, 4 on the dot.", "네, 4시 정각이요.")],
  ["5", 3, "🤕", "허리가 아플 때", "아프다고 말하고 쉬는 시간 요청", "슈퍼바이저", [
    t("You okay? You look tired.", "괜찮아요? 피곤해 보여요.", "허리가 아프다고 하세요", "Not really. I've got a sore back.", ["sore back", "my back hurts"]),
    t("Oh no. Do you want to take a break?", "저런. 좀 쉴래요?", "네, 잠깐 쉬어도 되는지 물어보세요", "Yes, please. Can I take a short break?", ["take a short break", "take a break"]),
    t("Sure. Drink some water and sit in the shade.", "그래요. 물 마시고 그늘에 앉아 있어요.", "고맙다고, 10분 뒤에 돌아오겠다고 하세요", "Thanks. I'll be back in ten minutes.", ["back in ten minutes", "10 minutes"]),
  ], o("Take your time.", "천천히 해요.")],
]);

const FACTORY = group("factory", [
  ["1", 1, "🦺", "인덕션과 보호 장비", "안전 교육·PPE·헤어넷", "슈퍼바이저", [
    t("Welcome. Did you finish your induction?", "어서 와요. 인덕션 끝냈어요?", "오늘 아침에 끝냈다고 하세요", "Yes, I finished my induction this morning.", ["finished my induction", "induction"]),
    t("Good. Where's your PPE?", "좋아요. 보호 장비는요?", "보호 장비는 어디서 받는지 물어보세요", "Where can I get my PPE?", ["PPE"]),
    t("In the locker room. Gloves, boots and a hairnet.", "탈의실에 있어요. 장갑, 장화, 헤어넷.", "헤어넷까지 다 착용하겠다고 하세요", "Okay, I'll put on gloves, boots and a hairnet.", ["hairnet"]),
  ], o("Good. See you on the floor.", "좋아요. 작업장에서 봐요.")],
  ["2", 1, "🏭", "라인 배치 받기", "라인 속도 묻기·로테이션 확인", "슈퍼바이저", [
    t("You're on the line today, packing.", "오늘은 라인에서 포장해요.", "라인이 빠른지 물어보세요", "Okay. Is the line fast?", ["is the line fast", "how fast"]),
    t("It's quick, but you'll get used to it.", "빠르지만 금방 익숙해져요.", "따라가기 힘들면 말하겠다고 하세요", "Okay. I'll tell you if I can't keep up.", ["keep up"]),
    t("Good. We rotate every two hours.", "2시간마다 자리 바꿔요.", "2시간마다 바꾸는 거 맞는지 되물어 보세요", "So we rotate every two hours?", ["rotate"]),
  ], o("That's right.", "맞아요.")],
  ["3", 2, "🐢", "라인이 너무 빠를 때", "못 따라간다고 말하고 속도 조절 요청", "슈퍼바이저", [
    t("You okay there?", "괜찮아요?", "따라가기 힘들다고 하세요", "Sorry, I can't keep up.", ["can't keep up", "cannot keep up"]),
    t("No worries. Want me to slow the line down?", "괜찮아요. 라인 속도 줄여 줄까요?", "네, 조금만 줄여 달라고 하세요", "Yes, please slow the line down a bit.", ["slow the line down", "slow it down"]),
    t("Done. Better?", "됐어요. 좀 나아요?", "훨씬 낫다고, 고맙다고 하세요", "Much better, thanks.", ["much better", "better"]),
  ], o("Good. Speed it up when you're ready.", "좋아요. 익숙해지면 다시 올려요.")],
  ["4", 2, "⏱️", "초과근무 이야기", "시간 묻기·가능하다고 답하기", "슈퍼바이저", [
    t("We need people for overtime on Saturday.", "토요일 초과근무할 사람 필요해요.", "몇 시간인지 물어보세요", "How many hours is it?", ["how many hours"]),
    t("Six hours, from 7 to 1.", "6시간, 7시부터 1시까지.", "토요일 초과근무 할 수 있다고 하세요", "I can do overtime on Saturday.", ["I can do overtime", "I can do it", "I can work"]),
    t("Great, I'll put you down.", "좋아요, 명단에 넣을게요.", "냉장실에서 일하는지 물어보세요", "Will I be in the cold room?", ["cold room"]),
  ], o("Yep, so bring a warm jumper.", "네, 그러니까 따뜻한 옷 챙겨요.")],
  ["5", 3, "🩹", "작업 중 다쳤을 때", "다친 곳 말하고 보고 절차 묻기", "동료", [
    t("Hey, what happened to your hand?", "손 왜 그래요?", "칼에 손가락을 베었다고 하세요", "I cut my finger on a knife.", ["cut my finger"]),
    t("Oh no. Is it bad?", "저런, 심해요?", "피가 조금 난다고, 어디에 보고하는지 물어보세요", "It's bleeding a bit. Where do I report an injury?", ["report an injury"]),
    t("Come with me to first aid. We'll fill in a form.", "응급처치실로 같이 가요. 서류도 써야 해요.", "고맙다고 하세요", "Okay, thank you.", ["thank you", "thanks"]),
  ], o("No worries. This way.", "괜찮아요. 이쪽이에요.")],
]);

const CONSTRUCTION = group("construction", [
  ["1", 1, "👷", "현장 첫날", "자기소개·화이트카드·안전화", "포맨", [
    t("You the new labourer?", "새로 온 레이버러예요?", "네 그렇다고, 이름도 말하세요", "Yes, I'm the new labourer. I'm Jun.", ["new labourer"]),
    t("Got your White Card?", "화이트카드 있어요?", "있다고 하세요", "Yes, I've got my White Card.", ["white card"]),
    t("Good. And steel caps?", "좋아요. 안전화는요?", "안전화 신고 있다고 하세요", "Yes, I'm wearing my steel caps.", ["steel caps"]),
  ], o("Good. Let's get started.", "좋아요. 시작하죠.")],
  ["2", 1, "🤝", "도와 달라는 요청", "무엇을 할지 묻고 안전하게 들기", "포맨", [
    t("Can you give us a hand with this?", "이것 좀 도와줄래요?", "그럼요 하고 무엇이 필요한지 물어보세요", "Sure. What do you need?", ["what do you need", "sure"]),
    t("Carry these boards to the truck. Lift with your legs.", "이 판자 트럭으로 옮겨요. 다리 힘으로 들고.", "다리 힘으로 들겠다고 확인하세요", "Okay, I'll lift with my legs.", ["lift with my legs", "lift with your legs"]),
    t("Good on ya.", "잘했어요.", "다 옮겼다고 하고 다음 할 일을 물어보세요", "All done. What's next?", ["what's next", "all done"]),
  ], o("Grab a broom, mate.", "빗자루 들어요.")],
  ["3", 2, "🧹", "현장 정리", "정리하고 쓰레기 버릴 곳 묻기", "포맨", [
    t("Can you clean up the site before knock-off?", "퇴근 전에 현장 정리 좀 해 줄래요?", "정리하겠다고 하고 쓰레기는 어디 버리는지 물어보세요", "Sure, I'll clean up the site. Where does the rubbish go?", ["clean up the site", "where does the rubbish go"]),
    t("In the skip bin out front.", "앞에 있는 대형 쓰레기통이요.", "앞에 있는 쓰레기통 맞다고 확인하세요", "Got it. The skip bin out front.", ["skip bin", "got it"]),
    t("Smoko's at 10, by the way.", "그나저나 스모코는 10시예요.", "고맙다고, 스모코 때 보자고 하세요", "Thanks, see you at smoko.", ["smoko", "thanks"]),
  ], o("Cheers.", "고마워요.")],
  ["4", 2, "🌧️", "비 와서 작업 취소", "내일 일정 묻고 연락 기다리기", "포맨 (전화)", [
    t("Hey mate, it's pouring. We're rained off today.", "비가 쏟아져요. 오늘은 작업 취소예요.", "그럼 내일은 일하는지 물어보세요", "Okay. Are we working tomorrow?", ["working tomorrow"]),
    t("Should be. I'll text you tonight.", "아마요. 밤에 문자할게요.", "알겠다고, 문자 기다리겠다고 하세요", "No worries. I'll wait for your text.", ["wait for your text", "no worries"]),
    t("Sweet. Stay dry.", "좋아요. 비 맞지 말고.", "고맙다고, 좋은 하루 보내라고 하세요", "Thanks, have a good one.", ["have a good one", "thanks"]),
  ], o("You too.", "당신도요.")],
  ["5", 3, "⚠️", "위험한 순간", "조심하라고 외치고 보고하기", "동료", [
    t("Hey, what's that noise up there?", "저 위에서 무슨 소리예요?", "조심하라고 크게 외치세요", "Watch out!", ["watch out", "look out"]),
    t("Whoa, thanks. That was close.", "와, 고마워요. 큰일 날 뻔했네요.", "괜찮은지 물어보세요", "Are you okay?", ["are you okay", "you alright"]),
    t("Yeah, I'm fine. Can you tell the supervisor?", "괜찮아요. 감독한테 말해 줄래요?", "지금 바로 말하겠다고 하세요", "Sure, I'll tell the supervisor now.", ["tell the supervisor"]),
  ], o("Thanks, mate.", "고마워요.")],
]);

const TAKEAWAY = group("takeaway", [
  ["1", 1, "🍔", "카운터 주문", "포장 여부·세트·소스 묻기", "손님", [
    t("Hi, can I get a burger?", "버거 하나 주세요.", "먹고 갈지 가져갈지 물어보세요", "Sure. For here or to go?", ["for here or to go", "dine in or takeaway"]),
    t("To go, please.", "가져갈게요.", "세트로 하실지 물어보세요", "Would you like to make it a meal?", ["make it a meal"]),
    t("Yes, with chips.", "네, 감자튀김이랑요.", "소스는 뭘로 할지 물어보세요", "Great. Which dipping sauce would you like?", ["dipping sauce", "which sauce"]),
  ], o("Garlic aioli, thanks.", "갈릭 아이올리요.")],
  ["2", 2, "📱", "픽업 주문 전화", "주문 받기·대기 시간 안내", "손님 (전화)", [
    t("Hi, I'd like to place a pick-up order.", "픽업 주문하려고요.", "네, 무엇을 드릴지 물어보세요", "Sure. What can I get for you?", ["what can I get for you", "what can I get you"]),
    t("A large chicken box, please.", "치킨 박스 라지요.", "10분 정도 걸린다고 하세요", "No problem. It's about a ten minutes wait.", ["ten minutes", "10 minutes"]),
    t("Okay. The name's Leo.", "레오예요.", "레오 님, 10분 뒤에 뵙겠다고 하세요", "Thanks, Leo. See you in ten minutes.", ["see you in ten minutes", "see you soon"]),
  ], o("See ya.", "이따 봐요.")],
  ["3", 2, "🍟", "바쁜 주방에서", "주문 나르기·튀김기 맡기·마감 청소", "동료", [
    t("Order up! Table 4!", "4번 주문 나왔어요!", "가져가겠다고 하세요", "Got it, I'll take it.", ["I'll take it", "got it"]),
    t("Can you watch the fryer for a sec?", "튀김기 잠깐 봐 줄래요?", "그러겠다고 하세요", "Sure, I'll watch the fryer.", ["watch the fryer"]),
    t("Thanks. And clean the fryer before close.", "그리고 마감 전에 튀김기 청소해요.", "마감 전에 청소하겠다고 하세요", "No worries. I'll clean the fryer before close.", ["clean the fryer"]),
  ], o("Legend.", "최고.")],
  ["4", 3, "🛵", "기다리는 배달 기사", "늦어진다고 말하고 주문 확인하기", "배달 기사", [
    t("Hi, I'm the delivery driver. Order for Kim?", "배달 기사예요. 김 님 주문이요?", "2분만 더 기다려 달라고 하세요", "Sorry, it'll be two more minutes.", ["two more minutes", "2 more minutes"]),
    t("No dramas. Is it the one with extra sauce?", "괜찮아요. 소스 추가한 거 맞죠?", "확인해 보겠다고 하세요", "Let me check.", ["let me check"]),
    t("Cheers.", "고마워요.", "여기 있다고, 소스 추가 맞다고 하세요", "Here you go. Yes, extra sauce.", ["here you go", "extra sauce"]),
  ], o("Thanks, see ya.", "고마워요, 또 봐요.")],
]);

const BAKERY = group("bakery", [
  ["1", 1, "🥐", "오늘 뭐가 나왔어요?", "갓 나온 빵 추천·데워 드리기", "손님", [
    t("Morning! What's fresh today?", "오늘 뭐가 갓 나왔어요?", "크루아상이 막 나왔다고 하세요", "The croissants are fresh out of the oven.", ["fresh out of the oven"]),
    t("Lovely. Can I get two?", "좋네요. 두 개 주세요.", "데워 드릴지 물어보세요", "Sure. Would you like me to warm them up?", ["warm them up", "warm it up"]),
    t("No thanks.", "괜찮아요.", "모두 9달러라고 하세요", "No worries. That's $9.", ["9", "nine dollars"]),
  ], o("Here you go.", "여기요.")],
  ["2", 2, "🌾", "재료 묻는 손님", "글루텐 프리·조각 판매", "손님", [
    t("Do you have anything gluten-free?", "글루텐 프리 있어요?", "이 브라우니가 글루텐 프리라고 하세요", "Yes, these brownies are gluten-free.", ["gluten-free", "gluten free"]),
    t("Great. Do you sell cake by the slice?", "케이크 조각으로도 팔아요?", "네, 조각으로 판다고 하세요", "Yes, we sell it by the slice.", ["by the slice"]),
    t("One slice of carrot cake, please.", "당근 케이크 한 조각 주세요.", "더 필요한 게 있는지 물어보세요", "Sure. Anything else?", ["anything else"]),
  ], o("That's it, thanks.", "그거면 돼요.")],
  ["3", 2, "🍞", "새벽 반죽 작업", "할 일 묻기·발효·라벨", "베이커", [
    t("Morning. Early start, eh?", "일찍 시작하죠?", "네 하고 무엇부터 할지 물어보세요", "Yeah. What should I do first?", ["what should I do first"]),
    t("Knead the dough, then let it proof for an hour.", "반죽 치대고 한 시간 발효해요.", "한 시간 발효시키겠다고 확인하세요", "Okay, I'll let it proof for an hour.", ["proof for an hour", "let it proof"]),
    t("And label the trays.", "그리고 트레이에 라벨 붙여요.", "라벨 붙이겠다고 하세요", "Sure, I'll label the trays.", ["label the trays", "label"]),
  ], o("Good stuff.", "좋아요.")],
  ["4", 3, "🈚", "다 팔렸을 때", "품절 안내·다음 입고·따로 챙겨 두기", "손님", [
    t("Can I get a sourdough loaf?", "사워도우 하나 주세요.", "죄송하지만 다 팔렸다고 하세요", "Sorry, the sourdough is sold out.", ["sold out"]),
    t("Oh no. Will you have more today?", "오늘 더 나와요?", "오늘은 없고 내일 아침 7시에 나온다고 하세요", "Not today, but we'll have more tomorrow at 7.", ["more tomorrow", "tomorrow at 7"]),
    t("Okay, I'll come back.", "다시 올게요.", "하나 따로 챙겨 둘지 물어보세요", "Would you like me to put one aside for you?", ["put one aside", "save one"]),
  ], o("Yes please, that'd be great.", "네, 그래 주면 좋죠.")],
]);

const CLEANING = group("cleaning", [
  ["1", 1, "🧽", "체크리스트 받기", "시작 위치·쓰레기통·닦기·청소기", "슈퍼바이저", [
    t("This is your checklist for tonight.", "오늘 밤 체크리스트예요.", "어디부터 시작할지 물어보세요", "Thanks. Where should I start?", ["where should I start"]),
    t("Start with the kitchen. Empty the bins and wipe down the benches.", "주방부터요. 쓰레기통 비우고 조리대 닦아요.", "쓰레기통 비우고 조리대 닦겠다고 확인하세요", "Okay, empty the bins and wipe down the benches.", ["empty the bins", "wipe down"]),
    t("Then vacuum the offices.", "그다음 사무실 청소기 돌려요.", "그다음 청소기 돌리겠다고 하세요", "Got it. Then I'll vacuum the offices.", ["vacuum"]),
  ], o("Great.", "좋아요.")],
  ["2", 2, "🪣", "바닥 청소", "젖은 바닥 표지판·세제 묻기", "슈퍼바이저", [
    t("Are you mopping the foyer?", "로비 걸레질해요?", "네, 젖은 바닥 표지판을 세우겠다고 하세요", "Yes. I'll put out the wet floor sign.", ["wet floor sign"]),
    t("Good. Do you know which chemicals to use?", "어떤 세제 쓰는지 알아요?", "어떤 걸 써야 하는지 물어보세요", "Not sure. Which one should I use?", ["which one should I use", "which one"]),
    t("The blue one for floors.", "바닥은 파란 거요.", "파란 걸로 쓰겠다고 하세요", "Okay, the blue one for floors.", ["the blue one"]),
  ], o("Perfect.", "좋아요.")],
  ["3", 2, "🔐", "건물 출입", "경보 코드·카드 반납", "슈퍼바이저", [
    t("Here's your access card.", "출입 카드예요.", "경보 코드를 물어보세요", "Thanks. What's the alarm code?", ["alarm code"]),
    t("It's 2468. Set it when you leave.", "2468이에요. 나갈 때 켜요.", "나갈 때 켜겠다고 하세요", "Okay, I'll set the alarm when I leave.", ["set the alarm"]),
    t("Perfect.", "좋아요.", "출입 카드는 어디에 반납하는지 물어보세요", "Where do I return the access card?", ["access card"]),
  ], o("Just leave it in the office.", "사무실에 두면 돼요.")],
  ["4", 3, "🧻", "물품이 떨어졌을 때", "다 떨어졌다고 알리고 해결하기", "슈퍼바이저 (전화)", [
    t("Hi, how's tonight going?", "오늘 밤 어때요?", "괜찮은데 화장지가 다 떨어졌다고 하세요", "Good, but we've run out of toilet paper.", ["run out of", "ran out of"]),
    t("Ah, there's more in the storeroom.", "창고에 더 있어요.", "창고가 잠겨 있다고 하세요", "The storeroom is locked.", ["locked"]),
    t("The key is in the lockbox. Code 1357.", "열쇠는 열쇠함에 있어요. 코드 1357.", "고맙다고, 찾았다고 하세요", "Thanks, I found it.", ["found it", "thanks"]),
  ], o("No worries.", "괜찮아요.")],
]);

const TRADES = group("trades", [
  ["1", 1, "📏", "어프렌티스 첫날", "치수 재기·수평 확인", "타일러", [
    t("You're the new apprentice?", "새 어프렌티스예요?", "네 하고 무엇을 도우면 되는지 물어보세요", "Yes. How can I help today?", ["how can I help"]),
    t("Measure the wall for tiles. Measure twice, cut once.", "타일 붙일 벽 치수 재요. 두 번 재고 한 번 자르기.", "두 번 재겠다고 하세요", "Got it. I'll measure twice.", ["measure twice"]),
    t("Good. Check it's level too.", "수평도 확인해요.", "수평 확인하겠다고 하세요", "Okay, I'll check it's level.", ["level"]),
  ], o("Good on ya.", "좋아요.")],
  ["2", 2, "🔨", "공구와 자재", "드릴 경험·자투리·줄눈", "타일러", [
    t("Have you used power tools before?", "전동공구 써 봤어요?", "네, 드릴은 써 봤다고 하세요", "Yes, I've used a drill before.", ["used a drill"]),
    t("Good. Cut this board and keep the offcuts.", "이 판 자르고 자투리는 남겨 둬요.", "자투리 남겨 두겠다고 하세요", "Okay, I'll keep the offcuts.", ["offcuts"]),
    t("Then grout the bathroom tiles.", "그다음 욕실 타일 줄눈 넣어요.", "줄눈 넣겠다고 하세요", "No worries, I'll grout the tiles.", ["grout"]),
  ], o("Sweet.", "좋아요.")],
  ["3", 2, "💬", "견적 묻는 손님", "크기 묻기·견적 안내·연락처", "손님", [
    t("Hi, can you give me a quote for a new deck?", "새 데크 견적 받을 수 있어요?", "그럼요 하고 크기를 물어보세요", "Sure. How big is the deck?", ["how big"]),
    t("About five by four metres.", "5미터 곱하기 4미터쯤이요.", "사장님이 내일 견적을 보낸다고 하세요", "Thanks. My boss will send you a quote tomorrow.", ["send you a quote", "quote"]),
    t("Great, thanks.", "좋아요, 고마워요.", "전화번호를 물어보세요", "Can I get your phone number?", ["phone number", "your number"]),
  ], o("Sure, it's 0412 555 019.", "네, 0412 555 019예요.")],
  ["4", 3, "✂️", "타일을 잘못 잘랐을 때", "실수 인정하고 다시 하기", "타일러", [
    t("This tile is cut too short.", "이 타일 너무 짧게 잘렸어요.", "제 실수라고 미안하다고 하세요", "Sorry, that's my mistake.", ["my mistake", "my fault"]),
    t("It happens. Can you cut a new one?", "그럴 수 있죠. 새로 잘라 줄래요?", "다시 재고 새로 자르겠다고 하세요", "Yes, I'll measure again and cut a new one.", ["cut a new one", "measure again"]),
    t("Good. Finish off this row before lunch.", "점심 전에 이 줄 마무리해요.", "점심 전에 마무리하겠다고 하세요", "Okay, I'll finish off this row before lunch.", ["finish off"]),
  ], o("Good stuff.", "좋아요.")],
]);

const FASHION = group("fashion", [
  ["1", 1, "👗", "피팅룸 안내", "피팅룸 위치·개수·도움 제안", "손님", [
    t("Hi, can I try this on?", "이거 입어 봐도 돼요?", "그럼요 하고 피팅룸은 뒤쪽이라고 하세요", "Of course. The fitting rooms are at the back.", ["fitting rooms", "fitting room"]),
    t("Thanks. How many items can I take in?", "몇 개까지 가져가요?", "다섯 개까지라고 하세요", "You can take up to five items.", ["up to five", "five items"]),
    t("Great.", "좋아요.", "필요한 거 있으면 말하라고 하세요", "Let me know if you need anything.", ["let me know"]),
  ], o("Will do, thanks.", "그럴게요, 고마워요.")],
  ["2", 2, "📐", "다른 사이즈 찾기", "사이즈 묻기·작게 나온다는 안내·칭찬", "손님", [
    t("Do you have this in a different size?", "이거 다른 사이즈 있어요?", "어떤 사이즈가 필요한지 물어보세요", "Sure. What size do you need?", ["what size"]),
    t("A medium. This small is too tight.", "미디엄이요. 스몰은 너무 껴요.", "이 브랜드는 작게 나온다고 알려 주세요", "This brand runs small, so a medium is a good idea.", ["runs small"]),
    t("Oh, okay. How does it look?", "아, 그렇군요. 어때요?", "잘 어울린다고 하세요", "It suits you!", ["it suits you", "looks great"]),
  ], o("Thanks! I'll take it.", "고마워요! 이걸로 할게요.")],
  ["3", 2, "🏷️", "세일과 계산", "할인율·금액·카드", "손님", [
    t("Is this on sale?", "이거 세일해요?", "네, 30% 할인이라고 하세요", "Yes, it's on sale. It's 30 percent off.", ["30 percent off", "on sale"]),
    t("Great, I'll take it.", "좋아요, 살게요.", "모두 42달러라고 하세요", "That comes to $42.", ["42"]),
    t("Here's my card.", "카드요.", "여기 대 달라고 하세요", "Thanks, just tap here.", ["tap here", "tap"]),
  ], o("Thanks!", "고마워요!")],
  ["4", 3, "↩️", "영수증 없는 반품", "교환·스토어 크레딧 안내", "손님", [
    t("Hi, I want to return this dress.", "이 원피스 반품하고 싶어요.", "영수증이 있는지 물어보세요", "Sure. Do you have the receipt?", ["receipt"]),
    t("No, I lost it.", "아뇨, 잃어버렸어요.", "영수증이 없으면 교환이나 스토어 크레딧만 된다고 하세요", "Without a receipt, we can only do an exchange or store credit.", ["store credit", "exchange"]),
    t("Okay, store credit is fine.", "스토어 크레딧 괜찮아요.", "처리해 드리겠다고 하세요", "No problem. I'll sort that out for you.", ["sort that out", "no problem"]),
  ], o("Thanks for your help.", "도와줘서 고마워요.")],
]);

const SERVO = group("servo", [
  ["1", 1, "⛽", "주유비 계산", "주유기 번호·추가 구매·합계", "손님", [
    t("Hi, pump number 3, please.", "3번 주유기요.", "3번이고 65달러라고 하세요", "Pump 3. That's $65.", ["pump 3", "65"]),
    t("Thanks.", "고마워요.", "다른 건 필요 없는지 물어보세요", "Anything else today?", ["anything else"]),
    t("A bottle of water, too.", "물 한 병도요.", "모두 68달러 50센트라고 하세요", "Sure. That's $68.50 altogether.", ["altogether", "68.50"]),
  ], o("Here you go.", "여기요.")],
  ["2", 2, "🪪", "신분증 확인", "담배 손님에게 신분증·결제 방법 묻기", "손님", [
    t("A pack of smokes, please.", "담배 한 갑 주세요.", "신분증을 보여 달라고 하세요", "Sure. Can I see some ID, please?", ["see some ID", "your ID"]),
    t("Here you go.", "여기요.", "고맙다고 하고 어떤 걸 원하는지 물어보세요", "Thanks. Which one would you like?", ["which one"]),
    t("The blue one.", "파란 거요.", "카드인지 현금인지 물어보세요", "Card or cash?", ["card or cash"]),
  ], o("Card, thanks.", "카드요.")],
  ["3", 2, "🌙", "야간 근무 루틴", "할 일 묻기·냉장고 채우기·정산", "매니저", [
    t("You're on night shift tonight.", "오늘 야간 근무예요.", "무엇부터 할지 물어보세요", "Okay. What should I do first?", ["what should I do first"]),
    t("Restock the fridge first.", "먼저 음료 냉장고 채워요.", "냉장고 채우겠다고 하세요", "Got it. I'll restock the fridge.", ["restock the fridge"]),
    t("And count the till at 10.", "10시에 계산대 정산해요.", "10시에 정산하겠다고 하세요", "No worries. I'll count the till at 10.", ["count the till"]),
  ], o("Thanks. Call me if anything comes up.", "고마워요. 무슨 일 있으면 전화해요.")],
  ["4", 3, "🚗", "기름 넣고 그냥 간 차", "드라이브오프 보고하기", "동료", [
    t("Did that car just drive off without paying?", "저 차 계산 안 하고 그냥 갔어요?", "네, 드라이브오프 같다고 하세요", "Yes, I think it's a drive-off.", ["drive-off", "drive off"]),
    t("Did you get the number plate?", "번호판 봤어요?", "번호판을 적어 놨다고 하세요", "Yes, I wrote down the number plate.", ["number plate"]),
    t("Good. Let's call the manager.", "잘했어요. 매니저한테 전화해요.", "지금 전화하겠다고 하세요", "Okay, I'll call the manager now.", ["call the manager"]),
  ], o("Good work.", "잘했어요.")],
]);

const SALON = group("salon", [
  ["1", 1, "📅", "예약 전화 받기", "날짜·시간·서비스 확인", "손님 (전화)", [
    t("Hi, I'd like to book an appointment.", "예약하고 싶어요.", "언제 오고 싶은지 물어보세요", "Sure. When would you like to come in?", ["when would you like"]),
    t("Saturday morning?", "토요일 오전이요?", "토요일 오전 10시가 비어 있다고 하세요", "We have 10 am free on Saturday.", ["10 am", "10am"]),
    t("Perfect. Just a trim.", "좋아요. 다듬기만요.", "토요일 10시 다듬기로 예약됐다고 하세요", "Great, a trim on Saturday at 10.", ["trim"]),
  ], o("See you then.", "그때 봬요.")],
  ["2", 2, "💇", "원하는 스타일 묻기", "스타일·앞머리·샴푸", "손님", [
    t("Hi, I'm here for my haircut.", "머리 자르러 왔어요.", "어떻게 해 드릴지 물어보세요", "Welcome. How would you like it?", ["how would you like it"]),
    t("Just a bit shorter, with layers.", "조금 짧게, 층 내서요.", "앞머리도 자를지 물어보세요", "Sure. Would you like a fringe too?", ["fringe"]),
    t("No fringe, thanks.", "앞머리는 괜찮아요.", "먼저 머리를 감겨 드리겠다고 하세요", "Okay. I'll wash your hair first.", ["wash your hair"]),
  ], o("Lovely.", "좋아요.")],
  ["3", 2, "🚿", "샴푸대에서", "물 온도 묻고 맞추기", "손님", [
    t("Mm, that's nice.", "음, 좋네요.", "물 온도 괜찮은지 물어보세요", "Is the water okay?", ["is the water okay", "water temperature"]),
    t("A bit hot, actually.", "사실 좀 뜨거워요.", "미안하다고 하고 미지근하게 하겠다고 하세요", "Sorry, I'll make it cooler.", ["make it cooler", "turn it down"]),
    t("That's perfect now.", "이제 딱 좋아요.", "다행이라고 하세요", "Great, glad to hear it.", ["glad to hear", "great"]),
  ], o("Thanks.", "고마워요.")],
  ["4", 3, "😟", "너무 짧다는 손님", "사과하고 다듬고 매니저에게 묻기", "손님", [
    t("Hmm, I think it's too short.", "흠, 너무 짧은 것 같아요.", "정말 죄송하다고 사과하세요", "I'm really sorry about that.", ["really sorry", "so sorry"]),
    t("It's okay. Can you fix the sides?", "괜찮아요. 옆머리 좀 정리해 줄래요?", "옆을 고르게 맞춰 드리겠다고 하세요", "Of course. I'll even out the sides.", ["even out the sides", "fix the sides"]),
    t("Thanks.", "고마워요.", "할인이 되는지 매니저에게 물어보겠다고 하세요", "I'll ask my manager about a discount.", ["ask my manager", "discount"]),
  ], o("That's kind, thank you.", "친절하네요, 고마워요.")],
]);

const CARE = group("care", [
  ["1", 1, "🌅", "아침 인사", "기분 묻기·일어나기 돕기", "어르신", [
    t("Good morning, dear.", "좋은 아침이에요.", "오늘 기분이 어떠신지 물어보세요", "Good morning! How are you feeling today?", ["how are you feeling today"]),
    t("A bit tired, but okay.", "좀 피곤하지만 괜찮아요.", "일어나는 걸 도와드릴지 물어보세요", "Can I give you a hand getting up?", ["give you a hand"]),
    t("Yes, please.", "네, 부탁해요.", "천천히 하시라고 하세요", "Okay, take it slowly.", ["take it slowly", "slowly"]),
  ], o("Thank you, love.", "고마워요.")],
  ["2", 2, "🩺", "인수인계 받기", "약 시간·기록·혈압", "간호사", [
    t("Here's the handover for room 5.", "5호실 인수인계예요.", "약은 언제 드리는지 물어보세요", "Thanks. When is her medication due?", ["medication"]),
    t("At 12, with lunch.", "12시, 점심이랑요.", "드린 뒤 기록지에 쓰겠다고 하세요", "Okay, I'll fill in the notes after.", ["fill in the notes"]),
    t("And check her blood pressure at 3.", "3시에 혈압도 재요.", "3시에 혈압 재겠다고 하세요", "Got it. Blood pressure at 3.", ["blood pressure"]),
  ], o("Thanks.", "고마워요.")],
  ["3", 2, "🍲", "식사 돕기", "조금이라도 드시게 권하기", "어르신", [
    t("I don't really want lunch.", "점심 별로 먹고 싶지 않아요.", "조금이라도 드셔 보시라고 권하세요", "Could you try a little bit?", ["a little bit", "try a little"]),
    t("Maybe some soup.", "수프 조금이요.", "수프를 가져다드리겠다고 하세요", "Sure, I'll get you some soup.", ["get you some soup"]),
    t("Thank you, love.", "고마워요.", "천만에요라고 하세요", "You're welcome.", ["you're welcome", "no worries"]),
  ], o("You're a good one.", "참 착하네요.")],
  ["4", 3, "💫", "어지럽다는 어르신", "앉히고 간호사에게 알리기", "어르신", [
    t("I feel dizzy...", "어지러워요...", "앉으시라고 하고 괜찮으신지 물어보세요", "Please sit down. Are you okay?", ["sit down", "are you okay"]),
    t("My head hurts.", "머리가 아파요.", "바로 간호사에게 알리겠다고 하세요", "I'll let the nurse know right away.", ["let the nurse know", "tell the nurse"]),
    t("Thank you.", "고마워요.", "옆에 있겠다고 안심시켜 드리세요", "Don't worry, I'll stay with you.", ["stay with you"]),
  ], o("Thank you, dear.", "고마워요.")],
]);

const CHILDCARE = group("childcare", [
  ["1", 1, "🧸", "부모님과 첫 인사", "하원 시간·낮잠 시간 확인", "부모", [
    t("Hi, you must be the new nanny.", "새로 온 내니죠?", "네 하고 만나서 반갑다고 하세요", "Yes, I'm the new nanny. Nice to meet you.", ["nice to meet you", "new nanny"]),
    t("Lovely. Can you pick up the kids at 3?", "3시에 애들 데리러 가 줄래요?", "3시에 데리러 가겠다고 하세요", "Sure, I'll pick up the kids at 3.", ["pick up the kids"]),
    t("Thanks. Nap time for the little one is at 1.", "작은애 낮잠은 1시예요.", "1시 낮잠 맞는지 확인하세요", "Okay, nap time at 1.", ["nap time"]),
  ], o("Great, thanks so much.", "좋아요, 정말 고마워요.")],
  ["2", 2, "🍎", "간식·스크린 타임 규칙", "간식 종류·스크린 타임 묻기", "부모", [
    t("They can have a snack after school.", "하교 후에 간식 줘도 돼요.", "어떤 간식이 괜찮은지 물어보세요", "What snacks are okay?", ["what snacks", "snack"]),
    t("Fruit or crackers. No lollies.", "과일이나 크래커요. 사탕은 안 돼요.", "스크린 타임은 얼마나 되는지 물어보세요", "Got it. How much screen time can they have?", ["screen time"]),
    t("One hour, max.", "최대 한 시간이요.", "최대 한 시간으로 하겠다고 하세요", "Okay, one hour max.", ["one hour"]),
  ], o("Perfect.", "좋아요.")],
  ["3", 2, "🧒", "다투는 아이들", "말로 하자고 달래고 칭찬하기", "아이", [
    t("He took my toy!", "쟤가 내 장난감 가져갔어!", "말로 하자고, 기분을 말해 보라고 하세요", "Okay, use your words. Tell him how you feel.", ["use your words"]),
    t("I'm sad.", "슬퍼.", "같이 나눠 쓰고 살살 하자고 하세요", "Let's share, and be gentle with each other.", ["be gentle", "share"]),
    t("Okay, sorry.", "알았어, 미안해.", "잘했다고 칭찬하세요", "Good job!", ["good job", "well done"]),
  ], o("Can we play now?", "이제 놀아도 돼?")],
  ["4", 3, "🩹", "아이가 넘어졌을 때", "부모에게 전화로 상황 알리기", "부모 (전화)", [
    t("Hello? Is everything okay?", "여보세요? 별일 없죠?", "미아가 넘어져서 무릎을 다쳤다고 하세요", "Hi, Mia fell over and hurt her knee.", ["hurt her knee", "fell over"]),
    t("Oh no! Is she okay?", "저런! 괜찮아요?", "괜찮다고, 닦고 밴드를 붙였다고 하세요", "She's okay. I cleaned it and put a band-aid on.", ["band-aid", "she's okay"]),
    t("Thank you for letting me know.", "알려 줘서 고마워요.", "계속 지켜보겠다고 하세요", "No worries. I'll keep an eye on her.", ["keep an eye on her"]),
  ], o("Thanks. See you at 6.", "고마워요. 6시에 봐요.")],
]);

const ANIMAL = group("animal", [
  ["1", 1, "🐶", "동물병원 접수", "자리 안내·접종 일정 확인", "보호자", [
    t("Hi, I'm here for Max's check-up.", "맥스 건강검진 왔어요.", "앉아서 기다리시면 곧 수의사가 온다고 하세요", "Welcome. Please take a seat. The vet will be with you soon.", ["take a seat", "be with you soon"]),
    t("Thanks. Is he due for a vaccination?", "예방접종할 때 됐나요?", "기록을 확인해 보겠다고 하세요", "Let me check his file.", ["let me check"]),
    t("Thanks.", "고마워요.", "네, 오늘 접종할 차례라고 하세요", "Yes, he's due for a vaccination today.", ["vaccination"]),
  ], o("Great, let's do it.", "좋아요, 해 주세요.")],
  ["2", 2, "🦮", "개 산책 맡기", "목줄·공원 규칙·밥 시간", "보호자", [
    t("Can you walk the dog at 5?", "5시에 개 산책시켜 줄래요?", "그러겠다고 하고 목줄은 어디 있는지 물어보세요", "Sure. Where do you keep the lead?", ["lead"]),
    t("By the door. Keep him on a lead in the park.", "문 옆에요. 공원에선 목줄 꼭 해요.", "목줄 하겠다고 하세요", "No worries, I'll keep him on a lead.", ["on a lead"]),
    t("And feed him at 6.", "6시에 밥 줘요.", "6시에 밥 주겠다고 하세요", "Okay, I'll feed him at 6.", ["feed him"]),
  ], o("You're a lifesaver.", "정말 고마워요.")],
  ["3", 2, "🐱", "케이지 청소와 보조", "청소하고 동물 잡아 주기", "간호사", [
    t("Can you clean out the cages?", "케이지 청소해 줄래요?", "그러겠다고 하세요", "Sure, I'll clean out the cages.", ["clean out"]),
    t("Thanks. Then hold this cat still for me.", "그리고 이 고양이 좀 가만히 잡아 줘요.", "알겠다고, 잡고 있겠다고 하세요", "Okay, I'll hold her still.", ["hold her still", "hold still"]),
    t("Gently... good job.", "살살... 잘했어요.", "다음엔 뭘 할지 물어보세요", "What should I do next?", ["what should I do next"]),
  ], o("Can you feed the dogs out back?", "뒤쪽 개들 밥 줄래요?")],
  ["4", 3, "🤒", "기운 없는 강아지", "언제부터인지 묻고 예약 잡기", "보호자", [
    t("My dog's been a bit off today.", "우리 개가 오늘 좀 이상해요.", "안됐다고 하고 언제부터인지 물어보세요", "I'm sorry to hear that. Since when?", ["since when"]),
    t("Since this morning. He won't eat.", "아침부터요. 안 먹어요.", "오늘 수의사가 봐 줄 수 있다고 하세요", "The vet can see him today.", ["vet can see him"]),
    t("Oh, thank you.", "고마워요.", "11시로 예약해 드리겠다고 하세요", "I'll book you in for 11.", ["book you in"]),
  ], o("Thanks so much.", "정말 고마워요.")],
]);

const FITNESS = group("fitness", [
  ["1", 1, "🏋️", "새 회원 상담", "운동 경험·초보 수업·체험", "방문객", [
    t("Hi, I'm interested in a membership.", "회원권에 관심 있어요.", "운동해 본 적 있는지 물어보세요", "Great! Have you trained before?", ["trained before"]),
    t("Not really. I'm a beginner.", "별로요. 초보예요.", "괜찮다고, 초보 수업이 있다고 하세요", "No worries. We have beginner sessions.", ["beginner"]),
    t("Sounds good.", "좋네요.", "무료 체험 수업을 잡을지 물어보세요", "Would you like to book a free session?", ["free session"]),
  ], o("Yes, please.", "네, 좋아요.")],
  ["2", 2, "🤸", "수업 진행하기", "몸풀기·시간·휴식", "회원", [
    t("I'm ready!", "준비됐어요!", "먼저 몸부터 풀자고 하세요", "Great. Let's warm up first.", ["warm up"]),
    t("How long?", "얼마나요?", "5분만이라고 하세요", "Just five minutes.", ["five minutes", "5 minutes"]),
    t("Phew, done.", "휴, 끝.", "잘했다고, 물 마시고 쉬라고 하세요", "Good job! Take a break and drink some water.", ["good job", "take a break"]),
  ], o("Thanks, coach.", "고마워요, 코치님.")],
  ["3", 2, "🏸", "코트 예약 전화", "시간 묻기·빈 코트·회원 확인", "손님 (전화)", [
    t("Hi, can I book a court for tomorrow?", "내일 코트 예약 돼요?", "몇 시를 원하는지 물어보세요", "Sure. What time would you like?", ["what time"]),
    t("6 pm, if possible.", "되면 저녁 6시요.", "6시에 코트가 있다고 하세요", "Yes, we have a court at 6 pm.", ["court at 6", "6 pm"]),
    t("Great, I'll take it.", "좋아요, 그걸로요.", "회원이신지 물어보세요", "Are you a member?", ["are you a member", "membership"]),
  ], o("Yep, under Chen.", "네, 첸으로요.")],
  ["4", 3, "🧊", "회원이 발목을 다쳤을 때", "움직이지 말라고 하고 응급처치", "회원", [
    t("Ow, my ankle!", "아, 발목!", "움직이지 말라고 하고 괜찮은지 물어보세요", "Don't move. Are you okay?", ["don't move", "are you okay"]),
    t("I think I twisted it.", "삔 것 같아요.", "얼음을 가져오겠다고 하세요", "I'll get some ice for you.", ["get some ice"]),
    t("Thanks.", "고마워요.", "응급처치 자격증이 있다고, 봐 드리겠다고 하세요", "I have a first aid certificate. Let me take a look.", ["first aid", "take a look"]),
  ], o("Thanks, that helps.", "고마워요, 도움이 돼요.")],
]);

const OFFICE = group("office", [
  ["1", 1, "📞", "전화 연결하기", "연결·부재 안내·메시지 받기", "손님 (전화)", [
    t("Hi, can I speak to Tom, please?", "톰 씨 계세요?", "연결해 드리겠다고 하세요", "Sure, I'll put you through.", ["put you through"]),
    t("Thanks.", "고마워요.", "톰이 통화 중이라고 하고 메시지를 남길지 물어보세요", "Sorry, he's on another call. Can I take a message?", ["take a message"]),
    t("Yes, please ask him to call me back.", "다시 전화해 달라고 전해 주세요.", "다시 전화드리라고 전하겠다고 하세요", "No problem. I'll ask him to call you back.", ["call you back"]),
  ], o("Thanks, bye.", "고마워요, 끊을게요.")],
  ["2", 2, "✍️", "이름과 번호 받아 적기", "철자 묻기·번호 확인", "손님 (전화)", [
    t("My name is Siobhan.", "제 이름은 시오반이에요.", "철자를 불러 달라고 하세요", "Sorry, could you spell that, please?", ["spell that"]),
    t("S-I-O-B-H-A-N.", "S-I-O-B-H-A-N이요.", "전화번호를 물어보세요", "Thanks. What's your phone number?", ["phone number"]),
    t("0412 345 678.", "0412 345 678이요.", "한 번 더 말해 달라고 하세요", "Sorry, could you say that again?", ["say that again"]),
  ], o("Sure. 0412 345 678.", "네. 0412 345 678이요.")],
  ["3", 2, "🗂️", "동료와 일정 잡기", "시간 제안·후속 이메일", "동료", [
    t("Can we touch base about the report?", "보고서 얘기 잠깐 할까요?", "좋다고, 오후 2시 어떤지 물어보세요", "Sure. How about 2 pm?", ["how about 2", "2 pm"]),
    t("Works for me.", "좋아요.", "회의 뒤에 이메일로 정리하겠다고 하세요", "Great. I'll follow up with an email after.", ["follow up"]),
    t("Perfect.", "좋아요.", "그때 보자고 하세요", "See you then.", ["see you then"]),
  ], o("Cheers.", "고마워요.")],
  ["4", 3, "🔄", "근무를 바꿔야 할 때", "근무 변경 요청·이유·대타", "매니저", [
    t("What's up?", "무슨 일이에요?", "금요일 근무를 바꿀 수 있는지 물어보세요", "Can I swap a shift on Friday?", ["swap a shift", "swap my shift"]),
    t("Why's that?", "왜요?", "병원 예약이 있다고 하세요", "I have a doctor's appointment.", ["appointment"]),
    t("Okay. Who can cover you?", "누가 대신해 줄 수 있어요?", "에밀리가 대신해 준다고 했다고 하세요", "Emily said she can cover me.", ["cover me", "cover"]),
  ], o("Great, I'll update the roster.", "좋아요, 로스터 고칠게요.")],
]);

export const ROLEPLAYS: Roleplay[] = [
  ...CAFE,
  ...SERVING,
  ...KITCHEN,
  ...HOUSEKEEPING,
  ...HOTEL,
  ...RESORT,
  ...RETAIL,
  ...FARM,
  ...FACTORY,
  ...CONSTRUCTION,
  ...TAKEAWAY,
  ...BAKERY,
  ...CLEANING,
  ...TRADES,
  ...FASHION,
  ...SERVO,
  ...SALON,
  ...CARE,
  ...CHILDCARE,
  ...ANIMAL,
  ...FITNESS,
  ...OFFICE,
];

export function roleplay(id: string) {
  return ROLEPLAYS.find((r) => r.id === id) ?? null;
}

export function roleplaysFor(job: string) {
  return ROLEPLAYS.filter((r) => r.job === job);
}

/** 직군 → 표현 익히기 토픽 (course-topics.ts의 id). 사무는 '전화' 토픽 */
export const TOPIC_FOR_JOB: Record<RoleplayJob, string> = {
  cafe: "cafe", kitchen: "kitchen", serving: "serving", takeaway: "takeaway", bakery: "bakery",
  housekeeping: "housekeeping", cleaning: "cleaning", hotel: "hotel", resort: "resort",
  farm: "farm", factory: "factory", construction: "construction", trades: "trades",
  retail: "retail", fashion: "fashion", servo: "servo", salon: "salon", care: "care",
  childcare: "childcare", animal: "animal", fitness: "fitness", office: "phone",
};
