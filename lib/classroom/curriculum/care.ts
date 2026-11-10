import { L, ln, o, t, type JobCurriculum } from "./kit";

const curriculum: JobCurriculum = {
  steps: ["첫 만남과 인사", "매일 돌봄 루틴", "어르신·가족 요청", "건강 이상·안전", "교대·팀워크·기록"],
  lessons: [
    // ───────── STEP 1 첫 만남과 인사 ─────────
    L("1", 1, "🌅", "아침 인사", "기분 묻기·일어나기 돕기", "어르신",
      [
        ln("How are you feeling today", "오늘 기분 어떠세요", "Good morning, Joan! How are you feeling today?", "좋은 아침이에요, 조앤! 오늘 기분 어떠세요?"),
        ln("sleep well", "잘 주무시다", "Did you sleep well last night?", "어젯밤 잘 주무셨어요?"),
        ln("give you a hand", "도와드리다", "Can I give you a hand getting up?", "일어나시는 거 도와드릴까요?"),
        ln("take it slowly", "천천히 하다", "No rush. Let's take it slowly.", "서두르실 필요 없어요. 천천히 해요."),
        ln("a bit tired", "좀 피곤한", "I'm a bit tired, but I'm okay.", "좀 피곤하지만 괜찮아요.", "어르신들이 아침에 자주 하는 대답이에요."),
      ],
      [
        t("Good morning, dear.", "좋은 아침이에요.", "오늘 기분이 어떠신지 물어보세요", "Good morning! How are you feeling today?", ["how are you feeling today", "how are you"]),
        t("A bit tired, but okay.", "좀 피곤하지만 괜찮아요.", "일어나는 걸 도와드릴지 물어보세요", "Can I give you a hand getting up?", ["give you a hand", "help you"]),
        t("Yes, please.", "네, 부탁해요.", "천천히 하시라고 하세요", "Okay, take it slowly.", ["take it slowly", "slowly"]),
      ],
      o("Thank you, love.", "고마워요.")),

    L("5", 1, "👋", "첫 출근 인사", "자기소개하기·오늘 할 일 묻기", "팀 리더 Karen",
      [
        ln("the new support worker", "새로 온 요양보호사", "Hi, I'm Min, the new support worker.", "안녕하세요, 새로 온 요양보호사 민이에요."),
        ln("Where should I start", "어디서부터 시작할까요", "Where should I start this morning?", "오늘 아침엔 어디서부터 시작할까요?"),
        ln("buddy shift", "선배와 같이 하는 근무", "You're on a buddy shift with Tom today.", "오늘은 톰이랑 같이 버디 근무예요.", "첫 며칠은 선배랑 붙어서 일해요."),
        ln("sign in", "출근 기록하다", "Don't forget to sign in on the app.", "앱에 출근 기록하는 거 잊지 마세요."),
        ln("Where do I put my bag", "가방은 어디 두나요", "Where do I put my bag and phone?", "가방이랑 폰은 어디에 두면 돼요?"),
      ],
      [
        t("Morning! You must be the new starter.", "안녕하세요! 새로 온 분이죠?", "네, 새로 온 요양보호사 민이라고 하세요", "Yes, I'm Min, the new support worker.", ["the new support worker", "I'm Min"]),
        t("Welcome! You'll be with Tom today.", "환영해요! 오늘은 톰이랑 같이 해요.", "어디서부터 시작하면 되는지 물어보세요", "Great. Where should I start?", ["Where should I start", "what should I do first"]),
        t("Help Tom with the morning showers in wing B.", "B동 아침 샤워를 톰이랑 같이 해 줘요.", "알겠다고 하고 가방은 어디 두는지 물어보세요", "Sure. Where do I put my bag?", ["Where do I put my bag", "my bag"]),
      ],
      o("Staff room, second locker. Have a good one!", "직원실 두 번째 사물함이요. 오늘 잘해 봐요!")),

    L("6", 1, "🤝", "어르신께 내 소개", "이름 말하기·호칭 여쭤보기", "어르신 Mr. Wilson",
      [
        ln("I'll be looking after you", "제가 돌봐 드릴 거예요", "I'll be looking after you today.", "오늘은 제가 돌봐 드릴 거예요."),
        ln("What would you like me to call you", "어떻게 불러 드릴까요", "What would you like me to call you?", "어떻게 불러 드릴까요?", "이름으로 불러 달라는 어르신이 많아요."),
        ln("just call me", "그냥 ~라고 불러요", "Oh, just call me Bill.", "아, 그냥 빌이라고 불러요."),
        ln("Where are you from", "어디서 왔어요", "Where are you from, love?", "어디서 왔어요?"),
        ln("Let me know if", "~하면 말씀하세요", "Let me know if you need anything.", "필요한 거 있으면 말씀하세요."),
      ],
      [
        t("Hello. Who are you, then?", "안녕하세요. 누구신가?", "민이라고 하고 오늘 돌봐 드린다고 하세요", "I'm Min. I'll be looking after you today.", ["looking after you", "take care of you"]),
        t("Nice to meet you, Min.", "반가워요, 민.", "어떻게 불러 드릴지 여쭤보세요", "You too. What would you like me to call you?", ["What would you like me to call you", "call you"]),
        t("Just call me Bill.", "그냥 빌이라고 불러요.", "알겠다고 하고 필요한 거 있으면 말씀하시라고 하세요", "Okay, Bill. Let me know if you need anything.", ["Let me know if", "need anything"]),
      ],
      o("Will do. Where are you from, love?", "그럴게요. 어디서 왔어요?")),

    L("7", 1, "🚪", "방에 들어가기 전", "노크하기·들어가도 되는지 묻기", "어르신 Mrs. Lee",
      [
        ln("Is it okay if I come in", "들어가도 될까요", "Knock knock. Is it okay if I come in?", "똑똑. 들어가도 될까요?", "대답을 듣고 들어가는 게 기본이에요."),
        ln("Come on in", "들어와요", "Come on in, the door's open.", "들어와요, 문 열려 있어요."),
        ln("Is now a good time", "지금 괜찮으세요", "Is now a good time to make your bed?", "지금 침대 정리해도 괜찮으세요?"),
        ln("come back later", "나중에 다시 오다", "No problem, I'll come back later.", "괜찮아요, 나중에 다시 올게요."),
        ln("open the curtains", "커튼을 열다", "Would you like me to open the curtains?", "커튼 열어 드릴까요?"),
      ],
      [
        t("Who's there?", "누구예요?", "민이라고 하고 들어가도 되는지 물어보세요", "It's Min. Is it okay if I come in?", ["Is it okay if I come in", "can I come in"]),
        t("Yes, come on in.", "네, 들어와요.", "지금 침대 정리해도 괜찮은지 물어보세요", "Thanks. Is now a good time to make your bed?", ["a good time", "make your bed"]),
        t("Actually, I'm watching my show.", "사실 지금 드라마 보는 중이에요.", "괜찮다고, 나중에 다시 오겠다고 하세요", "That's fine. I'll come back later.", ["come back later", "come back"]),
      ],
      o("Thanks, love. It finishes at ten.", "고마워요. 10시에 끝나요.")),

    L("8", 1, "🦻", "보청기 낀 어르신", "크게 다시 묻기·배터리 갈아 드리기", "어르신 Mr. Smith",
      [
        ln("hearing aid", "보청기", "Have you got your hearing aid in?", "보청기 끼셨어요?"),
        ln("say that again", "다시 말하다", "Sorry, could you say that again?", "죄송해요, 다시 한번 말씀해 주시겠어요?"),
        ln("speak up", "크게 말하다", "Can you speak up a bit, dear?", "좀 크게 말해 줄래요?"),
        ln("the battery is flat", "배터리가 다 됐다", "I think the battery is flat.", "배터리가 다 된 것 같아요.", "호주에선 방전된 걸 flat이라고 해요."),
        ln("grab a new one", "새 걸 가져오다", "Hang on, I'll grab a new one.", "잠깐만요, 새 걸 가져올게요."),
      ],
      [
        t("Pardon? I can't hear you.", "뭐라고요? 안 들려요.", "보청기 끼셨는지 크게 물어보세요", "Have you got your hearing aid in today?", ["hearing aid", "got it in"]),
        t("Yes, but it's not working.", "끼긴 했는데 안 돼요.", "배터리가 다 된 것 같다고 하세요", "Hmm, maybe the battery is flat.", ["battery is flat", "the battery"]),
        t("Oh, that'd be it.", "아, 그거겠네.", "새 걸 가져오겠다고 하세요", "I'll grab a new one for you.", ["grab a new one", "get a new one"]),
      ],
      o("Ah, much better. Thanks, love.", "아, 훨씬 낫네. 고마워요.")),

    L("9", 1, "🔔", "콜벨 응답하기", "부르신 이유 묻기·도와드리기", "어르신 Mrs. Brown",
      [
        ln("pressed the buzzer", "벨을 누르다", "Hi, you pressed the buzzer. What's up?", "벨 누르셨죠. 무슨 일이세요?", "콜벨을 buzzer라고도 해요."),
        ln("What can I do for you", "뭘 도와드릴까요", "What can I do for you, Mrs. Brown?", "브라운 여사님, 뭘 도와드릴까요?"),
        ln("go to the toilet", "화장실에 가다", "I need to go to the toilet.", "화장실 가야 해요."),
        ln("get your frame", "보행기를 가져오다", "Okay, let's get your frame first.", "네, 먼저 보행기부터 가져올게요.", "호주에선 보행기를 frame이라고도 해요."),
        ln("within reach", "손 닿는 곳에", "I'll leave the bell within reach.", "벨은 손 닿는 곳에 둘게요."),
      ],
      [
        t("Oh good, you came.", "아, 왔네요.", "벨 누르셨다고 하고 뭘 도와드릴지 물어보세요", "You pressed the buzzer. What can I do for you?", ["What can I do for you", "how can I help"]),
        t("I need to go to the toilet.", "화장실 가야 해요.", "먼저 보행기를 가져오자고 하세요", "Sure, let's get your frame first.", ["get your frame", "your frame"]),
        t("Thank you, dear.", "고마워요.", "괜찮다고 하고 벨은 손 닿는 곳에 두겠다고 하세요", "No worries. I'll leave the bell within reach.", ["within reach", "near you"]),
      ],
      o("You're a gem.", "정말 고마운 사람이네.")),

    // ───────── STEP 2 매일 돌봄 루틴 ─────────
    L("2", 2, "🩺", "인수인계 받기", "약 시간·기록·혈압", "간호사",
      [
        ln("handover", "인수인계", "Handover starts at 7 in the nurses' station.", "인수인계는 7시에 간호사실에서 해요."),
        ln("medication is due", "약 드릴 시간이다", "Her medication is due at 12.", "그분 약은 12시에 드려야 해요."),
        ln("fill in the notes", "기록지를 쓰다", "Please fill in the notes before you leave.", "가기 전에 기록지 꼭 써 주세요."),
        ln("blood pressure", "혈압", "Can you check his blood pressure at 3?", "3시에 그분 혈압 좀 재 줄래요?"),
        ln("Anything I should know", "알아야 할 거 있나요", "Anything I should know about room 5?", "5호실에 관해 알아야 할 거 있나요?"),
      ],
      [
        t("Here's the handover for room 5.", "5호실 인수인계예요.", "약은 언제 드리는지 물어보세요", "Thanks. When is her medication due?", ["medication", "meds"]),
        t("At 12, with lunch.", "12시, 점심이랑요.", "드린 뒤 기록지에 쓰겠다고 하세요", "Okay, I'll fill in the notes after.", ["fill in the notes", "write it up"]),
        t("And check her blood pressure at 3.", "3시에 혈압도 재요.", "3시에 혈압 재겠다고 하세요", "Got it. Blood pressure at 3.", ["blood pressure", "BP"]),
      ],
      o("Thanks.", "고마워요.")),

    L("3", 2, "🍲", "식사 돕기", "조금이라도 드시게 권하기", "어르신",
      [
        ln("a little bit", "조금", "Could you try a little bit?", "조금만 드셔 보실래요?"),
        ln("not very hungry", "별로 배고프지 않다", "I'm not very hungry today.", "오늘은 별로 배가 안 고파요."),
        ln("get you some soup", "수프를 가져다드리다", "I'll get you some soup instead.", "대신 수프 가져다드릴게요."),
        ln("cut it up", "잘게 자르다", "Would you like me to cut it up?", "잘게 잘라 드릴까요?"),
        ln("too hot", "너무 뜨거운", "Careful, the tea's still too hot.", "조심하세요, 차가 아직 너무 뜨거워요."),
      ],
      [
        t("I don't really want lunch.", "점심 별로 먹고 싶지 않아요.", "조금이라도 드셔 보시라고 권하세요", "Could you try a little bit?", ["a little bit", "try a little"]),
        t("Maybe some soup.", "수프 조금이요.", "수프를 가져다드리겠다고 하세요", "Sure, I'll get you some soup.", ["get you some soup", "some soup"]),
        t("Thank you, love.", "고마워요.", "천만에요라고 하세요", "You're welcome.", ["you're welcome", "no worries"]),
      ],
      o("You're a good one.", "참 착하네요.")),

    L("10", 2, "🚿", "샤워 도와드리기", "물 온도 확인하기·사생활 지켜 드리기", "어르신 Mrs. Taylor",
      [
        ln("ready for your shower", "샤워하실 준비", "Are you ready for your shower?", "샤워하실 준비 되셨어요?"),
        ln("Is the water okay", "물 괜찮으세요", "Is the water okay, or too hot?", "물 괜찮으세요, 아니면 너무 뜨거우세요?"),
        ln("shower chair", "샤워 의자", "Sit on the shower chair, nice and slow.", "샤워 의자에 천천히 앉으세요."),
        ln("cover you with a towel", "수건으로 덮어 드리다", "I'll cover you with a towel.", "수건으로 덮어 드릴게요.", "존엄성(dignity) 지키기가 정말 중요해요."),
        ln("wash my back", "등을 씻기다", "Can you wash my back for me?", "등 좀 씻겨 줄래요?"),
      ],
      [
        t("Is it shower time already?", "벌써 샤워 시간이에요?", "네 하고 샤워 준비 되셨는지 물어보세요", "Yes, it is. Are you ready for your shower?", ["ready for your shower", "ready"]),
        t("I suppose so. Not too hot, please.", "그런 것 같네요. 너무 뜨겁지 않게요.", "물이 괜찮은지 물어보세요", "Of course. Is the water okay?", ["Is the water okay", "too hot"]),
        t("That's lovely. I feel a bit cold, though.", "좋네요. 근데 좀 추워요.", "수건으로 덮어 드리겠다고 하세요", "Here, I'll cover you with a towel.", ["cover you with a towel", "a towel"]),
      ],
      o("Thank you. You're very gentle.", "고마워요. 손길이 참 부드럽네요.")),

    L("11", 2, "👕", "옷 갈아입기 돕기", "입고 싶은 옷 고르시게 하기", "어르신 Mr. Jones",
      [
        ln("What would you like to wear", "뭐 입고 싶으세요", "What would you like to wear today?", "오늘 뭐 입고 싶으세요?", "직접 고르시게 하는 게 좋아요."),
        ln("blue shirt", "파란 셔츠", "The blue shirt or the grey one?", "파란 셔츠요, 회색 셔츠요?"),
        ln("arm through", "팔을 넣다", "Pop your arm through here.", "여기로 팔 넣으세요."),
        ln("do up the buttons", "단추를 잠그다", "Can you do up the buttons yourself?", "단추는 직접 잠그실 수 있으세요?"),
        ln("a bit chilly", "좀 쌀쌀한", "It's a bit chilly. Grab my cardigan.", "좀 쌀쌀하네. 내 카디건 좀 줘요."),
      ],
      [
        t("Morning. What's the plan today?", "안녕. 오늘 뭐 해요?", "옷부터 갈아입자고 하고 뭘 입고 싶으신지 물어보세요", "Let's get dressed. What would you like to wear?", ["What would you like to wear", "get dressed"]),
        t("Hmm, I can't decide.", "음, 못 고르겠네.", "파란 셔츠와 회색 셔츠 중에 고르시게 하세요", "How about the blue shirt or the grey one?", ["blue shirt", "grey one"]),
        t("The blue one. It's a bit chilly, too.", "파란 거. 좀 쌀쌀하기도 하고.", "카디건도 입으시겠냐고 물어보세요", "Would you like your cardigan too?", ["your cardigan", "cardigan"]),
      ],
      o("Good idea. You think of everything.", "좋은 생각이에요. 꼼꼼하네.")),

    L("12", 2, "♿", "휠체어로 식당 모시기", "브레이크 확인하기·출발 알리기", "어르신 Mrs. Davis",
      [
        ln("Lunch is ready", "점심 준비됐어요", "Lunch is ready in the dining room.", "식당에 점심 준비됐어요."),
        ln("brakes are on", "브레이크가 걸려 있다", "Let me check the brakes are on.", "브레이크 걸려 있는지 확인할게요."),
        ln("feet on the footplates", "발을 발판에", "Put your feet on the footplates, please.", "발은 발판 위에 올려 주세요."),
        ln("Here we go", "자, 출발해요", "Okay, here we go. Nice and slow.", "자, 출발할게요. 천천히요."),
        ln("sit with", "~와 같이 앉다", "Can I sit with Margaret today?", "오늘 마거릿이랑 같이 앉아도 돼요?"),
      ],
      [
        t("Is it time to eat?", "밥 먹을 시간이에요?", "식당에 점심 준비됐다고 하세요", "Yes, lunch is ready in the dining room.", ["Lunch is ready", "lunch time"]),
        t("Okay, let's go.", "좋아요, 가요.", "발을 발판에 올려 달라고 하세요", "Great. Feet on the footplates, please.", ["footplates", "your feet"]),
        t("Can I sit with Margaret today?", "오늘 마거릿이랑 앉아도 돼요?", "물론이라고 하고 출발한다고 하세요", "Of course. Here we go!", ["Here we go", "let's go"]),
      ],
      o("Wonderful. She always saves me a seat.", "좋아요. 마거릿이 늘 자리 맡아 줘요.")),

    L("13", 2, "🌙", "잠자리 준비", "블라인드 내리기·벨 위치 알려 드리기", "어르신 Mr. Clarke",
      [
        ln("ready for bed", "주무실 준비가 된", "Are you ready for bed, Mr. Clarke?", "클라크 씨, 주무실 준비 되셨어요?"),
        ln("close the blinds", "블라인드를 내리다", "I'll close the blinds for you.", "블라인드 내려 드릴게요."),
        ln("extra blanket", "담요 하나 더", "Would you like an extra blanket?", "담요 하나 더 드릴까요?"),
        ln("leave the light on", "불을 켜 두다", "Can you leave the light on in the toilet?", "화장실 불 좀 켜 둘래요?"),
        ln("Sleep tight", "푹 주무세요", "Night, Mr. Clarke. Sleep tight.", "클라크 씨, 안녕히 주무세요. 푹 주무세요."),
      ],
      [
        t("I'm getting sleepy.", "졸리네요.", "주무실 준비 되셨는지 물어보세요", "Are you ready for bed?", ["ready for bed", "go to bed"]),
        t("Yes. It's a bit bright in here.", "네. 여기 좀 밝네요.", "블라인드를 내려 드리겠다고 하세요", "No problem, I'll close the blinds.", ["close the blinds", "the blinds"]),
        t("Could you leave the toilet light on?", "화장실 불 좀 켜 둘래요?", "그러겠다고 하고 벨은 바로 옆에 있다고 하세요", "Sure. Your bell is right next to you.", ["Your bell", "next to you"]),
      ],
      o("Thanks, love. Sleep tight yourself.", "고마워요. 당신도 잘 자요.")),

    // ───────── STEP 3 어르신·가족 요청 ─────────
    L("14", 3, "🧑‍🤝‍🧑", "가족 면회 안내", "방문 기록 받기·계신 곳 알려 드리기", "면회 온 딸 Sarah",
      [
        ln("here to see", "~를 보러 오다", "Hi, I'm here to see my mum, Joan.", "안녕하세요, 저희 엄마 조앤 보러 왔어요."),
        ln("sign the visitor book", "방문자 명부에 서명하다", "Could you sign the visitor book first?", "먼저 방문자 명부에 서명해 주시겠어요?"),
        ln("in the lounge", "라운지에", "She's in the lounge watching TV.", "라운지에서 TV 보고 계세요."),
        ln("show you the way", "안내해 드리다", "Come with me, I'll show you the way.", "따라오세요, 안내해 드릴게요."),
        ln("in a good mood", "기분이 좋은", "She's been in a good mood today.", "오늘 기분이 좋으셨어요."),
      ],
      [
        t("Hi, I'm here to see Joan Miller.", "안녕하세요, 조앤 밀러 보러 왔어요.", "먼저 방문자 명부에 서명해 달라고 하세요", "Hi! Could you sign the visitor book first?", ["sign the visitor book", "sign in"]),
        t("Sure. Where is she?", "네. 어디 계세요?", "라운지에서 TV 보고 계신다고 하세요", "She's in the lounge, watching TV.", ["in the lounge", "lounge"]),
        t("How's she been today?", "오늘은 어떠셨어요?", "기분 좋으셨다고 하고 안내해 드리겠다고 하세요", "She's been in a good mood. I'll show you the way.", ["good mood", "show you the way"]),
      ],
      o("That's great to hear. Thanks so much.", "다행이네요. 정말 고마워요.")),

    L("15", 3, "☕", "차 취향 맞춰 드리기", "우유·설탕 여쭤보기·가져다드리기", "어르신 Mrs. Green",
      [
        ln("cuppa", "차 한 잔", "Would you like a cuppa, Mrs. Green?", "그린 여사님, 차 한 잔 드릴까요?", "호주에선 차 한 잔을 cuppa라고 해요."),
        ln("How do you have it", "어떻게 드세요", "How do you have it? Milk and sugar?", "어떻게 드세요? 우유랑 설탕 넣어요?"),
        ln("white with one", "우유에 설탕 하나", "White with one, thanks.", "우유 넣고 설탕 하나요.", "white = 우유 넣은, one = 설탕 한 스푼"),
        ln("a couple of biscuits", "비스킷 두어 개", "Could I have a couple of biscuits too?", "비스킷도 두어 개 줄래요?"),
        ln("Here you go", "여기 있어요", "Here you go. Careful, it's hot.", "여기 있어요. 뜨거우니 조심하세요."),
      ],
      [
        t("I'm a bit thirsty.", "목이 좀 마르네요.", "차 한 잔 드릴지 물어보세요", "Would you like a cuppa?", ["cuppa", "cup of tea"]),
        t("Oh, yes please.", "아, 좋아요.", "어떻게 드시는지 물어보세요", "Sure. How do you have it?", ["How do you have it", "milk and sugar"]),
        t("White with one. And a couple of biscuits?", "우유에 설탕 하나요. 비스킷 두어 개도요?", "물론이라고 하고 금방 오겠다고 하세요", "Of course. I'll be right back.", ["be right back", "right back"]),
      ],
      o("Lovely. You spoil me.", "좋아요. 너무 잘해 주네요.")),

    L("16", 3, "🌳", "정원 산책 가기", "모자 챙기기·쉬어 가며 걷기", "어르신 Mr. Hall",
      [
        ln("go for a walk", "산책하다", "Can we go for a walk in the garden?", "정원에서 산책해도 될까요?"),
        ln("grab your hat", "모자를 챙기다", "It's sunny, so let's grab your hat.", "햇볕이 세니까 모자 챙겨요.", "호주 햇볕은 강해서 모자가 필수예요."),
        ln("put some sunscreen on", "선크림을 바르다", "Let me put some sunscreen on your arms.", "팔에 선크림 좀 발라 드릴게요."),
        ln("have a rest", "쉬다", "Do you want to have a rest on the bench?", "벤치에서 좀 쉬실래요?"),
        ln("head back inside", "안으로 돌아가다", "Shall we head back inside for morning tea?", "모닝 티 드시러 안으로 돌아갈까요?"),
      ],
      [
        t("It's a beautiful day. Can we go for a walk?", "날씨 좋네요. 산책 갈 수 있어요?", "좋다고 하고 모자부터 챙기자고 하세요", "Sure! Let's grab your hat first.", ["grab your hat", "your hat"]),
        t("Good thinking. Off we go.", "좋은 생각이에요. 가요.", "여기서 좀 쉬실지 물어보세요", "Would you like to have a rest here?", ["have a rest", "sit down"]),
        t("Yes, my legs are tired.", "네, 다리가 좀 피곤하네.", "쉬었다가 모닝 티 드시러 들어가자고 하세요", "Let's rest, then head back inside for morning tea.", ["head back inside", "go back inside"]),
      ],
      o("Sounds perfect. Thanks, mate.", "완벽하네. 고마워요.")),

    L("17", 3, "📱", "영상통화 연결해 드리기", "아이패드로 가족과 통화 돕기", "어르신 Mrs. White",
      [
        ln("call my daughter", "딸에게 전화하다", "Could you help me call my daughter?", "딸한테 전화하는 것 좀 도와줄래요?"),
        ln("video call", "영상통화", "Let's do a video call on the iPad.", "아이패드로 영상통화 해요."),
        ln("Can you hear her", "따님 목소리 들리세요", "Can you hear her okay?", "따님 목소리 잘 들리세요?"),
        ln("turn it up", "소리를 키우다", "I'll turn it up a bit.", "소리 조금 키울게요."),
        ln("give you some privacy", "편하게 통화하시게 자리를 비켜 드리다", "I'll give you some privacy. Call me when you're done.", "편하게 통화하세요. 끝나면 불러 주세요."),
      ],
      [
        t("It's my daughter's birthday. Could you help me call her?", "딸 생일이에요. 전화 좀 도와줄래요?", "아이패드로 영상통화 하자고 하세요", "Of course. Let's do a video call on the iPad.", ["video call", "FaceTime"]),
        t("Oh, there she is! But she's very quiet.", "아, 딸이다! 근데 소리가 너무 작아요.", "소리를 조금 키우겠다고 하세요", "No worries, I'll turn it up.", ["turn it up", "louder"]),
        t("That's better.", "이제 낫네요.", "편하게 통화하시라고 자리를 비켜 드리겠다고 하세요", "Great. I'll give you some privacy.", ["give you some privacy", "leave you to it"]),
      ],
      o("Thank you, darling. You're a star.", "고마워요. 정말 최고예요.")),

    L("18", 3, "🛒", "NDIS 고객과 장보기", "장보기 목록 확인하기·영수증 챙기기", "NDIS 고객 Jake",
      [
        ln("shopping list", "장보기 목록", "Have you got your shopping list?", "장보기 목록 챙겼어요?"),
        ln("What's your budget", "예산이 얼마예요", "What's your budget this week?", "이번 주 예산이 얼마예요?"),
        ln("on special", "할인 중인", "The chicken is on special today.", "오늘 닭고기 할인해요.", "호주 마트에선 할인을 special이라고 해요."),
        ln("self-serve", "셀프 계산대", "Do you want to pay at the self-serve?", "셀프 계산대에서 직접 계산할래요?"),
        ln("keep the receipt", "영수증을 챙기다", "Make sure you keep the receipt.", "영수증 꼭 챙기세요.", "지원금 정산에 영수증이 필요할 수 있어요."),
      ],
      [
        t("Let's go to Woolies. I need food for the week.", "울리스 가요. 일주일 먹을 거 사야 해요.", "장보기 목록 챙겼는지 물어보세요", "Sounds good. Have you got your shopping list?", ["shopping list", "your list"]),
        t("Yep, here. I've got $80.", "네, 여기요. 80달러 있어요.", "오늘 닭고기가 할인 중이라고 알려 주세요", "Nice. The chicken is on special today.", ["on special", "on sale"]),
        t("Cool, I'll get two.", "좋아요, 두 개 살게요.", "계산하고 영수증 꼭 챙기라고 하세요", "Great. Don't forget to keep the receipt.", ["keep the receipt", "the receipt"]),
      ],
      o("Got it. Thanks for coming with me.", "알겠어요. 같이 와 줘서 고마워요.")),

    L("19", 3, "👨‍👩‍👧", "가족이 상태를 물을 때", "아는 만큼 전하기·간호사 연결하기", "아들 David",
      [
        ln("How's Dad been", "아버지는 어떠셨어요", "How's Dad been this week?", "이번 주 아버지는 어떠셨어요?"),
        ln("eating well", "잘 드시다", "He's been eating well and sleeping okay.", "잘 드시고 잠도 괜찮게 주무세요."),
        ln("speak to the RN", "간호사와 이야기하다", "For his meds, it's best to speak to the RN.", "약에 관해서는 간호사와 이야기하시는 게 좋아요.", "RN = 정규 간호사. 의료 정보는 간호사가 전해요."),
        ln("grab her for you", "불러 드리다", "She's free now. I'll grab her for you.", "지금 시간 되세요. 불러 드릴게요."),
        ln("joined in", "참여했다", "He joined in the bingo yesterday.", "어제 빙고 게임에 참여하셨어요."),
      ],
      [
        t("Hi, I'm David, Frank's son. How's Dad been?", "안녕하세요, 프랭크 아들 데이비드예요. 아버지 어떠셨어요?", "잘 드시고 어제 빙고에도 참여하셨다고 하세요", "He's been eating well, and he joined in bingo yesterday.", ["eating well", "joined in"]),
        t("Great. Has his blood pressure medication changed?", "좋네요. 혈압약은 바뀌었어요?", "약은 간호사와 이야기하시는 게 좋다고 하세요", "It's best to speak to the RN about that.", ["speak to the RN", "ask the nurse"]),
        t("Okay. Is she around?", "알겠어요. 간호사 계세요?", "지금 계신다고 하고 불러 드리겠다고 하세요", "Yes, she's here. I'll grab her for you.", ["grab her for you", "get her"]),
      ],
      o("Thanks, I appreciate it.", "고마워요, 정말로요.")),

    // ───────── STEP 4 건강 이상·안전 ─────────
    L("4", 4, "💫", "어지럽다는 어르신", "앉히고 간호사에게 알리기", "어르신",
      [
        ln("I feel dizzy", "어지러워요", "I feel dizzy when I stand up.", "일어나면 어지러워요."),
        ln("sit down", "앉다", "Please sit down here for a minute.", "여기 잠깐 앉으세요."),
        ln("let the nurse know", "간호사에게 알리다", "I'll let the nurse know right away.", "바로 간호사에게 알릴게요."),
        ln("stay with you", "곁에 있다", "Don't worry, I'll stay with you.", "걱정 마세요, 곁에 있을게요."),
        ln("a glass of water", "물 한 잔", "Would you like a glass of water?", "물 한 잔 드릴까요?"),
      ],
      [
        t("I feel dizzy...", "어지러워요...", "앉으시라고 하고 괜찮으신지 물어보세요", "Please sit down. Are you okay?", ["sit down", "are you okay"]),
        t("My head hurts.", "머리가 아파요.", "바로 간호사에게 알리겠다고 하세요", "I'll let the nurse know right away.", ["let the nurse know", "tell the nurse"]),
        t("Thank you.", "고마워요.", "옆에 있겠다고 안심시켜 드리세요", "Don't worry, I'll stay with you.", ["stay with you", "stay here"]),
      ],
      o("Thank you, dear.", "고마워요.")),

    L("20", 4, "🆘", "바닥에 쓰러진 어르신", "일으키지 않기·비상벨 누르기", "어르신 Mr. King",
      [
        ln("Don't try to get up", "일어나려고 하지 마세요", "Don't try to get up yet, Mr. King.", "킹 씨, 아직 일어나려고 하지 마세요."),
        ln("Are you hurt", "다치셨어요", "Are you hurt anywhere?", "어디 다치신 데 있어요?"),
        ln("press the emergency bell", "비상벨을 누르다", "I'm going to press the emergency bell.", "비상벨 누를게요.", "혼자 일으키지 말고 간호사를 불러요."),
        ln("my hip hurts", "엉덩이 쪽이 아프다", "I slipped and my hip hurts.", "미끄러졌는데 엉덩이 쪽이 아파요."),
        ln("Help is on the way", "곧 사람이 와요", "Stay still. Help is on the way.", "가만히 계세요. 곧 사람이 와요."),
      ],
      [
        t("Oh dear, I've fallen.", "아이고, 넘어졌어요.", "일어나려고 하지 말라고 하고 다치셨는지 물어보세요", "Don't try to get up. Are you hurt?", ["Don't try to get up", "are you hurt"]),
        t("My hip hurts a bit.", "엉덩이가 좀 아파요.", "비상벨을 누르겠다고 하세요", "Okay, I'm going to press the emergency bell.", ["emergency bell", "call the nurse"]),
        t("I'm so embarrassed.", "너무 창피하네요.", "괜찮다고 하고 곧 사람이 온다고 하세요", "It's okay. Help is on the way.", ["Help is on the way", "someone's coming"]),
      ],
      o("Thank you for staying with me.", "곁에 있어 줘서 고마워요.")),

    L("21", 4, "💊", "약을 거부하실 때", "이유 여쭤보기·간호사에게 보고하기", "어르신 Mrs. Scott",
      [
        ln("I don't want those pills", "그 약 먹기 싫어요", "I don't want those pills today.", "오늘은 그 약 안 먹을래요."),
        ln("Can I ask why", "왜 그런지 여쭤봐도 될까요", "That's okay. Can I ask why?", "괜찮아요. 왜 그런지 여쭤봐도 될까요?"),
        ln("upset my tummy", "속을 불편하게 하다", "They upset my tummy.", "그거 먹으면 속이 안 좋아요."),
        ln("can't make you", "억지로 하게 할 수 없다", "I can't make you take them.", "억지로 드시게 할 순 없어요.", "본인이 거부할 권리가 있어요."),
        ln("report it to the RN", "간호사에게 보고하다", "I'll report it to the RN straight away.", "바로 간호사에게 보고할게요."),
      ],
      [
        t("I'm not taking those today.", "오늘은 그거 안 먹어요.", "괜찮다고 하고 이유를 여쭤보세요", "That's okay. Can I ask why?", ["Can I ask why", "why"]),
        t("They upset my tummy.", "그거 먹으면 속이 안 좋아요.", "알겠다고 하고 간호사에게 보고하겠다고 하세요", "I understand. I'll report it to the RN.", ["report it to the RN", "tell the nurse"]),
        t("Will I get in trouble?", "나 혼나는 거예요?", "전혀 아니라고, 선택하실 수 있다고 하세요", "Not at all. It's your choice.", ["your choice", "not at all"]),
      ],
      o("Thank you for listening, love.", "들어 줘서 고마워요.")),

    L("22", 4, "🩹", "팔에 멍 발견", "크기 설명하기·사고 보고서 쓰기", "간호사 Linda",
      [
        ln("noticed a bruise", "멍을 발견하다", "I noticed a bruise on her left arm.", "그분 왼팔에서 멍을 발견했어요."),
        ln("When did you see it", "언제 봤어요", "When did you see it?", "언제 봤어요?"),
        ln("during her shower", "샤워하실 때", "Just now, during her shower.", "방금 샤워하실 때요."),
        ln("incident report", "사고 보고서", "Can you fill out an incident report?", "사고 보고서 좀 작성해 줄래요?", "작은 상처도 꼭 기록해요."),
        ln("the size of a coin", "동전만 한 크기", "It's about the size of a coin.", "동전만 한 크기예요."),
      ],
      [
        t("Hi, what's up?", "네, 무슨 일이에요?", "도로시 왼팔에서 멍을 발견했다고 하세요", "I noticed a bruise on Dorothy's left arm.", ["noticed a bruise", "a bruise"]),
        t("Okay. How big is it?", "그래요. 얼마나 커요?", "동전만 한 크기라고 하세요", "About the size of a coin.", ["size of a coin", "small"]),
        t("Thanks. Can you fill out an incident report?", "고마워요. 사고 보고서 써 줄래요?", "네, 근무 끝나기 전에 쓰겠다고 하세요", "Sure, I'll do the incident report before I finish.", ["incident report", "fill it out"]),
      ],
      o("Great. I'll go and check on her now.", "좋아요. 지금 가서 볼게요.")),

    L("23", 4, "🏠", "집에 가겠다는 치매 어르신", "이야기 따라가기·관심 돌리기", "치매 어르신 Mrs. Adams",
      [
        ln("I want to go home", "집에 가고 싶어요", "I want to go home now. Where's my bag?", "이제 집에 갈래요. 내 가방 어딨어요?"),
        ln("Tell me about", "~ 얘기해 주세요", "Tell me about your house, Mrs. Adams.", "애덤스 여사님, 댁 얘기 좀 해 주세요.", "고치려 하지 말고 이야기를 따라가 주세요."),
        ln("Shall we", "~할까요", "Shall we have a cup of tea first?", "먼저 차 한 잔 할까요?"),
        ln("waiting for me", "날 기다리다", "My husband is waiting for me.", "남편이 날 기다리고 있어요."),
        ln("You're safe here", "여기선 안전해요", "You're safe here. I'm right with you.", "여기선 안전해요. 제가 바로 옆에 있어요."),
      ],
      [
        t("I need to go home. My husband is waiting for me.", "집에 가야 해요. 남편이 기다려요.", "남편분 얘기를 해 달라고 하세요", "Tell me about your husband.", ["Tell me about", "your husband"]),
        t("He builds houses. He'll be hungry.", "집 짓는 일 해요. 배고플 거예요.", "먼저 차 한 잔 하자고 하세요", "Shall we have a cuppa first?", ["Shall we", "cuppa"]),
        t("Well... I am a bit thirsty.", "글쎄요... 목이 좀 마르긴 하네.", "여기선 안전하다고, 옆에 있겠다고 하세요", "You're safe here. I'll stay right with you.", ["You're safe here", "with you"]),
      ],
      o("You're kind. What's your name again?", "친절하네요. 이름이 뭐였죠?")),

    L("24", 4, "🏋️", "호이스트 2인 작업", "혼자 하지 않기·동료와 셋에 맞추기", "동료 Sam",
      [
        ln("two-person transfer", "2인 이동", "Mr. Kelly is a two-person transfer.", "켈리 씨는 2인 이동이 필요한 분이에요."),
        ln("give me a hand with", "~를 같이 도와주다", "Can you give me a hand with the hoist?", "호이스트 좀 같이 도와줄래요?"),
        ln("check the sling", "슬링을 확인하다", "Let's check the sling before we lift.", "들기 전에 슬링부터 확인해요."),
        ln("On three", "셋에", "Ready? On three. One, two, three.", "준비됐어요? 셋에 해요. 하나, 둘, 셋."),
        ln("manual handling", "이동 보조 작업", "Never skip the manual handling rules.", "이동 보조 안전 수칙은 절대 건너뛰면 안 돼요.", "호주 요양 현장의 핵심 안전 교육이에요."),
      ],
      [
        t("Hey, you look busy. What's up?", "바빠 보이네. 무슨 일이야?", "켈리 씨 호이스트 좀 같이 도와 달라고 하세요", "Can you give me a hand with Mr. Kelly's hoist?", ["give me a hand", "help me"]),
        t("Sure. Have you checked the sling?", "그래. 슬링은 확인했어?", "아직이라고 하고 지금 같이 확인하자고 하세요", "Not yet. Let's check the sling now.", ["check the sling", "check it"]),
        t("Looks good. Ready when you are.", "괜찮네. 준비되면 말해.", "셋에 들자고 하세요", "Okay, on three. One, two, three.", ["on three", "one, two, three"]),
      ],
      o("Nice and smooth. Good teamwork.", "부드럽게 잘됐다. 팀워크 좋네.")),

    // ───────── STEP 5 교대·팀워크·기록 ─────────
    L("25", 5, "📋", "다음 근무자 인수인계", "내 근무 중 있었던 일 전하기", "오후 근무자 Priya",
      [
        ln("give you the handover", "인수인계를 하다", "Let me give you the handover for wing B.", "B동 인수인계 해 드릴게요."),
        ln("had a quiet morning", "조용한 아침을 보냈다", "Room 3 had a quiet morning.", "3호실은 조용한 아침이었어요."),
        ln("didn't eat much", "많이 안 드셨다", "Mrs. Scott didn't eat much at lunch.", "스콧 여사님은 점심을 많이 안 드셨어요."),
        ln("keep an eye on", "지켜보다", "Can you keep an eye on Mr. King?", "킹 씨 좀 지켜봐 줄래요?"),
        ln("all in the notes", "기록에 다 있다", "It's all in the notes on the system.", "시스템 기록에 다 있어요."),
      ],
      [
        t("Hey! How was your shift?", "안녕! 근무 어땠어?", "괜찮았다고 하고 B동 인수인계를 해 주겠다고 하세요", "Pretty good. Let me give you the handover for wing B.", ["give you the handover", "handover"]),
        t("Great. Anything I should watch out for?", "좋아. 신경 써야 할 거 있어?", "스콧 여사님이 점심을 많이 안 드셨다고 하세요", "Mrs. Scott didn't eat much at lunch.", ["didn't eat much", "not much"]),
        t("Okay, I'll offer her a snack later.", "알았어, 이따 간식 드려 볼게.", "킹 씨가 오늘 넘어지셨으니 지켜봐 달라고 하세요", "Thanks. Mr. King had a fall, so keep an eye on him.", ["keep an eye on", "watch him"]),
        t("Will do. Is it all written up?", "알겠어. 다 기록돼 있어?", "시스템 기록에 다 있다고 하세요", "Yep, it's all in the notes.", ["all in the notes", "in the notes"]),
      ],
      o("Perfect. Go home and rest!", "완벽해. 가서 쉬어!")),

    L("26", 5, "🚨", "콜벨 두 개가 동시에", "급한 쪽 먼저 가기·동료에게 부탁하기", "동료 Tom",
      [
        ln("both going off", "둘 다 울리다", "Rooms 4 and 9 are both going off.", "4호실이랑 9호실 벨이 둘 다 울려요."),
        ln("Can you take", "~를 맡아 줄래요", "Can you take room 9 for me?", "9호실 좀 맡아 줄래요?"),
        ln("be there in a sec", "금방 가다", "Hang on, I'll be there in a sec.", "잠깐만요, 금방 갈게요."),
        ln("on my way", "가는 중", "I'm on my way, Mrs. Brown!", "지금 가요, 브라운 여사님!"),
        ln("tied up", "손을 못 떼는", "Sorry, I'm tied up with a shower.", "미안, 샤워 돕느라 손을 못 떼."),
      ],
      [
        t("Two bells at once. What's happening?", "벨 두 개가 동시에 울리네. 무슨 일이야?", "4호실과 9호실이 둘 다 울린다고 하세요", "Rooms 4 and 9 are both going off.", ["both going off", "both ringing"]),
        t("I just finished a shower. I'm free.", "방금 샤워 끝났어. 나 이제 돼.", "9호실을 맡아 달라고 하세요", "Great. Can you take room 9?", ["Can you take", "room 9"]),
        t("Sure. Who's in room 4?", "그래. 4호실은 누구야?", "브라운 여사님인데 낙상 위험이 있어서 지금 간다고 하세요", "Mrs. Brown. She's a falls risk, so I'm on my way.", ["on my way", "going now"]),
      ],
      o("Good call. Shout if you need me.", "잘했어. 필요하면 불러.")),

    L("27", 5, "🤒", "아파서 결근할 때", "매니저에게 전화하기·진단서 이야기하기", "매니저 Karen (전화)",
      [
        ln("call in sick", "아파서 결근 연락하다", "Hi Karen, I need to call in sick today.", "안녕하세요 카렌, 오늘 아파서 못 나갈 것 같아요."),
        ln("a temperature", "열", "I've got a temperature and a sore throat.", "열이 나고 목이 아파요."),
        ln("medical certificate", "진단서", "Can you get a medical certificate?", "진단서 받아 올 수 있어요?", "호주에선 줄여서 med cert라고 해요."),
        ln("cover my shift", "내 근무를 대신하다", "Is there anyone who can cover my shift?", "제 근무 대신해 줄 사람 있을까요?"),
        ln("Feel better", "몸조리 잘해요", "No worries. Feel better soon.", "괜찮아요. 얼른 나아요."),
      ],
      [
        t("Morning, this is Karen.", "안녕하세요, 카렌이에요.", "민이라고 하고 아파서 오늘 못 나간다고 하세요", "Hi Karen, it's Min. I need to call in sick today.", ["call in sick", "can't come in"]),
        t("Oh no. What's wrong?", "저런. 어디가 아파요?", "열이 나고 목이 아프다고 하세요", "I've got a temperature and a sore throat.", ["temperature", "sore throat"]),
        t("Okay. Can you get a med cert?", "알겠어요. 진단서 받아 올 수 있어요?", "네, 오늘 GP(동네 병원) 가서 받아 오겠다고 하세요", "Yes, I'll see a GP and get one today.", ["see a GP", "get one"]),
      ],
      o("Thanks for letting me know. Feel better soon.", "알려 줘서 고마워요. 얼른 나아요.")),

    L("28", 5, "🔄", "로스터 바꾸기", "동료에게 근무 교환 부탁하기", "동료 Jess",
      [
        ln("swap shifts", "근무를 바꾸다", "Any chance we could swap shifts on Saturday?", "토요일에 근무 바꿀 수 있을까요?"),
        ln("on the roster", "근무표에", "I'm on the roster for the morning.", "근무표에 저 아침으로 돼 있어요.", "근무표를 호주에선 roster라고 해요."),
        ln("I owe you one", "신세 졌어요", "Thanks heaps, I owe you one.", "정말 고마워요, 신세 졌어요."),
        ln("let the manager know", "매니저에게 알리다", "I'll let the manager know today.", "오늘 매니저한테 알릴게요."),
        ln("What shift are you on", "무슨 근무예요", "What shift are you on next week?", "다음 주에 무슨 근무예요?"),
      ],
      [
        t("Hey, what's up?", "안녕, 무슨 일이야?", "토요일 근무 바꿀 수 있는지 물어보세요", "Any chance we could swap shifts on Saturday?", ["swap shifts", "swap"]),
        t("Maybe. What shift are you on?", "그럴 수도. 너 무슨 근무야?", "근무표에 아침으로 돼 있다고 하세요", "I'm on the roster for the morning.", ["on the roster", "morning shift"]),
        t("Okay, I can do that. I'm on Sunday arvo.", "좋아, 해 줄게. 난 일요일 오후야.", "고맙다고 하고 일요일 맡고 매니저에게 알리겠다고 하세요", "Thanks heaps! I'll take Sunday and let the manager know.", ["let the manager know", "tell the manager"]),
      ],
      o("No worries. Glad I could help.", "천만에. 도울 수 있어서 다행이야.")),

    L("29", 5, "🚗", "가정방문에 늦을 때", "고객에게 미리 전화하기·도착 시간 알리기", "재가 고객 Mr. Evans (전화)",
      [
        ln("running a bit late", "조금 늦고 있다", "Hi Mr. Evans, I'm running a bit late.", "에반스 씨, 제가 조금 늦고 있어요."),
        ln("stuck in traffic", "차가 막히다", "Sorry, I'm stuck in traffic on the highway.", "죄송해요, 고속도로에서 차가 막혀요."),
        ln("be there by", "~까지 도착하다", "I'll be there by 10:15.", "10시 15분까지 갈게요."),
        ln("Is that okay", "괜찮으세요", "Is that okay with you?", "그래도 괜찮으세요?"),
        ln("stay the full hour", "한 시간 꽉 채우다", "Don't worry, I'll still stay the full hour.", "걱정 마세요, 그래도 한 시간 꽉 채워 있을게요."),
      ],
      [
        t("Hello?", "여보세요?", "민이라고 하고 조금 늦고 있다고 하세요", "Hi Mr. Evans, it's Min. I'm running a bit late.", ["running a bit late", "running late", "be late"]),
        t("Oh. What happened?", "아. 무슨 일이에요?", "고속도로에서 차가 막힌다고 하세요", "I'm stuck in traffic on the highway.", ["stuck in traffic", "traffic"]),
        t("Right. When will you get here?", "그렇군요. 언제 와요?", "10시 15분까지 가겠다고 하고 괜찮은지 물어보세요", "I'll be there by 10:15. Is that okay?", ["be there by", "Is that okay"]),
      ],
      o("That's fine. Drive safe, love.", "괜찮아요. 운전 조심해요.")),

    L("30", 5, "🧑‍🏫", "신입에게 일 알려 주기", "하루 순서 설명하기·질문 받아 주기", "신입 동료 Ella",
      [
        ln("show you around", "구경시켜 주다", "I'll show you around before we start.", "시작하기 전에 한 바퀴 구경시켜 줄게요."),
        ln("First up", "제일 먼저", "First up, we do the morning showers.", "제일 먼저 아침 샤워를 해요."),
        ln("care plan", "케어 플랜", "Always check the care plan first.", "항상 케어 플랜부터 확인해요.", "어르신마다 돌봄 방법이 적힌 문서예요."),
        ln("Feel free to ask", "편하게 물어보세요", "Feel free to ask me anything.", "뭐든 편하게 물어보세요."),
        ln("Don't stress", "걱정 마세요", "Don't stress, you'll pick it up fast.", "걱정 마요, 금방 익숙해질 거예요."),
      ],
      [
        t("Hi, I'm Ella. It's my first day.", "안녕하세요, 엘라예요. 오늘 첫날이에요.", "환영한다고 하고 시작 전에 구경시켜 주겠다고 하세요", "Welcome, Ella! I'll show you around before we start.", ["show you around", "give you a tour"]),
        t("Thanks! What do we do first?", "고마워요! 먼저 뭐 해요?", "제일 먼저 아침 샤워를 한다고 하세요", "First up, the morning showers.", ["First up", "first"]),
        t("How do I know what each resident needs?", "어르신마다 뭐가 필요한지 어떻게 알아요?", "항상 케어 플랜부터 확인하라고 하세요", "Always check their care plan first.", ["care plan", "check the plan"]),
        t("Got it. I'm a bit nervous.", "알겠어요. 좀 긴장되네요.", "걱정 말라고, 뭐든 편하게 물어보라고 하세요", "Don't stress. Feel free to ask me anything.", ["Feel free to ask", "don't stress"]),
      ],
      o("Thanks, that really helps.", "고마워요, 정말 도움 돼요.")),
  ],
};

export default curriculum;
