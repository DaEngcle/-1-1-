// 내 워홀 코스: 첫 번째로 고른 직군에 맞춰 도트 고양이에 얹는 작은 소품. 서버·브라우저 공용.
// 고양이 격자(lib/classroom/cat.ts, 가로 18칸 x 세로 14칸) 좌표를 그대로 쓴다. 그림 파일 없이 칸만 칠한다.
import type { CatGearLayer } from "@/app/_ui/cat";
import type { JobId } from "./course-questions";

export type GearId = "apron" | "chef" | "mop" | "hardhat" | "straw" | "shop" | "heart" | "comb" | "tie" | "backpack";

const BROWN = "#8B5E3C";

export const GEAR: Record<GearId, { label: string; layers: CatGearLayer[] }> = {
  // 카페·서빙: 초록 앞치마 + 테이크어웨이 컵
  apron: {
    label: "앞치마 + 커피",
    layers: [
      { x: 5, y: 10, rows: ["A......A", "AAAAAAAA", "AAApAAAA"], pal: { A: "#2F7A55", p: "#24603F" } },
      { x: -2, y: 9, rows: ["ddd", "www", "sss", "www"], pal: { d: "#5B3A29", w: "#F2E6D3", s: "#B5763C" }, anchor: "left" },
    ],
  },
  // 주방·베이커리: 하얀 셰프 모자
  chef: {
    label: "셰프 모자",
    layers: [
      {
        x: 4,
        y: -3,
        rows: ["..oo..oo..", ".oWWooWWo.", "oWWWWWWWWo", "oWWWWWWWWo", ".oWWWWWWo.", ".GGGGGGGG."],
        pal: { W: "#FFFFFF", o: "#C9D1DD", G: "#E4E8EF" }, anchor: "head",
      },
    ],
  },
  // 청소·하우스키핑: 반다나 + 대걸레
  mop: {
    label: "반다나 + 대걸레",
    layers: [
      {
        x: 3,
        y: 1,
        rows: ["...BBBBBB.....", ".BBBwBBwBBB...", "BBBBBBBBBBBBKK", ".............K"],
        pal: { B: "#E2556B", w: "#FFFFFF", K: "#C9445A" },
        anchor: "head",
      },
      {
        x: -3,
        y: 2,
        rows: ["..k.", "..k.", "..k.", "..k.", "..k.", "..k.", "..k.", "..k.", "..k.", ".kk.", "mmmm", "m.mm"],
        pal: { k: BROWN, m: "#8FB4E3" }, anchor: "left",
      },
    ],
  },
  // 건설·기술·공장: 노란 안전모
  hardhat: {
    label: "안전모",
    layers: [{ x: 2, y: -1, rows: ["....YYYYYY....", "..YYYYYyYYYY..", ".YYYYYYyYYYYY.", "DDDDDDDDDDDDDD"], pal: { Y: "#FFC93C", y: "#FFE48A", D: "#E0A400" }, anchor: "head" }],
  },
  // 농장: 밀짚모자
  straw: {
    label: "밀짚모자",
    layers: [
      {
        x: 0,
        y: -2,
        rows: [".....SSSSSSSS.....", ".....SSSSSSSS.....", ".....RRRRRRRR.....", "SSSSSSSSSSSSSSSSSS", ".TTTTTTTTTTTTTTTT."],
        pal: { S: "#E8C46A", R: "#D4573F", T: "#C9A24E" }, anchor: "head",
      },
    ],
  },
  // 리테일·옷가게: 이름표 + 쇼핑백
  shop: {
    label: "이름표 + 쇼핑백",
    layers: [
      { x: 11, y: 10, rows: ["NNNN", "NwwN", "NNNN"], pal: { N: "#2453EB", w: "#FFFFFF" } },
      { x: 19, y: 8, rows: [".h.", "h.h", "PPP", "PPP", "PPP"], pal: { h: "#C2185B", P: "#FF8FA3" }, anchor: "right" },
    ],
  },
  // 케어(요양·아이·동물): 하트 배지
  heart: {
    label: "하트 배지",
    layers: [{ x: 11, y: 9, rows: ["rr.rr", "rrrrr", ".rrr.", "..r.."], pal: { r: "#FF5A7A" } }],
  },
  // 미용: 빗
  comb: {
    label: "빗",
    layers: [{ x: -3, y: 7, rows: ["CCCC", "CCCC", "C.C.", "C.C."], pal: { C: "#8E5BD6" }, anchor: "left" }],
  },
  // 사무·호텔 프런트: 넥타이
  tie: {
    label: "넥타이",
    layers: [{ x: 7, y: 11, rows: [".kk.", "TTTT", ".TT."], pal: { k: "#1D37A8", T: "#2453EB" } }],
  },
  // 기타: 작은 배낭
  backpack: {
    label: "배낭",
    layers: [{ x: -3, y: 6, rows: [".kk.", "kOOk", "OOOO", "OooO", "OOOO"], pal: { k: BROWN, O: "#FF9F43", o: "#E07B1A" }, anchor: "left" }],
  },
};

const GEAR_FOR_JOB: Record<JobId, GearId> = {
  cafe: "apron",
  serving: "apron",
  kitchen: "chef",
  bakery: "chef",
  takeaway: "chef",
  housekeeping: "mop",
  cleaning: "mop",
  hotel: "tie",
  resort: "tie",
  care: "heart",
  childcare: "heart",
  animal: "heart",
  salon: "comb",
  retail: "shop",
  fashion: "shop",
  servo: "shop",
  construction: "hardhat",
  trades: "hardhat",
  factory: "hardhat",
  farm: "straw",
  office: "tie",
  fitness: "backpack",
  other: "backpack",
};

/** 첫 번째로 고른 직군의 소품 (직군이 없고 직접 적은 일만 있으면 배낭, 아무것도 없으면 없음) */
export function jobGear(jobs: readonly JobId[] | undefined, jobOther?: string): CatGearLayer[] | undefined {
  const first = jobs?.[0];
  if (first) return GEAR[GEAR_FOR_JOB[first]].layers;
  return jobOther ? GEAR.backpack.layers : undefined;
}
