"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

type State =
  "loading" | "unsupported" | "ios-install" | "denied" | "off" | "on";

/** 학습 알림 켜기/끄기 (기기마다 따로) */
export function PushToggle() {
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    const ios =
      /iPhone|iPad|iPod/.test(ua) ||
      (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const supported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    if (!supported) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 기기 확인 후 한 번만
      setState(ios && !standalone ? "ios-install" : "unsupported");
      return;
    }
    if (Notification.permission === "denied") return setState("denied");
    // 서비스 워커 준비를 기다리지 않고 바로 보여주고, 이미 켜져 있는지는 뒤에서 확인
    setState("off");
    navigator.serviceWorker
      .getRegistration()
      .then((reg) => reg?.pushManager.getSubscription())
      .then((sub) => sub && setState("on"))
      .catch(() => undefined);
  }, []);

  const turnOn = async () => {
    setBusy(true);
    setError(null);
    try {
      const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!key)
        throw new Error("알림 준비 중이에요. 잠시 후 다시 시도해 주세요.");
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setState(perm === "denied" ? "denied" : "off");
        return;
      }
      const reg =
        (await navigator.serviceWorker.getRegistration()) ??
        (await navigator.serviceWorker.register("/sw.js"));
      await navigator.serviceWorker.ready;
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(key),
        }));
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      if (!res.ok) throw new Error("알림 등록에 실패했어요.");
      setState("on");
    } catch (e) {
      setError(e instanceof Error ? e.message : "알림을 켜지 못했어요.");
    } finally {
      setBusy(false);
    }
  };

  const turnOff = async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setState("off");
    } finally {
      setBusy(false);
    }
  };

  if (state === "loading") return null;
  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{state === "on" ? "🔔" : "🔕"}</span>
        <div className="flex-1">
          <p className="font-bold text-zinc-900">
            학습 알림 {state === "on" ? "켜짐" : "받기"}
          </p>
          <p className="text-xs text-zinc-500">
            {state === "on"
              ? "공부를 깜빡한 날 저녁 8시쯤 살짝 알려드려요."
              : state === "ios-install"
                ? "아이폰은 위 방법으로 홈 화면에 앱을 추가한 뒤, 홈 화면의 다잉클 앱에서 알림을 켤 수 있어요."
                : state === "unsupported"
                  ? "이 브라우저는 알림을 지원하지 않아요. 크롬·사파리로 열거나 홈 화면 앱에서 켜주세요."
                  : state === "denied"
                    ? "알림이 차단돼 있어요. 휴대폰 설정 → 알림에서 다잉클을 허용해 주세요."
                    : "연속 기록이 끊기기 전에 저녁에 한 번 알려드려요."}
          </p>
        </div>
        {state === "off" && (
          <button
            type="button"
            disabled={busy}
            onClick={turnOn}
            className="shrink-0 rounded-xl bg-brand-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {busy ? "켜는 중…" : "알림 켜기"}
          </button>
        )}
        {state === "on" && (
          <button
            type="button"
            disabled={busy}
            onClick={turnOff}
            className="shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-xs text-zinc-500"
          >
            끄기
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </section>
  );
}
