// 고양이 집 (미니룸): 공부로 모은 츄르로 방을 꾸민다. 픽셀아트는 문자 격자 + 팔레트.
// 아이템을 늘릴 땐 BASE_ITEMS나 cat-house-items.json에 추가만 하면 된다 (가격·종류·그림).
import EXTRA_ITEMS from "@/content/cat-house-items.json";

/** 예전(작은 방) 자리 이름. 저장된 옛 배치를 새 방으로 옮길 때만 쓴다 */
export type Slot = "wallL" | "wallR" | "floorL" | "floorR" | "front" | "ceiling";

/** 넓은 방 크기 (픽셀). 벽 0~WALL_H, 그 아래가 바닥 */
export const ROOM_W = 96;
export const ROOM_H = 60;
export const WALL_H = 36;
/** 방에 놓을 수 있는 최대 개수 */
export const MAX_PLACED = 24;

/** 방에 놓인 아이템 하나: 그림 왼쪽 위 좌표 */
export type Placed = { id: string; x: number; y: number };
export type PlaceKind = "wallItem" | "floorItem" | "frontItem" | "lightItem";
export const PLACE_KINDS: PlaceKind[] = ["floorItem", "frontItem", "wallItem", "lightItem"];

export type Art = { rows: string[]; pal: Record<string, string> };

export type HouseItem = {
  id: string;
  name: string;
  /** wall/floor/window는 방 배경, 나머지는 놓을 수 있는 자리 */
  kind: "wall" | "floor" | "window" | "wallItem" | "floorItem" | "frontItem" | "lightItem" | "hat" | "outfit";
  price: number;
  rarity: "기본" | "일반" | "레어" | "전설";
  desc?: string;
  art?: Art;
  /** 벽지·바닥: 두 가지 색 무늬 / 창문: 풍경 */
  colors?: string[];
  pattern?: "stripe" | "check" | "dots" | "plank" | "tile" | "plain";
  scene?: "bondi" | "opera" | "uluru";
};

const BASE_ITEMS: HouseItem[] = [
  // 벽지
  { id: "wall-cream", name: "크림 벽지", kind: "wall", price: 0, rarity: "기본", colors: ["#FFF4E0", "#FBEBD0"], pattern: "plain" },
  { id: "wall-sky", name: "하늘 줄무늬 벽지", kind: "wall", price: 50, rarity: "일반", colors: ["#DCEFFF", "#C5E2FA"], pattern: "stripe" },
  { id: "wall-mint", name: "민트 체크 벽지", kind: "wall", price: 80, rarity: "레어", colors: ["#DDF5EA", "#C6EAD8"], pattern: "check" },
  // 바닥
  { id: "floor-wood", name: "원목 마루", kind: "floor", price: 0, rarity: "기본", colors: ["#C99A6B", "#B5865A"], pattern: "plank" },
  { id: "floor-tile", name: "하얀 타일", kind: "floor", price: 50, rarity: "일반", colors: ["#ECE7DE", "#D6CFC2"], pattern: "tile" },
  { id: "floor-carpet", name: "라벤더 카펫", kind: "floor", price: 80, rarity: "레어", colors: ["#C3AEE0", "#AE95D3"], pattern: "dots" },
  // 창밖 풍경 (호주)
  { id: "window-bondi", name: "본다이 비치 창문", kind: "window", price: 0, rarity: "기본", scene: "bondi" },
  { id: "window-opera", name: "오페라하우스 노을 창문", kind: "window", price: 100, rarity: "일반", scene: "opera" },
  { id: "window-uluru", name: "울루루 창문", kind: "window", price: 150, rarity: "레어", scene: "uluru" },
  // 바닥에 놓는 것
  {
    id: "cushion",
    name: "핑크 방석",
    kind: "floorItem",
    price: 40,
    rarity: "일반",
    art: {
      rows: ["....pppppppp....", "..pppppppppppp..", ".pppPPPPPPPPppp.", "pppPPPPPPPPPPppp", ".pppppppppppppp.", "..dddddddddddd.."],
      pal: { p: "#F4A6B8", P: "#F9C6D2", d: "#D9849A" },
    },
  },
  {
    id: "bed",
    name: "라탄 고양이 침대",
    kind: "floorItem",
    price: 100,
    rarity: "일반",
    art: {
      rows: ["..bbbbbbbbbbbb..", ".bwwwwwwwwwwwwb.", "bwwwwwwwwwwwwwwb", "bBBBBBBBBBBBBBBb", "bBbBbBbBbBbBbBBb", ".bbbbbbbbbbbbbb."],
      pal: { b: "#8B5A2B", B: "#B07A45", w: "#F5E6C8" },
    },
  },
  {
    id: "plant",
    name: "몬스테라 화분",
    kind: "floorItem",
    price: 60,
    rarity: "일반",
    art: {
      rows: [
        "....g...g...", "...ggg.ggg..", "..gGggggGgg.", ".ggGgg.gGggg", "gggg.ggg.ggg", ".gg.gGGg.gg.",
        "..g.ggGgg.g.", "....g.Gg....", ".....gG.....", "...oooooo...", "..oOOOOOOo..", "..oOOOOOOo..",
        "...oOOOOo...", "....oooo....",
      ],
      pal: { g: "#3F9B58", G: "#2D7A43", o: "#B5643C", O: "#D2814F" },
    },
  },
  {
    id: "tower",
    name: "캣타워",
    kind: "floorItem",
    price: 150,
    rarity: "레어",
    art: {
      rows: [
        "..tttttttttt..", "..TTTTTTTTTT..", ".....rr.......", ".....rr.......", ".....rr.......",
        "tttttttttt....", "TTTTTTTTTT....", "......rr......", "......rr......", "......rr......",
        "......rr......", "...tttttttttt.", "...TTTTTTTTTT.", "........rr....", "........rr....",
        "........rr....", "........rr....", "..bbbbbbbbbb..", "..BBBBBBBBBB..",
      ],
      pal: { t: "#C9A27E", T: "#A9805A", r: "#E8D5B0", b: "#7A5A3A", B: "#5E4329" },
    },
  },
  {
    id: "surfboard",
    name: "서핑보드",
    kind: "floorItem",
    price: 120,
    rarity: "레어",
    art: {
      rows: [
        "...ss...", "..sYYs..", ".sYYYYs.", ".sYYYYs.", "sYYrrYYs", "sYYrrYYs", "sYYYYYYs", "sYYYYYYs",
        "sYYrrYYs", "sYYrrYYs", "sYYYYYYs", "sYYYYYYs", "sYYrrYYs", "sYYYYYYs", ".sYYYYs.", ".sYYYYs.",
        "..sYYs..", "...ss...",
      ],
      pal: { s: "#1E6FA8", Y: "#FFD45C", r: "#E85D4A" },
    },
  },
  {
    id: "kangaroo",
    name: "캥거루 인형",
    kind: "floorItem",
    price: 80,
    rarity: "일반",
    art: {
      rows: [
        "..e.......", ".ee.......", ".kkk......", "kkKkk.....", ".kkkk.....", "..kkkk....", "..kkkkk...",
        "..kKKkk...", "..kKKkkk..", "..kkkkkkk.", "...kk.kkkk", "..kk...kkk",
      ],
      pal: { k: "#C8834F", K: "#E8C9A0", e: "#A0663A" },
    },
  },
  // 앞쪽 바닥
  {
    id: "rug",
    name: "동그란 러그",
    kind: "frontItem",
    price: 70,
    rarity: "일반",
    art: {
      rows: [
        ".....rrrrrrrrrrrrrr.....", "..rrrRRRRRRRRRRRRRRrrr..", "rrRRRryyyyyyyyyyyyrRRRrr",
        "rrRRRryyyyyyyyyyyyrRRRrr", "..rrrRRRRRRRRRRRRRRrrr..", ".....rrrrrrrrrrrrrr.....",
      ],
      pal: { r: "#7FB8E6", R: "#A9D2F2", y: "#FFF3C4" },
    },
  },
  {
    id: "yarn",
    name: "털실 공",
    kind: "frontItem",
    price: 30,
    rarity: "일반",
    art: {
      rows: ["..rrrr..", ".rRrrRr.", "rRrrRrrr", "rrRrrRrr", ".rrRrrr.", "..rrrr.l", ".......l"],
      pal: { r: "#E85D7A", R: "#F59AB0", l: "#E85D7A" },
    },
  },
  // 벽에 거는 것
  {
    id: "frame-opera",
    name: "오페라하우스 액자",
    kind: "wallItem",
    price: 90,
    rarity: "일반",
    art: {
      rows: [
        "ffffffffffff", "fbbbbbbbbbbf", "fbbbbwbbbbbf", "fbbbwwwbbbbf", "fbbwwwwwwbbf",
        "fbwwwwwwwwbf", "fnnnnnnnnnnf", "fnnnnnnnnnnf", "ffffffffffff",
      ],
      pal: { f: "#8B5A2B", b: "#9FD3F5", w: "#FFFFFF", n: "#3A6EA5" },
    },
  },
  {
    id: "clock",
    name: "주황 벽시계",
    kind: "wallItem",
    price: 60,
    rarity: "일반",
    art: {
      rows: [
        "...cccc...", ".cwwwwwwc.", ".cwwwkwwc.", "cwwwwkwwwc", "cwwwwkkkwc", "cwwwwwwwwc",
        "cwwwwwwwwc", ".cwwwwwwc.", "..cwwwwc..", "...cccc...",
      ],
      pal: { c: "#E07A3F", w: "#FFFDF5", k: "#333333" },
    },
  },
  {
    id: "shelf",
    name: "베지마이트 선반",
    kind: "wallItem",
    price: 80,
    rarity: "일반",
    art: {
      rows: ["...yy....gg...", "..kkkk..gGGg..", "..kyyk..gGGg..", "..kkkk..gggg..", "ssssssssssssss", "SSSSSSSSSSSSSS", ".S..........S."],
      pal: { y: "#FFD23F", k: "#3B2A1A", g: "#5BA35B", G: "#A8D5A2", s: "#B07A45", S: "#8B5A2B" },
    },
  },
  {
    id: "map",
    name: "호주 지도 액자",
    kind: "wallItem",
    price: 100,
    rarity: "레어",
    art: {
      rows: [
        "ffffffffffff", "fbbbbbbbbbbf", "fbbbbggbbbbf", "fbbgggggbbbf", "fbggggggggbf",
        "fbgggggggbbf", "fbbggggggbbf", "fbbbbbbggbbf", "ffffffffffff",
      ],
      pal: { f: "#5E4329", b: "#9FD3F5", g: "#E8A04C" },
    },
  },
];

export const ITEMS: HouseItem[] = [...BASE_ITEMS, ...(EXTRA_ITEMS as unknown as HouseItem[])];

export const ITEM_BY_ID = new Map(ITEMS.map((i) => [i.id, i]));
export const FREE_ITEMS = ITEMS.filter((i) => i.price === 0).map((i) => i.id);

export type Layout = {
  wall: string;
  floor: string;
  window: string;
  /** 방에 놓은 것들 (앞에 있는 게 뒤에 그려진다) */
  items: Placed[];
  /** 고양이가 입은 모자·옷 */
  wear: { hat?: string; outfit?: string };
};

export const DEFAULT_LAYOUT: Layout = { wall: "wall-cream", floor: "floor-wood", window: "window-bondi", items: [], wear: {} };

export function artSize(art: Art) {
  return { w: Math.max(...art.rows.map((r) => r.length)), h: art.rows.length };
}

/** 종류마다 놓을 수 있는 범위 안으로 좌표를 맞춘다 */
export function clampPlace(id: string, x: number, y: number): Placed | null {
  const it = ITEM_BY_ID.get(id);
  if (!it?.art || !(PLACE_KINDS as string[]).includes(it.kind)) return null;
  const { w, h } = artSize(it.art);
  const cx = Math.round(Math.min(Math.max(x, 0), ROOM_W - w));
  let cy = Math.round(y);
  if (it.kind === "lightItem") cy = 0;
  else if (it.kind === "wallItem") cy = Math.min(Math.max(cy, 2), WALL_H - 2 - h);
  else cy = Math.min(Math.max(cy, WALL_H + 2 - h), ROOM_H - h); // 바닥: 발이 바닥 안에
  return { id, x: cx, y: cy };
}

/** 새로 놓을 때 기본 위치 */
export function defaultPlace(id: string, n = 0): Placed | null {
  const it = ITEM_BY_ID.get(id);
  if (!it?.art) return null;
  const { w, h } = artSize(it.art);
  const x = 10 + ((n * 17) % (ROOM_W - 20));
  if (it.kind === "lightItem") return clampPlace(id, x, 0);
  if (it.kind === "wallItem") return clampPlace(id, x, 10);
  if (it.kind === "frontItem") return clampPlace(id, x - w / 2, ROOM_H - 2 - h);
  return clampPlace(id, x - w / 2, WALL_H + 12 - h);
}

/** 예전 작은 방의 자리 → 새 방 좌표 */
const OLD_SLOT_POS: Record<Slot, (w: number, h: number) => [number, number]> = {
  wallL: (w, h) => [16 - w / 2, 14 - h / 2],
  wallR: (w, h) => [80 - w / 2, 14 - h / 2],
  floorL: (w, h) => [14 - w / 2, WALL_H + 12 - h],
  floorR: (w, h) => [82 - w / 2, WALL_H + 12 - h],
  front: (w, h) => [48 - w / 2, ROOM_H - 1 - h],
  ceiling: (w) => [48 - w / 2, 0],
};
const OLD_SLOT_KIND: Record<Slot, HouseItem["kind"]> = {
  wallL: "wallItem",
  wallR: "wallItem",
  floorL: "floorItem",
  floorR: "floorItem",
  front: "frontItem",
  ceiling: "lightItem",
};

/** 저장된 배치를 안전하게 읽는다 (없는 아이템·잘못된 위치는 고치거나 버린다) */
export function normalizeLayout(raw: unknown): Layout {
  const r = (raw ?? {}) as Partial<Layout> & { slots?: Partial<Record<Slot, string>> };
  const ok = (id: unknown, kind: HouseItem["kind"]) =>
    typeof id === "string" && ITEM_BY_ID.get(id)?.kind === kind ? id : undefined;
  const items: Placed[] = [];
  const seen = new Set<string>();
  const push = (p: Placed | null) => {
    if (p && !seen.has(p.id) && items.length < MAX_PLACED) {
      seen.add(p.id);
      items.push(p);
    }
  };
  if (Array.isArray(r.items)) {
    for (const p of r.items as unknown[]) {
      const q = p as Partial<Placed>;
      if (typeof q?.id === "string" && Number.isFinite(q.x) && Number.isFinite(q.y)) push(clampPlace(q.id, q.x!, q.y!));
    }
  } else if (r.slots) {
    for (const [slot, id] of Object.entries(r.slots)) {
      const it = id ? ITEM_BY_ID.get(id) : undefined;
      if (!id || !it?.art || !(slot in OLD_SLOT_POS)) continue;
      // 자리 종류와 아이템 종류가 다르면 그 아이템 종류의 기본 자리에 놓는다
      if (OLD_SLOT_KIND[slot as Slot] !== it.kind) {
        push(defaultPlace(id, items.length));
        continue;
      }
      const { w, h } = artSize(it.art);
      const [x, y] = OLD_SLOT_POS[slot as Slot](w, h);
      push(clampPlace(id, x, y));
    }
  }
  const wear: Layout["wear"] = {};
  const hat = ok(r.wear?.hat, "hat");
  const outfit = ok(r.wear?.outfit, "outfit");
  if (hat) wear.hat = hat;
  if (outfit) wear.outfit = outfit;
  return {
    wall: ok(r.wall, "wall") ?? DEFAULT_LAYOUT.wall,
    floor: ok(r.floor, "floor") ?? DEFAULT_LAYOUT.floor,
    window: ok(r.window, "window") ?? DEFAULT_LAYOUT.window,
    items,
    wear,
  };
}

/** 하루에 모을 수 있는 츄르 상한 */
export const DAILY_CHURU_CAP = 100;

/**
 * 하루 공부 기록 → 그날 모은 츄르.
 * 쉐도잉 1문장 5 · 영상 1분 1 (최대 20) · 보카·문법·AI 면접 포인트의 절반.
 */
export function churuForDay(d: { submissions: number; watchedSeconds: number; vocaPoints: number }) {
  const v = d.submissions * 5 + Math.min(20, Math.floor(d.watchedSeconds / 60)) + Math.floor(d.vocaPoints / 2);
  return Math.min(DAILY_CHURU_CAP, v);
}

/** 마지막으로 공부한 날로부터 며칠 지났는지 → 고양이 기분 (벌은 없다: 오래 쉬면 낮잠) */
export function catMoodFor(daysSince: number | null) {
  if (daysSince === 0) return { mood: "happy" as const, label: "신남", line: "오늘도 같이 공부해서 너무 좋아! 🐾" };
  if (daysSince === 1) return { mood: "default" as const, label: "보통", line: "오늘은 어떤 문장 할 거야?" };
  if (daysSince !== null && daysSince <= 3) return { mood: "sad" as const, label: "심심", line: "심심해… 한 문장만 같이 할래?" };
  return { mood: "sleepy" as const, label: "낮잠", line: "창가에서 낮잠 자는 중… 오면 깨워 줘! 💤" };
}

// ---------- 친밀도 (누적, 절대 안 줄어든다) ----------
const LEVELS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500];
export const AFFINITY_LINES = [
  "안녕! 앞으로 잘 부탁해 🐾",
  "너 목소리 들으면 기분이 좋아져!",
  "오늘 배운 문장 나한테도 말해 줘!",
  "호주 가면 나도 데려가 줄 거지? ✈️",
  "플랫화이트 한 잔 하면서 쉐도잉 어때? ☕",
  "너 발음 진짜 늘었다! 원어민인 줄 🐱",
  "우리 벌써 이렇게 친해졌네 💛",
  "면접 연습 하는 거 봤어. 완전 멋있었어!",
  "너라면 호주에서 뭐든 할 수 있어 🦘",
  "평생 친구 하자 💜",
  "이제 나는 너의 최고 파트너야 👑",
];
export function affinity(totalEarned: number) {
  let level = 1;
  for (let i = 0; i < LEVELS.length; i++) if (totalEarned >= LEVELS[i]) level = i + 1;
  const next = LEVELS[level] ?? null;
  return {
    level,
    next: next === null ? null : next - totalEarned,
    line: AFFINITY_LINES[Math.min(level, AFFINITY_LINES.length) - 1],
  };
}

// ---------- 엽서 (공부한 날 고양이가 호주 여행 다녀옴) ----------
export const POSTCARDS = [
  { id: "bondi", emoji: "🏖️", place: "본다이 비치", city: "시드니", note: "파도 소리 들으면서 낮잠 잤어!" },
  { id: "opera", emoji: "🎭", place: "오페라하우스", city: "시드니", note: "지붕이 조개껍데기 같아!" },
  { id: "harbour", emoji: "🌉", place: "하버 브리지", city: "시드니", note: "다리 위에서 불꽃놀이 봤어 🎆" },
  { id: "tram", emoji: "🚋", place: "시티 서클 트램", city: "멜버른", note: "무료 트램 타고 한 바퀴!" },
  { id: "laneway", emoji: "☕", place: "디그레이브스 골목", city: "멜버른", note: "플랫화이트 냄새 최고…" },
  { id: "greatocean", emoji: "🌊", place: "그레이트 오션 로드", city: "빅토리아", note: "12사도 바위 봤어!" },
  { id: "uluru", emoji: "🪨", place: "울루루", city: "노던 테리토리", note: "노을에 바위가 빨개졌어 🌅" },
  { id: "reef", emoji: "🐠", place: "그레이트 배리어 리프", city: "케언스", note: "니모 찾았다!" },
  { id: "rottnest", emoji: "🦫", place: "로트네스트 섬", city: "퍼스", note: "쿼카랑 셀카 찍었어 📸" },
  { id: "goldcoast", emoji: "🏄", place: "서퍼스 파라다이스", city: "골드코스트", note: "서핑 배웠어! (물 무서웠어)" },
  { id: "farm", emoji: "🍓", place: "딸기 농장", city: "퀸즐랜드", note: "세컨 비자 88일 화이팅!" },
  { id: "tasmania", emoji: "🌲", place: "크레이들 마운틴", city: "태즈메이니아", note: "웜뱃이 정말 동글동글해!" },
] as const;
/** 엽서를 받으려면 그날 모아야 하는 츄르 */
export const POSTCARD_MIN = 30;
/** 그날의 엽서 (학생·날짜마다 정해진다) */
export function postcardFor(studentId: string, day: string) {
  let h = 0;
  for (const ch of `${studentId}:${day}`) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return POSTCARDS[h % POSTCARDS.length];
}

// ---------- 손님 고양이 (아이템을 놓으면 찾아온다: 네코 아츠메) ----------
export const GUESTS = [
  { id: "melbourne", name: "멜번냥", breed: "russian", needs: ["quokka", "tram-poster"], line: "트램 타고 놀러 왔어! 🚋" },
  { id: "surfer", name: "서퍼냥", breed: "cheese", needs: ["surfboard", "beach-towel"], line: "파도 좋던데? 🏄" },
  { id: "barista", name: "바리스타냥", breed: "tuxedo", needs: ["flat-white"], line: "라떼 아트 배우러 왔어 ☕" },
  { id: "farmer", name: "농장냥", breed: "angora", needs: ["wattle", "eucalyptus"], line: "88일 채우는 중이야 🍓" },
  { id: "boxcat", name: "상자냥", breed: "white", needs: ["box"], line: "상자다!!! 여기 내 자리야 📦" },
  { id: "gamer", name: "게이머냥", breed: "siamese", needs: ["arcade"], line: "한 판만 하고 갈게 🕹️" },
] as const;
export function guestFor(layout: Layout) {
  const placed = new Set(layout.items.map((p) => p.id));
  return GUESTS.find((g) => g.needs.some((n) => placed.has(n))) ?? null;
}

// ---------- 방 점수 (세트 보너스: 동물의 숲 해피홈) ----------
const SETS: Record<string, string[]> = {
  "🦘 호주 세트": ["kangaroo", "map", "frame-opera", "surfboard", "quokka", "wombat", "boomerang", "tram-poster", "window-opera", "window-uluru", "southern-cross", "opera-shelf", "wattle", "eucalyptus"],
  "☕ 카페 세트": ["flat-white", "timtam", "vegemite-toast", "shelf", "apron", "beanbag", "plant"],
  "🕯️ 아늑 세트": ["fairy-lights", "moon-lamp", "mushroom-lamp", "rug", "cushion", "bed", "hammock", "dot-rug"],
};
export function roomScore(layout: Layout) {
  const ids = [
    ...new Set(
      [layout.wall, layout.floor, layout.window, ...layout.items.map((p) => p.id), layout.wear.hat, layout.wear.outfit].filter(
        (x): x is string => Boolean(x),
      ),
    ),
  ];
  const pts = { 기본: 0, 일반: 10, 레어: 25, 전설: 60 } as const;
  let score = ids.reduce((n, id) => n + (pts[ITEM_BY_ID.get(id)?.rarity ?? "기본"] ?? 0), 0);
  const sets: string[] = [];
  for (const [name, members] of Object.entries(SETS)) {
    if (ids.filter((id) => members.includes(id)).length >= 3) {
      sets.push(name);
      score += 50;
    }
  }
  const trophy = score >= 250 ? "🏆 골드" : score >= 150 ? "🥈 실버" : score >= 70 ? "🥉 브론즈" : null;
  return { score, sets, trophy };
}

// ---------- 주간 깜짝 상자 (무료·확률 공개) ----------
export const BOX_ODDS = { 일반: 75, 레어: 22, 전설: 3 } as const;
export const BOX_MIN_DAYS = 3;

/** 방명록: 고르기만 해도 되는 영어 한 줄 */
export const GUESTBOOK_PHRASES = [
  { en: "What a cozy room!", ko: "방 정말 아늑하다!" },
  { en: "Your cat is so adorable!", ko: "고양이 너무 귀여워!" },
  { en: "I love how you decorated it.", ko: "꾸민 거 너무 좋아." },
  { en: "Can I move in? 😆", ko: "나 여기 살아도 돼?" },
  { en: "This room is so Aussie!", ko: "완전 호주 느낌이다!" },
  { en: "Keep it up, mate!", ko: "계속 힘내, 친구!" },
  { en: "Great job studying today!", ko: "오늘 공부 수고했어!" },
  { en: "See you in class!", ko: "수업에서 봐!" },
];
export const GUESTBOOK_MAX = 80;

/** 방명록 글 확인: 영어로만, 80자 이하. 문제가 있으면 이유(한국어)를 돌려준다 */
export function checkGuestbook(raw: string): { ok: true; text: string } | { ok: false; reason: string } {
  const text = raw.replace(/\s+/g, " ").trim();
  if (text.length < 2) return { ok: false, reason: "한 줄을 써 주세요." };
  if (text.length > GUESTBOOK_MAX) return { ok: false, reason: `${GUESTBOOK_MAX}자까지 쓸 수 있어요.` };
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text)) return { ok: false, reason: "방명록은 영어로 써요! 🇦🇺" };
  if (!/[a-zA-Z]{2,}/.test(text)) return { ok: false, reason: "영어 단어를 넣어 주세요." };
  if (!/^[\x20-\x7E’☀-➿\u{1F300}-\u{1FAFF}️]+$/u.test(text)) {
    return { ok: false, reason: "영어·숫자·이모지만 쓸 수 있어요." };
  }
  if (/\b(fuck|shit|bitch|asshole|dick|cunt|bastard|slut|retard)/i.test(text)) {
    return { ok: false, reason: "친구가 기분 좋을 말로 써 주세요 🐾" };
  }
  return { ok: true, text };
}
