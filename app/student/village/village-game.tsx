"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { SpeakPractice } from "./speak-practice";

type VillageConfig = {
  base: string;
  breed: string | null;
  churu: number;
  friends: { breed: string; name: string }[];
  onOpen: (href: string) => void;
  onRoomOpen: (slot: HTMLElement, text: string) => void;
  onRoomClose: () => void;
};

declare global {
  interface Window {
    startVillage?: (root: HTMLElement, cfg: VillageConfig) => () => void;
  }
}

const SCRIPT_SRC = "/village/village.js?v=13";

function loadScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.startVillage) return resolve();
    const found = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const s = found ?? document.createElement("script");
    s.addEventListener("load", () => resolve());
    s.addEventListener("error", () => reject(new Error("마을을 불러오지 못했어요")));
    if (!found) {
      s.src = SCRIPT_SRC;
      document.head.appendChild(s);
    }
  });
}

export function VillageGame({
  breed,
  churu,
  friends,
}: {
  breed: string | null;
  churu: number;
  friends: { breed: string; name: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [failed, setFailed] = useState(false);
  const [speak, setSpeak] = useState<{ slot: HTMLElement; text: string } | null>(null);
  // 서버가 다시 그려도 게임을 처음부터 다시 시작하지 않게 첫 값만 쓴다
  const first = useRef({ breed, churu, friends });

  useEffect(() => {
    let stop: (() => void) | undefined;
    let gone = false;
    loadScript()
      .then(() => {
        if (gone || !ref.current || !window.startVillage) return;
        stop = window.startVillage(ref.current, {
          base: "/village/",
          ...first.current,
          onOpen: (href) => router.push(href),
          onRoomOpen: (slot, text) => setSpeak({ slot, text }),
          onRoomClose: () => setSpeak(null),
        });
      })
      .catch(() => setFailed(true));
    return () => {
      gone = true;
      stop?.();
    };
  }, [router]);

  if (failed) {
    return <p className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">마을을 불러오지 못했어요. 새로고침해 주세요.</p>;
  }
  return (
    <>
      <div ref={ref} className="h-[calc(100dvh-230px)] min-h-[420px] overflow-hidden rounded-2xl border-[3px] border-[#2a2350] sm:h-[calc(100dvh-210px)]" />
      {speak && createPortal(<SpeakPractice key={speak.text} text={speak.text} />, speak.slot)}
    </>
  );
}
