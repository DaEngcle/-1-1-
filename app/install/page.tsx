import type { Metadata } from "next";
import Link from "next/link";
import { InstallGuide } from "@/app/_ui/pwa";

export const metadata: Metadata = {
  title: "앱 설치 방법 | 다잉클 클래스룸",
  description: "다잉클 클래스룸을 폰 홈 화면에 앱처럼 설치하는 방법 (아이폰·안드로이드)",
};

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

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <InstallGuide />
      </section>

      <Link href="/login" className="rounded-2xl bg-brand-600 py-3.5 text-center text-lg font-extrabold text-white shadow">
        다잉클 클래스룸 열기 →
      </Link>
      <p className="text-center text-xs text-zinc-400">설치한 다음 아이콘으로 열고 한 번만 로그인하면, 다음부터는 자동으로 들어가요.</p>
    </div>
  );
}
