// 멜번 고양이 마을: 지도 한 장 위를 고양이가 걸어 다니고, 건물에 들어가면 앱 화면으로 이어진다.
// 앱(/student/village)과 미리보기 페이지가 이 파일 하나를 같이 쓴다.
(function () {
  const W = 2752, H = 1536, MS = 8; // 지도 크기 · 걷기 지도 한 칸 크기
  const SCALE = 0.36, FRAME = 120, STEP = 7; // 고양이 크기 · 그림 높이 · 그림 한 장당 걷는 거리(px)
  const META = {"cheese-E":[108,12],"gray-E":[103,12],"russian-E":[103,12],"fold-E":[110,12],"siamese-E":[102,12],"ragdoll-E":[124,12],"tuxedo-E":[111,12],"white-E":[99,12],"angora-E":[121,12],"cheese-S":[96,10],"gray-S":[93,10],"russian-S":[94,10],"fold-S":[100,10],"siamese-S":[91,10],"ragdoll-S":[104,10],"tuxedo-S":[98,10],"white-S":[92,10],"angora-S":[108,10],"cheese-SE":[92,10],"gray-SE":[92,10],"russian-SE":[92,10],"fold-SE":[97,10],"siamese-SE":[89,10],"ragdoll-SE":[101,9],"tuxedo-SE":[93,10],"white-SE":[77,10],"angora-SE":[100,10],"cheese-NE":[70,9],"gray-NE":[70,9],"russian-NE":[80,9],"fold-NE":[97,12],"siamese-NE":[72,10],"ragdoll-NE":[100,12],"tuxedo-NE":[76,9],"white-NE":[91,12],"angora-NE":[95,9],"cheese-N":[69,9],"gray-N":[66,9],"russian-N":[71,7],"fold-N":[77,9],"siamese-N":[80,10],"ragdoll-N":[78,7],"tuxedo-N":[86,10],"white-N":[72,9],"angora-N":[96,9]};
  // 서 있을 때 쓸 그림: 걷기 그림 중 다리가 가장 모인 장면
  const REST = {"cheese-E":8,"gray-E":9,"russian-E":8,"fold-E":2,"siamese-E":2,"ragdoll-E":2,"tuxedo-E":8,"white-E":8,"angora-E":8,"cheese-S":7,"gray-S":2,"russian-S":2,"fold-S":2,"siamese-S":2,"ragdoll-S":2,"tuxedo-S":2,"white-S":2,"angora-S":2,"cheese-SE":2,"gray-SE":2,"russian-SE":2,"fold-SE":2,"siamese-SE":2,"ragdoll-SE":7,"tuxedo-SE":2,"white-SE":2,"angora-SE":2,"cheese-NE":4,"gray-NE":3,"russian-NE":4,"fold-NE":1,"siamese-NE":3,"ragdoll-NE":1,"tuxedo-NE":2,"white-NE":1,"angora-NE":7,"cheese-N":7,"gray-N":3,"russian-N":4,"fold-N":6,"siamese-N":3,"ragdoll-N":3,"tuxedo-N":1,"white-N":4,"angora-N":1};
  // 그림이 없는 방향을 다른 방향 그림으로 대신할 때 쓴다 (지금 그림은 5방향이 다 있다)
  const ART_DIR = {};
  const BREEDS = ["cheese", "gray", "russian", "fold", "siamese", "ragdoll", "tuxedo", "white", "angora"];

  // x·y: 건물 앞 땅, top: 이름표 아래 끝. link: 들어가면 열리는 앱 화면, q: 가게 안 표현 연습
  const PLACES = [
    { id: "station", x: 770, y: 1046, top: 730, name: "🚉 Flinders Street Station", desc: "오늘 들을 데일리 강의가 여기서 출발해요.", link: ["/student/lessons", "📺 Lessons"] },
    { id: "lib", x: 605, y: 777, top: 468, name: "📚 State Library", desc: "기초 문법을 차근차근 공부하는 곳이에요.", link: ["/student/grammar", "📚 Grammar"] },
    { id: "paul", x: 1376, y: 777, top: 405, name: "⛪ St Paul's Cathedral", desc: "소리 내어 연습하는 곳. th·r·l·f·v 입모양을 볼 수 있어요.", link: ["/student/pronunciation", "👄 Pronunciation"] },
    { id: "apt", x: 1376, y: 420, top: 124, name: "🏢 673 La Trobe · Home", desc: "내 고양이가 사는 집. 츄르로 방을 꾸며요.", link: ["/student/cat-house", "🏠 My room"] },
    { id: "fed", x: 1651, y: 592, top: 372, name: "🔷 Federation Square", desc: "광장 전광판에 오늘의 호주 뉴스가 떠요.", link: ["/student/news", "📰 Today's news"] },
    { id: "mcg", x: 2394, y: 571, top: 83, name: "🏟 MCG", desc: "이번 주 리그 순위를 겨루는 경기장이에요.", link: ["/student/league", "🏆 League"] },
    { id: "eureka", x: 1748, y: 1087, top: 592, name: "🏙 Eureka Tower", desc: "전망대에서 내 영어 레벨을 내려다봐요.", link: ["/student/level-test", "📈 Level test"] },
    { id: "arts", x: 1582, y: 1211, top: 880, name: "🎭 Arts Centre", desc: "배우처럼 따라 말한 내 쉐도잉 기록이 있어요.", link: ["/student/shadowing", "🎤 My shadowing"] },
    { id: "luna", x: 2180, y: 1101, top: 690, name: "🎡 Luna Park", desc: "게임으로 단어를 익히는 놀이공원이에요.", link: ["/student/voca", "🎮 Voca game"] },
    { id: "sx", x: 206, y: 977, top: 688, name: "🚆 Southern Cross Station", desc: "출국 준비 자료와 교재를 챙기는 곳이에요.", link: ["/student/resources", "🎁 Resources"] },
    { id: "site", x: 248, y: 1321, top: 977, name: "🏗 Construction Site", desc: "스모코 타임! 현장 영어를 연습하고, 면접도 볼 수 있어요.", room: "site", q: ["\"오늘 안전 장비 어디서 받아요?\"", "Where do I pick up my PPE today?"], link: ["/student/talk", "🎭 AI interview"] },
    { id: "qvm", x: 248, y: 261, top: 14, name: "🛒 Queen Victoria Market", desc: "장보기 영어: 가격 묻기, 몇 개 사기.", room: "qvm", q: ["\"사과 1킬로에 얼마예요?\"", "How much for a kilo of apples?"] },
    { id: "china", x: 413, y: 619, top: 413, name: "🏮 Chinatown", desc: "주방·서빙·예약 영어.", room: "restaurant", q: ["\"두 명 자리 있어요?\"", "Have you got a table for two?"] },
    { id: "hosier", x: 716, y: 400, top: 96, name: "🎨 Hosier Lane Café", desc: "그래피티 골목의 작은 카페. 커피 주문 영어.", room: "cafe", q: ["\"플랫화이트 한 잔 주세요.\"", "Can I grab a flat white, please?"] },
    { id: "bakery", x: 502, y: 399, top: 248, name: "🥐 Croissant Bakery", desc: "주문·포장 영어.", room: "bakery", q: ["\"크루아상 두 개 포장해 주세요.\"", "Can I get two croissants to take away, please?"] },
    { id: "hotel", x: 1004, y: 619, top: 337, name: "🏨 Hotel", desc: "체크인·예약 확인 영어.", room: "hotel", q: ["\"오늘 밤 예약했어요. 이름은 다니엘이에요.\"", "Hi, I have a booking for tonight under Daniel."] },
    { id: "chemist", x: 110, y: 1075, top: 880, name: "💊 Chemist Warehouse", desc: "처방전·증상 설명 영어.", room: "chemist", q: ["\"이 처방전 약 받을 수 있을까요?\"", "Can I get this prescription filled, please?"] },
    { id: "coles", x: 537, y: 1252, top: 1032, name: "🛒 Coles", desc: "물건 위치 묻기 영어.", room: "coles", q: ["\"우유 어디 있어요?\"", "Excuse me, where can I find the milk?"] },
    { id: "woolies", x: 96, y: 1445, top: 1266, name: "🛒 Woolworths", desc: "계산대 영어: 봉투·결제.", room: "woolies", q: ["\"봉투 하나 주세요.\"", "Can I get a bag, please?"] },
    { id: "cake", x: 2367, y: 1197, top: 991, name: "🍰 Cake Shop", desc: "케이크 고르기·포장 영어.", room: "cafe", q: ["\"이 케이크 한 조각 포장해 주세요.\"", "Can I get a slice of this cake to go?"] },
    { id: "park", x: 1789, y: 413, top: 151, name: "🌳 Park", desc: "호수 옆 산책 코스. 스몰톡 영어.", q: ["\"오늘 날씨 좋네요.\"", "Lovely day, isn't it?"] },
    { id: "huts", x: 1968, y: 1376, top: 1142, name: "🏖 Beach Huts", desc: "알록달록 오두막. 사진 부탁 영어.", q: ["\"사진 한 장 찍어 주실 수 있어요?\"", "Could you take a photo of us?"] },
    { id: "pier", x: 2339, y: 1266, top: 1211, name: "⛵ Pier", desc: "해 질 녘 산책 코스. 길 묻기 영어.", q: ["\"해변은 어느 쪽이에요?\"", "Excuse me, which way to the beach?"] },
  ];
  // 가게 내부 맵: 그림 좌표로 걸을 수 있는 바닥(floor)에서 가구(block)를 뺀다. start: 들어온 자리, spot: 처음 걸어가는 자리
  const CAFE_TABLES = [[495,530,610,610,495,700,390,610],[690,455,790,540,690,620,595,540],[830,375,925,450,830,530,745,450]];
  const ROOMS = {
    bakery: { w: 1000, h: 1000, bg: "#6b4128", start: [470,885], spot: [690,700], floor: [[370,825,410,805,640,712,770,650,845,708,490,905]] },
    cafe: { w: 1000, h: 747, bg: "#6b4128", start: [300,640], spot: [540,500], floor: [[120,520,255,600,425,520,560,455,690,430,760,400,930,505,500,722]], block: CAFE_TABLES },
    restaurant: { video: true, w: 1000, h: 747, bg: "#6b4128", start: [340,640], spot: [590,470], floor: [[120,520,255,600,425,520,560,455,690,430,760,400,930,505,500,722]], block: [...CAFE_TABLES, [255,565,330,565,330,610,255,610]] },
    hotel: { w: 1000, h: 747, bg: "#6b4128", start: [430,680], spot: [250,565], floor: [[60,515,115,495,175,550,300,480,310,520,275,530,275,600,390,650,430,690,500,722]] },
    pharmacy: { w: 1000, h: 1000, bg: "#6b4128", start: [250,820], spot: [720,815], floor: [[55,715,225,790,420,885,505,920,650,825,705,808,825,730,940,715,505,948],[300,800,490,705,600,620,690,680,640,690,440,765,420,880]] },
    site: { w: 1000, h: 1000, bg: "#6b4128", start: [640,830], spot: [410,540], floor: [[60,640,240,520,300,480,470,500,700,500,950,645,500,915]], block: [[355,600,450,560,560,490,720,590,800,640,800,730,690,730,640,780,580,800,450,740,450,680,365,680],[165,650,250,590,350,690,275,755],[110,670,150,640,180,680,140,695],[320,760,355,720,390,765,355,785],[450,855,495,820,535,860,495,900],[830,650,860,620,895,660,860,675],[705,510,790,470,865,540,800,620]] },
    supermarket: { w: 1000, h: 1000, bg: "#8a6245", start: [510,760], spot: [600,600], floor: [[100,470,330,300,660,480,640,600,730,630,680,660,500,770,320,700]], block: [[150,440,270,400,390,510,270,590],[110,530,165,510,250,600,210,640],[275,620,400,540,485,590,485,640,340,700],[310,330,340,315,585,470,580,580,520,575],[380,240,410,225,650,370,650,470,590,460]] },
  };
  // 넓은 가게: 그림에서 바닥을 찾아 만든 걷기 지도(mask)를 쓰고, 화면은 고양이를 따라간다
  ROOMS.coles = { w: 2400, h: 1340, bg: "#9c6853", img: "coles.jpg?v=1", mask: "coles-walk.png?v=3", fg: "coles-fg", view: 800, scale: 0.8, start: [1400, 1060], spot: [1280, 920] };
  ROOMS.woolies = { w: 2400, h: 1340, bg: "#9a6752", img: "woolies.jpg?v=1", mask: "woolies-walk.png?v=3", fg: "woolies-fg", view: 800, scale: 0.8, start: [900, 900], spot: [1200, 840] };
  ROOMS.chemist = { w: 2400, h: 1340, bg: "#38241d", img: "chemist.jpg?v=1", mask: "chemist-walk.png?v=3", fg: "chemist-fg", view: 800, scale: 0.8, start: [1680, 1040], spot: [1400, 940] };
  ROOMS.bakery = { w: 2400, h: 1340, bg: "#93604e", img: "bakery-big.jpg?v=1", mask: "bakery-walk.png?v=1", fg: "bakery-fg", view: 800, scale: 0.8, start: [960, 960], spot: [800, 820] };
  ROOMS.cafe = { w: 2400, h: 1340, bg: "#966650", img: "cafe-big.jpg?v=1", mask: "cafe-walk.png?v=1", fg: "cafe-fg", view: 800, scale: 0.8, start: [1260, 1080], spot: [1260, 800] };
  ROOMS.hotel = { w: 2400, h: 1340, bg: "#996550", img: "hotel-big.jpg?v=1", mask: "hotel-walk.png?v=1", fg: "hotel-fg", view: 800, scale: 0.8, start: [800, 900], spot: [1100, 760] };
  ROOMS.site = { w: 2400, h: 1340, bg: "#a06c54", img: "site-big.jpg?v=1", mask: "site-walk.png?v=1", fg: "site-fg", view: 800, scale: 0.8, start: [1200, 1060], spot: [1200, 800] };
  // 퀸 빅토리아 마켓: 안쪽 홀(정육·생선·델리) ↔ 바깥 장터(과일·채소 창고). 문으로 오간다. 손님 고양이들이 돌아다닌다
  ROOMS.qvm = { w: 2400, h: 1340, bg: "#a2877c", img: "qvm-in.jpg?v=1", mask: "qvm-in-walk.png?v=2", fg: "qvm-in-fg", view: 800, scale: 0.8, start: [1300, 1150], spot: [1200, 900], npcs: 9,
    portals: [{ x: 1540, y: 580, to: "qvmout", at: [440, 650], label: "🌳 Outdoor sheds →" }] };
  ROOMS.qvmout = { w: 2400, h: 1340, bg: "#77897b", img: "qvm-out.jpg?v=1", mask: "qvm-out-walk.png?v=1", fg: "qvm-out-fg", view: 800, scale: 0.8, start: [300, 560], spot: [600, 700], npcs: 12,
    portals: [{ x: 250, y: 500, to: "qvm", at: [1420, 760], label: "← Indoor halls 🏛" }] };
  const INSIDE_SCALE = 0.95; // 내부 그림에서 고양이 크기
  // 마을을 돌아다니는 고양이 (이름 없음)
  const TOWN_CATS = 28;
  const TOWN_BREEDS = BREEDS;
  const FRIEND_SPOTS = ["hosier", "fed", "china", "lib", "qvm", "eureka", "paul", "luna"];

  const CSS = `
.vg { position: relative; height: 100%; display: flex; flex-direction: column; overflow: hidden; color: #2a2350; background: #fffaf0; }
.vg *, .vg *::before { box-sizing: border-box; }
.vg-view { position: relative; flex: 1; min-height: 0; overflow: hidden; touch-action: none; cursor: grab; background: #bfe3f7; }
.vg-view:active { cursor: grabbing; }
.vg-world { position: absolute; left: 0; top: 0; transform-origin: 0 0; will-change: transform; }
.vg-map { display: block; max-width: none; user-select: none; -webkit-user-drag: none; pointer-events: none; }
.vg-cat { position: absolute; width: 0; height: 0; pointer-events: none; }
.vg-bob { position: absolute; left: 0; top: 0; transform-origin: 50% 100%; }
.vg-img { background-repeat: no-repeat; }
.vg-shadow { position: absolute; left: 0; top: 0; width: 26px; height: 7px; border-radius: 50%; background: rgba(42,35,80,.25); transform: translate(-50%, -50%); }
.vg-tag { position: absolute; font-size: 11px; line-height: 1.3; font-weight: 700; background: #fff; border: 1.5px solid #2a2350; border-radius: 6px; padding: 0 5px; white-space: nowrap; pointer-events: none; transform: translate(-50%, 3px) scale(var(--vg-iz, 1)); transform-origin: 50% 0; }
.vg-tag.me { background: #ff7fb3; color: #fff; border-color: #c2457c; }
.vg-pin { position: absolute; z-index: 100001; font: inherit; font-size: 12px; line-height: 1.3; font-weight: 700; color: #2a2350; background: #fffaf0; border: 2px solid #2a2350; border-radius: 8px; padding: 3px 7px; white-space: nowrap; box-shadow: 0 3px 0 #2a2350; cursor: pointer; transform: translate(-50%, -100%) scale(var(--vg-iz, 1)); transform-origin: 50% 100%; }
.vg-pin:hover, .vg-pin:focus-visible, .vg-pin.on { background: #f2b631; outline: none; }
.vg-target { position: absolute; width: 18px; height: 10px; border: 3px solid #6c5cff; border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none; opacity: 0; z-index: 99999; }
.vg-target.on { animation: vg-ping .7s ease-out; }
@keyframes vg-ping { 0% { opacity: 1; transform: translate(-50%,-50%) scale(.6); } 100% { opacity: 0; transform: translate(-50%,-50%) scale(2); } }
.vg-chips { position: absolute; left: 10px; top: 10px; display: flex; gap: 6px; flex-wrap: wrap; z-index: 2; pointer-events: none; }
.vg-chip { font-size: 12px; font-weight: 700; padding: 3px 8px; border: 2px solid #2a2350; border-radius: 8px; background: #fffaf0; }
.vg-chip.gold { background: #f2b631; }
.vg-fab { position: absolute; right: 10px; bottom: 10px; z-index: 2; font: inherit; font-size: 13px; font-weight: 700; color: #fff; background: #6c5cff; border: 2px solid #2a2350; border-radius: 10px; padding: 6px 10px; box-shadow: 0 3px 0 #2a2350; cursor: pointer; }
.vg-toast { position: absolute; left: 50%; top: 45%; transform: translate(-50%, -50%); z-index: 3; font-size: 14px; font-weight: 700; color: #fff; background: #1f8a4c; border: 2px solid #2a2350; border-radius: 12px; padding: 10px 14px; text-align: center; }
.vg-fab[hidden], .vg-zoom[hidden] { display: none; }
.vg-bldg { position: absolute; max-width: none; pointer-events: none; user-select: none; -webkit-user-drag: none; transition: opacity .2s; }
.vg-sky { position: absolute; inset: 0; z-index: 99990; pointer-events: none; mix-blend-mode: multiply; transition: background-color 2s, opacity 2s; }
.vg-night { position: absolute; left: 0; top: 0; z-index: 0; max-width: none; pointer-events: none; opacity: 0; transition: opacity 2.5s; }
.vg-bldg-n { opacity: 0; transition: opacity 2.5s; }
.vg-fx { position: absolute; inset: 0; z-index: 99993; pointer-events: none; }
.vg-spark { position: absolute; width: 5px; height: 5px; margin: -2.5px 0 0 -2.5px; border-radius: 50%; }
.vg-fish { position: absolute; width: 68.5px; height: 64px; background-size: 274px 64px; background-repeat: no-repeat; pointer-events: none; }
.vg-rod { position: absolute; pointer-events: none; overflow: visible; }
.vg-float { animation: vg-float 1.8s ease-in-out infinite; }
@keyframes vg-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(3px); } }
.vg-time { pointer-events: auto; font: inherit; font-size: 12px; font-weight: 700; color: #2a2350; background: rgba(255,250,240,.85); border: 2px solid #2a2350; border-radius: 8px; padding: 2px 8px; cursor: pointer; }
.vg-zoom { position: absolute; right: 10px; top: 10px; z-index: 3; display: flex; flex-direction: column; gap: 6px; }
.vg-zoom button { width: 36px; height: 36px; font: inherit; font-size: 20px; font-weight: 800; line-height: 1; color: #2a2350; background: rgba(255,250,240,.85); border: 2px solid #2a2350; border-radius: 10px; cursor: pointer; }
.vg-stick { position: absolute; left: 12px; bottom: 12px; z-index: 3; width: 104px; height: 104px; border-radius: 50%; background: rgba(255,255,255,.12); border: 2px solid rgba(255,255,255,.55); opacity: .55; transition: opacity .15s; touch-action: none; cursor: grab; }
.vg-stick:active { opacity: .85; }
.vg-knob { position: absolute; left: 50%; top: 50%; width: 46px; height: 46px; margin: -23px 0 0 -23px; border-radius: 50%; background: rgba(255,255,255,.6); border: 2px solid rgba(42,35,80,.45); pointer-events: none; }
.vg-inside { position: absolute; inset: 0; z-index: 1; overflow: hidden; touch-action: none; cursor: pointer; }
.vg-inside[hidden], .vg-sky[hidden], .vg-time[hidden] { display: none; }
.vg-inside { z-index: 2 !important; }
.vg-stage { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
.vg-stage video { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: fill; pointer-events: none; }
.vg-stage video[hidden] { display: none; }
.vg-portal { pointer-events: none; background: #c9f0d2; z-index: 100001; }
.vg-fg { position: absolute; background-repeat: no-repeat; pointer-events: none; transition: opacity .2s; }
.vg-stage img { display: block; max-width: none; width: 100%; height: 100%; user-select: none; -webkit-user-drag: none; pointer-events: none; }
.vg-sheet { border-top: 3px solid #2a2350; padding: 10px 14px 12px; display: grid; gap: 6px; background: #fffaf0; max-height: 58%; overflow-y: auto; }
.vg-sheet[hidden], .vg-in[hidden], .vg-row[hidden], .vg-sheet h2[hidden], .vg-sheet p[hidden] { display: none; }
.vg-sheet .vg-in { padding: 0; }
.vg-sheet h2, .vg-card h2 { margin: 0; font-size: 15px; font-weight: 800; line-height: 1.3; }
.vg-sheet p { margin: 0; font-size: 13px; line-height: 1.45; color: #6d6890; }
.vg-row { display: flex; gap: 8px; flex-wrap: wrap; }
.vg-btn { font: inherit; font-size: 13px; font-weight: 700; color: #2a2350; border: 2px solid #2a2350; border-radius: 10px; padding: 6px 10px; background: #fff; box-shadow: 0 3px 0 #2a2350; cursor: pointer; }
.vg-btn.go { background: #f2b631; }
.vg-btn.tram { background: #1f8a4c; color: #fff; }
.vg-btn:focus-visible, .vg-fab:focus-visible { outline: 3px solid #6c5cff; outline-offset: 2px; }
.vg-room { position: fixed; inset: 0; z-index: 60; background: rgba(42,35,80,.75); display: grid; place-items: center; padding: 16px; overflow-y: auto; }
.vg-room[hidden] { display: none; }
.vg-card { background: #fffaf0; color: #2a2350; border: 3px solid #2a2350; border-radius: 16px; width: 100%; max-width: 520px; overflow: hidden; }
.vg-card img { display: block; width: 100%; max-height: 42vh; object-fit: cover; }
.vg-in { padding: 12px 14px 14px; display: grid; gap: 8px; }
.vg-q { font-size: 14px; background: #fff; border: 2px solid #2a2350; border-radius: 10px; padding: 10px 12px; }
.vg-q button { display: block; margin-top: 6px; padding: 0; border: 0; background: none; font: inherit; font-weight: 800; color: #2a2350; cursor: pointer; text-align: left; }
.vg-tram { position: absolute; width: 0; height: 0; pointer-events: none; }
.vg-tram img { position: absolute; left: 0; top: 0; max-width: none; transform: translate(-50%, -72%); pointer-events: none; user-select: none; -webkit-user-drag: none; filter: drop-shadow(3px 7px 3px rgba(30,25,60,.38)); }
.vg-tram img[hidden] { display: none; }
.vg-say { position: absolute; z-index: 100002; max-width: 190px; width: max-content; font-size: 12px; line-height: 1.35; font-weight: 700; color: #2a2350; background: #fff; border: 2px solid #2a2350; border-radius: 10px; padding: 4px 8px; pointer-events: none; transform: translate(-50%, -100%) scale(var(--vg-iz, 1)); transform-origin: 50% 100%; word-break: break-word; }
.vg-say::after { content: ""; position: absolute; left: 50%; bottom: -7px; margin-left: -6px; border: 6px solid transparent; border-top-color: #2a2350; border-bottom: 0; }
.vg-say.me { background: #fff0f6; }
.vg-log { position: absolute; left: 10px; top: 44px; z-index: 2; display: grid; gap: 3px; max-width: min(260px, 60%); pointer-events: none; }
.vg-log div { font-size: 11px; line-height: 1.35; font-weight: 700; color: #fff; background: rgba(42,35,80,.55); border-radius: 7px; padding: 2px 7px; word-break: break-word; }
.vg-log b { color: #ffd166; font-weight: 800; }
.vg-chatbar { position: absolute; left: 10px; right: 10px; bottom: 10px; z-index: 4; display: flex; gap: 6px; padding: 6px; background: rgba(255,250,240,.95); border: 2px solid #2a2350; border-radius: 12px; }
.vg-chatbar[hidden] { display: none; }
.vg-chatbar input { flex: 1; min-width: 0; font: inherit; font-size: 16px; color: #2a2350; border: 2px solid #2a2350; border-radius: 8px; padding: 4px 8px; background: #fff; }
.vg-chatbar button { font: inherit; font-size: 13px; font-weight: 800; color: #2a2350; border: 2px solid #2a2350; border-radius: 8px; padding: 4px 10px; background: #f2b631; cursor: pointer; }
.vg-chatbar button.x { background: #fff; padding: 4px 8px; }
/* 미니멀: 버튼은 작고 반투명하게 */
.vg-full .vg-chips { left: 52px; top: 10px; gap: 5px; }
.vg-chips { right: 50px; }
.vg-chip, .vg-time { font-size: 11px; font-weight: 700; padding: 3px 8px; border: 0; border-radius: 999px; background: rgba(255,255,255,.78); color: #2a2350; box-shadow: 0 1px 3px rgba(42,35,80,.18); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); }
.vg-chip.gold { background: rgba(242,182,49,.92); }
.vg-zoom { gap: 5px; }
.vg-zoom button { width: 32px; height: 32px; font-size: 18px; border: 0; border-radius: 999px; background: rgba(255,255,255,.78); box-shadow: 0 1px 3px rgba(42,35,80,.18); }
.vg-fab { font-size: 12px; padding: 6px 11px; border: 0; border-radius: 999px; background: rgba(108,92,255,.9); box-shadow: 0 2px 6px rgba(42,35,80,.25); }
.vg-sheet { border-top: 0; border-radius: 18px 18px 0 0; padding: 10px 14px 12px; gap: 5px; box-shadow: 0 -4px 14px rgba(42,35,80,.12); }
.vg-sheet h2 { font-size: 14px; }
.vg-sheet p { font-size: 12px; }
.vg-btn { font-size: 12px; padding: 6px 12px; border: 0; border-radius: 999px; box-shadow: none; background: #f1eef9; }
.vg-btn.go { background: #f2b631; }
.vg-btn.tram { background: #1f8a4c; color: #fff; }
.vg-pin { font-size: 11px; padding: 2px 7px; border-width: 1.5px; border-radius: 999px; box-shadow: 0 2px 0 #2a2350; }
@media (prefers-reduced-motion: reduce) { .vg-target.on { animation: none; } }
`;

  const el = (tag, cls, parent, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  };

  window.startVillage = function (root, cfg) {
    const base = cfg.base || "";
    const ac = new AbortController(), signal = ac.signal;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, stopped = false;

    if (!document.getElementById("vg-style")) { const s = el("style"); s.id = "vg-style"; s.textContent = CSS; document.head.appendChild(s); }
    root.replaceChildren();
    const app = el("div", "vg", root);
    const view = el("div", "vg-view", app);
    view.setAttribute("aria-label", "마을 지도. 조이스틱이나 방향키로 고양이를 움직여요");
    const world = el("div", "vg-world", view);
    world.style.width = W + "px"; world.style.height = H + "px";
    const map = el("img", "vg-map", world);
    map.src = base + "map.jpg?v=3"; map.alt = ""; map.width = W; map.height = H;
    const target = el("div", "vg-target", world);
    const chips = el("div", "vg-chips", view);
    if (typeof cfg.churu === "number") el("span", "vg-chip gold", chips, "🐟 Churu " + cfg.churu);
    if (cfg.friends && cfg.friends.length) el("span", "vg-chip", chips, "🐾 Neighbours " + cfg.friends.length);
    const fab = el("button", "vg-fab", view, "📍 My cat"); fab.type = "button";
    const zoomBox = el("div", "vg-zoom", view);
    const zoomIn = el("button", "", zoomBox, "+"), zoomOut = el("button", "", zoomBox, "−");
    zoomIn.type = zoomOut.type = "button"; zoomIn.setAttribute("aria-label", "지도 확대"); zoomOut.setAttribute("aria-label", "지도 축소");
    // 하늘빛: 실제 시간에 따라 아침·낮·저녁·밤 (버튼으로 바꿔 볼 수 있다)
    // 밤 지도: 같은 지도를 밤으로 다시 그린 그림. 시간에 따라 낮 지도 위에 서서히 겹친다
    const nightMap = el("img", "vg-night", world); nightMap.alt = ""; nightMap.width = W; nightMap.height = H; nightMap.src = base + "map-night.jpg?v=3";
    const sky = el("div", "vg-sky", world);
    let nightLevel = 0, nowTime = "day";
    const dayOnly = [], nightOnly = []; // 낮에만(낚시) / 저녁·밤에만(불꽃놀이) 보이는 것
    const bldgs = []; // 건물 앞그림 (지도를 불러온 뒤 채운다)
    const timeBtn = el("button", "vg-time", chips); timeBtn.type = "button";
    const SKY = {
      // [이름, 덧씌울 색, 색 진하기, 밤 지도 진하기]
      morning: ["🌅 Morning", "rgb(255,214,190)", 0.35, 0.15],
      day: ["☀️ Day", "rgb(255,255,255)", 0, 0],
      evening: ["🌇 Evening", "rgb(255,170,120)", 0.45, 0.45],
      night: ["🌙 Night", "rgb(255,255,255)", 0, 1],
    };
    const ORDER = ["morning", "day", "evening", "night"];
    const timeNow = () => { const h = new Date().getHours(); return h >= 5 && h < 9 ? "morning" : h < 17 ? "day" : h < 19 ? "evening" : "night"; };
    let timeOver = null;
    function paintSky() {
      const t = timeOver || cfg.timeOfDay || timeNow(), [label, color, a, glow] = SKY[t];
      sky.style.backgroundColor = color; sky.style.opacity = String(a);
      nightLevel = glow; nightMap.style.opacity = String(glow); nowTime = t;
      const dark = t === "evening" || t === "night";
      for (const e of dayOnly) e.style.display = dark ? "none" : "";
      for (const e of nightOnly) e.style.display = dark ? "" : "none";
      for (const b of bldgs) if (b.night) b.night.style.opacity = String(glow);
      timeBtn.textContent = label;
    }
    paintSky();
    const skyTimer = setInterval(paintSky, 60000);
    signal.addEventListener("abort", () => clearInterval(skyTimer));
    timeBtn.addEventListener("pointerdown", (e) => e.stopPropagation(), { signal });
    timeBtn.addEventListener("click", (e) => { e.stopPropagation(); const cur = timeOver || timeNow(); timeOver = ORDER[(ORDER.indexOf(cur) + 1) % ORDER.length]; paintSky(); }, { signal });
    // 채팅 버튼 · 배경음악 버튼 (시간 버튼 옆)
    const chatBtn = el("button", "vg-time", chips, "💬 Chat"); chatBtn.type = "button";
    const musicBtn = el("button", "vg-time", chips); musicBtn.type = "button";
    const log = el("div", "vg-log", view);
    const chatBar = el("form", "vg-chatbar", view); chatBar.hidden = true;
    const chatIn = el("input", "", chatBar); chatIn.maxLength = 80; chatIn.placeholder = "Say something in English!"; chatIn.setAttribute("aria-label", "채팅 입력"); chatIn.enterKeyHint = "send";
    const chatSend = el("button", "", chatBar, "Send"); chatSend.type = "submit";
    const chatX = el("button", "x", chatBar, "✕"); chatX.type = "button"; chatX.setAttribute("aria-label", "채팅 닫기");
    for (const b of [chatBtn, musicBtn, chatBar]) b.addEventListener("pointerdown", (e) => e.stopPropagation(), { signal });
    chatBtn.addEventListener("click", (e) => { e.stopPropagation(); chatBar.hidden = !chatBar.hidden; if (!chatBar.hidden) chatIn.focus(); }, { signal });
    chatX.addEventListener("click", () => { chatBar.hidden = true; }, { signal });
    // 배경음악: 직접 만든 왈츠. 학생이 켜야 나온다 (켜 둔 사람은 다음에 화면을 누르면 다시 켜짐)
    const bgm = new Audio(base + "bgm.mp3?v=1"); bgm.loop = true; bgm.volume = 0.35; bgm.preload = "none";
    let musicOn = false; try { musicOn = localStorage.getItem("vg-bgm") === "1"; } catch {}
    const paintMusic = () => { musicBtn.textContent = musicOn ? "🔊 Music" : "🔇 Music"; musicBtn.setAttribute("aria-pressed", String(musicOn)); };
    const playMusic = () => { if (musicOn && !stopped) bgm.play().catch(() => {}); };
    paintMusic();
    musicBtn.addEventListener("click", (e) => {
      e.stopPropagation(); musicOn = !musicOn; paintMusic();
      try { localStorage.setItem("vg-bgm", musicOn ? "1" : "0"); } catch {}
      if (musicOn) playMusic(); else bgm.pause();
    }, { signal });
    view.addEventListener("pointerdown", () => { if (musicOn && bgm.paused) playMusic(); }, { signal });
    const inside = el("div", "vg-inside", view); inside.hidden = true;
    const stick = el("div", "vg-stick", view), knob = el("div", "vg-knob", stick);
    stick.setAttribute("aria-label", "고양이 움직이기. 끌어서 조종해요. 키보드 방향키도 돼요");
    const stage = el("div", "vg-stage", inside);
    const stageImg = el("img", "", stage); stageImg.alt = "";
    const stageVideo = el("video", "", stage); stageVideo.muted = true; stageVideo.loop = true; stageVideo.playsInline = true; stageVideo.hidden = true;
    const sheet = el("section", "vg-sheet", app); sheet.setAttribute("aria-live", "polite");
    const sTitle = el("h2", "", sheet), sDesc = el("p", "", sheet), sAct = el("div", "vg-row", sheet);
    const room = el("div", "vg-room", app); room.hidden = true;
    const card = el("div", "vg-card", room);
    const rImg = el("img", "", card);
    const rIn = el("div", "vg-in", card);
    const rTitle = el("h2", "", rIn), rQ = el("div", "vg-q", rIn), rSpeak = el("div", "", rIn), rAct = el("div", "vg-row", rIn);
    // 말하기 칸은 앱이 채운다 (미리보기에는 없다)
    let leaveInside = null;
    function closeRoom() {
      room.hidden = true;
      if (leaveInside) leaveInside();
      if (cfg.onRoomClose) cfg.onRoomClose();
    }

    const pickZoom = () => {
      const vw = view.clientWidth, vh = view.clientHeight;
      return Math.max(cfg.zoom || (vw < 640 ? 0.75 : 1), vw / W, vh / H);
    };
    let zoom = 1, userZoom = 1; // 학생이 고른 배율 (1~3배)
    function setZoom() { zoom = pickZoom() * userZoom; world.style.setProperty("--vg-iz", String(1 / zoom)); }

    const walkImg = new Image();
    walkImg.onload = () => { if (!stopped) begin(walkImg); };
    walkImg.src = base + "walk.png?v=6";

    let worldNav = null;
    function begin(mk) {
      // 서로 이어진 가장 큰 길망만 남긴다
      function keepLargest(WALK, GW, GH) {
        const comp = new Int32Array(GW * GH), q = new Int32Array(GW * GH); let best = 0, bestId = 0, id = 0;
        for (let s0 = 0; s0 < GW * GH; s0++) {
          if (!WALK[s0] || comp[s0]) continue; id++; let h = 0, t = 0; q[t++] = s0; comp[s0] = id;
          while (h < t) { const i = q[h++], x = i % GW, y = (i / GW) | 0;
            for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + dx, ny = y + dy;
              if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) continue; const j = ny * GW + nx;
              if (WALK[j] && !comp[j]) { comp[j] = id; q[t++] = j; } } }
          if (t > best) { best = t; bestId = id; }
        }
        for (let i = 0; i < GW * GH; i++) if (comp[i] !== bestId) WALK[i] = 0;
      }
      // 걷기 지도 하나로 길찾기 도구를 만든다
      function makeNav(WALK, GW, GH, MS) {
      const ok = (gx, gy) => gx >= 0 && gy >= 0 && gx < GW && gy < GH && WALK[gy * GW + gx] === 1;
      function nearestWalk(x, y) {
        const gx0 = Math.round(x / MS), gy0 = Math.round(y / MS);
        for (let r = 0; r < 60; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          if (ok(gx0 + dx, gy0 + dy)) return { gx: gx0 + dx, gy: gy0 + dy };
        }
        return null;
      }
      // 길찾기 (A*)
      function path(x0, y0, x1, y1) {
        const s = nearestWalk(x0, y0), t = nearestWalk(x1, y1);
        if (!s || !t) return null;
        const N = GW * GH, g = new Float32Array(N).fill(Infinity), from = new Int32Array(N).fill(-1), done = new Uint8Array(N);
        const heap = []; const push = (i, f) => { heap.push([f, i]); let k = heap.length - 1; while (k > 0) { const p = (k - 1) >> 1; if (heap[p][0] <= heap[k][0]) break; [heap[p], heap[k]] = [heap[k], heap[p]]; k = p; } };
        const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let k = 0; for (;;) { const l = 2 * k + 1, r = l + 1; let m = k; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === k) break; [heap[m], heap[k]] = [heap[k], heap[m]]; k = m; } } return top; };
        const si = s.gy * GW + s.gx, ti = t.gy * GW + t.gx, h = (i) => Math.hypot(i % GW - t.gx, ((i / GW) | 0) - t.gy);
        g[si] = 0; push(si, h(si)); let n = 0;
        while (heap.length && n++ < 400000) {
          const [, i] = pop(); if (done[i]) continue; done[i] = 1; if (i === ti) break;
          const ix = i % GW, iy = (i / GW) | 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue; const nx = ix + dx, ny = iy + dy; if (!ok(nx, ny)) continue;
            if (dx && dy && (!ok(ix + dx, iy) || !ok(ix, iy + dy))) continue; // 모서리 뚫고 지나가지 않기
            const j = ny * GW + nx, c = g[i] + (dx && dy ? 1.414 : 1);
            if (c < g[j]) { g[j] = c; from[j] = i; push(j, c + h(j)); }
          }
        }
        if (from[ti] === -1 && ti !== si) return null;
        const pts = []; for (let i = ti; i !== -1; i = from[i]) pts.push({ x: (i % GW) * MS + MS / 2, y: ((i / GW) | 0) * MS + MS / 2 });
        pts.reverse();
        // 직선으로 갈 수 있는 점은 건너뛰기
        const clear = (a, b) => { const d = Math.hypot(b.x - a.x, b.y - a.y), n = Math.ceil(d / (MS / 2)); for (let k = 1; k < n; k++) { const x = a.x + (b.x - a.x) * k / n, y = a.y + (b.y - a.y) * k / n; if (!ok(Math.floor(x / MS), Math.floor(y / MS))) return false; } return true; };
        const out = [pts[0]]; let a = 0;
        while (a < pts.length - 1) { let b = pts.length - 1; while (b > a + 1 && !clear(pts[a], pts[b])) b--; out.push(pts[b]); a = b; }
        return out;
      }

        return { ok, nearestWalk, path, ms: MS, gw: GW, gh: GH };
      }
      // 마을 지도에서 걸을 수 있는 곳
      const GW = mk.width, GH = mk.height;
      const cv = document.createElement("canvas"); cv.width = GW; cv.height = GH;
      const cx = cv.getContext("2d"); cx.drawImage(mk, 0, 0);
      const px = cx.getImageData(0, 0, GW, GH).data, WALK = new Uint8Array(GW * GH);
      for (let i = 0; i < GW * GH; i++) WALK[i] = px[i * 4] > 127 ? 1 : 0;
      keepLargest(WALK, GW, GH);
      const { nearestWalk } = (worldNav = makeNav(WALK, GW, GH, MS));
      // 내부 맵 걷기 지도: 바닥 다각형에서 가구를 뺀다
      const inPoly = (poly, x, y) => { let on = false; for (let i = 0, j = poly.length - 2; i < poly.length; j = i, i += 2) { const xi = poly[i], yi = poly[i + 1], xj = poly[j], yj = poly[j + 1]; if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) on = !on; } return on; };
      const ROOM_MS = 10;
      function roomNav(r) {
        if (r.nav) return r.nav;
        if (r.maskImg) {
          // 걷기 지도 그림 (한 칸 = ROOM_MS px, 밝은 칸 = 바닥)
          const gw = r.maskImg.naturalWidth, gh = r.maskImg.naturalHeight, cv = document.createElement("canvas");
          cv.width = gw; cv.height = gh; const cx = cv.getContext("2d"); cx.drawImage(r.maskImg, 0, 0);
          const px = cx.getImageData(0, 0, gw, gh).data, w = new Uint8Array(gw * gh);
          for (let i = 0; i < gw * gh; i++) w[i] = px[i * 4] > 127 ? 1 : 0;
          keepLargest(w, gw, gh);
          return (r.nav = makeNav(w, gw, gh, ROOM_MS));
        }
        const gw = Math.ceil(r.w / ROOM_MS), gh = Math.ceil(r.h / ROOM_MS), w = new Uint8Array(gw * gh);
        for (let gy = 0; gy < gh; gy++) for (let gx = 0; gx < gw; gx++) {
          const x = gx * ROOM_MS + ROOM_MS / 2, y = gy * ROOM_MS + ROOM_MS / 2;
          if (r.floor.some((p) => inPoly(p, x, y)) && !(r.block || []).some((p) => inPoly(p, x, y))) w[gy * gw + gx] = 1;
        }
        keepLargest(w, gw, gh);
        return (r.nav = makeNav(w, gw, gh, ROOM_MS));
      }

      // 8방향: 그림은 S·SE·E·NE·N 5방향, 왼쪽 3방향은 좌우로 뒤집어서 쓴다
      const DIR8 = [["E",1],["SE",1],["S",1],["SE",-1],["E",-1],["NE",-1],["N",1],["NE",1]];
      const dirFor = (dx, dy) => DIR8[(Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8];

      function setDir(c, dir, flip) {
        if (c.dir === dir && c.flip === flip && c.w) return;
        const art = ART_DIR[dir] || dir;
        const [w] = META[`${c.breed}-${art}`];
        c.dir = dir; c.art = art; c.flip = flip; c.w = w;
        c.img.style.width = w + "px"; c.img.style.height = FRAME + "px";
        c.img.style.backgroundImage = `url(${base}c/${c.breed}-${art}.webp?v=7)`;
      }
      function draw(c) {
        // 걸은 거리만큼 그림을 넘긴다 (발이 미끄러져 보이지 않게)
        const n = META[`${c.breed}-${c.art}`][1];
        const f = c.walking ? Math.floor(c.dist / (STEP * c.scale / SCALE)) % n : REST[`${c.breed}-${c.art}`];
        c.img.style.backgroundPosition = `${-f * c.w}px 0`;
        let sx = 1, sy = 1;
        if (!c.walking && !reduce) { const b = Math.sin(c.clock * 2.4); sy = 1 + b * 0.018; sx = 1 - b * 0.01; }
        c.root.style.left = c.x + "px"; c.root.style.top = c.y + "px"; c.root.style.zIndex = Math.round(c.y) + 2;
        c.bob.style.transform = `translate(-50%, -100%) scale(${c.flip * sx * c.scale}, ${sy * c.scale})`;
        if (c.tag) { c.tag.style.left = c.x + "px"; c.tag.style.top = c.y + "px"; c.tag.style.zIndex = 100000; }
      }
      function cat(breed, x, y, name, isMe, place) {
        const parent = place ? place.parent : world;
        const r = el("div", "vg-cat", parent), shadow = el("div", "vg-shadow", r), bob = el("div", "vg-bob", r), img = el("div", "vg-img", bob);
        const tag = name ? el("div", "vg-tag" + (isMe ? " me" : ""), parent, name) : null;
        const c = { scale: place ? place.scale : SCALE, nav: place ? place.nav : worldNav, breed, x, y, root: r, shadow, bob, img, tag, dir: "S", flip: 1, clock: 0, dist: 0, walking: false, route: [], then: null, speed: isMe ? 80 : 30, idleT: Math.random() * 3 };
        if (place) shadow.style.transform = `translate(-50%, -50%) scale(${place.scale / SCALE})`;
        setDir(c, "S", 1); draw(c); return c;
      }
      function goTo(c, x, y, then) {
        const r = c.nav.path(c.x, c.y, x, y);
        if (!r) return false;
        if (!c.walking) c.dist = 0;
        c.route = r.slice(1); c.then = then || null; c.walking = c.route.length > 0;
        if (!c.walking && c.then) { const f = c.then; c.then = null; f(); }
        return true;
      }
      function step(c, dt) {
        c.clock += dt;
        if (c.route.length) {
          const d0 = c.route[0], dx = d0.x - c.x, dy = d0.y - c.y, d = Math.hypot(dx, dy), s = c.speed * dt;
          c.dist += Math.min(d, s);
          if (d > 0.5) { const [dd, fl] = dirFor(dx, dy); setDir(c, dd, fl); }
          if (d <= s) {
            c.x = d0.x; c.y = d0.y; c.route.shift();
            if (!c.route.length) {
              c.walking = false;
              if (c.dir === "N" || c.dir === "NE") setDir(c, c.dir === "N" ? "S" : "SE", c.flip);
              if (c.then) { const f = c.then; c.then = null; f(); }
            }
          } else { c.x += (dx / d) * s; c.y += (dy / d) * s; }
        }
        draw(c);
      }

      // 이름표
      const pins = new Map();
      for (const p of PLACES) {
        const b = el("button", "vg-pin", world, p.name); b.type = "button";
        b.style.left = p.x + "px"; b.style.top = p.top + "px";
        b.addEventListener("pointerdown", (e) => e.stopPropagation(), { signal });
        b.addEventListener("click", (e) => { e.stopPropagation(); select(p, true); }, { signal });
        pins.set(p.id, b);
      }

      const spot = (id, dx, dy) => { const p = PLACES.find((q) => q.id === id), w = nearestWalk(p.x + dx, p.y + dy); return { x: w.gx * MS + 4, y: w.gy * MS + 4 }; };
      // 이웃 고양이: 자기 동네 길 위를 천천히 돌아다닌다
      const friends = (cfg.friends || []).slice(0, FRIEND_SPOTS.length).map((f, i) => {
        const h = spot(FRIEND_SPOTS[i], 40, 50);
        return Object.assign(cat(BREEDS.includes(f.breed) ? f.breed : "gray", h.x, h.y, f.name, false), { home: h });
      });
      // 건물 앞그림: 고양이가 건물 뒤(위쪽)에 있으면 건물이 고양이를 가린다
      fetch(base + "b/list.json?v=2").then((r) => r.json()).then((list) => {
        if (stopped) return;
        for (const b of list) {
          const im = el("img", "vg-bldg", world); im.src = `${base}b/${b.i}.webp?v=3`; im.alt = "";
          const nim = el("img", "vg-bldg vg-bldg-n", world); nim.src = `${base}b/n${b.i}.webp?v=3`; nim.alt = "";
          for (const x of [im, nim]) { x.style.left = b.x + "px"; x.style.top = b.y + "px"; x.style.width = b.w + "px"; x.style.height = b.h + "px"; x.style.zIndex = String(b.z); }
          nim.style.opacity = String(nightLevel);
          bldgs.push({ ...b, el: im, night: nim });
        }
      }).catch(() => {});

      // 부두 끝에서 낚시하는 고양이 (아침·낮): 기다리기 → 입질 → 끌어올리기 → 물고기!
      const fishBox = el("div", "vg-fish", world); fishBox.style.left = "2565px"; fishBox.style.top = "1353px"; fishBox.style.zIndex = "1420"; fishBox.style.backgroundImage = `url(${base}fish.webp?v=1)`;
      const fishLine = document.createElementNS("http://www.w3.org/2000/svg", "svg"); fishLine.setAttribute("class", "vg-rod");
      fishLine.setAttribute("width", "20"); fishLine.setAttribute("height", "40"); fishLine.style.left = "2622px"; fishLine.style.top = "1414px"; fishLine.style.zIndex = "1419";
      fishLine.innerHTML = '<line x1="8.5" y1="0" x2="8.5" y2="28" stroke="#3a2a30" stroke-width="0.8"/><g class="vg-float"><circle cx="8.5" cy="30" r="3.2" fill="#e3342f" stroke="#2a2350" stroke-width="0.8"/><rect x="5.5" y="30" width="6" height="2.2" fill="#fff"/></g>';
      world.appendChild(fishLine);
      dayOnly.push(fishBox, fishLine);
      const FISH_STEPS = [[0, 0], [1, 0.9], [2, 0.6], [3, 1.8]];
      const fishState = { step: 0, t: 4 };
      function stepFisher(dt) {
        const f = fishState; f.t -= dt;
        if (f.t <= 0) { f.step = (f.step + 1) % 4; f.t = f.step === 0 ? 4 + Math.random() * 5 : FISH_STEPS[f.step][1]; }
        fishBox.style.backgroundPosition = `${-FISH_STEPS[f.step][0] * 68.5}px 0`;
        fishLine.style.visibility = f.step <= 1 ? "" : "hidden";
        fishLine.style.transform = f.step === 1 ? `translateY(${2 + Math.sin(performance.now() / 60) * 1.5}px)` : "";
      }
      // 해변에서 불꽃놀이하는 고양이 (저녁·밤)
      const firer = cat("cheese", 2318, 1262, "", false);
      const fx = el("div", "vg-fx", world);
      nightOnly.push(firer.root, fx);
      const COLORS = ["#ffd166", "#ff6b9a", "#7bdff2", "#b9fbc0", "#f15bb5", "#fee440", "#ffffff"];
      function firework() {
        if (stopped || (reduce && !cfg.forceMotion) || (nowTime !== "evening" && nowTime !== "night")) return;
        const sx = 2330, sy = 1238, ex = 2440 + Math.random() * 260, ey = 1070 + Math.random() * 140, col = COLORS[(Math.random() * COLORS.length) | 0];
        const rocket = el("div", "vg-spark", fx); rocket.style.background = "#fff3c4"; rocket.style.left = sx + "px"; rocket.style.top = sy + "px";
        rocket.animate([{ transform: "translate(0,0)", opacity: 1 }, { transform: `translate(${ex - sx}px,${ey - sy}px)`, opacity: 0.9 }], { duration: 750, easing: "ease-out" }).onfinish = () => {
          rocket.remove();
          for (let i = 0; i < 26; i++) {
            const a = (i / 26) * Math.PI * 2, r = 65 + Math.random() * 45, p = el("div", "vg-spark", fx);
            p.style.background = Math.random() < 0.25 ? "#ffffff" : col; p.style.boxShadow = `0 0 6px ${col}`; p.style.left = ex + "px"; p.style.top = ey + "px";
            p.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: `translate(${Math.cos(a) * r}px,${Math.sin(a) * r + 18}px) scale(.4)`, opacity: 0 }], { duration: 1300 + Math.random() * 400, easing: "cubic-bezier(.2,.7,.4,1)" }).onfinish = () => p.remove();
          }
        };
      }
      const fwTimer = setInterval(() => { if (Math.random() < 0.8) firework(); }, 1600);
      signal.addEventListener("abort", () => clearInterval(fwTimer));
      paintSky();

      // 동네 고양이: 길 위 아무 곳에서 시작해 쉬었다 걸었다 한다
      const townCats = [];
      for (let i = 0, tries = 0; i < TOWN_CATS && tries < 4000; tries++) {
        const gx = Math.floor(Math.random() * GW), gy = Math.floor(Math.random() * GH);
        if (!worldNav.ok(gx, gy)) continue;
        const c = cat(TOWN_BREEDS[i % TOWN_BREEDS.length], gx * MS + 4, gy * MS + 4, "", false);
        c.speed = 22 + Math.random() * 18; c.idleT = Math.random() * 6;
        townCats.push(c); i++;
      }
      const start = spot("station", 0, 50);
      const me = cat(BREEDS.includes(cfg.breed) ? cfg.breed : "cheese", start.x, start.y, cfg.myName || "Me", true);

      // 카메라: 내 고양이를 화면 가운데 근처에 두고 부드럽게 따라간다
      const cam = { x: me.x, y: me.y }; let follow = true;
      function apply() {
        const vw = view.clientWidth / zoom, vh = view.clientHeight / zoom;
        cam.x = Math.min(Math.max(cam.x, vw / 2), W - vw / 2); cam.y = Math.min(Math.max(cam.y, vh / 2), H - vh / 2);
        world.style.transform = `scale(${zoom}) translate(${Math.round(vw / 2 - cam.x)}px, ${Math.round(vh / 2 - cam.y)}px)`;
      }
      function walkTo(x, y, then) {
        follow = true;
        if (!goTo(me, x, y, then)) return;
        const last = me.route[me.route.length - 1] || me;
        target.style.left = last.x + "px"; target.style.top = last.y + "px";
        target.classList.remove("on"); void target.offsetWidth; target.classList.add("on");
      }

      // 트램: 왼쪽 아래에서 들어와 역 앞에 잠깐 서고, 성당 옆 선로로 돌아 성당 뒤로 사라진다.
      // 조금 뒤 타워 뒤에서 다시 나와 루나파크 앞을 돌아 해변 쪽 아래로 빠져나간다 (마을 한 바퀴)
      const TRAM_LEGS = [
        // 선로 가운데를 따라 (지도에 그려진 선로를 따라 잡은 점)
        [[-220, 1688], [1150, 958, 4], [1250, 905], [1400, 825], [1500, 770], [1560, 730], [1590, 685], [1585, 635], [1560, 590], [1530, 550], [1495, 515]],
        [[1700, 840], [1850, 930], [1950, 980], [2035, 1030], [2065, 1070], [2065, 1105], [2025, 1140], [1950, 1180], [1850, 1230], [1750, 1275], [1650, 1320], [900, 1660]],
      ];
      const tram = el("div", "vg-tram", world), tImg = {};
      for (const k of ["a", "b", "an", "bn"]) { const im = el("img", "", tram); im.src = `${base}tram/${k}.webp?v=1`; im.alt = ""; im.hidden = true; tImg[k] = im; }
      // 꺾이는 곳을 둥글게 다듬은 촘촘한 길 (Chaikin), 멈추는 곳(역)은 거리로 기억
      function smoothLeg(pts) {
        let P = pts.map((q) => [q[0], q[1]]);
        for (let it = 0; it < 4; it++) {
          const Q = [P[0]];
          for (let i = 0; i < P.length - 1; i++) { const [x0, y0] = P[i], [x1, y1] = P[i + 1]; Q.push([x0 * 0.75 + x1 * 0.25, y0 * 0.75 + y1 * 0.25], [x0 * 0.25 + x1 * 0.75, y0 * 0.25 + y1 * 0.75]); }
          Q.push(P[P.length - 1]); P = Q;
        }
        const S = [{ x: P[0][0], y: P[0][1], d: 0 }];
        for (let i = 1; i < P.length; i++) { const l = S[S.length - 1]; S.push({ x: P[i][0], y: P[i][1], d: l.d + Math.hypot(P[i][0] - l.x, P[i][1] - l.y) }); }
        const len = S[S.length - 1].d;
        const stops = [{ d: 0, wait: 0 }];
        for (const q of pts) if (q[2]) { let best = 0, bd = 1e9; for (const s of S) { const dd = Math.hypot(s.x - q[0], s.y - q[1]); if (dd < bd) { bd = dd; best = s.d; } } stops.push({ d: best, wait: q[2] }); }
        stops.push({ d: len, wait: 0 });
        return { S, len, stops };
      }
      const tramLegs = TRAM_LEGS.map(smoothLeg);
      function at(L, d) {
        const S = L.S; d = Math.max(0, Math.min(L.len, d));
        let lo = 0, hi = S.length - 1;
        while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].d <= d) lo = m; else hi = m; }
        const f = (d - S[lo].d) / Math.max(1e-6, S[hi].d - S[lo].d);
        return { x: S[lo].x + (S[hi].x - S[lo].x) * f, y: S[lo].y + (S[hi].y - S[lo].y) * f };
      }
      const tramState = { leg: 0, d: 0, wait: 0, rest: 3, stop: 1, waited: false };
      for (const k in tImg) tImg[k].hidden = false;
      function stepTram(dt) {
        const t = tramState;
        if (t.rest > 0) { t.rest -= dt; tram.style.display = "none"; return; }
        const L = tramLegs[t.leg];
        const next = L.stops[t.stop], prev = L.stops[t.stop - 1];
        if (t.wait > 0) t.wait -= dt;
        else {
          // 출발할 때 천천히 빨라지고, 역·끝에 다가가면 천천히 느려진다
          const v = 40 * Math.min(1, Math.max(0.18, Math.sqrt((t.d - prev.d) / 120)), Math.max(0.12, Math.sqrt((next.d - t.d) / 140)));
          t.d += v * dt;
          if (t.d >= next.d) {
            t.d = next.d;
            if (t.stop < L.stops.length - 1) { t.wait = next.wait; t.stop++; }
            else { t.leg = (t.leg + 1) % tramLegs.length; t.d = 0; t.stop = 1; t.rest = t.leg ? 6 : 14 + Math.random() * 10; return; }
          }
        }
        const p = at(L, t.d), p0 = at(L, t.d - 45), p1 = at(L, t.d + 45);
        // 진행 방향에 따라 두 그림(／, ＼)을 서서히 바꿔 그린다
        const tx = p1.x - p0.x, ty = p1.y - p0.y, n2 = tx * tx + ty * ty || 1;
        const wa = Math.max(0, Math.min(1, 0.5 - (tx * ty / n2) * 4)), wb = 1 - wa;
        const vis = Math.max(0, Math.min(1, t.d / 70, (L.len - t.d) / 90));
        tImg.a.style.opacity = String(wa); tImg.b.style.opacity = String(wb);
        tImg.an.style.opacity = String(wa * nightLevel); tImg.bn.style.opacity = String(wb * nightLevel);
        tram.style.opacity = String(vis);
        const rumble = t.wait > 0 ? 0 : Math.sin(performance.now() / 160) * 0.35;
        tram.style.display = ""; tram.style.left = p.x + "px"; tram.style.top = (p.y + rumble) + "px"; tram.style.zIndex = String(Math.round(p.y) + 30);
      }

      // 채팅: 보낸 말은 내 고양이 위에 말풍선으로, 다른 학생 말은 화면 왼쪽 위 목록에 (이웃 고양이면 그 고양이 위에도)
      const bubbles = [];
      function bubble(c, text, mine) {
        const old = bubbles.findIndex((b) => b.c === c); if (old >= 0) { bubbles[old].el.remove(); bubbles.splice(old, 1); }
        const b = el("div", "vg-say" + (mine ? " me" : ""), world, text);
        bubbles.push({ c, el: b, t: 7 });
      }
      const seenMsg = new Set();
      function say(msg) {
        if (stopped) return;
        const key = msg.id || `${msg.at}|${msg.name}|${msg.text}`;
        if (seenMsg.has(key)) return; seenMsg.add(key);
        const line = el("div", "", log); el("b", "", line, msg.name + " "); line.append(msg.text);
        while (log.children.length > 4) log.firstChild.remove();
        setTimeout(() => line.remove(), 20000);
        const who = msg.mine ? me : friends.find((f) => f.tag && f.tag.textContent === msg.name);
        if (who) bubble(who, msg.text, msg.mine);
      }
      chatBar.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = chatIn.value.replace(/\s+/g, " ").trim().slice(0, 80); if (!text) return;
        chatIn.value = "";
        if (cfg.onChat) cfg.onChat(text);
        else say({ name: cfg.myName || "Me", breed: cfg.breed, text, mine: true, at: new Date().toISOString() });
      }, { signal });

      let lastT = performance.now(), inCat = null;
      // 조이스틱·방향키로 직접 움직이기: 막히면 벽을 따라 미끄러진다
      const pad = { x: 0, y: 0 }, keys = new Set();
      let manual = false;
      function steer(c, dt) {
        const held = new Set([...keys].map((k) => KEYS[k]));
        const kx = (held.has("r") ? 1 : 0) - (held.has("l") ? 1 : 0), ky = (held.has("d") ? 1 : 0) - (held.has("u") ? 1 : 0);
        let vx = pad.x + kx, vy = pad.y + ky;
        const m = Math.hypot(vx, vy);
        if (m < 0.08) {
          if (manual) {
            manual = false; c.walking = false;
            if (c.dir === "N" || c.dir === "NE") setDir(c, c.dir === "N" ? "S" : "SE", c.flip);
          }
          return;
        }
        if (m > 1) { vx /= m; vy /= m; }
        manual = true; follow = true; c.route = []; c.then = null; c.walking = true;
        const s = c.speed * dt, nx = c.x + vx * s, ny = c.y + vy * s, cell = (v) => Math.floor(v / c.nav.ms);
        const px = c.x, py = c.y;
        if (c.nav.ok(cell(nx), cell(ny))) { c.x = nx; c.y = ny; }
        else if (c.nav.ok(cell(nx), cell(c.y))) c.x = nx;
        else if (c.nav.ok(cell(c.x), cell(ny))) c.y = ny;
        c.dist += Math.hypot(c.x - px, c.y - py);
        const [dd, fl] = dirFor(vx, vy); setDir(c, dd, fl);
      }
      stick.addEventListener("pointerdown", (e) => {
        e.stopPropagation(); e.preventDefault();
        try { stick.setPointerCapture(e.pointerId); } catch {}
        const b = stick.getBoundingClientRect(), R = b.width / 2;
        const update = (ev) => {
          let dx = (ev.clientX - b.left - R) / R, dy = (ev.clientY - b.top - R) / R;
          const m = Math.hypot(dx, dy); if (m > 1) { dx /= m; dy /= m; }
          pad.x = dx; pad.y = dy;
          knob.style.transform = `translate(${dx * (R - 20)}px, ${dy * (R - 20)}px)`;
        };
        const end = () => {
          pad.x = 0; pad.y = 0; knob.style.transform = "";
          stick.removeEventListener("pointermove", update);
          stick.removeEventListener("pointerup", end);
          stick.removeEventListener("pointercancel", end);
        };
        stick.addEventListener("pointermove", update);
        stick.addEventListener("pointerup", end);
        stick.addEventListener("pointercancel", end);
        update(e);
      }, { signal });
      const KEYS = { ArrowLeft: "l", ArrowRight: "r", ArrowUp: "u", ArrowDown: "d", a: "l", d: "r", w: "u", s: "d", A: "l", D: "r", W: "u", S: "d" };
      addEventListener("keydown", (e) => {
        const k = KEYS[e.key], t = e.target;
        if (!k || !room.hidden || (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
        keys.add(e.key); e.preventDefault();
      }, { signal });
      // PC: 방향키(또는 WASD)로도 움직인다는 안내를 잠깐 보여 준다
      if (matchMedia("(pointer: fine)").matches) {
        const hint = el("div", "vg-toast", view, "⌨️ Use the arrow keys (↑↓←→) to move");
        hint.style.top = "auto"; hint.style.bottom = "60px"; hint.style.fontSize = "13px"; hint.style.background = "#6c5cff";
        setTimeout(() => hint.remove(), 6000);
      }
      addEventListener("keyup", (e) => { keys.delete(e.key); if (e.key.length === 1) { keys.delete(e.key.toLowerCase()); keys.delete(e.key.toUpperCase()); } }, { signal });
      addEventListener("blur", () => keys.clear(), { signal });

      function tick(now) {
        if (stopped) return;
        const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
        steer(inCat || me, dt);
        if (inCat) {
          step(inCat, dt); if (curRoom && curRoom.view) fitStage(curRoom);
          for (const c of roomNpcs) {
            if (!c.route.length) { c.idleT -= dt; if (c.idleT <= 0) { c.idleT = 1.5 + Math.random() * 5; const a = Math.random() * Math.PI * 2, d = 80 + Math.random() * 260; goTo(c, c.x + Math.cos(a) * d, c.y + Math.sin(a) * d * 0.6); } }
            step(c, dt);
          }
          for (const q of roomPortals) {
            const d = Math.hypot(inCat.x - q.x, inCat.y - q.y);
            if (portalLock) { if (d > 110 && roomPortals.every((o) => Math.hypot(inCat.x - o.x, inCat.y - o.y) > 110)) portalLock = false; }
            else if (d < 45) { goPortal(q); break; }
          }
          if (!inCat) { raf = requestAnimationFrame(tick); return; }
          for (const f of roomFg) {
            const behind = inCat.y < f.z && inCat.y > f.y - 20 && inCat.x > f.x - 30 && inCat.x < f.x + f.w + 30;
            if (behind !== f.faded) { f.faded = behind; f.el.style.opacity = behind ? "0.4" : ""; }
          }
        } else step(me, dt);
        stepFisher(dt); step(firer, dt);
        stepTram(dt);
        for (let i = bubbles.length - 1; i >= 0; i--) {
          const b = bubbles[i]; b.t -= dt;
          if (b.t <= 0) { b.el.remove(); bubbles.splice(i, 1); continue; }
          b.el.style.left = b.c.x + "px"; b.el.style.top = (b.c.y - 50) + "px";
        }
        for (const f of friends) {
          if (!f.route.length) { f.idleT -= dt; if (f.idleT <= 0) { f.idleT = 2 + Math.random() * 4; const r = 40 + Math.random() * 90, a = Math.random() * Math.PI * 2; goTo(f, f.home.x + Math.cos(a) * r, f.home.y + Math.sin(a) * r * 0.6); } }
          step(f, dt);
        }
        // 내 고양이가 건물 뒤에 숨으면 그 건물을 반투명하게
        if (!inCat) for (const b of bldgs) {
          const behind = me.y + 2 < b.z && me.y > b.y && me.x > b.x && me.x < b.x + b.w;
          b.el.style.opacity = behind ? "0.45" : "";
          if (b.night) b.night.style.opacity = behind ? String(nightLevel * 0.45) : String(nightLevel);
        }
        // 길찾기는 한 프레임에 한 마리만 (휴대폰 부담 줄이기)
        let pathBudget = 1;
        const halfW = view.clientWidth / zoom / 2 + 120, halfH = view.clientHeight / zoom / 2 + 120;
        for (const c of townCats) {
          if (!c.route.length) {
            c.idleT -= dt;
            if (c.idleT <= 0 && pathBudget > 0) {
              pathBudget--; c.idleT = 1.5 + Math.random() * 6;
              const r = 60 + Math.random() * 180, a = Math.random() * Math.PI * 2;
              goTo(c, c.x + Math.cos(a) * r, c.y + Math.sin(a) * r * 0.6);
            }
          }
          // 화면 밖이면 그리지 않고 위치만 옮긴다
          const seen = Math.abs(c.x - cam.x) < halfW && Math.abs(c.y - cam.y) < halfH;
          c.root.style.display = seen ? "" : "none";
          if (seen) step(c, dt);
          else if (c.route.length) { const d0 = c.route[0], dx = d0.x - c.x, dy = d0.y - c.y, d = Math.hypot(dx, dy), m = c.speed * dt; if (d <= m) { c.x = d0.x; c.y = d0.y; c.route.shift(); if (!c.route.length) c.walking = false; } else { c.x += (dx / d) * m; c.y += (dy / d) * m; } }
        }
        if (follow) { cam.x += (me.x - cam.x) * Math.min(1, dt * 4); cam.y += (me.y - cam.y) * Math.min(1, dt * 4); }
        apply(); raf = requestAnimationFrame(tick);
      }
      setZoom(); raf = requestAnimationFrame(tick);

      // 끌어서 둘러보기 / 짧게 누르면 그곳으로 걸어가기
      let drag = null;
      view.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false }; view.setPointerCapture(e.pointerId); }, { signal });
      view.addEventListener("pointermove", (e) => {
        if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.hypot(dx, dy) > 6) { drag.moved = true; follow = false; }
        if (drag.moved) { cam.x = drag.cx - dx / zoom; cam.y = drag.cy - dy / zoom; }
      }, { signal });
      view.addEventListener("pointerup", (e) => {
        drag = null;
      }, { signal });
      view.addEventListener("pointercancel", () => { drag = null; }, { signal });
      view.addEventListener("lostpointercapture", () => { drag = null; }, { signal });
      // 확대·축소: 버튼, 마우스 휠, 두 손가락
      const changeZoom = (k) => { userZoom = Math.min(3, Math.max(1, userZoom * k)); setZoom(); };
      for (const [b, k] of [[zoomIn, 1.25], [zoomOut, 0.8]]) {
        b.addEventListener("pointerdown", (e) => e.stopPropagation(), { signal });
        b.addEventListener("click", (e) => { e.stopPropagation(); changeZoom(k); }, { signal });
      }
      view.addEventListener("wheel", (e) => { e.preventDefault(); changeZoom(e.deltaY < 0 ? 1.1 : 0.9); }, { signal, passive: false });
      const fingers = new Map(); let pinch = 0;
      view.addEventListener("pointerdown", (e) => { if (e.target.closest && e.target.closest(".vg-stick,.vg-zoom,.vg-fab,.vg-pin,.vg-inside")) return; fingers.set(e.pointerId, [e.clientX, e.clientY]); if (fingers.size === 2) { pinch = 0; drag = null; } }, { signal, capture: true });
      view.addEventListener("pointermove", (e) => {
        if (!fingers.has(e.pointerId)) return;
        fingers.set(e.pointerId, [e.clientX, e.clientY]);
        if (fingers.size !== 2) return;
        const [a, b] = [...fingers.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        if (pinch) changeZoom(d / pinch);
        pinch = d; drag = null;
      }, { signal, capture: true });
      for (const t of ["pointerup", "pointercancel"]) view.addEventListener(t, (e) => { fingers.delete(e.pointerId); pinch = 0; }, { signal, capture: true });
      fab.addEventListener("pointerdown", (e) => e.stopPropagation(), { signal });
      fab.addEventListener("click", (e) => { e.stopPropagation(); follow = true; }, { signal });

      // 장소 카드
      function btn(parent, label, cls, fn) { const b = el("button", "vg-btn " + cls, parent, label); b.type = "button"; b.addEventListener("click", () => fn()); return b; }
      function select(p, walk) {
        for (const [id, b] of pins) b.classList.toggle("on", id === p.id);
        sTitle.textContent = p.name; sDesc.textContent = p.desc; sAct.replaceChildren();
        if (p.link && !p.q) btn(sAct, p.link[1], "go", () => cfg.onOpen(p.link[0]));
        if (p.q) btn(sAct, p.room ? "🚪 Enter" : "💬 Practice", "go", () => openRoom(p));
        btn(sAct, "🚋 Take the tram", "tram", () => tramTo(p));
        if (walk) walkTo(p.x, p.y + 50, () => { sDesc.textContent = p.desc + " (Arrived!)"; if (p.q) openRoom(p); });
      }
      function tramTo(p) {
        const t = el("div", "vg-toast", view, "🚋 On the tram… " + p.name.replace(/^\S+\s/, ""));
        setTimeout(() => {
          t.remove();
          if (stopped) return;
          const w = nearestWalk(p.x, p.y + 50); me.x = w.gx * MS + 4; me.y = w.gy * MS + 4; me.route = []; me.walking = false; me.then = null; setDir(me, "S", 1); follow = true;
          cam.x = me.x; cam.y = me.y; sDesc.textContent = p.desc + " (Arrived by tram!)";
        }, reduce ? 50 : 900);
      }

      // 내부 맵을 화면에 맞춘다
      function fitStage(r) {
        const vw = view.clientWidth, vh = view.clientHeight;
        // 큰 가게(r.view)는 화면에 일부만 보이고 고양이를 따라 움직인다
        const k = Math.max(Math.min(vw / r.w, vh / r.h), r.view ? Math.min(vw, vh) / r.view : 0);
        stage.style.width = r.w + "px"; stage.style.height = r.h + "px";
        const fx = inCat ? inCat.x : r.start[0], fy = inCat ? inCat.y : r.start[1];
        const tx = r.w * k <= vw ? (vw - r.w * k) / 2 : Math.min(0, Math.max(vw - r.w * k, vw / 2 - fx * k));
        const ty = r.h * k <= vh ? (vh - r.h * k) / 2 : Math.min(0, Math.max(vh - r.h * k, vh / 2 - fy * k));
        stage.style.transform = `translate(${Math.round(tx)}px, ${Math.round(ty)}px) scale(${k})`;
        stage.style.setProperty("--vg-iz", String(1 / k));
      }
      let curRoom = null, roomFg = [], roomPortals = [], roomNpcs = [], portalLock = false;
      // 문을 지나면 같은 가게의 다른 구역으로 (말하기 연습 칸은 그대로)
      function goPortal(q) {
        const name = rTitle.dataset.place || "";
        if (leaveInside) leaveInside();
        enterRoom({ room: q.to, name, arrive: q.at });
      }
      function enterRoom(p) {
        const r = ROOMS[p.room];
        curRoom = r;
        inside.hidden = false; inside.style.background = r.bg; fab.hidden = true; zoomBox.hidden = true; timeBtn.hidden = true;
        stageImg.src = `${base}rooms/${r.img || p.room + ".jpg"}`; stageImg.alt = p.name + " 안";
        // 움직이는 가게: 영상이 재생되면 그림 위를 덮는다 (안 되면 그림만 보인다)
        if (r.video && (!reduce || cfg.forceMotion)) {
          stageVideo.src = `${base}rooms/${p.room}.mp4`; stageVideo.hidden = false;
          const playing = stageVideo.play(); if (playing) playing.catch(() => {});
        }
        for (const n of [sTitle, sDesc, sAct]) n.hidden = true;
        sheet.appendChild(rIn); rImg.hidden = true;
        fitStage(r);
        if (r.mask && !r.maskImg) {
          // 걷기 지도를 처음 한 번 불러온 뒤 다시 들어온다
          const mi = new Image(); mi.onload = () => { r.maskImg = mi; if (curRoom === r && !inCat) { leaveInside = null; enterRoom(p); } }; mi.src = `${base}rooms/${r.mask}`;
          leaveInside = () => {
            curRoom = null; leaveInside = null; inside.hidden = true; fab.hidden = false; zoomBox.hidden = false; timeBtn.hidden = false; rIn.remove();
            for (const n of [sTitle, sDesc, sAct]) n.hidden = false;
          };
          return;
        }
        const arrive = p.arrive || r.start;
        const nav = roomNav(r), s0 = nav.nearestWalk(arrive[0], arrive[1]);
        inCat = cat(me.breed, s0.gx * ROOM_MS + 5, s0.gy * ROOM_MS + 5, cfg.myName || "Me", true, { parent: stage, scale: r.scale || INSIDE_SCALE, nav });
        inCat.speed = 130;
        if (!p.arrive) goTo(inCat, r.spot[0], r.spot[1]);
        // 다른 구역으로 가는 문
        roomPortals = (r.portals || []).map((q) => {
          const d = el("div", "vg-pin vg-portal", stage, q.label); d.style.left = q.x + "px"; d.style.top = (q.y - 30) + "px";
          return { ...q, el: d };
        });
        portalLock = !!p.arrive;
        // 손님·직원 고양이: 바닥 위 아무 곳이나 천천히 돌아다닌다
        roomNpcs = [];
        for (let i = 0, tries = 0; i < (r.npcs || 0) && tries < 3000; tries++) {
          const gx = Math.floor(Math.random() * nav.gw), gy = Math.floor(Math.random() * nav.gh);
          if (!nav.ok(gx, gy)) continue;
          const c = cat(TOWN_BREEDS[(i * 3 + 1) % TOWN_BREEDS.length], gx * ROOM_MS + 5, gy * ROOM_MS + 5, "", false, { parent: stage, scale: r.scale || INSIDE_SCALE, nav });
          c.speed = 45 + Math.random() * 25; c.idleT = Math.random() * 4; roomNpcs.push(c); i++;
        }
        // 진열대 앞그림: 고양이가 진열대 뒤(통로)에 있으면 앞 진열대를 반투명하게
        let fgBox = null; roomFg = [];
        if (r.fg) {
          fgBox = el("div", "", stage);
          fetch(`${base}rooms/${r.fg}.json?v=2`).then((res) => res.json()).then((list) => {
            if (curRoom !== r || !fgBox) return;
            const url = `url(${base}rooms/${r.fg}.webp?v=2)`;
            for (const [x, y, w, h, z] of list) {
              const d = el("div", "vg-fg", fgBox);
              d.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${z};background-image:${url};background-position:${-x}px ${-y}px`;
              roomFg.push({ x, y, w, h, z, el: d, faded: false });
            }
          }).catch(() => {});
        }
        leaveInside = () => {
          if (fgBox) { fgBox.remove(); fgBox = null; } roomFg = [];
          for (const q of roomPortals) q.el.remove(); roomPortals = [];
          for (const c of roomNpcs) { c.root.remove(); if (c.tag) c.tag.remove(); } roomNpcs = [];
          inCat.root.remove(); inCat.tag.remove(); inCat = null; curRoom = null; leaveInside = null;
          stageVideo.pause(); stageVideo.removeAttribute("src"); stageVideo.load(); stageVideo.hidden = true;
          inside.hidden = true; fab.hidden = false; zoomBox.hidden = false; timeBtn.hidden = false; rIn.remove();
          for (const n of [sTitle, sDesc, sAct]) n.hidden = false;
          follow = true;
        };
      }
      inside.addEventListener("pointerdown", (e) => e.stopPropagation(), { signal });
      // 가게 안에서도 누른 곳으로 걸어가기
      inside.addEventListener("click", (e) => {
        if (!inCat || !curRoom) return;
        const b = stage.getBoundingClientRect(), k = b.width / curRoom.w;
        goTo(inCat, (e.clientX - b.left) / k, (e.clientY - b.top) / k);
      }, { signal });
      addEventListener("resize", () => { if (curRoom) fitStage(curRoom); }, { signal });

      // 가게 안: 표현 연습 + 이어지는 앱 화면
      function openRoom(p) {
        if (leaveInside) closeRoom();
        rTitle.dataset.place = p.name;
        rTitle.textContent = p.room ? p.name + " · walk around with the joystick" : p.name;
        rQ.replaceChildren(document.createTextNode(p.q[0] + " · 영어로 말해 보세요"));
        const ans = el("button", "", rQ, "💡 Show answer"); ans.type = "button";
        ans.addEventListener("click", () => { ans.textContent = "✅ " + p.q[1]; });
        rAct.replaceChildren();
        if ("speechSynthesis" in window) btn(rAct, "🔊 Listen", "", () => { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(p.q[1]); u.lang = "en-AU"; speechSynthesis.speak(u); });
        if (p.link) btn(rAct, p.link[1], "go", () => { closeRoom(); cfg.onOpen(p.link[0]); });
        btn(rAct, "Exit", "", closeRoom);
        if (p.room) enterRoom(p);
        else { card.appendChild(rIn); rImg.hidden = true; room.hidden = false; }
        if (cfg.onRoomOpen) cfg.onRoomOpen(rSpeak, p.q[1]);
      }
      addEventListener("resize", setZoom, { signal });
      select(PLACES[0], false);
      if (cfg.onReady) cfg.onReady({ say });
      for (const r of Object.values(ROOMS)) if (r.mask && !r.maskImg) { const mi = new Image(); mi.onload = () => { r.maskImg = mi; }; mi.src = `${base}rooms/${r.mask}`; }
    }

    return function stop() {
      stopped = true; ac.abort(); cancelAnimationFrame(raf); bgm.pause();
      if (cfg.onRoomClose) cfg.onRoomClose();
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      root.replaceChildren();
    };
  };
})();
