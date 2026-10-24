// 고양이 집 (미니룸): 공부로 모은 츄르로 방을 꾸민다. 픽셀아트는 문자 격자 + 팔레트.
// 아이템을 늘릴 땐 ITEMS에 추가만 하면 된다 (가격·종류·그림).

export type Slot = "wallL" | "wallR" | "floorL" | "floorR" | "front";
export type Kind = "wall" | "floor" | "window" | Slot;

export type Art = { rows: string[]; pal: Record<string, string> };

export type HouseItem = {
  id: string;
  name: string;
  /** wall/floor/window는 방 배경, 나머지는 놓을 수 있는 자리 */
  kind: "wall" | "floor" | "window" | "wallItem" | "floorItem" | "frontItem";
  price: number;
  rarity: "기본" | "일반" | "레어";
  art?: Art;
  /** 벽지·바닥: 두 가지 색 무늬 / 창문: 풍경 */
  colors?: string[];
  pattern?: "stripe" | "check" | "dots" | "plank" | "tile" | "plain";
  scene?: "bondi" | "opera" | "uluru";
};

export const SLOT_KIND: Record<Slot, HouseItem["kind"]> = {
  wallL: "wallItem",
  wallR: "wallItem",
  floorL: "floorItem",
  floorR: "floorItem",
  front: "frontItem",
};
export const SLOT_LABEL: Record<Slot, string> = {
  wallL: "왼쪽 벽",
  wallR: "오른쪽 벽",
  floorL: "왼쪽 바닥",
  floorR: "오른쪽 바닥",
  front: "앞쪽 바닥",
};

export const ITEMS: HouseItem[] = [
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

export const ITEM_BY_ID = new Map(ITEMS.map((i) => [i.id, i]));
export const FREE_ITEMS = ITEMS.filter((i) => i.price === 0).map((i) => i.id);

export type Layout = {
  wall: string;
  floor: string;
  window: string;
  slots: Partial<Record<Slot, string>>;
};

export const DEFAULT_LAYOUT: Layout = { wall: "wall-cream", floor: "floor-wood", window: "window-bondi", slots: {} };

/** 저장된 배치를 안전하게 읽는다 (없는 아이템·잘못된 자리는 버린다) */
export function normalizeLayout(raw: unknown): Layout {
  const r = (raw ?? {}) as Partial<Layout>;
  const ok = (id: unknown, kind: HouseItem["kind"]) =>
    typeof id === "string" && ITEM_BY_ID.get(id)?.kind === kind ? id : undefined;
  const slots: Layout["slots"] = {};
  for (const s of Object.keys(SLOT_KIND) as Slot[]) {
    const id = ok(r.slots?.[s], SLOT_KIND[s]);
    if (id) slots[s] = id;
  }
  return {
    wall: ok(r.wall, "wall") ?? DEFAULT_LAYOUT.wall,
    floor: ok(r.floor, "floor") ?? DEFAULT_LAYOUT.floor,
    window: ok(r.window, "window") ?? DEFAULT_LAYOUT.window,
    slots,
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
