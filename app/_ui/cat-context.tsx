"use client";

import { createContext, useContext } from "react";
import type { CatBreed, CatStage } from "@/lib/classroom/cat";

type MyCat = { breed: CatBreed; name: string | null; stage: CatStage };
const CatContext = createContext<MyCat | null>(null);

/** 학생이 고른 고양이(종·이름)를 화면 깊은 곳(쉐도잉 결과 등)까지 전달 */
export function CatProvider({
  breed,
  name,
  stage = 1,
  children,
}: {
  breed: CatBreed | null;
  name: string | null;
  /** 성장 단계 (공부한 날로 자란다) */
  stage?: CatStage;
  children: React.ReactNode;
}) {
  return <CatContext.Provider value={breed ? { breed, name, stage } : null}>{children}</CatContext.Provider>;
}

/** 아직 고르지 않았으면 null */
export function useMyCat() {
  return useContext(CatContext);
}
