/** 앱 설치 안내용 기기·브라우저 판별 (화면 없이 시험할 수 있게 함수로 분리) */
export type DeviceInfo = {
  os: "ios" | "android" | "other";
  browser: "safari" | "chrome" | "samsung" | "other";
  /** 카톡·인스타 등 앱 안의 브라우저 (여기서는 설치가 안 된다) */
  inApp: "kakao" | "instagram" | "facebook" | "naver" | "line" | "other" | null;
};

export function detectDevice(ua: string, maxTouchPoints = 0): DeviceInfo {
  const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && maxTouchPoints > 1);
  const android = /Android/.test(ua);
  const os = ios ? "ios" : android ? "android" : "other";

  let inApp: DeviceInfo["inApp"] = null;
  if (/KAKAOTALK/i.test(ua)) inApp = "kakao";
  else if (/Instagram/i.test(ua)) inApp = "instagram";
  else if (/FBAN|FBAV|FB_IAB/.test(ua)) inApp = "facebook";
  else if (/NAVER\(/.test(ua)) inApp = "naver";
  else if (/\bLine\//.test(ua)) inApp = "line";
  else if (/DaumApps|; wv\)/.test(ua)) inApp = "other";

  let browser: DeviceInfo["browser"] = "other";
  if (/SamsungBrowser/.test(ua)) browser = "samsung";
  else if (ios) {
    if (/CriOS/.test(ua)) browser = "chrome";
    else if (!/FxiOS|EdgiOS|Whale|OPiOS/.test(ua) && /Safari/.test(ua)) browser = "safari";
  } else if (/Chrome\//.test(ua) && !/EdgA?\/|OPR\/|Whale/.test(ua)) browser = "chrome";

  return { os, browser, inApp };
}

/** 앱 안 브라우저에서 바깥 브라우저로 바로 여는 주소. 못 여는 경우 null */
export function externalOpenUrl(info: DeviceInfo, href: string): string | null {
  if (info.inApp === "kakao") return `kakaotalk://web/openExternal?url=${encodeURIComponent(href)}`;
  if (info.os === "android" && info.inApp) {
    const u = new URL(href);
    return `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(href)};end`;
  }
  return null;
}
