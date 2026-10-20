"use client";

import { useEffect, useState } from "react";

/** 서비스 워커 등록 (배포 환경에서만) */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => undefined);
  }, []);
  return null;
}

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

/** 학생 홈의 '앱으로 설치' 안내: 안드로이드·PC는 버튼, 아이폰은 방법 안내 */
export function InstallAppCard() {
  const [mode, setMode] = useState<"hidden" | "prompt" | "ios">("hidden");
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem("dingle-install-dismissed") === "1";
    } catch {}
    if (standalone || dismissed) return;
    const ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 기기 확인 후 한 번만
    if (ios) setMode("ios");
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as InstallEvent);
      setMode("prompt");
    };
    const onInstalled = () => setMode("hidden");
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (mode === "hidden") return null;
  const dismiss = () => {
    try {
      localStorage.setItem("dingle-install-dismissed", "1");
    } catch {}
    setMode("hidden");
  };

  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- 앱 아이콘 */}
        <img src="/icon-192.png" alt="" className="h-11 w-11 rounded-xl" />
        <div className="flex-1">
          <p className="font-bold text-zinc-900">📲 다잉클을 앱처럼 쓰세요</p>
          <p className="text-xs text-zinc-500">홈 화면 아이콘 한 번이면 바로 쉐도잉!</p>
        </div>
        {mode === "prompt" ? (
          <button
            type="button"
            onClick={async () => {
              if (!evt) return;
              await evt.prompt();
              const { outcome } = await evt.userChoice;
              if (outcome === "accepted") setMode("hidden");
            }}
            className="shrink-0 rounded-xl bg-brand-600 px-3 py-2 text-sm font-bold text-white"
          >
            설치하기
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="shrink-0 rounded-xl bg-brand-600 px-3 py-2 text-sm font-bold text-white"
          >
            {open ? "닫기" : "방법 보기"}
          </button>
        )}
      </div>
      {mode === "ios" && open && (
        <ol className="flex flex-col gap-3">
          {[
            {
              img: "/install/ios-1.jpg",
              title: "Safari 아래쪽 ··· 버튼을 누르고 공유(Share)",
              note: "카톡 안에서 열었다면 먼저 오른쪽 아래 메뉴 → 'Safari로 열기'",
            },
            {
              img: "/install/ios-2.jpg",
              title: "아래로 내려서 홈 화면에 추가(Add to Home Screen)",
              note: "안 보이면 '더 보기(View More)'를 눌러주세요. 그다음 오른쪽 위 '추가'",
            },
            { img: "/install/ios-3.jpg", title: "홈 화면에 생긴 다잉클 아이콘을 누르면 끝!", note: "" },
          ].map((step, i) => (
            <li key={step.img} className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3">
              <p className="flex items-start gap-2 text-sm font-bold text-zinc-900">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs text-white">
                  {i + 1}
                </span>
                {step.title}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element -- 설치 방법 캡처 */}
              <img src={step.img} alt={step.title} loading="lazy" className="w-full rounded-lg border border-slate-200" />
              {step.note && <p className="text-xs text-zinc-500">{step.note}</p>}
            </li>
          ))}
        </ol>
      )}
      <button type="button" onClick={dismiss} className="self-end text-xs text-zinc-400 underline">
        다시 보지 않기
      </button>
    </section>
  );
}
