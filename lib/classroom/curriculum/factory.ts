import { L, ln, o, t, type JobCurriculum } from "./kit";

const curriculum: JobCurriculum = {
  steps: ["첫 출근·안전 장비", "매일 라인 작업", "지시·요청 알아듣기", "부상·고장·위생 문제", "교대·조율·종합"],
  lessons: [
    // ───────── STEP 1: 첫 출근·안전 장비 ─────────
    L("1", 1, "🦺", "인덕션과 보호 장비", "안전 교육·PPE·헤어넷", "슈퍼바이저",
      [
        ln("finished my induction", "인덕션(안전 교육)을 마쳤다", "I finished my induction this morning.", "오늘 아침에 인덕션 마쳤어요.", "첫날 안전 교육을 induction이라고 해요."),
        ln("PPE", "개인 보호 장비", "Where can I get my PPE?", "보호 장비는 어디서 받아요?", "PPE = 장갑·장화·헤어넷 같은 보호 장비예요."),
        ln("hairnet", "헤어넷", "Put your hairnet on before you go in.", "들어가기 전에 헤어넷 쓰세요."),
        ln("in the locker room", "탈의실에", "Gloves and boots are in the locker room.", "장갑이랑 장화는 탈의실에 있어요."),
        ln("on the floor", "작업장에서", "I'll see you on the floor at six.", "6시에 작업장에서 봐요."),
      ],
      [
        t("Welcome. Did you finish your induction?", "어서 와요. 인덕션 끝냈어요?", "오늘 아침에 끝냈다고 하세요", "Yes, I finished my induction this morning.", ["finished my induction", "induction"]),
        t("Good. Where's your PPE?", "좋아요. 보호 장비는요?", "보호 장비는 어디서 받는지 물어보세요", "Where can I get my PPE?", ["PPE"]),
        t("In the locker room. Gloves, boots and a hairnet.", "탈의실에 있어요. 장갑, 장화, 헤어넷.", "헤어넷까지 다 착용하겠다고 하세요", "Okay, I'll put on gloves, boots and a hairnet.", ["hairnet"]),
      ],
      o("Good. See you on the floor.", "좋아요. 작업장에서 봐요.")),

    L("2", 1, "🏭", "라인 배치 받기", "라인 속도 묻기·로테이션 확인", "슈퍼바이저",
      [
        ln("on the line", "라인에서", "You're on the line today, packing.", "오늘은 라인에서 포장해요."),
        ln("Is the line fast", "라인이 빨라요", "Is the line fast on this side?", "이쪽 라인은 빨라요?"),
        ln("keep up", "따라가다", "Tell me if you can't keep up.", "못 따라가면 말해 주세요."),
        ln("rotate", "자리를 돌아가며 바꾸다", "We rotate every two hours.", "2시간마다 자리 바꿔요.", "손목 보호 때문에 자리를 자주 바꿔요."),
        ln("get used to it", "익숙해지다", "It's quick, but you'll get used to it.", "빠르지만 금방 익숙해질 거예요."),
      ],
      [
        t("You're on the line today, packing.", "오늘은 라인에서 포장해요.", "라인이 빠른지 물어보세요", "Okay. Is the line fast?", ["is the line fast", "how fast"]),
        t("It's quick, but you'll get used to it.", "빠르지만 금방 익숙해져요.", "따라가기 힘들면 말하겠다고 하세요", "Okay. I'll tell you if I can't keep up.", ["keep up"]),
        t("Good. We rotate every two hours.", "2시간마다 자리 바꿔요.", "2시간마다 바꾸는 거 맞는지 되물어 보세요", "So we rotate every two hours?", ["rotate"]),
      ],
      o("That's right.", "맞아요.")),

    L("6", 1, "🧼", "위생 구역 들어가기", "장화 세척·손 씻기·앞치마 순서 지키기", "QA 담당 Lisa",
      [
        ln("boot wash", "장화 세척대", "Go through the boot wash first.", "먼저 장화 세척대를 지나가세요."),
        ln("wash your hands", "손을 씻다", "Wash your hands for twenty seconds.", "손을 20초 동안 씻으세요."),
        ln("white apron", "흰 앞치마", "Grab a clean white apron from the rack.", "선반에서 깨끗한 흰 앞치마 하나 가져가요."),
        ln("no jewellery", "장신구 금지", "Sorry, no jewellery on the floor.", "죄송하지만 작업장에선 장신구 안 돼요.", "반지·귀걸이 다 빼야 해요."),
        ln("Do I need to take off", "빼야 하나요", "Do I need to take off my ring?", "반지 빼야 하나요?"),
      ],
      [
        t("Before you go in, go through the boot wash.", "들어가기 전에 장화 세척대 지나가요.", "장화 세척대 지나가고 손 씻겠다고 하세요", "Okay, boot wash, then I'll wash my hands.", ["boot wash", "wash my hands"]),
        t("Good. And no jewellery on the floor.", "좋아요. 작업장에선 장신구 안 돼요.", "반지도 빼야 하는지 물어보세요", "Do I need to take off my ring?", ["take off my ring", "my ring"]),
        t("Yes, even wedding rings. Put it in your locker.", "네, 결혼반지도요. 사물함에 넣어요.", "사물함에 넣겠다고 하세요", "No worries, I'll put it in my locker.", ["in my locker", "locker"]),
      ],
      o("Great. Grab an apron and you're good to go.", "좋아요. 앞치마 챙기면 들어가도 돼요.")),

    L("7", 1, "🪪", "출퇴근 카드 찍기", "출근 카드 찍는 법·안 될 때 말하기", "슈퍼바이저",
      [
        ln("clock in", "출근 카드를 찍다", "Don't forget to clock in at the gate.", "입구에서 출근 카드 찍는 거 잊지 마요."),
        ln("swipe card", "출입 카드", "Here's your swipe card. Don't lose it.", "출입 카드예요. 잃어버리지 마요."),
        ln("not working", "안 돼요", "My card's not working on the machine.", "기계에 제 카드가 안 돼요."),
        ln("clock out", "퇴근 카드를 찍다", "Do I clock out for lunch too?", "점심때도 퇴근 카드 찍어요?"),
        ln("You get paid from", "~부터 급여가 계산되다", "You get paid from when you clock in.", "카드 찍은 시간부터 급여가 계산돼요."),
      ],
      [
        t("Here's your swipe card. Clock in at the gate every day.", "출입 카드예요. 매일 입구에서 출근 카드 찍어요.", "점심때도 카드 찍는지 물어보세요", "Do I clock out for lunch too?", ["clock out", "for lunch"]),
        t("Yep, clock out and back in.", "네, 찍고 나가서 다시 찍어요.", "기계에 카드가 안 된다고 하세요", "Sorry, my card's not working.", ["not working", "doesn't work"]),
        t("Let me see. Ah, it's not activated yet.", "봐요. 아, 아직 등록이 안 됐네요.", "고맙다고, 다시 해 보겠다고 하세요", "Thanks. I'll try again.", ["try again"]),
      ],
      o("Should work now. Off you go.", "이제 될 거예요. 가 봐요.")),

    L("8", 1, "☕", "쉬는 시간 확인", "스모코·점심 시간과 장소 묻기", "동료 Ben",
      [
        ln("smoko", "짧은 휴식", "Smoko's at nine, for fifteen minutes.", "휴식은 9시, 15분이에요.", "호주에선 짧은 휴식을 smoko라고 해요."),
        ln("When's lunch", "점심은 언제예요", "When's lunch on this shift?", "이 교대에선 점심이 언제예요?"),
        ln("half an hour", "30분", "Lunch is half an hour, unpaid.", "점심은 30분이고 무급이에요."),
        ln("the crib room", "휴게실", "We eat in the crib room upstairs.", "위층 휴게실에서 먹어요."),
        ln("Take off your apron", "앞치마를 벗다", "Take off your apron before the break.", "쉬기 전에 앞치마 벗어요."),
      ],
      [
        t("First day? Smoko's at nine.", "첫날이에요? 휴식은 9시예요.", "휴식이 몇 분인지 물어보세요", "How long is smoko?", ["How long", "how many minutes"]),
        t("Fifteen minutes. Lunch is half an hour.", "15분이요. 점심은 30분.", "점심은 언제인지 물어보세요", "When's lunch?", ["When's lunch", "when is lunch"]),
        t("Twelve. We eat in the crib room upstairs.", "12시요. 위층 휴게실에서 먹어요.", "앞치마는 벗고 가는지 물어보세요", "Do I take off my apron first?", ["take off my apron", "apron"]),
      ],
      o("Yep, hang it on the hook outside.", "네, 밖에 있는 고리에 걸어 둬요.")),

    L("9", 1, "🗺️", "작업장 구역 익히기", "보닝룸·칠러·포장실 위치 묻기", "슈퍼바이저",
      [
        ln("boning room", "발골실", "The boning room is through those doors.", "발골실은 저 문 지나서 있어요.", "뼈 발라내는 곳을 boning room이라 해요."),
        ln("the chiller", "냉각실", "Carcasses hang in the chiller overnight.", "도체는 밤새 냉각실에 걸어 둬요."),
        ln("packing room", "포장실", "You'll be in the packing room today.", "오늘은 포장실에서 일해요."),
        ln("How do I get to", "~에 어떻게 가요", "How do I get to the packing room?", "포장실엔 어떻게 가요?"),
        ln("It's freezing in here", "여기 엄청 추워요", "Wow, it's freezing in here.", "와, 여기 엄청 춥네요."),
      ],
      [
        t("This is the boning room. You'll start here next week.", "여기가 발골실이에요. 다음 주에 여기서 시작해요.", "오늘은 어디서 일하는지 물어보세요", "Where am I working today?", ["Where am I working", "where do I work"]),
        t("Packing room. Through the chiller, on the right.", "포장실이요. 냉각실 지나서 오른쪽.", "냉각실을 지나가는 거 맞는지 되물어 보세요", "So I go through the chiller?", ["through the chiller", "chiller"]),
        t("That's it. Here we are.", "맞아요. 다 왔어요.", "여기 엄청 춥다고 하세요", "Wow, it's freezing in here.", ["freezing", "so cold"]),
      ],
      o("You'll get used to it. Wear a thermal.", "익숙해질 거예요. 내복 입어요.")),

    // ───────── STEP 2: 매일 라인 작업 ─────────
    L("10", 2, "🔪", "칼 갈기", "스틸 쓰는 법 묻고 칼 상태 말하기", "보닝 리더 Dave",
      [
        ln("my knife is blunt", "칼이 무뎌요", "Sorry, my knife is blunt already.", "죄송한데 칼이 벌써 무뎌요."),
        ln("use the steel", "스틸(칼갈이 봉)을 쓰다", "Use the steel every ten minutes.", "10분마다 스틸 써요."),
        ln("Can you show me", "보여 주실래요", "Can you show me how to hold it?", "어떻게 잡는지 보여 주실래요?"),
        ln("Away from your body", "몸 반대쪽으로", "Always cut away from your body.", "항상 몸 반대쪽으로 써세요."),
        ln("knife sharpener", "칼 가는 사람", "Give it to the knife sharpener at smoko.", "쉬는 시간에 칼 가는 사람한테 줘요."),
      ],
      [
        t("You're struggling there. What's up?", "힘들어 보이네요. 무슨 일이에요?", "칼이 무디다고 하세요", "My knife is blunt.", ["knife is blunt", "blunt"]),
        t("Use the steel every ten minutes.", "10분마다 스틸 써요.", "어떻게 쓰는지 보여 달라고 하세요", "Can you show me how to use the steel?", ["Can you show me", "show me"]),
        t("Like this. Light strokes, both sides.", "이렇게. 가볍게, 양쪽 다.", "가볍게 양쪽 다 하겠다고 하세요", "Okay, light strokes on both sides.", ["both sides", "light strokes"]),
      ],
      o("That's it. Much better.", "그거예요. 훨씬 낫네요.")),

    L("11", 2, "🥩", "고기 트리밍", "지방 제거 기준 확인하기", "보닝 리더 Dave",
      [
        ln("trim the fat", "지방을 다듬다", "Trim the fat off the edges.", "가장자리 지방을 다듬어요."),
        ln("How much fat", "지방을 얼마나", "How much fat should I leave on?", "지방은 얼마나 남겨 둬야 해요?"),
        ln("about five mil", "5밀리 정도", "Leave about five mil on top.", "위에 5밀리 정도 남겨요.", "호주 현장에선 밀리미터를 mil이라고 해요."),
        ln("into the trim bin", "트림(자투리) 통에", "Throw the offcuts into the trim bin.", "자투리는 트림 통에 넣어요."),
        ln("Is this okay", "이거 괜찮아요", "Is this okay, or more off?", "이거 괜찮아요, 아니면 더 잘라요?"),
      ],
      [
        t("You're on trimming. Trim the fat off these rumps.", "트리밍 맡아요. 이 우둔살 지방 다듬어요.", "지방을 얼마나 남겨야 하는지 물어보세요", "How much fat should I leave on?", ["How much fat", "how much"]),
        t("About five mil on top.", "위에 5밀리 정도.", "하나 보여 주며 이거 괜찮은지 물어보세요", "Is this okay?", ["Is this okay", "is it okay"]),
        t("Bit more off. Offcuts go in the trim bin.", "조금 더 잘라요. 자투리는 트림 통에.", "자투리는 트림 통에 넣겠다고 하세요", "Got it. Offcuts into the trim bin.", ["trim bin", "into the bin"]),
      ],
      o("Good. Keep that pace.", "좋아요. 그 속도 유지해요.")),

    L("12", 2, "📦", "박스 포장·라벨", "무게 재고 라벨 붙여 쌓기", "슈퍼바이저",
      [
        ln("weigh each carton", "박스마다 무게를 재다", "Weigh each carton before you seal it.", "봉하기 전에 박스마다 무게 재요."),
        ln("print the label", "라벨을 뽑다", "The scale will print the label.", "저울에서 라벨이 뽑혀 나와요."),
        ln("on the end", "옆면(끝)에", "Stick the label on the end, not the top.", "라벨은 윗면 말고 옆면에 붙여요."),
        ln("The label didn't print", "라벨이 안 나왔어요", "The label didn't print. What do I do?", "라벨이 안 나왔어요. 어떻게 해요?"),
        ln("ten high", "10단 높이", "Stack them ten high on the pallet.", "팔레트에 10단 높이로 쌓아요."),
      ],
      [
        t("Weigh each carton and the scale prints the label.", "박스마다 무게 재면 저울에서 라벨 나와요.", "라벨은 어디에 붙이는지 물어보세요", "Where do I put the label?", ["put the label", "the label"]),
        t("On the end. Then stack them ten high.", "옆면에요. 그다음 10단으로 쌓아요.", "라벨이 안 나왔다고 하세요", "Sorry, the label didn't print.", ["didn't print", "not printing"]),
        t("Press reset and weigh it again.", "리셋 누르고 다시 재요.", "리셋하고 다시 재겠다고 하세요", "Okay, I'll press reset and weigh it again.", ["weigh it again", "press reset"]),
      ],
      o("There you go. All good.", "됐어요. 문제없어요.")),

    L("13", 2, "🚻", "라인에서 잠깐 빠질 때", "화장실 간다고 하고 대신 서 줄 사람 부르기", "팀 리더 Jo",
      [
        ln("go to the toilet", "화장실에 가다", "Sorry, can I go to the toilet?", "죄송한데 화장실 가도 돼요?", "호주에선 bathroom보다 toilet을 많이 써요."),
        ln("cover me", "제 자리를 봐 주다", "Can someone cover me for five minutes?", "누가 5분만 제 자리 봐 줄 수 있어요?"),
        ln("relief", "교대 인원", "Wait for the relief before you leave.", "자리 뜨기 전에 교대 인원 기다려요."),
        ln("I'm back", "다녀왔어요", "I'm back. Thanks for covering.", "다녀왔어요. 봐 줘서 고마워요."),
        ln("change your gloves", "장갑을 갈다", "Change your gloves when you come back.", "돌아오면 장갑 갈아요."),
      ],
      [
        t("You alright? You keep looking around.", "괜찮아요? 계속 두리번거리네요.", "화장실에 가도 되는지 물어보세요", "Sorry, can I go to the toilet?", ["go to the toilet", "toilet"]),
        t("Sure. Wait for the relief first.", "그럼요. 먼저 교대 인원 기다려요.", "누가 5분만 자리 봐 줄 수 있는지 물어보세요", "Can someone cover me for five minutes?", ["cover me", "five minutes"]),
        t("Ben will. Change your gloves when you're back.", "벤이 할 거예요. 돌아오면 장갑 갈아요.", "다녀왔다고, 봐 줘서 고맙다고 하세요", "I'm back. Thanks for covering, Ben.", ["I'm back", "thanks for covering"]),
      ],
      o("No worries, mate.", "괜찮아요.")),

    L("14", 2, "🔁", "로테이션 자리 바꾸기", "다음 자리 확인하고 인계하기", "동료 Ben",
      [
        ln("Rotation", "자리 교대", "Rotation! Everyone move one spot down.", "자리 교대! 다들 한 칸씩 옮겨요."),
        ln("Where am I next", "다음엔 어디예요", "Where am I next, the scale?", "다음엔 어디예요, 저울이에요?"),
        ln("all yours", "이제 당신 자리예요", "It's all yours. The cartons are on the left.", "이제 당신 자리예요. 박스는 왼쪽에 있어요."),
        ln("Watch out for", "~ 조심하세요", "Watch out for the sharp edge on the table.", "테이블 날카로운 모서리 조심하세요."),
        ln("one spot down", "한 칸 아래로", "Move one spot down after lunch.", "점심 끝나고 한 칸 옮겨요."),
      ],
      [
        t("Rotation! You're on the scale now.", "자리 교대! 이제 저울 자리예요.", "저울 다음엔 어디인지 물어보세요", "Okay. Where am I next after this?", ["Where am I next", "where next"]),
        t("Labelling. I'll show you then.", "라벨 붙이기요. 그때 보여 줄게요.", "자리를 넘겨주며 박스는 왼쪽에 있다고 하세요", "It's all yours. The cartons are on the left.", ["all yours", "on the left"]),
        t("Thanks. Anything I should know?", "고마워요. 알아야 할 거 있어요?", "저울 모서리가 날카로우니 조심하라고 하세요", "Watch out for the sharp edge on the scale.", ["Watch out for", "be careful"]),
      ],
      o("Cheers for the heads up.", "알려 줘서 고마워요.")),

    L("15", 2, "🧤", "장갑·보호구 갈기", "찢어진 장갑과 메시 장갑 교체하기", "팀 리더 Jo",
      [
        ln("mesh glove", "쇠사슬 장갑", "Always wear the mesh glove on your other hand.", "다른 손엔 항상 쇠사슬 장갑을 껴요.", "칼 안 쓰는 손에 끼는 철망 장갑이에요."),
        ln("My glove ripped", "장갑이 찢어졌어요", "My glove ripped, can I get a new one?", "장갑이 찢어졌어요, 새 거 받을 수 있어요?"),
        ln("What size", "몇 사이즈", "What size are you, medium?", "사이즈 뭐예요, 미디엄이에요?"),
        ln("too big", "너무 커요", "These are too big for me.", "이건 저한테 너무 커요."),
        ln("sanitise your hands", "손을 소독하다", "Sanitise your hands before new gloves.", "새 장갑 끼기 전에 손 소독해요."),
      ],
      [
        t("Hey, there's a hole in your glove.", "저기, 장갑에 구멍 났어요.", "장갑이 찢어졌다고, 새 거 받을 수 있는지 물어보세요", "My glove ripped. Can I get a new one?", ["glove ripped", "new one"]),
        t("Sure. What size are you?", "그럼요. 사이즈 뭐예요?", "미디엄인데 메시 장갑은 너무 크다고 하세요", "Medium. And my mesh glove is too big.", ["too big", "mesh glove"]),
        t("I'll get you a small. Sanitise your hands first.", "스몰로 갖다줄게요. 먼저 손 소독해요.", "손 소독하고 기다리겠다고 하세요", "Okay, I'll sanitise my hands and wait.", ["sanitise my hands", "sanitize"]),
      ],
      o("Here you go. Try that.", "여기요. 껴 봐요.")),

    // ───────── STEP 3: 지시·요청 알아듣기 ─────────
    L("4", 3, "⏱️", "초과근무 이야기", "시간 묻기·가능하다고 답하기", "슈퍼바이저",
      [
        ln("overtime", "초과근무", "We need people for overtime on Saturday.", "토요일 초과근무할 사람 필요해요."),
        ln("How many hours", "몇 시간이에요", "How many hours is it on Saturday?", "토요일은 몇 시간이에요?"),
        ln("I can do", "할 수 있어요", "I can do overtime this weekend.", "이번 주말 초과근무 할 수 있어요."),
        ln("put you down", "명단에 올리다", "Great, I'll put you down for Saturday.", "좋아요, 토요일 명단에 올릴게요."),
        ln("warm jumper", "따뜻한 스웨터", "Bring a warm jumper for the cold room.", "냉장실용으로 따뜻한 스웨터 챙겨요.", "호주에선 스웨터를 jumper라고 해요."),
      ],
      [
        t("We need people for overtime on Saturday.", "토요일 초과근무할 사람 필요해요.", "몇 시간인지 물어보세요", "How many hours is it?", ["how many hours"]),
        t("Six hours, from 7 to 1.", "6시간, 7시부터 1시까지.", "토요일 초과근무 할 수 있다고 하세요", "I can do overtime on Saturday.", ["I can do overtime", "I can do it", "I can work"]),
        t("Great, I'll put you down.", "좋아요, 명단에 넣을게요.", "냉장실에서 일하는지 물어보세요", "Will I be in the cold room?", ["cold room"]),
      ],
      o("Yep, so bring a warm jumper.", "네, 그러니까 따뜻한 옷 챙겨요.")),

    L("16", 3, "⚖️", "무게 스펙 맞추기", "규격 무게 확인하고 조절하기", "QA 담당 Lisa",
      [
        ln("the spec", "규격", "The spec is five to five point two kilos.", "규격은 5에서 5.2킬로예요."),
        ln("It's under", "모자라요", "It's under by about a hundred grams.", "100그램 정도 모자라요."),
        ln("It's over", "넘쳐요", "It's over, so take a piece out.", "넘치니까 한 조각 빼요."),
        ln("top it up", "채워 넣다", "Top it up with a small piece.", "작은 조각으로 채워 넣어요."),
        ln("Every carton", "박스마다", "Every carton has to be in spec.", "박스마다 규격 안에 들어와야 해요."),
      ],
      [
        t("What's the spec for this product?", "이 제품 규격이 뭐예요?", "5에서 5.2킬로라고 하세요", "Five to five point two kilos.", ["five point two", "5.2"]),
        t("This one says four point nine.", "이건 4.9로 나오네요.", "100그램 모자라니 작은 조각으로 채우겠다고 하세요", "It's under. I'll top it up with a small piece.", ["top it up", "under"]),
        t("Good. Every carton has to be in spec.", "좋아요. 박스마다 규격 안이어야 해요.", "알겠다고, 하나하나 다 재겠다고 하세요", "Got it. I'll weigh every carton.", ["weigh every carton", "every carton"]),
      ],
      o("Thanks. QA checks them hourly.", "고마워요. QA가 매시간 확인해요.")),

    L("17", 3, "🤝", "다른 라인 도와주기", "이동 지시 받고 할 일 확인하기", "슈퍼바이저",
      [
        ln("give them a hand", "그쪽을 돕다", "Line two is behind. Can you give them a hand?", "2번 라인이 밀렸어요. 가서 좀 도와줄래요?"),
        ln("What do you need me to do", "제가 뭘 하면 돼요", "What do you need me to do over there?", "거기서 제가 뭘 하면 돼요?"),
        ln("Who's taking my spot", "제 자리는 누가 봐요", "Who's taking my spot on this line?", "이 라인 제 자리는 누가 봐요?"),
        ln("until lunch", "점심때까지", "Stay on line two until lunch.", "점심때까지 2번 라인에 있어요."),
        ln("I've never done", "해 본 적이 없어요", "I've never done vacuum packing before.", "진공 포장은 해 본 적이 없어요."),
      ],
      [
        t("Line two is behind. Can you give them a hand?", "2번 라인이 밀렸어요. 좀 도와줄래요?", "네, 거기서 뭘 하면 되는지 물어보세요", "Sure. What do you need me to do?", ["What do you need me to do", "what should I do"]),
        t("Vacuum packing, until lunch.", "진공 포장이요, 점심때까지.", "진공 포장은 해 본 적이 없다고 하세요", "I've never done vacuum packing before.", ["never done", "first time"]),
        t("No worries, Jo will show you.", "괜찮아요, 조가 보여 줄 거예요.", "이 라인 내 자리는 누가 보는지 물어보세요", "Okay. Who's taking my spot here?", ["Who's taking my spot", "my spot"]),
      ],
      o("Ben's got it. Off you go.", "벤이 맡아요. 가 봐요.")),

    L("18", 3, "🚜", "지게차·팔레트 주변", "지게차 신호 듣고 팔레트 옮기기", "지게차 기사 Mick",
      [
        ln("Forklift coming through", "지게차 지나가요", "Forklift coming through, stand back!", "지게차 지나가요, 뒤로 물러서요!"),
        ln("Stay behind the yellow line", "노란 선 뒤에 있다", "Stay behind the yellow line, please.", "노란 선 뒤에 있어 주세요."),
        ln("pallet jack", "핸드 팔레트 트럭", "Use the pallet jack for the small ones.", "작은 건 핸드 팔레트 트럭 써요."),
        ln("Is this pallet ready", "이 팔레트 나가도 돼요", "Is this pallet ready to go?", "이 팔레트 나가도 돼요?"),
        ln("wrap it", "랩으로 감다", "Wrap it before it goes to the freezer.", "냉동고 가기 전에 랩으로 감아요."),
      ],
      [
        t("Forklift coming through! Stand back.", "지게차 지나가요! 물러서요.", "노란 선 뒤로 가겠다고 하세요", "Sorry! I'll stay behind the yellow line.", ["behind the yellow line", "yellow line"]),
        t("Cheers. Is this pallet ready to go?", "고마워요. 이 팔레트 나가도 돼요?", "아직 랩을 안 감았다고 하세요", "Not yet. I still need to wrap it.", ["wrap it", "not yet"]),
        t("Okay, give me a shout when it's done.", "알았어요, 다 되면 불러 줘요.", "2분 뒤에 부르겠다고 하세요", "No worries, I'll shout in two minutes.", ["two minutes", "2 minutes"]),
      ],
      o("Sweet. I'll be back.", "좋아요. 다시 올게요.")),

    L("19", 3, "🔍", "QA 검사 지적", "뼈·이물질 지적 받고 재작업하기", "QA 담당 Lisa",
      [
        ln("bone in it", "뼈가 들어 있다", "This piece has a bone in it.", "이 조각에 뼈가 들어 있어요."),
        ln("redo this carton", "이 박스를 다시 하다", "You'll need to redo this carton.", "이 박스 다시 해야 해요."),
        ln("I missed it", "제가 놓쳤어요", "Sorry, I missed it. I'll check again.", "죄송해요, 제가 놓쳤어요. 다시 확인할게요."),
        ln("metal detector", "금속 탐지기", "Every carton goes through the metal detector.", "모든 박스는 금속 탐지기를 통과해요."),
        ln("feel for bones", "손으로 뼈를 더듬어 찾다", "Feel for bones with your fingers.", "손가락으로 뼈 있는지 더듬어 봐요."),
      ],
      [
        t("This piece has a bone in it.", "이 조각에 뼈가 들어 있어요.", "죄송하다고, 놓쳤다고 하세요", "Sorry, I missed it.", ["missed it", "my fault"]),
        t("You'll need to redo this carton.", "이 박스 다시 해야 해요.", "바로 다시 하겠다고 하세요", "No worries, I'll redo it now.", ["redo it", "do it again"]),
        t("Feel for bones with your fingers, not just your eyes.", "눈으로만 말고 손가락으로 뼈 더듬어 봐요.", "앞으로 손으로 확인하겠다고 하세요", "Okay, I'll feel for bones from now on.", ["feel for bones", "check with my fingers"]),
      ],
      o("Thanks. Happens to everyone.", "고마워요. 누구나 그래요.")),

    L("20", 3, "🌙", "교대 시간 변경", "야간조 이동 제안에 답하고 조건 묻기", "슈퍼바이저",
      [
        ln("night shift", "야간조", "Would you move to night shift next month?", "다음 달에 야간조로 옮길래요?"),
        ln("What time does it finish", "몇 시에 끝나요", "What time does it finish?", "몇 시에 끝나요?"),
        ln("penalty rate", "가산 수당", "Is there a penalty rate for nights?", "야간엔 가산 수당 있어요?", "호주는 야간·주말에 시급이 올라요."),
        ln("give it a go", "한번 해 보다", "Sure, I'll give it a go.", "네, 한번 해 볼게요."),
        ln("Can I think about it", "생각해 봐도 될까요", "Can I think about it until Friday?", "금요일까지 생각해 봐도 될까요?"),
      ],
      [
        t("Would you move to night shift next month?", "다음 달에 야간조로 옮길래요?", "몇 시에 끝나는지 물어보세요", "Maybe. What time does it finish?", ["What time does it finish", "what time"]),
        t("Three to midnight, Monday to Friday.", "3시부터 자정까지, 월요일부터 금요일.", "야간 가산 수당이 있는지 물어보세요", "Is there a penalty rate for nights?", ["penalty rate", "extra pay"]),
        t("Yep, fifteen percent extra.", "네, 15% 더 줘요.", "좋다고, 한번 해 보겠다고 하세요", "Sounds good. I'll give it a go.", ["give it a go", "I'll do it"]),
      ],
      o("Great, I'll change the roster.", "좋아요, 로스터 바꿀게요.")),

    // ───────── STEP 4: 부상·고장·위생 문제 ─────────
    L("3", 4, "🐢", "라인이 너무 빠를 때", "못 따라간다고 말하고 속도 조절 요청", "슈퍼바이저",
      [
        ln("can't keep up", "못 따라가겠어요", "Sorry, I can't keep up with the line.", "죄송해요, 라인을 못 따라가겠어요."),
        ln("slow the line down", "라인 속도를 줄이다", "Could you slow the line down a bit?", "라인 속도 조금만 줄여 주실래요?"),
        ln("Much better", "훨씬 나아요", "Much better, thanks.", "훨씬 나아요, 고마워요."),
        ln("product is piling up", "물건이 쌓이고 있다", "The product is piling up at my end.", "제 쪽에 물건이 쌓이고 있어요."),
        ln("Speed it up", "속도를 올리다", "Speed it up when you're ready.", "준비되면 속도 올려요."),
      ],
      [
        t("You okay there?", "괜찮아요?", "따라가기 힘들다고 하세요", "Sorry, I can't keep up.", ["can't keep up", "cannot keep up"]),
        t("No worries. Want me to slow the line down?", "괜찮아요. 라인 속도 줄여 줄까요?", "네, 조금만 줄여 달라고 하세요", "Yes, please slow the line down a bit.", ["slow the line down", "slow it down"]),
        t("Done. Better?", "됐어요. 좀 나아요?", "훨씬 낫다고, 고맙다고 하세요", "Much better, thanks.", ["much better", "better"]),
      ],
      o("Good. Speed it up when you're ready.", "좋아요. 익숙해지면 다시 올려요.")),

    L("5", 4, "🩹", "작업 중 다쳤을 때", "다친 곳 말하고 보고 절차 묻기", "동료",
      [
        ln("cut my finger", "손가락을 베다", "I cut my finger on a knife.", "칼에 손가락을 베었어요."),
        ln("It's bleeding", "피가 나요", "It's bleeding a bit through my glove.", "장갑 사이로 피가 조금 나요."),
        ln("report an injury", "부상을 보고하다", "Where do I report an injury?", "부상은 어디에 보고해요?", "작은 상처도 꼭 보고해야 해요."),
        ln("first aid", "응급처치(실)", "Come with me to first aid.", "응급처치실로 같이 가요."),
        ln("fill in a form", "서류를 작성하다", "We'll fill in a form together.", "같이 서류 작성해요."),
      ],
      [
        t("Hey, what happened to your hand?", "손 왜 그래요?", "칼에 손가락을 베었다고 하세요", "I cut my finger on a knife.", ["cut my finger"]),
        t("Oh no. Is it bad?", "저런, 심해요?", "피가 조금 난다고, 어디에 보고하는지 물어보세요", "It's bleeding a bit. Where do I report an injury?", ["report an injury"]),
        t("Come with me to first aid. We'll fill in a form.", "응급처치실로 같이 가요. 서류도 써야 해요.", "고맙다고 하세요", "Okay, thank you.", ["thank you", "thanks"]),
      ],
      o("No worries. This way.", "괜찮아요. 이쪽이에요.")),

    L("21", 4, "🛑", "기계가 멈췄을 때", "컨베이어 걸림 알리고 비상정지 쓰기", "정비공 Steve",
      [
        ln("The conveyor's jammed", "컨베이어가 걸렸어요", "The conveyor's jammed at my station.", "제 자리에서 컨베이어가 걸렸어요."),
        ln("hit the e-stop", "비상정지 버튼을 누르다", "I hit the e-stop straight away.", "바로 비상정지 버튼 눌렀어요.", "비상정지 버튼을 e-stop이라고 해요."),
        ln("Don't put your hand in", "손 넣지 마세요", "Don't put your hand in there!", "거기 손 넣지 마세요!"),
        ln("call maintenance", "정비팀을 부르다", "Can you call maintenance for me?", "정비팀 좀 불러 주실래요?"),
        ln("It's making a weird noise", "이상한 소리가 나요", "It's making a weird noise again.", "또 이상한 소리가 나요."),
      ],
      [
        t("What happened? The whole line stopped.", "무슨 일이에요? 라인이 다 멈췄어요.", "컨베이어가 걸려서 비상정지 버튼을 눌렀다고 하세요", "The conveyor's jammed, so I hit the e-stop.", ["hit the e-stop", "e-stop", "emergency stop"]),
        t("Good call. Did you touch anything?", "잘했어요. 뭐 만졌어요?", "아니요, 손 안 넣었다고 하세요", "No, I didn't put my hand in.", ["didn't put my hand in", "didn't touch"]),
        t("Good. Did it make a noise before it stopped?", "좋아요. 멈추기 전에 소리 났어요?", "이상한 소리가 났다고 하세요", "Yes, it was making a weird noise.", ["weird noise", "strange noise"]),
      ],
      o("Okay. Give me ten minutes to fix it.", "알았어요. 고치는 데 10분만 줘요.")),

    L("22", 4, "🧊", "냉장실에서 너무 추울 때", "몸 상태 말하고 몸 녹일 시간 요청하기", "팀 리더 Jo",
      [
        ln("I can't feel my fingers", "손가락 감각이 없어요", "I can't feel my fingers anymore.", "이제 손가락 감각이 없어요."),
        ln("warm up", "몸을 녹이다", "Can I go and warm up for five minutes?", "5분만 몸 녹이고 와도 될까요?"),
        ln("thermal gloves", "보온 장갑", "Wear thermal gloves under your rubber ones.", "고무장갑 안에 보온 장갑 껴요."),
        ln("I feel dizzy", "어지러워요", "Sorry, I feel dizzy and shaky.", "죄송해요, 어지럽고 몸이 떨려요."),
        ln("sit down", "앉다", "Sit down and have some water.", "앉아서 물 좀 마셔요."),
      ],
      [
        t("You're shaking. You okay?", "떨고 있네요. 괜찮아요?", "손가락 감각이 없다고 하세요", "Not really. I can't feel my fingers.", ["can't feel my fingers", "so cold"]),
        t("Go to the crib room and warm up.", "휴게실 가서 몸 녹여요.", "10분 정도 몸 녹이겠다고 하세요", "Thanks. I'll warm up for ten minutes.", ["warm up", "ten minutes"]),
        t("And next time, wear thermal gloves under those.", "다음엔 그 안에 보온 장갑 껴요.", "보온 장갑은 어디서 받는지 물어보세요", "Where can I get thermal gloves?", ["thermal gloves"]),
      ],
      o("Store room. Ask for a pair.", "창고요. 한 켤레 달라고 해요.")),

    L("23", 4, "🗑️", "고기를 바닥에 떨어뜨렸을 때", "숨기지 않고 알리고 폐기 절차 따르기", "QA 담당 Lisa",
      [
        ln("I dropped a piece", "한 조각 떨어뜨렸어요", "Sorry, I dropped a piece on the floor.", "죄송해요, 한 조각 바닥에 떨어뜨렸어요."),
        ln("condemned bin", "폐기통", "Put it in the condemned bin.", "폐기통에 넣어요."),
        ln("Can I wash it", "씻어도 돼요", "Can I wash it and use it?", "씻어서 써도 돼요?"),
        ln("never goes back on the line", "절대 라인에 다시 못 올리다", "Floor meat never goes back on the line.", "바닥에 떨어진 고기는 절대 라인에 다시 못 올려요."),
        ln("Thanks for telling me", "말해 줘서 고마워요", "Thanks for telling me straight away.", "바로 말해 줘서 고마워요."),
      ],
      [
        t("What's that on the floor?", "바닥에 그거 뭐예요?", "한 조각 떨어뜨렸다고 하세요", "Sorry, I dropped a piece.", ["dropped a piece", "dropped it"]),
        t("Okay. Thanks for telling me.", "알았어요. 말해 줘서 고마워요.", "씻어서 써도 되는지 물어보세요", "Can I wash it and use it?", ["wash it", "use it"]),
        t("No, it goes in the condemned bin. Never back on the line.", "아니요, 폐기통에 넣어요. 절대 라인에 다시 안 돼요.", "폐기통에 넣겠다고 하세요", "Got it. I'll put it in the condemned bin.", ["condemned bin", "in the bin"]),
      ],
      o("Good. Then change your gloves.", "좋아요. 그다음 장갑 갈아요.")),

    L("24", 4, "✋", "손목이 아플 때", "통증 알리고 다른 자리 요청하기", "슈퍼바이저",
      [
        ln("My wrist is sore", "손목이 아파요", "My wrist is sore from the trimming.", "트리밍 때문에 손목이 아파요."),
        ln("since Monday", "월요일부터", "It's been hurting since Monday.", "월요일부터 계속 아파요."),
        ln("a different station", "다른 자리", "Can I move to a different station today?", "오늘 다른 자리로 옮길 수 있을까요?"),
        ln("light duties", "가벼운 업무", "We'll put you on light duties for now.", "당분간 가벼운 업무로 배치할게요.", "다쳤을 때 주는 가벼운 일을 light duties라 해요."),
        ln("see a physio", "물리치료사에게 가다", "You should see a physio about that.", "그거 물리치료사한테 가 봐요."),
      ],
      [
        t("You're holding your arm funny. What's wrong?", "팔을 이상하게 잡고 있네요. 왜 그래요?", "트리밍 때문에 손목이 아프다고 하세요", "My wrist is sore from the trimming.", ["wrist is sore", "wrist hurts"]),
        t("How long has it been like that?", "그런 지 얼마나 됐어요?", "월요일부터라고 하세요", "Since Monday.", ["since Monday", "Monday"]),
        t("Okay. We'll put you on light duties today.", "알았어요. 오늘은 가벼운 업무로 할게요.", "다른 자리로 옮겨 줘서 고맙다고 하세요", "Thanks for moving me to a different station.", ["different station", "thanks"]),
      ],
      o("And see a physio if it doesn't get better.", "안 나아지면 물리치료사한테 가 봐요.")),

    // ───────── STEP 5: 교대·조율·종합 ─────────
    L("25", 5, "👋", "새 직원 가르치기", "신입에게 자리·규칙 알려 주기", "신입 Ella",
      [
        ln("Just follow me", "그냥 저 따라 하세요", "Just follow me for the first hour.", "처음 한 시간은 그냥 저 따라 하세요."),
        ln("Don't worry about speed", "속도는 신경 쓰지 마세요", "Don't worry about speed on your first day.", "첫날엔 속도는 신경 쓰지 마세요."),
        ln("The main thing is", "제일 중요한 건", "The main thing is safety, always.", "제일 중요한 건 항상 안전이에요."),
        ln("ask me anytime", "언제든 물어보다", "If you're unsure, ask me anytime.", "잘 모르겠으면 언제든 물어보세요."),
        ln("Am I doing it right", "제가 제대로 하고 있어요", "Am I doing it right?", "제가 제대로 하고 있어요?"),
      ],
      [
        t("Hi, I'm Ella. It's my first day.", "안녕하세요, 엘라예요. 오늘 첫날이에요.", "환영한다고, 처음 한 시간은 따라 하라고 하세요", "Welcome! Just follow me for the first hour.", ["follow me", "watch me"]),
        t("Okay. I'm a bit slow, sorry.", "네. 제가 좀 느려요, 죄송해요.", "첫날엔 속도 신경 쓰지 말라고 하세요", "Don't worry about speed on your first day.", ["Don't worry about speed", "don't worry"]),
        t("Thanks. Am I doing it right?", "고마워요. 제가 제대로 하고 있어요?", "잘하고 있다고, 언제든 물어보라고 하세요", "You're doing great. Ask me anytime.", ["ask me anytime", "doing great"]),
      ],
      o("Thanks, that really helps.", "고마워요, 정말 도움 돼요.")),

    L("26", 5, "🔄", "다음 교대 인수인계", "생산량·문제점 야간조에 넘기기", "야간조 리더 Raj",
      [
        ln("We did", "~ 했어요", "We did four hundred cartons today.", "오늘 박스 400개 했어요."),
        ln("acting up", "말썽을 부리다", "The wrapper on line two is acting up.", "2번 라인 포장기가 말썽이에요."),
        ln("Maintenance knows", "정비팀이 알고 있어요", "Maintenance knows, they're coming at six.", "정비팀이 알고 있어요, 6시에 와요."),
        ln("left to pack", "포장할 게 남은", "There's one pallet left to pack.", "포장할 팔레트가 하나 남았어요."),
        ln("How'd you go today", "오늘 어땠어요", "Hey, how'd you go today?", "오늘 어땠어요?", "호주식으로 '어땠어?'를 How'd you go라 해요."),
      ],
      [
        t("Hey, how'd you go today?", "오늘 어땠어요?", "박스 400개 했다고 하세요", "Good. We did four hundred cartons.", ["four hundred", "400"]),
        t("Nice. Any problems?", "좋네요. 문제는요?", "2번 라인 포장기가 말썽이라고, 정비팀이 안다고 하세요", "The wrapper on line two is acting up. Maintenance knows.", ["acting up", "Maintenance knows"]),
        t("Okay. Anything left for us?", "알았어요. 우리 몫으로 남은 거 있어요?", "포장할 팔레트가 하나 남았다고 하세요", "One pallet left to pack.", ["left to pack", "one pallet"]),
      ],
      o("Easy. Thanks, have a good night.", "쉽네요. 고마워요, 좋은 밤 보내요.")),

    L("27", 5, "🚿", "마감 세척", "호스·세제로 작업장 청소하기", "위생팀 Kim",
      [
        ln("wash down", "물청소", "Wash down starts at three sharp.", "물청소는 3시 정각에 시작해요."),
        ln("hose down", "호스로 물을 뿌리다", "Hose down the tables from top to bottom.", "테이블은 위에서 아래로 호스로 물 뿌려요."),
        ln("chemical", "세제(약품)", "Don't mix the chemicals, ever.", "약품은 절대 섞지 마세요."),
        ln("face shield", "안면 보호대", "Wear a face shield when you spray.", "뿌릴 땐 안면 보호대를 쓰세요."),
        ln("Should I do the drains", "배수구도 해요", "Should I do the drains as well?", "배수구도 청소해요?"),
      ],
      [
        t("Wash down time. Grab a hose.", "물청소 시간이에요. 호스 잡아요.", "테이블을 호스로 위에서 아래로 뿌리겠다고 하세요", "Okay, I'll hose down the tables, top to bottom.", ["hose down", "top to bottom"]),
        t("Good. Wear a face shield for the chemical.", "좋아요. 약품 뿌릴 땐 안면 보호대 써요.", "안면 보호대 쓰겠다고 하고 배수구도 하는지 물어보세요", "Sure. Should I do the drains as well?", ["do the drains", "drains"]),
        t("Yep, pull the covers and scrub them.", "네, 덮개 빼고 문질러요.", "덮개 빼고 문지르겠다고 하세요", "No worries, I'll pull the covers and scrub them.", ["scrub them", "pull the covers"]),
      ],
      o("Good work. That's us done.", "잘했어요. 이제 끝이에요.")),

    L("28", 5, "📞", "아파서 결근할 때", "교대 전에 전화하고 진단서 챙기기", "슈퍼바이저",
      [
        ln("I'm not coming in", "오늘 못 나가요", "Sorry, I'm not coming in today.", "죄송해요, 오늘 못 나가요."),
        ln("I've been throwing up", "계속 토했어요", "I've been throwing up all night.", "밤새 계속 토했어요."),
        ln("before your shift", "근무 시작 전에", "Call at least an hour before your shift.", "적어도 근무 한 시간 전에 전화해요."),
        ln("doctor's certificate", "진단서", "Bring a doctor's certificate when you're back.", "복귀할 때 진단서 가져와요."),
        ln("back tomorrow", "내일 복귀하다", "I should be back tomorrow.", "내일은 복귀할 수 있을 거예요."),
      ],
      [
        t("Morning, it's Pete. You're on at six, yeah?", "안녕하세요, 피트예요. 6시 근무죠?", "죄송하다고, 오늘 못 나간다고 하세요", "Sorry, Pete. I'm not coming in today.", ["not coming in", "can't come in"]),
        t("What's going on?", "무슨 일이에요?", "밤새 토했다고 하세요", "I've been throwing up all night.", ["throwing up", "vomiting"]),
        t("Okay. You'll need a doctor's certificate.", "알았어요. 진단서 필요해요.", "진단서 받아 오겠다고, 내일 복귀할 수 있을 거라고 하세요", "I'll get a doctor's certificate. I should be back tomorrow.", ["doctor's certificate", "back tomorrow"]),
      ],
      o("Thanks for calling early. Get well.", "일찍 전화해 줘서 고마워요. 몸조리 잘해요.")),

    L("29", 5, "💵", "급여명세서 확인", "근무 시간·초과근무 수당 틀린 곳 묻기", "급여 담당 Sharon",
      [
        ln("my payslip", "제 급여명세서", "I think there's a mistake on my payslip.", "제 급여명세서에 실수가 있는 것 같아요."),
        ln("hours are missing", "시간이 빠져 있다", "Some of my hours are missing.", "제 근무 시간 일부가 빠져 있어요."),
        ln("overtime rate", "초과근무 수당률", "Saturday should be overtime rate.", "토요일은 초과근무 수당으로 들어가야 해요."),
        ln("super", "퇴직연금", "Is my super paid every month?", "제 퇴직연금은 매달 들어가요?", "호주 퇴직연금을 super라고 해요."),
        ln("in the next pay", "다음 급여에", "We'll fix it in the next pay.", "다음 급여에 고쳐 줄게요."),
      ],
      [
        t("Hi, how can I help?", "안녕하세요, 뭘 도와줄까요?", "급여명세서에 실수가 있는 것 같다고 하세요", "Hi. I think there's a mistake on my payslip.", ["mistake on my payslip", "payslip"]),
        t("Okay, what looks wrong?", "알았어요, 뭐가 틀린 것 같아요?", "토요일 6시간이 빠져 있다고 하세요", "My six hours on Saturday are missing.", ["are missing", "missing"]),
        t("Ah, I see. Saturday was overtime, right?", "아, 그렇네요. 토요일은 초과근무였죠?", "네, 초과근무 수당으로 들어가야 한다고 하세요", "Yes, it should be overtime rate.", ["overtime rate", "overtime"]),
      ],
      o("No worries. We'll fix it in the next pay.", "괜찮아요. 다음 급여에 고쳐 줄게요.")),

    L("30", 5, "🛂", "세컨비자 서류 부탁", "근무 일수 확인하고 서류 요청하기", "매니저 Craig",
      [
        ln("second-year visa", "세컨 비자", "I'm applying for my second-year visa.", "세컨 비자 신청하려고 해요.", "육가공은 지방이면 세컨 비자 일수로 인정돼요."),
        ln("88 days", "88일", "I need 88 days of specified work.", "지정 업무 88일이 필요해요."),
        ln("sign this form", "이 서류에 서명하다", "Could you sign this form for me?", "이 서류에 서명해 주실 수 있어요?"),
        ln("my payslips", "급여명세서들", "I've got all my payslips here.", "급여명세서는 다 여기 있어요."),
        ln("How many days have I done", "며칠 일했어요", "How many days have I done so far?", "지금까지 제가 며칠 일했어요?"),
      ],
      [
        t("You wanted to see me?", "저 보자고 했다면서요?", "세컨 비자 신청한다고 하세요", "Yes. I'm applying for my second-year visa.", ["second-year visa", "second year visa"]),
        t("Right. What do you need from me?", "그렇군요. 저한테 뭐가 필요해요?", "이 서류에 서명해 달라고 하세요", "Could you sign this form for me?", ["sign this form", "sign"]),
        t("Sure. How many days have you done?", "그럼요. 며칠 일했어요?", "92일 했고 급여명세서도 다 있다고 하세요", "92 days. I've got all my payslips here.", ["my payslips", "92 days"]),
      ],
      o("Perfect. Leave it with me till Friday.", "좋아요. 금요일까지 제가 처리할게요.")),
  ],
};

export default curriculum;
