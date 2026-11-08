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
  /** 턱시도: 하얀 주둥이·가슴·발 */
  tuxedo?: boolean;
  /** 오드아이: 오른쪽 눈 색 */
  eye2?: string;
  /** 감은 눈 색 (털이 검으면 밝게) */
  lid?: string;
  /** 장모종: 볼 털·귀 끝 털·풍성한 꼬리 */
  fluffy?: boolean;
  /** 흰 배경에서 안 묻히게 테두리 */
  outline?: string;
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
  tuxedo: {
    name: "턱시도",
    fur: "#2E3038", dark: "#2E3038", belly: "#FFFFFF", ear: "#FF9DB0",
    eye: "#E9D43B", tuxedo: true, lid: "#E9D43B",
  },
  white: {
    name: "오드아이",
    fur: "#FBFBFC", dark: "#D5D9E1", belly: "#FFFFFF", ear: "#FFB3C1",
    eye: "#3B82F6", eye2: "#E8B93B", pupil: "#1F2433", outline: "#C9CED8",
  },
  angora: {
    name: "터키시 앙고라",
    fur: "#FFFFFF", dark: "#CDD2DB", belly: "#FFFFFF", ear: "#FFC2CE",
    eye: "#C2CF4E", pupil: "#3A4A1F", outline: "#C3C9D4", fluffy: true,
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

/** 한 칸 = 1 단위. 1단계 viewBox는 "-3 -3 24 18" (단계별 크기는 catBox) */
export function catPixels(breedId: CatBreed, mood: CatMood, stage: CatStage = 1): { pixels: CatPixel[]; z: boolean } {
  return stage === 1 ? stageOnePixels(breedId, mood) : grownPixels(breedId, mood, stage);
}

function stageOnePixels(breedId: CatBreed, mood: CatMood): { pixels: CatPixel[]; z: boolean } {
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

  if (B.tuxedo) {
    // 하얀 주둥이 (입이 보이게)
    for (let y = 8; y <= 9; y++) for (let x = 6; x <= 11; x++) put(x, y, "b");
    put(7, 7, "b"); put(8, 7, "b"); put(9, 7, "b"); put(10, 7, "b");
  }

  if (B.fluffy) {
    // 볼 옆 복슬 털 + 귀 끝 털 + 턱 아래 목털
    for (const [x, y] of [[0, 7], [0, 8], [0, 9], [17, 7], [17, 8], [17, 9], [1, 10], [16, 10], [3, 0], [14, 0]]) put(x, y, "#");
  }

  // 눈
  if (mood === "happy" || mood === "cheer") {
    put(4, 6, "l"); put(5, 5, "l"); put(6, 6, "l");
    put(11, 6, "l"); put(12, 5, "l"); put(13, 6, "l");
  } else if (mood === "sleepy") {
    for (const x of [4, 5, 6, 11, 12, 13]) put(x, 6, "l");
  } else {
    const y0 = mood === "sad" ? 6 : 5;
    for (const x of [4, 5, 12, 13]) {
      const c = x > 8 && B.eye2 ? "E" : "e";
      put(x, y0, c);
      put(x, y0 + 1, c);
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
    f: B.ragdoll || B.tuxedo ? "#FFFFFF" : (B.point ?? B.dark),
    k: B.point ?? B.dark,
    e: B.eye,
    E: B.eye2 ?? B.eye,
    l: B.lid ?? B.mouth ?? "#1F2433",
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
      const part: CatPart = y === 13 ? "feet" : "ewqE".includes(c) ? "eye" : "body";
      pixels.push({ x, y, w: 1, h: 1, fill: color[c], part });
    }),
  );
  if (B.outline) {
    // 몸 둘레 한 칸 테두리
    const filled = new Set(pixels.map((p) => `${p.x},${p.y}`));
    const edge = new Set<string>();
    for (const p of [...pixels])
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const k = `${p.x + dx},${p.y + dy}`;
        if (!filled.has(k) && !edge.has(k)) {
          edge.add(k);
          const y = p.y + dy;
          pixels.unshift({ x: p.x + dx, y, w: 1, h: 1, fill: B.outline, part: y >= 13 ? "feet" : "body" });
        }
      }
  }
  const tail = B.point ?? B.dark;
  if (B.fluffy) {
    // 깃털처럼 풍성한 꼬리
    pixels.push(
      { x: 18, y: 9, w: 2, h: 3, fill: B.dark, part: "tail" },
      { x: 19, y: 6, w: 2, h: 3, fill: B.dark, part: "tail" },
      { x: 20, y: 4, w: 1, h: 2, fill: B.dark, part: "tail" },
    );
  }
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

// ───────────────────────── 성장 단계 (공부한 날이 쌓이면 자란다) ─────────────────────────

export type CatStage = 1 | 2 | 3 | 4 | 5;
export const CAT_STAGE_NAMES: Record<CatStage, string> = { 1: "아기", 2: "꼬마", 3: "아기 고양이", 4: "학생", 5: "다 자란 고양이" };

/**
 * 2~5단계 그림. 문자: # 털, p 귀 안, s 줄무늬, c 볼, b 배, f 발, t 꼬리, R 목도리, Y 금색.
 * 눈·코·입은 그림에 두지 않고 표정에 맞춰 face 좌표에 그린다.
 */
const GROWN: Record<Exclude<CatStage, 1>, { rows: string[]; face: Face; anchor: Anchors }> = {
  2: {
    rows: [
      "...##........##.....",
      "..#p#........#p#....",
      "..#pp########pp#....",
      ".######s#s#s#####...",
      ".################...",
      ".################...",
      ".################...",
      ".################...",
      ".##c##########c##...",
      ".################...",
      "..##############....",
      "...############.....",
      "...##bbbbbbbb##.tt..",
      "...##bbbbbbbb##..t..",
      "...##bbbbbbbb###tt..",
      "....##########......",
      "....ff.ff.ff.ff.....",
    ],
    face: { nx: 8, eyeL: 4, eyeR: 12, eyeY: 5, eyeH: 2, noseY: 8, ears: [0, 1], earBase: 2, earL: [2, 4], earR: [13, 15], maskTop: 3 },
    anchor: { head: [0, 0, 0], chest: [0, 2], left: [3, 3], right: [0, 3] },
  },
  3: {
    rows: [
      "..##..........##......",
      "..#p#........#p#......",
      "..#pp#......#pp#......",
      ".#ppp########ppp#.....",
      ".######s#s#s######....",
      "##################....",
      "##################....",
      "##################....",
      "##################....",
      "##c############c##....",
      ".#################....",
      "..###############.....",
      "...##############.....",
      "...##bbbbbbbbbb##.....",
      "..###bbbbbbbbbb###..tt",
      "..###bbbbbbbbbb###...t",
      "..###bbbbbbbbbb###..tt",
      "...##bbbbbbbbbb#####t.",
      "...##ff##bb##ff##.....",
      "....fff.....fff.......",
    ],
    face: { nx: 8, eyeL: 4, eyeR: 12, eyeY: 6, eyeH: 3, noseY: 9, ears: [0, 1, 2], earBase: 3, earL: [1, 4], earR: [13, 16], maskTop: 4 },
    anchor: { head: [0, 1, 2], chest: [1, 3], left: [2, 6], right: [3, 6] },
  },
  4: {
    rows: [
      "...##..............##.....",
      "...#p#............#p#.....",
      "...#pp#..........#pp#.....",
      "..#ppp############ppp#....",
      "..#######s#s#s########....",
      ".######################...",
      ".######################...",
      ".######################...",
      ".######################...",
      ".##cc##############cc##...",
      "..####################....",
      "...##################.....",
      "....################......",
      ".....RRRRRRRRRRRRRR.......",
      "....RRRRRRRRRRRRRRRR......",
      "....##RRbbbbbbbbbb##......",
      "...###bRbbbbbbbbbb###...tt",
      "...###bbbbbbbbbbbb###...t.",
      "...ff#bbbbbbbbbbbb#ff..tt.",
      ".....##bbbbbbbbbb###tt....",
      ".....######..######.......",
      ".....###........###.......",
      ".....fff........fff.......",
    ],
    face: { nx: 11, eyeL: 6, eyeR: 16, eyeY: 6, eyeH: 3, noseY: 9, ears: [0, 1, 2], earBase: 3, earL: [2, 5], earR: [18, 21], maskTop: 4 },
    anchor: { head: [3, 1, 6], chest: [3, 5], left: [3, 9], right: [7, 9] },
  },
  5: {
    rows: [
      "....Y.......................Y",
      "...##..............##.......",
      "...#p#............#p#.......",
      "...#pp#..........#pp#.......",
      "..#ppp############ppp#.......",
      "..#######s#s#s########.......",
      ".######################......",
      ".######################......",
      ".######################......",
      ".######################...Y..",
      ".##cc##############cc##......",
      "..####################.......",
      "...##################........",
      "....##bbbbbbbbbbbbbb##.......",
      "...###bbbbbbbbbbbbbb###......",
      "...###bbbbbbbbbbbbbb###...ttt",
      "...###bbbbbbYYbbbbbb###..tttt",
      "...###bbbbbYYYYbbbbb###..ttt.",
      "...ff#bbbbbbYYbbbbbb#ff.ttt..",
      ".....##bbbbbbbbbbbb###tt.....",
      ".....#######..#######........",
      ".....####........####........",
      ".....ffff........ffff........",
    ],
    face: { nx: 11, eyeL: 6, eyeR: 16, eyeY: 7, eyeH: 3, noseY: 10, ears: [1, 2, 3], earBase: 4, earL: [2, 5], earR: [18, 21], maskTop: 5 },
    anchor: { head: [3, 2, 6], chest: [4, 3], left: [3, 9], right: [10, 9] },
  },
};

type Face = {
  /** 코 왼쪽 칸 (코는 nx, nx+1) */
  nx: number;
  /** 왼눈·오른눈 왼쪽 칸 (눈은 가로 2칸) */
  eyeL: number;
  eyeR: number;
  eyeY: number;
  eyeH: number;
  noseY: number;
  /** 귀만 있는 줄 (접힌 귀면 지운다) */
  ears: number[];
  /** 귀와 머리가 만나는 줄과 그 줄의 귀 가로 범위 */
  earBase: number;
  earL: [number, number];
  earR: [number, number];
  /** 랙돌 얼굴 무늬 시작 줄 */
  maskTop: number;
};

/**
 * 소품을 단계마다 옮기는 기준 (1단계 좌표에서 얼마나 옮길지).
 * head: [dx, dy, 모자 가로 늘리기], chest: 목·가슴, left: 왼쪽에 드는 것, right: 오른쪽에 드는 것
 */
type Anchors = { head: [number, number, number]; chest: [number, number]; left: [number, number]; right: [number, number] };
export type CatAnchor = keyof Anchors;

const STAGE_ONE_ANCHORS: Anchors = { head: [0, 0, 0], chest: [0, 0], left: [0, 0], right: [0, 0] };

export function catAnchors(stage: CatStage): Anchors {
  return stage === 1 ? STAGE_ONE_ANCHORS : GROWN[stage].anchor;
}

/** 단계별 그림 크기 (SVG viewBox). 1단계는 지금과 같은 -3 -3 24 18 */
export function catBox(stage: CatStage) {
  if (stage === 1) return { x: -3, y: -3, w: 24, h: 18 };
  const rows = GROWN[stage].rows;
  const w = Math.max(...rows.map((r) => r.length));
  return { x: -3, y: -3, w: w + 6, h: rows.length + 4 };
}

function grownPixels(breedId: CatBreed, mood: CatMood, stage: Exclude<CatStage, 1>): { pixels: CatPixel[]; z: boolean } {
  const B: Breed = CAT_BREEDS[breedId];
  const { rows, face: F } = GROWN[stage];
  const W = Math.max(...rows.map((r) => r.length));
  // 그림의 꼬리 t는 눈물 t와 겹치지 않게 T로
  const grid = rows.map((r) => r.padEnd(W, ".").replace(/t/g, "T").split(""));
  const at = (x: number, y: number) => grid[y]?.[x] ?? ".";
  const put = (x: number, y: number, c: string) => {
    if (grid[y] && x >= 0 && x < W) grid[y][x] = c;
  };
  const solid = (c: string) => c !== "." && c !== "T" && c !== "Y";
  const headSpan = (y: number) => {
    const xs = grid[y].map((c, x) => (solid(c) ? x : -1)).filter((x) => x >= 0);
    return xs.length ? [Math.min(...xs), Math.max(...xs)] : [0, -1];
  };
  const cx = F.nx + 0.5;

  if (B.folded) {
    for (const y of F.ears) grid[y] = grid[y].map((c) => (c === "Y" ? c : "."));
    for (const [a, b] of [F.earL, F.earR]) for (let x = a; x <= b; x++) if (solid(at(x, F.earBase))) put(x, F.earBase, "d");
    if (solid(at(F.earL[0], F.earBase + 1))) put(F.earL[0], F.earBase + 1, "d");
    if (solid(at(F.earR[1], F.earBase + 1))) put(F.earR[1], F.earBase + 1, "d");
  }
  if (B.ragdoll || B.point) {
    // 귀는 진한 색
    for (const y of F.ears) grid[y] = grid[y].map((c) => (solid(c) ? "k" : c));
    for (const [a, b] of [F.earL, F.earR]) for (let x = a; x <= b; x++) if (solid(at(x, F.earBase))) put(x, F.earBase, "k");
  }
  if (B.ragdoll) {
    // 코 위로 하얀 V, 나머지 얼굴 위쪽은 진하게
    for (let y = F.maskTop; y <= F.maskTop + 4; y++) {
      const [l, r] = headSpan(y);
      for (let x = l + 1; x <= r - 1; x++) {
        const v = Math.abs(x - cx) < 0.5 + (y - F.maskTop) * 0.5;
        if (!v && (at(x, y) === "#" || at(x, y) === "s")) put(x, y, "k");
      }
    }
  } else if (B.point) {
    // 샴: 얼굴 가운데가 진한 색
    for (let y = F.noseY - 2; y <= F.noseY + 1; y++) for (let x = F.nx - 2; x <= F.nx + 3; x++) put(x, y, "k");
    for (let x = F.nx - 1; x <= F.nx + 2; x++) put(x, F.noseY - 3, "k");
  }
  if (B.tuxedo) {
    // 하얀 주둥이 (입이 보이게)
    for (let y = F.noseY; y <= F.noseY + 1; y++) for (let x = F.nx - 2; x <= F.nx + 3; x++) put(x, y, "b");
    for (let x = F.nx - 1; x <= F.nx + 2; x++) put(x, F.noseY - 1, "b");
  }
  if (B.fluffy) {
    // 볼 옆 복슬 털
    for (let y = F.noseY - 1; y <= F.noseY + 1; y++) {
      const [l, r] = headSpan(y);
      if (at(l - 1, y) === ".") put(l - 1, y, "#");
      if (at(r + 1, y) === ".") put(r + 1, y, "#");
    }
  }

  // 눈
  const L = F.eyeL;
  const R = F.eyeR;
  if (mood === "happy" || mood === "cheer") {
    const y = F.eyeY + F.eyeH - 2;
    put(L, y + 1, "l"); put(L + 1, y, "l"); put(L + 2, y + 1, "l");
    put(R - 1, y + 1, "l"); put(R, y, "l"); put(R + 1, y + 1, "l");
  } else if (mood === "sleepy") {
    for (const x of [L, L + 1, L + 2, R - 1, R, R + 1]) put(x, F.eyeY + F.eyeH - 1, "l");
  } else {
    const y0 = mood === "sad" ? F.eyeY + 1 : F.eyeY;
    const h = mood === "sad" ? F.eyeH - 1 : F.eyeH;
    for (const x of [L, L + 1, R, R + 1]) {
      const c = x >= R && B.eye2 ? "E" : "e";
      for (let y = y0; y < y0 + h; y++) put(x, y, c);
    }
    if (!B.noShine) {
      put(L, y0, "w");
      put(R, y0, "w");
    }
    if (B.pupil) {
      put(L + 1, y0 + h - 1, "q");
      put(R + 1, y0 + h - 1, "q");
    }
    if (mood === "sad") put(R + 1, y0 + h, "t");
  }

  // 코·입
  const n = F.nx;
  const y = F.noseY;
  if (mood === "happy" || mood === "cheer") {
    put(n, y, "m"); put(n + 1, y, "m"); put(n, y + 1, "r"); put(n + 1, y + 1, "r");
  } else if (mood === "sad") {
    put(n, y + 1, "m"); put(n + 1, y + 1, "m"); put(n - 1, y + 2, "m"); put(n + 2, y + 2, "m");
  } else if (mood === "sleepy") {
    put(n, y, "n"); put(n + 1, y, "n"); put(n, y + 1, "m"); put(n + 1, y + 1, "m");
  } else {
    put(n, y, "n"); put(n + 1, y, "n");
    put(n - 1, y + 1, "m"); put(n + 2, y + 1, "m"); put(n, y + 2, "m"); put(n + 1, y + 2, "m");
  }

  const tail = B.point ?? B.dark;
  const color: Record<string, string> = {
    "#": B.fur,
    d: B.dark,
    b: B.belly,
    p: B.ear,
    c: "#FFB3C1",
    s: B.stripes ? B.dark : B.fur,
    f: B.ragdoll || B.tuxedo ? "#FFFFFF" : (B.point ?? B.dark),
    k: B.point ?? B.dark,
    e: B.eye,
    E: B.eye2 ?? B.eye,
    l: B.lid ?? B.mouth ?? "#1F2433",
    q: B.pupil ?? B.eye,
    w: "#FFFFFF",
    m: B.mouth ?? "#1F2433",
    r: "#FF7A93",
    t: "#7CC3FF",
    n: B.point && !B.ragdoll ? "#C9737F" : "#FF9DB0",
    T: tail,
    R: "#E2574C",
    Y: "#FFC94A",
  };

  const pixels: CatPixel[] = [];
  grid.forEach((row, yy) =>
    row.forEach((c, x) => {
      if (c === ".") return;
      const part: CatPart = c === "f" ? "feet" : c === "T" ? "tail" : "ewqE".includes(c) ? "eye" : "body";
      pixels.push({ x, y: yy, w: 1, h: 1, fill: color[c], part });
    }),
  );
  if (B.fluffy) {
    // 풍성한 꼬리: 꼬리 칸 오른쪽에 한 칸씩 더
    const has = new Set(pixels.map((p) => `${p.x},${p.y}`));
    for (const p of pixels.filter((q) => q.part === "tail")) {
      const k = `${p.x + 1},${p.y}`;
      if (!has.has(k)) {
        has.add(k);
        pixels.push({ ...p, x: p.x + 1, fill: B.dark });
      }
    }
  }
  if (B.outline) {
    const filled = new Set(pixels.filter((p) => p.part !== "tail").map((p) => `${p.x},${p.y}`));
    const edge = new Set<string>();
    for (const p of pixels.filter((q) => q.part !== "tail" && q.fill !== color.Y))
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const k = `${p.x + dx},${p.y + dy}`;
        if (!filled.has(k) && !edge.has(k)) {
          edge.add(k);
          pixels.unshift({ x: p.x + dx, y: p.y + dy, w: 1, h: 1, fill: B.outline, part: p.part === "feet" ? "feet" : "body" });
        }
      }
  }
  if (mood === "cheer") {
    pixels.push(
      { x: -1, y: F.eyeY - 1, w: 1, h: 4, fill: B.dark, part: "arm" },
      { x: -2, y: F.eyeY - 3, w: 1, h: 3, fill: B.dark, part: "arm" },
      { x: -3, y: -1, w: 1, h: 1, fill: "#FFC94A", part: "arm" },
      { x: W + 1, y: 0, w: 1, h: 1, fill: "#FFC94A", part: "arm" },
    );
  }
  return { pixels, z: mood === "sleepy" };
}

/** 공부한 날 수 → 단계 기준 (이 날 수 이상이면 그 단계) */
export const CAT_STAGE_DAYS: Record<CatStage, number> = { 1: 0, 2: 7, 3: 20, 4: 45, 5: 80 };

export function catStageForDays(days: number): CatStage {
  return ([5, 4, 3, 2, 1] as CatStage[]).find((s) => days >= CAT_STAGE_DAYS[s]) ?? 1;
}

/** 다음 단계까지 남은 공부한 날 (다 자랐으면 null) */
export function daysToNextStage(days: number): { next: CatStage; left: number } | null {
  const cur = catStageForDays(days);
  if (cur === 5) return null;
  const next = (cur + 1) as CatStage;
  return { next, left: CAT_STAGE_DAYS[next] - days };
}

export function isCatStage(v: unknown): v is CatStage {
  return v === 1 || v === 2 || v === 3 || v === 4 || v === 5;
}
