import { L, ln, o, t, type JobCurriculum } from "./kit";

const curriculum: JobCurriculum = {
  steps: ["현장 첫날 기본", "매일 하는 노무 일", "포맨 세부 지시", "위험·사고·안전", "현장 조율·마무리"],
  lessons: [
    // ───────── STEP 1: 현장 첫날 기본 ─────────
    L("1", 1, "👷", "현장 첫날", "자기소개하기·화이트카드·안전화 확인하기", "포맨",
      [
        ln("the new labourer", "새로 온 레이버러", "Hi, I'm the new labourer. I'm Jun.", "안녕하세요, 새로 온 레이버러 준이에요.", "labourer = 현장 잡일 하는 노무자예요."),
        ln("White Card", "화이트카드(건설 안전 교육증)", "Got your White Card on you?", "화이트카드 갖고 있어요?", "호주 건설 현장은 화이트카드 없이는 못 들어가요."),
        ln("steel caps", "안전화", "You can't come on site without steel caps.", "안전화 없이는 현장에 못 들어와요."),
        ln("I'm wearing", "신고 있어요", "Yep, I'm wearing them now.", "네, 지금 신고 있어요."),
        ln("Let's get started", "시작하죠", "Good. Let's get started, then.", "좋아요. 그럼 시작하죠."),
      ],
      [
        t("You the new labourer?", "새로 온 레이버러예요?", "네 그렇다고, 이름도 말하세요", "Yes, I'm the new labourer. I'm Jun.", ["new labourer", "I'm Jun"]),
        t("Got your White Card?", "화이트카드 있어요?", "있다고 하세요", "Yes, I've got my White Card.", ["white card", "got it"]),
        t("Good. And steel caps?", "좋아요. 안전화는요?", "안전화 신고 있다고 하세요", "Yes, I'm wearing my steel caps.", ["steel caps", "safety boots"]),
      ],
      o("Good. Let's get started.", "좋아요. 시작하죠.")),

    L("2", 1, "🤝", "도와 달라는 요청", "무엇을 할지 묻고 안전하게 들기", "포맨",
      [
        ln("give us a hand", "도와주다", "Can you give us a hand with this?", "이것 좀 도와줄래요?", "호주에선 me 대신 us를 자주 써요."),
        ln("What do you need", "뭐가 필요해요", "Sure thing. What do you need?", "그럼요. 뭐가 필요해요?"),
        ln("lift with your legs", "다리 힘으로 들다", "Bend your knees and lift with your legs.", "무릎 굽히고 다리 힘으로 들어요."),
        ln("What's next", "다음은 뭐예요", "All done. What's next, boss?", "다 했어요. 다음은 뭐예요?"),
        ln("Grab a broom", "빗자루를 들다", "Grab a broom and sweep this area.", "빗자루 들고 여기 쓸어요."),
      ],
      [
        t("Can you give us a hand with this?", "이것 좀 도와줄래요?", "그럼요 하고 무엇이 필요한지 물어보세요", "Sure. What do you need?", ["what do you need", "sure"]),
        t("Carry these boards to the truck. Lift with your legs.", "이 판자 트럭으로 옮겨요. 다리 힘으로 들고.", "다리 힘으로 들겠다고 확인하세요", "Okay, I'll lift with my legs.", ["lift with my legs", "lift with your legs"]),
        t("Good on ya.", "잘했어요.", "다 옮겼다고 하고 다음 할 일을 물어보세요", "All done. What's next?", ["what's next", "all done"]),
      ],
      o("Grab a broom, mate.", "빗자루 들어요.")),

    L("6", 1, "📋", "현장 인덕션 받기", "안전 교육 듣고 사인인·비상 집결지 확인하기", "안전 담당 Karen",
      [
        ln("site induction", "현장 안전 교육", "Everyone does a site induction first.", "다들 먼저 현장 안전 교육을 받아요.", "새 현장에 가면 인덕션부터 받아요."),
        ln("sign in", "출근 기록하다", "Sign in on the app every morning.", "매일 아침 앱으로 출근 기록해요."),
        ln("the assembly point", "비상 집결지", "Where's the assembly point?", "비상 집결지가 어디예요?"),
        ln("the site office", "현장 사무실", "The first aid kit's in the site office.", "구급상자는 현장 사무실에 있어요."),
        ln("If the alarm goes off", "경보가 울리면", "If the alarm goes off, head to the gate.", "경보가 울리면 정문으로 가요."),
      ],
      [
        t("Before you start, you need to do the site induction.", "시작 전에 현장 안전 교육 받아야 해요.", "알겠다고, 어디서 받는지 물어보세요", "No worries. Where do I do the site induction?", ["site induction", "where do I"]),
        t("Here in the office. And sign in on the app every day.", "여기 사무실에서요. 그리고 매일 앱으로 사인인해요.", "매일 사인인하겠다고 하고 비상 집결지가 어딘지 물어보세요", "Okay, I'll sign in. Where's the assembly point?", ["assembly point", "sign in"]),
        t("By the front gate. If the alarm goes off, go straight there.", "정문 옆이요. 경보 울리면 바로 거기로 가요.", "정문 옆이 맞는지 확인하세요", "By the front gate, got it.", ["front gate", "got it"]),
      ],
      o("Great. You're all good to go.", "좋아요. 이제 들어가도 돼요.")),

    L("7", 1, "⛑️", "PPE 챙기기", "안전모·보안경·귀마개 챙기고 빌리기", "포맨 Steve",
      [
        ln("hard hat", "안전모", "Hard hat on as soon as you're past the gate.", "정문 지나면 바로 안전모 써요."),
        ln("safety glasses", "보안경", "You need safety glasses for cutting.", "자를 때는 보안경 써야 해요."),
        ln("earmuffs", "귀마개(헤드폰형)", "Put your earmuffs on near the saw.", "톱 근처에선 귀마개 써요."),
        ln("Can I borrow", "빌려도 돼요", "Can I borrow a pair of earmuffs?", "귀마개 하나 빌려도 돼요?"),
        ln("PPE", "개인 보호 장비", "Where do you keep the spare PPE?", "여분 보호 장비는 어디 둬요?", "PPE = 안전모·조끼·장갑 같은 보호 장비예요."),
      ],
      [
        t("Where's your hard hat, mate?", "안전모 어디 있어요?", "죄송하다고, 지금 쓰겠다고 하세요", "Sorry, I'll put my hard hat on now.", ["hard hat", "helmet"]),
        t("And you'll be cutting today, so safety glasses too.", "오늘 자르는 일 하니까 보안경도요.", "보안경은 없다고, 여분 PPE 어디 있는지 물어보세요", "I don't have any. Where's the spare PPE?", ["spare PPE", "where's the"]),
        t("In the container, top shelf.", "컨테이너 맨 위 칸에요.", "귀마개도 하나 빌려도 되는지 물어보세요", "Thanks. Can I borrow some earmuffs too?", ["borrow some earmuffs", "earmuffs"]),
      ],
      o("Take what you need. Just bring it back.", "필요한 거 가져가요. 반납만 해요.")),

    L("8", 1, "⏰", "출근 시간·주차 묻기", "시작 시간·주차 장소·첫날 준비물 확인하기", "포맨 Steve (전화)",
      [
        ln("What time should I", "몇 시에 ~해야 해요", "What time should I be there tomorrow?", "내일 몇 시까지 가야 해요?"),
        ln("We kick off at", "~시에 시작해요", "We kick off at seven sharp.", "7시 정각에 시작해요.", "현장은 보통 아침 6~7시에 시작해요."),
        ln("Where can I park", "어디에 주차해요", "Where can I park near the site?", "현장 근처 어디에 주차해요?"),
        ln("on the street", "길가에", "Park on the street, not on the slab.", "길가에 대요, 슬래브 위에 말고요."),
        ln("bring my own lunch", "점심 싸 가다", "Should I bring my own lunch?", "점심 싸 가야 해요?"),
      ],
      [
        t("Hey, it's Steve. You start tomorrow on the Smith Street job.", "스티브예요. 내일 스미스 스트리트 현장 시작이에요.", "몇 시까지 가야 하는지 물어보세요", "Great. What time should I be there?", ["what time should I", "what time"]),
        t("We kick off at 7, so get there at quarter to.", "7시에 시작하니까 15분 전에 와요.", "어디에 주차하는지 물어보세요", "Okay. Where can I park?", ["where can I park", "park"]),
        t("On the street. There's no shop nearby, so bring lunch.", "길가에요. 근처에 가게 없으니 점심 챙겨요.", "점심 싸 가겠다고, 6시 45분에 보자고 하세요", "No worries, I'll bring my own lunch. See you at 6:45.", ["bring my own lunch", "6:45"]),
      ],
      o("Good stuff. See you then.", "좋아요. 그때 봐요.")),

    L("9", 1, "🔨", "공구 이름 묻기", "모르는 공구 이름 묻고 가져가기", "동료 Dan",
      [
        ln("What do you call this", "이거 뭐라고 해요", "Sorry, what do you call this?", "죄송한데 이거 뭐라고 해요?"),
        ln("crowbar", "쇠지렛대", "That's a crowbar. Pass it here.", "그건 쇠지렛대예요. 이리 줘요."),
        ln("the wheelbarrow", "외바퀴 수레", "Bring the wheelbarrow over here.", "외바퀴 수레 이쪽으로 가져와요."),
        ln("spirit level", "수평계", "Can you grab the spirit level from the ute?", "유트에서 수평계 좀 가져올래요?", "ute = 호주식 픽업트럭이에요."),
        ln("Is this the one", "이거 맞아요", "Is this the one you wanted?", "이거 말한 거 맞아요?"),
      ],
      [
        t("Mate, grab me the spirit level.", "수평계 좀 가져다줘요.", "죄송하다고, 그게 뭔지 모르겠다고 하세요", "Sorry, what's a spirit level?", ["what's a spirit level", "spirit level"]),
        t("The long one with the bubble. In the ute.", "기포 있는 긴 거요. 유트 안에.", "가져와서 이거 맞는지 물어보세요", "Is this the one?", ["is this the one", "this one"]),
        t("That's it. And what do you call this?", "그거요. 그럼 이건 뭐라고 해요?", "쇠지렛대라고 답하세요", "That's a crowbar.", ["crowbar", "pry bar"]),
      ],
      o("Ha, you're learning fast.", "하, 빨리 배우네요.")),

    // ───────── STEP 2: 매일 하는 노무 일 ─────────
    L("3", 2, "🧹", "현장 정리", "정리하고 쓰레기 버릴 곳 묻기", "포맨",
      [
        ln("clean up the site", "현장을 정리하다", "Can you clean up the site before knock-off?", "퇴근 전에 현장 정리 좀 해 줄래요?"),
        ln("Where does the rubbish go", "쓰레기는 어디 버려요", "Where does the rubbish go?", "쓰레기는 어디에 버려요?"),
        ln("the skip bin", "대형 쓰레기통", "Throw it all in the skip bin out front.", "다 앞에 있는 대형 쓰레기통에 버려요.", "skip bin = 현장용 대형 쓰레기 컨테이너예요."),
        ln("offcuts", "자투리", "Keep the good offcuts for later.", "쓸 만한 자투리는 나중에 쓰게 둬요."),
        ln("trip hazard", "걸려 넘어질 위험", "Those cables are a trip hazard.", "저 전선들 걸려 넘어지기 쉬워요."),
      ],
      [
        t("Can you clean up the site before knock-off?", "퇴근 전에 현장 정리 좀 해 줄래요?", "정리하겠다고 하고 쓰레기는 어디 버리는지 물어보세요", "Sure, I'll clean up the site. Where does the rubbish go?", ["clean up the site", "where does the rubbish go"]),
        t("In the skip bin out front.", "앞에 있는 대형 쓰레기통이요.", "앞에 있는 쓰레기통 맞다고 확인하세요", "Got it. The skip bin out front.", ["skip bin", "got it"]),
        t("Smoko's at 10, by the way.", "그나저나 스모코는 10시예요.", "고맙다고, 스모코 때 보자고 하세요", "Thanks, see you at smoko.", ["smoko", "thanks"]),
      ],
      o("Cheers.", "고마워요.")),

    L("4", 2, "🌧️", "비 와서 작업 취소", "내일 일정 묻고 연락 기다리기", "포맨 (전화)",
      [
        ln("rained off", "비로 작업이 취소된", "It's pouring. We're rained off today.", "비가 쏟아져요. 오늘은 작업 취소예요."),
        ln("Are we working tomorrow", "내일은 일해요", "Are we working tomorrow, then?", "그럼 내일은 일해요?"),
        ln("I'll text you", "문자할게요", "I'll text you tonight about tomorrow.", "내일 일은 밤에 문자할게요."),
        ln("wait for your text", "문자를 기다리다", "No worries, I'll wait for your text.", "알겠어요, 문자 기다릴게요."),
        ln("Have a good one", "좋은 하루 보내요", "Thanks, have a good one.", "고마워요, 좋은 하루 보내요.", "Have a good one = 헤어질 때 흔한 인사예요."),
      ],
      [
        t("Hey mate, it's pouring. We're rained off today.", "비가 쏟아져요. 오늘은 작업 취소예요.", "그럼 내일은 일하는지 물어보세요", "Okay. Are we working tomorrow?", ["working tomorrow", "tomorrow"]),
        t("Should be. I'll text you tonight.", "아마요. 밤에 문자할게요.", "알겠다고, 문자 기다리겠다고 하세요", "No worries. I'll wait for your text.", ["wait for your text", "no worries"]),
        t("Sweet. Stay dry.", "좋아요. 비 맞지 말고.", "고맙다고, 좋은 하루 보내라고 하세요", "Thanks, have a good one.", ["have a good one", "thanks"]),
      ],
      o("You too.", "당신도요.")),

    L("10", 2, "🚚", "자재 내리기", "배송 트럭에서 자재 내리고 쌓을 곳 묻기", "포맨 Steve",
      [
        ln("The delivery's here", "배송 왔어요", "The delivery's here. Give the driver a hand.", "배송 왔어요. 기사님 좀 도와줘요."),
        ln("Where do you want", "어디에 둘까요", "Where do you want these bricks?", "이 벽돌 어디에 둘까요?"),
        ln("stack them", "쌓다", "Stack them by the fence, off the ground.", "땅에 안 닿게 펜스 옆에 쌓아요."),
        ln("on a pallet", "팔레트 위에", "Keep the plasterboard on a pallet.", "석고보드는 팔레트 위에 둬요."),
        ln("a two-person lift", "두 명이 드는 것", "That beam's a two-person lift.", "그 빔은 두 명이 들어야 해요.", "무거운 건 혼자 들지 마요."),
      ],
      [
        t("The delivery's here. Give the driver a hand.", "배송 왔어요. 기사님 좀 도와줘요.", "알겠다고, 자재를 어디에 둘지 물어보세요", "Sure. Where do you want them?", ["where do you want", "where should I put"]),
        t("Stack the bricks by the fence, on a pallet.", "벽돌은 펜스 옆 팔레트 위에 쌓아요.", "펜스 옆 팔레트 위에 쌓겠다고 하세요", "Okay, I'll stack them on a pallet by the fence.", ["stack them", "on a pallet"]),
        t("And wait for Dan for the beams.", "그리고 빔은 댄 기다렸다 같이 들어요.", "두 명이 드는 거냐고 확인하세요", "Got it. So the beams are a two-person lift?", ["two-person lift", "two person"]),
      ],
      o("Yep. Don't be a hero.", "네. 혼자 무리하지 마요.")),

    L("11", 2, "🛞", "수레로 흙 나르기", "흙·자갈 옮길 양과 장소 확인하기", "동료 Dan",
      [
        ln("shift this pile", "이 더미를 옮기다", "We need to shift this pile of dirt.", "이 흙더미를 옮겨야 해요.", "shift = 옮기다, 현장에서 자주 써요."),
        ln("out the back", "뒤쪽으로", "Take it out the back, near the fence.", "뒤쪽 펜스 근처로 가져가요."),
        ln("half full", "반쯤 찬", "Only fill the barrow half full.", "수레는 반만 채워요."),
        ln("Watch the plank", "판자 조심해요", "Watch the plank, it's a bit wobbly.", "판자 조심해요, 좀 흔들려요."),
        ln("swap after this load", "이번 거 하고 교대하다", "Let's swap after this load.", "이번 거 하고 교대해요."),
      ],
      [
        t("We've got to shift this pile before lunch.", "점심 전에 이 더미 옮겨야 해요.", "어디로 옮기는지 물어보세요", "Okay. Where are we taking it?", ["where are we taking", "where to"]),
        t("Out the back, near the fence. Half full, it's heavy.", "뒤쪽 펜스 근처요. 무거우니까 반만 채워요.", "뒤쪽으로, 반만 채우겠다고 확인하세요", "Out the back, half full. Got it.", ["half full", "out the back"]),
        t("Watch the plank, it's wobbly.", "판자 조심해요, 흔들려요.", "고맙다고 하고 이번 거 하고 교대하자고 하세요", "Thanks. Let's swap after this load.", ["swap after this load", "swap"]),
      ],
      o("Deal. You shovel, I push.", "좋아요. 그쪽이 퍼고 내가 밀게요.")),

    L("12", 2, "🥪", "스모코·점심 시간", "쉬는 시간 묻고 동료와 가볍게 이야기하기", "동료 Dan",
      [
        ln("How long's lunch", "점심시간 얼마나 돼요", "How long's lunch on this site?", "이 현장은 점심시간 얼마나 돼요?"),
        ln("half an hour", "30분", "Half an hour, from twelve to half past.", "30분이에요, 12시부터 12시 반까지."),
        ln("the lunch shed", "휴게 컨테이너", "We eat in the lunch shed out of the sun.", "햇빛 피해서 휴게 컨테이너에서 먹어요."),
        ln("on the tools", "일하는 중", "Back on the tools at half twelve.", "12시 반에 다시 일 시작해요.", "on the tools = 손으로 직접 일하는 중"),
        ln("How long have you been", "얼마나 ~해 왔어요", "How long have you been doing this?", "이 일 얼마나 해 왔어요?"),
      ],
      [
        t("Smoko time, mate. Put the shovel down.", "스모코예요. 삽 내려놔요.", "점심시간은 얼마나 되는지 물어보세요", "Thanks. How long's lunch here?", ["how long's lunch", "how long"]),
        t("Half an hour. We eat in the lunch shed.", "30분이요. 휴게 컨테이너에서 먹어요.", "이 일 얼마나 했는지 물어보세요", "Cool. How long have you been doing this?", ["how long have you been", "how long"]),
        t("Ten years now. You?", "이제 10년이요. 당신은요?", "이번이 첫 현장 일이라고 하세요", "This is my first construction job.", ["first construction job", "first job"]),
      ],
      o("You'll be right. Back on the tools at half twelve.", "잘할 거예요. 12시 반에 다시 시작해요.")),

    L("13", 2, "🕓", "타임시트 쓰기", "일한 시간 적고 확인 사인 받기", "포맨 Steve",
      [
        ln("fill in your timesheet", "타임시트를 쓰다", "Don't forget to fill in your timesheet.", "타임시트 쓰는 거 잊지 마요."),
        ln("7 till 3:30", "7시부터 3시 반까지", "I worked 7 till 3:30 today.", "오늘 7시부터 3시 반까지 일했어요."),
        ln("minus lunch", "점심시간 빼고", "That's eight hours minus lunch.", "점심시간 빼고 8시간이에요."),
        ln("sign it off", "확인 사인하다", "Can you sign it off for me?", "확인 사인해 주실 수 있어요?"),
        ln("Friday arvo", "금요일 오후", "Hand them in by Friday arvo.", "금요일 오후까지 내요.", "arvo = afternoon, 호주에서 정말 자주 써요."),
      ],
      [
        t("Have you filled in your timesheet?", "타임시트 썼어요?", "지금 쓰고 있다고, 7시부터 3시 반까지 맞는지 물어보세요", "Doing it now. It's 7 till 3:30, right?", ["7 till 3:30", "7 to 3:30"]),
        t("Yep, minus half an hour for lunch.", "네, 점심 30분 빼고요.", "점심 빼면 7시간 반이냐고 확인하세요", "So seven and a half hours, minus lunch?", ["minus lunch", "seven and a half"]),
        t("That's it. Bring it over.", "맞아요. 가져와요.", "확인 사인해 달라고 하세요", "Here it is. Can you sign it off?", ["sign it off", "sign it"]),
      ],
      o("Done. Get it in by Friday arvo.", "됐어요. 금요일 오후까지 내요.")),

    // ───────── STEP 3: 포맨 세부 지시 ─────────
    L("14", 3, "🪣", "콘크리트 타설 날", "타설 순서 듣고 맡은 일 확인하기", "포맨 Steve",
      [
        ln("the concrete pour", "콘크리트 타설", "The concrete pour starts at six tomorrow.", "콘크리트 타설은 내일 6시에 시작해요.", "타설 날은 트럭 시간 때문에 일찍 시작해요."),
        ln("spread it out", "펴 바르다", "Use the rake to spread it out.", "갈퀴로 펴 발라요."),
        ln("keep up with the truck", "트럭 속도를 따라가다", "You'll need to keep up with the truck.", "트럭 속도 따라가야 해요."),
        ln("hose down the tools", "공구를 물로 씻다", "Hose down the tools before it sets.", "굳기 전에 공구 물로 씻어요."),
        ln("before it sets", "굳기 전에", "We have to finish before it sets.", "굳기 전에 끝내야 해요."),
      ],
      [
        t("Big day tomorrow. The concrete pour's at six.", "내일 큰일 있어요. 콘크리트 타설 6시예요.", "제가 뭘 하면 되는지 물어보세요", "Okay. What do you need me to do?", ["what do you need me to do", "what should I do"]),
        t("Grab a rake and spread it out. Keep up with the truck.", "갈퀴 들고 펴 발라요. 트럭 속도 따라가고.", "갈퀴로 펴 바르겠다고 확인하세요", "Got it. I'll spread it out with the rake.", ["spread it out", "rake"]),
        t("And hose down the tools straight after.", "끝나면 바로 공구 물로 씻어요.", "굳기 전에 씻겠다고 하세요", "No worries, before it sets.", ["before it sets", "hose down"]),
      ],
      o("Good. Don't be late tomorrow.", "좋아요. 내일 늦지 마요.")),

    L("15", 3, "📏", "재서 자르기", "치수 듣고 표시하고 다시 확인하기", "목수 Mark",
      [
        ln("cut it at", "~에서 자르다", "Cut it at 900 mil, please.", "900밀리에서 잘라 줘요.", "호주 현장은 밀리미터를 mil이라고 해요."),
        ln("measure twice", "두 번 재다", "Measure twice, cut once.", "두 번 재고 한 번 잘라요."),
        ln("Mark it with", "~로 표시하다", "Mark it with a pencil first.", "먼저 연필로 표시해요."),
        ln("Was that", "~였어요?", "Sorry, was that 900 or 1900?", "죄송한데 900이었어요, 1900이었어요?"),
        ln("on the line", "선 위에서", "Cut right on the line.", "선 위로 정확히 잘라요."),
      ],
      [
        t("Can you cut this one at 900 mil?", "이거 900밀리에서 잘라 줄래요?", "900인지 1900인지 다시 물어보세요", "Sorry, was that 900 or 1900?", ["was that", "900"]),
        t("900. Measure twice, cut once.", "900이요. 두 번 재고 한 번 자르고.", "연필로 먼저 표시하겠다고 하세요", "Okay, I'll mark it with a pencil first.", ["mark it", "pencil"]),
        t("Good. Cut right on the line.", "좋아요. 선 위로 딱 잘라요.", "자르고 확인받겠다고 하세요", "Will do. I'll show you after I cut it.", ["show you", "check it"]),
      ],
      o("Perfect. That's spot on.", "완벽해요. 딱 맞네요.")),

    L("16", 3, "🚛", "후진 트럭 유도하기", "스포터 역할 듣고 신호 확인하기", "포맨 Steve",
      [
        ln("spot for the truck", "트럭을 유도하다", "Can you spot for the truck while it reverses?", "트럭 후진할 때 유도해 줄래요?", "spotter = 장비·트럭 움직임을 봐 주는 사람"),
        ln("stay where he can see you", "기사가 볼 수 있는 곳에 있다", "Always stay where he can see you.", "항상 기사가 볼 수 있는 곳에 있어요."),
        ln("Keep coming", "계속 오세요", "Keep coming, keep coming... stop!", "계속 오세요, 계속... 멈춰요!"),
        ln("Hold it there", "거기서 멈춰요", "Hold it there, that's good.", "거기서 멈춰요, 좋아요."),
        ln("blind spot", "사각지대", "Never stand in his blind spot.", "절대 사각지대에 서지 마요."),
      ],
      [
        t("Can you spot for the tipper while it backs in?", "덤프트럭 후진할 때 유도 좀 해 줄래요?", "알겠다고, 어디에 서 있으면 되는지 물어보세요", "Sure. Where should I stand?", ["where should I stand", "where do I stand"]),
        t("Stay where he can see you. Never in his blind spot.", "기사가 볼 수 있는 데 있어요. 사각지대엔 절대 말고.", "사각지대에 안 서겠다고 확인하세요", "Got it. Not in his blind spot.", ["blind spot", "got it"]),
        t("Okay, he's coming back now.", "자, 이제 후진해요.", "기사에게 계속 오다가 멈추라고 외치세요", "Keep coming... hold it there!", ["hold it there", "stop"]),
      ],
      o("Nice work. That's spot on.", "잘했어요. 딱 좋아요.")),

    L("17", 3, "🧰", "유트에서 공구 가져오기", "어떤 공구인지·어디 있는지 확인하기", "목수 Mark",
      [
        ln("Run to the ute", "유트로 뛰어가다", "Run to the ute and grab the grinder.", "유트로 가서 그라인더 가져와요."),
        ln("the toolbox", "공구함", "It's in the toolbox on the left side.", "왼쪽 공구함 안에 있어요."),
        ln("the corded one or the battery one", "유선 아니면 배터리용", "Do you want the corded one or the battery one?", "유선이요, 배터리용이요?"),
        ln("a spare battery", "여분 배터리", "Bring a spare battery too.", "여분 배터리도 가져와요."),
        ln("I couldn't find", "못 찾았어요", "Sorry, I couldn't find the extension lead.", "죄송해요, 연장선을 못 찾았어요.", "호주에선 연장선을 extension lead라고 해요."),
      ],
      [
        t("Run to the ute and grab the drill.", "유트 가서 드릴 가져와요.", "유선인지 배터리용인지 물어보세요", "The corded one or the battery one?", ["battery one", "corded one"]),
        t("Battery one. And a spare battery.", "배터리용이요. 여분 배터리도요.", "어디 있는지 물어보세요", "Okay. Where's the spare battery?", ["spare battery", "where's"]),
        t("In the toolbox on the left.", "왼쪽 공구함에요.", "왼쪽 공구함 맞는지 확인하고 바로 오겠다고 하세요", "The toolbox on the left. Back in a sec.", ["toolbox on the left", "back in a sec"]),
      ],
      o("Legend. Cheers.", "최고예요. 고마워요.")),

    L("18", 3, "📍", "자재 위치 지정", "어디에 둘지·무엇을 먼저 할지 확인하기", "포맨 Steve",
      [
        ln("Move these timber lengths", "이 목재들을 옮기다", "Move these timber lengths up to level two.", "이 목재들 2층으로 옮겨요."),
        ln("level two", "2층", "Leave them on level two, near the stairs.", "2층 계단 근처에 둬요."),
        ln("Which ones first", "어느 것부터", "Which ones first, the long or short ones?", "어느 것부터요, 긴 거요 짧은 거요?"),
        ln("out of the way", "방해 안 되게", "Keep them out of the way of the stairs.", "계단에 방해 안 되게 둬요."),
        ln("the long ones", "긴 것들", "Do the long ones first, they're in the way.", "긴 거 먼저요, 걸리적거려요."),
      ],
      [
        t("Move these timber lengths up to level two.", "이 목재들 2층으로 옮겨요.", "어느 것부터 옮길지 물어보세요", "Sure. Which ones first?", ["which ones first", "which first"]),
        t("The long ones first, they're in the way.", "긴 거 먼저요, 걸리적거려요.", "2층 어디에 두는지 물어보세요", "Okay. Where on level two?", ["level two", "where"]),
        t("Near the stairs, but out of the way.", "계단 근처, 근데 방해 안 되게요.", "계단 근처에 방해 안 되게 두겠다고 하세요", "Got it. Near the stairs, out of the way.", ["out of the way", "near the stairs"]),
      ],
      o("Good. Shout if you need a hand.", "좋아요. 도움 필요하면 불러요.")),

    L("19", 3, "🔁", "지시 못 알아들었을 때", "천천히 다시 말해 달라고·보여 달라고 하기", "포맨 Steve",
      [
        ln("say that again", "다시 말하다", "Sorry, can you say that again?", "죄송한데 다시 말해 줄래요?"),
        ln("a bit slower", "조금 더 천천히", "Could you say it a bit slower?", "조금만 더 천천히 말해 줄래요?"),
        ln("Do you mean", "~라는 말이에요", "Do you mean the blue pipes?", "파란 파이프 말하는 거예요?"),
        ln("show me", "보여 주다", "Could you show me which one?", "어느 건지 보여 줄래요?"),
        ln("Just to double-check", "한 번 더 확인하자면", "Just to double-check, all of them?", "한 번 더 확인할게요, 전부요?", "모르면 대충 하지 말고 꼭 다시 물어요."),
      ],
      [
        t("Chuck the conduit offcuts in the skip, ay.", "전선관 자투리 스킵에 던져 넣어요.", "죄송하다고, 다시 말해 달라고 하세요", "Sorry, can you say that again?", ["say that again", "pardon"]),
        t("The conduit. The grey pipe bits. Put them in the skip.", "전선관이요. 회색 파이프 조각. 스킵에 넣어요.", "회색 파이프 조각 말이냐고 확인하세요", "Do you mean these grey pipe bits?", ["do you mean", "these"]),
        t("Yep, those.", "네, 그거요.", "한 번 더 확인하자며 전부 다 버리는지 물어보세요", "Just to double-check, all of them?", ["double-check", "all of them"]),
      ],
      o("All of them. Good on you for asking.", "전부요. 물어봐 줘서 고마워요.")),

    // ───────── STEP 4: 위험·사고·안전 ─────────
    L("5", 4, "⚠️", "위험한 순간", "조심하라고 외치고 보고하기", "동료",
      [
        ln("Watch out", "조심해요", "Watch out! Something's falling!", "조심해요! 뭐가 떨어져요!"),
        ln("That was close", "큰일 날 뻔했어요", "Whoa, that was close.", "와, 큰일 날 뻔했네요."),
        ln("Are you okay", "괜찮아요", "Are you okay? Did it hit you?", "괜찮아요? 맞았어요?"),
        ln("tell the supervisor", "감독에게 말하다", "I'll tell the supervisor right now.", "지금 바로 감독한테 말할게요."),
        ln("near miss", "아차 사고", "We need to report that near miss.", "그 아차 사고 보고해야 해요.", "다치지 않았어도 near miss는 보고해요."),
      ],
      [
        t("Hey, what's that noise up there?", "저 위에서 무슨 소리예요?", "조심하라고 크게 외치세요", "Watch out!", ["watch out", "look out"]),
        t("Whoa, thanks. That was close.", "와, 고마워요. 큰일 날 뻔했네요.", "괜찮은지 물어보세요", "Are you okay?", ["are you okay", "you alright"]),
        t("Yeah, I'm fine. Can you tell the supervisor?", "괜찮아요. 감독한테 말해 줄래요?", "지금 바로 말하겠다고 하세요", "Sure, I'll tell the supervisor now.", ["tell the supervisor", "tell him"]),
      ],
      o("Thanks, mate.", "고마워요.")),

    L("20", 4, "🩹", "다쳤을 때 보고하기", "다친 곳 말하고 응급 담당자·보고서 챙기기", "포맨 Steve",
      [
        ln("I've hurt my", "~를 다쳤어요", "I've hurt my hand on a nail.", "못에 손을 다쳤어요."),
        ln("the first aider", "응급처치 담당자", "Who's the first aider on site today?", "오늘 현장 응급처치 담당자 누구예요?"),
        ln("Get it cleaned up", "소독하다", "Get it cleaned up and covered.", "소독하고 덮어요."),
        ln("an incident report", "사고 보고서", "We still need an incident report.", "그래도 사고 보고서는 써야 해요.", "작은 부상도 보고서를 남겨야 보험 처리돼요."),
        ln("tetanus shot", "파상풍 주사", "When was your last tetanus shot?", "마지막 파상풍 주사가 언제예요?"),
      ],
      [
        t("You right? You're holding your hand.", "괜찮아요? 손 붙잡고 있네요.", "못에 손을 다쳤다고 하세요", "I've hurt my hand on a nail.", ["hurt my hand", "hurt my"]),
        t("Let's get it cleaned up. Karen's the first aider.", "소독해요. 캐런이 응급 담당이에요.", "고맙다고 하고 보고서도 써야 하는지 물어보세요", "Thanks. Do I need to do an incident report?", ["incident report", "report"]),
        t("Yep. Also, when was your last tetanus shot?", "네. 그리고 마지막 파상풍 주사는 언제예요?", "잘 모르겠다고, 몇 년 전이라고 하세요", "I'm not sure. A few years ago.", ["not sure", "few years ago"]),
      ],
      o("Right, we'll get you to the clinic to be safe.", "그럼 혹시 모르니 병원 가 봐요.")),

    L("21", 4, "🙅", "자격 없는 일 거절하기", "티켓 없다고 말하고 다른 일 묻기", "하청 반장 Bruce",
      [
        ln("jump on the forklift", "지게차를 타다", "Can you jump on the forklift for a sec?", "잠깐 지게차 좀 몰아 줄래요?"),
        ln("I'm not ticketed", "자격증이 없어요", "Sorry, I'm not ticketed for that.", "죄송해요, 그건 자격증이 없어요.", "ticket = 장비별 자격증. 없으면 절대 하지 마요."),
        ln("I'm not allowed to", "~하면 안 돼요", "I'm not allowed to use it without one.", "자격증 없이는 쓰면 안 돼요."),
        ln("Is there something else", "다른 거 있어요", "Is there something else I can do?", "제가 할 수 있는 다른 일 있어요?"),
        ln("a harness", "안전벨트(하네스)", "You need a harness up on the roof.", "지붕 위에선 하네스 차야 해요."),
      ],
      [
        t("Mate, jump on the forklift and move that pallet.", "지게차 타고 저 팔레트 좀 옮겨요.", "죄송하다고, 지게차 자격증이 없다고 하세요", "Sorry, I'm not ticketed for the forklift.", ["not ticketed", "don't have a ticket"]),
        t("It's only ten metres. No one will know.", "10미터밖에 안 돼요. 아무도 몰라요.", "자격증 없이는 하면 안 된다고 하세요", "Sorry, I'm not allowed to without a ticket.", ["not allowed", "can't"]),
        t("Fair enough.", "그래요, 알겠어요.", "다른 할 일 있는지 물어보세요", "Is there something else I can do?", ["something else", "anything else"]),
      ],
      o("Yeah, go help the brickies.", "네, 벽돌공들 좀 도와줘요.")),

    L("22", 4, "☀️", "더운 날 탈수 증상", "어지럽다고 말하고 쉬기·물 마시기", "포맨 Steve",
      [
        ln("I'm feeling a bit off", "몸이 좀 안 좋아요", "I'm feeling a bit off, sorry.", "죄송해요, 몸이 좀 안 좋아요."),
        ln("a headache", "두통", "I've got a headache and feel dizzy.", "머리가 아프고 어지러워요."),
        ln("in the lunch shed", "휴게 컨테이너에서", "Go cool off in the lunch shed.", "휴게 컨테이너에서 열 좀 식혀요."),
        ln("electrolytes", "전해질 음료", "Have some electrolytes from the esky.", "아이스박스에서 전해질 음료 마셔요.", "esky = 호주식 아이스박스예요."),
        ln("Slip, slop, slap", "옷 입고·선크림 바르고·모자 쓰기", "Slip, slop, slap, it's 38 today.", "옷 입고, 선크림 바르고, 모자 써요. 오늘 38도예요."),
      ],
      [
        t("You look crook, mate. What's up?", "안색이 안 좋아요. 왜 그래요?", "몸이 좀 안 좋다고, 머리 아프고 어지럽다고 하세요", "I'm feeling a bit off. I've got a headache.", ["feeling a bit off", "headache"]),
        t("Go sit in the lunch shed. Had any water?", "휴게 컨테이너에 가서 앉아요. 물 마셨어요?", "아침 이후로 별로 안 마셨다고 하세요", "Not much since this morning.", ["not much", "since this morning"]),
        t("Have some electrolytes from the esky.", "아이스박스에서 전해질 음료 마셔요.", "고맙다고, 20분 쉬겠다고 하세요", "Thanks. I'll rest for twenty minutes.", ["rest for twenty minutes", "rest"]),
      ],
      o("Take as long as you need.", "필요한 만큼 쉬어요.")),

    L("23", 4, "🔌", "고장 난 공구 발견", "고장 알리고 태그 붙이고 다른 것 받기", "포맨 Steve",
      [
        ln("This lead is damaged", "이 연장선이 망가졌어요", "This lead is damaged near the plug.", "이 연장선 플러그 쪽이 망가졌어요."),
        ln("tag it out", "사용 금지 태그를 붙이다", "Tag it out and put it in the ute.", "사용 금지 태그 붙여서 유트에 넣어요.", "고장 난 장비엔 Do Not Use 태그를 붙여요."),
        ln("test and tag", "전기 안전 검사", "Its test and tag has expired.", "전기 안전 검사 기한이 지났어요."),
        ln("use it anyway", "그래도 쓰다", "Don't use it anyway, it's not safe.", "그래도 쓰지 마요, 안전하지 않아요."),
        ln("a new one", "새것", "There's a new one in the container.", "컨테이너에 새것 있어요."),
      ],
      [
        t("Why'd you stop drilling?", "왜 드릴 멈췄어요?", "연장선이 플러그 쪽에 망가졌다고 하세요", "This lead is damaged near the plug.", ["lead is damaged", "damaged"]),
        t("Good catch. Tag it out.", "잘 봤어요. 사용 금지 태그 붙여요.", "태그는 어디 있는지 물어보세요", "Okay, I'll tag it out. Where are the tags?", ["tag it out", "where are the tags"]),
        t("In the site office. Grab a new lead from the container.", "현장 사무실에요. 새 연장선은 컨테이너에서 가져와요.", "알겠다고, 새것을 가져오겠다고 하세요", "No worries. I'll grab a new one.", ["a new one", "new lead"]),
      ],
      o("Good on ya for spotting it.", "발견해 줘서 고마워요.")),

    L("24", 4, "💥", "자재 망가뜨림", "실수 바로 말하고 해결 방법 묻기", "포맨 Steve",
      [
        ln("I've cracked", "깨뜨렸어요", "Sorry, I've cracked a sheet of plasterboard.", "죄송해요, 석고보드 한 장 깨뜨렸어요."),
        ln("I dropped it", "떨어뜨렸어요", "I dropped it carrying it upstairs.", "위층으로 옮기다가 떨어뜨렸어요."),
        ln("Is it still usable", "아직 쓸 수 있어요", "Is it still usable for the small walls?", "작은 벽에는 아직 쓸 수 있어요?"),
        ln("Better to tell me", "말해 주는 게 낫다", "Better to tell me now than hide it.", "숨기는 것보다 지금 말해 주는 게 나아요.", "실수는 바로 보고하는 게 호주 현장 문화예요."),
        ln("carry it on its edge", "세워서 옮기다", "Next time, carry it on its edge.", "다음엔 세워서 옮겨요."),
      ],
      [
        t("What was that bang?", "방금 쾅 소리 뭐예요?", "죄송하다고, 석고보드 한 장 깨뜨렸다고 하세요", "Sorry, I've cracked a sheet of plasterboard.", ["I've cracked", "cracked"]),
        t("How'd that happen?", "어쩌다 그랬어요?", "위층으로 옮기다 떨어뜨렸다고 하세요", "I dropped it carrying it upstairs.", ["dropped it", "dropped"]),
        t("Happens. Better to tell me than hide it.", "그럴 수 있죠. 숨기는 것보단 말해 주는 게 나아요.", "작은 벽엔 아직 쓸 수 있는지 물어보세요", "Is it still usable for the small walls?", ["still usable", "use it"]),
      ],
      o("Probably. Next time carry it on its edge.", "아마요. 다음엔 세워서 옮겨요.")),

    // ───────── STEP 5: 현장 조율·마무리 ─────────
    L("25", 5, "🔧", "다른 트레이드와 조율", "전기·배관 기사와 작업 순서 맞추기", "전기 기사 Jake",
      [
        ln("the sparky", "전기 기사", "The sparky needs this room clear by ten.", "전기 기사가 10시까지 이 방을 비워 달래요.", "sparky = 전기 기사, chippy = 목수, brickie = 벽돌공"),
        ln("clear this room", "이 방을 비우다", "Can you clear this room for me?", "이 방 좀 비워 줄래요?"),
        ln("Steve asked me to", "스티브가 ~하라고 했어요", "Steve asked me to sweep in here first.", "스티브가 여기 먼저 쓸라고 했어요."),
        ln("in twenty minutes", "20분 뒤에", "I'll be out of your way in twenty minutes.", "20분 뒤면 비켜 드릴게요."),
        ln("work around you", "피해서 일하다", "I can work around you for now.", "일단은 피해서 일할게요."),
      ],
      [
        t("Hey, I need to get in here to run cables. Can you clear this room?", "케이블 깔게 들어가야 해요. 이 방 좀 비워 줄래요?", "스티브가 여기 먼저 쓸라고 했다고 하세요", "Sorry, Steve asked me to sweep in here first.", ["Steve asked me", "asked me to"]),
        t("How long will you be?", "얼마나 걸려요?", "20분이면 비켜 주겠다고 하세요", "I'll be out of your way in twenty minutes.", ["in twenty minutes", "20 minutes"]),
        t("Alright, I'll start in the kitchen then.", "알겠어요, 그럼 부엌부터 할게요.", "고맙다고, 끝나면 알려 주겠다고 하세요", "Thanks. I'll let you know when I'm done.", ["let you know", "when I'm done"]),
      ],
      o("Cheers, mate.", "고마워요.")),

    L("26", 5, "📦", "포맨 대신 배송 받기", "배송 내용 확인하고 송장에 사인하기", "배송 기사 Gary",
      [
        ln("the delivery docket", "배송 송장", "Can you sign the delivery docket?", "배송 송장에 사인해 줄래요?", "docket = 호주에서 영수증·송장을 이렇게 불러요."),
        ln("not on site", "현장에 없어요", "Steve's not on site right now.", "스티브는 지금 현장에 없어요."),
        ln("check it against the order", "주문서와 대조하다", "Let me check it against the order first.", "먼저 주문서랑 대조해 볼게요."),
        ln("one bag short", "한 포대 모자라다", "It looks like we're one bag short.", "한 포대 모자란 것 같아요."),
        ln("write that on the docket", "송장에 적다", "I'll write that on the docket.", "송장에 그걸 적을게요."),
      ],
      [
        t("Delivery for Steve. Twenty bags of cement.", "스티브 앞으로 배송이요. 시멘트 20포대.", "스티브는 지금 현장에 없다고, 대신 받겠다고 하세요", "He's not on site, but I can take it.", ["not on site", "I can take it"]),
        t("No worries. Sign the docket here.", "괜찮아요. 여기 송장에 사인해요.", "먼저 주문서랑 대조하겠다고 하세요", "Let me check it against the order first.", ["check it against", "check it first"]),
        t("Take your time.", "천천히 해요.", "한 포대 모자란다고, 송장에 적겠다고 하세요", "We're one bag short. I'll write that on the docket.", ["one bag short", "on the docket"]),
      ],
      o("Fair enough. I'll bring it tomorrow.", "알겠어요. 내일 가져올게요.")),

    L("27", 5, "🔄", "퇴근 전 인수인계", "끝낸 일·남은 일·내일 할 일 보고하기", "포맨 Steve",
      [
        ln("What's the go", "상황 어때요", "What's the go? All finished?", "상황 어때요? 다 끝났어요?", "What's the go? = 어떻게 돼 가요? 호주식 표현이에요."),
        ln("I've finished", "끝냈어요", "I've finished the backfill out the front.", "앞쪽 되메우기 끝냈어요."),
        ln("still left to do", "아직 남은 일", "The side path is still left to do.", "옆 통로는 아직 남았어요."),
        ln("first thing tomorrow", "내일 아침 제일 먼저", "I'll do it first thing tomorrow.", "내일 아침 제일 먼저 할게요."),
        ln("locked up the container", "컨테이너를 잠갔다", "I've locked up the container too.", "컨테이너도 잠갔어요."),
      ],
      [
        t("What's the go? Before you head off.", "어떻게 됐어요? 가기 전에요.", "앞쪽 되메우기는 끝냈다고 하세요", "I've finished the backfill out the front.", ["I've finished", "finished"]),
        t("Good. And the side path?", "좋아요. 옆 통로는요?", "아직 남았다고, 내일 아침 제일 먼저 하겠다고 하세요", "That's still left to do. I'll do it first thing tomorrow.", ["first thing tomorrow", "still left"]),
        t("Righto. Tools away?", "그래요. 공구는 정리했어요?", "다 넣었고 컨테이너도 잠갔다고 하세요", "Yep, and I've locked up the container.", ["locked up the container", "locked"]),
      ],
      o("Legend. See you tomorrow.", "최고예요. 내일 봐요.")),

    L("28", 5, "💰", "급여 조건 확인하기", "시급·ABN·주급 날짜 확인하기", "에이전시 담당 Nicole",
      [
        ln("the hourly rate", "시급", "What's the hourly rate for this job?", "이 일 시급이 얼마예요?"),
        ln("casual or on an ABN", "캐주얼 고용 아니면 ABN", "Am I casual or on an ABN?", "캐주얼 고용이에요, ABN이에요?", "ABN이면 세금·슈퍼를 직접 챙겨야 해요."),
        ln("Is super included", "슈퍼 포함이에요", "Is super included in that rate?", "그 시급에 슈퍼 포함이에요?"),
        ln("paid weekly", "주급으로", "You get paid weekly, every Wednesday.", "주급으로 매주 수요일에 받아요."),
        ln("in writing", "서면으로", "Can I get that in writing, please?", "그거 서면으로 받을 수 있을까요?"),
      ],
      [
        t("So you're starting Monday. Any questions?", "월요일 시작이에요. 질문 있어요?", "시급이 얼마인지 물어보세요", "Yes. What's the hourly rate?", ["hourly rate", "how much per hour"]),
        t("$35 an hour, paid weekly.", "시간당 35달러, 주급이요.", "캐주얼인지 ABN인지 물어보세요", "Am I casual or on an ABN?", ["casual or on an ABN", "ABN"]),
        t("Casual, through us. Super's on top.", "저희 통해서 캐주얼이요. 슈퍼는 별도로 붙어요.", "서면으로 받을 수 있는지 물어보세요", "Great. Can I get that in writing?", ["in writing", "written"]),
      ],
      o("Sure, I'll email the contract today.", "그럼요, 오늘 계약서 이메일로 보낼게요.")),

    L("29", 5, "🧑‍🏫", "새 레이버러 안내하기", "현장 규칙과 위치 알려 주기", "새 레이버러 Ben",
      [
        ln("Stick with me", "나랑 같이 다녀요", "Stick with me for the first day.", "첫날은 나랑 같이 다녀요."),
        ln("The sign-in is", "출근 기록은", "The sign-in is on the app at the gate.", "출근 기록은 정문에서 앱으로 해요."),
        ln("Never walk under", "절대 밑으로 지나가지 마요", "Never walk under the crane load.", "크레인 짐 밑으로 절대 지나가지 마요."),
        ln("If in doubt, ask", "모르면 물어봐요", "If in doubt, ask Steve or me.", "모르면 스티브나 저한테 물어봐요."),
        ln("the dunny", "화장실", "The dunny's behind the lunch shed.", "화장실은 휴게 컨테이너 뒤에 있어요.", "dunny = 호주 현장식 화장실 말이에요."),
      ],
      [
        t("Hi, I'm Ben. Steve said you'd show me around.", "안녕하세요, 벤이에요. 스티브가 안내해 줄 거라던데요.", "반갑다고, 오늘은 나랑 같이 다니자고 하세요", "Hey Ben. Stick with me today.", ["stick with me", "stay with me"]),
        t("Cheers. Anything I should know?", "고마워요. 알아야 할 거 있어요?", "크레인 짐 밑으로 절대 지나가지 말라고 하세요", "Never walk under the crane load.", ["never walk under", "crane"]),
        t("Got it. Where's the toilet?", "알겠어요. 화장실은 어디예요?", "휴게 컨테이너 뒤에 있다고, 모르면 물어보라고 하세요", "Behind the lunch shed. If in doubt, ask.", ["if in doubt, ask", "behind the lunch shed"]),
      ],
      o("Thanks, mate. Appreciate it.", "고마워요. 진짜 도움 돼요.")),

    L("30", 5, "🏁", "현장 마지막 날", "인사하고 추천인·다음 일 부탁하기", "포맨 Steve",
      [
        ln("my last day on site", "현장 마지막 날", "Today's my last day on site.", "오늘이 현장 마지막 날이에요."),
        ln("I learned heaps", "정말 많이 배웠어요", "I learned heaps working with you.", "같이 일하면서 정말 많이 배웠어요.", "heaps = 아주 많이, 호주에서 정말 많이 써요."),
        ln("put you down as a referee", "추천인으로 적다", "Can I put you down as a referee?", "추천인으로 적어도 될까요?"),
        ln("any work coming up", "곧 있을 일", "Is there any work coming up next month?", "다음 달에 일 있어요?"),
        ln("keep you in mind", "기억해 두다", "I'll keep you in mind for the next job.", "다음 현장 때 기억해 둘게요."),
      ],
      [
        t("So this is it, eh? Last day.", "오늘이 끝이네요? 마지막 날.", "네, 정말 많이 배웠다고 하세요", "Yeah. I learned heaps here. Thanks, Steve.", ["learned heaps", "learned a lot"]),
        t("You've been a solid worker.", "일 잘했어요.", "추천인으로 적어도 되는지 물어보세요", "Thanks. Can I put you down as a referee?", ["referee", "reference"]),
        t("Of course. Happy to.", "물론이죠. 기꺼이요.", "다음 달에 일 있는지 물어보세요", "Is there any work coming up next month?", ["work coming up", "any work"]),
      ],
      o("Might be. I'll keep you in mind.", "있을 수도 있어요. 기억해 둘게요.")),
  ],
};

export default curriculum;
