"use client";

import { createContext, useContext } from "react";
import type { CatBreed } from "@/lib/classroom/cat";

type MyCat = { breed: CatBreed; name: string | null };
const CatContext = createContext<MyCat | null>(null);

/** 학생이 고른 고양이(종·이름)를 화면 깊은 곳(쉐도잉 결과 등)까지 전달 */
export function CatProvider({
  breed,
  name,
  children,
}: {
  breed: CatBreed | null;
  name: string | null;
  children: React.ReactNode;
}) {
  return <CatContext.Provider value={breed ? { breed, name } : null}>{children}</CatContext.Provider>;
}

/** 아직 고르지 않았으면 null */
export function useMyCat() {
  return useContext(CatContext);
}
