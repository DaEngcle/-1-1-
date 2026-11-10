import { L, ln, o, t, type JobCurriculum } from "./kit";

const curriculum: JobCurriculum = {
  steps: ["첫날 홀 기본 응대", "매일 도는 테이블 루틴", "손님 요청 맞추기", "실수·불만·안전 대처", "피크타임·팀 조율"],
  lessons: [
    // ───────── STEP 1 ─────────
    L("1", 1, "🪑", "자리 안내하기", "인원 확인·자리 안내·물 드리기", "손님",
      [
        ln("table for two", "두 분 자리", "Hi there, table for two?", "안녕하세요, 두 분 자리 찾으세요?"),
        ln("Follow me", "따라오세요", "Follow me, I'll show you to your table.", "따라오세요, 자리로 안내해 드릴게요."),
        ln("inside or outside", "안쪽 아니면 바깥쪽", "Would you like to sit inside or outside?", "안쪽에 앉으실래요, 바깥쪽에 앉으실래요?"),
        ln("Here are your menus", "메뉴 여기 있습니다", "Here are your menus. I'll be back in a minute.", "메뉴 여기 있습니다. 금방 다시 올게요."),
        ln("tap or sparkling", "그냥 물 아니면 탄산수", "Would you like tap or sparkling water?", "그냥 물 드릴까요, 탄산수 드릴까요?", "호주 식당은 tap water가 무료예요."),
      ],
      [
        t("Hi, table for two, please.", "두 명 자리 있어요?", "있다고 하고 따라오시라고 하세요", "Sure, table for two. Follow me, please.", ["follow me", "this way"]),
        t("Can we sit outside?", "밖에 앉아도 돼요?", "그럼요 하고 메뉴를 드리세요", "Of course. Here are your menus.", ["here are your menus", "here's the menu", "your menus"]),
        t("Thanks. Could we get some water?", "물 좀 주실래요?", "바로 가져다드리겠다고 하세요", "Sure, I'll bring some water right away.", ["bring some water", "get you some water", "right away"]),
      ],
      o("Lovely, thank you.", "좋아요, 고마워요.")),

    L("2", 1, "📝", "주문 받기", "주문 받고 알레르기 확인하기", "손님",
      [
        ln("ready to order", "주문하실 준비가 된", "Are you ready to order, or do you need a few more minutes?", "주문하시겠어요, 아니면 좀 더 보실래요?"),
        ln("I'll have the", "~로 할게요", "I'll have the chicken burger, thanks.", "치킨 버거로 할게요, 고마워요."),
        ln("Any allergies", "알레르기 있으세요", "Any allergies I should know about?", "제가 알아야 할 알레르기 있으세요?"),
        ln("check with the kitchen", "주방에 확인하다", "I'll just check with the kitchen for you.", "주방에 한번 확인해 드릴게요."),
        ln("Anything else", "더 필요한 거", "Anything else for you today?", "더 필요한 거 있으세요?"),
      ],
      [
        t("I think we're ready.", "주문할게요.", "주문하시겠어요? 하고 물어보세요", "Great. Are you ready to order?", ["ready to order", "what can I get you"]),
        t("I'll have the chicken burger.", "치킨 버거 주세요.", "알레르기가 있는지 물어보세요", "Sure. Any allergies I should know about?", ["any allergies", "allergic to anything"]),
        t("I'm allergic to nuts. Are there nuts in the sauce?", "견과류 알레르기가 있어요. 소스에 들어가요?", "주방에 확인해 보겠다고 하세요", "Let me check with the kitchen.", ["check with the kitchen", "ask the kitchen", "let me check"]),
      ],
      o("Thanks, I appreciate that.", "고마워요.")),

    L("6", 1, "📖", "예약 손님 맞이하기", "예약 이름 확인·인원 확인·자리 안내하기", "손님",
      [
        ln("Do you have a booking", "예약하셨어요", "Hi, welcome in! Do you have a booking?", "안녕하세요, 어서 오세요! 예약하셨어요?", "호주에선 reservation보다 booking을 많이 써요."),
        ln("What name is it under", "어느 분 이름으로 하셨어요", "Lovely. What name is it under?", "좋아요. 어느 분 이름으로 하셨어요?"),
        ln("booking for four", "네 분 예약", "We've got a booking for four under Chen.", "첸 이름으로 네 분 예약했어요."),
        ln("your table's ready", "자리 준비됐어요", "Perfect, your table's ready. Come with me.", "좋아요, 자리 준비됐어요. 저랑 같이 가세요."),
        ln("rest of your group", "나머지 일행", "Will the rest of your group be here soon?", "나머지 일행분들은 곧 오세요?"),
      ],
      [
        t("Hi, we've got a booking at seven.", "안녕하세요, 7시에 예약했어요.", "어느 분 이름으로 예약하셨는지 물어보세요", "Great. What name is it under?", ["what name is it under", "what's the name", "under what name"]),
        t("It's under Chen, for four people.", "첸이요, 네 명이에요.", "네 분 예약 확인됐다고 하세요", "Yep, I've got a booking for four under Chen.", ["booking for four", "table for four", "got you here"]),
        t("Two of us are still parking.", "두 명은 아직 주차 중이에요.", "괜찮다고, 자리 준비됐으니 따라오시라고 하세요", "No worries, your table's ready. Follow me.", ["your table's ready", "table is ready", "follow me"]),
      ],
      o("Great, thanks so much.", "좋아요, 정말 고마워요.")),

    L("7", 1, "🥤", "음료 주문 먼저 받기", "음료 먼저 묻기·탭 맥주 안내·음료 가져다드리기", "손님",
      [
        ln("start you with some drinks", "음료부터 드리다", "Can I start you with some drinks?", "음료부터 먼저 드릴까요?"),
        ln("on tap", "생맥주로", "We've got three beers on tap tonight.", "오늘 생맥주는 세 가지 있어요."),
        ln("a schooner", "스쿠너 한 잔", "Can I get a schooner of the pale ale?", "페일 에일 스쿠너 한 잔 주실래요?", "스쿠너는 425ml 잔이에요(NSW 기준)."),
        ln("glass or bottle", "잔으로 아니면 병으로", "Would you like a glass or bottle of the red?", "레드 와인 잔으로 드릴까요, 병으로 드릴까요?"),
        ln("be right back with", "금방 가져올게요", "I'll be right back with your drinks.", "음료 금방 가져올게요."),
      ],
      [
        t("Hi, we're still looking at the food menu.", "아직 음식 메뉴 보고 있어요.", "그럼 음료부터 드릴지 물어보세요", "No rush. Can I start you with some drinks?", ["start you with some drinks", "get you some drinks", "anything to drink"]),
        t("What beers do you have?", "맥주는 뭐 있어요?", "생맥주가 세 가지 있다고 하세요", "We've got three beers on tap.", ["on tap", "three beers"]),
        t("I'll get a schooner of the lager.", "라거 스쿠너 한 잔 주세요.", "알겠다고, 음료 금방 가져오겠다고 하세요", "Sure, I'll be right back with your drinks.", ["be right back with", "right back", "bring it over"]),
      ],
      o("Cheers, mate.", "고마워요.")),

    L("8", 1, "⭐", "오늘의 스페셜 소개", "스페셜 메뉴 소개·가격 안내·추천하기", "손님",
      [
        ln("specials tonight", "오늘 밤 스페셜", "We've got two specials tonight.", "오늘 밤엔 스페셜 메뉴가 두 가지 있어요."),
        ln("comes with", "~이 같이 나와요", "The barramundi comes with chips and salad.", "바라문디는 감자튀김이랑 샐러드가 같이 나와요.", "바라문디는 호주 대표 생선이에요."),
        ln("market price", "시가", "The lobster is market price today.", "랍스터는 오늘 시가예요."),
        ln("really popular", "인기가 많은", "The lamb shoulder is really popular.", "양 어깨살 요리가 인기가 정말 많아요."),
        ln("What do you recommend", "뭘 추천하세요", "What do you recommend for a first-timer?", "처음 온 사람한테 뭘 추천하세요?"),
      ],
      [
        t("Are there any specials today?", "오늘 스페셜 있어요?", "오늘 밤 스페셜이 두 가지 있다고 하세요", "Yes, we've got two specials tonight.", ["specials tonight", "two specials"]),
        t("What's the fish one?", "생선 요리는 뭐예요?", "바라문디에 감자튀김과 샐러드가 같이 나온다고 하세요", "It's barramundi. It comes with chips and salad.", ["comes with", "served with"]),
        t("Hmm, what do you recommend?", "음, 뭘 추천하세요?", "양고기가 인기가 정말 많다고 하세요", "The lamb is really popular.", ["really popular", "very popular", "a favourite"]),
      ],
      o("Okay, I'll go with the lamb then.", "좋아요, 그럼 양고기로 할게요.")),

    L("9", 1, "📋", "만석일 때 대기 안내", "대기 시간 알리기·이름과 번호 받기·바에서 기다리기 권하기", "손님",
      [
        ln("fully booked", "예약이 꽉 찬", "Sorry, we're fully booked right now.", "죄송해요, 지금 예약이 꽉 찼어요."),
        ln("about a 20-minute wait", "20분 정도 대기", "There's about a 20-minute wait for a table.", "자리 나려면 20분 정도 기다리셔야 해요."),
        ln("put your name down", "이름을 올려 두다", "I can put your name down if you like.", "원하시면 이름 올려 둘게요."),
        ln("give you a call", "전화를 드리다", "Leave your number and we'll give you a call.", "번호 남겨 주시면 전화 드릴게요."),
        ln("wait at the bar", "바에서 기다리다", "You're welcome to wait at the bar.", "바에서 기다리셔도 괜찮아요."),
      ],
      [
        t("Hi, do you have a table for three?", "세 명 자리 있어요?", "죄송하지만 지금 꽉 찼고 20분 정도 기다려야 한다고 하세요", "Sorry, we're full. It's about a 20-minute wait.", ["20-minute wait", "20 minute wait", "twenty minutes"]),
        t("That's fine. What should we do?", "괜찮아요. 어떻게 하면 돼요?", "이름을 올려 두겠다고 하세요", "I'll put your name down. What's your name?", ["put your name down", "take your name", "your name"]),
        t("It's Mia. Can we wait somewhere?", "미아예요. 어디서 기다려도 돼요?", "바에서 기다리셔도 된다고 하세요", "Sure, you're welcome to wait at the bar.", ["wait at the bar", "at the bar"]),
      ],
      o("Perfect, we'll grab a drink then.", "좋아요, 그럼 한잔하고 있을게요.")),

    // ───────── STEP 2 ─────────
    L("3", 2, "🍽️", "식사 중 테이블 챙기기", "식사 어떤지 묻기·접시 치우기·디저트", "손님",
      [
        ln("How is everything", "식사 어떠세요", "Hi guys, how is everything so far?", "식사 어떠세요, 괜찮으세요?"),
        ln("Glad to hear it", "다행이에요", "Glad to hear it. Enjoy!", "다행이에요. 맛있게 드세요!"),
        ln("Are you finished with", "다 드셨어요", "Are you finished with this plate?", "이 접시 다 드셨어요?", "다 먹었는지 물을 땐 still working on it? 도 써요."),
        ln("clear the table", "테이블을 치우다", "Let me clear the table for you.", "테이블 치워 드릴게요."),
        ln("dessert menu", "디저트 메뉴", "Would you like to see the dessert menu?", "디저트 메뉴 보시겠어요?"),
      ],
      [
        t("Mm, this is really good.", "음, 정말 맛있네요.", "식사는 어떠신지 물어보세요", "Glad to hear it. How is everything?", ["how is everything", "how's everything", "how is your meal"]),
        t("Great, thanks. Could you take these plates?", "좋아요. 이 접시 좀 치워 주실래요?", "네, 치워 드리겠다고 하세요", "Of course, I'll clear the table for you.", ["clear the table", "take these", "clear these"]),
        t("Can we see the dessert menu?", "디저트 메뉴 볼 수 있어요?", "가져다드리겠다고 하세요", "Sure, I'll grab it for you.", ["grab it", "bring it", "get it for you"]),
      ],
      o("Perfect, thanks.", "좋아요, 고마워요.")),

    L("4", 2, "🧾", "계산서와 나눠 내기", "따로 계산·금액 안내·마무리 인사", "손님",
      [
        ln("get the bill", "계산서를 받다", "Can we get the bill, please?", "계산서 좀 주실래요?", "호주에선 check보다 bill을 써요."),
        ln("split the bill", "나눠서 계산하다", "Would you like to split the bill?", "나눠서 계산하시겠어요?"),
        ln("That's $32 each", "한 분당 32달러예요", "No worries. That's $32 each.", "알겠습니다. 한 분당 32달러예요."),
        ln("just tap here", "여기 대 주세요", "Thanks, just tap here when you're ready.", "감사합니다, 준비되시면 여기 대 주세요."),
        ln("Enjoy the rest of your day", "남은 하루 잘 보내세요", "Thanks for coming in. Enjoy the rest of your day!", "와 주셔서 감사해요. 남은 하루 잘 보내세요!"),
      ],
      [
        t("Can we get the bill, please?", "계산서 주세요.", "나눠서 계산하실지 물어보세요", "Sure. Would you like to split the bill?", ["split the bill", "pay separately", "pay together"]),
        t("Yes, half each, please.", "네, 반반이요.", "한 분당 32달러라고 하세요", "No problem. That's $32 each.", ["32 each", "thirty two each"]),
        t("Here's my card.", "카드 여기요.", "카드를 대 달라고 하고 좋은 하루 보내라고 인사하세요", "Thanks, just tap here. Enjoy the rest of your day!", ["tap here", "enjoy the rest of your day", "have a good one"]),
      ],
      o("You too, thanks!", "당신도요, 고마워요!")),

    L("10", 2, "🍝", "음식 내며 메뉴 말하기", "누구 음식인지 묻기·메뉴 이름 말하기·필요한 것 묻기", "손님",
      [
        ln("Who's having the", "~ 어느 분이세요", "Who's having the carbonara?", "까르보나라 어느 분이세요?"),
        ln("Careful, the plate's hot", "조심하세요, 접시 뜨거워요", "Careful, the plate's hot.", "조심하세요, 접시가 뜨거워요."),
        ln("And this is the", "그리고 이건 ~예요", "And this is the grilled snapper.", "그리고 이건 그릴드 스내퍼예요."),
        ln("Can I get you anything else", "더 필요한 거 있으세요", "Can I get you anything else for now?", "지금 더 필요한 거 있으세요?"),
        ln("Enjoy your meal", "맛있게 드세요", "Enjoy your meal, guys.", "맛있게 드세요."),
      ],
      [
        t("Oh, that smells amazing.", "와, 냄새 좋다.", "까르보나라 어느 분인지 물어보세요", "Who's having the carbonara?", ["who's having the", "who has the", "carbonara"]),
        t("That's mine, thanks.", "제 거예요, 고마워요.", "접시가 뜨거우니 조심하라고 하세요", "Here you go. Careful, the plate's hot.", ["the plate's hot", "plate is hot", "careful"]),
        t("Thanks. Could I get some parmesan?", "파마산 치즈 좀 주실래요?", "물론이라고 하고 맛있게 드시라고 하세요", "Of course, I'll bring some. Enjoy your meal!", ["enjoy your meal", "enjoy"]),
      ],
      o("Thanks, this looks great.", "고마워요, 맛있어 보여요.")),

    L("11", 2, "🍴", "오픈 전 테이블 세팅", "커틀러리 놓기·물병 채우기·예약석 표시하기", "매니저 Kate",
      [
        ln("set up the tables", "테이블을 세팅하다", "Can you set up the tables before we open?", "오픈 전에 테이블 세팅해 줄래요?"),
        ln("cutlery and napkins", "커틀러리와 냅킨", "Put cutlery and napkins on every table.", "모든 테이블에 커틀러리랑 냅킨 놓아 줘요."),
        ln("fill up the water bottles", "물병을 채우다", "I'll fill up the water bottles next.", "다음에 물병 채울게요."),
        ln("reserved sign", "예약석 표시", "Put a reserved sign on table six.", "6번 테이블에 예약석 표시 올려 줘요."),
        ln("all set", "준비 다 된", "The tables are all set, Kate.", "케이트, 테이블 준비 다 됐어요."),
      ],
      [
        t("Morning! Can you set up the tables before we open?", "좋은 아침! 오픈 전에 테이블 세팅해 줄래요?", "네, 지금 테이블 세팅하겠다고 하세요", "Sure, I'll set up the tables now.", ["set up the tables", "set the tables"]),
        t("Great. Table six has a booking at twelve.", "좋아요. 6번 테이블은 12시 예약이에요.", "6번에 예약석 표시를 올려 두겠다고 하세요", "Got it, I'll put a reserved sign on six.", ["reserved sign", "reserved"]),
        t("Thanks. Let me know when you're done.", "고마워요. 끝나면 알려 줘요.", "테이블 준비 다 됐다고 하세요", "The tables are all set.", ["all set", "all done", "ready"]),
      ],
      o("Legend, thanks.", "최고예요, 고마워요.")),

    L("12", 2, "🧽", "손님 나간 테이블 정리", "테이블 치우기·닦기·다음 손님 받기", "동료 Sam",
      [
        ln("reset table", "테이블을 다시 세팅하다", "Can you reset table nine for the next group?", "다음 손님 오게 9번 테이블 다시 세팅해 줄래요?"),
        ln("wipe it down", "닦아 내다", "I'll clear the plates and wipe it down.", "접시 치우고 닦아 둘게요."),
        ln("a fresh set of cutlery", "새 커틀러리 한 세트", "Grab a fresh set of cutlery from the station.", "스테이션에서 새 커틀러리 한 세트 가져와요."),
        ln("good to go", "준비 끝난", "Table nine is good to go.", "9번 테이블 준비 끝났어요."),
        ln("seat them", "손님을 앉히다", "You can seat them at nine now.", "이제 9번에 손님 앉혀도 돼요."),
      ],
      [
        t("Table nine just left. Can you reset it?", "9번 손님 방금 나갔어요. 다시 세팅해 줄래요?", "네, 접시 치우고 닦겠다고 하세요", "Sure, I'll clear it and wipe it down.", ["wipe it down", "wipe it", "clean it"]),
        t("Thanks. We've got a couple waiting.", "고마워요. 커플이 기다리고 있어요.", "새 커틀러리를 가져오겠다고 하세요", "I'll grab a fresh set of cutlery.", ["fresh set of cutlery", "new cutlery", "cutlery"]),
        t("How's it looking?", "어떻게 돼 가요?", "준비 끝났으니 손님 앉혀도 된다고 하세요", "It's good to go. You can seat them now.", ["good to go", "seat them", "it's ready"]),
      ],
      o("Awesome, cheers.", "좋아요, 고마워요.")),

    L("13", 2, "🍷", "BYO 와인 콜키지 안내", "BYO 가능 여부·콜키지 요금 안내·잔 가져다드리기", "손님",
      [
        ln("BYO", "주류 지참 가능", "Are you guys BYO?", "여기 술 가져와도 돼요?", "BYO = Bring Your Own, 호주에 흔해요."),
        ln("wine only", "와인만", "We're BYO, but wine only.", "술 가져오셔도 되는데 와인만 돼요."),
        ln("corkage fee", "콜키지 요금", "There's a corkage fee of $5 per person.", "콜키지 요금이 한 분당 5달러 있어요."),
        ln("open that for you", "그걸 따 드리다", "Would you like me to open that for you?", "그거 따 드릴까요?"),
        ln("some wine glasses", "와인잔 몇 개", "I'll bring you some wine glasses.", "와인잔 가져다드릴게요."),
      ],
      [
        t("Hi, we brought a bottle of wine. Is that okay?", "와인 한 병 가져왔는데 괜찮아요?", "괜찮다고, 콜키지가 한 분당 5달러라고 하세요", "Sure, there's a corkage fee of $5 per person.", ["corkage fee", "corkage", "5 per person"]),
        t("That's fine.", "괜찮아요.", "와인을 따 드릴지 물어보세요", "Great. Would you like me to open that for you?", ["open that for you", "open it for you"]),
        t("Yes, please.", "네, 부탁해요.", "와인잔도 가져다드리겠다고 하세요", "No worries, I'll bring some wine glasses too.", ["wine glasses", "some glasses"]),
      ],
      o("Thanks, that's great.", "고마워요, 좋네요.")),

    // ───────── STEP 3 ─────────
    L("14", 3, "🥩", "스테이크 굽기 묻기", "굽기 정도·소스·사이드 고르기", "손님",
      [
        ln("How would you like", "어떻게 해 드릴까요", "How would you like your steak cooked?", "스테이크 굽기는 어떻게 해 드릴까요?"),
        ln("medium rare", "미디엄 레어", "Medium rare, please.", "미디엄 레어로 주세요."),
        ln("choice of sauce", "소스 선택", "It comes with a choice of sauce.", "소스는 고르실 수 있어요."),
        ln("pepper or mushroom", "페퍼 아니면 머쉬룸", "Would you like pepper or mushroom sauce?", "페퍼 소스 드릴까요, 머쉬룸 소스 드릴까요?"),
        ln("chips or mash", "감자튀김 아니면 으깬 감자", "And for your side, chips or mash?", "사이드는 감자튀김이랑 으깬 감자 중 뭘로 하시겠어요?"),
      ],
      [
        t("I'll have the rump steak.", "럼프 스테이크 주세요.", "굽기는 어떻게 해 드릴지 물어보세요", "Sure. How would you like it cooked?", ["how would you like", "how do you like"]),
        t("Medium rare, please.", "미디엄 레어요.", "페퍼 소스와 머쉬룸 소스 중 뭘로 할지 물어보세요", "Great. Pepper or mushroom sauce?", ["pepper or mushroom", "which sauce"]),
        t("Mushroom. What sides are there?", "머쉬룸이요. 사이드는 뭐 있어요?", "감자튀김이나 으깬 감자가 있다고 하세요", "You can have chips or mash.", ["chips or mash", "chips or mashed potato"]),
      ],
      o("Chips, thanks.", "감자튀김이요, 고마워요.")),

    L("15", 3, "🌱", "비건·글루텐프리 요청", "가능한 메뉴 알려 주기·변경 가능 여부 확인하기", "손님",
      [
        ln("vegan options", "비건 메뉴", "Do you have any vegan options?", "비건 메뉴 있어요?"),
        ln("marked with a V", "V 표시가 있는", "The vegan dishes are marked with a V.", "비건 메뉴는 V 표시가 있어요."),
        ln("make it gluten free", "글루텐프리로 만들다", "We can make it gluten free for you.", "글루텐프리로 해 드릴 수 있어요."),
        ln("swap the bun", "번을 바꾸다", "We can swap the bun for a GF one.", "번을 글루텐프리 번으로 바꿔 드릴 수 있어요.", "GF는 gluten free의 줄임말이에요."),
        ln("can't guarantee", "보장할 수 없다", "We can't guarantee it's 100% gluten free.", "100% 글루텐프리라고 보장은 못 드려요."),
      ],
      [
        t("Hi, I'm vegan. What can I have?", "저 비건인데 뭘 먹을 수 있어요?", "비건 메뉴는 V 표시가 있다고 하세요", "The vegan options are marked with a V.", ["marked with a V", "vegan options"]),
        t("And my friend is coeliac.", "제 친구는 셀리악병이 있어요.", "버거 번을 글루텐프리로 바꿀 수 있다고 하세요", "No problem. We can swap the bun for a gluten free one.", ["swap the bun", "gluten free bun", "gluten free"]),
        t("Is the kitchen totally gluten free?", "주방이 완전히 글루텐프리예요?", "100% 보장은 못 한다고 솔직히 말하세요", "Sorry, we can't guarantee it's 100% gluten free.", ["can't guarantee", "cannot guarantee"]),
      ],
      o("Okay, thanks for being honest.", "알겠어요, 솔직하게 말해 줘서 고마워요.")),

    L("16", 3, "👶", "아이 동반 가족 손님", "유아 의자·키즈 메뉴·색칠 도구 챙기기", "손님",
      [
        ln("a high chair", "유아 의자", "Could we get a high chair, please?", "유아 의자 하나 주실 수 있어요?"),
        ln("kids menu", "어린이 메뉴", "Here's our kids menu.", "여기 어린이 메뉴예요."),
        ln("under 12", "12세 이하", "The kids meals are for under 12.", "어린이 메뉴는 12세 이하용이에요."),
        ln("some crayons", "크레용 몇 개", "Would the little one like some crayons?", "아이한테 크레용 좀 드릴까요?"),
        ln("bring that out first", "그걸 먼저 내오다", "I'll bring that out first for her.", "그건 아이 먼저 가져다드릴게요."),
      ],
      [
        t("Hi, can we get a high chair for our son?", "아들 앉힐 유아 의자 있어요?", "그럼요 하고 어린이 메뉴도 드리세요", "Of course. And here's our kids menu.", ["kids menu", "kids' menu"]),
        t("Great. He gets hungry fast.", "좋아요. 애가 금방 배고파해요.", "아이 음식을 먼저 내오겠다고 하세요", "No worries, I'll bring his meal out first.", ["out first", "bring it first", "first"]),
        t("Thank you so much.", "정말 고마워요.", "아이에게 크레용을 줄지 물어보세요", "Would he like some crayons?", ["some crayons", "crayons"]),
      ],
      o("Oh, he'd love that!", "와, 좋아하겠네요!")),

    L("17", 3, "🥂", "와인 추천해 달라는 손님", "음식에 맞는 와인 추천·잔 사이즈 안내하기", "손님",
      [
        ln("goes well with", "~와 잘 어울리다", "This shiraz goes well with the lamb.", "이 쉬라즈가 양고기랑 잘 어울려요."),
        ln("by the glass", "잔으로", "We've got five wines by the glass.", "잔 와인은 다섯 가지 있어요."),
        ln("a local one", "이 지역 와인", "This one's a local one from the Barossa.", "이건 바로사에서 나온 이 지역 와인이에요.", "바로사는 호주 대표 와인 산지예요."),
        ln("a taste first", "먼저 맛보기", "Would you like a taste first?", "먼저 한번 맛보시겠어요?"),
        ln("something dry", "드라이한 것", "I'm after something dry and white.", "드라이한 화이트 와인을 찾고 있어요."),
      ],
      [
        t("Which wine goes with the lamb?", "양고기엔 어떤 와인이 어울려요?", "쉬라즈가 양고기랑 잘 어울린다고 하세요", "The shiraz goes well with the lamb.", ["goes well with", "goes with", "pairs well with"]),
        t("Can I get it by the glass?", "잔으로도 돼요?", "네, 잔으로 된다고 하고 바로사 지역 와인이라고 하세요", "Yes, by the glass. It's a local one from the Barossa.", ["by the glass", "a local one"]),
        t("Sounds good.", "좋네요.", "먼저 맛보시겠냐고 물어보세요", "Would you like a taste first?", ["a taste first", "try it first"]),
      ],
      o("Sure, why not.", "네, 좋아요.")),

    L("18", 3, "🎂", "생일 케이크 부탁", "케이크 보관·초 꽂기·타이밍 맞추기", "손님",
      [
        ln("keep it in the fridge", "냉장고에 보관하다", "We can keep it in the fridge for you.", "냉장고에 보관해 드릴게요."),
        ln("cakeage", "케이크 반입료", "There's a $3 per person cakeage.", "케이크 반입료가 한 분당 3달러 있어요.", "콜키지처럼 cakeage를 받는 곳이 있어요."),
        ln("bring it out after mains", "메인 다음에 내오다", "We'll bring it out after mains.", "메인 요리 다음에 내올게요."),
        ln("light the candles", "초에 불을 붙이다", "Should we light the candles for you?", "초에 불 붙여 드릴까요?"),
        ln("give me a nod", "고개로 신호를 주다", "Just give me a nod when you're ready.", "준비되시면 고개만 끄덕여 주세요."),
      ],
      [
        t("It's my mum's birthday. Can you keep this cake?", "엄마 생일인데 이 케이크 맡아 줄 수 있어요?", "냉장고에 보관해 드리겠다고 하세요", "Of course, I'll keep it in the fridge.", ["keep it in the fridge", "in the fridge"]),
        t("When can you bring it out?", "언제 내올 수 있어요?", "메인 요리 다음에 내오겠다고 하세요", "We'll bring it out after mains.", ["after mains", "after the main"]),
        t("Great. Can you add candles?", "좋아요. 초도 꽂아 줄래요?", "초에 불 붙여서 가져오겠다고 하고 준비되면 신호 달라고 하세요", "Sure, we'll light the candles. Just give me a nod.", ["light the candles", "give me a nod"]),
      ],
      o("You're a star, thank you!", "정말 최고예요, 고마워요!")),

    L("19", 3, "✏️", "메뉴 바꿔 달라는 요청", "재료 빼기·소스 따로·추가 요금 안내하기", "손님",
      [
        ln("without onion", "양파 빼고", "Can I get the burger without onion?", "버거 양파 빼고 주실 수 있어요?"),
        ln("on the side", "따로", "Could I have the dressing on the side?", "드레싱은 따로 주실 수 있어요?"),
        ln("extra charge", "추가 요금", "There's a $3 extra charge for avocado.", "아보카도는 3달러 추가 요금이 있어요."),
        ln("make a note", "메모해 두다", "I'll make a note for the kitchen.", "주방에 메모 남겨 둘게요."),
        ln("no problem at all", "전혀 문제없어요", "That's no problem at all.", "전혀 문제없어요."),
      ],
      [
        t("Can I get the chicken salad without onion?", "치킨 샐러드 양파 빼고 돼요?", "전혀 문제없다고 하세요", "That's no problem at all.", ["no problem at all", "no problem", "no worries"]),
        t("And the dressing on the side, please.", "드레싱은 따로 주세요.", "주방에 메모해 두겠다고 하세요", "Sure, I'll make a note for the kitchen.", ["make a note", "let the kitchen know"]),
        t("Can I add avocado too?", "아보카도도 추가할 수 있어요?", "가능한데 3달러 추가 요금이 있다고 하세요", "Yes, but there's a $3 extra charge.", ["extra charge", "3 dollars extra", "$3 extra"]),
      ],
      o("That's fine, add it.", "괜찮아요, 넣어 주세요.")),

    // ───────── STEP 4 ─────────
    L("5", 4, "⏳", "음식이 늦어질 때", "기다린 손님에게 사과하고 상황 알려 주기", "손님",
      [
        ln("sorry for the wait", "기다리게 해서 죄송해요", "I'm really sorry for the wait.", "기다리게 해서 정말 죄송해요."),
        ln("a bit backed up", "좀 밀려 있는", "The kitchen's a bit backed up tonight.", "오늘 밤 주방이 좀 밀려 있어요."),
        ln("chase that up", "확인해서 재촉하다", "Let me chase that up for you.", "제가 확인해서 빨리 나오게 할게요."),
        ln("on its way", "나오는 중인", "Your food is on its way now.", "음식 지금 나오는 중이에요."),
        ln("out in two minutes", "2분 뒤에 나오는", "It'll be out in two minutes.", "2분 뒤에 나와요."),
      ],
      [
        t("Excuse me, we ordered 30 minutes ago.", "저기요, 30분 전에 주문했는데요.", "기다리게 해서 죄송하다고 하세요", "I'm so sorry for the wait.", ["sorry for the wait", "sorry about the wait"]),
        t("Is our food coming soon?", "음식 곧 나와요?", "주방에 확인해 보겠다고 하세요", "Let me check with the kitchen for you.", ["check with the kitchen", "let me check"]),
        t("Okay, thanks.", "네, 고마워요.", "음식이 나오는 중이고 2분 뒤 나온다고 하세요", "Your food is on its way. It'll be out in two minutes.", ["on its way", "two minutes", "2 minutes"]),
      ],
      o("Great, thank you.", "좋아요, 고마워요.")),

    L("20", 4, "🔄", "잘못 나온 주문", "주문 확인하기·사과하기·새로 내오기", "손님",
      [
        ln("not what I ordered", "제가 주문한 게 아니에요", "Sorry, this is not what I ordered.", "죄송한데 이거 제가 주문한 게 아니에요."),
        ln("my mistake", "제 실수예요", "I'm so sorry, that's my mistake.", "정말 죄송해요, 제 실수예요."),
        ln("get that fixed", "바로잡다", "I'll get that fixed for you right now.", "지금 바로 바꿔 드릴게요."),
        ln("on the house", "서비스로", "Your drink is on the house tonight.", "오늘 음료는 서비스로 드릴게요."),
        ln("Let me take this back", "이건 다시 가져갈게요", "Let me take this back to the kitchen.", "이건 주방으로 다시 가져갈게요."),
      ],
      [
        t("Excuse me, I ordered the fish, not the chicken.", "저기요, 저 치킨 말고 생선 시켰어요.", "죄송하다고, 제 실수라고 하세요", "I'm so sorry, that's my mistake.", ["my mistake", "my fault", "so sorry"]),
        t("That's okay. Can I still get the fish?", "괜찮아요. 생선 아직 받을 수 있어요?", "이건 다시 가져가고 바로 바꿔 드리겠다고 하세요", "Of course. Let me take this back and get that fixed.", ["get that fixed", "take this back", "fix that"]),
        t("How long will it take?", "얼마나 걸려요?", "10분 정도 걸리고 음료는 서비스라고 하세요", "About ten minutes. Your drink is on the house.", ["on the house", "on us", "free"]),
      ],
      o("Oh, that's very kind. Thanks.", "어머, 친절하시네요. 고마워요.")),

    L("21", 4, "🥶", "음식이 식었다는 불만", "불만 듣고 사과하기·다시 데워 오기·매니저 부르기", "손님",
      [
        ln("a bit cold", "좀 식은", "Sorry, my pasta's a bit cold.", "죄송한데 파스타가 좀 식었어요."),
        ln("I'm sorry about that", "그 점 죄송해요", "Oh no, I'm sorry about that.", "어머, 그 점 죄송해요."),
        ln("a fresh one", "새로 만든 것", "I'll get the kitchen to make a fresh one.", "주방에 새로 만들어 달라고 할게요."),
        ln("grab my manager", "매니저를 불러오다", "Let me grab my manager for you.", "매니저 불러 드릴게요."),
        ln("Is everything okay now", "이제 괜찮으세요", "Is everything okay now?", "이제 괜찮으세요?"),
      ],
      [
        t("Excuse me, my soup is a bit cold.", "저기요, 수프가 좀 식었어요.", "죄송하다고 하세요", "Oh, I'm sorry about that.", ["sorry about that", "so sorry"]),
        t("Can I get it heated up?", "데워 주실 수 있어요?", "새로 만들어 오겠다고 하세요", "I'll get the kitchen to make a fresh one.", ["a fresh one", "a new one", "make a new"]),
        t("Thanks. This happened last time too.", "고마워요. 지난번에도 이랬어요.", "매니저를 불러 드리겠다고 하세요", "I'm sorry. Let me grab my manager for you.", ["grab my manager", "get my manager", "manager"]),
      ],
      o("Okay, I'd appreciate that.", "네, 그래 주시면 좋겠어요.")),

    L("22", 4, "💦", "음료를 쏟았을 때", "사과하기·닦아 드리기·새로 가져오기", "손님",
      [
        ln("I'm so sorry", "정말 죄송해요", "Oh, I'm so sorry! Are you okay?", "어머, 정말 죄송해요! 괜찮으세요?"),
        ln("grab some napkins", "냅킨을 가져오다", "Let me grab some napkins for you.", "냅킨 좀 가져다드릴게요."),
        ln("get you a new one", "새 걸로 가져다드리다", "I'll get you a new one right away.", "바로 새 걸로 가져다드릴게요."),
        ln("watch your step", "발밑을 조심하다", "Please watch your step, the floor's wet.", "바닥이 젖었으니 발밑 조심하세요."),
        ln("dry-cleaning", "드라이클리닝", "We're happy to cover the dry-cleaning.", "드라이클리닝 비용은 저희가 낼게요."),
      ],
      [
        t("Oh! My shirt!", "앗! 내 셔츠!", "정말 죄송하다고 하고 괜찮으신지 물어보세요", "I'm so sorry! Are you okay?", ["I'm so sorry", "are you okay"]),
        t("Yeah, I'm fine. It's just wet.", "네, 괜찮아요. 젖기만 했어요.", "냅킨을 가져오겠다고 하세요", "Let me grab some napkins for you.", ["grab some napkins", "get some napkins", "napkins"]),
        t("Thanks. My drink is gone though.", "고마워요. 근데 음료가 다 쏟아졌네요.", "바로 새 걸로 가져다드리겠다고 하세요", "I'll get you a new one right away.", ["get you a new one", "a new one", "another one"]),
      ],
      o("No worries, accidents happen.", "괜찮아요, 그럴 수도 있죠.")),

    L("23", 4, "🍺", "취한 손님 술 거절하기", "RSA 규정 설명·물 권하기·정중히 거절하기", "손님",
      [
        ln("can't serve you", "술을 드릴 수 없다", "Sorry mate, I can't serve you any more alcohol.", "죄송해요, 술은 더 드릴 수 없어요.", "RSA 자격증 있는 직원은 취한 손님에게 술을 못 팔아요."),
        ln("it's the law", "법이에요", "I'm sorry, it's the law in Australia.", "죄송해요, 호주에선 법이에요."),
        ln("a glass of water", "물 한 잔", "Can I get you a glass of water instead?", "대신 물 한 잔 드릴까요?"),
        ln("call you a taxi", "택시를 불러 드리다", "Would you like me to call you a taxi?", "택시 불러 드릴까요?"),
        ln("cut off", "더 이상 술을 안 주다", "Why am I getting cut off?", "왜 저한테 술을 그만 줘요?"),
      ],
      [
        t("Another beer, mate!", "맥주 한 잔 더요!", "죄송하지만 술은 더 드릴 수 없다고 하세요", "Sorry mate, I can't serve you any more.", ["can't serve you", "cannot serve you"]),
        t("What? Why am I getting cut off?", "뭐라고요? 왜 저한테 술을 안 줘요?", "죄송하지만 법이라고 하세요", "I'm sorry, it's the law. I've got to follow RSA.", ["it's the law", "RSA"]),
        t("Fine. Whatever.", "알았어요. 됐어요.", "대신 물 한 잔 드릴지 물어보세요", "Can I get you a glass of water instead?", ["a glass of water", "some water"]),
      ],
      o("Yeah, alright. Water's fine.", "네, 알았어요. 물 주세요.")),

    L("24", 4, "💳", "카드가 안 될 때", "결제 거절 알리기·다른 결제 방법·공휴일 할증 안내하기", "손님",
      [
        ln("It says declined", "거절됐다고 나와요", "Sorry, it says declined.", "죄송한데 거절됐다고 나와요."),
        ln("try it again", "다시 해 보다", "Do you want to try it again?", "다시 해 보시겠어요?"),
        ln("insert your card", "카드를 꽂다", "Could you insert your card and enter your PIN?", "카드 꽂고 비밀번호 눌러 주시겠어요?"),
        ln("another card", "다른 카드", "Do you have another card on you?", "다른 카드 가지고 계세요?"),
        ln("public holiday surcharge", "공휴일 할증", "There's a 15% public holiday surcharge today.", "오늘은 공휴일 할증 15%가 붙어요.", "호주는 공휴일에 할증을 붙이는 곳이 많아요."),
      ],
      [
        t("Why is the bill higher than the menu?", "왜 메뉴판보다 계산서가 비싸요?", "오늘은 공휴일 할증이 15% 있다고 하세요", "Sorry, there's a 15% public holiday surcharge today.", ["public holiday surcharge", "surcharge"]),
        t("Oh, okay. Here's my card.", "아, 그렇군요. 카드요.", "거절됐다고 나온다고 하고 다시 해 보시겠냐고 물어보세요", "Sorry, it says declined. Do you want to try again?", ["declined", "try again", "try it again"]),
        t("Hmm, it still doesn't work.", "음, 아직도 안 되네요.", "다른 카드가 있으신지 물어보세요", "No worries. Do you have another card?", ["another card", "a different card"]),
      ],
      o("Yeah, let me use this one.", "네, 이걸로 할게요.")),

    // ───────── STEP 5 ─────────
    L("25", 5, "🔥", "금요일 밤 만석 피크", "여러 테이블 동시에 챙기기·기다려 달라고 하기", "손님",
      [
        ln("be with you in a sec", "금방 갈게요", "I'll be with you in a sec!", "금방 갈게요!"),
        ln("I'll be right over", "바로 갈게요", "I'll be right over after this table.", "이 테이블 끝나고 바로 갈게요."),
        ln("thanks for your patience", "기다려 주셔서 감사해요", "Thanks for your patience, it's a busy night.", "기다려 주셔서 감사해요, 오늘 밤이 바빠서요."),
        ln("Who's next", "다음 분 누구세요", "Okay, who's next for drinks?", "자, 음료 다음 분 누구세요?"),
        ln("flat out", "엄청 바쁜", "We're flat out tonight.", "오늘 밤 엄청 바빠요.", "flat out은 호주에서 '정신없이 바쁜'이에요."),
      ],
      [
        t("Excuse me! Can we order?", "저기요! 주문할 수 있어요?", "금방 가겠다고 하세요", "Sure, I'll be with you in a sec!", ["in a sec", "be right with you", "one moment"]),
        t("We've been waiting a while.", "좀 오래 기다렸어요.", "기다려 주셔서 감사하다고 하세요", "Sorry about that. Thanks for your patience.", ["thanks for your patience", "thank you for waiting"]),
        t("It's packed tonight, huh?", "오늘 밤 꽉 찼네요?", "네, 오늘 엄청 바쁘다고 하고 뭘 드릴지 물어보세요", "Yeah, we're flat out. What can I get you?", ["flat out", "really busy", "what can I get you"]),
      ],
      o("Two pints of Great Northern, please.", "그레이트 노던 두 파인트 주세요.")),

    L("26", 5, "👥", "12명 단체 손님", "테이블 붙이기·세트 메뉴 안내·한 번에 계산하기", "손님",
      [
        ln("push some tables together", "테이블을 붙이다", "We'll push some tables together for you.", "테이블 몇 개 붙여 드릴게요."),
        ln("set menu", "세트 메뉴", "For groups of ten or more, we do a set menu.", "10명 이상 단체는 세트 메뉴로 해요."),
        ln("$55 a head", "1인당 55달러", "The set menu is $55 a head.", "세트 메뉴는 1인당 55달러예요."),
        ln("one bill", "계산서 하나", "Will it be one bill for the whole group?", "단체 전체 한 계산서로 하시나요?"),
        ln("service charge", "봉사료", "There's a 10% service charge for large groups.", "단체 손님은 10% 봉사료가 있어요."),
      ],
      [
        t("Hi, there are twelve of us. Can you fit us in?", "12명인데 자리 돼요?", "테이블을 붙여 드리겠다고 하세요", "Sure, we'll push some tables together.", ["push some tables together", "put tables together"]),
        t("Great. Can we order from the menu?", "좋아요. 메뉴에서 시켜도 돼요?", "10명 이상은 1인당 55달러 세트 메뉴라고 하세요", "For big groups it's a set menu, $55 a head.", ["set menu", "55 a head", "per person"]),
        t("Okay. How do we pay?", "알겠어요. 계산은 어떻게 해요?", "한 계산서로 하시는지 물어보세요", "Will it be one bill for everyone?", ["one bill", "pay together"]),
      ],
      o("Yeah, I'll put it on my card.", "네, 제 카드로 할게요.")),

    L("27", 5, "🚫", "품절 메뉴 전달하기", "주방 품절 소식 듣기·손님께 대안 권하기", "셰프 Marco",
      [
        ln("86 the", "~ 품절 처리하다", "Heads up, we have to 86 the salmon.", "알아 둬요, 연어 품절이에요.", "86은 식당에서 '품절'을 뜻하는 말이에요."),
        ln("ran out of", "~이 다 떨어졌다", "Sorry, we just ran out of the salmon.", "죄송해요, 연어가 방금 다 떨어졌어요."),
        ln("instead", "대신", "Could I suggest the snapper instead?", "대신 스내퍼는 어떠세요?"),
        ln("let the floor know", "홀에 알리다", "I'll let the floor know right away.", "바로 홀에 알릴게요."),
        ln("have we got left", "몇 개 남았어요", "How many lamb racks have we got left?", "양갈비 몇 개 남았어요?"),
      ],
      [
        t("Heads up, we're out of salmon. 86 it.", "알아 둬요, 연어 떨어졌어요. 품절이요.", "알겠다고, 바로 홀에 알리겠다고 하세요", "Got it, I'll let the floor know.", ["let the floor know", "tell the floor", "tell everyone"]),
        t("Thanks. Also only three lamb left.", "고마워요. 그리고 양고기는 세 개 남았어요.", "양고기 세 개 남은 거 맞는지 확인하세요", "Okay, three lamb left. Got it.", ["three lamb left", "three left", "3 left"]),
        t("Table five ordered the salmon, by the way.", "그런데 5번 테이블이 연어 시켰어요.", "5번에 가서 대신 스내퍼를 권하겠다고 하세요", "I'll go and offer them the snapper instead.", ["instead", "offer them"]),
      ],
      o("Good stuff. Go.", "좋아요. 가요.")),

    L("28", 5, "🗺️", "동료와 섹션 나누기", "담당 테이블 나누기·쉬는 시간 부탁하기", "동료 Sam",
      [
        ln("take tables one to eight", "1번부터 8번 테이블을 맡다", "Can you take tables one to eight?", "1번부터 8번 테이블 맡아 줄래요?"),
        ln("I've got the deck", "테라스는 제가 맡을게요", "I've got the deck tonight.", "오늘 밤 테라스는 제가 맡을게요."),
        ln("keep an eye on", "~을 지켜봐 주다", "Can you keep an eye on table four?", "4번 테이블 좀 지켜봐 줄래요?"),
        ln("take my break", "쉬는 시간을 갖다", "I'm going to take my break now.", "저 지금 쉬는 시간 가질게요."),
        ln("back in ten", "10분 뒤에 돌아오는", "I'll be back in ten.", "10분 뒤에 돌아올게요."),
      ],
      [
        t("Hey, how do you want to split the floor?", "홀 어떻게 나눌까요?", "1번부터 8번은 제가 맡겠다고 하세요", "I'll take tables one to eight.", ["one to eight", "1 to 8"]),
        t("Cool, I've got the deck then.", "좋아요, 그럼 테라스는 제가 할게요.", "쉬는 시간 가도 되는지, 10분 뒤 돌아온다고 하세요", "Thanks. Can I take my break? I'll be back in ten.", ["take my break", "back in ten", "go on break"]),
        t("Sure, go for it.", "그럼요, 다녀와요.", "4번 테이블 좀 지켜봐 달라고 하세요", "Thanks. Can you keep an eye on table four?", ["keep an eye on", "watch table four"]),
      ],
      o("Yep, I've got it.", "네, 제가 볼게요.")),

    L("29", 5, "🌙", "마감 인수인계", "마감 작업 나누기·남은 일 전달하기", "매니저 Kate",
      [
        ln("last orders", "마지막 주문", "Last orders are at 9:30.", "마지막 주문은 9시 30분이에요."),
        ln("stack the chairs", "의자를 쌓다", "Can you stack the chairs on the deck?", "테라스 의자 좀 쌓아 줄래요?"),
        ln("restock the station", "스테이션을 다시 채우다", "I'll restock the station for tomorrow.", "내일 쓰게 스테이션 채워 둘게요."),
        ln("still waiting on dessert", "아직 디저트를 기다리는", "Table two is still waiting on dessert.", "2번 테이블은 아직 디저트 기다리고 있어요."),
        ln("anything else before I go", "가기 전에 더 할 거", "Is there anything else before I go?", "가기 전에 더 할 거 있어요?"),
      ],
      [
        t("Okay, we're closing up soon. Where are we at?", "곧 마감이에요. 어디까지 했어요?", "2번 테이블이 아직 디저트를 기다린다고 하세요", "Table two is still waiting on dessert.", ["still waiting on dessert", "waiting for dessert"]),
        t("Got it. What about the station?", "알겠어요. 스테이션은요?", "내일 쓰게 스테이션을 채워 두겠다고 하세요", "I'll restock the station for tomorrow.", ["restock the station", "restock"]),
        t("Perfect. You can head off after that.", "좋아요. 그거 하고 퇴근해도 돼요.", "가기 전에 더 할 거 있는지 물어보세요", "Thanks. Anything else before I go?", ["anything else before I go", "anything else"]),
      ],
      o("Nah, that's it. Good work tonight.", "아니요, 그게 다예요. 오늘 수고했어요.")),

    L("30", 5, "📅", "로스터 시프트 바꾸기", "근무 교대 부탁·대신할 사람 정하기", "매니저 Kate",
      [
        ln("on the roster", "근무표에", "I'm on the roster for Saturday night.", "저 토요일 밤 근무표에 있어요."),
        ln("swap shifts", "근무를 바꾸다", "Could I swap shifts with Sam?", "샘이랑 근무 바꿔도 될까요?"),
        ln("cover my shift", "내 근무를 대신하다", "Sam said he can cover my shift.", "샘이 제 근무 대신해 줄 수 있대요."),
        ln("give you a heads-up", "미리 알려 주다", "I wanted to give you a heads-up early.", "미리 알려 드리고 싶었어요."),
        ln("update the roster", "근무표를 고치다", "I'll update the roster tonight.", "오늘 밤에 근무표 고쳐 둘게요."),
      ],
      [
        t("Hey, what's up?", "무슨 일이에요?", "토요일 밤 근무를 샘이랑 바꿔도 되는지 물어보세요", "Could I swap shifts with Sam on Saturday night?", ["swap shifts", "change shifts"]),
        t("Has Sam agreed to that?", "샘이 괜찮대요?", "네, 샘이 대신해 줄 수 있다고 했다고 하세요", "Yes, he said he can cover my shift.", ["cover my shift", "cover for me"]),
        t("Okay, thanks for telling me early.", "알겠어요, 미리 말해 줘서 고마워요.", "미리 알려 드리고 싶었다고 하세요", "No worries, I wanted to give you a heads-up.", ["give you a heads-up", "heads-up", "let you know"]),
      ],
      o("All good. I'll update the roster.", "괜찮아요. 근무표 고쳐 둘게요.")),
  ],
};

export default curriculum;
