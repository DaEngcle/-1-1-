"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { SpeakPractice } from "./speak-practice";
import { sendVillageChatAction } from "./actions";

/** 마을 말풍선 하나 (village.js가 그린다) */
type ChatBubble = { name: string; breed: string | null; text: string; mine: boolean; at: string };
type ChatMessage = ChatBubble & { id: string };
type VillageApi = { say: (msg: ChatBubble) => void };

const CHAT_POLL_MS = 4000;

type VillageConfig = {
  base: string;
  breed: string | null;
  churu: number;
  friends: { breed: string; name: string }[];
  onOpen: (href: string) => void;
  onRoomOpen: (slot: HTMLElement, text: string) => void;
  onRoomClose: () => void;
  /** 내 표시 이름 (닉네임 또는 가린 이름) */
  myName: string;
  /** 지도에서 채팅을 보냈을 때 */
  onChat: (text: string) => void;
  /** village.js가 준비되면 한 번 불러 준다. api.say로 말풍선을 띄운다 */
  onReady: (api: VillageApi) => void;
};

declare global {
  interface Window {
    startVillage?: (root: HTMLElement, cfg: VillageConfig) => () => void;
  }
}

const SCRIPT_SRC = "/village/village.js?v=27";

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
  myName,
}: {
  breed: string | null;
  churu: number;
  friends: { breed: string; name: string }[];
  myName: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [failed, setFailed] = useState(false);
  const [speak, setSpeak] = useState<{ slot: HTMLElement; text: string } | null>(null);
  // 서버가 다시 그려도 게임을 처음부터 다시 시작하지 않게 첫 값만 쓴다
  const first = useRef({ breed, churu, friends, myName });

  useEffect(() => {
    let stop: (() => void) | undefined;
    let gone = false;

    // 채팅: 4초마다 새 메시지를 묻고, 같은 id는 한 번만 말풍선으로 띄운다
    let api: VillageApi | null = null;
    let timer: ReturnType<typeof setInterval> | undefined;
    let polling = false;
    let cursor: string | null = null;
    const seen = new Set<string>();
    const show = (m: ChatMessage) => {
      if (gone || !api || seen.has(m.id)) return;
      seen.add(m.id);
      if (!cursor || m.at > cursor) cursor = m.at;
      api.say({ name: m.name, breed: m.breed, text: m.text, mine: m.mine, at: m.at });
    };
    const poll = async () => {
      if (gone || polling || document.hidden) return;
      polling = true;
      try {
        const res = await fetch(`/api/village-chat${cursor ? `?after=${encodeURIComponent(cursor)}` : ""}`, { cache: "no-store" });
        if (res.ok) {
          const { messages } = (await res.json()) as { messages: ChatMessage[] };
          messages.forEach(show);
        }
      } catch {
        // 잠깐 끊겨도 다음 차례에 다시 묻는다
      } finally {
        polling = false;
      }
    };
    const notice = (text: string) =>
      api?.say({ name: "안내", breed: null, text, mine: false, at: new Date().toISOString() });
    loadScript()
      .then(() => {
        if (gone || !ref.current || !window.startVillage) return;
        stop = window.startVillage(ref.current, {
          base: "/village/",
          ...first.current,
          onOpen: (href) => router.push(href),
          onRoomOpen: (slot, text) => setSpeak({ slot, text }),
          onRoomClose: () => setSpeak(null),
          onChat: (text) => {
            sendVillageChatAction(text)
              .then((r) => (r.ok ? show(r.message) : notice(r.message)))
              .catch(() => notice("보내지 못했어요. 다시 해 주세요."));
          },
          onReady: (ready) => {
            if (gone || api) return;
            api = ready;
            void poll();
            timer = setInterval(() => void poll(), CHAT_POLL_MS);
          },
        });
      })
      .catch(() => setFailed(true));
    return () => {
      gone = true;
      if (timer) clearInterval(timer);
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
