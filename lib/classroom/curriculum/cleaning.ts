import { L, ln, o, t, type JobCurriculum } from "./kit";

const curriculum: JobCurriculum = {
  steps: ["첫 출근 현장 익히기", "매일 청소 루틴", "고객·상사 요청", "문제·실수·안전", "바쁜 밤 조율·인수인계"],
  lessons: [
    // ───────── STEP 1: 첫 출근 현장 익히기 ─────────
    L("1", 1, "🧽", "체크리스트 받기", "시작 위치 묻기·쓰레기통 비우고 닦고 청소기 돌리기", "슈퍼바이저",
      [
        ln("your checklist", "체크리스트", "This is your checklist for tonight.", "오늘 밤 체크리스트예요."),
        ln("Where should I start", "어디부터 시작할까요", "Thanks. Where should I start?", "고마워요. 어디부터 시작할까요?"),
        ln("empty the bins", "쓰레기통을 비우다", "Empty the bins under every desk.", "책상마다 밑에 있는 쓰레기통을 비워요."),
        ln("wipe down the benches", "조리대를 닦다", "Then wipe down the benches in the kitchen.", "그다음 주방 조리대를 닦아요.", "호주에선 counter보다 bench라고 해요."),
        ln("vacuum the offices", "사무실 청소기를 돌리다", "I'll vacuum the offices last.", "사무실 청소기는 마지막에 돌릴게요."),
      ],
      [
        t("This is your checklist for tonight.", "오늘 밤 체크리스트예요.", "어디부터 시작할지 물어보세요", "Thanks. Where should I start?", ["where should I start"]),
        t("Start with the kitchen. Empty the bins and wipe down the benches.", "주방부터요. 쓰레기통 비우고 조리대 닦아요.", "쓰레기통 비우고 조리대 닦겠다고 확인하세요", "Okay, empty the bins and wipe down the benches.", ["empty the bins", "wipe down"]),
        t("Then vacuum the offices.", "그다음 사무실 청소기 돌려요.", "그다음 청소기 돌리겠다고 하세요", "Got it. Then I'll vacuum the offices.", ["vacuum"]),
      ],
      o("Great.", "좋아요.")),

    L("3", 1, "🔐", "건물 출입", "경보 코드 묻기·출입 카드 반납 위치 확인하기", "슈퍼바이저",
      [
        ln("access card", "출입 카드", "Here's your access card for the building.", "건물 출입 카드예요."),
        ln("What's the alarm code", "경보 코드가 뭐예요", "Before I forget, what's the alarm code?", "잊기 전에요, 경보 코드가 뭐예요?"),
        ln("set the alarm", "경보를 켜다", "Set the alarm when you leave.", "나갈 때 경보를 켜요."),
        ln("you've got 30 seconds", "30초 안에 해야 해요", "Once you're in, you've got 30 seconds.", "들어오면 30초 안에 해야 해요.", "경보 해제 시간을 꼭 확인해요."),
        ln("Where do I return", "어디에 반납하나요", "Where do I return the card at the end?", "끝나면 카드는 어디에 반납하나요?"),
      ],
      [
        t("Here's your access card.", "출입 카드예요.", "경보 코드를 물어보세요", "Thanks. What's the alarm code?", ["alarm code"]),
        t("It's 2468. Set it when you leave.", "2468이에요. 나갈 때 켜요.", "나갈 때 켜겠다고 하세요", "Okay, I'll set the alarm when I leave.", ["set the alarm"]),
        t("Perfect.", "좋아요.", "출입 카드는 어디에 반납하는지 물어보세요", "Where do I return the access card?", ["access card"]),
      ],
      o("Just leave it in the office.", "사무실에 두면 돼요.")),

    L("5", 1, "👋", "첫날 현장 도착", "슈퍼바이저 찾기·근무 시작 알리기", "슈퍼바이저 Dave",
      [
        ln("the new cleaner", "새로 온 청소 직원", "Hi, I'm Min, the new cleaner.", "안녕하세요, 새로 온 청소 직원 민이에요."),
        ln("I'm looking for", "~를 찾고 있어요", "I'm looking for Dave, the supervisor.", "슈퍼바이저 Dave를 찾고 있어요."),
        ln("hi-vis vest", "형광 조끼", "Wear this hi-vis vest in the car park.", "주차장에선 이 형광 조끼를 입어요.", "hi-vis = high visibility예요."),
        ln("finish at", "~시에 끝나다", "We usually finish at 11 tonight.", "오늘은 보통 11시에 끝나요."),
        ln("show you around", "구경시켜 주다", "Come on, I'll show you around.", "따라와요, 한 바퀴 구경시켜 줄게요."),
      ],
      [
        t("Hi there. Can I help you?", "안녕하세요. 도와드릴까요?", "새로 온 청소 직원 민이라고 하고 Dave를 찾는다고 하세요", "Hi, I'm Min, the new cleaner. I'm looking for Dave.", ["new cleaner", "looking for Dave"]),
        t("That's me! Welcome. Here's a hi-vis vest.", "저예요! 환영해요. 형광 조끼예요.", "고맙다고 하고 몇 시에 끝나는지 물어보세요", "Thanks. What time do we finish?", ["what time", "finish"]),
        t("Around 11. Come on, I'll show you around.", "11시쯤요. 따라와요, 구경시켜 줄게요.", "좋다고, 따라가겠다고 하세요", "Great, I'll follow you.", ["follow you", "after you"]),
      ],
      o("First stop, the cleaners' room.", "첫 번째는 청소 직원 방이에요.")),

    L("6", 1, "🛒", "청소 카트 준비", "장비실에서 카트 채우기·도구 이름 익히기", "동료 Lena",
      [
        ln("cleaners' room", "청소 도구실", "All the gear is in the cleaners' room.", "도구는 전부 청소 도구실에 있어요."),
        ln("load up the trolley", "카트를 채우다", "Load up the trolley before you start.", "시작 전에 카트를 채워요."),
        ln("bin liners", "쓰레기 봉투", "Grab a roll of bin liners, the big ones.", "큰 쓰레기 봉투 한 롤 챙겨요."),
        ln("microfibre cloths", "극세사 걸레", "Take a stack of microfibre cloths too.", "극세사 걸레도 한 묶음 가져가요."),
        ln("Where do we keep", "~는 어디에 둬요", "Where do we keep the spare vacuum bags?", "여분 청소기 봉투는 어디에 둬요?"),
      ],
      [
        t("Here's the cleaners' room. Load up your trolley.", "여기가 청소 도구실이에요. 카트 채워요.", "쓰레기 봉투는 어디 있는지 물어보세요", "Okay. Where are the bin liners?", ["bin liners", "bin bags"]),
        t("Top shelf. Take the big ones.", "맨 위 칸이요. 큰 거 가져가요.", "극세사 걸레도 챙길지 물어보세요", "Got it. Should I take microfibre cloths too?", ["microfibre cloths", "cloths"]),
        t("Yep, a stack of them.", "네, 한 묶음요.", "여분 청소기 봉투는 어디 두는지 물어보세요", "Where do we keep the spare vacuum bags?", ["vacuum bags", "where do we keep"]),
      ],
      o("Bottom drawer. You're all set.", "맨 아래 서랍이요. 준비 끝이에요.")),

    L("7", 1, "🙂", "야근하는 직원과 마주침", "인사하기·청소해도 되는지 묻기", "사무실 직원",
      [
        ln("Sorry to interrupt", "방해해서 죄송해요", "Sorry to interrupt. Can I grab your bin?", "방해해서 죄송해요. 쓰레기통 좀 가져가도 될까요?"),
        ln("working late", "늦게까지 일하는", "Working late tonight, hey?", "오늘 늦게까지 일하시네요?"),
        ln("Do you mind if", "~해도 괜찮을까요", "Do you mind if I vacuum around you?", "주변에 청소기 돌려도 괜찮을까요?"),
        ln("I'll be quick", "빨리 할게요", "Don't worry, I'll be quick.", "걱정 마세요, 빨리 할게요."),
        ln("go ahead", "그러세요", "Yeah, go ahead, it's no problem.", "네, 그러세요, 괜찮아요."),
      ],
      [
        t("Oh, hi. Didn't hear you come in.", "아, 안녕하세요. 들어오는 소리 못 들었네요.", "방해해서 죄송하다고 하고 쓰레기통 가져가도 되는지 물어보세요", "Sorry to interrupt. Can I grab your bin?", ["sorry to interrupt", "grab your bin"]),
        t("Sure, here you go.", "그럼요, 여기요.", "주변에 청소기 돌려도 괜찮은지 물어보세요", "Thanks. Do you mind if I vacuum around you?", ["do you mind", "is it okay"]),
        t("Go ahead. I'm on a call in five though.", "그러세요. 근데 5분 뒤에 통화가 있어요.", "그럼 빨리 하겠다고 하세요", "No worries, I'll be quick.", ["be quick", "quickly"]),
      ],
      o("Thanks, appreciate it.", "고마워요.")),

    L("8", 1, "📅", "로스터·근무 시간 확인", "근무일 확인하기·타임시트 적는 법 묻기", "슈퍼바이저 Dave",
      [
        ln("on the roster", "로스터에 있는", "You're on the roster Monday to Thursday.", "월요일부터 목요일까지 로스터에 있어요."),
        ln("6 till 10", "6시부터 10시까지", "Your shift is 6 till 10 each night.", "근무는 매일 밤 6시부터 10시까지예요."),
        ln("timesheet", "근무 시간 기록지", "Fill in your timesheet before you leave.", "가기 전에 근무 시간 기록지를 적어요."),
        ln("paid weekly", "주급으로 받다", "Do we get paid weekly or fortnightly?", "주급으로 받나요, 2주마다 받나요?", "호주는 fortnightly(2주) 지급이 흔해요."),
        ln("can't make a shift", "근무를 못 나가다", "Text me if you can't make a shift.", "근무 못 나오면 문자 줘요."),
      ],
      [
        t("You're on the roster Monday to Thursday, 6 till 10.", "월~목, 6시부터 10시까지 로스터에 있어요.", "주급인지 2주마다인지 물어보세요", "Great. Do we get paid weekly or fortnightly?", ["weekly or fortnightly", "paid weekly"]),
        t("Fortnightly. Just fill in your timesheet each night.", "2주마다요. 매일 밤 기록지만 적어요.", "기록지는 어디 있는지 물어보세요", "Okay. Where's the timesheet?", ["timesheet"]),
        t("On the clipboard in the cleaners' room.", "청소 도구실 클립보드에 있어요.", "근무 못 나오면 어떻게 하는지 물어보세요", "What if I can't make a shift?", ["can't make a shift", "can't come"]),
      ],
      o("Just text me as early as you can.", "최대한 빨리 문자 주면 돼요.")),

    // ───────── STEP 2: 매일 청소 루틴 ─────────
    L("2", 2, "🪣", "바닥 청소", "젖은 바닥 표지판 세우기·세제 묻기", "슈퍼바이저",
      [
        ln("mopping the foyer", "로비를 걸레질하다", "I'm mopping the foyer now.", "지금 로비 걸레질하고 있어요."),
        ln("put out the wet floor sign", "젖은 바닥 표지판을 세우다", "I'll put out the wet floor sign first.", "먼저 젖은 바닥 표지판 세울게요."),
        ln("which chemicals", "어떤 세제", "Do you know which chemicals to use?", "어떤 세제 쓰는지 알아요?"),
        ln("Which one should I use", "어떤 걸 써야 해요", "Not sure. Which one should I use?", "잘 모르겠어요. 어떤 걸 써야 해요?"),
        ln("the blue one", "파란 거", "Use the blue one for floors.", "바닥에는 파란 거 써요.", "세제 색깔 구분을 꼭 외워요."),
      ],
      [
        t("Are you mopping the foyer?", "로비 걸레질해요?", "네, 젖은 바닥 표지판을 세우겠다고 하세요", "Yes. I'll put out the wet floor sign.", ["wet floor sign"]),
        t("Good. Do you know which chemicals to use?", "어떤 세제 쓰는지 알아요?", "어떤 걸 써야 하는지 물어보세요", "Not sure. Which one should I use?", ["which one should I use", "which one"]),
        t("The blue one for floors.", "바닥은 파란 거요.", "파란 걸로 쓰겠다고 하세요", "Okay, the blue one for floors.", ["the blue one"]),
      ],
      o("Perfect.", "좋아요.")),

    L("9", 2, "🚽", "화장실 청소", "변기·세면대 닦기·휴지 채우기", "동료 Lena",
      [
        ln("toilet brush", "변기 솔", "Use the toilet brush under the rim.", "변기 테두리 안쪽은 변기 솔로 닦아요."),
        ln("hand towels", "핸드 타월", "Refill the hand towels in every cubicle.", "칸마다 핸드 타월을 채워요."),
        ln("soap dispenser", "비누 디스펜서", "The soap dispenser in the ladies' is empty.", "여자 화장실 비누 디스펜서가 비었어요."),
        ln("sanitary bins", "생리대 수거함", "Don't empty the sanitary bins. A company does that.", "생리대 수거함은 비우지 마요. 업체가 해요.", "전문 업체가 따로 수거해요."),
        ln("in the gents", "남자 화장실에", "I'll start in the gents, then do the ladies'.", "남자 화장실부터 하고 그다음 여자 화장실 할게요."),
      ],
      [
        t("Toilets next. Which side will you start?", "다음은 화장실이요. 어느 쪽부터 할래요?", "남자 화장실부터 하고 여자 화장실 하겠다고 하세요", "I'll start in the gents, then do the ladies'.", ["in the gents", "gents first"]),
        t("Good. Check the soap dispensers too.", "좋아요. 비누 디스펜서도 확인해요.", "여자 화장실 디스펜서가 비었다고 하세요", "The soap dispenser in the ladies' is empty.", ["soap dispenser", "is empty"]),
        t("Refill it from the trolley. Leave the sanitary bins.", "카트에서 채워요. 생리대 수거함은 그냥 둬요.", "알겠다고, 업체가 하는지 물어보세요", "Okay. Does a company do those?", ["a company", "company"]),
      ],
      o("Yep, every Tuesday.", "네, 매주 화요일에요.")),

    L("10", 2, "🍽️", "사무실 주방 정리", "식기세척기 돌리기·싱크대 정리하기", "슈퍼바이저 Dave",
      [
        ln("load the dishwasher", "식기세척기에 넣다", "Load the dishwasher and turn it on.", "식기세척기에 넣고 돌려요."),
        ln("unpack it", "꺼내 정리하다", "Unpack it first if it's already clean.", "이미 깨끗하면 먼저 꺼내 정리해요."),
        ln("dirty mugs", "더러운 머그컵", "There are dirty mugs all over the sink.", "싱크대에 더러운 머그컵이 잔뜩 있어요."),
        ln("wipe out the microwave", "전자레인지 안을 닦다", "Wipe out the microwave every night.", "전자레인지 안은 매일 밤 닦아요."),
        ln("tea towels", "행주", "Put the tea towels in the wash bag.", "행주는 세탁 가방에 넣어요."),
      ],
      [
        t("How's the kitchen looking?", "주방 어때요?", "싱크대에 더러운 머그컵이 잔뜩 있다고 하세요", "There are dirty mugs all over the sink.", ["dirty mugs", "lots of mugs"]),
        t("Typical. Load the dishwasher, but unpack it first if it's clean.", "늘 그래요. 식기세척기에 넣는데, 깨끗하면 먼저 꺼내요.", "알겠다고, 먼저 꺼내고 넣겠다고 하세요", "Got it. I'll unpack it, then load it.", ["unpack it", "load it"]),
        t("And the microwave?", "전자레인지는요?", "안을 닦고 행주는 세탁 가방에 넣겠다고 하세요", "I'll wipe out the microwave and bag the tea towels.", ["wipe out the microwave", "tea towels"]),
      ],
      o("Legend. The staff will love you.", "최고예요. 직원들이 좋아할 거예요.")),

    L("11", 2, "♻️", "쓰레기 분리배출", "재활용·일반 쓰레기 구분하기·큰 통으로 옮기기", "동료 Lena",
      [
        ln("yellow lid", "노란 뚜껑", "Recycling goes in the yellow lid bin.", "재활용은 노란 뚜껑 통에 넣어요.", "호주 재활용통은 보통 노란 뚜껑이에요."),
        ln("general waste", "일반 쓰레기", "Food scraps go in general waste.", "음식물 찌꺼기는 일반 쓰레기에 넣어요."),
        ln("soft plastics", "비닐류", "Soft plastics can't go in recycling here.", "여기선 비닐류는 재활용에 못 넣어요."),
        ln("flatten the boxes", "상자를 납작하게 접다", "Flatten the boxes before you take them down.", "상자는 내려가기 전에 납작하게 접어요."),
        ln("the skip", "대형 쓰레기통", "Take the bags down to the skip out the back.", "봉투는 뒤쪽 대형 쓰레기통에 갖다 버려요.", "skip = 대형 컨테이너 쓰레기통이에요."),
      ],
      [
        t("Do you know where recycling goes?", "재활용 어디에 넣는지 알아요?", "노란 뚜껑 통이 맞는지 물어보세요", "The yellow lid bin, right?", ["yellow lid", "yellow bin"]),
        t("Yep. But no soft plastics.", "네. 근데 비닐은 안 돼요.", "그럼 비닐은 일반 쓰레기에 넣는지 물어보세요", "So soft plastics go in general waste?", ["general waste", "rubbish"]),
        t("Correct. And flatten the boxes.", "맞아요. 그리고 상자는 납작하게 접어요.", "알겠다고, 상자 접어서 뒤쪽 대형 쓰레기통에 갖다 놓겠다고 하세요", "Got it. I'll flatten them and take them to the skip.", ["take them to the skip", "flatten them"]),
      ],
      o("Perfect. Watch out for the step.", "완벽해요. 계단 조심해요.")),

    L("12", 2, "🖥️", "책상 닦기 규칙", "서류 건드리지 않기·물건 치우지 않기", "슈퍼바이저 Dave",
      [
        ln("clear desks", "깨끗이 비워진 책상", "Only wipe clear desks.", "깨끗이 비워진 책상만 닦아요."),
        ln("leave the paperwork", "서류는 그대로 두다", "Leave the paperwork exactly where it is.", "서류는 있던 자리 그대로 둬요."),
        ln("keyboards and phones", "키보드와 전화기", "Should I wipe keyboards and phones too?", "키보드랑 전화기도 닦아야 하나요?"),
        ln("disinfectant wipes", "소독 물티슈", "Use disinfectant wipes, not spray, on screens.", "화면엔 스프레이 말고 소독 물티슈를 써요."),
        ln("hot desks", "공용 자리", "Hot desks get wiped every single night.", "공용 자리는 매일 밤 닦아요.", "hot desk = 정해진 주인이 없는 자리예요."),
      ],
      [
        t("Do you wipe every desk?", "책상 다 닦아요?", "깨끗이 비워진 책상만 닦는지 물어보세요", "Only the clear desks, right?", ["clear desks", "clear ones"]),
        t("Right. Leave the paperwork where it is.", "맞아요. 서류는 그대로 둬요.", "키보드랑 전화기도 닦는지 물어보세요", "Okay. Should I wipe keyboards and phones too?", ["keyboards and phones", "keyboards"]),
        t("Yes, with disinfectant wipes, not spray.", "네, 스프레이 말고 소독 물티슈로요.", "알겠다고, 물티슈 쓰겠다고 하세요", "Got it, disinfectant wipes only.", ["disinfectant wipes", "wipes"]),
      ],
      o("Good. Hot desks every night.", "좋아요. 공용 자리는 매일 밤이요.")),

    L("13", 2, "🪟", "유리문 얼룩 닦기", "유리 세정제 쓰기·줄무늬 없이 닦기", "동료 Lena",
      [
        ln("glass cleaner", "유리 세정제", "Grab the glass cleaner, the green bottle.", "초록색 병, 유리 세정제 가져와요."),
        ln("smudges on the door", "문에 얼룩", "There are smudges on the door again.", "문에 또 얼룩이 있어요."),
        ln("no streaks", "줄무늬 없이", "Use a dry cloth after so there are no streaks.", "줄무늬 안 남게 마지막에 마른 걸레를 써요."),
        ln("both sides", "양쪽 다", "Do both sides of the glass, inside and out.", "유리 안팎 양쪽 다 닦아요."),
        ln("handprints", "손자국", "Kids leave handprints all over the shopfront.", "애들이 가게 앞 유리에 손자국을 잔뜩 남겨요."),
      ],
      [
        t("The front doors look bad. There are smudges again.", "앞문이 지저분해요. 또 얼룩이 있어요.", "유리 세정제로 닦겠다고 하세요", "I'll do them now with the glass cleaner.", ["glass cleaner", "glass spray"]),
        t("Thanks. Do both sides.", "고마워요. 양쪽 다 해요.", "알겠다고, 안팎 다 하겠다고 하세요", "Sure, inside and out.", ["inside and out", "both sides"]),
        t("Use a dry cloth at the end, okay?", "마지막엔 마른 걸레 써요, 알겠죠?", "줄무늬 안 남게 하겠다고 하세요", "Yep, so there are no streaks.", ["no streaks", "streaks"]),
      ],
      o("Looking sparkly already.", "벌써 반짝반짝하네요.")),

    // ───────── STEP 3: 고객·상사 요청 ─────────
    L("14", 3, "☕", "카펫에 커피 얼룩", "얼룩 위치 확인하기·처리 방법 설명하기", "사무실 매니저 Karen",
      [
        ln("coffee stain", "커피 얼룩", "There's a coffee stain on the carpet.", "카펫에 커피 얼룩이 있어요."),
        ln("stain remover", "얼룩 제거제", "I'll try the stain remover on it tonight.", "오늘 밤 얼룩 제거제로 해 볼게요."),
        ln("blot it", "두드려 흡수시키다", "I'll blot it, not rub it.", "문지르지 않고 두드려서 뺄게요.", "문지르면 얼룩이 퍼져요."),
        ln("might not come out", "안 빠질 수도 있다", "If it's old, it might not come out.", "오래된 거면 안 빠질 수도 있어요."),
        ln("carpet steam clean", "카펫 스팀 청소", "We can book a carpet steam clean if needed.", "필요하면 카펫 스팀 청소를 예약할 수 있어요."),
      ],
      [
        t("Hi, there's a coffee stain near my desk. Can you help?", "제 책상 근처에 커피 얼룩이 있어요. 도와줄 수 있어요?", "그럼요, 오늘 밤 얼룩 제거제로 해 보겠다고 하세요", "Sure, I'll try the stain remover tonight.", ["stain remover", "try"]),
        t("It's been there since Monday.", "월요일부터 있었어요.", "오래돼서 안 빠질 수도 있다고 하세요", "It might not come out if it's old.", ["might not come out", "not come out"]),
        t("Hmm, what then?", "음, 그럼 어떡해요?", "카펫 스팀 청소를 예약할 수 있다고 하세요", "We can book a carpet steam clean.", ["steam clean", "book"]),
      ],
      o("Okay, let me know how it goes.", "알겠어요, 어떻게 됐는지 알려 줘요.")),

    L("15", 3, "🗓️", "회의실 행사 준비", "의자 배치·행사 전 마무리 요청 받기", "사무실 매니저 Karen",
      [
        ln("board meeting", "이사회 회의", "We've got a board meeting at 8 tomorrow.", "내일 8시에 이사회 회의가 있어요."),
        ln("set up the chairs", "의자를 배치하다", "Can you set up the chairs in rows?", "의자를 줄 맞춰 배치해 줄 수 있어요?"),
        ln("twenty chairs", "의자 20개", "We need twenty chairs, facing the screen.", "화면 보는 쪽으로 의자 20개 필요해요."),
        ln("polish the table", "테이블을 광내다", "I'll polish the table and clean the whiteboard.", "테이블 광내고 화이트보드도 닦을게요."),
        ln("before you leave", "가기 전에", "Please lock the room before you leave.", "가기 전에 회의실 잠가 주세요."),
      ],
      [
        t("We've got a board meeting at 8 tomorrow.", "내일 8시에 이사회 회의가 있어요.", "의자를 몇 개 놓을지 물어보세요", "No problem. How many chairs do you need?", ["how many chairs", "chairs"]),
        t("Twenty, facing the screen, please.", "20개, 화면 보는 쪽으로요.", "알겠다고, 테이블 광내고 화이트보드도 닦겠다고 하세요", "Sure. I'll also polish the table and clean the whiteboard.", ["polish the table", "whiteboard"]),
        t("Amazing. Lock the room before you leave.", "최고예요. 가기 전에 잠가 줘요.", "알겠다고, 잠그겠다고 하세요", "Will do, I'll lock it.", ["lock it", "lock the room"]),
      ],
      o("Thanks so much. You're a star.", "정말 고마워요. 최고예요.")),

    L("16", 3, "🛍️", "상가 마감 후 청소", "영업 끝난 가게에 들어가기·사장님 요청 듣기", "가게 사장 Tony",
      [
        ln("closing up", "마감하는 중", "Sorry, we're still closing up.", "죄송해요, 아직 마감하는 중이에요."),
        ln("I can come back in", "~ 뒤에 다시 올게요", "No worries, I can come back in ten.", "괜찮아요, 10분 뒤에 다시 올게요."),
        ln("change rooms", "탈의실", "Can you do the change rooms properly tonight?", "오늘은 탈의실 제대로 해 줄 수 있어요?"),
        ln("behind the counter", "카운터 뒤", "Should I vacuum behind the counter as well?", "카운터 뒤도 청소기 돌려야 하나요?"),
        ln("shutter", "셔터", "Pull the shutter down when you're done.", "다 끝나면 셔터 내려 줘요."),
      ],
      [
        t("Sorry, we're still closing up.", "죄송해요, 아직 마감 중이에요.", "괜찮다고, 10분 뒤에 다시 오겠다고 하세요", "No worries, I can come back in ten.", ["come back in ten", "come back"]),
        t("Thanks. Can you do the change rooms properly tonight?", "고마워요. 오늘은 탈의실 제대로 해 줄 수 있어요?", "그럼요 하고 카운터 뒤도 청소기 돌릴지 물어보세요", "Sure. Should I vacuum behind the counter too?", ["behind the counter", "counter"]),
        t("Yes please. And pull the shutter down after.", "네. 그리고 끝나면 셔터 내려 줘요.", "알겠다고, 셔터 내리겠다고 하세요", "Got it, I'll pull the shutter down.", ["pull the shutter down", "shutter"]),
      ],
      o("Cheers, mate. See you tomorrow.", "고마워요. 내일 봐요.")),

    L("17", 3, "⏱️", "청소 시간 변경 요청", "시간 바꾸기 요청 받기·슈퍼바이저와 확인하기", "건물 관리자 Rachel (전화)",
      [
        ln("start an hour later", "한 시간 늦게 시작하다", "Could your team start an hour later on Friday?", "금요일엔 팀이 한 시간 늦게 시작할 수 있어요?"),
        ln("we've got an event", "행사가 있어요", "We've got an event in the lobby till 7.", "로비에서 7시까지 행사가 있어요."),
        ln("check with my supervisor", "슈퍼바이저에게 확인하다", "I'll need to check with my supervisor first.", "먼저 슈퍼바이저에게 확인해야 해요."),
        ln("call you back", "다시 전화하다", "Can I call you back in ten minutes?", "10분 뒤에 다시 전화드려도 될까요?"),
        ln("this Friday only", "이번 금요일만", "Is that this Friday only, or every week?", "이번 금요일만이에요, 아니면 매주예요?"),
      ],
      [
        t("Hi, could your team start an hour later on Friday?", "금요일에 팀이 한 시간 늦게 시작할 수 있어요?", "이번 금요일만인지 매주인지 물어보세요", "Is that this Friday only, or every week?", ["this Friday only", "every week"]),
        t("Just this Friday. We've got an event till 7.", "이번 금요일만요. 7시까지 행사가 있어요.", "슈퍼바이저에게 먼저 확인해야 한다고 하세요", "Okay. I'll need to check with my supervisor first.", ["check with my supervisor", "ask my supervisor"]),
        t("Sure, that's fine.", "네, 괜찮아요.", "10분 뒤에 다시 전화하겠다고 하세요", "I'll call you back in ten minutes.", ["call you back", "ring you back"]),
      ],
      o("Great, talk soon.", "좋아요, 이따 통화해요.")),

    L("18", 3, "📉", "고객 불만 피드백", "놓친 부분 듣기·다시 하겠다고 하기", "슈퍼바이저 Dave",
      [
        ln("the client complained", "고객이 불만을 제기했다", "The client complained about level 2 this morning.", "오늘 아침 고객이 2층에 대해 불만을 제기했어요."),
        ln("bins weren't emptied", "쓰레기통이 안 비워졌다", "Apparently the bins weren't emptied in the meeting room.", "회의실 쓰레기통이 안 비워졌대요."),
        ln("I must have missed it", "제가 놓쳤나 봐요", "Sorry, I must have missed it.", "죄송해요, 제가 놓쳤나 봐요."),
        ln("double-check", "다시 한번 확인하다", "I'll double-check every room before I leave.", "가기 전에 모든 방을 다시 한번 확인할게요."),
        ln("tick it off", "체크 표시하다", "Tick it off on the checklist as you go.", "하나씩 할 때마다 체크리스트에 표시해요."),
      ],
      [
        t("The client complained about level 2.", "고객이 2층에 대해 불만을 제기했어요.", "무슨 문제였는지 물어보세요", "Oh no. What was the problem?", ["what was the problem", "what happened"]),
        t("The bins weren't emptied in the meeting room.", "회의실 쓰레기통이 안 비워졌대요.", "죄송하다고, 놓친 것 같다고 하세요", "Sorry, I must have missed it.", ["must have missed", "missed it"]),
        t("It happens. Just tick things off as you go.", "그럴 수 있어요. 하나씩 체크하면서 해요.", "알겠다고, 가기 전에 다시 확인하겠다고 하세요", "Will do. I'll double-check before I leave.", ["double-check", "check again"]),
      ],
      o("Thanks. Tonight should be fine.", "고마워요. 오늘 밤은 괜찮을 거예요.")),

    L("19", 3, "🧊", "금요일 냉장고 비우기", "공지 확인하기·남은 음식 처리하기", "사무실 직원 Ben",
      [
        ln("clean out the fridge", "냉장고를 비우다", "Do you clean out the fridge on Fridays?", "금요일마다 냉장고 비우세요?"),
        ln("anything without a name", "이름 없는 건 전부", "We throw out anything without a name.", "이름 없는 건 전부 버려요."),
        ln("out of date", "유통기한이 지난", "The milk is out of date, so I'll bin it.", "우유 유통기한이 지나서 버릴게요."),
        ln("label it", "이름표를 붙이다", "Just label it if you want to keep it.", "보관하고 싶으면 이름표만 붙여 주세요."),
        ln("throw it out", "버리다", "Please don't throw it out, it's my lunch.", "버리지 마세요, 제 점심이에요."),
      ],
      [
        t("Hey, do you clean out the fridge on Fridays?", "금요일마다 냉장고 비워요?", "네, 이름 없는 건 다 버린다고 하세요", "Yes, we throw out anything without a name.", ["without a name", "no name"]),
        t("Oh, my lunch is in there. Please don't throw it out.", "아, 제 점심이 거기 있어요. 버리지 마세요.", "이름표만 붙이면 된다고 하세요", "No worries, just label it.", ["label it", "put your name"]),
        t("Will do. What about the milk?", "그럴게요. 우유는요?", "유통기한 지나서 버리겠다고 하세요", "It's out of date, so I'll bin it.", ["out of date", "expired"]),
      ],
      o("Fair enough. Thanks!", "그렇죠. 고마워요!")),

    // ───────── STEP 4: 문제·실수·안전 ─────────
    L("4", 4, "🧻", "물품이 떨어졌을 때", "다 떨어졌다고 알리기·열쇠 찾아 해결하기", "슈퍼바이저 (전화)",
      [
        ln("run out of toilet paper", "화장지가 다 떨어지다", "We've run out of toilet paper on level 3.", "3층에 화장지가 다 떨어졌어요."),
        ln("in the storeroom", "창고에", "There's more in the storeroom.", "창고에 더 있어요."),
        ln("The storeroom is locked", "창고가 잠겨 있어요", "The storeroom is locked, I can't get in.", "창고가 잠겨 있어서 못 들어가요."),
        ln("lockbox", "열쇠 보관함", "The key is in the lockbox by the lift.", "열쇠는 엘리베이터 옆 열쇠 보관함에 있어요."),
        ln("I found it", "찾았어요", "Thanks, I found it.", "고마워요, 찾았어요."),
      ],
      [
        t("Hi, how's tonight going?", "오늘 밤 어때요?", "괜찮은데 화장지가 다 떨어졌다고 하세요", "Good, but we've run out of toilet paper.", ["run out of", "ran out of"]),
        t("Ah, there's more in the storeroom.", "창고에 더 있어요.", "창고가 잠겨 있다고 하세요", "The storeroom is locked.", ["locked"]),
        t("The key is in the lockbox. Code 1357.", "열쇠는 열쇠함에 있어요. 코드 1357.", "고맙다고, 찾았다고 하세요", "Thanks, I found it.", ["found it", "thanks"]),
      ],
      o("No worries.", "괜찮아요.")),

    L("20", 4, "⚠️", "새 세제 안전 확인", "SDS 확인하기·희석 비율 묻기", "슈퍼바이저 Dave",
      [
        ln("new chemical", "새 세제", "We've got a new chemical for the bathrooms.", "화장실용 새 세제가 들어왔어요."),
        ln("safety data sheet", "물질 안전 보건 자료", "Where's the safety data sheet for it?", "그거 안전 자료(SDS)는 어디 있어요?", "SDS는 모든 화학제품에 있어야 해요."),
        ln("How much do I dilute", "얼마나 희석해요", "How much do I dilute it with water?", "물이랑 얼마나 희석해요?"),
        ln("one capful", "뚜껑 하나", "One capful per bucket, no more.", "양동이 하나에 뚜껑 하나, 그 이상은 안 돼요."),
        ln("open a window", "창문을 열다", "It's strong, so open a window first.", "독하니까 먼저 창문 열어요."),
      ],
      [
        t("We've got a new chemical for the bathrooms.", "화장실용 새 세제가 들어왔어요.", "안전 자료(SDS)가 어디 있는지 물어보세요", "Okay. Where's the safety data sheet?", ["safety data sheet", "SDS"]),
        t("In the folder in the cleaners' room.", "청소 도구실 폴더에 있어요.", "물이랑 얼마나 희석하는지 물어보세요", "How much do I dilute it?", ["dilute", "how much"]),
        t("One capful per bucket. And open a window.", "양동이 하나에 뚜껑 하나요. 그리고 창문 열어요.", "알겠다고, 장갑도 끼겠다고 하세요", "Got it. I'll wear gloves too.", ["wear gloves", "gloves"]),
      ],
      o("Good. Better safe than sorry.", "좋아요. 조심해서 나쁠 거 없어요.")),

    L("21", 4, "🚨", "경보가 울렸을 때", "보안업체에 상황 설명하기·코드 확인하기", "보안업체 직원 (전화)",
      [
        ln("the alarm went off", "경보가 울렸다", "Sorry, the alarm went off when I came in.", "죄송해요, 들어올 때 경보가 울렸어요."),
        ln("I'm the cleaner", "청소 직원이에요", "I'm the cleaner for level 4.", "4층 청소 직원이에요."),
        ln("password", "확인 암호", "Can I get your name and password, please?", "성함이랑 확인 암호 알려 주시겠어요?"),
        ln("entered the wrong code", "코드를 잘못 입력하다", "I think I entered the wrong code.", "코드를 잘못 입력한 것 같아요."),
        ln("reset it", "다시 설정하다", "Let me reset it from here for you.", "제가 여기서 다시 설정해 드릴게요."),
      ],
      [
        t("Security here. Your alarm's going off. Who's this?", "보안업체예요. 경보가 울리고 있어요. 누구세요?", "4층 청소 직원이고 들어올 때 경보가 울렸다고 하세요", "I'm the cleaner for level 4. The alarm went off when I came in.", ["I'm the cleaner", "the alarm went off"]),
        t("Can I get your name and password?", "성함이랑 암호 알려 주세요.", "이름은 민이고 암호는 '선셋'이라고 하세요", "My name's Min, and the password is Sunset.", ["password is", "Min"]),
        t("Thanks, Min. What happened?", "고마워요, 민. 무슨 일이었어요?", "코드를 잘못 입력한 것 같다고 하세요", "I think I entered the wrong code.", ["wrong code"]),
      ],
      o("No worries. I'll reset it now.", "괜찮아요. 지금 다시 설정할게요.")),

    L("22", 4, "💉", "화장실에서 주사바늘 발견", "만지지 않기·보고하고 구역 막기", "슈퍼바이저 Dave (전화)",
      [
        ln("syringe", "주사기", "There's a syringe on the floor in the gents.", "남자 화장실 바닥에 주사기가 있어요."),
        ln("I haven't touched it", "만지지 않았어요", "I haven't touched it, don't worry.", "걱정 마세요, 만지지 않았어요."),
        ln("sharps kit", "주사바늘 처리 키트", "There's a sharps kit under the sink.", "싱크대 밑에 주사바늘 처리 키트가 있어요."),
        ln("close off the toilet", "화장실을 막다", "Close off the toilet until it's safe.", "안전해질 때까지 화장실을 막아 둬요."),
        ln("tongs", "집게", "Pick it up with the tongs, never your hands.", "절대 손 말고 집게로 집어요."),
      ],
      [
        t("Hi, what's up?", "무슨 일이에요?", "남자 화장실 바닥에 주사기가 있다고 하세요", "There's a syringe on the floor in the gents.", ["syringe", "needle"]),
        t("Don't touch it with your hands!", "손으로 만지지 마요!", "만지지 않았다고 하고 화장실을 막을지 물어보세요", "I haven't touched it. Should I close off the toilet?", ["haven't touched it", "close off"]),
        t("Yes. Use the tongs and the sharps kit under the sink.", "네. 싱크대 밑 집게랑 키트를 써요.", "알겠다고, 끝나면 문자 하겠다고 하세요", "Okay. I'll text you when it's done.", ["text you", "let you know"]),
      ],
      o("Thanks. We'll do the report tomorrow.", "고마워요. 보고서는 내일 써요.")),

    L("23", 4, "🏺", "물건을 깨뜨렸을 때", "솔직하게 말하기·보고서 쓰기", "사무실 매니저 Karen",
      [
        ln("I knocked over", "제가 ~를 쳐서 넘어뜨렸어요", "I knocked over a vase while dusting.", "먼지 닦다가 꽃병을 쳐서 넘어뜨렸어요."),
        ln("I'm so sorry", "정말 죄송해요", "I'm so sorry, it was an accident.", "정말 죄송해요, 실수였어요."),
        ln("cleaned it all up", "다 치웠다", "I've cleaned it all up already.", "이미 다 치웠어요."),
        ln("report it", "보고하다", "I'll report it to my supervisor tonight.", "오늘 밤 슈퍼바이저에게 보고할게요."),
        ln("insurance", "보험", "Our company insurance should cover it.", "회사 보험으로 처리될 거예요.", "숨기지 말고 바로 말하는 게 원칙이에요."),
      ],
      [
        t("Oh, where's the vase from the front desk?", "어, 프런트 꽃병 어디 갔어요?", "먼지 닦다가 꽃병을 넘어뜨렸다고, 정말 죄송하다고 하세요", "I'm so sorry, I knocked over the vase while dusting.", ["knocked over", "so sorry"]),
        t("Oh no. Are you okay?", "어떡해요. 괜찮아요?", "괜찮다고, 이미 다 치웠다고 하세요", "I'm fine. I've cleaned it all up.", ["cleaned it all up", "cleaned it up"]),
        t("Okay. What happens now?", "알겠어요. 이제 어떻게 해요?", "슈퍼바이저에게 보고하겠다고, 회사 보험이 처리할 거라고 하세요", "I'll report it. Our insurance should cover it.", ["report it", "insurance"]),
      ],
      o("Thanks for being honest.", "솔직하게 말해 줘서 고마워요.")),

    L("24", 4, "🩹", "젖은 바닥에서 미끄러진 사람", "도와주기·사고 기록 남기기", "사무실 직원 Ben",
      [
        ln("Are you alright", "괜찮으세요", "Oh no! Are you alright?", "어머! 괜찮으세요?"),
        ln("slipped on the wet floor", "젖은 바닥에서 미끄러지다", "I slipped on the wet floor near the lift.", "엘리베이터 근처 젖은 바닥에서 미끄러졌어요."),
        ln("Don't get up yet", "아직 일어나지 마세요", "Don't get up yet. Take a second.", "아직 일어나지 마세요. 잠깐만요."),
        ln("first aid kit", "구급상자", "I'll grab the first aid kit.", "구급상자 가져올게요."),
        ln("write it up", "기록으로 남기다", "I need to write it up as an incident.", "사고로 기록을 남겨야 해요."),
      ],
      [
        t("Ow! I just slipped on the wet floor.", "아! 방금 젖은 바닥에서 미끄러졌어요.", "괜찮은지 묻고 아직 일어나지 말라고 하세요", "Are you alright? Don't get up yet.", ["Don't get up", "are you alright"]),
        t("My wrist hurts a bit.", "손목이 좀 아파요.", "구급상자 가져오겠다고 하세요", "I'll grab the first aid kit.", ["first aid kit", "first aid"]),
        t("Thanks. I didn't see the sign.", "고마워요. 표지판을 못 봤어요.", "죄송하다고, 사고 기록을 남겨야 한다고 하세요", "I'm sorry. I need to write it up as an incident.", ["write it up", "incident"]),
      ],
      o("Fair enough. I'll be okay.", "그렇죠. 괜찮을 거예요.")),

    // ───────── STEP 5: 바쁜 밤 조율·인수인계 ─────────
    L("25", 5, "🌅", "쇼핑센터 오픈 전 청소", "시간 맞추기·구역 나누기", "슈퍼바이저 Dave",
      [
        ln("doors open at 9", "9시에 문을 열다", "The centre doors open at 9 sharp.", "쇼핑센터는 9시 정각에 문을 열어요."),
        ln("food court", "푸드코트", "Do the food court tables first.", "푸드코트 테이블부터 해요."),
        ln("ride-on scrubber", "탑승식 바닥 청소기", "Can I use the ride-on scrubber today?", "오늘 탑승식 바닥 청소기 써도 돼요?"),
        ln("we're running late", "늦어지고 있어요", "Heads up, we're running late on level 1.", "참고로 1층이 늦어지고 있어요."),
        ln("I'll jump on", "제가 맡을게요", "I'll jump on the escalators now.", "에스컬레이터는 지금 제가 맡을게요."),
      ],
      [
        t("Doors open at 9. Do the food court first.", "9시에 문 열어요. 푸드코트부터 해요.", "탑승식 바닥 청소기 써도 되는지 물어보세요", "Okay. Can I use the ride-on scrubber?", ["ride-on scrubber", "scrubber"]),
        t("Yep. How's level 1 going?", "네. 1층은 어때요?", "늦어지고 있다고 하세요", "We're running late on level 1.", ["running late", "behind"]),
        t("Okay. Who can do the escalators?", "알겠어요. 에스컬레이터는 누가 해요?", "지금 제가 맡겠다고 하세요", "I'll jump on the escalators now.", ["jump on", "I'll do"]),
      ],
      o("Legend. Fifteen minutes to go!", "최고예요. 15분 남았어요!")),

    L("26", 5, "🤒", "결근한 동료 구역 나누기", "층 나누기·끝나는 시간 조율하기", "동료 Lena",
      [
        ln("off sick", "아파서 쉬는", "Jay's off sick tonight.", "Jay가 오늘 밤 아파서 쉬어요."),
        ln("cover his floors", "그의 층을 맡다", "We need to cover his floors.", "우리가 그 사람 층을 맡아야 해요."),
        ln("I'll take level 5", "제가 5층 할게요", "I'll take level 5 if you do 6.", "6층 해 주시면 제가 5층 할게요."),
        ln("just the basics", "기본만", "Let's do just the basics up there.", "거기는 기본만 해요."),
        ln("finish half an hour late", "30분 늦게 끝나다", "We might finish half an hour late.", "30분 늦게 끝날 수도 있어요."),
      ],
      [
        t("Jay's off sick. We need to cover his floors.", "Jay가 아파서 쉬어요. 우리가 그 층들 맡아야 해요.", "6층 해 주면 5층 하겠다고 하세요", "I'll take level 5 if you do 6.", ["take level 5", "level 5"]),
        t("Deal. Full clean or just the basics?", "좋아요. 전체 청소예요, 기본만이에요?", "기본만 하자고 하세요 — 쓰레기통, 화장실, 주방", "Just the basics. Bins, toilets and kitchen.", ["just the basics", "the basics"]),
        t("Good. Should we tell Dave?", "좋아요. Dave한테 말해야겠죠?", "30분 늦게 끝날 수도 있다고 문자하겠다고 하세요", "Yeah, I'll text him we might finish half an hour late.", ["half an hour late", "finish late"]),
      ],
      o("Perfect. Let's get into it.", "완벽해요. 시작해요.")),

    L("27", 5, "🧑‍🏫", "새 직원에게 알려 주기", "순서 설명하기·자주 하는 실수 알려 주기", "새 직원 Jun",
      [
        ln("It's my first night", "첫날 밤이에요", "Hi, it's my first night here.", "안녕하세요, 여기 첫날 밤이에요."),
        ln("follow me for", "~ 동안 저를 따라와요", "Just follow me for the first hour.", "처음 한 시간은 저 따라와요."),
        ln("the main thing is", "가장 중요한 건", "The main thing is the wet floor signs.", "가장 중요한 건 젖은 바닥 표지판이에요."),
        ln("ask me anytime", "언제든 물어봐요", "Don't stress, ask me anytime.", "부담 갖지 말고 언제든 물어봐요."),
        ln("you'll pick it up", "금방 익힐 거예요", "It's a lot, but you'll pick it up fast.", "많긴 한데 금방 익힐 거예요."),
      ],
      [
        t("Hi, it's my first night. Where do I start?", "안녕하세요, 첫날이에요. 어디서 시작해요?", "처음 한 시간은 따라오라고 하세요", "Welcome! Just follow me for the first hour.", ["follow me", "first hour"]),
        t("Okay. Anything really important?", "알겠어요. 꼭 중요한 거 있어요?", "가장 중요한 건 젖은 바닥 표지판이라고 하세요", "The main thing is the wet floor signs.", ["the main thing", "most important"]),
        t("Got it. It's a lot to remember.", "알겠어요. 외울 게 많네요.", "금방 익힐 거고 언제든 물어보라고 하세요", "You'll pick it up fast. Ask me anytime.", ["pick it up", "ask me anytime"]),
      ],
      o("Thanks, that helps heaps.", "고마워요, 정말 도움 돼요.")),

    L("28", 5, "📝", "아침 팀 인수인계", "남은 일·고장 난 장비 전달하기", "아침 근무 Sarah",
      [
        ln("handover notes", "인수인계 메모", "I've left handover notes on the clipboard.", "클립보드에 인수인계 메모 남겨 뒀어요."),
        ln("didn't get to", "못 하다(시간이 없어서)", "I didn't get to the level 3 windows.", "3층 창문은 못 했어요."),
        ln("tagged it out", "고장 표시를 붙였다", "The vacuum's broken, so I tagged it out.", "청소기가 고장 나서 고장 표시를 붙였어요.", "고장 장비엔 tag를 붙여 못 쓰게 해요."),
        ln("we're low on", "~가 얼마 안 남았어요", "We're low on bin liners too.", "쓰레기 봉투도 얼마 안 남았어요."),
        ln("I'll order more", "더 주문할게요", "No worries, I'll order more today.", "괜찮아요, 오늘 더 주문할게요."),
      ],
      [
        t("Morning! Anything I should know?", "안녕하세요! 알아야 할 거 있어요?", "3층 창문은 못 했다고 하세요", "I didn't get to the level 3 windows.", ["didn't get to", "didn't do"]),
        t("No worries, I'll do them. Anything else?", "괜찮아요, 제가 할게요. 또 있어요?", "청소기가 고장 나서 고장 표시를 붙였다고 하세요", "The vacuum's broken, so I tagged it out.", ["tagged it out", "broken"]),
        t("Good to know. Supplies okay?", "알아서 다행이에요. 물품은 괜찮아요?", "쓰레기 봉투가 얼마 안 남았다고 하세요", "We're low on bin liners.", ["low on", "running out of"]),
      ],
      o("Thanks. I'll order more today.", "고마워요. 오늘 더 주문할게요.")),

    L("29", 5, "📞", "건물 매니저 불만 해결", "불만 듣고 사과하기·해결 시간 약속하기", "건물 관리자 Rachel (전화)",
      [
        ln("weren't good enough", "만족스럽지 않았다", "Honestly, the toilets weren't good enough today.", "솔직히 오늘 화장실 상태가 만족스럽지 않았어요."),
        ln("I completely understand", "충분히 이해해요", "I completely understand. I'm sorry about that.", "충분히 이해해요. 죄송합니다."),
        ln("sort it out", "해결하다", "We'll sort it out tonight.", "오늘 밤에 해결할게요."),
        ln("deep clean", "대청소", "We'll give them a deep clean tonight.", "오늘 밤 화장실 대청소를 할게요."),
        ln("send you photos", "사진을 보내다", "I'll send you photos when it's done.", "끝나면 사진 보내 드릴게요."),
      ],
      [
        t("Honestly, the toilets weren't good enough today.", "솔직히 오늘 화장실 상태가 별로였어요.", "충분히 이해한다고, 죄송하다고 하세요", "I completely understand. I'm sorry about that.", ["completely understand", "sorry"]),
        t("What are you going to do about it?", "어떻게 할 거예요?", "오늘 밤 대청소를 하겠다고 하세요", "We'll give them a deep clean tonight.", ["deep clean", "tonight"]),
        t("Okay. How will I know it's done?", "알겠어요. 끝난 건 어떻게 알아요?", "끝나면 사진을 보내겠다고 하세요", "I'll send you photos when it's done.", ["send you photos", "photos"]),
      ],
      o("That'd be great. Thanks for sorting it.", "좋아요. 해결해 줘서 고마워요.")),

    L("30", 5, "💪", "추가 근무 제안받기", "근무 가능 여부 말하기·시간 조율하기", "슈퍼바이저 Dave",
      [
        ln("pick up an extra shift", "추가 근무를 하다", "Can you pick up an extra shift on Saturday?", "토요일에 추가 근무 할 수 있어요?"),
        ln("weekend rates", "주말 수당", "It's weekend rates, so the pay's better.", "주말 수당이라 돈이 더 좋아요.", "호주는 주말·공휴일 시급이 더 높아요."),
        ln("I'm free after", "~ 이후에 시간 돼요", "I'm free after 2 on Saturday.", "토요일 2시 이후엔 시간 돼요."),
        ln("how many hours", "몇 시간", "How many hours would it be?", "몇 시간 정도예요?"),
        ln("count me in", "저도 할게요", "Sounds good, count me in.", "좋아요, 저도 할게요."),
      ],
      [
        t("Can you pick up an extra shift on Saturday?", "토요일에 추가 근무 할 수 있어요?", "2시 이후엔 시간 된다고 하세요", "Maybe. I'm free after 2.", ["free after 2", "after 2"]),
        t("Perfect. It's a builders' clean at a new office.", "딱이에요. 새 사무실 준공 청소예요.", "몇 시간 정도인지 물어보세요", "How many hours would it be?", ["how many hours"]),
        t("About five hours, at weekend rates.", "5시간쯤이고 주말 수당이에요.", "좋다고, 하겠다고 하세요", "Sounds good, count me in.", ["count me in", "I'm in"]),
      ],
      o("Legend. I'll add you to the roster.", "최고예요. 로스터에 넣을게요.")),
  ],
};
export default curriculum;
