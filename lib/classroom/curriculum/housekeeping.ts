import { L, ln, o, t, type JobCurriculum } from "./kit";

const curriculum: JobCurriculum = {
  steps: ["첫날 객실 기본", "매일 객실 청소", "손님·슈퍼바이저 요청", "문제·실수·안전", "바쁜 날 조율·인수인계"],
  lessons: [
    // ───────── STEP 1: 첫날 객실 기본 ─────────
    L("1", 1, "📋", "오늘 방 배정 받기", "체크아웃·스테이오버 확인하기·트롤리 준비하기", "슈퍼바이저",
      [
        ln("eight checkouts", "체크아웃 8개", "You've got eight checkouts and four stayovers today.", "오늘 체크아웃 8개, 스테이오버 4개예요.", "stayover = 연박 손님 방이에요."),
        ln("start with the checkout rooms", "체크아웃 방부터 시작하다", "Should I start with the checkout rooms?", "체크아웃 방부터 시작할까요?"),
        ln("turn over", "(방을) 정리해서 다음 손님 받게 하다", "Turn over the checkouts first, please.", "체크아웃 방부터 정리해 주세요."),
        ln("restock my trolley", "트롤리를 다시 채우다", "I'll restock my trolley before I head up.", "올라가기 전에 트롤리를 채워 둘게요."),
        ln("room sheet", "객실 배정표", "Can I grab a copy of my room sheet?", "제 객실 배정표 한 장 받을 수 있을까요?"),
      ],
      [
        t("Morning! You've got 12 rooms today. Eight checkouts and four stayovers.", "오늘 방 12개예요. 체크아웃 8개, 스테이오버 4개.", "체크아웃 방부터 할지 물어보세요", "Got it. Should I start with the checkout rooms?", ["checkout rooms", "start with"]),
        t("Yes. Turn over the checkouts first.", "네. 체크아웃 방부터 정리해요.", "먼저 트롤리를 채우겠다고 하세요", "Okay. I'll restock my trolley first.", ["restock my trolley", "restock", "fill my trolley"]),
        t("Great. Call me if you need anything.", "필요한 거 있으면 불러요.", "알겠다고, 고맙다고 하세요", "No worries, thanks.", ["no worries", "thanks", "thank you"]),
      ],
      o("Have a good one.", "수고해요.")),

    L("2", 1, "🚪", "손님 방 앞에서", "청소 시간 묻기·요청 받기", "투숙객",
      [
        ln("Is it okay to clean", "청소해도 될까요", "Is it okay to clean your room now?", "지금 방 청소해도 될까요?"),
        ln("What time is good", "몇 시가 좋으세요", "No problem. What time is good for you?", "괜찮아요. 몇 시가 좋으세요?"),
        ln("come back later", "나중에 다시 오다", "Could you come back later, please?", "나중에 다시 와 주실 수 있어요?"),
        ln("extra towels", "수건 추가", "Can I get some extra towels, please?", "수건 좀 더 받을 수 있을까요?"),
        ln("I'll come back after", "~ 이후에 다시 올게요", "Sure, I'll come back after lunch.", "네, 점심 이후에 다시 올게요."),
      ],
      [
        t("Oh, hi. Are you here to clean?", "아, 청소하러 오셨어요?", "네, 지금 방 청소해도 되는지 물어보세요", "Yes. Is it okay to clean your room now?", ["clean your room", "service your room"]),
        t("Could you come back later?", "나중에 와 줄 수 있어요?", "그럼요 하고 몇 시가 좋은지 물어보세요", "Of course. What time is good for you?", ["what time", "come back later"]),
        t("After 2, please. And can I get extra towels?", "2시 이후에요. 수건 더 받을 수 있어요?", "2시 이후에 수건 가지고 다시 오겠다고 하세요", "Sure. I'll come back after 2 with extra towels.", ["extra towels", "after 2"]),
      ],
      o("Perfect, thanks so much.", "좋아요, 정말 고마워요.")),

    L("6", 1, "👕", "첫 출근 락커·유니폼", "유니폼 받기·락커와 사인인 위치 묻기", "슈퍼바이저 Mel",
      [
        ln("What size are you", "사이즈가 어떻게 돼요", "Here's your uniform. What size are you?", "유니폼이에요. 사이즈가 어떻게 돼요?"),
        ln("a medium", "미디엄", "I think a medium should be fine.", "미디엄이면 될 것 같아요."),
        ln("Where's the locker room", "락커룸이 어디예요", "Sorry, where's the locker room?", "죄송한데, 락커룸이 어디예요?"),
        ln("sign in", "출근 기록하다", "Do I need to sign in somewhere?", "어디서 출근 기록을 해야 하나요?"),
        ln("enclosed shoes", "앞이 막힌 신발", "Make sure you wear enclosed shoes every shift.", "근무 때마다 꼭 앞이 막힌 신발을 신어요.", "호주 현장은 샌들·슬리퍼 금지예요."),
      ],
      [
        t("Welcome! Here's your uniform. What size are you?", "환영해요! 유니폼이에요. 사이즈가 어떻게 돼요?", "미디엄이면 될 것 같다고 하세요", "A medium should be fine, thanks.", ["a medium", "medium"]),
        t("Here you go. You can change in the back.", "여기요. 뒤에서 갈아입으면 돼요.", "락커룸이 어디인지 물어보세요", "Thanks. Where's the locker room?", ["locker room"]),
        t("Down the hall on the left. Lockers have a padlock.", "복도 끝 왼쪽이에요. 락커에 자물쇠 있어요.", "어디서 출근 기록을 하는지 물어보세요", "Great. Where do I sign in?", ["sign in", "clock in"]),
      ],
      o("At the iPad by the office. See you in five.", "사무실 옆 아이패드요. 5분 뒤에 봐요.")),

    L("7", 1, "✊", "노크하고 객실 들어가기", "하우스키핑이라고 알리기·손님 있으면 양해 구하기", "투숙객",
      [
        ln("Housekeeping", "하우스키핑이에요", "Knock knock, housekeeping!", "똑똑, 하우스키핑이에요!", "노크 두 번 + Housekeeping을 두 번 외쳐요."),
        ln("didn't realise you were in", "안에 계신 줄 몰랐어요", "Sorry, I didn't realise you were in.", "죄송해요, 안에 계신 줄 몰랐어요."),
        ln("Would you like me to", "제가 ~해 드릴까요", "Would you like me to come back later?", "제가 나중에 다시 올까요?"),
        ln("just a quick tidy", "간단한 정리만", "I'm happy with just a quick tidy today.", "오늘은 간단한 정리만 해 주시면 돼요."),
        ln("make the bed", "침대를 정리하다", "I'll just make the bed and empty the bins.", "침대만 정리하고 쓰레기통 비울게요."),
      ],
      [
        t("Oh! Hello?", "어! 누구세요?", "하우스키핑이라고 하고 안에 계신 줄 몰랐다고 사과하세요", "Housekeeping. Sorry, I didn't realise you were in.", ["didn't realise", "didn't know you were"]),
        t("That's okay. I'm just getting ready.", "괜찮아요. 준비 중이에요.", "나중에 다시 올지 물어보세요", "Would you like me to come back later?", ["come back later", "come back"]),
        t("No, just a quick tidy is fine.", "아뇨, 간단히 정리만 해 주면 돼요.", "침대 정리하고 쓰레기통만 비우겠다고 하세요", "No problem. I'll make the bed and empty the bins.", ["make the bed", "empty the bins"]),
      ],
      o("Lovely, thank you.", "좋아요, 고마워요.")),

    L("8", 1, "🗝️", "마스터키 받고 반납하기", "키 사인하기·잃어버리면 안 되는 규칙 듣기", "슈퍼바이저 Mel",
      [
        ln("master key", "마스터키", "This master key opens every room on level 3.", "이 마스터키로 3층 모든 방이 열려요."),
        ln("sign it out", "(빌려 갈 때) 서명하다", "You need to sign it out every morning.", "매일 아침 서명하고 가져가야 해요."),
        ln("keep it on you", "몸에 지니다", "Always keep it on you, never on the trolley.", "트롤리 말고 항상 몸에 지니세요.", "키를 트롤리에 두면 큰일 나요."),
        ln("hand it back", "돌려주다", "Where do I hand it back after my shift?", "근무 끝나고 어디에 반납하면 되나요?"),
        ln("let guests into", "손님을 들여보내다", "Never let guests into a room with your key.", "본인 키로 손님을 방에 들여보내면 절대 안 돼요."),
      ],
      [
        t("Here's your master key. You need to sign it out.", "마스터키예요. 서명하고 가져가야 해요.", "어디에 서명하는지 물어보세요", "Sure. Where do I sign it out?", ["sign it out", "sign"]),
        t("In this book. And always keep it on you.", "이 장부에요. 그리고 항상 몸에 지녀요.", "알겠다고, 트롤리에 두지 않겠다고 하세요", "Got it. I won't leave it on the trolley.", ["leave it on the trolley", "keep it on me"]),
        t("Good. If a guest asks you to open a door, say no.", "좋아요. 손님이 문 열어 달라고 하면 안 된다고 해요.", "프런트로 안내하면 되는지 물어보세요", "Okay. Should I send them to reception?", ["send them to reception", "reception"]),
        t("Exactly. Reception checks their ID.", "맞아요. 프런트에서 신분 확인해요.", "근무 끝나고 어디에 반납하는지 물어보세요", "Where do I hand it back after my shift?", ["hand it back", "return it"]),
      ],
      o("Right here, to me. Don't take it home!", "여기 저한테요. 집에 가져가면 안 돼요!")),

    L("9", 1, "🧭", "복도에서 손님 안내", "엘리베이터·조식 장소 알려 주기", "투숙객",
      [
        ln("Where's the lift", "엘리베이터가 어디예요", "Excuse me, where's the lift?", "실례지만, 엘리베이터가 어디예요?", "호주에선 elevator보다 lift를 많이 써요."),
        ln("just around the corner", "모퉁이 돌면 바로", "It's just around the corner on your right.", "모퉁이 돌면 오른쪽에 바로 있어요."),
        ln("served until", "~까지 제공되다", "Breakfast is served until ten on level one.", "조식은 1층에서 10시까지 제공돼요."),
        ln("ground floor", "1층(지상층)", "The restaurant is on the ground floor.", "레스토랑은 지상층에 있어요.", "호주 ground floor = 한국 1층이에요."),
        ln("I'm not sure, but", "잘 모르지만", "I'm not sure, but reception can help you.", "제가 잘은 모르지만, 프런트에서 도와드릴 거예요."),
      ],
      [
        t("Excuse me, where's the lift?", "실례지만, 엘리베이터 어디 있어요?", "모퉁이 돌면 오른쪽에 있다고 하세요", "It's just around the corner on your right.", ["around the corner", "on your right"]),
        t("Thanks. And where's breakfast?", "고마워요. 조식은 어디예요?", "지상층 레스토랑이고 10시까지라고 하세요", "On the ground floor, in the restaurant, until 10.", ["ground floor", "until 10"]),
        t("Great. Is there a gym too?", "좋네요. 헬스장도 있어요?", "잘 모르지만 프런트에서 도와줄 거라고 하세요", "I'm not sure, but reception can help you.", ["I'm not sure", "reception"]),
      ],
      o("No worries, I'll ask them. Thanks!", "괜찮아요, 물어볼게요. 고마워요!")),

    // ───────── STEP 2: 매일 객실 청소 ─────────
    L("3", 2, "🛏️", "동료와 객실 작업", "침대 시트·린넨 챙기기·방해 금지 방 처리하기", "동료",
      [
        ln("strip the beds", "침대 시트를 벗기다", "Can you strip the beds while I do the bathroom?", "제가 욕실 하는 동안 침대 시트 좀 벗겨 줄래요?"),
        ln("fresh sheets", "새 시트", "I put fresh sheets on both beds.", "침대 두 개 다 새 시트로 깔았어요."),
        ln("run out of pillowcases", "베갯잇이 다 떨어지다", "I've run out of pillowcases on my trolley.", "제 트롤리에 베갯잇이 다 떨어졌어요."),
        ln("linen room", "린넨실", "I'll grab some from the linen room.", "린넨실에서 좀 가져올게요."),
        ln("Do Not Disturb", "방해 금지", "Room 206 still has a Do Not Disturb sign.", "206호는 아직 방해 금지 팻말이 걸려 있어요.", "DND라고 줄여 말해요."),
      ],
      [
        t("Did you strip the beds in 204?", "204호 침대 시트 벗겼어요?", "네, 벗기고 새 시트로 깔았다고 하세요", "Yes, I stripped the beds and put on fresh sheets.", ["stripped the beds", "strip the beds"]),
        t("Nice. I've run out of pillowcases on my trolley.", "제 트롤리에 베갯잇이 다 떨어졌어요.", "린넨실에서 가져다주겠다고 하세요", "I'll grab some from the linen room for you.", ["linen room", "grab some"]),
        t("Thanks. 206 has a Do Not Disturb sign.", "206호에 방해 금지 팻말이 있어요.", "그럼 건너뛰고 나중에 다시 확인하자고 하세요", "Okay, let's skip it and check again later.", ["skip it", "check again later"]),
      ],
      o("Sounds good.", "좋아요.")),

    L("10", 2, "🛁", "욕실 청소 순서", "변기·샤워 유리·거울 닦는 순서 배우기", "동료 Priya",
      [
        ln("spray the toilet first", "변기에 먼저 세제를 뿌리다", "Spray the toilet first and let it sit.", "변기에 먼저 세제 뿌리고 잠깐 둬요."),
        ln("red cloth", "빨간 걸레", "Use the red cloth for the toilet only.", "빨간 걸레는 변기에만 써요.", "걸레 색깔별 구역이 정해져 있어요."),
        ln("squeegee the glass", "유리를 스퀴지로 닦다", "Squeegee the glass so there are no water marks.", "물자국 안 남게 유리를 스퀴지로 닦아요."),
        ln("hair in the drain", "배수구 머리카락", "Always check for hair in the drain.", "배수구에 머리카락 있는지 꼭 확인해요."),
        ln("top to bottom", "위에서 아래로", "I'll clean from top to bottom, right?", "위에서 아래로 닦으면 되죠?"),
      ],
      [
        t("Let's do the bathroom. What do you do first?", "욕실 해요. 뭐부터 해요?", "변기에 먼저 세제 뿌리고 둔다고 하세요", "I spray the toilet first and let it sit.", ["spray the toilet", "toilet first"]),
        t("Good. Which cloth for the toilet?", "좋아요. 변기엔 어떤 걸레요?", "빨간 걸레라고 하세요", "The red cloth, only for the toilet.", ["red cloth", "red one"]),
        t("Right. And the shower screen?", "맞아요. 샤워 유리는요?", "물자국 안 남게 스퀴지로 닦는다고 하세요", "I squeegee the glass so there are no marks.", ["squeegee", "no marks"]),
        t("Perfect. Don't forget the drain.", "완벽해요. 배수구 잊지 말고요.", "머리카락 확인하겠다고 하세요", "Sure, I'll check for hair in the drain.", ["hair in the drain", "check the drain"]),
      ],
      o("You're a natural.", "타고났네요.")),

    L("11", 2, "🧴", "어메니티·미니바 채우기", "샴푸·커피 채우기·미니바 사용 기록하기", "동료 Priya",
      [
        ln("top up the amenities", "어메니티를 채우다", "Top up the amenities in every bathroom.", "모든 욕실 어메니티를 채워 줘요."),
        ln("two of each", "하나씩 두 개", "Leave two of each, shampoo and conditioner.", "샴푸랑 린스 두 개씩 두세요."),
        ln("tea and coffee", "차와 커피", "Restock the tea and coffee on the tray.", "트레이에 차랑 커피를 다시 채워요."),
        ln("minibar sheet", "미니바 기록지", "Write anything used on the minibar sheet.", "쓴 건 전부 미니바 기록지에 적어요."),
        ln("guest drank", "손님이 마셨다", "The guest drank two beers from the fridge.", "손님이 냉장고에서 맥주 두 병 마셨어요."),
      ],
      [
        t("Did you top up the amenities in 305?", "305호 어메니티 채웠어요?", "네, 샴푸랑 린스 두 개씩 뒀다고 하세요", "Yes, I left two of each, shampoo and conditioner.", ["two of each", "topped up"]),
        t("What about the tea and coffee?", "차랑 커피는요?", "그것도 다시 채웠다고 하세요", "I restocked the tea and coffee too.", ["tea and coffee", "restocked"]),
        t("And the minibar?", "미니바는요?", "손님이 맥주 두 병 마셔서 기록지에 적었다고 하세요", "The guest drank two beers. I wrote it on the minibar sheet.", ["minibar sheet", "two beers"]),
      ],
      o("Good stuff. Reception will charge them.", "잘했어요. 프런트에서 청구할 거예요.")),

    L("12", 2, "🧹", "청소기·먼지 마무리", "침대 밑 청소하기·먼지 확인하기", "슈퍼바이저 Mel",
      [
        ln("vacuum under the bed", "침대 밑을 청소기로 밀다", "Don't forget to vacuum under the bed.", "침대 밑 청소기 돌리는 거 잊지 마요."),
        ln("dust the skirting boards", "걸레받이 먼지를 닦다", "Dust the skirting boards once a week.", "걸레받이 먼지는 일주일에 한 번 닦아요."),
        ln("work backwards", "뒤로 물러나며 하다", "Vacuum from the window and work backwards to the door.", "창문부터 시작해서 문 쪽으로 뒤로 물러나며 청소기 돌려요."),
        ln("fingerprints on the mirror", "거울에 지문", "There are still fingerprints on the mirror.", "거울에 아직 지문이 있어요."),
        ln("give it another wipe", "한 번 더 닦다", "I'll give it another wipe now.", "지금 한 번 더 닦을게요."),
      ],
      [
        t("Did you vacuum under the bed?", "침대 밑 청소기 돌렸어요?", "아직이라고, 지금 하겠다고 하세요", "Not yet. I'll vacuum under the bed now.", ["vacuum under the bed", "under the bed"]),
        t("Start at the window and work backwards.", "창문부터 시작해서 뒤로 물러나며 해요.", "알겠다고, 문 쪽으로 가며 하겠다고 하세요", "Got it, from the window back to the door.", ["back to the door", "work backwards"]),
        t("Also, there are fingerprints on the mirror.", "그리고 거울에 지문이 있어요.", "죄송하다고, 한 번 더 닦겠다고 하세요", "Sorry, I'll give it another wipe.", ["another wipe", "wipe it again"]),
      ],
      o("Thanks. Small things make a big difference.", "고마워요. 작은 게 큰 차이를 만들어요.")),

    L("13", 2, "🧺", "스테이오버 방 정리", "손님 물건 그대로 두기·수건 교체 여부 확인하기", "동료 Priya",
      [
        ln("leave their things", "손님 물건을 그대로 두다", "In stayovers, leave their things where they are.", "스테이오버 방은 손님 물건을 그 자리에 둬요."),
        ln("towels on the floor", "바닥에 있는 수건", "Towels on the floor mean they want new ones.", "바닥에 수건이 있으면 새 걸 원한다는 뜻이에요."),
        ln("hung up", "걸어 둔", "If it's hung up, they'll use it again.", "걸려 있으면 다시 쓰겠다는 거예요."),
        ln("fold their clothes", "손님 옷을 개다", "Should I fold their clothes on the bed?", "침대 위 손님 옷을 개야 하나요?"),
        ln("don't touch", "손대지 마세요", "Don't touch laptops, cash or paperwork.", "노트북, 현금, 서류는 손대지 마요."),
      ],
      [
        t("This is a stayover. Leave their things where they are.", "스테이오버예요. 손님 물건은 그대로 둬요.", "침대 위 옷을 개야 하는지 물어보세요", "Okay. Should I fold their clothes on the bed?", ["fold their clothes", "fold"]),
        t("Just move them neatly to the chair. Don't touch the laptop.", "의자로 깔끔하게 옮기기만 해요. 노트북은 건드리지 말고요.", "알겠다고, 노트북은 안 건드리겠다고 하세요", "Got it, I won't touch the laptop.", ["won't touch", "not touch"]),
        t("There are towels on the floor. What does that mean?", "바닥에 수건이 있어요. 무슨 뜻이죠?", "새 수건을 원한다는 뜻이라고 하세요", "They want new towels.", ["new towels", "fresh towels"]),
      ],
      o("Exactly. And hung up means reuse.", "맞아요. 걸려 있으면 다시 쓴다는 거고요.")),

    L("14", 2, "✅", "청소 끝난 방 보고하기", "방 상태 바꾸기·검수 요청하기", "슈퍼바이저 Mel (무전)",
      [
        ln("is ready for inspection", "검수 준비가 됐어요", "Room 410 is ready for inspection.", "410호 검수 준비 됐어요."),
        ln("on the radio", "무전으로", "Just call me on the radio when you finish.", "끝나면 무전으로 불러요."),
        ln("update the status", "상태를 바꾸다", "Update the status on the app to clean.", "앱에서 상태를 '청소 완료'로 바꿔요."),
        ln("I'm moving on to", "~로 넘어가요", "I'm moving on to 412 now.", "이제 412호로 넘어가요."),
        ln("over", "(무전) 이상", "Copy that, 410 is done, over.", "알겠어요, 410호 끝났어요, 이상.", "무전 끝에 over를 붙여요."),
      ],
      [
        t("Mel here. How's 410 going? Over.", "Mel이에요. 410호 어때요? 이상.", "410호 검수 준비 됐다고 하세요", "410 is ready for inspection, over.", ["ready for inspection", "ready"]),
        t("Great. Did you update the status? Over.", "좋아요. 상태 바꿨어요? 이상.", "네, 앱에서 바꿨다고 하세요", "Yes, I updated it on the app, over.", ["updated it", "update"]),
        t("Thanks. Where are you heading next?", "고마워요. 다음엔 어디로 가요?", "이제 412호로 넘어간다고 하세요", "I'm moving on to 412 now.", ["moving on to", "412"]),
      ],
      o("Copy. I'll check 410 in ten.", "알겠어요. 10분 뒤에 410호 볼게요.")),

    // ───────── STEP 3: 손님·슈퍼바이저 요청 ─────────
    L("4", 3, "🔎", "분실물 찾았을 때", "분실물 보고하기·남은 방 말하기", "슈퍼바이저",
      [
        ln("found a phone charger", "휴대폰 충전기를 찾다", "I found a phone charger in room 310.", "310호에서 휴대폰 충전기를 찾았어요."),
        ln("lost property", "분실물 보관소", "Please take it to lost property.", "분실물 보관소에 갖다 둬요.", "호주에선 lost and found보다 lost property를 써요."),
        ln("left behind", "두고 간", "A guest left behind a jacket in the wardrobe.", "손님이 옷장에 재킷을 두고 갔어요."),
        ln("rooms are left", "방이 남다", "How many rooms are left on your sheet?", "배정표에 방 몇 개 남았어요?"),
        ln("finish up by", "~까지 끝내다", "I'll finish up by three.", "3시까지 끝낼게요."),
      ],
      [
        t("How's it going?", "어떻게 돼 가요?", "310호에서 휴대폰 충전기를 찾았다고 하세요", "Good. I found a phone charger in room 310.", ["found a phone charger", "found a charger"]),
        t("Okay. Take it to lost property.", "분실물 보관소에 갖다 둬요.", "분실물 보관소에 가져가겠다고 하세요", "Sure, I'll take it to lost property.", ["lost property"]),
        t("Thanks. How many rooms are left?", "방 몇 개 남았어요?", "세 개 남았고 3시까지 끝낸다고 하세요", "Three rooms left. I'll finish up by 3.", ["finish up", "three rooms", "3 rooms"]),
      ],
      o("Great work.", "잘했어요.")),

    L("15", 3, "👶", "아기 침대 요청", "아기 침대·엑스트라 베드 설치 약속하기", "투숙객",
      [
        ln("a cot", "아기 침대", "Could we get a cot for our baby?", "아기 침대 하나 받을 수 있을까요?", "호주에선 crib 대신 cot이라고 해요."),
        ln("rollaway bed", "접이식 보조 침대", "Is there a rollaway bed for our son?", "아들 쓸 접이식 보조 침대 있어요?"),
        ln("set it up", "설치하다", "I'll set it up by the window for you.", "창가 쪽에 설치해 드릴게요."),
        ln("extra charge", "추가 요금", "There might be an extra charge for that.", "그건 추가 요금이 있을 수도 있어요."),
        ln("within half an hour", "30분 안에", "I'll bring it up within half an hour.", "30분 안에 가져다드릴게요."),
      ],
      [
        t("Hi, could we get a cot for our baby?", "안녕하세요, 아기 침대 하나 받을 수 있을까요?", "그럼요, 30분 안에 가져다주겠다고 하세요", "Of course. I'll bring one up within half an hour.", ["half an hour", "30 minutes"]),
        t("And a rollaway bed for our son?", "아들 쓸 보조 침대도요?", "추가 요금이 있을 수 있어서 프런트에 확인하겠다고 하세요", "There might be an extra charge. I'll check with reception.", ["extra charge", "check with reception"]),
        t("That's fine. Where will you put the cot?", "괜찮아요. 아기 침대는 어디에 둘 거예요?", "창가 쪽에 설치하겠다고 하세요", "I'll set it up by the window.", ["set it up", "by the window"]),
      ],
      o("Perfect, that'd be great.", "완벽해요, 그러면 좋겠어요.")),

    L("16", 3, "⏰", "늦은 체크아웃 방", "레이트 체크아웃 확인하기·순서 바꾸기", "동료 Sam",
      [
        ln("late checkout", "늦은 체크아웃", "Room 508 has a late checkout at 1.", "508호는 1시 늦은 체크아웃이에요."),
        ln("leave it till last", "마지막으로 미루다", "Let's leave it till last, then.", "그럼 그 방은 마지막으로 미뤄요."),
        ln("still in the room", "아직 방에 있는", "The guest is still in the room packing.", "손님이 아직 방에서 짐 싸고 있어요."),
        ln("early check-in", "이른 체크인", "The next guest wants an early check-in.", "다음 손님이 일찍 체크인하고 싶어 해요."),
        ln("swap rooms", "방을 바꾸다", "Can we swap rooms so I do 506 first?", "방을 바꿔서 제가 506호 먼저 해도 될까요?"),
      ],
      [
        t("Heads up, 508 has a late checkout at 1.", "참고로 508호는 1시 늦은 체크아웃이에요.", "그럼 그 방은 마지막으로 미루자고 하세요", "Okay, let's leave it till last.", ["leave it till last", "do it last"]),
        t("But 506 has an early check-in at 12.", "근데 506호는 12시 이른 체크인이 있어요.", "방을 바꿔서 506호를 먼저 해도 되는지 물어보세요", "Can we swap rooms so I do 506 first?", ["swap rooms", "506 first"]),
        t("Sure, I'll take 510 instead.", "좋아요, 제가 대신 510호 할게요.", "고맙다고, 506호 끝나면 무전하겠다고 하세요", "Thanks. I'll radio you when 506 is done.", ["radio you", "let you know"]),
      ],
      o("Legend. Talk soon.", "최고예요. 이따 봐요.")),

    L("17", 3, "🛌", "베개 추가 요청 전화", "베개 종류 묻기·저자극 베개 가져다주기", "투숙객 (전화)",
      [
        ln("firm or soft", "단단한 거 아니면 푹신한 거", "Would you like a firm or soft pillow?", "단단한 베개 드릴까요, 푹신한 베개 드릴까요?"),
        ln("allergic to feathers", "깃털 알레르기가 있다", "I'm allergic to feathers, actually.", "사실 저 깃털 알레르기가 있어요."),
        ln("hypoallergenic pillow", "저자극 베개", "We have a hypoallergenic pillow for you.", "손님께 드릴 저자극 베개가 있어요."),
        ln("an extra blanket", "담요 하나 더", "Can I also get an extra blanket?", "담요도 하나 더 받을 수 있을까요?"),
        ln("on my way up", "올라가는 중이에요", "No worries, I'm on my way up now.", "알겠습니다, 지금 바로 올라갈게요."),
      ],
      [
        t("Hi, can I get another pillow in 702?", "702호인데요, 베개 하나 더 받을 수 있어요?", "단단한 거랑 푹신한 거 중에 뭘 원하는지 물어보세요", "Sure. Would you like a firm or soft pillow?", ["firm or soft", "soft or firm"]),
        t("Soft, but I'm allergic to feathers.", "푹신한 거요, 근데 깃털 알레르기가 있어요.", "저자극 베개가 있다고 하세요", "No problem, we have a hypoallergenic pillow.", ["hypoallergenic", "no feathers"]),
        t("Great. Can I also get an extra blanket?", "좋아요. 담요도 하나 더 될까요?", "그럼요, 지금 둘 다 가지고 올라간다고 하세요", "Of course. I'm on my way up with both.", ["on my way up", "bring both"]),
      ],
      o("You're a lifesaver.", "덕분에 살았어요.")),

    L("18", 3, "🌱", "수건 교체 원치 않는 손님", "친환경 옵션 존중하기·침대만 정리하기", "투숙객",
      [
        ln("don't need new towels", "새 수건 필요 없어요", "We don't need new towels every day.", "매일 새 수건은 필요 없어요."),
        ln("skip the sheets", "시트 교체를 건너뛰다", "Please skip the sheets this time.", "이번엔 시트 교체는 안 해 주셔도 돼요."),
        ln("green option", "친환경 옵션", "Thanks for choosing the green option.", "친환경 옵션을 선택해 주셔서 고마워요.", "호텔마다 eco/green program이 있어요."),
        ln("bins and a tidy", "쓰레기통이랑 간단한 정리", "I'll just do the bins and a tidy.", "쓰레기통이랑 간단한 정리만 할게요."),
        ln("hang this on the door", "이걸 문에 걸다", "Just hang this on the door if you change your mind.", "마음 바뀌시면 이걸 문에 걸어 주세요."),
      ],
      [
        t("Hi, we don't need new towels or sheets today.", "안녕하세요, 오늘 수건이랑 시트 안 바꿔도 돼요.", "친환경 옵션 고맙다고 하세요", "No problem, thanks for choosing the green option.", ["green option", "thanks for"]),
        t("Can you still empty the bins?", "쓰레기통은 비워 줄 수 있어요?", "쓰레기통이랑 간단한 정리만 하겠다고 하세요", "Sure, I'll just do the bins and a tidy.", ["bins and a tidy", "empty the bins"]),
        t("What if we want towels tomorrow?", "내일 수건 필요하면요?", "이 카드를 문에 걸면 된다고 하세요", "Just hang this card on the door.", ["hang this card", "on the door"]),
      ],
      o("Easy. Thanks heaps.", "쉽네요. 정말 고마워요.")),

    L("19", 3, "🧐", "슈퍼바이저 검수 지적", "놓친 부분 듣기·다시 하기", "슈퍼바이저 Mel",
      [
        ln("failed inspection", "검수에서 떨어졌어요", "Room 207 failed inspection, sorry.", "207호가 검수에서 떨어졌어요, 미안해요."),
        ln("missed a spot", "한 군데를 놓치다", "You missed a spot behind the toilet.", "변기 뒤를 한 군데 놓쳤어요."),
        ln("hospital corners", "침대 시트 모서리 접기", "The bed needs proper hospital corners.", "침대 시트 모서리를 제대로 접어야 해요."),
        ln("fix it right away", "바로 고치다", "Thanks for telling me. I'll fix it right away.", "알려 줘서 고마워요. 바로 고칠게요."),
        ln("show me how", "어떻게 하는지 보여 주다", "Could you show me how to do the corners?", "모서리 어떻게 접는지 보여 주실 수 있어요?"),
      ],
      [
        t("Hey, 207 failed inspection. You missed a spot behind the toilet.", "207호 검수에서 떨어졌어요. 변기 뒤를 놓쳤어요.", "알려 줘서 고맙다고, 바로 고치겠다고 하세요", "Thanks for telling me. I'll fix it right away.", ["fix it right away", "fix it now"]),
        t("Also, the bed needs proper hospital corners.", "그리고 침대 모서리를 제대로 접어야 해요.", "어떻게 하는지 보여 줄 수 있는지 물어보세요", "Could you show me how to do them?", ["show me how", "show me"]),
        t("Sure. Fold it like this, then tuck it in tight.", "그럼요. 이렇게 접고 꽉 끼워 넣어요.", "알겠다고, 다음부터 그렇게 하겠다고 하세요", "Got it. I'll do it like that from now on.", ["from now on", "next time"]),
      ],
      o("Good. You're getting faster too.", "좋아요. 속도도 빨라지고 있어요.")),

    // ───────── STEP 4: 문제·실수·안전 ─────────
    L("5", 4, "🚿", "샤워기가 고장 난 방", "불편 사과하기·매니저에게 알리기", "투숙객",
      [
        ln("isn't working", "작동이 안 돼요", "The shower in my room isn't working.", "제 방 샤워기가 작동이 안 돼요."),
        ln("really sorry about that", "정말 죄송해요", "I'm really sorry about that.", "그건 정말 죄송해요."),
        ln("let my manager know", "매니저에게 알리다", "I'll let my manager know right now.", "지금 바로 매니저에게 알릴게요."),
        ln("maintenance", "시설 관리팀", "I'll log it with maintenance too.", "시설 관리팀에도 접수해 둘게요."),
        ln("be up soon", "곧 올라가다", "Someone will be up soon to have a look.", "곧 누가 올라가서 봐 드릴 거예요."),
      ],
      [
        t("Hi, the shower in my room isn't working.", "방 샤워기가 안 돼요.", "불편을 드려 정말 죄송하다고 하세요", "I'm really sorry about that.", ["really sorry", "so sorry"]),
        t("Can someone fix it today?", "오늘 고칠 수 있어요?", "지금 바로 매니저에게 알리겠다고 하세요", "I'll let my manager know right now.", ["let my manager know", "tell my manager", "get my manager"]),
        t("Thanks. I'm in room 512.", "512호예요.", "512호 맞다고 하고 곧 누가 올라갈 거라고 하세요", "Room 512, got it. Someone will be up soon.", ["be up soon", "512"]),
      ],
      o("Thank you.", "고마워요.")),

    L("20", 4, "🧤", "세제 다룰 때 안전", "장갑 끼기·세제 섞지 않기", "슈퍼바이저 Mel",
      [
        ln("wear gloves", "장갑을 끼다", "Always wear gloves with the bathroom spray.", "욕실 스프레이 쓸 땐 항상 장갑 껴요."),
        ln("never mix bleach", "표백제를 절대 섞지 않다", "Never mix bleach with other chemicals.", "표백제는 절대 다른 약품이랑 섞지 마요.", "섞으면 유독가스가 나와요."),
        ln("unlabelled bottle", "라벨 없는 병", "Don't use an unlabelled bottle, ever.", "라벨 없는 병은 절대 쓰지 마요."),
        ln("in my eye", "눈에 (들어가다)", "I got some spray in my eye.", "스프레이가 눈에 좀 들어갔어요."),
        ln("eyewash station", "눈 세척대", "The eyewash station is next to the laundry.", "눈 세척대는 세탁실 옆에 있어요."),
      ],
      [
        t("Are you wearing gloves?", "장갑 꼈어요?", "아뇨, 지금 끼겠다고 하세요", "Not yet, I'll put them on now.", ["put them on", "wear gloves"]),
        t("Good. And never mix bleach with other sprays.", "좋아요. 그리고 표백제는 절대 다른 스프레이랑 섞지 마요.", "이 라벨 없는 병은 뭔지 물어보세요", "Okay. What's in this unlabelled bottle?", ["unlabelled bottle", "no label"]),
        t("No idea. Don't use it. Bring it to me.", "몰라요. 쓰지 말고 저한테 가져와요.", "알겠다고, 눈 세척대는 어디 있는지 물어보세요", "Will do. Where's the eyewash station, just in case?", ["eyewash station", "eye wash"]),
      ],
      o("Next to the laundry. Safety first.", "세탁실 옆이에요. 안전이 먼저예요.")),

    L("21", 4, "💉", "주사바늘 발견", "만지지 않기·샤프스 통 요청하기", "슈퍼바이저 Mel (무전)",
      [
        ln("found a needle", "주사바늘을 발견하다", "I found a needle in the bin in 609.", "609호 쓰레기통에서 주사바늘을 발견했어요."),
        ln("don't touch it", "만지지 마세요", "Don't touch it. I'm bringing the sharps kit.", "만지지 마요. 제가 샤프스 키트 가져갈게요."),
        ln("sharps container", "주사바늘 수거통", "Use the tongs and the sharps container.", "집게랑 주사바늘 수거통을 써요.", "sharps = 주사바늘·칼날류예요."),
        ln("stay with the room", "방을 지키고 있다", "I'll stay with the room until you get here.", "오실 때까지 방에 있을게요."),
        ln("incident report", "사고 보고서", "We'll fill out an incident report after.", "끝나고 사고 보고서 작성해요."),
      ],
      [
        t("Mel here. What's up?", "Mel이에요. 무슨 일이에요?", "609호 쓰레기통에서 주사바늘을 발견했다고 하세요", "I found a needle in the bin in 609.", ["found a needle", "needle"]),
        t("Don't touch it. I'm bringing the sharps kit.", "만지지 마요. 샤프스 키트 가져갈게요.", "알겠다고, 올 때까지 방에 있겠다고 하세요", "Okay. I'll stay with the room till you get here.", ["stay with the room", "stay here"]),
        t("Thanks. We'll do an incident report after.", "고마워요. 끝나고 사고 보고서 써요.", "알겠다고, 몇 시에 발견했는지 적어 두겠다고 하세요", "Sure. I'll note the time I found it.", ["note the time", "write down the time"]),
      ],
      o("Good thinking. Be there in two.", "잘 생각했어요. 2분 안에 갈게요.")),

    L("22", 4, "🥛", "컵을 깨뜨렸을 때", "실수 인정하기·유리 조각 안전하게 치우기", "동료 Sam",
      [
        ln("broke a glass", "유리컵을 깨다", "Sorry, I just broke a glass in 304.", "죄송해요, 방금 304호에서 유리컵을 깼어요."),
        ln("dustpan and brush", "쓰레받기와 빗자루", "Grab the dustpan and brush from my trolley.", "제 트롤리에서 쓰레받기랑 빗자루 가져와요."),
        ln("wrap it in newspaper", "신문지에 싸다", "Wrap it in newspaper before it goes in the bin.", "쓰레기통에 넣기 전에 신문지에 싸요."),
        ln("did you cut yourself", "베였어요", "Are you okay? Did you cut yourself?", "괜찮아요? 베였어요?"),
        ln("replace it", "새것으로 바꾸다", "I'll replace it from the store room.", "창고에서 새것으로 갖다 놓을게요."),
      ],
      [
        t("What was that noise?", "방금 무슨 소리예요?", "죄송하다고, 유리컵을 깼다고 하세요", "Sorry, I just broke a glass.", ["broke a glass", "broke a cup"]),
        t("Oh no. Did you cut yourself?", "어떡해요. 베였어요?", "괜찮다고, 쓰레받기랑 빗자루가 어디 있는지 물어보세요", "I'm fine. Where's the dustpan and brush?", ["dustpan and brush", "dustpan"]),
        t("On my trolley. Wrap the glass in newspaper.", "제 트롤리에요. 유리는 신문지에 싸요.", "알겠다고, 창고에서 새 컵 갖다 놓겠다고 하세요", "Will do. I'll replace it from the store room.", ["replace it", "new one"]),
      ],
      o("No dramas. Happens to everyone.", "괜찮아요. 누구나 그래요.")),

    L("23", 4, "🆘", "며칠째 방해 금지인 방", "웰페어 체크 요청하기·혼자 들어가지 않기", "슈퍼바이저 Mel",
      [
        ln("for three days", "3일째", "Room 715 has had a DND sign for three days.", "715호가 3일째 방해 금지 팻말이 걸려 있어요."),
        ln("no answer", "대답이 없다", "I knocked twice but there's no answer.", "두 번 노크했는데 대답이 없어요."),
        ln("welfare check", "안부 확인", "We should do a welfare check.", "안부 확인을 해야 할 것 같아요.", "호주 호텔은 보통 2~3일마다 해요."),
        ln("go in alone", "혼자 들어가다", "Don't go in alone. Wait for me.", "혼자 들어가지 마요. 저 기다려요."),
        ln("I'll wait outside", "밖에서 기다릴게요", "Okay, I'll wait outside the door.", "알겠어요, 문 밖에서 기다릴게요."),
      ],
      [
        t("Anything I should know about?", "제가 알아야 할 거 있어요?", "715호가 3일째 방해 금지라고 하세요", "Room 715 has had a DND sign for three days.", ["three days", "3 days"]),
        t("Hmm. Did you knock?", "음. 노크해 봤어요?", "두 번 했는데 대답이 없었다고 하세요", "I knocked twice, but there's no answer.", ["no answer", "knocked twice"]),
        t("Okay, we'll do a welfare check. Don't go in alone.", "알겠어요, 안부 확인해요. 혼자 들어가지 마요.", "알겠다고, 문 밖에서 기다리겠다고 하세요", "Got it. I'll wait outside the door.", ["wait outside", "wait for you"]),
      ],
      o("Good call. I'm coming up with security.", "잘 판단했어요. 경비랑 같이 올라갈게요.")),

    L("24", 4, "🤕", "매트리스 들다 허리 삐끗", "통증 보고하기·도움 요청하기", "슈퍼바이저 Mel",
      [
        ln("hurt my back", "허리를 다치다", "I think I hurt my back lifting the mattress.", "매트리스 들다가 허리를 다친 것 같아요."),
        ln("ask for a hand", "도와 달라고 하다", "Always ask for a hand with heavy stuff.", "무거운 건 항상 도와 달라고 해요."),
        ln("bend your knees", "무릎을 굽히다", "Bend your knees, not your back.", "허리 말고 무릎을 굽혀요."),
        ln("take a break", "쉬다", "Take a break and sit down for a bit.", "좀 쉬면서 잠깐 앉아 있어요."),
        ln("workers comp", "산재 보상", "Report it today in case you need workers comp.", "산재 보상이 필요할 수 있으니 오늘 보고해요.", "호주 산재 = workers' compensation."),
      ],
      [
        t("You look sore. What happened?", "아파 보이네요. 무슨 일이에요?", "매트리스 들다가 허리를 다친 것 같다고 하세요", "I think I hurt my back lifting the mattress.", ["hurt my back", "back hurts"]),
        t("Did you lift it alone?", "혼자 들었어요?", "네, 다음엔 도와 달라고 하겠다고 하세요", "Yes. Next time I'll ask for a hand.", ["ask for a hand", "ask for help"]),
        t("Please do. Take a break, and we'll write it up.", "꼭 그래요. 좀 쉬고, 보고서 써요.", "고맙다고, 남은 방 두 개는 누가 하는지 물어보세요", "Thanks. Who'll do my last two rooms?", ["last two rooms", "my rooms"]),
      ],
      o("Sam will cover them. Look after yourself.", "Sam이 맡을 거예요. 몸 잘 챙겨요.")),

    // ───────── STEP 5: 바쁜 날 조율·인수인계 ─────────
    L("25", 5, "🏃", "체크아웃 몰린 일요일", "우선순위 정하기·도움 요청하기", "슈퍼바이저 Mel",
      [
        ln("fully booked", "만실", "We're fully booked tonight, so it's a big one.", "오늘 밤 만실이라 바쁜 날이에요."),
        ln("priority rooms", "우선 객실", "These five are priority rooms for early arrivals.", "이 다섯 개는 일찍 오는 손님용 우선 객실이에요."),
        ln("I'm falling behind", "뒤처지고 있어요", "Sorry, I'm falling behind on my rooms.", "죄송해요, 제 방들이 밀리고 있어요."),
        ln("send someone to help", "도와줄 사람을 보내다", "Can you send someone to help on level 6?", "6층에 도와줄 사람 보내 줄 수 있어요?"),
        ln("by 2 at the latest", "늦어도 2시까지", "I'll have them done by 2 at the latest.", "늦어도 2시까지 끝내 놓을게요."),
      ],
      [
        t("We're fully booked. These five are priority rooms.", "만실이에요. 이 다섯 개가 우선 객실이에요.", "그 다섯 개부터 하겠다고 하세요", "Okay, I'll do those five first.", ["those five first", "five first"]),
        t("How are you tracking?", "어떻게 진행되고 있어요?", "뒤처지고 있다고, 도와줄 사람 보내 줄 수 있는지 물어보세요", "I'm falling behind. Can you send someone to help?", ["falling behind", "send someone"]),
        t("I'll send Sam. When can you finish the priority ones?", "Sam 보낼게요. 우선 객실은 언제 끝나요?", "늦어도 2시까지 끝내겠다고 하세요", "By 2 at the latest.", ["at the latest", "by 2"]),
      ],
      o("Great. Hang in there.", "좋아요. 조금만 버텨요.")),

    L("26", 5, "🤒", "동료가 아파서 결근", "남은 방 나누기·층 정리하기", "동료 Sam",
      [
        ln("called in sick", "병가 연락을 하다", "Priya called in sick this morning.", "Priya가 오늘 아침에 아프다고 연락했어요."),
        ln("split her rooms", "그녀의 방을 나누다", "Let's split her rooms between us.", "그녀 방을 우리끼리 나눠요."),
        ln("odd numbers", "홀수", "I'll take the odd numbers on level 4.", "제가 4층 홀수 방 맡을게요."),
        ln("share the trolley", "트롤리를 같이 쓰다", "We can share the trolley in the middle.", "가운데에서 트롤리 같이 쓰면 돼요."),
        ln("check in at lunch", "점심때 상황을 맞춰 보다", "Let's check in at lunch and see how we're going.", "점심때 어떻게 돼 가는지 맞춰 봐요."),
      ],
      [
        t("Priya called in sick. She had 10 rooms on level 4.", "Priya가 병가래요. 4층에 방이 10개 있었어요.", "그 방을 우리끼리 나누자고 하세요", "Let's split her rooms between us.", ["split her rooms", "split them"]),
        t("Good idea. Which ones do you want?", "좋아요. 어떤 거 할래요?", "홀수 방을 맡겠다고 하세요", "I'll take the odd numbers.", ["odd numbers", "odd ones"]),
        t("Cool, I'll do the evens.", "좋아요, 전 짝수 할게요.", "점심때 진행 상황 맞춰 보자고 하세요", "Great. Let's check in at lunch.", ["check in at lunch", "at lunch"]),
      ],
      o("Deal. Let's smash it.", "좋아요. 빨리 끝내 봐요.")),

    L("27", 5, "⭐", "VIP 손님 방 준비", "웰컴 세팅 확인하기·마지막 점검하기", "슈퍼바이저 Mel",
      [
        ln("VIP arriving", "VIP 도착", "We've got a VIP arriving at 3 in 801.", "3시에 801호로 VIP가 도착해요."),
        ln("welcome pack", "웰컴 세트", "Put the welcome pack on the desk.", "웰컴 세트는 책상 위에 둬요."),
        ln("turn the aircon on", "에어컨을 켜다", "Turn the aircon on twenty minutes before.", "20분 전에 에어컨 켜 둬요.", "호주에선 aircon이라고 많이 해요."),
        ln("final check", "마지막 점검", "Can you do a final check with me?", "저랑 마지막 점검 같이 해 주실래요?"),
        ln("spotless", "티끌 하나 없는", "Everything needs to be spotless.", "전부 티끌 하나 없어야 해요."),
      ],
      [
        t("We've got a VIP arriving at 3 in 801.", "3시에 801호로 VIP가 도착해요.", "웰컴 세트는 어디에 두는지 물어보세요", "Okay. Where should I put the welcome pack?", ["welcome pack", "welcome gift"]),
        t("On the desk. And turn the aircon on before they arrive.", "책상 위요. 그리고 도착 전에 에어컨 켜 둬요.", "2시 40분에 에어컨 켜겠다고 하세요", "Got it. I'll turn the aircon on at 2:40.", ["aircon on", "air con"]),
        t("Perfect. Anything else?", "완벽해요. 다른 건요?", "끝나면 같이 마지막 점검해 줄 수 있는지 물어보세요", "Could you do a final check with me when I'm done?", ["final check", "check it with me"]),
      ],
      o("Of course. Give me a shout.", "그럼요. 불러요.")),

    L("28", 5, "📝", "턴다운 팀 인수인계", "남은 요청·특이사항 넘기기", "저녁 근무 Tom",
      [
        ln("handover", "인수인계", "Here's the handover for level 5.", "5층 인수인계예요."),
        ln("still waiting on", "아직 ~를 기다리는", "Room 503 is still waiting on a cot.", "503호는 아직 아기 침대를 기다리고 있어요."),
        ln("asked for turndown at", "~시에 턴다운을 요청했다", "Room 510 asked for turndown at 8.", "510호는 8시에 턴다운을 요청했어요.", "turndown = 저녁 침대 정리 서비스예요."),
        ln("out of order", "고장 난 / 사용 불가", "512 is out of order, the shower's broken.", "512호는 샤워기 고장으로 사용 불가예요."),
        ln("in the log", "일지에", "I've written it all in the log too.", "일지에도 다 적어 뒀어요."),
      ],
      [
        t("Hey, what's the handover for level 5?", "5층 인수인계 뭐예요?", "503호가 아직 아기 침대를 기다린다고 하세요", "Room 503 is still waiting on a cot.", ["still waiting on", "waiting for"]),
        t("Okay, I'll bring it up. Anything else?", "알겠어요, 갖다줄게요. 또 있어요?", "510호가 8시에 턴다운 요청했고 512호는 사용 불가라고 하세요", "510 wants turndown at 8, and 512 is out of order.", ["out of order", "turndown at 8"]),
        t("Got it. Is that all in the log?", "알겠어요. 다 일지에 있어요?", "네, 다 적어 뒀다고 하세요", "Yes, I've written it all in the log.", ["in the log", "written it"]),
      ],
      o("Legend. Have a good night.", "최고예요. 좋은 밤 보내요.")),

    L("29", 5, "🔄", "로스터 바꾸기 부탁", "근무 교대 부탁하기·매니저 승인 받기", "동료 Sam",
      [
        ln("swap shifts", "근무를 바꾸다", "Any chance we could swap shifts on Saturday?", "혹시 토요일 근무 바꿀 수 있을까요?"),
        ln("I've got an appointment", "약속이 있어요", "I've got an appointment in the morning.", "오전에 약속이 있어요."),
        ln("I'll take your Tuesday", "당신 화요일 근무를 제가 할게요", "I'll take your Tuesday in return.", "대신 당신 화요일 근무를 제가 할게요."),
        ln("run it by", "~에게 확인받다", "We should run it by Mel first.", "Mel한테 먼저 확인받아야 해요."),
        ln("the new roster", "새 로스터", "Mel will update the new roster tonight.", "Mel이 오늘 밤에 새 로스터를 고칠 거예요."),
      ],
      [
        t("What's up? You look like you need something.", "무슨 일이에요? 뭔가 필요해 보이네요.", "토요일 근무 바꿀 수 있는지 물어보세요", "Any chance we could swap shifts on Saturday?", ["swap shifts", "swap"]),
        t("Maybe. What's going on?", "아마도요. 무슨 일인데요?", "오전에 약속이 있고, 대신 화요일 근무를 하겠다고 하세요", "I've got an appointment. I'll take your Tuesday.", ["take your Tuesday", "appointment"]),
        t("Sounds fair. Should we tell Mel?", "괜찮네요. Mel한테 말해야 하죠?", "네, 먼저 Mel한테 확인받자고 하세요", "Yeah, let's run it by Mel first.", ["run it by", "ask Mel"]),
      ],
      o("Easy. I'll message her now.", "그래요. 지금 메시지 보낼게요.")),

    L("30", 5, "🌙", "하루 마무리 보고", "끝낸 방·남은 문제·트롤리 정리 보고하기", "슈퍼바이저 Mel",
      [
        ln("all my rooms are done", "제 방 다 끝났어요", "All my rooms are done except 512.", "512호 빼고 제 방 다 끝났어요."),
        ln("waiting on maintenance", "시설팀을 기다리는 중", "512 is still waiting on maintenance.", "512호는 아직 시설팀을 기다리는 중이에요."),
        ln("dirty linen", "사용한 린넨", "I've taken the dirty linen to the chute.", "사용한 린넨은 슈트에 넣었어요."),
        ln("restocked for tomorrow", "내일을 위해 채워 둔", "My trolley is restocked for tomorrow.", "제 트롤리는 내일 쓸 수 있게 채워 놨어요."),
        ln("Good to go", "가도 돼요", "Thanks, mate. You're good to go.", "고마워요. 이제 가도 돼요."),
      ],
      [
        t("How did you go today?", "오늘 어땠어요?", "512호 빼고 다 끝났다고 하세요", "All my rooms are done except 512.", ["rooms are done", "except 512"]),
        t("What's happening with 512?", "512호는 어떻게 됐어요?", "아직 시설팀 기다리는 중이라고 하세요", "It's still waiting on maintenance.", ["waiting on maintenance", "maintenance"]),
        t("Okay. And your trolley?", "알겠어요. 트롤리는요?", "린넨 버렸고 내일 쓸 수 있게 채워 놨다고 하세요", "Dirty linen's gone, and it's restocked for tomorrow.", ["restocked for tomorrow", "restocked"]),
      ],
      o("Perfect. You're good to go. See you tomorrow!", "완벽해요. 가도 돼요. 내일 봐요!")),
  ],
};
export default curriculum;
