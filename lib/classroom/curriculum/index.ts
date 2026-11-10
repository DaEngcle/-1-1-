// 직군별 커리큘럼 모음 (직군마다 5 STEP × 6상황)
import type { JobCurriculum } from "./kit";
import animal from "./animal";
import bakery from "./bakery";
import cafe from "./cafe";
import care from "./care";
import childcare from "./childcare";
import cleaning from "./cleaning";
import construction from "./construction";
import factory from "./factory";
import farm from "./farm";
import fashion from "./fashion";
import fitness from "./fitness";
import hotel from "./hotel";
import housekeeping from "./housekeeping";
import kitchen from "./kitchen";
import office from "./office";
import resort from "./resort";
import retail from "./retail";
import salon from "./salon";
import serving from "./serving";
import servo from "./servo";
import takeaway from "./takeaway";
import trades from "./trades";

export const CURRICULA = {
  cafe, serving, kitchen, housekeeping, hotel, resort, retail, farm, factory, construction, takeaway,
  bakery, cleaning, trades, fashion, servo, salon, care, childcare, animal, fitness, office,
} satisfies Record<string, JobCurriculum>;
