import { L, ln, o, t, type JobCurriculum } from "./kit";

const curriculum: JobCurriculum = {
  steps: ["농장 첫날 적응", "매일 하는 피킹·패킹", "슈퍼바이저 세부 지시", "부상·실수·안전", "급여·비자·시즌 마무리"],
  lessons: [
    // ───────── STEP 1: 농장 첫날 적응 ─────────
    L("1", 1, "🍓", "첫날 오리엔테이션", "처음이라고 말하고 지시 확인하기", "슈퍼바이저",
      [
        ln("my first time", "처음", "It's my first time picking strawberries.", "딸기 따는 건 처음이에요."),
        ln("show me how", "방법을 보여 주다", "Could you show me how to pick them?", "어떻게 따는지 보여 주실 수 있어요?"),
        ln("the ripe ones", "익은 것", "Only pick the ripe ones, fully red.", "익은 것만 따요, 완전히 빨간 걸로.", "ripe = 익은, 덜 익은 건 green이라고 해요."),
        ln("hi-vis", "형광 조끼", "Wear your hi-vis at all times on the farm.", "농장에서는 형광 조끼를 항상 입어요."),
        ln("put my hi-vis on", "형광 조끼를 입다", "Got it, I'll put my hi-vis on now.", "알겠어요, 지금 형광 조끼 입을게요."),
      ],
      [
        t("Welcome! Have you done picking before?", "어서 와요! 피킹 해 본 적 있어요?", "처음이라고, 방법을 보여 달라고 하세요", "No, it's my first time. Can you show me how?", ["show me how", "first time"]),
        t("Sure. Only pick the ripe ones. Fully red.", "익은 것만 따요. 완전히 빨간 거.", "익은 것만 따겠다고 확인하세요", "Okay, only the ripe ones.", ["ripe ones", "only ripe"]),
        t("And wear your hi-vis at all times.", "그리고 형광 조끼는 항상 입어요.", "지금 입겠다고 하세요", "Got it. I'll put my hi-vis on now.", ["hi-vis", "hi vis"]),
      ],
      o("Good on ya. Let's go.", "좋아요. 가요.")),

    L("2", 1, "💵", "급여 방식 묻기", "빈당 급여·시작 시간 확인하기", "슈퍼바이저",
      [
        ln("paid by the bin", "빈당 급여", "Is it hourly or paid by the bin?", "시급이에요, 아니면 빈당이에요?"),
        ln("a bin", "한 빈에", "It's forty dollars a bin.", "한 빈에 40달러예요.", "빈(bin) = 과일 담는 큰 통이에요."),
        ln("What time do we start", "몇 시에 시작해요", "What time do we start tomorrow?", "내일 몇 시에 시작해요?"),
        ln("around sunrise", "해 뜰 무렵", "We usually start around sunrise.", "보통 해 뜰 무렵에 시작해요."),
        ln("I'll be here at", "~시에 올게요", "No worries, I'll be here at six.", "알겠어요, 6시에 올게요."),
      ],
      [
        t("Any questions before we start?", "시작 전에 질문 있어요?", "시급인지 빈당인지 물어보세요", "Yes. Is it hourly or paid by the bin?", ["paid by the bin", "by the bin", "hourly"]),
        t("Paid by the bin. $40 a bin.", "빈당이에요. 한 빈에 40달러.", "몇 시에 시작하는지 물어보세요", "What time do we start?", ["what time", "when do we start"]),
        t("We start at sunrise, around 6.", "해 뜰 때, 6시쯤 시작해요.", "6시에 오겠다고 하세요", "Okay, I'll be here at 6.", ["at 6", "at six"]),
      ],
      o("See you then.", "그때 봐요.")),

    L("6", 1, "🚐", "농장 셔틀 타기", "픽업 장소·시간 확인하기·자리 있는지 묻기", "드라이버 Mick",
      [
        ln("the pick-up point", "픽업 장소", "Where's the pick-up point in the morning?", "아침에 픽업 장소가 어디예요?"),
        ln("out the front of", "~ 앞에", "Out the front of the hostel at 5:30.", "호스텔 앞에서 5시 반이요."),
        ln("a spare seat", "빈자리", "Is there a spare seat in the van?", "밴에 빈자리 있어요?"),
        ln("for the ride", "차비로", "It's ten bucks a day for the ride.", "차비는 하루에 10달러예요.", "bucks = dollars, 아주 흔하게 써요."),
        ln("don't leave without me", "저 두고 가지 마세요", "I'm running late, please don't leave without me!", "좀 늦어요, 저 두고 가지 마세요!"),
      ],
      [
        t("You need a lift to the farm tomorrow?", "내일 농장까지 태워 줄까요?", "네, 픽업 장소가 어디인지 물어보세요", "Yes, please. Where's the pick-up point?", ["pick-up point", "pick up point", "where do you pick"]),
        t("Out the front of the hostel, 5:30 sharp.", "호스텔 앞에서 5시 반 정각이요.", "차비가 얼마인지 물어보세요", "Great. How much is it for the ride?", ["for the ride", "how much"]),
        t("Ten bucks a day. Pay me on Friday.", "하루 10달러요. 금요일에 줘요.", "알겠다고, 5시 반에 앞에 있겠다고 하세요", "No worries. I'll be out the front at 5:30.", ["out the front", "at 5:30"]),
      ],
      o("Don't be late, mate. I won't wait.", "늦지 마요. 안 기다려요.")),

    L("7", 1, "🧤", "장비 받기", "버킷·전지가위·장갑 받고 사용법 묻기", "슈퍼바이저 Tara",
      [
        ln("a bucket and a pair of gloves", "버킷 하나와 장갑 한 켤레", "Grab a bucket and a pair of gloves.", "버킷 하나랑 장갑 한 켤레 챙겨요."),
        ln("secateurs", "전지가위", "Here are your secateurs. They're really sharp.", "여기 전지가위요. 엄청 날카로워요.", "호주에선 가위를 secateurs라고 해요."),
        ln("bring them back", "반납하다", "Please bring them back at the end of the day.", "일 끝나면 반납해 주세요."),
        ln("Do I need to buy", "제가 사야 하나요", "Do I need to buy my own gloves?", "장갑은 제가 사야 하나요?"),
        ln("cut the stem", "꼭지를 자르다", "Cut the stem close to the fruit.", "꼭지는 과일 가까이에서 잘라요."),
      ],
      [
        t("Right, here's your bucket and secateurs.", "자, 버킷이랑 전지가위예요.", "장갑도 제가 사야 하는지 물어보세요", "Thanks. Do I need to buy my own gloves?", ["buy my own gloves", "own gloves"]),
        t("Nah, gloves are in the box. Take a pair.", "아니요, 장갑은 상자에 있어요. 한 켤레 가져가요.", "꼭지는 어디를 자르는지 물어보세요", "Thanks. Where do I cut the stem?", ["cut the stem", "where do I cut"]),
        t("Close to the fruit. And bring them back at the end of the day.", "과일 가까이요. 그리고 일 끝나면 반납해요.", "일 끝나고 반납하겠다고 하세요", "Got it. I'll bring them back after work.", ["bring them back", "return them"]),
      ],
      o("Good. Watch your fingers.", "좋아요. 손가락 조심해요.")),

    L("8", 1, "📝", "TFN·슈퍼 서류 내기", "세금 번호·슈퍼 펀드·은행 정보 내기", "사무실 직원 Jenny",
      [
        ln("your TFN", "세금 파일 번호", "Can you write your TFN on this form?", "이 서류에 TFN 좀 적어 줄래요?", "TFN = Tax File Number, 일하려면 꼭 필요해요."),
        ln("super fund", "연금 펀드", "Do you have a super fund already?", "슈퍼 펀드 이미 있어요?"),
        ln("I don't have one yet", "아직 없어요", "Sorry, I don't have one yet.", "죄송해요, 아직 없어요."),
        ln("bank details", "은행 정보", "I'll email you my bank details today.", "오늘 은행 정보 이메일로 보내 드릴게요."),
        ln("When's payday", "급여일이 언제예요", "When's payday here, every week?", "여기 급여일이 언제예요, 매주예요?"),
      ],
      [
        t("Before you start, I need your TFN and bank details.", "시작 전에 TFN이랑 은행 정보가 필요해요.", "TFN은 여기 있다고 하세요", "Sure, here's my TFN.", ["my TFN", "tax file number"]),
        t("Thanks. Which super fund are you with?", "고마워요. 어느 슈퍼 펀드 써요?", "아직 없다고 하세요", "Sorry, I don't have one yet.", ["don't have one", "no super fund"]),
        t("No problem, we'll put you in ours.", "괜찮아요, 우리 쪽 펀드로 넣어 줄게요.", "고맙다고 하고 급여일이 언제인지 물어보세요", "Thanks. When's payday?", ["when's payday", "when do we get paid"]),
      ],
      o("Every Thursday, straight into your account.", "매주 목요일에 계좌로 바로 들어가요.")),

    L("9", 1, "🚻", "화장실·물 위치 묻기", "화장실·식수·그늘 위치 확인하기", "동료 Leo",
      [
        ln("Where's the toilet", "화장실이 어디예요", "Sorry, where's the toilet around here?", "실례지만 이 근처 화장실 어디예요?", "호주에선 toilet, loo라고 많이 해요."),
        ln("a portaloo", "이동식 화장실", "There's a portaloo at the end of row 5.", "5번 줄 끝에 이동식 화장실이 있어요."),
        ln("fill up my water bottle", "물병을 채우다", "Where can I fill up my water bottle?", "물병은 어디서 채울 수 있어요?"),
        ln("next to the shed", "창고 옆에", "There's a water tank next to the shed.", "창고 옆에 물탱크가 있어요."),
        ln("in the shade", "그늘에서", "We have lunch in the shade over there.", "점심은 저기 그늘에서 먹어요."),
      ],
      [
        t("All good? You look a bit lost.", "괜찮아요? 좀 헤매는 것 같은데.", "화장실이 어디인지 물어보세요", "Yeah, sorry. Where's the toilet?", ["where's the toilet", "toilet", "loo"]),
        t("There's a portaloo at the end of row 5.", "5번 줄 끝에 이동식 화장실 있어요.", "물병은 어디서 채우는지도 물어보세요", "Thanks. Where can I fill up my water bottle?", ["fill up my water bottle", "water bottle"]),
        t("Water tank's next to the shed.", "물탱크는 창고 옆에 있어요.", "창고 옆이냐고 확인하세요", "Next to the shed? Got it.", ["next to the shed", "got it"]),
      ],
      o("Drink heaps. It gets hot out here.", "물 많이 마셔요. 여기 엄청 더워져요.")),

    // ───────── STEP 2: 매일 하는 피킹·패킹 ─────────
    L("3", 2, "🧺", "작업 중 동료와", "몇 빈 했는지·스모코·줄 번호 말하기", "동료",
      [
        ln("so far", "지금까지", "I've done three bins so far.", "지금까지 세 빈 했어요."),
        ln("Smoko's at", "스모코는 ~시", "Smoko's at ten, by the way.", "그나저나 스모코는 10시예요.", "smoko = 오전·오후 짧은 휴식 시간이에요."),
        ln("Which row are you on", "몇 번째 줄 해요", "Which row are you on today?", "오늘 몇 번째 줄 해요?"),
        ln("I'm on row", "~번 줄이에요", "I'm on row twelve, near the gate.", "12번 줄이에요, 문 근처요."),
        ln("next to you", "옆에", "Cool, I'm right next to you then.", "그럼 제가 바로 옆이네요."),
      ],
      [
        t("How many bins have you done?", "몇 빈 했어요?", "지금까지 세 빈 했다고 하세요", "I've done three bins so far.", ["three bins", "3 bins"]),
        t("Nice! Smoko's at 10, by the way.", "오! 그나저나 스모코는 10시예요.", "고맙다고, 스모코 때 보자고 하세요", "Thanks. See you at smoko.", ["smoko", "see you"]),
        t("Which row are you on?", "몇 번째 줄 하고 있어요?", "12번 줄이라고 하세요", "I'm on row 12.", ["row 12", "row twelve"]),
      ],
      o("Cool, I'm next to you then.", "그럼 제가 옆이네요.")),

    L("4", 2, "📦", "패킹 셰드 작업", "할 일 묻기·불량 빼기·퇴근 시간 확인하기", "슈퍼바이저",
      [
        ln("the packing shed", "패킹 셰드", "Today you're working in the packing shed.", "오늘은 패킹 셰드에서 일해요."),
        ln("What do I need to do", "뭘 하면 돼요", "Okay, what do I need to do first?", "네, 먼저 뭘 하면 돼요?"),
        ln("take out the bad ones", "상한 걸 빼다", "Check the fruit and take out the bad ones.", "과일 확인하고 상한 건 빼요."),
        ln("knock off", "퇴근하다", "We knock off at four today.", "오늘은 4시에 퇴근해요.", "knock off = 일 마치다, 호주에서 정말 많이 써요."),
        ln("on the dot", "정각에", "The bell goes at four on the dot.", "4시 정각에 벨이 울려요."),
      ],
      [
        t("Today you're in the packing shed.", "오늘은 패킹 셰드에서 일해요.", "무엇을 하면 되는지 물어보세요", "Okay. What do I need to do?", ["what do I need to do", "what should I do"]),
        t("Check the fruit and take out any bad ones.", "과일 확인하고 상한 건 빼요.", "상한 건 빼겠다고 확인하세요", "Got it. I'll take out the bad ones.", ["take out", "remove"]),
        t("We knock off at 4.", "4시에 끝나요.", "4시에 끝나는 거 맞는지 되물어 보세요", "So we knock off at 4?", ["knock off", "finish at 4"]),
      ],
      o("Yep, 4 on the dot.", "네, 4시 정각이요.")),

    L("10", 2, "🏷️", "빈 다 채우고 태그 받기", "빈 찼다고 알리고 내 번호 기록 확인하기", "체커 Sharon",
      [
        ln("This bin's full", "이 빈 다 찼어요", "This bin's full. Can you check it?", "이 빈 다 찼어요. 확인해 주실래요?"),
        ln("picker number", "피커 번호", "What's your picker number again?", "피커 번호가 뭐였죠?", "번호로 빈 개수를 세니 꼭 외워 두세요."),
        ln("My number is", "제 번호는", "My number is forty-seven.", "제 번호는 47번이에요."),
        ln("top it up", "위까지 더 채우다", "It's a bit short. Top it up a little.", "조금 모자라요. 조금 더 채워요."),
        ln("on my tally", "제 기록에", "Is that bin on my tally now?", "그 빈 이제 제 기록에 들어갔어요?"),
      ],
      [
        t("Need something, love?", "뭐 필요해요?", "빈이 다 찼다고 하세요", "Yes, this bin's full.", ["bin's full", "bin is full"]),
        t("It's a bit short in the corner. Top it up.", "구석이 좀 모자라요. 조금 더 채워요.", "알겠다고, 금방 채우겠다고 하세요", "No worries, I'll top it up now.", ["top it up", "fill it up"]),
        t("Good. What's your picker number?", "좋아요. 피커 번호가 뭐예요?", "47번이라고 하세요", "My number is 47.", ["number is 47", "47", "forty-seven"]),
        t("Done, that's your fifth today.", "됐어요, 오늘 다섯 번째예요.", "제 기록에 들어갔는지 확인하세요", "Great. So it's on my tally?", ["on my tally", "counted"]),
      ],
      o("Yep, all recorded. Keep it up.", "네, 다 기록됐어요. 계속 잘해요.")),

    L("11", 2, "☕", "스모코 시간 수다", "어디서 왔는지·얼마나 일했는지 이야기하기", "동료 Emma",
      [
        ln("How long have you been here", "여기 온 지 얼마나 됐어요", "How long have you been here?", "여기 온 지 얼마나 됐어요?"),
        ln("about two weeks", "2주쯤", "About two weeks now. It's going fast.", "이제 2주쯤 됐어요. 시간 빨리 가요."),
        ln("doing my days", "비자 일수 채우는 중", "I'm doing my days for a second visa.", "세컨 비자 일수 채우는 중이에요.", "doing my days = 88일 채우는 걸 줄여 말해요."),
        ln("knackered", "녹초가 된", "I'm absolutely knackered after this morning.", "오늘 아침 일하고 완전 녹초예요."),
        ln("heading after this", "다음에 갈 곳", "Where are you heading after this?", "여기 끝나면 어디로 가요?"),
      ],
      [
        t("So where are you from?", "어디서 왔어요?", "한국에서 왔다고 하고 상대는 여기 얼마나 있었는지 물어보세요", "I'm from Korea. How long have you been here?", ["how long have you been", "from Korea"]),
        t("About a month. You?", "한 달쯤이요. 당신은요?", "2주쯤 됐다고, 세컨 비자 일수 채우는 중이라고 하세요", "About two weeks. I'm doing my days for a second visa.", ["doing my days", "second visa"]),
        t("Same here. Where are you heading after this?", "저도요. 여기 끝나면 어디 가요?", "아직 모르겠다고, 아마 퀸즐랜드라고 하세요", "Not sure yet. Maybe Queensland.", ["not sure", "maybe Queensland"]),
      ],
      o("Nice. Back to it, smoko's over.", "좋네요. 다시 일하러 가요, 스모코 끝났어요.")),

    L("12", 2, "↔️", "다음 줄로 옮기기", "줄 끝났다고 알리고 다음 줄 받기", "슈퍼바이저 Dave",
      [
        ln("I've finished this row", "이 줄 끝냈어요", "I've finished this row. Where to next?", "이 줄 끝냈어요. 다음은 어디예요?"),
        ln("Where to next", "다음은 어디", "All done here. Where to next, Dave?", "여기 다 했어요. 다음은 어디예요, 데이브?"),
        ln("move over to", "~로 옮기다", "Move over to row 20 after that.", "그다음엔 20번 줄로 옮겨요."),
        ln("did you check underneath", "아래쪽도 확인했어요", "Did you check underneath the leaves?", "잎 아래쪽도 확인했어요?"),
        ln("missed a few", "몇 개 놓쳤어요", "Sorry, I missed a few at the bottom.", "죄송해요, 아래쪽 몇 개 놓쳤어요."),
      ],
      [
        t("How are you going down there?", "거기 어때요?", "이 줄 끝냈다고, 다음은 어디냐고 물어보세요", "I've finished this row. Where to next?", ["finished this row", "where to next"]),
        t("Hang on. Did you check underneath the leaves?", "잠깐요. 잎 아래도 확인했어요?", "몇 개 놓친 것 같다고, 다시 보겠다고 하세요", "Oh, I missed a few. I'll check again.", ["missed a few", "check again"]),
        t("Good. Then move over to row 20.", "좋아요. 그다음 20번 줄로 가요.", "20번 줄 맞는지 확인하세요", "Row 20, got it.", ["row 20", "row twenty"]),
      ],
      o("Sweet. Don't leave any behind.", "좋아요. 하나도 남기지 말고요.")),

    L("13", 2, "🫐", "블루베리 펀넷 채우기", "펀넷 무게 맞추고 트레이에 담기", "슈퍼바이저 Kim",
      [
        ln("each punnet", "펀넷 하나하나", "Fill each punnet to the top, but not over.", "펀넷 하나하나 위까지 채우되 넘치지 않게요.", "punnet = 베리 담는 작은 플라스틱 통이에요."),
        ln("125 grams", "125그램", "Each one has to weigh 125 grams.", "하나에 125그램이 나가야 해요."),
        ln("put it on the scale", "저울에 올리다", "Put it on the scale to check the weight.", "무게 확인하게 저울에 올려요."),
        ln("a bit under", "조금 모자란", "This one's a bit under. Add two more.", "이건 조금 모자라요. 두 개 더 넣어요."),
        ln("on the tray", "트레이에", "Put twelve punnets on the tray.", "트레이에 펀넷 12개 올려요."),
      ],
      [
        t("Each punnet needs to be 125 grams.", "펀넷 하나에 125그램이어야 해요.", "저울에 올려서 확인하냐고 물어보세요", "Okay. Do I put it on the scale?", ["put it on the scale", "on the scale"]),
        t("Yep, every few. That one's a bit under.", "네, 몇 개마다요. 그건 조금 모자라요.", "알겠다고, 두 개 더 넣겠다고 하세요", "Oh, I'll add two more.", ["add two more", "add more"]),
        t("Perfect. Twelve on each tray.", "완벽해요. 트레이마다 12개요.", "트레이에 12개 맞는지 확인하세요", "Twelve on each tray, got it.", ["on each tray", "twelve"]),
      ],
      o("Nice and quick. Good work.", "빠르고 좋네요. 잘했어요.")),

    // ───────── STEP 3: 슈퍼바이저 세부 지시 ─────────
    L("14", 3, "🔍", "품질 기준 다시 듣기", "크기·흠집 기준 확인하고 애매한 것 물어보기", "슈퍼바이저 Tara",
      [
        ln("too small", "너무 작은", "Anything too small goes on the ground.", "너무 작은 건 다 바닥에 버려요."),
        ln("no marks or bruises", "흠집이나 멍 없이", "They need to have no marks or bruises.", "흠집이나 멍이 없어야 해요."),
        ln("What about this one", "이건 어때요", "What about this one? It's a bit soft.", "이건 어때요? 좀 물러요."),
        ln("When in doubt", "애매하면", "When in doubt, leave it out.", "애매하면 빼요.", "When in doubt, leave it out. 현장에서 자주 듣는 말이에요."),
        ln("the size ring", "크기 측정 링", "Use the size ring if you're not sure.", "잘 모르겠으면 크기 측정 링을 써요."),
      ],
      [
        t("Customer's complaining. No marks or bruises from now on.", "거래처가 불만이에요. 이제 흠집이나 멍 있는 건 안 돼요.", "흠집이나 멍 없는 것만 따겠다고 확인하세요", "Got it. No marks or bruises.", ["no marks or bruises", "no bruises"]),
        t("And nothing too small. Use the size ring.", "너무 작은 것도 안 돼요. 크기 링 써요.", "이건 어떠냐고 들어서 물어보세요", "Okay. What about this one?", ["what about this one", "is this okay"]),
        t("Too soft. When in doubt, leave it out.", "너무 물러요. 애매하면 빼요.", "애매하면 빼겠다고 하세요", "Okay, when in doubt, leave it out.", ["leave it out", "when in doubt"]),
      ],
      o("Good. Quality over speed today.", "좋아요. 오늘은 속도보다 품질이에요.")),

    L("15", 3, "🍊", "등급별로 나누기", "1등급·2등급 구분해서 담기", "패킹 매니저 Raj",
      [
        ln("Class 1", "1등급", "Perfect ones go in Class 1.", "완벽한 건 1등급에 넣어요."),
        ln("seconds", "2등급품", "Small marks are fine for seconds.", "작은 흠집은 2등급으로 괜찮아요.", "seconds = 모양·흠이 있어 싸게 파는 2등급이에요."),
        ln("straight in the bin", "바로 쓰레기통에", "Anything rotten goes straight in the bin.", "썩은 건 바로 통에 버려요."),
        ln("Which box does this go in", "이건 어느 박스에 넣어요", "Which box does this go in?", "이건 어느 박스에 넣어요?"),
        ln("Keep an eye on", "~를 잘 지켜보다", "Keep an eye on the colour too.", "색깔도 잘 봐요."),
      ],
      [
        t("Perfect ones in Class 1, small marks in seconds.", "완벽한 건 1등급, 작은 흠은 2등급이요.", "어느 박스에 넣는지 하나 들고 물어보세요", "Which box does this go in?", ["which box", "where does this go"]),
        t("That's got a small mark. Seconds.", "작은 흠이 있네요. 2등급이요.", "그럼 썩은 건 어디에 버리는지 물어보세요", "Okay. And where do the rotten ones go?", ["rotten ones", "rotten"]),
        t("Straight in the bin under the belt.", "벨트 아래 통에 바로요.", "벨트 아래 통에 버리겠다고 하세요", "Got it, straight in the bin under the belt.", ["straight in the bin", "in the bin"]),
      ],
      o("You're a quick learner.", "빨리 배우네요.")),

    L("16", 3, "⚖️", "빈 너무 꽉 채우지 않기", "과일 상하지 않게 담는 법 듣기", "슈퍼바이저 Dave",
      [
        ln("overfill the bin", "빈을 넘치게 채우다", "Don't overfill the bin. They'll get squashed.", "빈을 넘치게 채우지 마요. 눌려서 뭉개져요."),
        ln("below the line", "선 아래로", "Keep it just below the line.", "선 바로 아래까지만 채워요."),
        ln("Don't drop them", "떨어뜨리지 마요", "Don't drop them in from up high.", "높은 데서 떨어뜨려 넣지 마요."),
        ln("tip them in gently", "살살 부어 넣다", "Tip them in gently from your bucket.", "버킷에서 살살 부어 넣어요."),
        ln("I didn't know that", "몰랐어요", "Sorry, I didn't know that.", "죄송해요, 그건 몰랐어요."),
      ],
      [
        t("Mate, you can't overfill the bin like that.", "그렇게 빈을 넘치게 채우면 안 돼요.", "죄송하다고, 몰랐다고 하세요", "Sorry, I didn't know that.", ["didn't know", "sorry"]),
        t("Keep it below the line, or the bottom ones get squashed.", "선 아래까지만요, 안 그러면 아래 것들이 뭉개져요.", "선 아래까지만 채우겠다고 하세요", "Okay, I'll keep it below the line.", ["below the line", "under the line"]),
        t("And tip them in gently. Don't drop them.", "그리고 살살 부어요. 떨어뜨리지 말고.", "살살 붓겠다고 확인하세요", "Got it. I'll tip them in gently.", ["tip them in gently", "gently"]),
      ],
      o("Good. Bruised fruit costs us money.", "좋아요. 멍든 과일은 손해예요.")),

    L("17", 3, "🪜", "사다리 쓰는 법 듣기", "과수원 사다리 세우는 법 확인하기", "슈퍼바이저 Tom",
      [
        ln("orchard ladder", "과수원용 사다리", "Have you used an orchard ladder before?", "과수원 사다리 써 본 적 있어요?"),
        ln("on flat ground", "평평한 땅에", "Always set it up on flat ground.", "항상 평평한 땅에 세워요."),
        ln("lean too far", "너무 몸을 내밀다", "Never lean too far to one side.", "한쪽으로 너무 몸을 내밀면 절대 안 돼요."),
        ln("move the ladder", "사다리를 옮기다", "Get down and move the ladder instead.", "대신 내려와서 사다리를 옮겨요."),
        ln("the top step", "맨 위 칸", "Don't stand on the top step.", "맨 위 칸에는 서지 마요."),
      ],
      [
        t("Have you used an orchard ladder before?", "과수원 사다리 써 본 적 있어요?", "아니라고, 어떻게 세우는지 물어보세요", "No, never. How do I set it up?", ["how do I set it up", "set it up"]),
        t("On flat ground, three legs steady. And never lean too far.", "평평한 땅에, 다리 세 개 단단히요. 그리고 너무 몸 내밀지 마요.", "손이 안 닿으면 어떻게 하는지 물어보세요", "What if I can't reach the fruit?", ["can't reach", "what if"]),
        t("Get down and move the ladder.", "내려와서 사다리를 옮겨요.", "내려와서 사다리를 옮기겠다고 확인하세요", "Okay, I'll get down and move the ladder.", ["move the ladder", "get down"]),
      ],
      o("Good. No heroes on the ladder.", "좋아요. 사다리에서 무리하지 마요.")),

    L("18", 3, "🗺️", "다른 블록으로 이동", "이동 지시 듣고 위치·장비 확인하기", "슈퍼바이저 Tara",
      [
        ln("Block 5", "5번 블록", "We're moving to Block 5 after smoko.", "스모코 끝나고 5번 블록으로 이동해요.", "농장은 구역을 block이라고 불러요."),
        ln("by the dam", "저수지 옆", "It's the one by the dam.", "저수지 옆에 있는 데예요."),
        ln("Should I bring", "~ 가져가야 해요", "Should I bring my bucket and ladder?", "버킷이랑 사다리 가져가야 해요?"),
        ln("jump on the trailer", "트레일러에 올라타다", "Jump on the trailer, we'll drive you over.", "트레일러에 타요, 데려다줄게요."),
        ln("leave your bin here", "빈은 여기 두다", "Just leave your bin here for the tractor.", "빈은 트랙터가 가져가게 여기 둬요."),
      ],
      [
        t("Change of plan. We're all moving to Block 5.", "계획 변경이에요. 다 같이 5번 블록으로 가요.", "5번 블록이 어디인지 물어보세요", "Where's Block 5?", ["where's Block 5", "Block 5"]),
        t("The one by the dam. Jump on the trailer.", "저수지 옆이요. 트레일러에 타요.", "버킷이랑 사다리 가져가야 하는지 물어보세요", "Should I bring my bucket and ladder?", ["should I bring", "bring my bucket"]),
        t("Bucket yes, ladder no. Leave your bin here.", "버킷은 가져가고 사다리는 아니요. 빈은 여기 둬요.", "알겠다고, 빈은 여기 두겠다고 하세요", "Okay, I'll leave my bin here.", ["leave my bin", "leave it here"]),
      ],
      o("Good, let's move.", "좋아요, 가요.")),

    L("19", 3, "📱", "내일 일 있는지 묻기", "작업 여부·연락 방법 확인하기", "슈퍼바이저 Dave",
      [
        ln("Is there work tomorrow", "내일 일 있어요", "Is there work tomorrow, or are we off?", "내일 일 있어요, 아니면 쉬어요?"),
        ln("depends on the weather", "날씨에 따라 달라요", "It depends on the weather, mate.", "날씨에 따라 달라요."),
        ln("the group chat", "단톡방", "I'll post it in the group chat tonight.", "오늘 밤 단톡방에 올릴게요.", "농장 공지는 왓츠앱 단톡방으로 많이 해요."),
        ln("add me to", "~에 추가하다", "Can you add me to the group chat?", "저도 단톡방에 추가해 줄래요?"),
        ln("by 7pm", "저녁 7시까지", "I'll let you know by 7pm.", "저녁 7시까지 알려 줄게요."),
      ],
      [
        t("That's it for today, guys.", "오늘은 여기까지예요.", "내일 일 있는지 물어보세요", "Is there work tomorrow?", ["work tomorrow", "working tomorrow"]),
        t("Depends on the weather. I'll post it in the group chat.", "날씨에 따라요. 단톡방에 올릴게요.", "저는 아직 단톡방에 없다고, 추가해 달라고 하세요", "I'm not in it yet. Can you add me?", ["add me", "not in it"]),
        t("Sure, what's your number?", "그래요, 번호가 뭐예요?", "번호를 주겠다고 하고 몇 시까지 알려 주는지 물어보세요", "Here it is. What time will you let us know?", ["what time", "let us know"]),
      ],
      o("By 7pm at the latest.", "늦어도 저녁 7시까지요.")),

    // ───────── STEP 4: 부상·실수·안전 ─────────
    L("5", 4, "🤕", "허리가 아플 때", "아프다고 말하고 쉬는 시간 요청하기", "슈퍼바이저",
      [
        ln("a sore back", "허리 통증", "I've got a sore back from bending all day.", "하루 종일 숙여서 허리가 아파요."),
        ln("take a short break", "잠깐 쉬다", "Can I take a short break, please?", "잠깐 쉬어도 될까요?"),
        ln("sit in the shade", "그늘에 앉다", "Go sit in the shade for a bit.", "가서 그늘에 좀 앉아 있어요."),
        ln("back in ten minutes", "10분 뒤에 돌아오다", "Thanks, I'll be back in ten minutes.", "고마워요, 10분 뒤에 돌아올게요."),
        ln("Take your time", "천천히 해요", "Take your time, no rush.", "천천히 해요, 급할 거 없어요."),
      ],
      [
        t("You okay? You look tired.", "괜찮아요? 피곤해 보여요.", "허리가 아프다고 하세요", "Not really. I've got a sore back.", ["sore back", "my back hurts"]),
        t("Oh no. Do you want to take a break?", "저런. 좀 쉴래요?", "네, 잠깐 쉬어도 되는지 물어보세요", "Yes, please. Can I take a short break?", ["take a short break", "take a break"]),
        t("Sure. Drink some water and sit in the shade.", "그래요. 물 마시고 그늘에 앉아 있어요.", "고맙다고, 10분 뒤에 돌아오겠다고 하세요", "Thanks. I'll be back in ten minutes.", ["back in ten minutes", "10 minutes"]),
      ],
      o("Take your time.", "천천히 해요.")),

    L("20", 4, "🥵", "더위 먹었을 때", "어지럽다고 말하고 동료 상태 알리기", "동료 Leo",
      [
        ln("I feel dizzy", "어지러워요", "I feel dizzy and a bit sick.", "어지럽고 좀 메스꺼워요."),
        ln("heat stroke", "열사병", "You might have heat stroke. Sit down.", "열사병일 수도 있어요. 앉아요.", "40도 넘는 날은 정말 조심해야 해요."),
        ln("get the supervisor", "슈퍼바이저를 부르다", "Stay here. I'll get the supervisor.", "여기 있어요. 슈퍼바이저 불러올게요."),
        ln("cool down", "열을 식히다", "Put a wet towel on your neck to cool down.", "열 식게 목에 젖은 수건 올려요."),
        ln("drinking enough water", "물을 충분히 마시다", "Have you been drinking enough water?", "물 충분히 마셨어요?"),
      ],
      [
        t("Hey, you've gone really pale.", "얼굴이 엄청 하얘졌어요.", "어지럽고 메스껍다고 하세요", "I feel dizzy and a bit sick.", ["feel dizzy", "dizzy"]),
        t("Sit down here. Have you been drinking enough water?", "여기 앉아요. 물 충분히 마셨어요?", "별로 안 마셨다고 하세요", "Not really. I forgot to drink.", ["not really", "forgot to drink"]),
        t("Right, stay here. I'll get the supervisor.", "알겠어요, 여기 있어요. 슈퍼바이저 불러올게요.", "고맙다고, 그늘에 있겠다고 하세요", "Thanks. I'll stay in the shade.", ["stay in the shade", "stay here"]),
      ],
      o("Sip slowly. I'll be right back.", "천천히 마셔요. 금방 올게요.")),

    L("21", 4, "😬", "상한 과일 섞여서 지적받음", "실수 인정하고 다시 고르겠다고 하기", "슈퍼바이저 Tara",
      [
        ln("rotten ones in here", "여기 썩은 것들", "There are rotten ones in here.", "여기 썩은 게 섞여 있어요."),
        ln("That's my fault", "제 잘못이에요", "Sorry, that's my fault.", "죄송해요, 제 잘못이에요."),
        ln("go through it again", "다시 한번 훑어보다", "I'll go through it again right now.", "지금 바로 다시 볼게요."),
        ln("It won't happen again", "다신 안 그럴게요", "It won't happen again, I promise.", "다신 안 그럴게요, 약속해요."),
        ln("rejected the whole bin", "빈 전체를 반려하다", "The shed rejected the whole bin.", "패킹 셰드에서 빈 전체를 반려했어요."),
      ],
      [
        t("Whose bin is this? There are rotten ones in here.", "이거 누구 빈이에요? 썩은 게 섞여 있어요.", "제 거라고, 제 잘못이라고 하세요", "Sorry, it's mine. That's my fault.", ["my fault", "it's mine"]),
        t("The shed nearly rejected the whole bin.", "셰드에서 빈 전체 반려할 뻔했어요.", "지금 바로 다시 고르겠다고 하세요", "I'll go through it again right now.", ["go through it again", "check it again"]),
        t("Okay. Check every one before it goes in.", "알겠어요. 넣기 전에 하나하나 확인해요.", "다신 안 그러겠다고 하세요", "Got it. It won't happen again.", ["won't happen again", "won't happen"]),
      ],
      o("All good. Everyone stuffs up at first.", "괜찮아요. 처음엔 다 실수해요.")),

    L("22", 4, "🐍", "뱀을 봤을 때", "동료에게 경고하고 슈퍼바이저에게 알리기", "동료 Emma",
      [
        ln("There's a snake", "뱀이 있어요", "Stop! There's a snake under the bush!", "멈춰요! 덤불 밑에 뱀이 있어요!"),
        ln("back away slowly", "천천히 물러나다", "Don't touch it. Just back away slowly.", "건드리지 마요. 천천히 물러나요.", "호주 뱀은 독이 많아요. 절대 잡지 마요."),
        ln("Stay away from", "~에서 떨어져 있어요", "Stay away from row 8 for now.", "당분간 8번 줄엔 가지 마요."),
        ln("radio the supervisor", "슈퍼바이저에게 무전하다", "I'll radio the supervisor now.", "지금 슈퍼바이저한테 무전할게요."),
        ln("brown snake", "브라운 스네이크", "It looked like a brown snake.", "브라운 스네이크 같았어요."),
      ],
      [
        t("What's wrong? Why did you stop?", "왜요? 왜 멈췄어요?", "덤불 밑에 뱀이 있다고 하세요", "There's a snake under that bush!", ["there's a snake", "snake"]),
        t("Oh no! What do we do?", "헐! 어떡해요?", "건드리지 말고 천천히 물러나라고 하세요", "Don't touch it. Back away slowly.", ["back away slowly", "back away"]),
        t("Okay, I'm away from it.", "네, 떨어졌어요.", "슈퍼바이저한테 무전하겠다고 하세요", "Good. I'll radio the supervisor.", ["radio the supervisor", "tell the supervisor"]),
      ],
      o("Thanks. I'm not going near that row.", "고마워요. 저 줄엔 안 갈래요.")),

    L("23", 4, "🩹", "손을 베였을 때", "다친 걸 알리고 응급처치 받기", "슈퍼바이저 Tom",
      [
        ln("cut my finger", "손가락을 베다", "I cut my finger with the secateurs.", "전지가위에 손가락을 베었어요."),
        ln("first aid kit", "구급상자", "Where's the first aid kit?", "구급상자 어디 있어요?"),
        ln("Press on it", "눌러요", "Press on it hard to stop the bleeding.", "피 멈추게 세게 눌러요."),
        ln("fill out an incident report", "사고 보고서를 쓰다", "We need to fill out an incident report.", "사고 보고서를 써야 해요.", "작은 부상도 꼭 보고서로 남겨 두세요."),
        ln("It's not deep", "깊지 않아요", "It's not deep, but it's bleeding a lot.", "깊진 않은데 피가 많이 나요."),
      ],
      [
        t("What happened to your hand?", "손 왜 그래요?", "전지가위에 손가락을 베었다고 하세요", "I cut my finger with the secateurs.", ["cut my finger", "cut my hand"]),
        t("Let me see. Is it deep?", "봐요. 깊어요?", "깊진 않은데 피가 많이 난다고 하세요", "It's not deep, but it's bleeding a lot.", ["not deep", "bleeding"]),
        t("Press on it. I'll grab the first aid kit.", "눌러요. 구급상자 가져올게요.", "고맙다고 하고 보고서도 써야 하는지 물어보세요", "Thanks. Do I need to fill out an incident report?", ["incident report", "report"]),
      ],
      o("Yep, we'll do it together after.", "네, 이따 같이 써요.")),

    L("24", 4, "🧮", "빈 개수가 틀렸을 때", "기록 확인 요청하고 정정 부탁하기", "사무실 직원 Jenny",
      [
        ln("doesn't look right", "맞지 않는 것 같아요", "My payslip doesn't look right.", "급여 명세서가 맞지 않는 것 같아요."),
        ln("I picked 30 bins", "30빈 땄어요", "I picked 30 bins last week, not 25.", "지난주에 25빈이 아니라 30빈 땄어요."),
        ln("I wrote it down", "적어 뒀어요", "I wrote it down every day in my phone.", "매일 휴대폰에 적어 뒀어요.", "빈 개수는 매일 직접 기록해 두세요."),
        ln("check the tally sheet", "기록지를 확인하다", "Could you check the tally sheet, please?", "기록지 좀 확인해 주실래요?"),
        ln("in the next pay", "다음 급여 때", "We'll fix it in the next pay.", "다음 급여 때 고쳐 드릴게요."),
      ],
      [
        t("Hi, what can I do for you?", "안녕하세요, 뭘 도와드릴까요?", "급여 명세서가 맞지 않는 것 같다고 하세요", "Hi. My payslip doesn't look right.", ["doesn't look right", "isn't right"]),
        t("Oh? It says 25 bins for last week.", "그래요? 지난주 25빈으로 돼 있어요.", "30빈 땄다고, 매일 적어 뒀다고 하세요", "I picked 30 bins. I wrote it down every day.", ["30 bins", "wrote it down"]),
        t("Hmm, let me check.", "음, 확인해 볼게요.", "기록지를 확인해 달라고 하세요", "Thanks. Could you check the tally sheet?", ["check the tally sheet", "tally sheet"]),
      ],
      o("You're right. We'll fix it in the next pay.", "맞네요. 다음 급여 때 고쳐 드릴게요.")),

    // ───────── STEP 5: 급여·비자·시즌 마무리 ─────────
    L("25", 5, "🛂", "88일 서류 사인 받기", "세컨 비자 일수 확인·고용 확인서 부탁하기", "농장 주인 Greg",
      [
        ln("88 days", "88일", "I've just finished my 88 days.", "88일 방금 다 채웠어요.", "세컨 비자는 지정 지역 일 88일이 필요해요."),
        ln("sign this form", "이 서류에 사인하다", "Could you sign this form for my visa?", "비자 때문에 이 서류에 사인해 주실 수 있어요?"),
        ln("the dates I worked", "제가 일한 날짜", "It just needs the dates I worked.", "제가 일한 날짜만 있으면 돼요."),
        ln("copies of my payslips", "급여 명세서 사본", "Can I also get copies of my payslips?", "급여 명세서 사본도 받을 수 있을까요?"),
        ln("ABN", "사업자 번호", "Does it need the farm's ABN?", "농장 사업자 번호도 필요해요?"),
      ],
      [
        t("G'day. What can I do for you?", "안녕하세요. 뭘 도와줄까요?", "88일 다 채웠다고, 비자 서류에 사인해 달라고 하세요", "I've finished my 88 days. Could you sign this form?", ["sign this form", "88 days"]),
        t("Sure. What do I need to fill in?", "그래요. 뭘 적으면 돼요?", "일한 날짜랑 농장 ABN만 적으면 된다고 하세요", "Just the dates I worked and the farm's ABN.", ["dates I worked", "ABN"]),
        t("Easy. Anything else?", "쉽네요. 또 있어요?", "급여 명세서 사본도 받을 수 있는지 물어보세요", "Can I also get copies of my payslips?", ["copies of my payslips", "payslips"]),
      ],
      o("No dramas. Jenny will email them to you.", "문제없어요. 제니가 이메일로 보내 줄 거예요.")),

    L("26", 5, "📄", "피스레이트 계약 확인", "계약 단가·최저 시급 보장 확인하기", "농장 매니저 Lisa",
      [
        ln("piece rate", "성과급(개수당 급여)", "Is this contract piece rate or hourly?", "이 계약은 성과급이에요, 시급이에요?"),
        ln("minimum hourly rate", "최저 시급", "Is there a minimum hourly rate as well?", "최저 시급 보장도 있어요?", "호주 원예 일은 성과급이어도 최저 시급 보장이 있어요."),
        ln("read it over", "꼼꼼히 읽어 보다", "Can I read it over before I sign?", "사인하기 전에 꼼꼼히 읽어 봐도 돼요?"),
        ln("per kilo", "킬로당", "It's ninety cents per kilo.", "킬로당 90센트예요."),
        ln("take it home", "집에 가져가다", "Sure, take it home and bring it back tomorrow.", "그래요, 집에 가져가서 내일 가져와요."),
      ],
      [
        t("Here's your contract. Sign at the bottom.", "계약서예요. 아래에 사인해요.", "성과급인지 시급인지 물어보세요", "Is it piece rate or hourly?", ["piece rate", "hourly"]),
        t("Piece rate. Ninety cents per kilo.", "성과급이요. 킬로당 90센트.", "최저 시급 보장도 있는지 물어보세요", "Is there a minimum hourly rate as well?", ["minimum hourly rate", "minimum rate"]),
        t("Yes, it's in section 4.", "네, 4항에 있어요.", "사인하기 전에 꼼꼼히 읽어 봐도 되는지 물어보세요", "Great. Can I read it over before I sign?", ["read it over", "read it first"]),
      ],
      o("Of course. Take your time.", "물론이죠. 천천히 봐요.")),

    L("27", 5, "🏠", "숙소비 공제 확인", "급여에서 빠진 숙소비·차비 물어보기", "사무실 직원 Jenny",
      [
        ln("taken out of my pay", "급여에서 빠지다", "Why was $180 taken out of my pay?", "왜 급여에서 180달러가 빠졌어요?"),
        ln("accommodation", "숙소비", "That's for accommodation, $150 a week.", "그건 숙소비예요, 주에 150달러."),
        ln("the other thirty", "나머지 30달러", "And what's the other thirty for?", "그럼 나머지 30달러는 뭐예요?"),
        ln("on the payslip", "명세서에", "Can you show me where it is on the payslip?", "명세서 어디에 있는지 보여 주실래요?"),
        ln("never agreed to", "동의한 적 없어요", "I never agreed to pay for transport.", "교통비 내기로 동의한 적 없어요.", "공제는 서면 동의가 있어야 해요."),
      ],
      [
        t("Hi again. Problem with your pay?", "또 왔네요. 급여 문제예요?", "왜 급여에서 180달러가 빠졌는지 물어보세요", "Yes. Why was $180 taken out of my pay?", ["taken out of my pay", "180"]),
        t("$150 is accommodation for the week.", "150달러는 한 주 숙소비예요.", "그럼 나머지 30달러는 뭐냐고 물어보세요", "Okay. What's the other thirty for?", ["other thirty", "what's the 30"]),
        t("That's the shuttle bus.", "그건 셔틀버스요.", "셔틀비 내기로 동의한 적 없다고, 명세서에서 보여 달라고 하세요", "I never agreed to that. Can you show me on the payslip?", ["never agreed", "on the payslip"]),
      ],
      o("Let me check with Greg and get back to you.", "그렉한테 확인하고 다시 알려 줄게요.")),

    L("28", 5, "🌧️", "비 와서 작업 중단", "작업 중단 공지 받고 일수·급여 확인하기", "슈퍼바이저 Dave",
      [
        ln("rained out", "비로 작업이 취소된", "We're rained out for the rest of the day.", "남은 하루는 비 때문에 작업 취소예요."),
        ln("Do we still get paid", "그래도 돈 받아요", "Do we still get paid for this morning?", "그래도 오늘 아침 일한 건 돈 받아요?"),
        ln("count as a day", "하루로 치다", "Does today still count as a day?", "오늘도 하루로 쳐요?", "비자 일수 계산은 꼭 직접 확인하세요."),
        ln("the hours you worked", "일한 시간", "You'll get paid for the hours you worked.", "일한 시간만큼은 받아요."),
        ln("make it up on Saturday", "토요일에 채우다", "We might make it up on Saturday.", "토요일에 채울 수도 있어요."),
      ],
      [
        t("That's it, everyone. We're rained out.", "자, 여러분. 비 때문에 끝이에요.", "오늘 아침 일한 건 돈 받는지 물어보세요", "Do we still get paid for this morning?", ["still get paid", "get paid"]),
        t("Yep, for the hours you worked.", "네, 일한 시간만큼이요.", "오늘도 비자 일수 하루로 치는지 물어보세요", "Does today still count as a day for my visa?", ["count as a day", "count"]),
        t("Best to check with the office. We might make it up on Saturday.", "사무실에 확인해 봐요. 토요일에 채울 수도 있어요.", "토요일에 일할 수 있다고 하세요", "No worries. I can work on Saturday.", ["work on Saturday", "Saturday"]),
      ],
      o("Good stuff. I'll put it in the group chat.", "좋아요. 단톡방에 올릴게요.")),

    L("29", 5, "🧑‍🏫", "새로 온 피커 가르치기", "새 사람에게 방법·규칙 알려 주기", "새 피커 Yuki",
      [
        ln("I'll show you", "보여 줄게요", "Don't worry, I'll show you the ropes.", "걱정 마요, 요령 알려 줄게요.", "show someone the ropes = 일 요령을 알려 주다"),
        ln("Twist and pull", "돌려서 당기다", "Twist and pull, don't yank it.", "돌려서 당겨요, 확 잡아당기지 말고요."),
        ln("Start from the bottom", "아래부터 시작하다", "Start from the bottom and work up.", "아래부터 시작해서 위로 올라가요."),
        ln("Don't forget", "잊지 마요", "Don't forget to write down your bins.", "빈 개수 적는 거 잊지 마요."),
        ln("ask the supervisor", "슈퍼바이저에게 물어보다", "If you're not sure, ask the supervisor.", "잘 모르겠으면 슈퍼바이저한테 물어봐요."),
      ],
      [
        t("Hi, it's my first day. Tara said to follow you.", "안녕하세요, 첫날이에요. 타라가 따라다니래요.", "걱정 말라고, 요령 알려 주겠다고 하세요", "No worries, I'll show you the ropes.", ["show you the ropes", "show you"]),
        t("Thanks! How do I pick them?", "고마워요! 어떻게 따요?", "돌려서 당기라고, 아래부터 시작하라고 하세요", "Twist and pull. Start from the bottom.", ["twist and pull", "start from the bottom"]),
        t("Got it. Anything else?", "알겠어요. 또 있어요?", "빈 개수 적는 거 잊지 말라고 하세요", "Don't forget to write down your bins.", ["write down your bins", "don't forget"]),
      ],
      o("Thanks so much. You're a legend.", "정말 고마워요. 최고예요.")),

    L("30", 5, "👋", "시즌 마지막 날", "인사하고 추천서·최종 급여·다음 시즌 묻기", "농장 주인 Greg",
      [
        ln("my last day", "마지막 날", "Today's my last day, Greg.", "오늘이 제 마지막 날이에요, 그렉."),
        ln("a reference", "추천서", "Could you be a reference for my next job?", "다음 일자리 추천인이 돼 주실 수 있어요?"),
        ln("final pay", "마지막 급여", "When will my final pay come through?", "마지막 급여는 언제 들어와요?"),
        ln("next season", "다음 시즌", "Can I come back next season?", "다음 시즌에 다시 와도 돼요?"),
        ln("You've been a great help", "큰 도움이 됐어요", "You've been a great help this season.", "이번 시즌 큰 도움이 됐어요."),
      ],
      [
        t("So today's the big day, eh?", "오늘이 그날이네요?", "네, 마지막 날이라고, 고마웠다고 하세요", "Yes, it's my last day. Thanks for everything.", ["my last day", "last day"]),
        t("You've been a great help this season.", "이번 시즌 큰 도움이 됐어요.", "다음 일자리 추천인이 돼 줄 수 있는지 물어보세요", "Thanks! Could you be a reference for me?", ["reference", "referee"]),
        t("Absolutely. Just give them my number.", "당연하죠. 제 번호 주면 돼요.", "마지막 급여는 언제 들어오는지 물어보세요", "Great. When will my final pay come through?", ["final pay", "last pay"]),
        t("Next Thursday, same as usual.", "다음 주 목요일, 평소처럼요.", "다음 시즌에 다시 와도 되는지 물어보세요", "Perfect. Can I come back next season?", ["next season", "come back"]),
      ],
      o("Anytime, mate. Safe travels.", "언제든지요. 조심히 다녀요.")),
  ],
};

export default curriculum;
