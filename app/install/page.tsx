import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "앱 설치 방법 | 다잉클 클래스룸",
  description: "다잉클 클래스룸을 폰 홈 화면에 앱처럼 설치하는 방법 (아이폰·갤럭시)",
};

const IOS_STEPS = [
  {
    img: "/install/ios-1.jpg",
    title: "Safari 아래쪽 ··· 버튼을 누르고 공유(Share)",
    note: "카톡 안에서 열었다면 먼저 오른쪽 아래 메뉴 → 'Safari로 열기'",
  },
  {
    img: "/install/ios-2.jpg",
    title: "아래로 내려서 홈 화면에 추가(Add to Home Screen)",
    note: "안 보이면 '더 보기(View More)'를 눌러 주세요. 그다음 오른쪽 위 '추가'",
  },
  { img: "/install/ios-3.jpg", title: "홈 화면에 생긴 다잉클 아이콘을 누르면 끝!", note: "" },
];

/** 로그인 없이 볼 수 있는 설치 안내 (학생에게 링크로 보내는 용도) */
export default function InstallPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 px-4 py-8">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- 앱 아이콘 */}
        <img src="/icon-192.png" alt="" className="h-14 w-14 rounded-2xl" />
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900">📲 다잉클 앱 설치하기</h1>
          <p className="text-sm text-zinc-500">앱스토어 없이, 1분이면 홈 화면에 생겨요.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">
        👉 이 페이지를 <b>폰에서</b> 열어 주세요. 주소: <b>dingle-classroom.vercel.app/install</b>
      </div>

      <section className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-lg font-extrabold text-zinc-900">🍎 아이폰 (Safari)</h2>
        <ol className="flex flex-col gap-3">
          {IOS_STEPS.map((step, i) => (
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
      </section>

      <section className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-lg font-extrabold text-zinc-900">🤖 갤럭시·안드로이드</h2>
        <ol className="flex flex-col gap-1.5 rounded-xl bg-slate-50 p-3 text-sm text-zinc-700">
          <li>
            <b>크롬</b>: 오른쪽 위 <b>⋮</b> → <b>&lsquo;홈 화면에 추가&rsquo;</b> 또는 <b>&lsquo;앱 설치&rsquo;</b>
          </li>
          <li>
            <b>삼성 인터넷</b>: 아래 <b>≡</b> → <b>&lsquo;현재 페이지 추가&rsquo;</b> → <b>&lsquo;홈 화면&rsquo;</b>
          </li>
          <li className="text-xs text-zinc-500">
            카카오톡 안에서 열었다면 오른쪽 위 <b>⋮</b> → &lsquo;다른 브라우저로 열기&rsquo;를 먼저 눌러 주세요.
          </li>
        </ol>
      </section>

      <Link href="/login" className="rounded-2xl bg-brand-600 py-3.5 text-center text-lg font-extrabold text-white shadow">
        다잉클 클래스룸 열기 →
      </Link>
      <p className="text-center text-xs text-zinc-400">설치한 다음 아이콘으로 열고 한 번만 로그인하면, 다음부터는 자동으로 들어가요.</p>
    </div>
  );
}
