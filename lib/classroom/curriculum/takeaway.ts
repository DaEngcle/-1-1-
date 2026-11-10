import { L, ln, o, t, type JobCurriculum } from "./kit";

const curriculum: JobCurriculum = {
  steps: ["카운터 첫 주문", "매일 하는 가게 일", "손님 맞춤 요청", "실수·문제·위생 대처", "러시 아워·인수인계"],
  lessons: [
    // ───────── STEP 1 ─────────
    L("1", 1, "🍔", "카운터 주문", "포장 여부·세트·소스 묻기", "손님",
      [
        ln("Dine in or takeaway", "드시고 가세요, 가져가세요", "Hi there! Dine in or takeaway?", "안녕하세요! 드시고 가세요, 가져가세요?", "호주에선 to go보다 takeaway를 많이 써요."),
        ln("make it a meal", "세트로 하다", "Would you like to make it a meal?", "세트로 하시겠어요?"),
        ln("chips and a drink", "감자튀김이랑 음료", "The meal comes with chips and a drink.", "세트는 감자튀김이랑 음료가 같이 나와요."),
        ln("dipping sauce", "찍어 먹는 소스", "Which dipping sauce would you like?", "찍어 드실 소스는 뭘로 하시겠어요?"),
        ln("garlic aioli", "갈릭 아이올리", "Garlic aioli or sweet chilli?", "갈릭 아이올리랑 스위트 칠리 중에 뭘로 드려요?"),
      ],
      [
        t("Hi, can I get a burger?", "버거 하나 주세요.", "먹고 갈지 가져갈지 물어보세요", "Sure. Dine in or takeaway?", ["dine in or takeaway", "for here or to go", "eat in"]),
        t("To go, please.", "가져갈게요.", "세트로 하실지 물어보세요", "Would you like to make it a meal?", ["make it a meal"]),
        t("Yes, with chips.", "네, 감자튀김이랑요.", "소스는 뭘로 할지 물어보세요", "Great. Which dipping sauce would you like?", ["dipping sauce", "which sauce"]),
      ],
      o("Garlic aioli, thanks.", "갈릭 아이올리요.")),

    L("5", 1, "🤔", "뭐가 맛있냐는 손님", "인기 메뉴 추천·메뉴 설명하기", "손님",
      [
        ln("first time here", "여기 처음", "Is it your first time here?", "여기 처음 오셨어요?"),
        ln("best seller", "제일 잘 나가는 메뉴", "The Korean fried chicken is our best seller.", "한국식 프라이드치킨이 제일 잘 나가요."),
        ln("crispy and juicy", "바삭하고 촉촉한", "It's really crispy and juicy.", "정말 바삭하고 촉촉해요."),
        ln("soy garlic", "간장 마늘", "Try the soy garlic if you don't like spicy.", "매운 거 싫으시면 간장 마늘 드셔 보세요."),
        ln("What's good here", "여기 뭐가 맛있어요", "What's good here, mate?", "여기 뭐가 맛있어요?"),
      ],
      [
        t("Hey, what's good here?", "여기 뭐가 맛있어요?", "처음 오셨는지 물어보세요", "Is it your first time here?", ["first time here", "first time"]),
        t("Yeah, first time.", "네, 처음이에요.", "프라이드치킨이 제일 잘 나간다고 하세요", "Our fried chicken is the best seller.", ["best seller", "most popular"]),
        t("I'm not great with spicy food.", "매운 걸 잘 못 먹어요.", "그럼 간장 마늘 맛을 드셔 보라고 하세요", "Then try the soy garlic. It's not spicy.", ["soy garlic", "not spicy"]),
      ],
      o("Sweet, I'll get that.", "좋아요, 그걸로 할게요.")),

    L("6", 1, "🍗", "치킨 몇 조각 주문", "조각 수·순살 여부·사이즈 묻기", "손님",
      [
        ln("How many pieces", "몇 조각", "How many pieces would you like?", "몇 조각 드릴까요?"),
        ln("half or whole", "반 마리 아니면 한 마리", "Half or whole chicken?", "반 마리 드릴까요, 한 마리 드릴까요?"),
        ln("boneless or bone-in", "순살 아니면 뼈 있는 거", "Do you want boneless or bone-in?", "순살로 드릴까요, 뼈 있는 걸로 드릴까요?"),
        ln("feeds about", "~명 정도 먹는", "A whole chicken feeds about three people.", "한 마리면 세 명 정도 먹어요."),
        ln("a six-piece box", "6조각 박스", "Can I get a six-piece box?", "6조각 박스 하나 주세요."),
      ],
      [
        t("Can I get some fried chicken?", "프라이드치킨 주세요.", "반 마리인지 한 마리인지 물어보세요", "Sure. Half or whole?", ["half or whole", "half or a whole"]),
        t("Hmm, it's for three people.", "음, 세 명이 먹을 거예요.", "한 마리면 세 명 정도 먹는다고 하세요", "A whole one feeds about three people.", ["feeds about", "enough for three"]),
        t("Okay, a whole one then.", "좋아요, 그럼 한 마리요.", "순살인지 뼈 있는 건지 물어보세요", "Boneless or bone-in?", ["boneless or bone-in", "boneless"]),
      ],
      o("Boneless, please.", "순살이요.")),

    L("7", 1, "🥤", "음료 고르기", "음료 종류 안내·냉장고 위치 알려 주기", "손님",
      [
        ln("Any drinks with that", "음료도 같이 드릴까요", "Any drinks with that?", "음료도 같이 드릴까요?"),
        ln("help yourself", "직접 가져가세요", "Help yourself from the fridge.", "냉장고에서 직접 가져가세요."),
        ln("cans are $3", "캔은 3달러", "All cans are $3 each.", "캔은 전부 하나에 3달러예요."),
        ln("Coke No Sugar", "코크 제로", "We've only got Coke No Sugar left.", "코크 제로만 남았어요.", "호주에선 Coke Zero를 Coke No Sugar라고 해요."),
        ln("a bottle of water", "생수 한 병", "Can I grab a bottle of water too?", "생수 한 병도 가져가도 돼요?"),
      ],
      [
        t("That's all the food, thanks.", "음식은 그게 다예요.", "음료도 같이 하실지 물어보세요", "Any drinks with that?", ["any drinks with that", "anything to drink", "any drinks"]),
        t("Yeah, how much are the cans?", "네, 캔은 얼마예요?", "캔은 전부 3달러라고 하세요", "Cans are $3 each.", ["3 each", "$3", "three dollars"]),
        t("Cool. Where are they?", "좋아요. 어디 있어요?", "냉장고에서 직접 가져가시라고 하세요", "Just help yourself from the fridge.", ["help yourself", "in the fridge"]),
      ],
      o("Easy, thanks.", "간단하네요, 고마워요.")),

    L("8", 1, "💰", "계산하기", "합계 안내·카드/현금 받기·영수증 묻기", "손님",
      [
        ln("That comes to", "모두 ~예요", "That comes to $24.50, thanks.", "모두 24달러 50센트예요."),
        ln("card or cash", "카드 아니면 현금", "Will that be card or cash?", "카드로 하세요, 현금으로 하세요?"),
        ln("tap whenever you're ready", "준비되면 대세요", "Tap whenever you're ready.", "준비되시면 카드 대세요."),
        ln("Here's your change", "거스름돈 여기요", "Here's your change, $5.50.", "거스름돈 5달러 50센트 여기요."),
        ln("Do you need a receipt", "영수증 필요하세요", "Do you need a receipt?", "영수증 필요하세요?"),
      ],
      [
        t("How much is it?", "얼마예요?", "모두 24달러 50센트라고 하세요", "That comes to $24.50.", ["that comes to", "24.50", "that's"]),
        t("Can I pay with cash?", "현금으로 돼요?", "물론이라고 하고 30달러를 받으면 거스름돈 5달러 50센트를 드리세요", "Of course. Here's your change, $5.50.", ["here's your change", "your change"]),
        t("Thanks.", "고마워요.", "영수증 필요하신지 물어보세요", "Do you need a receipt?", ["need a receipt", "want a receipt", "receipt"]),
      ],
      o("Nah, I'm good.", "아니요, 괜찮아요.")),

    L("9", 1, "🔔", "주문번호 불러 건네기", "번호 안내·이름 부르기·음식 건네기", "손님",
      [
        ln("your order number", "주문 번호", "This is your order number, 42.", "주문 번호는 42번이에요."),
        ln("I'll call it out", "불러 드릴게요", "I'll call it out when it's ready.", "준비되면 불러 드릴게요."),
        ln("Order 42", "42번 주문", "Order 42, chicken box!", "42번 주문, 치킨 박스 나왔어요!"),
        ln("Here you go", "여기 있습니다", "Here you go, enjoy!", "여기 있습니다, 맛있게 드세요!"),
        ln("sauces are in the bag", "소스는 봉투에 있어요", "Your sauces are in the bag.", "소스는 봉투 안에 넣어 뒀어요."),
      ],
      [
        t("So how does it work?", "어떻게 하면 돼요?", "주문 번호가 42번이라고 하세요", "This is your order number, 42.", ["order number", "number 42", "42"]),
        t("Okay, do I wait here?", "여기서 기다리면 돼요?", "준비되면 불러 드리겠다고 하세요", "Yep, I'll call it out when it's ready.", ["call it out", "call your number"]),
        t("Is that mine? 42?", "그거 제 거예요? 42번?", "여기 있다고 하고 소스는 봉투에 있다고 하세요", "Here you go. Your sauces are in the bag.", ["here you go", "in the bag"]),
      ],
      o("Legend, thanks.", "최고예요, 고마워요.")),

    // ───────── STEP 2 ─────────
    L("2", 2, "📱", "픽업 주문 전화", "주문 받기·대기 시간 안내", "손님 (전화)",
      [
        ln("place a pick-up order", "픽업 주문을 하다", "Hi, I'd like to place a pick-up order.", "안녕하세요, 픽업 주문하려고요."),
        ln("What can I get for you", "뭘 드릴까요", "Sure, what can I get for you?", "네, 뭘 드릴까요?"),
        ln("about ten minutes", "10분 정도", "It'll be ready in about ten minutes.", "10분 정도면 준비돼요."),
        ln("Can I get a name", "성함 알려 주시겠어요", "Can I get a name for the order?", "주문하시는 분 성함 알려 주시겠어요?"),
        ln("See you in ten minutes", "10분 뒤에 뵐게요", "Thanks, Leo. See you in ten minutes.", "고마워요, 레오 님. 10분 뒤에 뵐게요."),
      ],
      [
        t("Hi, I'd like to place a pick-up order.", "픽업 주문하려고요.", "네, 무엇을 드릴지 물어보세요", "Sure. What can I get for you?", ["what can I get for you", "what can I get you"]),
        t("A large chicken box, please.", "치킨 박스 라지요.", "10분 정도 걸린다고 하세요", "No problem. It'll be about ten minutes.", ["ten minutes", "10 minutes"]),
        t("Okay. The name's Leo.", "레오예요.", "레오 님, 10분 뒤에 뵙겠다고 하세요", "Thanks, Leo. See you in ten minutes.", ["see you in ten minutes", "see you soon"]),
      ],
      o("See ya.", "이따 봐요.")),

    L("3", 2, "🍟", "바쁜 주방에서", "주문 나르기·튀김기 맡기·마감 청소", "동료",
      [
        ln("Order up", "주문 나왔어요", "Order up! Number 15!", "주문 나왔어요! 15번!"),
        ln("I'll take it", "제가 가져갈게요", "Got it, I'll take it out.", "알겠어요, 제가 가져갈게요."),
        ln("watch the fryer", "튀김기를 봐 주다", "Can you watch the fryer for a sec?", "튀김기 잠깐 봐 줄래요?"),
        ln("clean the fryer", "튀김기를 청소하다", "Make sure you clean the fryer before close.", "마감 전에 꼭 튀김기 청소해요."),
        ln("before close", "마감 전에", "I'll mop the floor before close.", "마감 전에 바닥 걸레질할게요."),
      ],
      [
        t("Order up! Table 4!", "4번 주문 나왔어요!", "가져가겠다고 하세요", "Got it, I'll take it.", ["I'll take it", "got it"]),
        t("Can you watch the fryer for a sec?", "튀김기 잠깐 봐 줄래요?", "그러겠다고 하세요", "Sure, I'll watch the fryer.", ["watch the fryer"]),
        t("Thanks. And clean the fryer before close.", "그리고 마감 전에 튀김기 청소해요.", "마감 전에 청소하겠다고 하세요", "No worries. I'll clean the fryer before close.", ["clean the fryer"]),
      ],
      o("Legend.", "최고.")),

    L("10", 2, "🔑", "오픈 준비", "튀김기 켜기·소스 채우기·포스기 켜기", "매니저 Tom",
      [
        ln("turn on the fryers", "튀김기를 켜다", "First, turn on the fryers.", "먼저 튀김기 켜요."),
        ln("heat up", "데워지다", "The oil takes 15 minutes to heat up.", "기름이 데워지는 데 15분 걸려요."),
        ln("top up the sauces", "소스를 채우다", "Can you top up the sauces at the counter?", "카운터 소스 좀 채워 줄래요?"),
        ln("switch on the POS", "포스기를 켜다", "Don't forget to switch on the POS.", "포스기 켜는 거 잊지 마요."),
        ln("ready to open", "열 준비가 된", "We're ready to open, Tom.", "톰, 문 열 준비 됐어요."),
      ],
      [
        t("Morning! First thing, turn on the fryers.", "좋은 아침! 먼저 튀김기부터 켜요.", "네, 튀김기 켜겠다고 하세요", "Sure, I'll turn on the fryers now.", ["turn on the fryers", "turn the fryers on"]),
        t("Then top up the sauces at the counter.", "그다음 카운터 소스 채워요.", "알겠다고 하고 포스기도 켜 둘지 물어보세요", "Got it. Should I switch on the POS too?", ["switch on the POS", "turn on the POS"]),
        t("Yep. Tell me when we're good.", "네. 다 되면 말해 줘요.", "문 열 준비가 됐다고 하세요", "All done. We're ready to open.", ["ready to open", "good to go"]),
      ],
      o("Nice one. Flip the sign.", "좋아요. 간판 돌려요.")),

    L("11", 2, "📲", "우버이츠 태블릿 주문", "배달앱 주문 수락·준비 시간 설정하기", "매니저 Tom",
      [
        ln("Uber order", "우버 주문", "There's a new Uber order on the tablet.", "태블릿에 우버 주문 새로 들어왔어요."),
        ln("accept it", "수락하다", "Can you accept it and print the docket?", "수락하고 주문서 출력해 줄래요?"),
        ln("print the docket", "주문서를 출력하다", "I'll print the docket for the kitchen.", "주방에 줄 주문서 출력할게요.", "호주에선 주문서를 docket이라고 해요."),
        ln("prep time", "준비 시간", "Set the prep time to 15 minutes.", "준비 시간을 15분으로 설정해요."),
        ln("mark it as ready", "준비 완료로 표시하다", "Mark it as ready when it's bagged.", "포장 끝나면 준비 완료로 표시해요."),
      ],
      [
        t("The tablet's beeping. Can you get it?", "태블릿이 울려요. 봐 줄래요?", "우버 주문이니 수락하겠다고 하세요", "It's an Uber order. I'll accept it.", ["accept it", "accept the order"]),
        t("How long should we give it?", "시간 얼마로 잡을까요?", "준비 시간을 15분으로 하겠다고 하세요", "I'll set the prep time to 15 minutes.", ["prep time", "15 minutes"]),
        t("Good. Then what?", "좋아요. 그다음은요?", "주문서 출력하고 포장되면 준비 완료로 표시하겠다고 하세요", "I'll print the docket and mark it as ready.", ["print the docket", "mark it as ready"]),
      ],
      o("Perfect, you've got it.", "완벽해요, 잘하네요.")),

    L("12", 2, "🛍️", "포장 꼼꼼히 하기", "소스·냅킨 챙기기·봉투 닫기·스티커 붙이기", "동료 Jay",
      [
        ln("double-check the order", "주문을 다시 확인하다", "Always double-check the order before bagging.", "봉투에 넣기 전에 항상 주문 다시 확인해요."),
        ln("throw in some napkins", "냅킨을 넣어 주다", "Throw in some napkins and a wet wipe.", "냅킨이랑 물티슈 좀 넣어 줘요."),
        ln("seal the bag", "봉투를 봉하다", "Don't forget to seal the bag.", "봉투 봉하는 거 잊지 마요."),
        ln("name sticker", "이름 스티커", "Put the name sticker on the front.", "이름 스티커는 앞에 붙여요."),
        ln("keep the chips crispy", "감자튀김을 바삭하게 유지하다", "Leave the lid open to keep the chips crispy.", "감자튀김 바삭하게 뚜껑 살짝 열어 둬요."),
      ],
      [
        t("Can you bag up the order for Kim?", "김 님 주문 포장해 줄래요?", "네, 먼저 주문을 다시 확인하겠다고 하세요", "Sure, I'll double-check the order first.", ["double-check the order", "check the order"]),
        t("Good. Don't forget the extras.", "좋아요. 부가 물품 잊지 마요.", "냅킨이랑 소스를 넣겠다고 하세요", "Yep, I'll throw in some napkins and sauces.", ["throw in some napkins", "napkins"]),
        t("And then?", "그다음은요?", "봉투를 봉하고 이름 스티커를 붙이겠다고 하세요", "I'll seal the bag and put the name sticker on.", ["seal the bag", "name sticker"]),
      ],
      o("Spot on.", "딱 좋아요.")),

    L("13", 2, "📦", "재료 채우기", "냉동고에서 재료 가져오기·재고 알리기", "매니저 Tom",
      [
        ln("running low on", "~이 떨어져 가는", "We're running low on chips.", "감자튀김이 떨어져 가요."),
        ln("from the freezer", "냉동고에서", "Grab a box of chips from the freezer.", "냉동고에서 감자튀김 한 박스 가져와요."),
        ln("first in, first out", "먼저 들어온 것부터", "Remember, first in, first out.", "먼저 들어온 것부터 쓰는 거 기억해요.", "FIFO는 위생 점검 기본이에요."),
        ln("check the use-by date", "유통기한을 확인하다", "Always check the use-by date.", "항상 유통기한 확인해요."),
        ln("put it on the order list", "주문 목록에 올리다", "I'll put it on the order list.", "주문 목록에 올려 둘게요."),
      ],
      [
        t("Hey, how are we going for chips?", "감자튀김 얼마나 남았어요?", "감자튀김이 떨어져 간다고 하세요", "We're running low on chips.", ["running low on", "running out of"]),
        t("Grab a box from the freezer, then.", "그럼 냉동고에서 한 박스 가져와요.", "알겠다고, 오래된 것부터 쓰겠다고 하세요", "Will do. First in, first out, right?", ["first in, first out", "older ones first"]),
        t("Exactly. Is that the last box?", "맞아요. 그게 마지막 박스예요?", "네, 주문 목록에 올리겠다고 하세요", "Yes. I'll put it on the order list.", ["order list", "order more"]),
      ],
      o("Good thinking.", "잘 생각했어요.")),

    // ───────── STEP 3 ─────────
    L("14", 3, "🌶️", "맵기 단계 고르기", "맵기 안내·소스 따로 주기", "손님",
      [
        ln("mild, medium or hot", "순한 맛, 중간 맛, 매운맛", "Mild, medium or hot?", "순한 맛, 중간 맛, 매운맛 중에 뭘로 드려요?"),
        ln("pretty spicy", "꽤 매운", "Our hot is pretty spicy.", "저희 매운맛은 꽤 매워요."),
        ln("sauce on the side", "소스 따로", "I can put the sauce on the side.", "소스는 따로 드릴 수 있어요."),
        ln("How hot is", "~이 얼마나 매워요", "How hot is the hot one?", "매운맛은 얼마나 매워요?"),
        ln("start with medium", "중간 맛부터 시작하다", "Maybe start with medium.", "중간 맛부터 드셔 보세요."),
      ],
      [
        t("I'll get the spicy wings.", "매운 윙 주세요.", "순한 맛, 중간 맛, 매운맛 중 고르라고 하세요", "Sure. Mild, medium or hot?", ["mild, medium or hot", "how spicy"]),
        t("How hot is the hot one?", "매운맛은 얼마나 매워요?", "꽤 매우니 중간 맛부터 드셔 보라고 하세요", "It's pretty spicy. Maybe start with medium.", ["start with medium", "pretty spicy"]),
        t("Okay, but can I try the hot sauce too?", "알겠어요, 근데 매운 소스도 맛볼 수 있어요?", "매운 소스를 따로 드리겠다고 하세요", "Sure, I'll put the hot sauce on the side.", ["on the side", "separately"]),
      ],
      o("Perfect, thanks.", "완벽해요, 고마워요.")),

    L("15", 3, "🧂", "치킨 소금 빼 달라는 손님", "칩스 시즈닝 확인·소금 빼기", "손님",
      [
        ln("chicken salt", "치킨 소금", "Chicken salt on your chips?", "감자튀김에 치킨 소금 뿌려 드려요?", "치킨 소금은 호주 칩스 가게의 기본 시즈닝이에요."),
        ln("no salt", "소금 빼고", "Can I get my chips with no salt?", "감자튀김 소금 빼고 주실래요?"),
        ln("plain salt", "그냥 소금", "Plain salt or chicken salt?", "그냥 소금 드려요, 치킨 소금 드려요?"),
        ln("cook a fresh batch", "새로 튀기다", "I'll cook a fresh batch for you.", "새로 튀겨 드릴게요."),
        ln("a couple of minutes", "몇 분", "It'll take a couple of minutes.", "몇 분 걸려요."),
      ],
      [
        t("Large chips, please.", "감자튀김 라지요.", "치킨 소금 뿌려 드릴지 물어보세요", "Sure. Chicken salt on that?", ["chicken salt", "any salt"]),
        t("Actually, no salt at all, please.", "사실 소금 아예 빼 주세요.", "새로 튀겨 드리겠다고 하세요", "No worries, I'll cook a fresh batch.", ["fresh batch", "cook new ones"]),
        t("Is that going to take long?", "오래 걸려요?", "몇 분 걸린다고 하세요", "Just a couple of minutes.", ["a couple of minutes", "two minutes", "few minutes"]),
      ],
      o("All good, I'll wait.", "괜찮아요, 기다릴게요.")),

    L("16", 3, "⚠️", "알레르기 문의", "재료 확인·같은 튀김기 사용 알리기", "손님",
      [
        ln("Does it have", "~이 들어가요", "Does it have any peanuts in it?", "땅콩 들어가요?"),
        ln("the allergen chart", "알레르기 성분표", "Let me check the allergen chart.", "알레르기 성분표 확인해 볼게요."),
        ln("contains", "~이 들어 있다", "The batter contains wheat and egg.", "튀김옷에 밀이랑 달걀이 들어 있어요."),
        ln("the same fryer", "같은 튀김기", "Everything's cooked in the same fryer.", "전부 같은 튀김기에서 튀겨요."),
        ln("traces of", "미량의", "It may have traces of gluten.", "글루텐이 미량 들어 있을 수 있어요."),
      ],
      [
        t("Does the chicken have gluten in it?", "치킨에 글루텐 들어가요?", "알레르기 성분표를 확인해 보겠다고 하세요", "Let me check the allergen chart.", ["allergen chart", "let me check"]),
        t("Okay, thanks.", "네, 고마워요.", "튀김옷에 밀이 들어 있다고 하세요", "Sorry, the batter contains wheat.", ["contains wheat", "has wheat", "contains"]),
        t("What about the chips?", "감자튀김은요?", "같은 튀김기에서 튀기니 미량 있을 수 있다고 하세요", "They're cooked in the same fryer, so maybe traces.", ["same fryer", "traces"]),
      ],
      o("Ah okay, I'll skip it then. Thanks for checking.", "아 그렇군요, 그럼 안 먹을게요. 확인해 줘서 고마워요.")),

    L("17", 3, "➕", "소스 추가 요금", "소스 추가 금액 안내·서비스 소스 개수 말하기", "손님",
      [
        ln("one free sauce", "무료 소스 하나", "You get one free sauce with that.", "그거 시키시면 소스 하나는 무료예요."),
        ln("50 cents each", "하나에 50센트", "Extra sauces are 50 cents each.", "소스 추가는 하나에 50센트예요."),
        ln("a couple of extra sauces", "추가 소스 두어 개", "Can I get a couple of extra sauces?", "소스 두어 개 더 주실 수 있어요?"),
        ln("add it on", "추가로 계산하다", "I'll just add it on to your order.", "주문에 추가로 넣어 드릴게요."),
        ln("Which ones", "어떤 걸로", "Sure, which ones would you like?", "네, 어떤 걸로 드릴까요?"),
      ],
      [
        t("Can I get three sauces?", "소스 세 개 주세요.", "하나는 무료고 추가는 하나에 50센트라고 하세요", "One's free, then extra sauces are 50 cents each.", ["50 cents each", "50 cents"]),
        t("That's fine. Add two extra.", "괜찮아요. 두 개 추가해 주세요.", "어떤 소스로 할지 물어보세요", "Sure, which ones would you like?", ["which ones", "which sauces"]),
        t("Aioli, BBQ and sweet chilli.", "아이올리, 바비큐, 스위트 칠리요.", "주문에 추가로 넣겠다고 하세요", "Got it, I'll add it on to your order.", ["add it on", "add them on"]),
      ],
      o("Thanks, mate.", "고마워요.")),

    L("18", 3, "🍱", "반반 치킨 주문", "반반 맛 고르기·추가 요금 안내하기", "손님",
      [
        ln("half and half", "반반", "Can I get half and half?", "반반으로 해 주실 수 있어요?"),
        ln("Which two flavours", "어떤 두 가지 맛", "Which two flavours would you like?", "어떤 두 가지 맛으로 드릴까요?"),
        ln("$2 extra", "2달러 추가", "Half and half is $2 extra.", "반반은 2달러 추가예요."),
        ln("fried and soy garlic", "프라이드랑 간장 마늘", "Half fried and soy garlic, please.", "프라이드 반, 간장 마늘 반이요."),
        ln("in separate boxes", "따로 박스에", "Do you want them in separate boxes?", "박스 따로 담아 드릴까요?"),
      ],
      [
        t("Can I do half and half?", "반반 돼요?", "되는데 2달러 추가라고 하세요", "Yes, half and half is $2 extra.", ["$2 extra", "2 dollars extra", "two dollars"]),
        t("Sure, that's fine.", "네, 괜찮아요.", "어떤 두 가지 맛으로 할지 물어보세요", "Which two flavours would you like?", ["which two flavours", "which flavours"]),
        t("Fried and soy garlic.", "프라이드랑 간장 마늘이요.", "박스를 따로 담아 드릴지 물어보세요", "Do you want them in separate boxes?", ["separate boxes", "separate"]),
      ],
      o("Yeah, that'd be great.", "네, 그게 좋겠어요.")),

    L("19", 3, "🎉", "파티용 대량 주문", "수량 확인·픽업 시간 정하기·선결제 받기", "손님 (전화)",
      [
        ln("a big order", "대량 주문", "I'd like to put in a big order for Saturday.", "토요일에 대량 주문 넣고 싶어요."),
        ln("ready by six", "6시까지 준비된", "Can you have it ready by six?", "6시까지 준비해 줄 수 있어요?"),
        ln("40 pieces", "40조각", "So that's 40 pieces of fried chicken.", "그럼 프라이드치킨 40조각이네요."),
        ln("pay upfront", "미리 결제하다", "For big orders, we ask you to pay upfront.", "대량 주문은 미리 결제해 주셔야 해요."),
        ln("read that back", "다시 읽어 드리다", "Let me read that back to you.", "주문 다시 읽어 드릴게요."),
      ],
      [
        t("Hi, I want 40 pieces of chicken for a party.", "파티용으로 치킨 40조각 주문하려고요.", "몇 시까지 필요한지 물어보세요", "No problem. What time do you need it by?", ["need it by", "what time"]),
        t("Can you have it ready by six?", "6시까지 돼요?", "6시 가능하다고 하고 주문을 다시 읽어 드리겠다고 하세요", "Yes, six is fine. Let me read that back.", ["read that back", "six is fine"]),
        t("Sounds good. Do I pay now?", "좋아요. 지금 결제해요?", "대량 주문은 미리 결제해야 한다고 하세요", "Yes, for big orders we ask you to pay upfront.", ["pay upfront", "pay now"]),
      ],
      o("No worries, I'll pay over the phone.", "알겠어요, 전화로 결제할게요.")),

    // ───────── STEP 4 ─────────
    L("4", 4, "🛵", "기다리는 배달 기사", "늦어진다고 말하고 주문 확인하기", "배달 기사",
      [
        ln("Order for Kim", "김 님 주문", "Hi, I'm here for the order for Kim.", "안녕하세요, 김 님 주문 가지러 왔어요."),
        ln("two more minutes", "2분만 더", "Sorry, it'll be two more minutes.", "죄송해요, 2분만 더 걸려요."),
        ln("Let me check", "확인해 볼게요", "Let me check the docket.", "주문서 확인해 볼게요."),
        ln("extra sauce", "소스 추가", "Yep, that's the one with extra sauce.", "네, 소스 추가한 거 맞아요."),
        ln("No dramas", "괜찮아요", "No dramas, I'll wait here.", "괜찮아요, 여기서 기다릴게요.", "No dramas는 호주식 '괜찮아요'예요."),
      ],
      [
        t("Hi, I'm the delivery driver. Order for Kim?", "배달 기사예요. 김 님 주문이요?", "2분만 더 기다려 달라고 하세요", "Sorry, it'll be two more minutes.", ["two more minutes", "2 more minutes"]),
        t("No dramas. Is it the one with extra sauce?", "괜찮아요. 소스 추가한 거 맞죠?", "확인해 보겠다고 하세요", "Let me check.", ["let me check"]),
        t("Cheers.", "고마워요.", "여기 있다고, 소스 추가 맞다고 하세요", "Here you go. Yes, extra sauce.", ["here you go", "extra sauce"]),
      ],
      o("Thanks, see ya.", "고마워요, 또 봐요.")),

    L("20", 4, "❓", "빠진 메뉴가 있다는 손님", "주문 확인·사과·바로 챙겨 드리기", "손님",
      [
        ln("something's missing", "뭐가 빠졌어요", "Sorry, something's missing from my bag.", "죄송한데 봉투에 뭐가 빠졌어요."),
        ln("Do you have your receipt", "영수증 있으세요", "Do you have your receipt on you?", "영수증 가지고 계세요?"),
        ln("I'm really sorry about that", "그 점 정말 죄송해요", "I'm really sorry about that, mate.", "그 점 정말 죄송해요."),
        ln("sort that out", "해결하다", "I'll sort that out for you now.", "지금 바로 해결해 드릴게요."),
        ln("throw in a free drink", "음료 하나 서비스로 드리다", "I'll throw in a free drink for the trouble.", "번거롭게 해 드려서 음료 하나 서비스로 드릴게요."),
      ],
      [
        t("Hey, my chips aren't in the bag.", "저기요, 감자튀김이 봉투에 없어요.", "정말 죄송하다고 하고 영수증 있으신지 물어보세요", "I'm really sorry. Do you have your receipt?", ["receipt", "really sorry"]),
        t("Yeah, here it is.", "네, 여기요.", "지금 바로 해결해 드리겠다고 하세요", "Thanks. I'll sort that out for you now.", ["sort that out", "sort it out", "fix that"]),
        t("Okay, thanks.", "네, 고마워요.", "번거롭게 해서 음료 하나 서비스로 드리겠다고 하세요", "And I'll throw in a free drink for the trouble.", ["free drink", "on the house"]),
      ],
      o("Oh, cheers! That's nice.", "오, 고마워요! 좋네요.")),

    L("21", 4, "🔁", "다른 손님 주문을 줬을 때", "실수 인정·주문 바꿔 주기·다시 확인하기", "손님",
      [
        ln("this isn't mine", "이거 제 거 아니에요", "Sorry, I think this isn't mine.", "죄송한데 이거 제 거 아닌 것 같아요."),
        ln("mixed up the orders", "주문을 헷갈렸다", "Sorry, I mixed up the orders.", "죄송해요, 제가 주문을 헷갈렸어요."),
        ln("swap it over", "바꿔 드리다", "Let me swap it over for you.", "바꿔 드릴게요."),
        ln("What was your number", "번호가 몇 번이었어요", "What was your number again?", "번호가 몇 번이셨죠?"),
        ln("made fresh", "새로 만든", "Yours is being made fresh now.", "손님 거 지금 새로 만들고 있어요."),
      ],
      [
        t("Excuse me, I think this isn't mine. I got a burger.", "저기요, 이거 제 거 아닌 것 같아요. 저 버거 시켰어요.", "죄송하다고, 주문을 헷갈렸다고 하세요", "Sorry, I mixed up the orders.", ["mixed up the orders", "mixed up", "my mistake"]),
        t("No worries. Where's mine?", "괜찮아요. 제 건 어디 있어요?", "번호가 몇 번이었는지 물어보세요", "What was your number again?", ["what was your number", "your number"]),
        t("It's 28.", "28번이요.", "지금 새로 만들고 있다고 하세요", "Thanks. Yours is being made fresh now.", ["made fresh", "making it now"]),
      ],
      o("All good, no rush.", "괜찮아요, 천천히 해요.")),

    L("22", 4, "🔥", "튀김기 화상 조심", "기름 튈 때 대처·응급 처치·사고 보고하기", "매니저 Tom",
      [
        ln("the oil's spitting", "기름이 튀어요", "Careful, the oil's spitting!", "조심해요, 기름 튀어요!"),
        ln("burnt my hand", "손을 데었다", "Ouch, I just burnt my hand.", "아, 방금 손 데었어요."),
        ln("under cold water", "찬물에", "Put it under cold water for 20 minutes.", "찬물에 20분 대고 있어요.", "화상은 찬물 20분이 호주 응급처치 기본이에요."),
        ln("the first aid kit", "구급상자", "Where's the first aid kit?", "구급상자 어디 있어요?"),
        ln("fill out an incident report", "사고 보고서를 쓰다", "We need to fill out an incident report.", "사고 보고서 써야 해요."),
      ],
      [
        t("Whoa, what happened?", "어, 무슨 일이에요?", "기름이 튀어서 손을 데었다고 하세요", "The oil spat and I burnt my hand.", ["burnt my hand", "burned my hand"]),
        t("Put it under cold water, quick!", "빨리 찬물에 대요!", "알겠다고 하고 구급상자가 어디 있는지 물어보세요", "Okay. Where's the first aid kit?", ["first aid kit", "first aid"]),
        t("Under the counter. Are you okay?", "카운터 밑에요. 괜찮아요?", "괜찮다고 하고 사고 보고서를 써야 하는지 물어보세요", "I'm okay. Do I need to fill out an incident report?", ["incident report", "report"]),
      ],
      o("Yep, we'll do it together after.", "네, 이따 같이 써요.")),

    L("23", 4, "🧹", "바닥이 미끄러울 때", "기름 흘린 곳 알리기·표지판 세우기·닦기", "동료 Jay",
      [
        ln("spilled some oil", "기름을 좀 흘렸다", "I just spilled some oil near the fryer.", "튀김기 옆에 기름 좀 흘렸어요."),
        ln("wet floor sign", "바닥 젖음 표지판", "Can you put out the wet floor sign?", "바닥 젖음 표지판 좀 세워 줄래요?"),
        ln("degreaser", "기름때 제거제", "Use the degreaser, not just water.", "물만 말고 기름때 제거제 써요."),
        ln("Mind your step", "발밑 조심해요", "Mind your step, it's slippery here.", "발밑 조심해요, 여기 미끄러워요."),
        ln("mop it up", "걸레로 닦아 내다", "I'll mop it up straight away.", "바로 걸레로 닦을게요."),
      ],
      [
        t("Hey, why's the floor so shiny there?", "어, 거기 바닥이 왜 반짝거려요?", "튀김기 옆에 기름을 좀 흘렸다고 하세요", "Sorry, I spilled some oil near the fryer.", ["spilled some oil", "spilt some oil"]),
        t("Okay, careful. What do you need?", "알겠어요, 조심해요. 뭐 필요해요?", "바닥 젖음 표지판을 세워 달라고 하세요", "Can you put out the wet floor sign?", ["wet floor sign", "sign"]),
        t("Done. Use the degreaser, yeah?", "세웠어요. 기름때 제거제 써요, 알죠?", "알겠다고, 바로 닦겠다고 하세요", "Yep, I'll mop it up straight away.", ["mop it up", "clean it up"]),
      ],
      o("Good. Nobody needs a fall tonight.", "좋아요. 오늘 밤 넘어지는 사람 없어야죠.")),

    L("24", 4, "🪙", "거스름돈을 잘못 줬을 때", "손님 말 듣기·금액 다시 세기·차액 돌려주기", "손님",
      [
        ln("short-changed", "거스름돈을 덜 받은", "I think I got short-changed.", "거스름돈 덜 받은 것 같아요."),
        ln("count it again", "다시 세다", "Let me count it again.", "다시 세 볼게요."),
        ln("You're right", "맞아요", "You're right, I'm so sorry.", "맞네요, 정말 죄송해요."),
        ln("owe you", "~를 드려야 한다", "I owe you another five dollars.", "5달러 더 드려야 하네요."),
        ln("a fifty", "50달러 지폐", "I gave you a fifty, not a twenty.", "20달러 말고 50달러 드렸어요."),
      ],
      [
        t("Sorry, I gave you a fifty, not a twenty.", "죄송한데 20달러 말고 50달러 드렸어요.", "다시 세 보겠다고 하세요", "Oh, let me count it again.", ["count it again", "check again"]),
        t("I should get $30 more.", "30달러 더 받아야 해요.", "맞다고, 정말 죄송하다고 하세요", "You're right, I'm so sorry.", ["you're right", "so sorry"]),
        t("That's okay.", "괜찮아요.", "30달러 더 드려야 한다며 건네세요", "I owe you $30. Here you go.", ["owe you", "here you go"]),
      ],
      o("Thanks for sorting it.", "해결해 줘서 고마워요.")),

    // ───────── STEP 5 ─────────
    L("25", 5, "🏃", "금요일 저녁 러시", "줄 선 손님 응대·대기 시간 안내·순서대로 부르기", "손님",
      [
        ln("Next in line", "다음 분", "Next in line, please!", "다음 분 오세요!"),
        ln("Sorry about the wait", "기다리게 해서 죄송해요", "Sorry about the wait, it's a bit crazy tonight.", "기다리게 해서 죄송해요, 오늘 밤 좀 정신없어서요."),
        ln("a 20-minute wait on", "~은 20분 대기", "There's a 20-minute wait on chicken right now.", "지금 치킨은 20분 기다리셔야 해요."),
        ln("still keen", "그래도 원하시는", "Are you still keen?", "그래도 드시겠어요?", "keen은 호주에서 '하고 싶은'이란 뜻으로 자주 써요."),
        ln("take a seat", "앉아 계세요", "Take a seat and we'll call you.", "앉아 계시면 불러 드릴게요."),
      ],
      [
        t("Hi! Finally. Can I get a chicken box?", "드디어! 치킨 박스 주세요.", "기다리게 해서 죄송하다고 하세요", "Sorry about the wait! Sure thing.", ["sorry about the wait", "sorry for the wait"]),
        t("How long will it be?", "얼마나 걸려요?", "치킨은 지금 20분 기다려야 하는데 괜찮으신지 물어보세요", "It's a 20-minute wait on chicken. Still keen?", ["20-minute wait", "still keen", "twenty minutes"]),
        t("Yeah, I'll wait.", "네, 기다릴게요.", "앉아 계시면 불러 드리겠다고 하세요", "Great. Take a seat and we'll call you.", ["take a seat", "we'll call you"]),
      ],
      o("No worries.", "알겠어요.")),

    L("26", 5, "📞", "전화·앱·카운터 동시 주문", "전화 대기시키기·동료에게 카운터 부탁하기", "동료 Jay",
      [
        ln("Can you hold for a sec", "잠깐 기다려 주시겠어요", "Thanks for calling. Can you hold for a sec?", "전화 주셔서 감사해요. 잠깐 기다려 주시겠어요?"),
        ln("jump on the counter", "카운터를 맡다", "Can you jump on the counter?", "카운터 좀 맡아 줄래요?"),
        ln("I'm on the phone", "통화 중이에요", "I'm on the phone with an order.", "주문 전화 받는 중이에요."),
        ln("Two Uber orders came in", "우버 주문 두 개 들어왔어요", "Two Uber orders came in at once.", "우버 주문 두 개가 한꺼번에 들어왔어요."),
        ln("I've got the tablet", "태블릿은 제가 볼게요", "Don't worry, I've got the tablet.", "걱정 마요, 태블릿은 제가 볼게요."),
      ],
      [
        t("Phone's ringing and there's a line!", "전화 울리고 줄도 있어요!", "전화를 받아서 잠깐 기다려 달라고 하세요", "Hi, thanks for calling. Can you hold for a sec?", ["hold for a sec", "hold on a sec", "one moment"]),
        t("What do you want me to do?", "저 뭐 할까요?", "통화 중이니 카운터를 맡아 달라고 하세요", "I'm on the phone. Can you jump on the counter?", ["jump on the counter", "take the counter"]),
        t("Sure. Oh, two Uber orders came in too.", "네. 아, 우버 주문도 두 개 들어왔어요.", "태블릿은 제가 보겠다고 하세요", "No worries, I've got the tablet.", ["I've got the tablet", "I'll do the tablet"]),
      ],
      o("Teamwork, mate.", "팀워크죠.")),

    L("27", 5, "⏱️", "치킨이 다 떨어졌을 때", "품절 알리기·새로 튀기는 시간 안내·대체 메뉴 권하기", "손님",
      [
        ln("just sold out of", "방금 ~이 다 팔렸다", "Sorry, we just sold out of wings.", "죄송해요, 윙이 방금 다 팔렸어요."),
        ln("a fresh batch", "새로 튀긴 것", "A fresh batch will be ready in 15 minutes.", "새로 튀긴 게 15분 뒤에 나와요."),
        ln("in the meantime", "그동안", "In the meantime, can I get you a drink?", "그동안 음료 드릴까요?"),
        ln("ready to go now", "지금 바로 되는", "The tenders are ready to go now.", "텐더는 지금 바로 돼요."),
        ln("swap to", "~로 바꾸다", "Do you want to swap to tenders?", "텐더로 바꾸시겠어요?"),
      ],
      [
        t("Can I get ten wings?", "윙 10개 주세요.", "죄송하지만 윙이 방금 다 팔렸다고 하세요", "Sorry, we just sold out of wings.", ["sold out of", "sold out", "ran out of"]),
        t("Oh no. Are you making more?", "아이고. 더 만들어요?", "새로 튀긴 게 15분 뒤 나온다고 하세요", "Yep, a fresh batch will be ready in 15 minutes.", ["fresh batch", "15 minutes"]),
        t("Hmm, I'm in a bit of a hurry.", "음, 좀 급한데요.", "텐더는 지금 바로 되니 바꾸시겠냐고 물어보세요", "The tenders are ready now. Want to swap to those?", ["swap to", "ready now", "tenders instead"]),
      ],
      o("Yeah, tenders are fine.", "네, 텐더도 괜찮아요.")),

    L("28", 5, "🤝", "교대하며 인수인계", "남은 주문·재고·특이사항 전달하기", "동료 Jay",
      [
        ln("Here's the handover", "인수인계할게요", "Okay, here's the handover.", "자, 인수인계할게요."),
        ln("two orders pending", "대기 중인 주문 두 개", "There are two orders pending on Uber.", "우버에 대기 중인 주문이 두 개 있어요."),
        ln("waiting on a refund", "환불을 기다리는", "One customer is waiting on a refund call.", "손님 한 분이 환불 전화 기다리고 있어요."),
        ln("the oil needs changing", "기름을 갈아야 하는", "Fryer two, the oil needs changing.", "2번 튀김기 기름 갈아야 해요."),
        ln("in the notebook", "노트에", "I wrote it all in the notebook.", "노트에 다 적어 뒀어요."),
      ],
      [
        t("Hey, I'm here. What's happening?", "왔어요. 상황 어때요?", "우버에 대기 중인 주문이 두 개 있다고 하세요", "Hey! There are two orders pending on Uber.", ["two orders pending", "two orders", "pending"]),
        t("Okay. Anything else?", "알겠어요. 다른 건요?", "2번 튀김기 기름을 갈아야 한다고 하세요", "Fryer two, the oil needs changing.", ["oil needs changing", "change the oil"]),
        t("Got it. Did you write it down?", "알겠어요. 적어 뒀어요?", "노트에 다 적어 뒀다고 하세요", "Yep, it's all in the notebook.", ["in the notebook", "wrote it down"]),
      ],
      o("Sweet. Have a good night.", "좋아요. 좋은 밤 보내요.")),

    L("29", 5, "🌃", "마감 직전 손님", "튀김기 끈 것 알리기·가능한 메뉴 권하기·문 닫기", "손님",
      [
        ln("about to close", "곧 문 닫는", "Sorry, we're about to close.", "죄송해요, 곧 문 닫아요."),
        ln("turned off the fryers", "튀김기를 껐다", "We've already turned off the fryers.", "튀김기는 벌써 껐어요."),
        ln("all we've got left", "남은 게 다예요", "Cold drinks are all we've got left.", "남은 건 시원한 음료뿐이에요."),
        ln("open till ten", "10시까지 여는", "We're open till ten tomorrow.", "내일은 10시까지 열어요."),
        ln("Come back tomorrow", "내일 다시 오세요", "Come back tomorrow and I'll look after you.", "내일 다시 오시면 잘 챙겨 드릴게요."),
      ],
      [
        t("Hey, are you still open? Can I get chips?", "아직 해요? 감자튀김 돼요?", "죄송하지만 곧 닫고 튀김기를 껐다고 하세요", "Sorry, we've already turned off the fryers.", ["turned off the fryers", "fryers are off"]),
        t("Ah, damn. Anything else?", "아, 이런. 다른 건요?", "남은 건 시원한 음료뿐이라고 하세요", "Just cold drinks. That's all we've got left.", ["all we've got left", "just drinks"]),
        t("Nah, it's okay. What time do you open tomorrow?", "아니에요. 내일은 몇 시에 열어요?", "11시에 열고 10시까지 한다고 하세요", "We open at 11 and we're open till ten.", ["open till ten", "open at 11"]),
      ],
      o("Cool, I'll come back tomorrow.", "좋아요, 내일 다시 올게요.")),

    L("30", 5, "📅", "로스터 시간 바꾸기", "근무 바꿔 달라고 부탁·대신할 사람 정하기", "매니저 Tom",
      [
        ln("this week's roster", "이번 주 로스터", "Have you seen this week's roster?", "이번 주 로스터 봤어요?"),
        ln("I can't make", "~에 못 나와요", "Sorry, I can't make Thursday night.", "죄송한데 목요일 밤에 못 나와요."),
        ln("swap with", "~와 바꾸다", "Jay said he can swap with me.", "제이가 저랑 바꿔 줄 수 있대요."),
        ln("pick up an extra shift", "추가 근무를 하다", "I can pick up an extra shift on Sunday.", "일요일에 추가 근무할 수 있어요."),
        ln("in the group chat", "단톡방에", "Just let me know in the group chat.", "단톡방에 알려 줘요."),
      ],
      [
        t("Hey, you wanted to chat?", "얘기하고 싶다고 했죠?", "목요일 밤에 못 나온다고 하세요", "Yeah, sorry. I can't make Thursday night.", ["I can't make", "can't work", "can't do"]),
        t("Okay. Do you have someone to cover?", "알겠어요. 대신할 사람 있어요?", "제이가 바꿔 줄 수 있다고 했다고 하세요", "Jay said he can swap with me.", ["swap with", "cover for me"]),
        t("Great. Thanks for sorting it out.", "좋아요. 알아서 해결해 줘서 고마워요.", "일요일에 추가 근무도 할 수 있다고 하세요", "No worries. I can pick up an extra shift on Sunday.", ["extra shift", "pick up a shift"]),
      ],
      o("Even better. I'll update it.", "더 좋네요. 수정해 둘게요.")),
  ],
};

export default curriculum;
