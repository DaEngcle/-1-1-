// 고양이 마을 가게 대화: 점원(호주 사람)이 말을 걸고 학생이 영어로 받아 2~3번 주고받는다.
// 키는 village.js의 PLACES id. 첫 마디는 지도에 보이는 표현(q)과 같게 둔다.
// answers: 맞다고 볼 문장들 (첫 번째가 보여 주는 정답). 브라우저 음성 인식 결과와 비교한다.

export type TalkTurn = {
  /** 점원이 하는 말 (영어, 소리로 읽어 준다) */
  clerk: string;
  /** 점원 말 뜻 (한국어) */
  clerkKo: string;
  /** 학생이 할 말 (한국어 힌트) */
  ko: string;
  answers: string[];
};

export const VILLAGE_TALKS: Record<string, TalkTurn[]> = {
  hosier: [
    { clerk: "Hi there! What can I get you?", clerkKo: "안녕하세요! 뭐 드릴까요?", ko: "플랫화이트 한 잔 주세요.", answers: ["Can I grab a flat white, please?", "Can I get a flat white, please?", "Could I have a flat white, please?"] },
    { clerk: "No worries. Any particular milk?", clerkKo: "네. 우유는 따로 원하시는 거 있어요?", ko: "오트 밀크로 주세요.", answers: ["Oat milk, please.", "Can I get oat milk, please?"] },
    { clerk: "Lovely. Having it here or takeaway?", clerkKo: "좋아요. 드시고 가세요, 가져가세요?", ko: "가져갈게요, 고마워요.", answers: ["Takeaway, thanks.", "Takeaway, please.", "To go, thanks."] },
  ],
  bakery: [
    { clerk: "Morning! What can I do for you?", clerkKo: "좋은 아침이에요! 뭘 도와드릴까요?", ko: "크루아상 두 개 포장해 주세요.", answers: ["Can I get two croissants to take away, please?", "Can I get two croissants to go, please?"] },
    { clerk: "Sure. Would you like them warmed up?", clerkKo: "네. 데워 드릴까요?", ko: "네, 그래 주시면 좋아요.", answers: ["Yes, that'd be great.", "Yes, please.", "Yeah, that would be great."] },
    { clerk: "That's nine dollars. Anything else?", clerkKo: "9달러예요. 다른 건요?", ko: "그게 다예요, 고마워요.", answers: ["That's all, thanks.", "That's it, thanks.", "No, that's all, thanks."] },
  ],
  china: [
    { clerk: "Hi, welcome! How many of you tonight?", clerkKo: "어서 오세요! 오늘 몇 분이세요?", ko: "두 명 자리 있어요?", answers: ["Have you got a table for two?", "Do you have a table for two?", "A table for two, please."] },
    { clerk: "Yep, come this way. Can I get you some drinks?", clerkKo: "네, 이쪽으로 오세요. 음료 먼저 드릴까요?", ko: "물만 주세요.", answers: ["Just water, please.", "Just some water, please.", "Can we just get some water, please?"] },
    { clerk: "No problem. Are you ready to order?", clerkKo: "네. 주문하시겠어요?", ko: "몇 분만 더 시간 주실래요?", answers: ["Can we have a few more minutes?", "Could we get a few more minutes, please?", "Can we have a couple more minutes?"] },
  ],
  hotel: [
    { clerk: "Good evening! Checking in?", clerkKo: "안녕하세요! 체크인하세요?", ko: "오늘 밤 예약했어요. 이름은 다니엘이에요.", answers: ["Hi, I have a booking for tonight under Daniel.", "I have a booking for tonight under Daniel.", "I've got a booking for tonight under Daniel."] },
    { clerk: "Got it. Can I see some ID, please?", clerkKo: "확인했어요. 신분증 보여 주시겠어요?", ko: "네, 여기 제 여권이요.", answers: ["Sure, here's my passport.", "Here's my passport.", "Yes, here's my passport."] },
    { clerk: "Thanks. You're in room 305. Anything else I can help with?", clerkKo: "감사합니다. 305호예요. 더 도와드릴 거 있을까요?", ko: "와이파이 비밀번호가 뭐예요?", answers: ["What's the Wi-Fi password?", "What is the wifi password?", "Could I get the Wi-Fi password?"] },
  ],
  chemist: [
    { clerk: "Hi, how can I help?", clerkKo: "안녕하세요, 뭘 도와드릴까요?", ko: "이 처방전 약 받을 수 있을까요?", answers: ["Can I get this prescription filled, please?", "Could I get this prescription filled, please?"] },
    { clerk: "Sure. It'll be about fifteen minutes. Have you been here before?", clerkKo: "네. 15분쯤 걸려요. 전에 오신 적 있어요?", ko: "아니요, 처음이에요.", answers: ["No, it's my first time.", "No, this is my first time."] },
    { clerk: "Okay. Do you have a Medicare card?", clerkKo: "알겠어요. 메디케어 카드 있으세요?", ko: "아니요, 저는 워홀이에요.", answers: ["No, I'm on a working holiday visa.", "No, I'm on a working holiday.", "No, I'm a working holiday maker."] },
  ],
  coles: [
    { clerk: "Hi, are you finding everything okay?", clerkKo: "안녕하세요, 찾으시는 건 잘 찾고 계세요?", ko: "실례지만, 우유 어디 있어요?", answers: ["Excuse me, where can I find the milk?", "Where can I find the milk?", "Excuse me, where's the milk?"] },
    { clerk: "It's in aisle seven, down the back.", clerkKo: "7번 통로 맨 안쪽에 있어요.", ko: "고마워요. 그리고 계란은요?", answers: ["Thanks. What about eggs?", "Thanks, and where are the eggs?", "Thank you. What about the eggs?"] },
    { clerk: "Eggs are right next to it. Anything else?", clerkKo: "계란은 바로 옆에 있어요. 다른 건요?", ko: "아니요, 그게 다예요. 고마워요!", answers: ["No, that's all. Thanks!", "That's all, thanks!", "No, that's it. Thanks!"] },
  ],
  woolies: [
    { clerk: "Hiya! Did you bring your own bags today?", clerkKo: "안녕하세요! 오늘 장바구니 가져오셨어요?", ko: "아니요. 봉투 하나 주세요.", answers: ["No. Can I get a bag, please?", "Can I get a bag, please?", "No, can I grab a bag, please?"] },
    { clerk: "Sure, that's twenty cents. Do you have an Everyday Rewards card?", clerkKo: "네, 20센트예요. 리워드 카드 있으세요?", ko: "아니요, 없어요.", answers: ["No, I don't.", "No, I don't have one."] },
    { clerk: "No worries. Card or cash?", clerkKo: "괜찮아요. 카드예요, 현금이에요?", ko: "카드로 할게요.", answers: ["Card, please.", "I'll pay by card.", "Card, thanks."] },
  ],
  qvm: [
    { clerk: "G'day! Fresh apples today!", clerkKo: "안녕하세요! 오늘 사과 싱싱해요!", ko: "사과 1킬로에 얼마예요?", answers: ["How much for a kilo of apples?", "How much is a kilo of apples?"] },
    { clerk: "Four dollars a kilo, or two kilos for seven.", clerkKo: "1킬로에 4달러, 2킬로면 7달러예요.", ko: "그럼 2킬로 주세요.", answers: ["I'll take two kilos, then.", "Two kilos, please.", "Can I get two kilos, please?"] },
    { clerk: "Beauty. Need a bag?", clerkKo: "좋아요. 봉투 필요해요?", ko: "괜찮아요, 가방 있어요.", answers: ["I'm fine, I've got a bag.", "No thanks, I've got a bag.", "That's okay, I have a bag."] },
  ],
  cake: [
    { clerk: "Hi! What can I get for you?", clerkKo: "안녕하세요! 뭐 드릴까요?", ko: "이 케이크 한 조각 포장해 주세요.", answers: ["Can I get a slice of this cake to go?", "Can I get a slice of this cake to take away?"] },
    { clerk: "Good choice. Is it for a special occasion?", clerkKo: "잘 고르셨어요. 특별한 날이에요?", ko: "네, 친구 생일이에요.", answers: ["Yes, it's my friend's birthday.", "Yeah, it's my friend's birthday."] },
    { clerk: "Aw, lovely! Would you like a candle with it?", clerkKo: "어머, 좋네요! 초도 하나 드릴까요?", ko: "네, 좋아요. 고마워요!", answers: ["Yes, please. Thanks!", "Yes, that'd be great, thanks!", "Sure, thanks!"] },
  ],
  site: [
    { clerk: "Morning, mate! First day?", clerkKo: "좋은 아침! 오늘 첫날이에요?", ko: "네. 오늘 안전 장비 어디서 받아요?", answers: ["Yeah. Where do I pick up my PPE today?", "Where do I pick up my PPE today?", "Yes. Where do I get my PPE?"] },
    { clerk: "From the site office, over there. Have you got your white card?", clerkKo: "저기 현장 사무실에서요. 화이트카드 있어요?", ko: "네, 여기 있어요.", answers: ["Yep, here it is.", "Yes, here it is.", "Yeah, here you go."] },
    { clerk: "Good stuff. Smoko's at ten. Any questions?", clerkKo: "좋아요. 쉬는 시간은 10시예요. 질문 있어요?", ko: "오늘 누구랑 일해요?", answers: ["Who am I working with today?", "Who will I be working with today?"] },
  ],
  park: [
    { clerk: "Morning! Beautiful out, isn't it?", clerkKo: "좋은 아침이에요! 날씨 좋죠?", ko: "오늘 날씨 좋네요.", answers: ["Lovely day, isn't it?", "It's a lovely day.", "Yeah, lovely day."] },
    { clerk: "Sure is. Are you new around here?", clerkKo: "그러게요. 이 동네 처음이에요?", ko: "네, 한국에서 워홀 왔어요.", answers: ["Yeah, I'm here on a working holiday from Korea.", "Yes, I'm on a working holiday from Korea.", "Yeah, I came from Korea on a working holiday."] },
    { clerk: "Oh, nice! How are you finding Melbourne?", clerkKo: "오, 좋네요! 멜버른 어때요?", ko: "정말 좋아요. 커피가 최고예요.", answers: ["I love it. The coffee is amazing.", "I really like it. The coffee is the best.", "Loving it. The coffee is amazing."] },
  ],
  huts: [
    { clerk: "Hey! Enjoying the beach?", clerkKo: "안녕하세요! 바다 즐기고 계세요?", ko: "사진 한 장 찍어 주실 수 있어요?", answers: ["Could you take a photo of us?", "Could you take a photo of me?", "Would you mind taking a photo of us?"] },
    { clerk: "Of course! Do you want the huts in the background?", clerkKo: "물론이죠! 뒤에 오두막 나오게 할까요?", ko: "네, 다 나오게 찍어 주세요.", answers: ["Yes, please get them all in.", "Yes, can you get them all in?", "Yeah, please get all of them in."] },
    { clerk: "Here you go. Have a look!", clerkKo: "여기요. 한번 보세요!", ko: "완벽해요, 정말 고마워요!", answers: ["Perfect, thanks so much!", "That's perfect, thank you so much!", "Perfect, thank you so much!"] },
  ],
  pier: [
    { clerk: "Hi there, you look a bit lost!", clerkKo: "안녕하세요, 길 잃으신 것 같아요!", ko: "실례지만, 해변은 어느 쪽이에요?", answers: ["Excuse me, which way to the beach?", "Which way is the beach?", "Excuse me, which way is the beach?"] },
    { clerk: "Just keep walking along the water for about five minutes.", clerkKo: "물가 따라서 5분쯤 쭉 걸어가세요.", ko: "걸어서 갈 수 있어요?", answers: ["Can I walk there?", "Is it walking distance?", "Can I get there on foot?"] },
    { clerk: "Yeah, easy walk. You can't miss it.", clerkKo: "네, 금방이에요. 바로 보일 거예요.", ko: "정말 고마워요. 좋은 하루 보내세요!", answers: ["Thanks heaps. Have a good day!", "Thank you so much. Have a good day!", "Thanks a lot. Have a great day!"] },
  ],
};
