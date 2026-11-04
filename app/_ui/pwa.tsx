"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { detectDevice, externalOpenUrl, type DeviceInfo } from "@/lib/classroom/device";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};

// 브라우저의 설치 신호는 페이지를 처음 열 때 한 번만 온다. 설치 화면으로 넘어가기 전에 와도 놓치지 않게 여기에 보관한다.
let savedPrompt: InstallEvent | null = null;
const promptListeners = new Set<() => void>();
const emitPrompt = () => promptListeners.forEach((f) => f());
const subscribePrompt = (f: () => void) => {
  promptListeners.add(f);
  return () => {
    promptListeners.delete(f);
  };
};

/** 서비스 워커 등록(배포 환경에서만) + 설치 신호 보관. 모든 화면의 공통 레이아웃에 들어 있다 */
export function RegisterServiceWorker() {
  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      savedPrompt = e as InstallEvent;
      emitPrompt();
    };
    const onInstalled = () => {
      savedPrompt = null;
      emitPrompt();
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => undefined);
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);
  return null;
}

type Env = DeviceInfo & { standalone: boolean };

function readEnv(): Env {
  return {
    ...detectDevice(navigator.userAgent, navigator.maxTouchPoints),
    standalone:
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true,
  };
}

function useEnv() {
  const [env, setEnv] = useState<Env | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- 기기 정보는 화면이 뜬 뒤에만 알 수 있다
  useEffect(() => setEnv(readEnv()), []);
  return env;
}

const Step = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <li className="flex items-start gap-2 text-sm text-zinc-800">
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
      {n}
    </span>
    <span className="min-w-0 flex-1 leading-relaxed">{children}</span>
  </li>
);

/** 카톡 등 앱 안에서 열었을 때: 여기서는 설치가 안 되니 바깥 브라우저로 내보낸다 */
function InAppNotice({ env }: { env: Env }) {
  const [copied, setCopied] = useState(false);
  const browser = env.os === "ios" ? "Safari" : "Chrome";
  const open = externalOpenUrl(env, location.href);
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">
      <p className="font-bold">
        ⚠️ 지금은 {env.inApp === "kakao" ? "카카오톡" : "다른 앱"} 안에서 열려 있어서 설치가 안 돼요.
      </p>
      <p>{browser}로 연 다음 설치해 주세요.</p>
      {open && (
        <a href={open} className="rounded-xl bg-brand-600 py-2.5 text-center font-bold text-white">
          {env.inApp === "kakao" ? "바깥 브라우저로 열기" : `${browser}로 열기`}
        </a>
      )}
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(location.href);
            setCopied(true);
          } catch {
            setCopied(false);
          }
        }}
        className="rounded-xl border border-amber-300 bg-white py-2 font-semibold"
      >
        {copied ? `복사했어요. ${browser} 주소창에 붙여넣어 주세요` : "주소 복사하기"}
      </button>
      <p className="text-xs">
        버튼이 안 되면 화면의 메뉴(⋮ 또는 공유 모양)에서 &lsquo;다른 브라우저로 열기&rsquo; 또는 &lsquo;{browser}로 열기&rsquo;를 눌러 주세요.
      </p>
    </div>
  );
}

function IosSteps({ browser }: { browser: DeviceInfo["browser"] }) {
  return (
    <div className="flex flex-col gap-3">
      {browser !== "safari" && (
        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950">
          메뉴에 &lsquo;홈 화면에 추가&rsquo;가 안 보이면 <b>Safari</b>로 열어서 해 주세요. iOS 16.4보다 낮으면 Safari에서만 돼요.
        </p>
      )}
      <ol className="flex flex-col gap-2.5">
        <Step n={1}>
          화면의 <b>공유 버튼</b>(네모에 위쪽 화살표)을 눌러요. 안 보이면 <b>···</b> 를 먼저 누른 뒤 <b>공유</b>를 눌러요.
          <span className="block text-xs text-zinc-500">아이폰 버전에 따라 버튼이 아래에 있거나 위에 있어요.</span>
        </Step>
        <Step n={2}>
          메뉴를 위로 밀어서 <b>홈 화면에 추가</b>를 눌러요. 안 보이면 <b>더 보기</b>에 있어요.
        </Step>
        <Step n={3}>
          오른쪽 위 <b>추가</b>를 눌러요. <b>웹 앱으로 열기</b>가 보이면 켠 채로 두세요.
        </Step>
        <Step n={4}>홈 화면에 생긴 <b>다잉클</b> 아이콘으로 열고, 한 번만 로그인하면 돼요.</Step>
      </ol>
      <details className="rounded-xl bg-slate-50 p-3 text-sm text-zinc-600">
        <summary className="cursor-pointer font-semibold">화면 예시 보기 (영어로 설정한 아이폰)</summary>
        <p className="mt-2 text-xs">한국어 폰에서는 Share가 공유, Add to Home Screen이 홈 화면에 추가예요.</p>
        <div className="mt-2 flex flex-col gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- 설치 방법 캡처 */}
          <img src="/install/ios-1.jpg" alt="공유 메뉴 예시" loading="lazy" className="w-full rounded-lg border border-slate-200" />
          {/* eslint-disable-next-line @next/next/no-img-element -- 설치 방법 캡처 */}
          <img src="/install/ios-2.jpg" alt="홈 화면에 추가 메뉴 예시" loading="lazy" className="w-full rounded-lg border border-slate-200" />
        </div>
      </details>
    </div>
  );
}

function AndroidSteps({ browser }: { browser: DeviceInfo["browser"] }) {
  const samsung = (
    <ol className="flex flex-col gap-2.5">
      <Step n={1}>
        아래쪽 메뉴 <b>≡</b> 를 눌러요. (주소창에 설치 아이콘이 보이면 그걸 눌러도 돼요)
      </Step>
      <Step n={2}>
        <b>현재 페이지 추가</b> → <b>홈 화면</b>을 눌러요.
      </Step>
      <Step n={3}>홈 화면에 생긴 <b>다잉클</b> 아이콘으로 열어요.</Step>
    </ol>
  );
  const chrome = (
    <ol className="flex flex-col gap-2.5">
      <Step n={1}>
        오른쪽 위 <b>⋮</b> 를 눌러요.
      </Step>
      <Step n={2}>
        <b>앱 설치</b> 또는 <b>홈 화면에 추가</b>를 눌러요. 고르라고 나오면 <b>설치</b>를 골라요.
      </Step>
      <Step n={3}>홈 화면이나 앱 목록에 생긴 <b>다잉클</b> 아이콘으로 열어요.</Step>
    </ol>
  );
  if (browser === "samsung") return samsung;
  if (browser === "chrome") return chrome;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-bold text-zinc-900">크롬</p>
      {chrome}
      <p className="text-sm font-bold text-zinc-900">삼성 인터넷</p>
      {samsung}
    </div>
  );
}

/** 지금 쓰는 폰·브라우저에 맞는 설치 방법만 보여 준다 */
export function InstallGuide() {
  const env = useEnv();
  const prompt = useSyncExternalStore(subscribePrompt, () => savedPrompt, () => null);
  const [other, setOther] = useState(false);

  if (!env) return null;
  if (env.standalone) {
    return <p className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">✅ 지금 앱으로 쓰고 있어요. 더 설치하지 않아도 돼요.</p>;
  }

  const isPhone = env.os !== "other";
  return (
    <div className="flex flex-col gap-3">
      {env.inApp && <InAppNotice env={env} />}
      {!env.inApp && prompt && (
        <button
          type="button"
          onClick={async () => {
            await prompt.prompt();
            await prompt.userChoice.catch(() => undefined);
            savedPrompt = null;
            emitPrompt();
          }}
          className="rounded-xl bg-brand-600 py-3 text-center font-bold text-white"
        >
          📲 지금 설치하기
        </button>
      )}
      {!env.inApp && !prompt && env.os === "ios" && <IosSteps browser={env.browser} />}
      {!env.inApp && !prompt && env.os === "android" && <AndroidSteps browser={env.browser} />}
      {!isPhone && !prompt && (
        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950">
          이 페이지를 <b>폰에서</b> 열어 주세요. 주소: <b>dingle-classroom.vercel.app/install</b>
        </p>
      )}
      <button type="button" onClick={() => setOther((v) => !v)} className="self-start text-xs font-semibold text-zinc-500 underline">
        {other ? "다른 기기 방법 닫기" : "다른 기기 방법도 보기"}
      </button>
      {other && (
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-3">
          <p className="font-bold text-zinc-900">🍎 아이폰</p>
          <IosSteps browser="safari" />
          <p className="font-bold text-zinc-900">🤖 갤럭시·안드로이드</p>
          <AndroidSteps browser="other" />
        </div>
      )}
    </div>
  );
}

/** 설정 화면의 앱 설치 카드 */
export function InstallAppCard() {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- 앱 아이콘 */}
        <img src="/icon-192.png" alt="" className="h-11 w-11 rounded-xl" />
        <div className="flex-1">
          <p className="font-bold text-zinc-900">📲 다잉클을 앱처럼 쓰세요</p>
          <p className="text-xs text-zinc-500">홈 화면 아이콘 한 번이면 바로 쉐도잉!</p>
        </div>
      </div>
      <InstallGuide />
    </section>
  );
}
