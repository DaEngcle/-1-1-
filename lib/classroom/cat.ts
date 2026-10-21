// 다잉클 응원 고양이 (도트) — 고양이 종 6가지 x 표정 5가지. 서버·클라이언트 공용.

type Breed = {
  name: string;
  fur: string;
  dark: string;
  belly: string;
  ear: string;
  eye: string;
  pupil?: string;
  stripes?: boolean;
  folded?: boolean;
  noShine?: boolean;
  point?: string;
  mouth?: string;
  ragdoll?: boolean;
};

export const CAT_BREEDS = {
  gray: {
    name: "코숏 고등어",
    fur: "#8E99AB", dark: "#6F7A8E", belly: "#DCE2EA", ear: "#FF9DB0",
    eye: "#1F2433", stripes: true,
  },
  cheese: {
    name: "치즈냥이",
    fur: "#F4A259", dark: "#D9782C", belly: "#FFF3E2", ear: "#FF9DB0",
    eye: "#1F2433", stripes: true,
  },
  russian: {
    name: "러시안블루",
    fur: "#7F91AA", dark: "#66788F", belly: "#9AABC2", ear: "#D9A5B8",
    eye: "#4CC36A", pupil: "#1F2433",
  },
  fold: {
    name: "스코티시폴드",
    fur: "#E9D8C2", dark: "#C9AF8F", belly: "#FFF8EE", ear: "#C9AF8F",
    eye: "#1F2433", folded: true, noShine: true,
  },
  siamese: {
    name: "샴",
    fur: "#F1E6D6", dark: "#5B4033", belly: "#FFFBF4", ear: "#5B4033",
    eye: "#3B82F6", pupil: "#1F2433", point: "#5B4033", mouth: "#2A1C15",
  },
  ragdoll: {
    name: "랙돌",
    fur: "#F8F5F0", dark: "#8C7A6B", belly: "#FFFFFF", ear: "#8C7A6B",
    eye: "#3B82F6", pupil: "#1F2433", point: "#8C7A6B", ragdoll: true,
  },
} satisfies Record<string, Breed>;

export type CatBreed = keyof typeof CAT_BREEDS;
export type CatMood = "default" | "happy" | "cheer" | "sad" | "sleepy";

export const CAT_BREED_IDS = Object.keys(CAT_BREEDS) as CatBreed[];

export function isCatBreed(v: unknown): v is CatBreed {
  return typeof v === "string" && v in CAT_BREEDS;
}

const BASE = [
  "...##........##...",
  "..#p#........#p#..",
  "..#pp########pp#..",
  ".######s#s#s#####.",
  ".################.",
  ".################.",
  ".################.",
  ".################.",
  ".##c##########c##.",
  ".################.",
  "..##bbbbbbbbbb##..",
  "..##bbbbbbbbbb##..",
  "..##############..",
  "...ff.ff..ff.ff...",
];

/** 움직임용 부위: 몸(통통 튐), 눈(깜빡), 발(가만히), 꼬리(살랑), 팔(흔들) */
export type CatPart = "body" | "eye" | "feet" | "tail" | "arm";
export type CatPixel = { x: number; y: number; w: number; h: number; fill: string; part: CatPart };

/** 한 칸 = 1 단위. viewBox는 "-3 -3 24 18" */
export function catPixels(breedId: CatBreed, mood: CatMood): { pixels: CatPixel[]; z: boolean } {
  const B: Breed = CAT_BREEDS[breedId];
  const grid = BASE.map((r) => r.split(""));
  const put = (x: number, y: number, c: string) => (grid[y][x] = c);

  if (B.folded) {
    // 접힌 귀
    grid[0] = "..................".split("");
    grid[1] = "..................".split("");
    grid[2] = "..ddd########ddd..".split("");
    grid[3][2] = "d";
    grid[3][15] = "d";
  }
  if (B.ragdoll) {
    // 귀·눈 주변만 진하고, 코 위로 하얀 V, 하얀 장갑 발, 복슬한 목털
    for (let y = 0; y < 3; y++) for (let x = 0; x < 18; x++) if (grid[y][x] !== ".") grid[y][x] = "k";
    for (let y = 3; y <= 7; y++)
      for (let x = 2; x <= 15; x++) {
        const v = Math.abs(x - 8.5) < 0.5 + (y - 3) * 0.5;
        if (!v && (grid[y][x] === "#" || grid[y][x] === "s")) put(x, y, "k");
      }
    for (const [x, y] of [[0, 9], [0, 10], [17, 10], [1, 11], [16, 11]]) put(x, y, "b");
  } else if (B.point) {
    // 샴: 귀·얼굴 가운데가 진한 색
    for (let y = 0; y < 3; y++) for (let x = 0; x < 18; x++) if (grid[y][x] !== ".") grid[y][x] = "k";
    for (let y = 6; y <= 9; y++) for (let x = 6; x <= 11; x++) put(x, y, "k");
    for (const x of [7, 8, 9, 10]) put(x, 5, "k");
  }

  // 눈
  if (mood === "happy" || mood === "cheer") {
    put(4, 6, "m"); put(5, 5, "m"); put(6, 6, "m");
    put(11, 6, "m"); put(12, 5, "m"); put(13, 6, "m");
  } else if (mood === "sleepy") {
    for (const x of [4, 5, 6, 11, 12, 13]) put(x, 6, "m");
  } else {
    const y0 = mood === "sad" ? 6 : 5;
    for (const x of [4, 5, 12, 13]) {
      put(x, y0, "e");
      put(x, y0 + 1, "e");
    }
    if (!B.noShine) {
      put(4, y0, "w");
      put(12, y0, "w");
    }
    if (B.pupil) {
      put(5, y0 + 1, "q");
      put(13, y0 + 1, "q");
    }
    if (mood === "sad") put(13, y0 + 2, "t");
  }

  // 코·입
  if (mood === "happy" || mood === "cheer") {
    put(8, 8, "m"); put(9, 8, "m"); put(8, 9, "r"); put(9, 9, "r");
  } else if (mood === "sad") {
    put(8, 9, "m"); put(9, 9, "m"); put(7, 10, "m"); put(10, 10, "m");
  } else if (mood === "sleepy") {
    put(8, 8, "n"); put(9, 8, "n"); put(8, 9, "m"); put(9, 9, "m");
  } else {
    put(8, 8, "n"); put(9, 8, "n");
    put(7, 9, "m"); put(10, 9, "m"); put(8, 10, "m"); put(9, 10, "m");
  }

  const color: Record<string, string> = {
    "#": B.fur,
    d: B.dark,
    b: B.belly,
    p: B.ear,
    c: "#FFB3C1",
    s: B.stripes ? B.dark : B.fur,
    f: B.ragdoll ? "#FFFFFF" : (B.point ?? B.dark),
    k: B.point ?? B.dark,
    e: B.eye,
    q: B.pupil ?? B.eye,
    w: "#FFFFFF",
    m: B.mouth ?? "#1F2433",
    r: "#FF7A93",
    t: "#7CC3FF",
    n: B.point && !B.ragdoll ? "#C9737F" : "#FF9DB0",
  };

  const pixels: CatPixel[] = [];
  grid.forEach((row, y) =>
    row.forEach((c, x) => {
      if (c === ".") return;
      const part: CatPart = y === 13 ? "feet" : "ewq".includes(c) ? "eye" : "body";
      pixels.push({ x, y, w: 1, h: 1, fill: color[c], part });
    }),
  );
  const tail = B.point ?? B.dark;
  pixels.push(
    { x: 17, y: 9, w: 1, h: 3, fill: tail, part: "tail" },
    { x: 18, y: 7, w: 1, h: 3, fill: tail, part: "tail" },
  );
  if (mood === "cheer") {
    pixels.push(
      { x: -1, y: 4, w: 1, h: 4, fill: B.dark, part: "arm" },
      { x: -2, y: 2, w: 1, h: 3, fill: B.dark, part: "arm" },
      { x: -3, y: -1, w: 1, h: 1, fill: "#FFC94A", part: "arm" },
      { x: 19, y: 0, w: 1, h: 1, fill: "#FFC94A", part: "arm" },
    );
  }
  return { pixels, z: mood === "sleepy" };
}
