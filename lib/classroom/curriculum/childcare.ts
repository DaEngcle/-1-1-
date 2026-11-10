import { L, ln, o, t, type JobCurriculum } from "./kit";

const curriculum: JobCurriculum = {
  steps: ["첫 만남과 기본 돌봄", "하루 일과 루틴", "부모님 요청·집 규칙", "다침·떼쓰기·안전", "바쁜 하루·조율·인계"],
  lessons: [
    // ───────── STEP 1 첫 만남과 기본 돌봄 ─────────
    L("1", 1, "🧸", "부모님과 첫 인사", "하원 시간·낮잠 시간 확인", "부모",
      [
        ln("the new nanny", "새로 온 내니", "Hi, I'm Yuna, the new nanny.", "안녕하세요, 새로 온 내니 유나예요."),
        ln("Nice to meet you", "만나서 반가워요", "Nice to meet you, Claire.", "만나서 반가워요, 클레어."),
        ln("pick up the kids", "아이들을 데리러 가다", "Can you pick up the kids at 3?", "3시에 애들 데리러 가 줄래요?"),
        ln("nap time", "낮잠 시간", "Nap time for Leo is at 1.", "레오 낮잠 시간은 1시예요."),
        ln("the little one", "막내", "The little one gets cranky after lunch.", "막내는 점심 먹고 나면 칭얼대요."),
      ],
      [
        t("Hi, you must be the new nanny.", "새로 온 내니죠?", "네 하고 만나서 반갑다고 하세요", "Yes, I'm the new nanny. Nice to meet you.", ["nice to meet you", "new nanny"]),
        t("Lovely. Can you pick up the kids at 3?", "3시에 애들 데리러 가 줄래요?", "3시에 데리러 가겠다고 하세요", "Sure, I'll pick up the kids at 3.", ["pick up the kids", "pick them up"]),
        t("Thanks. Nap time for the little one is at 1.", "작은애 낮잠은 1시예요.", "1시 낮잠 맞는지 확인하세요", "Okay, nap time at 1.", ["nap time", "at 1"]),
      ],
      o("Great, thanks so much.", "좋아요, 정말 고마워요.")),

    L("5", 1, "🦖", "아이와 처음 친해지기", "이름 묻기·좋아하는 놀이 찾기", "아이 Leo (5살)",
      [
        ln("What's your name", "이름이 뭐야", "Hi there! What's your name?", "안녕! 이름이 뭐야?"),
        ln("How old are you", "몇 살이야", "How old are you, Leo?", "레오, 몇 살이야?"),
        ln("five and a half", "다섯 살 반", "I'm five and a half!", "나 다섯 살 반이야!"),
        ln("What do you like to play", "뭐 하고 노는 거 좋아해", "What do you like to play?", "뭐 하고 노는 거 좋아해?"),
        ln("show me", "보여 주다", "Cool! Can you show me your dinosaurs?", "멋지다! 공룡 보여 줄 수 있어?"),
      ],
      [
        t("Who are you?", "누구야?", "유나라고 하고 이름이 뭔지 물어보세요", "I'm Yuna. What's your name?", ["What's your name", "your name"]),
        t("Leo. I'm five and a half!", "레오. 나 다섯 살 반이야!", "멋지다고 하고 뭐 하고 노는 거 좋아하는지 물어보세요", "Wow! What do you like to play?", ["What do you like to play", "like to play"]),
        t("Dinosaurs! I've got heaps.", "공룡! 엄청 많아.", "보여 달라고 하세요", "Awesome! Can you show me?", ["show me", "see them"]),
      ],
      o("Come on! This one's a T-rex!", "따라와! 이건 티라노야!")),

    L("6", 1, "🏡", "집 안 규칙 안내받기", "구급상자 위치 묻기·수영장 문 규칙 듣기", "호스트맘 Emma",
      [
        ln("shoes off", "신발을 벗다", "We keep our shoes off inside.", "저희는 집 안에선 신발 벗어요."),
        ln("pool gate", "수영장 문", "Always keep the pool gate shut.", "수영장 문은 항상 닫아 두세요.", "호주는 수영장 펜스 규정이 엄격해요."),
        ln("Where do you keep", "~를 어디에 두세요", "Where do you keep the first aid kit?", "구급상자는 어디에 두세요?"),
        ln("Help yourself", "편하게 꺼내 먹다", "Help yourself to anything in the fridge.", "냉장고에 있는 거 편하게 꺼내 드세요."),
        ln("anything else I should know", "그 밖에 알아야 할 것", "Is there anything else I should know?", "그 밖에 알아야 할 거 또 있나요?"),
      ],
      [
        t("So, this is the kitchen. Help yourself to anything.", "여기가 부엌이에요. 뭐든 편하게 먹어요.", "고맙다고 하고 구급상자는 어디 두는지 물어보세요", "Thanks! Where do you keep the first aid kit?", ["Where do you keep", "first aid kit"]),
        t("Top shelf in the laundry.", "세탁실 맨 위 선반이요.", "알겠다고 하고 그 밖에 알아야 할 게 있는지 물어보세요", "Got it. Is there anything else I should know?", ["anything else", "should know"]),
        t("Yes. The pool gate must stay shut. Always.", "네. 수영장 문은 꼭 닫혀 있어야 해요. 항상요.", "수영장 문은 꼭 닫아 두겠다고 하세요", "No worries, I'll always keep the pool gate shut.", ["pool gate", "keep it shut"]),
      ],
      o("Perfect. You'll fit right in.", "좋아요. 금방 적응하겠네요.")),

    L("7", 1, "📞", "비상 연락처 확인", "부모 번호 저장하기·000 확인하기", "아빠 Tom",
      [
        ln("in case of an emergency", "비상시에", "Who should I call in case of an emergency?", "비상시엔 누구한테 전화해야 해요?"),
        ln("Triple Zero", "000 (호주 긴급 번호)", "For anything serious, call Triple Zero.", "심각한 일이면 000에 전화하세요.", "호주 긴급 번호는 000이에요."),
        ln("If you can't reach us", "저희랑 연락이 안 되면", "If you can't reach us, call Grandma.", "저희랑 연락 안 되면 할머니한테 전화해요."),
        ln("save your number", "번호를 저장하다", "Let me save your number now.", "지금 번호 저장할게요."),
        ln("on the fridge", "냉장고에", "The list is on the fridge.", "목록은 냉장고에 붙어 있어요."),
      ],
      [
        t("Before we go, any questions?", "나가기 전에 질문 있어요?", "비상시엔 누구한테 전화하는지 물어보세요", "Yes. Who should I call in case of an emergency?", ["in case of an emergency", "emergency"]),
        t("Call me first. If you can't reach us, call Grandma.", "저한테 먼저요. 연락 안 되면 할머니한테요.", "지금 두 분 번호를 저장하겠다고 하세요", "Okay. Let me save both numbers now.", ["save both numbers", "save"]),
        t("Great. The list is on the fridge too.", "좋아요. 목록은 냉장고에도 있어요.", "아주 심각하면 000에 전화하는 거 맞는지 확인하세요", "Thanks. And for anything serious, Triple Zero, right?", ["Triple Zero", "000"]),
      ],
      o("Exactly. You're well prepared.", "맞아요. 준비 철저하네요.")),

    L("8", 1, "🏫", "어린이집 첫 출근", "룸 리더에게 인사하기·할 일 묻기", "룸 리더 Kylie",
      [
        ln("casual educator", "캐주얼 교사", "Hi, I'm the casual educator for today.", "안녕하세요, 오늘 캐주얼 교사로 왔어요.", "호주 어린이집 교사를 educator라고 해요."),
        ln("Which room", "어느 반", "Which room am I in today?", "오늘 저 어느 반이에요?"),
        ln("the toddler room", "토들러 반", "You're in the toddler room with me.", "저랑 같이 토들러 반이에요."),
        ln("WWCC", "아동 관련 업무 확인증", "Have you got your WWCC card with you?", "WWCC 카드 가지고 왔어요?", "아동 관련 일엔 Working With Children Check가 필수예요."),
        ln("keep ratios", "교사 대 아동 비율을 맞추다", "Stay in the room so we keep ratios.", "비율 맞춰야 하니 교실 안에 있어 줘요."),
      ],
      [
        t("Hi! Are you the casual today?", "안녕하세요! 오늘 캐주얼 선생님이에요?", "네, 캐주얼 교사라고 하고 어느 반인지 물어보세요", "Yes, I'm the casual educator. Which room am I in?", ["Which room", "casual educator"]),
        t("You're in the toddler room with me. Got your WWCC?", "저랑 토들러 반이에요. WWCC 있어요?", "네, 여기 있다고 하세요", "Yes, here's my WWCC card.", ["WWCC", "here it is"]),
        t("Great. Just stay in the room so we keep ratios.", "좋아요. 비율 맞게 교실에 있어 줘요.", "알겠다고 하고 먼저 뭘 할지 물어보세요", "No worries. What should I do first?", ["What should I do first", "do first"]),
      ],
      o("Set up the playdough table. Thanks!", "플레이도우 테이블 좀 차려 줘요. 고마워요!")),

    L("9", 1, "👋", "등원 맞이하기", "부모님께 아이 상태 묻기·작별 인사 돕기", "엄마 Rachel",
      [
        ln("Drop-off", "등원", "Drop-off is between 7 and 9.", "등원은 7시에서 9시 사이예요."),
        ln("How was her night", "밤에 어땠어요", "Morning! How was her night?", "안녕하세요! 밤에 어땠어요?"),
        ln("didn't sleep much", "잠을 별로 못 잤다", "She didn't sleep much, so she's tired.", "잠을 별로 못 자서 피곤해해요."),
        ln("wave bye", "손 흔들어 인사하다", "Let's wave bye to Mummy at the window.", "창문에서 엄마한테 손 흔들어 인사하자."),
        ln("give you a call", "전화드리다", "We'll give you a call if anything comes up.", "무슨 일 있으면 전화드릴게요."),
      ],
      [
        t("Morning! Ruby's a bit clingy today.", "안녕하세요! 루비가 오늘 좀 안 떨어지려 해요.", "인사하고 밤에 어땠는지 물어보세요", "Morning! How was her night?", ["How was her night", "her night"]),
        t("She didn't sleep much, sorry.", "잠을 별로 못 잤어요, 미안해요.", "괜찮다고 하고 무슨 일 있으면 전화드리겠다고 하세요", "No worries. We'll give you a call if anything comes up.", ["give you a call", "call you"]),
        t("Thanks. Bye, Ruby!", "고마워요. 루비, 안녕!", "루비에게 창문에서 엄마한테 손 흔들자고 하세요", "Ruby, let's wave bye to Mummy!", ["wave bye", "say bye"]),
      ],
      o("Bye, sweetie! Love you!", "안녕, 우리 딸! 사랑해!")),

    // ───────── STEP 2 하루 일과 루틴 ─────────
    L("10", 2, "⏰", "아침 등교 준비", "깨우기·교복 입히기·이 닦이기", "아이 Mia (7살)",
      [
        ln("Rise and shine", "일어날 시간이야", "Rise and shine, Mia! Time for school.", "미아, 일어나! 학교 갈 시간이야."),
        ln("Five more minutes", "5분만 더", "Five more minutes, please!", "5분만 더요!"),
        ln("school uniform", "교복", "Let's put on your school uniform.", "교복 입자.", "호주 초등학교는 대부분 교복을 입어요."),
        ln("brush your teeth", "이를 닦다", "Go brush your teeth, then we'll do your hair.", "가서 이 닦아, 그다음에 머리 묶자."),
        ln("We're running late", "우리 늦었어", "Quick, shoes on! We're running late.", "빨리 신발 신어! 우리 늦었어."),
      ],
      [
        t("Mmm... five more minutes.", "음... 5분만 더.", "일어나라고, 학교 갈 시간이라고 하세요", "Rise and shine! It's time for school.", ["Rise and shine", "time for school"]),
        t("Okay, okay. What do I wear?", "알았어, 알았어. 뭐 입어?", "교복 입자고 하세요", "Your school uniform, please.", ["school uniform", "uniform"]),
        t("Done! Can I watch TV?", "다 입었어! TV 봐도 돼?", "아직 안 된다고, 먼저 이부터 닦으라고 하세요", "Not yet. Go brush your teeth first.", ["brush your teeth", "teeth"]),
      ],
      o("Fine... but can you do my hair after?", "알았어... 근데 머리 묶어 줄 거지?")),

    L("11", 2, "🎒", "학교 데려다주기", "도시락·모자 챙기기·교문에서 인사하기", "아이 Mia",
      [
        ln("lunchbox", "도시락", "Have you got your lunchbox and drink bottle?", "도시락이랑 물병 챙겼어?"),
        ln("No hat, no play", "모자 없으면 밖에서 못 놀아", "Don't forget your hat. No hat, no play!", "모자 잊지 마. 모자 없으면 밖에서 못 놀아!", "호주 학교의 실제 규칙이에요."),
        ln("hold my hand", "손잡다", "Hold my hand when we cross the road.", "길 건널 땐 손잡자."),
        ln("Have a great day", "좋은 하루 보내", "Have a great day, sweetie!", "좋은 하루 보내!"),
        ln("pick you up", "데리러 오다", "I'll pick you up at the gate at 3.", "3시에 교문으로 데리러 올게."),
      ],
      [
        t("I'm ready to go!", "갈 준비 됐어!", "도시락이랑 물병 챙겼는지 물어보세요", "Great! Got your lunchbox and drink bottle?", ["lunchbox", "drink bottle"]),
        t("Yep! Oh, I forgot my hat.", "응! 아, 모자 깜빡했다.", "가서 챙기라고, 모자 없으면 못 논다고 하세요", "Go grab it. No hat, no play!", ["No hat, no play", "grab it"]),
        t("Got it! Bye!", "챙겼어! 안녕!", "좋은 하루 보내라고, 3시에 데리러 오겠다고 하세요", "Have a great day! I'll pick you up at 3.", ["pick you up", "Have a great day"]),
      ],
      o("Okay! Bye, Yuna!", "응! 안녕, 유나!")),

    L("12", 2, "🚸", "하교 픽업", "학교 어땠는지 묻기·안전벨트 매게 하기", "아이 Mia",
      [
        ln("How was school", "학교 어땠어", "Hey Mia! How was school today?", "미아! 오늘 학교 어땠어?"),
        ln("I'm starving", "배고파 죽겠어", "I'm starving! What's for afternoon tea?", "배고파 죽겠어! 간식 뭐야?", "호주에선 오후 간식을 afternoon tea라고 해요."),
        ln("What did you do", "뭐 했어", "What did you do at lunchtime?", "점심시간에 뭐 했어?"),
        ln("in the car", "차에", "I've got a snack for you in the car.", "차에 간식 있어."),
        ln("buckle up", "안전벨트를 매다", "Hop in and buckle up.", "타서 안전벨트 매."),
      ],
      [
        t("Yuna! Over here!", "유나! 여기야!", "반갑게 오늘 학교 어땠는지 물어보세요", "Hey Mia! How was school?", ["How was school", "your day"]),
        t("Good! We had sport. I'm starving!", "좋았어! 체육 했어. 배고파 죽겠어!", "차에 간식 있다고 하세요", "There's a snack for you in the car.", ["in the car", "a snack"]),
        t("Yay! Can I sit in the front?", "야호! 앞자리 앉아도 돼?", "미안하지만 뒷자리라고, 타서 안전벨트 매라고 하세요", "Sorry, back seat. Hop in and buckle up.", ["buckle up", "seatbelt"]),
      ],
      o("Okay. Can we listen to music?", "알았어. 음악 들어도 돼?")),

    L("13", 2, "📚", "숙제 도와주기", "읽기 숙제 같이 하기·칭찬하기", "아이 Mia",
      [
        ln("homework time", "숙제 시간", "Okay, homework time! Grab your reader.", "자, 숙제 시간! 읽기 책 가져와."),
        ln("sound it out", "소리 내서 읽어 보다", "Let's sound it out together.", "같이 소리 내서 읽어 보자."),
        ln("I'm stuck", "막혔어", "I'm stuck on this word.", "이 단어에서 막혔어."),
        ln("You're doing great", "잘하고 있어", "You're doing great, keep going!", "잘하고 있어, 계속해 봐!"),
        ln("reading log", "독서 기록장", "Can you sign my reading log?", "독서 기록장에 사인해 줄래요?", "호주 초등학생 숙제로 흔해요."),
      ],
      [
        t("Do I have to do homework?", "숙제 꼭 해야 돼?", "숙제 시간이라고, 읽기 책 가져오라고 하세요", "Yep, homework time! Grab your reader.", ["homework time", "grab your reader"]),
        t("Hmm, this one's hard. What's this word?", "음, 이거 어려워. 이 단어 뭐야?", "같이 소리 내서 읽어 보자고 하세요", "Let's sound it out together.", ["sound it out", "together"]),
        t("C-a-t... cat!", "C-a-t... 캣!", "잘하고 있다고 칭찬하세요", "Yes! You're doing great.", ["doing great", "well done"]),
      ],
      o("Can you sign my reading log now?", "이제 독서 기록장에 사인해 줄래?")),

    L("14", 2, "🍝", "저녁 먹이기", "채소 먹게 달래기·식탁 정리시키기", "아이 Leo",
      [
        ln("Dinner's ready", "저녁 다 됐어", "Dinner's ready! Wash your hands, please.", "저녁 다 됐어! 손 씻고 와."),
        ln("I don't like broccoli", "브로콜리 싫어", "Yuck, I don't like broccoli.", "으, 브로콜리 싫어."),
        ln("Just try one bite", "한 입만 먹어 봐", "Just try one bite for me.", "한 입만 먹어 봐."),
        ln("you can leave the table", "자리에서 일어나도 돼", "When you're finished, you can leave the table.", "다 먹으면 자리에서 일어나도 돼."),
        ln("put your plate in the sink", "접시를 싱크대에 넣다", "Can you put your plate in the sink?", "접시 싱크대에 넣어 줄래?"),
      ],
      [
        t("What's for dinner?", "저녁 뭐야?", "스파게티라고, 저녁 다 됐으니 손 씻으라고 하세요", "Spaghetti! Dinner's ready, so wash your hands.", ["Dinner's ready", "wash your hands"]),
        t("Yuck, there's broccoli!", "으, 브로콜리 있어!", "한 입만 먹어 보라고 하세요", "Just try one bite for me, please.", ["try one bite", "one bite"]),
        t("Okay... I'm finished!", "알았어... 다 먹었어!", "잘했다고 하고 접시를 싱크대에 넣어 달라고 하세요", "Good job! Can you put your plate in the sink?", ["plate in the sink", "your plate"]),
      ],
      o("Done! Can I have dessert now?", "했어! 이제 디저트 먹어도 돼?")),

    L("15", 2, "🛁", "목욕하고 재우기", "목욕시키기·잠옷 입히기·책 읽어 주기", "아이 Leo",
      [
        ln("bath time", "목욕 시간", "Toys away, it's bath time!", "장난감 정리하자, 목욕 시간이야!"),
        ln("put your PJs on", "잠옷을 입다", "Dry off and put your PJs on.", "물기 닦고 잠옷 입어.", "잠옷(pyjamas)을 줄여서 PJs라고 해요."),
        ln("one more story", "한 권만 더", "Can I have one more story?", "책 한 권만 더 읽어 줘?"),
        ln("lights out", "불 끌 시간", "Okay, one story, then lights out.", "좋아, 한 권 읽고 불 끄자."),
        ln("Night night", "잘 자", "Night night, Leo. See you tomorrow.", "잘 자, 레오. 내일 봐."),
      ],
      [
        t("I don't want a bath!", "목욕 싫어!", "장난감 정리하자고, 목욕 시간이라고 하세요", "Toys away, buddy. It's bath time!", ["bath time", "time for a bath"]),
        t("Okay. Now what?", "알았어. 이제 뭐 해?", "물기 닦고 잠옷 입으라고 하세요", "Now dry off and put your PJs on.", ["PJs", "pyjamas"]),
        t("Can I have one more story?", "책 한 권만 더 읽어 줘?", "딱 한 권 읽고 불 끄자고 하세요", "Okay, one more story, then lights out.", ["lights out", "bedtime"]),
      ],
      o("Night night, Yuna.", "잘 자, 유나.")),

    // ───────── STEP 3 부모님 요청·집 규칙 ─────────
    L("2", 3, "🍎", "간식·스크린 타임 규칙", "간식 종류·스크린 타임 묻기", "부모",
      [
        ln("after school", "하교 후에", "They can have a snack after school.", "하교 후에 간식 줘도 돼요."),
        ln("No lollies", "사탕은 안 돼요", "Fruit or crackers are fine. No lollies.", "과일이나 크래커는 괜찮아요. 사탕은 안 돼요.", "호주에선 사탕을 lollies라고 해요."),
        ln("screen time", "스크린 타임", "How much screen time can they have?", "스크린 타임은 얼마나 돼요?"),
        ln("one hour max", "최대 한 시간", "One hour max on school days.", "학교 가는 날엔 최대 한 시간이에요."),
        ln("Is it okay if", "~해도 괜찮을까요", "Is it okay if they watch Bluey?", "블루이 봐도 괜찮을까요?", "블루이는 호주 국민 만화예요."),
      ],
      [
        t("They can have a snack after school.", "하교 후에 간식 줘도 돼요.", "어떤 간식이 괜찮은지 물어보세요", "What snacks are okay?", ["what snacks", "snack"]),
        t("Fruit or crackers. No lollies.", "과일이나 크래커요. 사탕은 안 돼요.", "스크린 타임은 얼마나 되는지 물어보세요", "Got it. How much screen time can they have?", ["screen time", "how much"]),
        t("One hour, max.", "최대 한 시간이요.", "최대 한 시간으로 하겠다고 하세요", "Okay, one hour max.", ["one hour", "max"]),
      ],
      o("Perfect.", "좋아요.")),

    L("16", 3, "🥜", "알레르기 확인", "견과류 알레르기·에피펜 위치 묻기", "엄마 Claire",
      [
        ln("allergic to nuts", "견과류 알레르기가 있다", "Leo is allergic to nuts.", "레오는 견과류 알레르기가 있어요."),
        ln("EpiPen", "에피펜", "Where do you keep his EpiPen?", "에피펜은 어디 두세요?", "알레르기 쇼크 때 쓰는 주사예요."),
        ln("check the label", "라벨을 확인하다", "I'll always check the label first.", "항상 라벨부터 확인할게요."),
        ln("may contain traces", "미량 함유 가능", "No snacks that say 'may contain traces of nuts'.", "'견과류 미량 함유 가능'이라고 적힌 간식은 안 돼요."),
        ln("action plan", "응급 대응 계획서", "His action plan is on the fridge.", "응급 대응 계획서는 냉장고에 있어요."),
      ],
      [
        t("One important thing: Leo is allergic to nuts.", "중요한 거 하나요. 레오는 견과류 알레르기가 있어요.", "에피펜은 어디 두는지 물어보세요", "Okay. Where do you keep his EpiPen?", ["EpiPen", "Where do you keep"]),
        t("In his backpack, always. The action plan is on the fridge.", "항상 가방에요. 응급 대응 계획서는 냉장고에 있어요.", "간식 주기 전에 항상 라벨을 확인하겠다고 하세요", "Got it. I'll always check the label before snacks.", ["check the label", "read the label"]),
        t("Thanks. Even 'may contain traces' is a no.", "고마워요. '미량 함유 가능'도 안 돼요.", "알겠다고, 그런 것도 안 주겠다고 하세요", "Understood. I won't give him those either.", ["won't give him", "not give him"]),
      ],
      o("Thank you. That's a big relief.", "고마워요. 정말 마음이 놓여요.")),

    L("17", 3, "🛝", "공원 데려가기", "물·선크림 챙기기·귀가 시간 정하기", "아빠 Tom",
      [
        ln("take them to the park", "공원에 데려가다", "Could you take them to the park this arvo?", "오늘 오후에 애들 공원에 데려가 줄래요?", "arvo = afternoon (호주 구어)"),
        ln("Slip, slop, slap", "옷 입고·선크림 바르고·모자 쓰기", "Slip, slop, slap before you go!", "나가기 전에 옷, 선크림, 모자 챙겨요!", "호주 자외선 차단 캠페인 구호예요."),
        ln("Be back by", "~까지 돌아오다", "Be back by 5 for dinner, please.", "저녁 먹게 5시까지 돌아와 줘요."),
        ln("water bottles", "물병", "I'll pack water bottles and a snack.", "물병이랑 간식 챙길게요."),
        ln("stay where I can see you", "내 눈에 보이는 곳에 있어", "Stay where I can see you, okay?", "내 눈에 보이는 데 있어, 알았지?"),
      ],
      [
        t("Could you take them to the park this arvo?", "오늘 오후에 애들 공원에 데려가 줄래요?", "좋다고 하고 물병이랑 간식 챙기겠다고 하세요", "Sure! I'll pack water bottles and a snack.", ["water bottles", "pack"]),
        t("Great. Sunscreen's by the door.", "좋아요. 선크림은 문 옆에 있어요.", "선크림 바르고 모자 씌우겠다고 하세요", "Thanks. I'll put sunscreen and hats on them.", ["sunscreen", "hats"]),
        t("And be back by 5 for dinner.", "그리고 저녁 먹게 5시까지 와요.", "5시까지 돌아오겠다고 하세요", "No worries, we'll be back by 5.", ["back by 5", "by 5"]),
      ],
      o("Perfect. Have fun, guys!", "좋아요. 다들 재밌게 놀아!")),

    L("18", 3, "🏊", "수영 강습 데려가기", "카시트 확인하기·출발 시간 정하기", "엄마 Claire",
      [
        ln("swimming lessons", "수영 강습", "Mia has swimming lessons at 4:30.", "미아는 4시 반에 수영 강습이 있어요.", "호주 아이들은 거의 다 수영을 배워요."),
        ln("car seat", "카시트", "Is Leo's car seat already in the car?", "레오 카시트는 차에 있어요?"),
        ln("Are you okay driving", "운전 괜찮아요", "Are you okay driving my car?", "제 차 운전해도 괜찮겠어요?"),
        ln("driving on the left", "좌측 통행 운전", "I'm used to driving on the left now.", "이제 좌측 통행 운전에 익숙해요."),
        ln("swim bag", "수영 가방", "Her swim bag is by the front door.", "수영 가방은 현관 옆에 있어요."),
      ],
      [
        t("Mia has swimming lessons at 4:30. Are you okay driving?", "미아 4시 반 수영 강습이에요. 운전 괜찮아요?", "네, 이제 좌측 통행에 익숙하다고 하세요", "Yes, I'm used to driving on the left.", ["on the left", "used to driving"]),
        t("Great. Her swim bag is by the door.", "좋아요. 수영 가방은 문 옆에 있어요.", "레오 카시트는 차에 있는지 물어보세요", "Thanks. Is Leo's car seat in the car?", ["car seat", "booster"]),
        t("Yep, it's all set up.", "네, 다 설치돼 있어요.", "4시 10분에 출발하겠다고 하세요", "Great. We'll leave at 4:10.", ["leave at 4:10", "leave"]),
      ],
      o("Thanks! Text me when you get there.", "고마워요! 도착하면 문자 줘요.")),

    L("19", 3, "💬", "부모님께 문자로 보고", "하루 소식 짧게 전하기·사진 보내기", "엄마 Claire (문자)",
      [
        ln("quick update", "간단한 소식", "Just a quick update: all good here!", "간단히 소식 전해요. 여긴 다 좋아요!"),
        ln("had a big nap", "낮잠을 푹 잤다", "Leo had a big nap after lunch.", "레오는 점심 먹고 낮잠 푹 잤어요."),
        ln("ate all his lunch", "점심을 다 먹었다", "He ate all his lunch, too.", "점심도 다 먹었어요."),
        ln("send me a photo", "사진을 보내 주다", "Aww! Can you send me a photo?", "어머! 사진 보내 줄래요?"),
        ln("home by", "~까지 집에", "I'll be home by 6:30.", "6시 반까지 집에 갈게요."),
      ],
      [
        t("Hi Yuna! How are the kids?", "유나! 애들 어때요?", "간단히 소식 전하며 다 좋다고 하세요", "Just a quick update: all good here!", ["quick update", "all good"]),
        t("Yay! Did Leo sleep?", "다행이다! 레오는 잤어요?", "점심 먹고 낮잠 푹 잤다고 하세요", "Yes, he had a big nap after lunch.", ["had a big nap", "nap"]),
        t("Aww! Can you send me a photo?", "어머! 사진 보내 줄래요?", "지금 바로 보내겠다고 하세요", "Sure, sending one now!", ["sending one now", "send"]),
      ],
      o("So cute! See you at 6:30.", "너무 귀여워요! 6시 반에 봐요.")),

    L("20", 3, "⏳", "늦게까지 봐 달라는 부탁", "가능한 시간 말하기·시급 확인하기", "아빠 Tom (전화)",
      [
        ln("stay a bit later", "조금 더 늦게까지 있다", "Could you stay a bit later tonight?", "오늘 밤 조금 더 늦게까지 있어 줄 수 있어요?"),
        ln("stuck at work", "일 때문에 못 빠져나오다", "Sorry, I'm stuck at work.", "미안해요, 일 때문에 못 빠져나가요."),
        ln("How late", "얼마나 늦게", "How late do you think you'll be?", "얼마나 늦으실 것 같아요?"),
        ln("the same hourly rate", "같은 시급", "Is that the same hourly rate?", "시급은 똑같은 거죠?"),
        ln("I can stay until", "~까지 있을 수 있어요", "I can stay until 9, no problem.", "9시까지는 있을 수 있어요, 문제없어요."),
      ],
      [
        t("Hi Yuna, sorry, I'm stuck at work. Could you stay a bit later?", "유나, 미안해요. 일 때문에 못 나가요. 좀 늦게까지 있어 줄래요?", "괜찮다고 하고 얼마나 늦으실지 물어보세요", "That's fine. How late do you think you'll be?", ["How late", "what time"]),
        t("Maybe 8:30?", "8시 반쯤이요?", "9시까지 있을 수 있다고 하세요", "No problem. I can stay until 9.", ["stay until 9", "until 9"]),
        t("You're a lifesaver. I'll pay you for the extra time.", "정말 살았어요. 추가 시간도 드릴게요.", "같은 시급인지 확인하세요", "Thanks! Is that the same hourly rate?", ["hourly rate", "same rate"]),
      ],
      o("Of course. Actually, I'll add a bit extra.", "물론이죠. 사실 좀 더 얹어 드릴게요.")),

    // ───────── STEP 4 다침·떼쓰기·안전 ─────────
    L("3", 4, "🧒", "다투는 아이들", "말로 하자고 달래고 칭찬하기", "아이",
      [
        ln("He took my toy", "쟤가 내 장난감 가져갔어", "Hey! He took my toy!", "야! 쟤가 내 장난감 가져갔어!"),
        ln("use your words", "말로 하다", "No grabbing. Use your words, please.", "뺏지 말고 말로 하자."),
        ln("how you feel", "기분이 어떤지", "Can you tell him how you feel?", "기분이 어떤지 말해 볼래?"),
        ln("take turns", "차례대로 하다", "Let's take turns. Two minutes each.", "차례대로 하자. 2분씩."),
        ln("be gentle", "살살 하다", "Be gentle with your little brother.", "동생한테 살살 해."),
      ],
      [
        t("He took my toy!", "쟤가 내 장난감 가져갔어!", "말로 하자고, 기분을 말해 보라고 하세요", "Okay, use your words. Tell him how you feel.", ["use your words", "how you feel"]),
        t("I'm sad.", "슬퍼.", "같이 나눠 쓰고 살살 하자고 하세요", "Let's share, and be gentle with each other.", ["be gentle", "share"]),
        t("Okay, sorry.", "알았어, 미안해.", "잘했다고 칭찬하세요", "Good job!", ["good job", "well done"]),
      ],
      o("Can we play now?", "이제 놀아도 돼?")),

    L("4", 4, "🩹", "아이가 넘어졌을 때", "부모에게 전화로 상황 알리기", "부모 (전화)",
      [
        ln("fell over", "넘어졌다", "Mia fell over at the park.", "미아가 공원에서 넘어졌어요."),
        ln("hurt her knee", "무릎을 다쳤다", "She hurt her knee on the slide.", "미끄럼틀에서 무릎을 다쳤어요."),
        ln("put a band-aid on", "밴드를 붙이다", "I cleaned it and put a band-aid on.", "닦고 밴드 붙였어요.", "호주에선 밴드를 band-aid라고 해요."),
        ln("keep an eye on her", "계속 지켜보다", "I'll keep an eye on her this arvo.", "오늘 오후 계속 지켜볼게요."),
        ln("Is everything okay", "별일 없죠", "Hello? Is everything okay?", "여보세요? 별일 없죠?"),
      ],
      [
        t("Hello? Is everything okay?", "여보세요? 별일 없죠?", "미아가 넘어져서 무릎을 다쳤다고 하세요", "Hi, Mia fell over and hurt her knee.", ["hurt her knee", "fell over"]),
        t("Oh no! Is she okay?", "저런! 괜찮아요?", "괜찮다고, 닦고 밴드를 붙였다고 하세요", "She's okay. I cleaned it and put a band-aid on.", ["band-aid", "she's okay"]),
        t("Thank you for letting me know.", "알려 줘서 고마워요.", "계속 지켜보겠다고 하세요", "No worries. I'll keep an eye on her.", ["keep an eye on her", "watch her"]),
      ],
      o("Thanks. See you at 6.", "고마워요. 6시에 봐요.")),

    L("21", 4, "😭", "마트에서 떼쓸 때", "침착하게 안 된다고 하기·선택지 주기", "아이 Leo",
      [
        ln("I want it", "그거 갖고 싶어", "I want it! I want it now!", "그거 갖고 싶어! 지금 당장!"),
        ln("not today", "오늘은 안 돼", "I know you want it, but not today.", "갖고 싶은 거 아는데, 오늘은 안 돼."),
        ln("take a deep breath", "숨을 크게 쉬다", "Let's take a deep breath together.", "같이 숨 크게 쉬어 보자."),
        ln("You can choose", "네가 고를 수 있어", "You can choose an apple or a banana.", "사과나 바나나 중에 고를 수 있어."),
        ln("push the trolley", "카트를 밀다", "Can you be my big helper and push the trolley?", "큰 도우미가 돼서 카트 밀어 줄래?", "호주에선 마트 카트를 trolley라고 해요."),
      ],
      [
        t("I want the chocolate! I want it now!", "초콜릿 갖고 싶어! 지금!", "갖고 싶은 건 알지만 오늘은 안 된다고 하세요", "I know you want it, buddy, but not today.", ["not today", "no chocolate"]),
        t("(crying) It's not fair!", "(울면서) 불공평해!", "알겠다고 하고 같이 숨 크게 쉬어 보자고 하세요", "I know. Let's take a deep breath together.", ["deep breath", "calm down"]),
        t("(sniff) Okay...", "(훌쩍) 알았어...", "잘했다고 하고 사과나 바나나 중에 고를 수 있다고 하세요", "Good job. You can choose an apple or a banana.", ["You can choose", "apple or a banana"]),
      ],
      o("Banana. Can I push the trolley?", "바나나. 카트 밀어도 돼?")),

    L("22", 4, "🔍", "공원에서 아이가 안 보일 때", "인상착의 말하기·주변에 도움 청하기", "공원에 있던 사람",
      [
        ln("I can't find", "~를 못 찾겠어요", "Excuse me, I can't find the boy I'm looking after.", "실례합니다, 제가 돌보는 남자아이를 못 찾겠어요."),
        ln("He's wearing", "~를 입고 있어요", "He's wearing a red hat and blue shorts.", "빨간 모자에 파란 반바지 입고 있어요."),
        ln("Have you seen", "~를 보셨어요", "Have you seen a little boy, about five?", "다섯 살쯤 된 남자아이 보셨어요?"),
        ln("near the toilets", "화장실 근처에서", "I think I saw him near the toilets.", "화장실 근처에서 본 것 같아요."),
        ln("stay with me", "내 옆에 있다", "Leo! Please stay with me from now on.", "레오! 이제부터 내 옆에 꼭 있어."),
      ],
      [
        t("Are you alright? You look worried.", "괜찮아요? 걱정스러워 보여요.", "제가 돌보는 아이를 못 찾겠다고 하세요", "I can't find the boy I'm looking after.", ["I can't find", "can't find"]),
        t("Oh no. What does he look like?", "저런. 어떻게 생겼어요?", "다섯 살이고 빨간 모자에 파란 반바지라고 하세요", "He's five. He's wearing a red hat and blue shorts.", ["red hat", "He's wearing"]),
        t("I think I saw him near the toilets.", "화장실 근처에서 본 것 같아요.", "정말 고맙다고 하고 바로 가 보겠다고 하세요", "Thank you so much! I'll go check now.", ["go check", "thank you"]),
      ],
      o("There he is, by the tap! Phew.", "저기 있네요, 수돗가 옆에! 휴.")),

    L("23", 4, "🤒", "아이가 열이 날 때", "체온 알리기·해열제 허락 받기", "엄마 Claire (전화)",
      [
        ln("feeling hot", "몸이 뜨겁다", "Mia's feeling hot and really tired.", "미아가 몸이 뜨겁고 많이 처져요."),
        ln("took her temperature", "체온을 쟀다", "I took her temperature. It's 38.5.", "체온 쟀는데 38.5도예요."),
        ln("give her Panadol", "파나돌을 먹이다", "Can I give her Panadol?", "파나돌 먹여도 될까요?", "호주의 흔한 해열제예요. 꼭 부모 허락 받기."),
        ln("plenty of water", "물을 충분히", "Make sure she drinks plenty of water.", "물 충분히 마시게 해 주세요."),
        ln("come home early", "일찍 집에 오다", "I'll try to come home early.", "일찍 들어가 볼게요."),
      ],
      [
        t("Hi Yuna, what's up?", "유나, 무슨 일이에요?", "미아가 몸이 뜨겁고 많이 처진다고 하세요", "Hi Claire. Mia's feeling hot and really tired.", ["feeling hot", "hot"]),
        t("Oh no. Did you check her temperature?", "저런. 체온 재 봤어요?", "쟀는데 38.5도라고 하세요", "Yes, I took her temperature. It's 38.5.", ["temperature", "38.5"]),
        t("Okay. Kids' Panadol is in the top drawer.", "알겠어요. 어린이 파나돌은 맨 위 서랍에 있어요.", "지금 파나돌 먹여도 되는지 확인하세요", "So I can give her Panadol now?", ["give her Panadol", "Panadol"]),
        t("Yes, the dose is on the box. I'll come home early.", "네, 용량은 상자에 있어요. 일찍 갈게요.", "알겠다고 하고 물을 충분히 마시게 하겠다고 하세요", "Okay. I'll make sure she has plenty of water.", ["plenty of water", "water"]),
      ],
      o("Thank you. See you soon.", "고마워요. 곧 봐요.")),

    L("24", 4, "🚫", "모르는 사람이 데리러 왔을 때", "신분증 확인하기·엄마에게 전화하기", "데리러 온 남성",
      [
        ln("I'm here to pick up", "데리러 왔어요", "Hi, I'm here to pick up Ruby.", "안녕하세요, 루비 데리러 왔어요."),
        ln("authorised list", "승인된 명단", "Sorry, you're not on the authorised list.", "죄송하지만 승인된 명단에 안 계세요.", "명단에 없으면 아이를 보내면 안 돼요."),
        ln("some ID", "신분증", "Can I see some ID, please?", "신분증 좀 보여 주시겠어요?"),
        ln("call her mum", "아이 엄마에게 전화하다", "I'll just call her mum to check.", "확인차 엄마한테 잠깐 전화할게요."),
        ln("I'm her uncle", "제가 삼촌이에요", "I'm her uncle. Her mum asked me.", "제가 삼촌이에요. 엄마가 부탁했어요."),
      ],
      [
        t("Hi, I'm here to pick up Ruby.", "안녕하세요, 루비 데리러 왔어요.", "신분증을 보여 달라고 하세요", "Hi. Can I see some ID, please?", ["some ID", "your ID"]),
        t("Sure. I'm her uncle, Mark.", "네. 삼촌 마크예요.", "고맙다고 하고 죄송하지만 승인된 명단에 없다고 하세요", "Thanks. Sorry, you're not on the authorised list.", ["authorised list", "not on the list"]),
        t("Her mum asked me this morning.", "오늘 아침에 엄마가 부탁했어요.", "확인차 엄마한테 전화하겠다고 하세요", "No problem. I'll just call her mum to check.", ["call her mum", "call Mum"]),
      ],
      o("Fair enough. Better safe than sorry.", "그렇죠. 조심해서 나쁠 거 없죠.")),

    // ───────── STEP 5 바쁜 하루·조율·인계 ─────────
    L("25", 5, "🏠", "부모님 귀가 후 하루 보고", "숙제·낮잠·특이 사항 전하기", "엄마 Claire",
      [
        ln("How did they go", "애들 어땠어요", "I'm home! How did they go today?", "나 왔어요! 오늘 애들 어땠어요?", "호주에선 How did ~ go?로 결과를 물어요."),
        ln("They were great", "아주 잘 지냈어요", "They were great. No dramas at all.", "아주 잘 지냈어요. 별일 하나 없었어요."),
        ln("a bit grumpy", "좀 짜증스러운", "Leo was a bit grumpy before his nap.", "레오가 낮잠 전에 좀 짜증을 냈어요."),
        ln("finished her homework", "숙제를 끝냈다", "Mia finished her homework before dinner.", "미아는 저녁 전에 숙제 끝냈어요."),
        ln("we're out of", "~가 다 떨어졌어요", "Just so you know, we're out of milk.", "참고로 우유 다 떨어졌어요."),
      ],
      [
        t("I'm home! How did they go?", "나 왔어요! 애들 어땠어요?", "아주 잘 지냈다고, 별일 없었다고 하세요", "They were great. No dramas at all.", ["They were great", "really good"]),
        t("Love that. Did Mia do her homework?", "좋네요. 미아는 숙제 했어요?", "저녁 전에 숙제 끝냈다고 하세요", "Yes, she finished her homework before dinner.", ["finished her homework", "homework"]),
        t("Amazing. Anything else?", "최고예요. 다른 건요?", "레오가 낮잠 전에 좀 짜증 냈고, 우유가 떨어졌다고 하세요", "Leo was a bit grumpy before his nap. And we're out of milk.", ["a bit grumpy", "out of milk"]),
      ],
      o("Thanks for the heads-up. See you tomorrow!", "알려 줘서 고마워요. 내일 봐요!")),

    L("26", 5, "👶", "형제 동시에 돌보기", "아기 기저귀 갈며 큰아이 기다리게 하기", "아이 Mia",
      [
        ln("Give me one sec", "잠깐만", "Give me one sec, Mia. The baby's crying.", "미아, 잠깐만. 아기가 울어."),
        ln("change her nappy", "기저귀를 갈다", "I just need to change her nappy.", "기저귀만 얼른 갈게.", "호주에선 기저귀를 nappy라고 해요."),
        ln("grab a wipe", "물티슈를 가져오다", "Can you help me and grab a wipe?", "물티슈 하나 갖다줄래?"),
        ln("be right with you", "금방 가다", "I'll be right with you, I promise.", "금방 갈게, 약속해."),
        ln("Thanks for waiting", "기다려 줘서 고마워", "Thanks for waiting so nicely.", "얌전히 기다려 줘서 고마워."),
      ],
      [
        t("Yuna! Can you help me with my puzzle?", "유나! 퍼즐 좀 도와줄래?", "잠깐만, 아기가 운다고 하세요", "Give me one sec, Mia. The baby's crying.", ["one sec", "just a minute"]),
        t("But I need help now!", "근데 지금 도와줘야 돼!", "기저귀만 갈고 금방 가겠다고 하세요", "I just need to change her nappy. I'll be right with you.", ["change her nappy", "be right with you"]),
        t("Can I help?", "나도 도와줄까?", "좋다고 하고 물티슈 하나 갖다 달라고 하세요", "Yes please! Can you grab a wipe?", ["grab a wipe", "a wipe"]),
        t("Here you go!", "여기!", "기다려 줘서 고맙다고, 이제 퍼즐 하자고 하세요", "Thanks for waiting. Let's do your puzzle now!", ["Thanks for waiting", "your puzzle"]),
      ],
      o("Yay! I'm a good big sister.", "야호! 나 착한 언니지.")),

    L("27", 5, "📝", "어린이집 교대 인계", "낮잠·식사·기록 넘기기", "오후 교사 Chloe",
      [
        ln("quick handover", "간단한 인계", "Can I give you a quick handover before my break?", "쉬는 시간 전에 간단히 인계해도 될까요?"),
        ln("still asleep", "아직 자는 중", "Noah and Ava are still asleep.", "노아랑 에바는 아직 자고 있어요."),
        ln("only ate half", "반만 먹었다", "Ruby only ate half her lunch.", "루비는 점심 반만 먹었어요."),
        ln("changed Noah's nappy", "노아 기저귀를 갈았다", "I changed Noah's nappy at 1:30.", "노아 기저귀는 1시 반에 갈았어요."),
        ln("on the app", "앱에", "Everything's on the app as well.", "앱에도 다 올려 놨어요.", "호주 어린이집은 기록 앱을 많이 써요."),
      ],
      [
        t("Hey, I'm taking over. Anything I need to know?", "안녕, 내가 이어받을게. 알아야 할 거 있어?", "노아랑 에바는 아직 자고 있다고 하세요", "Hi! Noah and Ava are still asleep.", ["still asleep", "sleeping"]),
        t("Okay. How was lunch?", "응. 점심은 어땠어?", "루비가 점심을 반만 먹었다고 하세요", "Good, but Ruby only ate half her lunch.", ["only ate half", "half her lunch"]),
        t("I'll offer her fruit at afternoon tea.", "오후 간식 때 과일 줘 볼게.", "좋다고 하고 앱에도 다 올려 놨다고 하세요", "Good idea. Everything's on the app, too.", ["on the app", "app"]),
      ],
      o("Legend. Enjoy your break!", "최고야. 잘 쉬다 와!")),

    L("28", 5, "📅", "플레이데이트 일정 잡기", "다른 부모와 날짜·장소 정하기", "친구 엄마 Jo",
      [
        ln("playdate", "아이들 놀이 약속", "The girls want a playdate this week.", "애들이 이번 주에 같이 놀고 싶대요."),
        ln("Does Thursday work", "목요일 괜찮으세요", "Does Thursday work for you?", "목요일 괜찮으세요?"),
        ln("our place", "저희 집", "They can come over to our place.", "저희 집으로 오셔도 돼요."),
        ln("drop her off", "데려다주다", "I can drop her off at 3:30.", "3시 반에 데려다줄 수 있어요."),
        ln("check with Mia's mum", "미아 엄마에게 확인하다", "Let me check with Mia's mum first.", "미아 엄마한테 먼저 확인해 볼게요."),
      ],
      [
        t("Hi! Lily keeps asking for a playdate with Mia.", "안녕하세요! 릴리가 미아랑 놀고 싶다고 계속 그래요.", "좋다고 하고 목요일 괜찮은지 물어보세요", "Sounds fun! Does Thursday work for you?", ["Does Thursday work", "Thursday"]),
        t("Thursday's perfect. Where should we do it?", "목요일 좋아요. 어디서 할까요?", "저희 집으로 오시면 된다고 하세요", "Lily can come over to our place.", ["our place", "our house"]),
        t("Great. I can drop her off at 3:30.", "좋아요. 3시 반에 데려다줄게요.", "미아 엄마에게 확인하고 문자 드리겠다고 하세요", "Let me check with Mia's mum and text you.", ["check with Mia's mum", "text you"]),
      ],
      o("Perfect. Talk soon!", "좋아요. 또 연락해요!")),

    L("29", 5, "🍽️", "점심시간 여러 아이 챙기기", "손 씻기기·알레르기 식탁 챙기기·자리 지키기", "룸 리더 Kylie",
      [
        ln("wash their hands", "손을 씻다", "Can you get the kids to wash their hands?", "애들 손 좀 씻겨 줄래요?"),
        ln("allergy table", "알레르기 식탁", "Sam sits at the allergy table, okay?", "샘은 알레르기 식탁에 앉아요, 알겠죠?"),
        ln("Bottoms on chairs", "엉덩이는 의자에", "Bottoms on chairs, everyone!", "다들 엉덩이 의자에 붙이자!", "어린이집에서 매일 쓰는 말이에요."),
        ln("Who needs more", "더 먹을 사람", "Who needs more pasta?", "파스타 더 먹을 사람?"),
        ln("sit with the little ones", "어린 애들 옆에 앉다", "I'll sit with the little ones.", "제가 어린 애들 옆에 앉을게요."),
      ],
      [
        t("Lunch in five! Can you help?", "5분 뒤 점심이에요! 도와줄래요?", "애들 손 씻기겠다고 하세요", "Sure. I'll get the kids to wash their hands.", ["wash their hands", "wash hands"]),
        t("Thanks. Remember, Sam sits at the allergy table.", "고마워요. 샘은 알레르기 식탁인 거 기억해요.", "알겠다고, 샘은 알레르기 식탁이라고 확인하세요", "Got it. Sam's at the allergy table.", ["allergy table", "Sam's table"]),
        t("Perfect. They're getting wriggly.", "좋아요. 애들이 들썩거리네요.", "다들 엉덩이 의자에 붙이라고 하세요", "Okay, everyone! Bottoms on chairs!", ["Bottoms on chairs", "sit down"]),
        t("Ha, nice. I'll serve. Can you supervise?", "하하, 좋아요. 내가 배식할게요. 지켜봐 줄래요?", "어린 애들 옆에 앉겠다고 하세요", "Sure, I'll sit with the little ones.", ["sit with the little ones", "sit with"]),
      ],
      o("Great teamwork. Thanks!", "팀워크 좋네요. 고마워요!")),

    L("30", 5, "🗓️", "쉬는 날·주급 이야기", "오페어 휴무 정하기·주급 지급 방식 묻기", "호스트맘 Emma",
      [
        ln("day off", "쉬는 날", "Can I have Sunday as my day off?", "일요일을 쉬는 날로 해도 될까요?"),
        ln("pocket money", "주급(용돈)", "Is the pocket money paid weekly?", "주급은 매주 주시는 거예요?", "오페어는 숙식과 함께 주급을 받아요."),
        ln("hours a week", "주당 시간", "It's about 30 hours a week.", "일주일에 30시간 정도예요."),
        ln("bank transfer", "계좌 이체", "I'll pay you by bank transfer on Fridays.", "금요일마다 계좌 이체로 드릴게요."),
        ln("sit down and chat", "앉아서 얘기하다", "Can we sit down and chat about my schedule?", "제 일정 관련해서 앉아서 얘기 좀 할까요?"),
      ],
      [
        t("Hey, you wanted to chat?", "얘기하자고 했죠?", "일정 관련해서 앉아서 얘기하자고 하세요", "Yes. Can we sit down and chat about my schedule?", ["sit down and chat", "have a chat"]),
        t("Of course. What's on your mind?", "물론이죠. 무슨 일이에요?", "일요일을 쉬는 날로 해도 되는지 물어보세요", "Could I have Sunday as my day off?", ["day off", "Sunday off"]),
        t("That works. Anything else?", "괜찮아요. 다른 건요?", "주급은 매주 주는지 물어보세요", "Is the pocket money paid weekly?", ["pocket money", "paid weekly"]),
        t("Yep, by bank transfer on Fridays.", "네, 금요일마다 계좌 이체로요.", "좋다고, 정말 고맙다고 하세요", "Perfect. Thanks so much, Emma.", ["Thanks so much", "thank you"]),
      ],
      o("Thanks for asking. Happy to help.", "물어봐 줘서 고마워요. 언제든요.")),
  ],
};

export default curriculum;
