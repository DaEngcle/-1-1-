import { L, ln, o, t, type JobCurriculum } from "./kit";

const curriculum: JobCurriculum = {
  steps: ["주방 첫날 적응", "매일 하는 프렙", "셰프 지시 따르기", "실수·위생·안전", "러시·마감·인수인계"],
  lessons: [
    // ───────── STEP 1: 주방 첫날 적응 ─────────
    L("1", 1, "🔪", "첫 출근, 셰프 지시", "대답하고 손질·보관 지시 확인하기", "셰프",
      [
        ln("Yes, chef", "네, 셰프", "Yes, chef. I'm ready to start.", "네, 셰프. 시작할 준비됐어요.", "주방에선 대답을 Yes, chef로 해요."),
        ln("dice them small", "작게 깍둑썰기하다", "Okay, I'll dice them small.", "네, 작게 깍둑썰기 할게요."),
        ln("put them in the walk-in", "워크인에 넣다", "Once they're done, put them in the walk-in.", "다 되면 워크인에 넣어 두세요."),
        ln("What should I do next", "다음엔 뭘 할까요", "All done, chef. What should I do next?", "다 했어요, 셰프. 다음엔 뭘 할까요?"),
        ln("Where do you keep", "어디에 두세요", "Where do you keep the chopping boards?", "도마는 어디에 두세요?"),
      ],
      [
        t("You must be the new kitchen hand. Ready to start?", "새로 온 키친핸드죠? 시작할 준비됐어요?", "네, 셰프 하고 준비됐다고 하세요", "Yes, chef. I'm ready.", ["Yes, chef"]),
        t("Good. First, prep the onions. Dice them small.", "먼저 양파 손질해요. 작게 깍둑썰기로.", "작게 깍둑썰기 하겠다고 확인하세요", "Okay, I'll dice them small.", ["dice them", "dice the onions"]),
        t("When you're done, put them in the walk-in.", "다 하면 워크인에 넣어 둬요.", "워크인에 넣겠다고 하세요", "Got it. I'll put them in the walk-in.", ["walk-in", "walk in"]),
      ],
      o("Good. Let's go.", "좋아요. 시작해요.")),

    L("2", 1, "🔥", "주방에서 움직일 때", "Behind·Corner 외치고 패스 확인하기", "셰프",
      [
        ln("Behind you", "뒤에 있어요", "Behind you! Hot tray coming through.", "뒤에 있어요! 뜨거운 트레이 지나가요.", "뒤로 지나갈 땐 꼭 크게 외쳐요."),
        ln("Corner", "모퉁이 돌아요", "Corner! Watch out, I've got knives.", "모퉁이 돌아요! 조심하세요, 칼 들고 있어요."),
        ln("on the pass", "패스에 (올라와) 있다", "The docket for table five is on the pass.", "5번 테이블 도켓 패스에 있어요.", "패스 = 음식이 나가는 카운터예요."),
        ln("Hot pan", "뜨거운 팬", "Hot pan! Don't touch the handle.", "뜨거운 팬이에요! 손잡이 만지지 마세요."),
        ln("coming through", "지나갈게요", "Sorry, coming through with the stockpot.", "죄송해요, 육수 냄비 들고 지나갈게요."),
      ],
      [
        t("Careful, hot pan coming through!", "조심, 뜨거운 팬 지나가요!", "내가 뒤에 있다고 알려 주세요", "Behind you!", ["behind"]),
        t("Thanks. Can you grab the tongs from over there?", "고마워요. 저기 집게 좀 갖다줄래요?", "모퉁이 돌 때 외치는 말과 함께 집게를 건네세요", "Corner! Here are the tongs.", ["corner", "here are the tongs"]),
        t("Cheers. Is the docket for table five up?", "고마워요. 5번 테이블 도켓 올라왔어요?", "네, 패스에 있다고 하세요", "Yes, it's on the pass.", ["on the pass"]),
      ],
      o("Beautiful. Keep it moving.", "좋아요. 계속 가요.")),

    L("6", 1, "🗺️", "주방 구역 안내받기", "쿨룸·드라이 스토어·디시핏 위치 익히기", "수셰프 Tom",
      [
        ln("the cool room", "쿨룸(냉장 창고)", "Dairy and veggies go in the cool room.", "유제품이랑 채소는 쿨룸에 넣어요."),
        ln("dry store", "건식 창고", "Flour and rice are in the dry store.", "밀가루랑 쌀은 건식 창고에 있어요."),
        ln("dish pit", "설거지 구역", "You'll start in the dish pit today.", "오늘은 설거지 구역에서 시작할 거예요.", "호주에선 설거지 구역을 dish pit이라고 해요."),
        ln("Where's the freezer", "냉동고는 어디예요", "Sorry, where's the freezer?", "죄송한데, 냉동고는 어디예요?"),
        ln("on the left", "왼쪽에", "The cool room is on the left, next to the back door.", "쿨룸은 왼쪽, 뒷문 옆에 있어요."),
      ],
      [
        t("Let me show you around. This is the cool room.", "한번 둘러봐요. 여기가 쿨룸이에요.", "냉동고는 어디 있는지 물어보세요", "Where's the freezer?", ["Where's the freezer", "where is the freezer"]),
        t("Right next to it. And the dry store is out the back.", "바로 옆이에요. 건식 창고는 뒤쪽에 있고요.", "건식 창고에 뭐가 있는지 물어보세요", "What's in the dry store?", ["dry store"]),
        t("Flour, rice, tins. And this is the dish pit. That's you today.", "밀가루, 쌀, 통조림. 여기는 설거지 구역. 오늘 당신 자리예요.", "오늘 설거지 구역에서 시작하겠다고 하세요", "No worries. I'll start in the dish pit.", ["dish pit", "dishes"]),
      ],
      o("Good. Shout if you need anything.", "좋아요. 필요한 거 있으면 불러요.")),

    L("7", 1, "📅", "로스터 확인하기", "근무 시간·쉬는 날 물어보기", "헤드셰프 Kate",
      [
        ln("the roster", "로스터(근무표)", "The roster goes up every Thursday.", "로스터는 매주 목요일에 올라와요.", "호주에선 근무표를 roster라고 해요."),
        ln("What time do I start", "몇 시에 시작해요", "What time do I start on Saturday?", "토요일엔 몇 시에 시작해요?"),
        ln("split shift", "중간에 쉬는 교대 근무", "Is it a split shift on Sunday?", "일요일은 중간에 쉬는 근무예요?"),
        ln("my day off", "제 쉬는 날", "Is Monday my day off this week?", "이번 주는 월요일이 제 쉬는 날이에요?"),
        ln("You're on", "근무예요", "You're on Friday and Saturday nights.", "금요일, 토요일 저녁 근무예요."),
      ],
      [
        t("You're on Friday and Saturday nights this week.", "이번 주는 금요일, 토요일 저녁 근무예요.", "토요일엔 몇 시에 시작하는지 물어보세요", "What time do I start on Saturday?", ["What time do I start", "what time"]),
        t("Four o'clock, until close.", "4시부터 마감까지요.", "월요일이 쉬는 날인지 물어보세요", "Is Monday my day off?", ["my day off", "day off"]),
        t("Yep. Check the roster every Thursday, it changes.", "네. 로스터는 매주 목요일에 확인해요, 바뀌거든요.", "목요일마다 확인하겠다고 하세요", "Okay, I'll check the roster every Thursday.", ["check the roster", "roster"]),
      ],
      o("Great. See you Friday.", "좋아요. 금요일에 봐요.")),

    L("8", 1, "👟", "복장·장비 챙기기", "논슬립 신발·앞치마·칼 확인하기", "수셰프 Tom",
      [
        ln("non-slip shoes", "미끄럼 방지 신발", "You need non-slip shoes in the kitchen.", "주방에선 미끄럼 방지 신발을 신어야 해요."),
        ln("Do I need to bring", "가져와야 하나요", "Do I need to bring my own knives?", "칼은 제가 가져와야 하나요?"),
        ln("Where can I get an apron", "앞치마는 어디서 받아요", "Where can I get an apron?", "앞치마는 어디서 받아요?"),
        ln("tie your hair back", "머리를 묶다", "Please tie your hair back before you start.", "시작하기 전에 머리 묶어 주세요."),
        ln("in the laundry bag", "세탁 가방에", "Put dirty aprons in the laundry bag.", "더러운 앞치마는 세탁 가방에 넣어요."),
      ],
      [
        t("Those runners won't do. You need non-slip shoes.", "그 운동화는 안 돼요. 미끄럼 방지 신발 신어야 해요.", "죄송하다고, 내일 미끄럼 방지 신발 신고 오겠다고 하세요", "Sorry, I'll wear non-slip shoes tomorrow.", ["non-slip shoes", "non slip"]),
        t("Good. And tie your hair back, please.", "좋아요. 그리고 머리 묶어 주세요.", "앞치마는 어디서 받는지 물어보세요", "Sure. Where can I get an apron?", ["Where can I get an apron", "apron"]),
        t("Top shelf, by the office.", "사무실 옆 맨 위 선반이요.", "칼도 가져와야 하는지 물어보세요", "Do I need to bring my own knives?", ["bring my own knives", "my own knives"]),
      ],
      o("No, use the house knives for now.", "아니요, 일단 가게 칼 써요.")),

    L("9", 1, "🍽️", "디시핏 첫 설거지", "식기세척기 쓰는 법·그릇 둘 곳 묻기", "동료 Sam",
      [
        ln("rinse them first", "먼저 헹구다", "Scrape the plates and rinse them first.", "접시 긁어내고 먼저 헹궈요."),
        ln("How do I turn on", "어떻게 켜요", "How do I turn on the dishwasher?", "식기세척기는 어떻게 켜요?"),
        ln("Where do these go", "이건 어디에 둬요", "Where do these go when they're dry?", "이거 다 마르면 어디에 둬요?"),
        ln("on the rack", "선반(랙)에", "Stack the clean pans on the rack.", "깨끗한 팬은 랙에 쌓아 두세요."),
        ln("running low on", "~이 얼마 안 남다", "We're running low on clean plates!", "깨끗한 접시가 얼마 안 남았어요!"),
      ],
      [
        t("Scrape the plates and rinse them first, then load them in.", "접시 긁고 먼저 헹군 다음에 넣어요.", "식기세척기를 어떻게 켜는지 물어보세요", "Okay. How do I turn on the dishwasher?", ["How do I turn on", "turn it on"]),
        t("Press the green button and close the hood.", "초록 버튼 누르고 뚜껑 닫아요.", "다 마른 그릇은 어디에 두는지 물어보세요", "Got it. Where do these go when they're dry?", ["Where do these go", "where do I put"]),
        t("Plates go on the pass, pans on the rack.", "접시는 패스에, 팬은 랙에요.", "팬은 랙에 쌓겠다고 하세요", "Okay, I'll stack the pans on the rack.", ["on the rack", "rack"]),
      ],
      o("Perfect. You're a natural.", "완벽해요. 소질 있네요.")),

    // ───────── STEP 2: 매일 하는 프렙 ─────────
    L("3", 2, "🥬", "재료 가져오기", "호주식 채소 이름·다지기·남은 양 말하기", "셰프",
      [
        ln("capsicum", "피망", "Can you grab two capsicum from the cool room?", "쿨룸에서 피망 두 개 갖다줄래요?", "호주에선 피망을 capsicum이라고 해요."),
        ln("zucchini", "애호박", "Slice the zucchini into rounds.", "애호박은 동그랗게 썰어 주세요."),
        ln("rocket", "루콜라", "We need another bag of rocket.", "루콜라 한 봉지 더 필요해요.", "arugula 대신 rocket이라고 해요."),
        ln("chop the coriander", "고수를 다지다", "I'll chop the coriander next.", "다음엔 고수 다질게요."),
        ln("mince", "다진 고기", "There's about two kilos of mince left.", "다진 고기 2킬로쯤 남았어요.", "호주에선 다진 고기를 mince라고 해요."),
      ],
      [
        t("Can you get me the capsicum and zucchini from the cool room?", "쿨룸에서 피망이랑 애호박 좀 갖다줄래요?", "피망과 애호박을 가져오겠다고 확인하세요", "Sure, capsicum and zucchini. Anything else?", ["capsicum and zucchini", "capsicum"]),
        t("A bag of rocket too. Then chop the coriander.", "루콜라 한 봉지도. 그리고 고수 다져 줘요.", "고수를 다지겠다고 하세요", "No worries. I'll chop the coriander.", ["chop the coriander", "chop it"]),
        t("How much mince is left?", "다진 고기 얼마나 남았어요?", "2킬로쯤 남았다고 하세요", "There's about two kilos of mince left.", ["two kilos", "2 kilos"]),
      ],
      o("Okay, I'll order more.", "알았어요, 더 주문할게요.")),

    L("10", 2, "📦", "납품 받기", "물건 개수·온도 확인하고 사인하기", "납품 기사",
      [
        ln("Delivery for", "~앞으로 온 배달", "Morning! Delivery for The Grove Kitchen.", "안녕하세요! 그로브 키친 앞으로 온 배달이에요."),
        ln("check the invoice", "송장을 확인하다", "Hang on, I'll just check the invoice.", "잠깐만요, 송장 좀 확인할게요."),
        ln("one box short", "한 박스 모자라다", "I think we're one box short of tomatoes.", "토마토가 한 박스 모자란 것 같아요."),
        ln("check the temperature", "온도를 확인하다", "I need to check the temperature of the chicken.", "닭고기 온도 확인해야 해요.", "냉장품은 5도 이하인지 꼭 재요."),
        ln("sign here", "여기에 사인하다", "Can you sign here, mate?", "여기 사인해 주실래요?"),
      ],
      [
        t("Morning! Delivery for the kitchen. Where do you want it?", "안녕하세요! 주방 배달이에요. 어디에 둘까요?", "뒷문 옆에 두라고 하고 송장 확인하겠다고 하세요", "Next to the back door, please. I'll check the invoice.", ["check the invoice", "invoice"]),
        t("Sure. It should all be there.", "네. 다 있을 거예요.", "토마토가 한 박스 모자란 것 같다고 하세요", "I think we're one box short of tomatoes.", ["one box short", "missing a box"]),
        t("Oh, sorry. I'll bring it tomorrow. Can you sign here?", "아, 죄송해요. 내일 가져올게요. 여기 사인해 줄래요?", "닭고기 온도 먼저 확인하고 사인하겠다고 하세요", "Sure, I'll just check the temperature of the chicken first.", ["check the temperature", "temperature"]),
      ],
      o("No worries. Take your time.", "괜찮아요. 천천히 하세요.")),

    L("11", 2, "🏷️", "라벨·날짜 붙이기", "데이 닷·사용 기한 라벨 붙이기", "수셰프 Tom",
      [
        ln("label everything", "전부 라벨을 붙이다", "Please label everything before it goes in the fridge.", "냉장고에 넣기 전에 전부 라벨 붙여 주세요."),
        ln("day dots", "요일 스티커", "Use the day dots, today is green.", "요일 스티커 써요, 오늘은 초록색이에요.", "호주 주방은 요일별 색 스티커를 많이 써요."),
        ln("use-by date", "사용 기한", "Write the use-by date on the lid.", "뚜껑에 사용 기한을 써 주세요."),
        ln("Is this still okay", "이거 아직 괜찮아요", "Is this still okay to use?", "이거 아직 써도 괜찮아요?"),
        ln("three days", "3일", "Cooked rice is good for three days.", "지은 밥은 3일까지 괜찮아요."),
      ],
      [
        t("Make sure you label everything you put away.", "넣는 건 전부 라벨 꼭 붙여요.", "어떤 색 요일 스티커를 쓰는지 물어보세요", "Okay. Which colour day dots do I use?", ["day dots", "which colour"]),
        t("Today's green. And write the use-by date too.", "오늘은 초록색이요. 사용 기한도 써요.", "이 소스 사용 기한이 언제인지 물어보세요", "What's the use-by date for this sauce?", ["use-by date", "use by date"]),
        t("Three days from today.", "오늘부터 3일이요.", "3일로 쓰겠다고 하세요", "Got it. I'll write three days from today.", ["three days", "3 days"]),
      ],
      o("Good. That's how we avoid waste.", "좋아요. 그래야 버리는 게 줄어요.")),

    L("12", 2, "📋", "프렙 리스트 보기", "오늘 할 프렙과 순서 확인하기", "헤드셰프 Kate",
      [
        ln("the prep list", "프렙 리스트", "The prep list is on the whiteboard.", "프렙 리스트는 화이트보드에 있어요."),
        ln("Which one first", "어떤 것부터", "Which one first, the salad or the sauce?", "샐러드랑 소스 중에 어떤 것부터 할까요?"),
        ln("peel the potatoes", "감자 껍질을 벗기다", "Can you peel the potatoes for the mash?", "매시용 감자 껍질 벗겨 줄래요?"),
        ln("cross it off", "줄을 그어 지우다", "When you finish a job, cross it off.", "하나 끝나면 줄 그어 지워요."),
        ln("I've finished", "다 했어요", "I've finished the potatoes, chef.", "감자 다 했어요, 셰프."),
      ],
      [
        t("Here's the prep list. Potatoes, salad, then the dressing.", "프렙 리스트예요. 감자, 샐러드, 그다음 드레싱.", "어떤 것부터 할지 물어보세요", "Which one first, chef?", ["Which one first", "what first"]),
        t("Peel the potatoes first. We need 10 kilos.", "감자 먼저 껍질 벗겨요. 10킬로 필요해요.", "감자 10킬로 껍질 벗기겠다고 하세요", "Okay, I'll peel 10 kilos of potatoes.", ["peel", "10 kilos"]),
        t("And cross things off as you go.", "하면서 하나씩 줄 그어요.", "알겠다고, 하나씩 지우겠다고 하세요", "No worries. I'll cross them off as I go.", ["cross them off", "cross it off"]),
      ],
      o("Great. Tell me when you're done.", "좋아요. 다 하면 말해요.")),

    L("13", 2, "🧽", "냄비·팬 정리하기", "큰 냄비 닦고 제자리에 두기", "동료 Sam",
      [
        ln("soak it", "불려 두다", "This pot's burnt. Just soak it for ten minutes.", "이 냄비 탔어요. 10분 불려 두세요."),
        ln("steel wool", "철수세미", "Use the steel wool for the baking trays.", "오븐 트레이는 철수세미로 닦아요."),
        ln("Where does this go", "이건 어디에 둬요", "Where does this go, top or bottom shelf?", "이거 어디에 둬요, 위칸이에요 아래칸이에요?"),
        ln("pots and pans", "냄비랑 팬", "I'll do the pots and pans next.", "다음엔 냄비랑 팬 할게요."),
        ln("bottom shelf", "아래 칸", "Heavy pots go on the bottom shelf.", "무거운 냄비는 아래 칸에 둬요."),
      ],
      [
        t("Can you do the pots and pans? There's a pile.", "냄비랑 팬 해 줄래요? 잔뜩 쌓였어요.", "네, 냄비랑 팬 하겠다고 하세요", "Sure, I'll do the pots and pans.", ["pots and pans", "pots"]),
        t("That big one's burnt on the bottom.", "저 큰 거 바닥이 탔어요.", "10분 불려 두겠다고 하세요", "I'll soak it for ten minutes.", ["soak it", "soak"]),
        t("Good idea. Then put it away.", "좋아요. 그다음 정리해 둬요.", "이건 어디에 두는지 물어보세요", "Where does this go?", ["Where does this go", "where do I put"]),
      ],
      o("Bottom shelf, under the bench.", "작업대 밑 아래 칸이요.")),

    L("14", 2, "🌡️", "냉장고 온도 기록", "온도 재고 기록지에 적기", "헤드셰프 Kate",
      [
        ln("temperature log", "온도 기록지", "Fill in the temperature log every morning.", "매일 아침 온도 기록지 채워 주세요."),
        ln("below five degrees", "5도 이하", "The fridge should be below five degrees.", "냉장고는 5도 이하여야 해요.", "호주 식품 위생 기준은 5도 이하예요."),
        ln("is reading", "~도로 나와요", "The walk-in is reading three degrees.", "워크인이 3도로 나와요."),
        ln("a bit warm", "좀 따뜻한", "The bar fridge feels a bit warm.", "바 냉장고가 좀 따뜻한 것 같아요."),
        ln("the door was open", "문이 열려 있었다", "Maybe the door was open for a while.", "아마 문이 한동안 열려 있었나 봐요."),
      ],
      [
        t("Can you do the temperature log for me?", "온도 기록 좀 해 줄래요?", "네, 지금 하겠다고 하세요", "Sure, I'll do the temperature log now.", ["temperature log", "log"]),
        t("What's the walk-in reading?", "워크인 몇 도예요?", "3도라고 하세요", "It's reading three degrees.", ["three degrees", "3 degrees"]),
        t("Good. And the small fridge?", "좋아요. 작은 냉장고는요?", "8도라서 좀 따뜻하다고 하세요", "Eight degrees. It's a bit warm.", ["a bit warm", "too warm"]),
      ],
      o("Hmm, I'll call the fridge guy.", "흠, 냉장고 기사 부를게요.")),

    // ───────── STEP 3: 셰프 지시 따르기 ─────────
    L("4", 3, "🥩", "서비스 중 주문 콜", "주문 복창·레스팅·남은 시간 말하기", "셰프",
      [
        ln("medium rare", "미디엄 레어", "Two steaks, one medium rare, one well done!", "스테이크 둘, 하나는 미디엄 레어, 하나는 웰던!"),
        ln("rest them", "레스팅하다", "Rest them for five minutes before plating.", "담기 전에 5분 레스팅해요."),
        ln("How long on", "~ 얼마나 남았어요", "How long on the fries for table six?", "6번 테이블 감자튀김 얼마나 남았어요?", "셰프가 남은 시간을 물을 때 써요."),
        ln("Two minutes, chef", "2분이요, 셰프", "Two minutes, chef. Nearly there.", "2분이요, 셰프. 거의 다 됐어요."),
        ln("Ready to go", "나갈 준비 됐어요", "Table six is ready to go!", "6번 테이블 나갈 준비 됐어요!"),
      ],
      [
        t("Two steaks, one medium rare, one well done!", "스테이크 둘, 하나는 미디엄레어, 하나는 웰던!", "웰던 하나 맞다고 복창하세요", "Yes, chef. One well done.", ["well done", "yes chef"]),
        t("Let them rest for five minutes before plating.", "담기 전에 5분 레스팅해요.", "5분 레스팅하겠다고 하세요", "Got it. I'll rest them for five minutes.", ["rest them", "rest the steaks"]),
        t("How long on the fries?", "감자튀김 얼마나 남았어요?", "2분 남았다고 하세요", "Two minutes, chef.", ["two minutes", "2 minutes"]),
      ],
      o("Good. Call it when it's ready.", "좋아요. 다 되면 불러요.")),

    L("15", 3, "🥕", "썰기 방식 지시", "얇게·채썰기 등 크기 확인하기", "수셰프 Tom",
      [
        ln("slice them thin", "얇게 썰다", "Slice them thin for the salad.", "샐러드용이니까 얇게 썰어요."),
        ln("julienne the carrots", "당근을 채 썰다", "Can you julienne the carrots?", "당근 채 썰어 줄래요?"),
        ln("Like this", "이렇게요", "Like this, or thinner?", "이렇게요, 아니면 더 얇게요?"),
        ln("roughly chop", "대충 썰다", "Just roughly chop the parsley.", "파슬리는 그냥 대충 썰어요."),
        ln("bite-size pieces", "한입 크기", "Cut the chicken into bite-size pieces.", "닭고기는 한입 크기로 잘라 주세요."),
      ],
      [
        t("Julienne the carrots for the slaw, nice and thin.", "슬로용으로 당근 채 썰어요, 얇게.", "얇게 채 썰겠다고 하세요", "Okay, I'll julienne the carrots thin.", ["julienne", "cut them thin"]),
        t("Show me one first.", "하나 먼저 보여 줘요.", "이렇게 하는 건지, 더 얇게 하는지 물어보세요", "Like this, or thinner?", ["Like this", "thinner"]),
        t("A bit thinner. And roughly chop the parsley after.", "조금 더 얇게. 그다음 파슬리는 대충 썰어요.", "파슬리는 대충 썰겠다고 하세요", "Got it. I'll roughly chop the parsley.", ["roughly chop", "chop the parsley"]),
      ],
      o("Perfect. That's the size.", "완벽해요. 그 크기예요.")),

    L("16", 3, "⚠️", "알레르기 주문", "글루텐프리·견과류 알레르기 처리하기", "헤드셰프 Kate",
      [
        ln("nut allergy", "견과류 알레르기", "Table four has a nut allergy.", "4번 테이블에 견과류 알레르기가 있어요."),
        ln("clean board", "깨끗한 도마", "Use a clean board and clean knife.", "깨끗한 도마랑 깨끗한 칼 쓰세요."),
        ln("gluten free", "글루텐프리", "Is the gravy gluten free?", "그레이비 글루텐프리예요?", "호주는 GF 주문이 아주 많아요."),
        ln("no dukkah", "듀카(견과류 양념) 빼고", "Plate it with no dukkah, please.", "듀카 빼고 담아 주세요."),
        ln("Allergy", "알레르기", "Allergy on table four, separate pan.", "4번 테이블 알레르기, 팬 따로 써요."),
      ],
      [
        t("Heads up, table four has a nut allergy.", "주의, 4번 테이블 견과류 알레르기예요.", "깨끗한 도마랑 칼을 쓰겠다고 하세요", "Okay. I'll use a clean board and knife.", ["clean board", "clean knife"]),
        t("Good. And the salad comes with dukkah.", "좋아요. 샐러드에 듀카 들어가요.", "듀카 빼고 담겠다고 하세요", "I'll plate it with no dukkah.", ["no dukkah", "without dukkah"]),
        t("Yep. Table nine wants it gluten free too.", "네. 9번 테이블은 글루텐프리로 원해요.", "그레이비가 글루텐프리인지 물어보세요", "Is the gravy gluten free?", ["gluten free", "GF"]),
      ],
      o("No, so leave it off.", "아니요, 그러니까 빼요.")),

    L("17", 3, "🍝", "플레이팅 따라 하기", "셰프 모양대로 담고 가니시 얹기", "헤드셰프 Kate",
      [
        ln("plate it like this", "이렇게 담다", "Watch me, then plate it like this.", "잘 보고 이렇게 담아요."),
        ln("wipe the rim", "접시 가장자리를 닦다", "Always wipe the rim before it goes.", "나가기 전에 접시 가장자리 꼭 닦아요."),
        ln("Is this enough", "이 정도면 돼요", "Is this enough sauce, chef?", "소스 이 정도면 돼요, 셰프?"),
        ln("a pinch of salt", "소금 한 꼬집", "Finish with a pinch of salt.", "마지막에 소금 한 꼬집 뿌려요."),
        ln("on top", "위에", "Put the micro herbs on top.", "어린잎 허브는 위에 올려요."),
      ],
      [
        t("Watch me. Pasta in the middle, sauce, then herbs on top.", "봐요. 파스타 가운데, 소스, 그다음 허브 위에.", "알겠다고, 허브는 위에 올리겠다고 하세요", "Got it. Herbs on top.", ["on top", "herbs on top"]),
        t("Now you do the next one.", "이제 다음 거 해 봐요.", "소스 이 정도면 되는지 물어보세요", "Is this enough sauce, chef?", ["Is this enough", "enough sauce"]),
        t("Bit more. And always wipe the rim.", "조금 더. 그리고 가장자리 꼭 닦아요.", "가장자리 닦겠다고 하세요", "Okay, I'll wipe the rim.", ["wipe the rim", "wipe the plate"]),
      ],
      o("Nice. That one can go.", "좋아요. 그거 나가도 돼요.")),

    L("18", 3, "🍲", "소스·육수 불 조절", "약불로 줄이고 저어 달라는 지시 따르기", "수셰프 Tom",
      [
        ln("turn it down", "불을 줄이다", "It's boiling. Turn it down to a simmer.", "끓고 있어요. 약하게 끓도록 줄여요."),
        ln("a simmer", "약하게 끓는 상태", "Keep the stock at a simmer.", "육수는 약하게 끓는 상태로 둬요."),
        ln("stir it", "젓다", "Stir it every few minutes or it'll stick.", "몇 분마다 저어요, 안 그러면 눌어붙어요."),
        ln("Skim the top", "위를 걷어 내다", "Skim the top with a ladle.", "국자로 위를 걷어 내요."),
        ln("It's starting to stick", "눌어붙기 시작해요", "Chef, it's starting to stick.", "셰프, 눌어붙기 시작해요."),
      ],
      [
        t("Can you watch the stock for me? It's boiling.", "육수 좀 봐 줄래요? 끓고 있어요.", "불을 약하게 줄이겠다고 하세요", "Sure, I'll turn it down to a simmer.", ["turn it down", "simmer"]),
        t("Good. Skim the top every ten minutes.", "좋아요. 10분마다 위를 걷어 내요.", "10분마다 걷어 내겠다고 하세요", "Okay, I'll skim the top every ten minutes.", ["skim the top", "skim it"]),
        t("And how's the béchamel going?", "베샤멜은 어때요?", "눌어붙기 시작한다고 하세요", "It's starting to stick, chef.", ["starting to stick", "sticking"]),
      ],
      o("Stir it and take it off the heat.", "저어 주고 불에서 내려요.")),

    L("19", 3, "🍟", "튀김기 기름 갈기", "기름 식히고 안전하게 교체하기", "수셰프 Tom",
      [
        ln("change the oil", "기름을 갈다", "We need to change the oil tonight.", "오늘 밤에 기름 갈아야 해요."),
        ln("let it cool down", "식히다", "Turn it off and let it cool down first.", "끄고 먼저 식혀요."),
        ln("Is it cool enough", "충분히 식었어요", "Is it cool enough to drain now?", "이제 빼도 될 만큼 식었어요?"),
        ln("the fryer", "튀김기", "The fryer oil is really dark.", "튀김기 기름이 정말 시커메요."),
        ln("wear the gloves", "장갑을 끼다", "Always wear the gloves when you drain it.", "기름 뺄 땐 꼭 장갑 껴요."),
      ],
      [
        t("The oil's really dark. Can you change the oil after service?", "기름이 시커메요. 서비스 끝나고 기름 갈아 줄래요?", "네, 서비스 끝나고 갈겠다고 하세요", "No worries, I'll change the oil after service.", ["change the oil", "change it"]),
        t("Turn the fryer off first and let it cool down.", "먼저 튀김기 끄고 식혀요.", "얼마나 식혀야 하는지 물어보세요", "How long should I let it cool down?", ["cool down", "how long"]),
        t("About an hour. And wear the gloves.", "한 시간쯤. 그리고 장갑 껴요.", "장갑 끼겠다고, 한 시간 뒤에 하겠다고 하세요", "Okay, I'll wear the gloves and do it in an hour.", ["wear the gloves", "gloves"]),
      ],
      o("Good. Safety first.", "좋아요. 안전이 먼저예요.")),

    // ───────── STEP 4: 실수·위생·안전 ─────────
    L("5", 4, "🚫", "재료가 떨어졌을 때", "재료 품절 알리고 선입선출 지키기", "셰프",
      [
        ln("run out of", "~이 다 떨어지다", "Sorry, chef. We've run out of salmon.", "죄송해요, 셰프. 연어가 다 떨어졌어요."),
        ln("86", "품절", "86 the salmon, tell front of house.", "연어 품절이에요, 홀에 알려요.", "주방에선 품절을 86이라고 해요."),
        ln("front of house", "홀(서빙 쪽)", "I'll let front of house know.", "홀에 알릴게요."),
        ln("First in, first out", "선입선출", "First in, first out. Use the old stock first.", "선입선출이에요. 오래된 재고부터 써요."),
        ln("at the back", "뒤쪽에", "Put the new stock at the back.", "새 재고는 뒤쪽에 넣어요."),
      ],
      [
        t("Where's the salmon? I need it for table eight.", "연어 어디 있어요? 8번 테이블에 필요해요.", "연어가 다 떨어졌다고 하세요", "Sorry, chef. We've run out of salmon.", ["run out of", "ran out of", "out of salmon"]),
        t("Okay, 86 the salmon. Tell front of house.", "알았어요, 연어 86(품절)이에요. 홀에 알려요.", "홀에 연어가 86이라고 알리겠다고 하세요", "Okay, I'll tell front of house the salmon is 86.", ["86", "eighty six", "sold out"]),
        t("And check the walk-in. First in, first out, yeah?", "워크인도 확인해요. 선입선출, 알죠?", "알겠다고, 오래된 것부터 쓰겠다고 하세요", "Yes, chef. First in, first out. I'll use the old stock first.", ["First in, first out", "old stock first"]),
      ],
      o("Good stuff.", "잘했어요.")),

    L("20", 4, "🩸", "칼에 베었을 때", "다쳤다고 알리고 파란 밴드 받기", "수셰프 Tom",
      [
        ln("I cut myself", "베였어요", "Chef, I cut myself on the mandoline.", "셰프, 채칼에 베였어요."),
        ln("first aid kit", "구급상자", "Where's the first aid kit?", "구급상자 어디 있어요?"),
        ln("blue band-aid", "파란 밴드", "Use a blue band-aid in the kitchen.", "주방에선 파란 밴드를 써요.", "음식에 떨어져도 잘 보이게 파란색을 써요."),
        ln("put a glove on", "장갑을 끼다", "Put a glove on over the band-aid.", "밴드 위에 장갑을 끼세요."),
        ln("fill out an incident report", "사고 보고서를 쓰다", "You'll need to fill out an incident report.", "사고 보고서 써야 해요."),
      ],
      [
        t("What's wrong? You've gone pale.", "무슨 일이에요? 얼굴이 하얘졌어요.", "채칼에 베였다고 하세요", "I cut myself on the mandoline.", ["cut myself", "I cut"]),
        t("Let me see. Okay, it's not deep.", "봐요. 괜찮아요, 깊진 않네요.", "구급상자가 어디 있는지 물어보세요", "Where's the first aid kit?", ["first aid kit", "first aid"]),
        t("Above the sink. Use a blue band-aid and put a glove on.", "싱크대 위요. 파란 밴드 붙이고 장갑 껴요.", "파란 밴드 붙이고 장갑 끼겠다고 하세요", "Okay, blue band-aid and a glove.", ["blue band-aid", "blue bandaid", "glove"]),
      ],
      o("And fill out an incident report later.", "나중에 사고 보고서도 써요.")),

    L("21", 4, "💥", "접시를 깼을 때", "솔직하게 말하고 안전하게 치우기", "동료 Sam",
      [
        ln("I broke a plate", "접시를 깼어요", "Sorry, I broke a plate.", "죄송해요, 접시 하나 깼어요."),
        ln("Watch your step", "발밑 조심하세요", "Watch your step, there's glass on the floor.", "발밑 조심하세요, 바닥에 유리 있어요."),
        ln("dustpan and brush", "쓰레받기랑 빗자루", "Where's the dustpan and brush?", "쓰레받기랑 빗자루 어디 있어요?"),
        ln("glass bin", "유리 전용 쓰레기통", "Put it in the glass bin, not the general bin.", "일반 쓰레기통 말고 유리 전용 통에 넣어요."),
        ln("Don't touch it", "만지지 마세요", "Don't touch it with your hands.", "손으로 만지지 마세요."),
      ],
      [
        t("Whoa, what was that?", "어, 방금 뭐예요?", "죄송하다고, 접시를 깼다고 하세요", "Sorry, I broke a plate.", ["broke a plate", "dropped a plate"]),
        t("No stress, happens all the time. Don't touch it.", "걱정 마요, 늘 있는 일이에요. 만지지 마요.", "쓰레받기랑 빗자루가 어디 있는지 물어보세요", "Where's the dustpan and brush?", ["dustpan and brush", "dustpan"]),
        t("Under the sink. Watch your step.", "싱크대 밑이요. 발밑 조심해요.", "다른 사람들에게 발밑 조심하라고 외치세요", "Watch your step, everyone! Glass on the floor.", ["Watch your step", "glass on the floor"]),
      ],
      o("Good call. Glass bin's by the door.", "잘했어요. 유리 통은 문 옆에 있어요.")),

    L("22", 4, "🧯", "바닥이 미끄러울 때", "기름 흘린 곳 알리고 표지판 세우기", "헤드셰프 Kate",
      [
        ln("slippery", "미끄러운", "Careful, the floor's slippery here.", "조심하세요, 여기 바닥 미끄러워요."),
        ln("I spilled some oil", "기름을 흘렸어요", "Sorry, I spilled some oil near the fryer.", "죄송해요, 튀김기 근처에 기름 흘렸어요."),
        ln("wet floor sign", "바닥 젖음 표지판", "Put the wet floor sign out.", "바닥 젖음 표지판 세워 두세요."),
        ln("mop it up", "대걸레로 닦다", "I'll mop it up straight away.", "바로 대걸레로 닦을게요."),
        ln("degreaser", "기름때 제거제", "Use degreaser, water won't work.", "디그리서 써요, 물로는 안 돼요."),
      ],
      [
        t("Why's the floor shiny over there?", "저기 바닥이 왜 번들거려요?", "튀김기 근처에 기름을 흘렸다고 하세요", "Sorry, I spilled some oil near the fryer.", ["spilled some oil", "spilt"]),
        t("Put the wet floor sign out first.", "먼저 바닥 젖음 표지판 세워요.", "표지판 세우고 바로 닦겠다고 하세요", "Okay, I'll put the sign out and mop it up.", ["mop it up", "clean it up"]),
        t("Use degreaser, not just water.", "물만 말고 디그리서 써요.", "디그리서는 어디 있는지 물어보세요", "Where's the degreaser?", ["degreaser"]),
      ],
      o("Chemical cupboard, second shelf.", "약품 찬장 두 번째 칸이요.")),

    L("23", 4, "🔥", "음식을 잘못 만들었을 때", "실수 인정하고 다시 만들기(리파이어)", "헤드셰프 Kate",
      [
        ln("my mistake", "제 실수", "Sorry, chef, my mistake. I'll fix it.", "죄송해요, 셰프, 제 실수예요. 고칠게요."),
        ln("It got sent back", "반송됐어요", "It got sent back, it's overcooked.", "반송됐어요, 너무 익었대요."),
        ln("refire", "다시 만들다", "Refire one fish for table two.", "2번 테이블 생선 하나 다시 만들어요.", "주방에선 다시 만들기를 refire라고 해요."),
        ln("I burnt", "태웠어요", "Chef, I burnt the garlic bread.", "셰프, 마늘빵 태웠어요."),
        ln("It won't happen again", "다신 안 그럴게요", "Sorry, it won't happen again.", "죄송해요, 다신 안 그럴게요."),
      ],
      [
        t("This fish got sent back. It's overcooked.", "이 생선 반송됐어요. 너무 익었대요.", "죄송하다고, 제 실수라고 하세요", "Sorry, chef. My mistake.", ["My mistake", "my fault"]),
        t("Refire it. Four minutes, not six.", "다시 해요. 6분 말고 4분.", "4분으로 다시 하겠다고 하세요", "Yes, chef. I'll refire it for four minutes.", ["refire", "four minutes"]),
        t("Okay. Watch the timer this time.", "좋아요. 이번엔 타이머 잘 봐요.", "다신 안 그러겠다고 하세요", "I will. It won't happen again.", ["won't happen again", "won't happen"]),
      ],
      o("Good. Let's move on.", "좋아요. 넘어가요.")),

    L("24", 4, "🟥", "교차오염 지적받기", "색깔 도마 규칙 지키고 바로 고치기", "헤드셰프 Kate",
      [
        ln("red board", "빨간 도마", "Raw meat goes on the red board.", "날고기는 빨간 도마에서 해요.", "호주 주방은 재료별로 도마 색이 정해져 있어요."),
        ln("green board", "초록 도마", "Use the green board for salad.", "샐러드는 초록 도마 써요."),
        ln("cross-contamination", "교차 오염", "That's cross-contamination, mate.", "그거 교차 오염이에요."),
        ln("wash my hands", "손을 씻다", "I'll wash my hands and start again.", "손 씻고 다시 할게요."),
        ln("throw it out", "버리다", "You'll have to throw it out.", "그건 버려야 해요."),
      ],
      [
        t("Stop! You just cut chicken on the green board.", "잠깐! 방금 초록 도마에서 닭 썰었잖아요.", "죄송하다고, 빨간 도마를 써야 했다고 하세요", "Sorry, I should've used the red board.", ["red board"]),
        t("Yep. That lettuce has to go now.", "네. 그 양상추는 이제 버려야 해요.", "양상추를 버리겠다고 하세요", "Okay, I'll throw it out.", ["throw it out", "bin it"]),
        t("And wash that board properly.", "그리고 그 도마 제대로 씻어요.", "도마 씻고 손도 씻겠다고 하세요", "I'll wash the board and wash my hands.", ["wash my hands", "wash the board"]),
      ],
      o("Good. Raw on red, always.", "좋아요. 날것은 무조건 빨간 도마.")),

    // ───────── STEP 5: 러시·마감·인수인계 ─────────
    L("25", 5, "🔔", "금요일 밤 러시", "밀린 설거지 알리고 도움 요청하기", "동료 Sam",
      [
        ln("slammed", "엄청 바쁜", "We're slammed tonight, forty dockets.", "오늘 밤 엄청 바빠요, 도켓이 40개예요.", "호주 주방에서 '엄청 바쁘다'는 slammed라고 해요."),
        ln("I need a hand", "도움이 필요해요", "Sam, I need a hand in the dish pit.", "샘, 설거지 구역에 도움이 필요해요."),
        ln("piling up", "쌓이다", "The plates are piling up fast.", "접시가 빨리 쌓이고 있어요."),
        ln("give me two minutes", "2분만 주세요", "Give me two minutes and I'll help.", "2분만 주세요, 그럼 도와줄게요."),
        ln("clean plates", "깨끗한 접시", "Chef needs clean plates now!", "셰프가 지금 깨끗한 접시가 필요하대요!"),
      ],
      [
        t("Chef needs clean plates now!", "셰프가 지금 깨끗한 접시 필요하대요!", "접시가 쌓이고 있다고, 도움이 필요하다고 하세요", "They're piling up. I need a hand!", ["need a hand", "need help"]),
        t("Okay, I'll load, you unload.", "알았어요, 내가 넣을게요, 당신이 빼요.", "좋다고, 깨끗한 접시 바로 패스로 보내겠다고 하세요", "Sounds good. I'll take clean plates to the pass.", ["clean plates", "to the pass"]),
        t("We've still got thirty covers to go.", "아직 30명 남았어요.", "2분만 주면 팬도 다 하겠다고 하세요", "Give me two minutes, I'll do the pans too.", ["two minutes", "2 minutes"]),
      ],
      o("Legend. We've got this.", "최고예요. 우리 할 수 있어요.")),

    L("26", 5, "🎉", "단체 예약 준비", "40명 펑션 프렙 나눠서 하기", "헤드셰프 Kate",
      [
        ln("a function", "단체 행사", "We've got a function for forty tomorrow.", "내일 40명 단체 행사가 있어요."),
        ln("canapés", "카나페(한입 음식)", "Can you start the canapés after lunch?", "점심 끝나고 카나페 시작해 줄래요?"),
        ln("How many trays", "트레이 몇 개", "How many trays do we need?", "트레이 몇 개 필요해요?"),
        ln("vegan options", "비건 메뉴", "Six guests want vegan options.", "손님 여섯 명이 비건 메뉴를 원해요."),
        ln("set aside", "따로 빼 두다", "Set aside the vegan ones on a separate tray.", "비건은 다른 트레이에 따로 빼 둬요."),
      ],
      [
        t("Big day tomorrow. A function for forty.", "내일 큰일이에요. 40명 단체 행사.", "트레이 몇 개 필요한지 물어보세요", "How many trays do we need?", ["How many trays", "how many"]),
        t("Eight trays of canapés. Six guests want vegan options.", "카나페 8트레이요. 여섯 명은 비건 메뉴 원해요.", "비건은 따로 빼 두겠다고 하세요", "Okay, I'll set aside the vegan ones.", ["set aside", "separate tray"]),
        t("Great. Start after lunch service.", "좋아요. 점심 서비스 끝나고 시작해요.", "2시에 시작하겠다고 하세요", "No worries. I'll start at two.", ["start at two", "at 2"]),
      ],
      o("Perfect. Thanks for helping out.", "완벽해요. 도와줘서 고마워요.")),

    L("27", 5, "🧹", "마감 청소", "마감 체크리스트대로 정리하기", "수셰프 Tom",
      [
        ln("close down", "마감하다", "Let's close down the kitchen.", "주방 마감해요."),
        ln("wipe down the benches", "작업대를 닦다", "I'll wipe down the benches and sanitise them.", "작업대 닦고 소독할게요."),
        ln("take the bins out", "쓰레기를 내다 버리다", "Can you take the bins out?", "쓰레기 좀 내다 버려 줄래요?"),
        ln("the closing checklist", "마감 체크리스트", "Tick off the closing checklist when you're done.", "다 하면 마감 체크리스트에 체크해요."),
        ln("Anything else before I go", "가기 전에 더 할 거 있어요", "Anything else before I go, chef?", "가기 전에 더 할 거 있어요, 셰프?"),
      ],
      [
        t("Right, let's close down. Benches first.", "자, 마감해요. 작업대부터.", "작업대 닦고 소독하겠다고 하세요", "Okay, I'll wipe down the benches and sanitise them.", ["wipe down the benches", "wipe the benches"]),
        t("Then take the bins out and mop the floor.", "그다음 쓰레기 버리고 바닥 닦아요.", "쓰레기 버리고 바닥 닦겠다고 하세요", "No worries. Bins out, then mop.", ["bins out", "take the bins"]),
        t("Done? Tick off the closing checklist.", "다 했어요? 마감 체크리스트 체크해요.", "체크했다고 하고 가기 전에 더 할 게 있는지 물어보세요", "All ticked. Anything else before I go?", ["Anything else", "before I go"]),
      ],
      o("Nope, that's it. Good work tonight.", "없어요, 끝. 오늘 수고했어요.")),

    L("28", 5, "🔄", "다음 교대 인수인계", "남은 프렙·떨어진 재료 넘겨주기", "저녁 셰프 Mia",
      [
        ln("handover", "인수인계", "Quick handover before I go?", "가기 전에 간단히 인수인계할까요?"),
        ln("still to do", "아직 남은", "The dressing is still to do.", "드레싱은 아직 남았어요."),
        ln("We're out of", "~이 떨어졌어요", "We're out of cream, I've told Kate.", "생크림이 떨어졌어요, 케이트한테 말했어요."),
        ln("It's all labelled", "전부 라벨 붙어 있어요", "It's all labelled in the walk-in.", "워크인에 전부 라벨 붙어 있어요."),
        ln("What's left", "뭐가 남았어요", "What's left on the prep list?", "프렙 리스트에 뭐가 남았어요?"),
      ],
      [
        t("Hey, what's left on the prep list?", "프렙 리스트에 뭐가 남았어요?", "드레싱이 아직 남았다고 하세요", "Just the dressing. It's still to do.", ["still to do", "not done yet"]),
        t("Okay. Anything we're short on?", "알았어요. 부족한 건 있어요?", "생크림이 떨어졌다고, 케이트한테 말했다고 하세요", "We're out of cream. I've told Kate.", ["out of cream", "We're out of"]),
        t("Thanks. Where's the stuff you prepped?", "고마워요. 당신이 프렙한 건 어디 있어요?", "워크인에 전부 라벨 붙여 뒀다고 하세요", "It's all labelled in the walk-in.", ["all labelled", "labelled"]),
      ],
      o("Legend. Have a good night.", "최고예요. 좋은 밤 보내요.")),

    L("29", 5, "🤒", "아파서 못 나갈 때", "셰프에게 연락하고 교대 바꾸기", "헤드셰프 Kate",
      [
        ln("call in sick", "아파서 못 간다고 연락하다", "Sorry, I have to call in sick today.", "죄송해요, 오늘 아파서 못 갈 것 같아요."),
        ln("I've got a fever", "열이 나요", "I've got a fever and a sore throat.", "열이 나고 목이 아파요."),
        ln("swap shifts", "교대를 바꾸다", "Sam said he can swap shifts with me.", "샘이 저랑 교대 바꿀 수 있대요."),
        ln("medical certificate", "진단서", "Can you get a medical certificate?", "진단서 받아 올 수 있어요?", "호주에선 줄여서 med cert라고도 해요."),
        ln("as soon as possible", "최대한 빨리", "I'll let you know as soon as possible.", "최대한 빨리 알려 드릴게요."),
      ],
      [
        t("Hi, it's Kate. What's up?", "여보세요, 케이트예요. 무슨 일이에요?", "죄송하다고, 오늘 아파서 못 간다고 하세요", "Sorry, Kate. I have to call in sick today.", ["call in sick", "I'm sick"]),
        t("Oh no. What's wrong?", "저런. 어디가 아파요?", "열이 나고 목이 아프다고 하세요", "I've got a fever and a sore throat.", ["got a fever", "fever"]),
        t("Okay. I'll need someone to cover you.", "알았어요. 대신할 사람이 필요하겠네요.", "샘이 교대 바꿀 수 있다고 했다고 하세요", "Sam said he can swap shifts with me.", ["swap shifts", "swap"]),
      ],
      o("Great. Rest up, and get a medical certificate.", "좋아요. 푹 쉬고 진단서 받아 와요.")),

    L("30", 5, "💬", "근무 더 달라고 하기", "시간 늘려 달라고 하고 가능한 날 말하기", "헤드셰프 Kate",
      [
        ln("more hours", "근무 시간 더", "Could I get more hours next week?", "다음 주에 근무 시간 더 받을 수 있을까요?"),
        ln("I'm free on", "~에 시간 돼요", "I'm free on Tuesdays and Wednesdays.", "화요일이랑 수요일에 시간 돼요."),
        ln("happy to do", "기꺼이 하다", "I'm happy to do lunch shifts too.", "점심 근무도 기꺼이 할게요."),
        ln("Leave it with me", "제가 알아볼게요", "Leave it with me, I'll check the roster.", "제가 알아볼게요, 로스터 확인해 볼게요."),
        ln("learn the grill", "그릴 일을 배우다", "I'd love to learn the grill one day.", "언젠가 그릴 일도 배우고 싶어요."),
      ],
      [
        t("Got a minute? You wanted to chat?", "잠깐 시간 돼요? 할 얘기 있다고요?", "다음 주에 근무 시간을 더 받을 수 있는지 물어보세요", "Yes. Could I get more hours next week?", ["more hours", "extra shifts"]),
        t("Maybe. When are you free?", "아마도요. 언제 시간 돼요?", "화요일이랑 수요일에 시간 된다고 하세요", "I'm free on Tuesdays and Wednesdays.", ["free on", "Tuesdays"]),
        t("Lunches are slow, but I might need help with prep.", "점심은 한가한데, 프렙 도움은 필요할 수도 있어요.", "프렙도 기꺼이 하겠다고 하세요", "I'm happy to do prep too.", ["happy to do", "happy to help"]),
      ],
      o("Leave it with me. I'll let you know Thursday.", "제가 알아볼게요. 목요일에 알려 줄게요.")),
  ],
};

export default curriculum;
