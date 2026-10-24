"use client";

import { useSyncExternalStore } from "react";

/**
 * 학생 설정 (이 기기에만 저장). 설정 화면에서 바꾸고, 각 화면에서 기본값으로 쓴다.
 * 저장소를 못 쓰는 브라우저에서도 기본값으로 문제없이 동작한다.
 */
export const PREFS = {
  /** 쉐도잉 문장 해석을 처음부터 펼쳐 둘지 */
  showTranslation: { key: "dingle:pref:show-ko", default: false },
  /** AI 면접 자막(면접관 말)을 처음부터 켤지 */
  interviewSubtitles: { key: "dingle:pref:subtitles", default: false },
  /** 보카·문법 게임 효과음 */
  gameSound: { key: "dingle:pref:sfx", default: true },
} as const;
export type PrefName = keyof typeof PREFS;

const EVENT = "dingle:pref";

export function readPref(name: PrefName): boolean {
  const p = PREFS[name];
  try {
    const v = localStorage.getItem(p.key);
    return v === null ? p.default : v === "1";
  } catch {
    return p.default;
  }
}

export function writePref(name: PrefName, value: boolean) {
  try {
    localStorage.setItem(PREFS[name].key, value ? "1" : "0");
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** 설정값 (서버 렌더링 때는 기본값 → 화면이 뜬 뒤 저장된 값으로) */
export function usePref(name: PrefName) {
  return useSyncExternalStore(
    subscribe,
    () => readPref(name),
    () => PREFS[name].default,
  );
}
