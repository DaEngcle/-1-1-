"use client";

import { createContext, useContext } from "react";
import type { CatBreed } from "@/lib/classroom/cat";

const CatContext = createContext<CatBreed | null>(null);

/** 학생이 고른 고양이를 화면 깊은 곳(쉐도잉 결과 등)까지 전달 */
export function CatProvider({ breed, children }: { breed: CatBreed | null; children: React.ReactNode }) {
  return <CatContext.Provider value={breed}>{children}</CatContext.Provider>;
}

/** 아직 고르지 않았으면 null */
export function useCatBreed() {
  return useContext(CatContext);
}
