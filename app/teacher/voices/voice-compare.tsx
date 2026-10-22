"use client";

import { useRef, useState } from "react";
import { cardClass, inputClass } from "@/app/_ui/styles";

const VOICES = [
  { id: "a", name: "Natasha", note: "지금 쓰는 목소리 · 호주 여성", now: true },
  { id: "b", name: "William", note: "지금 쓰는 목소리 · 호주 남성", now: true },
  { id: "ava_hd", name: "Ava HD", note: "최신 고품질 · 미국 여성" },
  { id: "emma_hd", name: "Emma HD", note: "최신 고품질 · 미국 여성" },
  { id: "andrew_hd", name: "Andrew HD", note: "최신 고품질 · 미국 남성" },
  { id: "brian_hd", name: "Brian HD", note: "최신 고품질 · 미국 남성" },
  { id: "ava_ml", name: "Ava", note: "대화체 · 미국 여성" },
  { id: "andrew_ml", name: "Andrew", note: "대화체 · 미국 남성" },
  { id: "freya", name: "Freya", note: "호주 여성 (AI 면접 Mia)" },
  { id: "duncan", name: "Duncan", note: "호주 남성 (AI 면접 Marco)" },
];

export function VoiceCompare() {
  const [text, setText] = useState("No, I have beef with you! I'm minding my business from here on out.");
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 실패를 그대로 보여주려고 브라우저 음성으로 대신 읽지 않는다
  async function play(t: string, speed: "normal" | "slow", key: string, voice: string) {
    audioRef.current?.pause();
    setPlayingKey(key);
    const res = await fetch(`/api/tts?speed=${speed}&voice=${voice}&text=${encodeURIComponent(t)}`);
    if (!res.ok) {
      setErrors((e) => ({ ...e, [voice]: "이 목소리는 지금 쓸 수 없어요" }));
      setPlayingKey(null);
      return;
    }
    const audio = new Audio(URL.createObjectURL(await res.blob()));
    audioRef.current = audio;
    audio.onended = () => setPlayingKey(null);
    void audio.play();
  }
  return (
    <div className="flex flex-col gap-3">
      <textarea className={inputClass} rows={2} value={text} onChange={(e) => setText(e.target.value)} />
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {VOICES.map((v) => (
          <li key={v.id} className={`${cardClass} flex items-center justify-between gap-2`}>
            <span className="flex flex-col">
              <span className="font-bold text-zinc-900">
                {v.name} {v.now && <span className="ml-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] text-sky-700">현재</span>}
              </span>
              <span className="text-xs text-zinc-500">{v.note}</span>
              {errors[v.id] && <span className="text-xs font-semibold text-rose-600">{errors[v.id]}</span>}
            </span>
            <span className="flex gap-1.5">
              {(["normal", "slow"] as const).map((sp) => {
                const key = `${v.id}:${sp}`;
                return (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => play(text.trim(), sp, key, v.id)}
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold ${playingKey === key ? "bg-[#6C5CFF] text-white" : "bg-slate-100 text-zinc-800"}`}
                  >
                    {sp === "normal" ? "▶ 보통" : "🐢 천천히"}
                  </button>
                );
              })}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-zinc-500">마음에 드는 목소리를 알려주시면 쉐도잉 기본 목소리로 바꿔 드려요.</p>
    </div>
  );
}
