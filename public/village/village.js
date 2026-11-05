// 멜번 고양이 마을: 지도 한 장 위를 고양이가 걸어 다니고, 건물에 들어가면 앱 화면으로 이어진다.
// 앱(/student/village)과 미리보기 페이지가 이 파일 하나를 같이 쓴다.
(function () {
  const W = 2752, H = 1536, MS = 8; // 지도 크기 · 걷기 지도 한 칸 크기
  const SCALE = 0.36, FRAME = 120, STEP = 1; // 고양이 크기 · 그림 높이 · 그림 한 장당 걷는 거리(px)
  const META = {"cheese-E":[108,12],"gray-E":[103,12],"russian-E":[103,12],"fold-E":[110,12],"siamese-E":[102,12],"ragdoll-E":[124,12],"tuxedo-E":[111,12],"white-E":[99,12],"angora-E":[121,12],"cheese-S":[96,10],"gray-S":[93,10],"russian-S":[94,10],"fold-S":[100,10],"siamese-S":[91,10],"ragdoll-S":[104,10],"tuxedo-S":[98,10],"white-S":[92,10],"angora-S":[108,10],"cheese-SE":[92,10],"gray-SE":[92,10],"russian-SE":[92,10],"fold-SE":[97,10],"siamese-SE":[89,10],"ragdoll-SE":[101,9],"tuxedo-SE":[93,10],"white-SE":[77,10],"angora-SE":[100,10],"cheese-NE":[70,9],"gray-NE":[70,9],"russian-NE":[80,9],"fold-NE":[97,12],"siamese-NE":[72,10],"ragdoll-NE":[100,12],"tuxedo-NE":[76,9],"white-NE":[91,12],"angora-NE":[95,9],"cheese-N":[69,9],"gray-N":[66,9],"russian-N":[71,7],"fold-N":[77,9],"siamese-N":[80,10],"ragdoll-N":[78,7],"tuxedo-N":[86,10],"white-N":[72,9],"angora-N":[96,9]};
  // 서 있을 때 쓸 그림: 걷기 그림 중 다리가 가장 모인 장면
  const REST = {"cheese-E":8,"gray-E":9,"russian-E":8,"fold-E":2,"siamese-E":2,"ragdoll-E":2,"tuxedo-E":8,"white-E":8,"angora-E":8,"cheese-S":7,"gray-S":2,"russian-S":2,"fold-S":2,"siamese-S":2,"ragdoll-S":2,"tuxedo-S":2,"white-S":2,"angora-S":2,"cheese-SE":2,"gray-SE":2,"russian-SE":2,"fold-SE":2,"siamese-SE":2,"ragdoll-SE":7,"tuxedo-SE":2,"white-SE":2,"angora-SE":2,"cheese-NE":4,"gray-NE":3,"russian-NE":4,"fold-NE":1,"siamese-NE":3,"ragdoll-NE":1,"tuxedo-NE":2,"white-NE":1,"angora-NE":7,"cheese-N":7,"gray-N":3,"russian-N":4,"fold-N":6,"siamese-N":3,"ragdoll-N":3,"tuxedo-N":1,"white-N":4,"angora-N":1};
  const BREEDS = ["cheese", "gray", "russian", "fold", "siamese", "ragdoll", "tuxedo", "white", "angora"];

  // x·y: 건물 앞 땅, top: 이름표 아래 끝. link: 들어가면 열리는 앱 화면, q: 가게 안 표현 연습
  const PLACES = [
    { id: "station", x: 770, y: 1046, top: 730, name: "🚉 플린더스 스트리트역", desc: "오늘 들을 데일리 강의가 여기서 출발해요.", link: ["/student/lessons", "📺 강의실 들어가기"] },
    { id: "lib", x: 605, y: 777, top: 468, name: "📚 주립도서관", desc: "기초 문법을 차근차근 공부하는 곳이에요.", link: ["/student/grammar", "📚 문법 공부하기"] },
    { id: "paul", x: 1376, y: 777, top: 405, name: "⛪ 세인트 폴 대성당", desc: "소리 내어 연습하는 곳. th·r·l·f·v 입모양을 볼 수 있어요.", link: ["/student/pronunciation", "👄 발음 가이드 보기"] },
    { id: "apt", x: 1376, y: 420, top: 124, name: "🏢 673 La Trobe · 우리 집", desc: "내 고양이가 사는 집. 츄르로 방을 꾸며요.", link: ["/student/cat-house", "🏠 집으로 들어가기"] },
    { id: "fed", x: 1651, y: 592, top: 372, name: "🔷 페더레이션 스퀘어", desc: "광장 전광판에 오늘의 호주 뉴스가 떠요.", link: ["/student/news", "📰 오늘 뉴스 보기"] },
    { id: "mcg", x: 2394, y: 571, top: 83, name: "🏟 MCG", desc: "이번 주 리그 순위를 겨루는 경기장이에요.", link: ["/student/league", "🏆 리그 보러 가기"] },
    { id: "eureka", x: 1748, y: 1087, top: 592, name: "🏙 유레카 타워", desc: "전망대에서 내 영어 레벨을 내려다봐요.", link: ["/student/level-test", "📈 레벨테스트 보기"] },
    { id: "arts", x: 1582, y: 1211, top: 880, name: "🎭 아트센터", desc: "배우처럼 따라 말한 내 쉐도잉 기록이 있어요.", link: ["/student/shadowing", "🎤 내 쉐도잉 보기"] },
    { id: "luna", x: 2180, y: 1101, top: 690, name: "🎡 루나파크", desc: "게임으로 단어를 익히는 놀이공원이에요.", link: ["/student/voca", "🎮 보카 게임 하기"] },
    { id: "sx", x: 206, y: 977, top: 688, name: "🚆 서던크로스역", desc: "출국 준비 자료와 교재를 챙기는 곳이에요.", link: ["/student/resources", "🎁 자료실 열기"] },
    { id: "site", x: 248, y: 1321, top: 977, name: "🏗 건설 현장", desc: "스모코 타임! 현장 영어를 연습하고, 면접도 볼 수 있어요.", room: "site", q: ["\"오늘 안전 장비 어디서 받아요?\"", "Where do I pick up my PPE today?"], link: ["/student/talk", "🎭 AI 면접 보러 가기"] },
    { id: "qvm", x: 248, y: 261, top: 14, name: "🛒 퀸 빅토리아 마켓", desc: "장보기 영어: 가격 묻기, 몇 개 사기.", room: "supermarket", q: ["\"사과 1킬로에 얼마예요?\"", "How much for a kilo of apples?"] },
    { id: "china", x: 413, y: 619, top: 413, name: "🏮 차이나타운", desc: "주방·서빙·예약 영어.", room: "restaurant", q: ["\"두 명 자리 있어요?\"", "Have you got a table for two?"] },
    { id: "hosier", x: 716, y: 400, top: 96, name: "🎨 호시어 레인 카페", desc: "그래피티 골목의 작은 카페. 커피 주문 영어.", room: "cafe", q: ["\"플랫화이트 한 잔 주세요.\"", "Can I grab a flat white, please?"] },
    { id: "bakery", x: 502, y: 399, top: 248, name: "🥐 크루아상 빵집", desc: "주문·포장 영어.", room: "bakery", q: ["\"크루아상 두 개 포장해 주세요.\"", "Can I get two croissants to take away, please?"] },
    { id: "hotel", x: 1004, y: 619, top: 337, name: "🏨 호텔", desc: "체크인·예약 확인 영어.", room: "hotel", q: ["\"오늘 밤 예약했어요. 이름은 다니엘이에요.\"", "Hi, I have a booking for tonight under Daniel."] },
    { id: "chemist", x: 96, y: 1445, top: 1266, name: "💊 Chemist Warehouse", desc: "처방전·증상 설명 영어.", room: "pharmacy", q: ["\"이 처방전 약 받을 수 있을까요?\"", "Can I get this prescription filled, please?"] },
    { id: "coles", x: 537, y: 1252, top: 1032, name: "🛒 Coles", desc: "물건 위치 묻기 영어.", room: "supermarket", q: ["\"우유 어디 있어요?\"", "Excuse me, where can I find the milk?"] },
    { id: "woolies", x: 963, y: 1493, top: 1307, name: "🛒 Woolworths", desc: "계산대 영어: 봉투·결제.", room: "supermarket", q: ["\"봉투 하나 주세요.\"", "Can I get a bag, please?"] },
    { id: "cake", x: 2367, y: 1197, top: 991, name: "🍰 케이크 가게", desc: "케이크 고르기·포장 영어.", room: "cafe", q: ["\"이 케이크 한 조각 포장해 주세요.\"", "Can I get a slice of this cake to go?"] },
    { id: "park", x: 1789, y: 413, top: 151, name: "🌳 공원", desc: "호수 옆 산책 코스. 스몰톡 영어.", q: ["\"오늘 날씨 좋네요.\"", "Lovely day, isn't it?"] },
    { id: "huts", x: 1968, y: 1376, top: 1142, name: "🏖 해변 오두막", desc: "알록달록 오두막. 사진 부탁 영어.", q: ["\"사진 한 장 찍어 주실 수 있어요?\"", "Could you take a photo of us?"] },
    { id: "pier", x: 2339, y: 1266, top: 1211, name: "⛵ 피어", desc: "해 질 녘 산책 코스. 길 묻기 영어.", q: ["\"해변은 어느 쪽이에요?\"", "Excuse me, which way to the beach?"] },
  ];
  // 가게 내부 맵: 그림 좌표로 걸을 수 있는 바닥(floor)에서 가구(block)를 뺀다. start: 들어온 자리, spot: 처음 걸어가는 자리
  const CAFE_TABLES = [[495,530,610,610,495,700,390,610],[690,455,790,540,690,620,595,540],[830,375,925,450,830,530,745,450]];
  const ROOMS = {
    bakery: { w: 1000, h: 1000, bg: "#6b4128", start: [470,885], spot: [690,700], floor: [[370,825,410,805,640,712,770,650,845,708,490,905]] },
    cafe: { w: 1000, h: 747, bg: "#6b4128", start: [300,640], spot: [540,500], floor: [[120,520,255,600,425,520,560,455,690,430,760,400,930,505,500,722]], block: CAFE_TABLES },
    restaurant: { w: 1000, h: 747, bg: "#6b4128", start: [340,640], spot: [590,470], floor: [[120,520,255,600,425,520,560,455,690,430,760,400,930,505,500,722]], block: [...CAFE_TABLES, [255,565,330,565,330,610,255,610]] },
    hotel: { w: 1000, h: 747, bg: "#6b4128", start: [430,680], spot: [250,565], floor: [[60,515,115,495,175,550,300,480,310,520,275,530,275,600,390,650,430,690,500,722]] },
    pharmacy: { w: 1000, h: 1000, bg: "#6b4128", start: [250,820], spot: [720,815], floor: [[55,715,225,790,420,885,505,920,650,825,705,808,825,730,940,715,505,948],[300,800,490,705,600,620,690,680,640,690,440,765,420,880]] },
    site: { w: 1000, h: 1000, bg: "#6b4128", start: [640,830], spot: [410,540], floor: [[60,640,240,520,300,480,470,500,700,500,950,645,500,915]], block: [[355,600,450,560,560,490,720,590,800,640,800,730,690,730,640,780,580,800,450,740,450,680,365,680],[165,650,250,590,350,690,275,755],[110,670,150,640,180,680,140,695],[320,760,355,720,390,765,355,785],[450,855,495,820,535,860,495,900],[830,650,860,620,895,660,860,675],[705,510,790,470,865,540,800,620]] },
    supermarket: { w: 1000, h: 1000, bg: "#8a6245", start: [510,760], spot: [600,600], floor: [[100,470,330,300,660,480,640,600,730,630,680,660,500,770,320,700]], block: [[150,440,270,400,390,510,270,590],[110,530,165,510,250,600,210,640],[275,620,400,540,485,590,485,640,340,700],[310,330,340,315,585,470,580,580,520,575],[380,240,410,225,650,370,650,470,590,460]] },
  };
  const INSIDE_SCALE = 0.95; // 내부 그림에서 고양이 크기
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
.vg-fab[hidden] { display: none; }
.vg-inside { position: absolute; inset: 0; z-index: 1; overflow: hidden; touch-action: none; cursor: pointer; }
.vg-inside[hidden] { display: none; }
.vg-stage { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
.vg-stage video { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: fill; pointer-events: none; }
.vg-stage video[hidden] { display: none; }
.vg-stage img { display: block; max-width: none; width: 100%; height: 100%; user-select: none; -webkit-user-drag: none; pointer-events: none; }
.vg-sheet { border-top: 3px solid #2a2350; padding: 10px 14px 12px; display: grid; gap: 6px; background: #fffaf0; max-height: 58%; overflow-y: auto; }
.vg-sheet[hidden], .vg-in[hidden] { display: none; }
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
    view.setAttribute("aria-label", "마을 지도. 누르면 고양이가 걸어가요");
    const world = el("div", "vg-world", view);
    world.style.width = W + "px"; world.style.height = H + "px";
    const map = el("img", "vg-map", world);
    map.src = base + "map.jpg"; map.alt = ""; map.width = W; map.height = H;
    const target = el("div", "vg-target", world);
    const chips = el("div", "vg-chips", view);
    if (typeof cfg.churu === "number") el("span", "vg-chip gold", chips, "🐟 츄르 " + cfg.churu);
    if (cfg.friends && cfg.friends.length) el("span", "vg-chip", chips, "🐾 이웃 고양이 " + cfg.friends.length);
    const fab = el("button", "vg-fab", view, "📍 내 고양이"); fab.type = "button";
    const inside = el("div", "vg-inside", view); inside.hidden = true;
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
    let zoom = 1;
    function setZoom() { zoom = pickZoom(); world.style.setProperty("--vg-iz", String(1 / zoom)); }

    const walkImg = new Image();
    walkImg.onload = () => { if (!stopped) begin(walkImg); };
    walkImg.src = base + "walk.png";

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

        return { ok, nearestWalk, path };
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
        const [w] = META[`${c.breed}-${dir}`];
        c.dir = dir; c.flip = flip; c.w = w;
        c.img.style.width = w + "px"; c.img.style.height = FRAME + "px";
        c.img.style.backgroundImage = `url(${base}c/${c.breed}-${dir}.webp)`;
      }
      function draw(c) {
        // 걸은 거리만큼 그림을 넘긴다 (발이 미끄러져 보이지 않게)
        const n = META[`${c.breed}-${c.dir}`][1];
        const f = c.walking ? Math.floor(c.dist / (STEP * c.scale / SCALE)) % n : REST[`${c.breed}-${c.dir}`];
        c.img.style.backgroundPosition = `${-f * c.w}px 0`;
        let sx = 1, sy = 1;
        if (!c.walking && !reduce) { const b = Math.sin(c.clock * 2.4); sy = 1 + b * 0.018; sx = 1 - b * 0.01; }
        c.root.style.left = c.x + "px"; c.root.style.top = c.y + "px"; c.root.style.zIndex = Math.round(c.y) + 2;
        c.bob.style.transform = `translate(-50%, -100%) scale(${c.flip * sx * c.scale}, ${sy * c.scale})`;
        c.tag.style.left = c.x + "px"; c.tag.style.top = c.y + "px"; c.tag.style.zIndex = 100000;
      }
      function cat(breed, x, y, name, isMe, place) {
        const parent = place ? place.parent : world;
        const r = el("div", "vg-cat", parent), shadow = el("div", "vg-shadow", r), bob = el("div", "vg-bob", r), img = el("div", "vg-img", bob);
        const tag = el("div", "vg-tag" + (isMe ? " me" : ""), parent, name);
        const c = { scale: place ? place.scale : SCALE, nav: place ? place.nav : worldNav, breed, x, y, root: r, shadow, bob, img, tag, dir: "S", flip: 1, clock: 0, dist: 0, walking: false, route: [], then: null, speed: isMe ? 3.3 : 1.3, idleT: Math.random() * 3 };
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
      const start = spot("station", 0, 50);
      const me = cat(BREEDS.includes(cfg.breed) ? cfg.breed : "cheese", start.x, start.y, cfg.myName || "나", true);

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

      let lastT = performance.now(), inCat = null;
      function tick(now) {
        if (stopped) return;
        const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
        if (inCat) step(inCat, dt); else step(me, dt);
        for (const f of friends) {
          if (!f.route.length) { f.idleT -= dt; if (f.idleT <= 0) { f.idleT = 2 + Math.random() * 4; const r = 40 + Math.random() * 90, a = Math.random() * Math.PI * 2; goTo(f, f.home.x + Math.cos(a) * r, f.home.y + Math.sin(a) * r * 0.6); } }
          step(f, dt);
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
        if (drag && !drag.moved) { const r = view.getBoundingClientRect(); walkTo(cam.x + (e.clientX - r.left - r.width / 2) / zoom, cam.y + (e.clientY - r.top - r.height / 2) / zoom); }
        drag = null;
      }, { signal });
      view.addEventListener("pointercancel", () => { drag = null; }, { signal });
      view.addEventListener("lostpointercapture", () => { drag = null; }, { signal });
      fab.addEventListener("pointerdown", (e) => e.stopPropagation(), { signal });
      fab.addEventListener("click", (e) => { e.stopPropagation(); follow = true; }, { signal });

      // 장소 카드
      function btn(parent, label, cls, fn) { const b = el("button", "vg-btn " + cls, parent, label); b.type = "button"; b.addEventListener("click", () => fn()); return b; }
      function select(p, walk) {
        for (const [id, b] of pins) b.classList.toggle("on", id === p.id);
        sTitle.textContent = p.name; sDesc.textContent = p.desc; sAct.replaceChildren();
        if (p.link && !p.q) btn(sAct, p.link[1], "go", () => cfg.onOpen(p.link[0]));
        if (p.q) btn(sAct, p.room ? "🚪 들어가기" : "💬 표현 연습", "go", () => openRoom(p));
        btn(sAct, "🚋 트램으로 이동", "tram", () => tramTo(p));
        if (walk) walkTo(p.x, p.y + 50, () => { sDesc.textContent = p.desc + " (도착!)"; if (p.q) openRoom(p); });
      }
      function tramTo(p) {
        const t = el("div", "vg-toast", view, "🚋 트램 이동 중… " + p.name.replace(/^\S+\s/, ""));
        setTimeout(() => {
          t.remove();
          if (stopped) return;
          const w = nearestWalk(p.x, p.y + 50); me.x = w.gx * MS + 4; me.y = w.gy * MS + 4; me.route = []; me.walking = false; me.then = null; setDir(me, "S", 1); follow = true;
          cam.x = me.x; cam.y = me.y; sDesc.textContent = p.desc + " (트램으로 도착!)";
        }, reduce ? 50 : 900);
      }

      // 내부 맵을 화면에 맞춘다
      function fitStage(r) {
        const vw = view.clientWidth, vh = view.clientHeight, k = Math.min(vw / r.w, vh / r.h);
        stage.style.width = r.w + "px"; stage.style.height = r.h + "px";
        stage.style.transform = `translate(${Math.round((vw - r.w * k) / 2)}px, ${Math.round((vh - r.h * k) / 2)}px) scale(${k})`;
        stage.style.setProperty("--vg-iz", String(1 / k));
      }
      let curRoom = null;
      function enterRoom(p) {
        const r = ROOMS[p.room];
        curRoom = r;
        inside.hidden = false; inside.style.background = r.bg; fab.hidden = true;
        stageImg.src = `${base}rooms/${p.room}.jpg`; stageImg.alt = p.name + " 안";
        // 움직이는 가게: 영상이 재생되면 그림 위를 덮는다 (안 되면 그림만 보인다)
        if (r.video && !reduce) {
          stageVideo.src = `${base}rooms/${p.room}.mp4`; stageVideo.hidden = false;
          const playing = stageVideo.play(); if (playing) playing.catch(() => {});
        }
        for (const n of [sTitle, sDesc, sAct]) n.hidden = true;
        sheet.appendChild(rIn); rImg.hidden = true;
        fitStage(r);
        const nav = roomNav(r), s0 = nav.nearestWalk(r.start[0], r.start[1]);
        inCat = cat(me.breed, s0.gx * ROOM_MS + 5, s0.gy * ROOM_MS + 5, cfg.myName || "나", true, { parent: stage, scale: INSIDE_SCALE, nav });
        inCat.speed = 5.3;
        goTo(inCat, r.spot[0], r.spot[1]);
        leaveInside = () => {
          inCat.root.remove(); inCat.tag.remove(); inCat = null; curRoom = null; leaveInside = null;
          stageVideo.pause(); stageVideo.removeAttribute("src"); stageVideo.load(); stageVideo.hidden = true;
          inside.hidden = true; fab.hidden = false; rIn.remove();
          for (const n of [sTitle, sDesc, sAct]) n.hidden = false;
          follow = true;
        };
      }
      inside.addEventListener("pointerdown", (e) => e.stopPropagation(), { signal });
      inside.addEventListener("click", (e) => {
        if (!inCat || !curRoom) return;
        const b = stage.getBoundingClientRect();
        goTo(inCat, ((e.clientX - b.left) / b.width) * curRoom.w, ((e.clientY - b.top) / b.height) * curRoom.h);
      }, { signal });
      addEventListener("resize", () => { if (curRoom) fitStage(curRoom); }, { signal });

      // 가게 안: 표현 연습 + 이어지는 앱 화면
      function openRoom(p) {
        if (leaveInside) closeRoom();
        rTitle.textContent = p.room ? p.name + " 안이에요 · 바닥을 눌러 걸어 보세요" : p.name;
        rQ.replaceChildren(document.createTextNode(p.q[0] + " · 영어로 말해 보세요"));
        const ans = el("button", "", rQ, "💡 정답 보기"); ans.type = "button";
        ans.addEventListener("click", () => { ans.textContent = "✅ " + p.q[1]; });
        rAct.replaceChildren();
        if ("speechSynthesis" in window) btn(rAct, "🔊 듣기", "", () => { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(p.q[1]); u.lang = "en-AU"; speechSynthesis.speak(u); });
        if (p.link) btn(rAct, p.link[1], "go", () => { closeRoom(); cfg.onOpen(p.link[0]); });
        btn(rAct, "밖으로 나가기", "", closeRoom);
        if (p.room) enterRoom(p);
        else { card.appendChild(rIn); rImg.hidden = true; room.hidden = false; }
        if (cfg.onRoomOpen) cfg.onRoomOpen(rSpeak, p.q[1]);
      }
      addEventListener("resize", setZoom, { signal });
      select(PLACES[0], false);
    }

    return function stop() {
      stopped = true; ac.abort(); cancelAnimationFrame(raf);
      if (cfg.onRoomClose) cfg.onRoomClose();
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      root.replaceChildren();
    };
  };
})();
