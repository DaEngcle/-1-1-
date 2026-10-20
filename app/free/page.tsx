import type { Metadata } from "next";
import Link from "next/link";
import { FreeSignupForm } from "./free-form";
import { ReviewMarquee, ReviewWall } from "@/app/_ui/reviews";

export const metadata: Metadata = {
  title: "무료 자료 받기 | 다잉클 클래스룸",
  description:
    "워홀 영어 330문장 전자책 무료 다운로드 + 강의 맛보기 + 무료 레벨테스트",
  openGraph: {
    title: "🎁 다잉클 무료 자료 받기",
    description:
      "워홀 영어 330문장 전자책 무료 다운로드 + 강의 맛보기 + 무료 레벨테스트",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "다잉클 클래스룸",
      },
    ],
  },
};

const PERKS = [
  ["📕", "워홀 영어 330문장 전자책", "PDF로 바로 다운로드"],
  ["🎬", "강의 맛보기", "과정별 Day 1~3 무료 공개"],
  ["🎤", "AI 발음 채점", "쉐도잉 녹음하면 바로 점수"],
  ["📊", "무료 레벨테스트", "듣기·문법·말하기 진단"],
];

export default async function FreePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  return (
    <div className="flex flex-1 flex-col items-center gap-8 overflow-x-hidden bg-gradient-to-b from-brand-600 to-brand-500 px-5 py-10">
      <main className="flex w-full max-w-sm flex-col items-center gap-5 overflow-hidden rounded-3xl bg-white p-7 text-center shadow-xl shadow-brand-900/20">
        <div className="flex flex-col items-center gap-2">
          <span className="rounded-full bg-[#ffd23f] px-3 py-1 text-xs font-extrabold text-zinc-900">
            웨비나 참석자 전용 무료 자료
          </span>
          <h1 className="text-2xl font-extrabold leading-snug tracking-tight text-zinc-900">
            워홀 영어 330문장
            <br />
            전자책 무료로 받기
          </h1>
          <p className="text-sm text-zinc-600">
            가입하면 바로 다운로드하고, 다잉클 클래스룸도 둘러볼 수 있어요.
          </p>
          <a
            href="#reviews"
            className="text-xs font-bold text-brand-700 underline"
          >
            ⭐ 먼저 들은 분들 후기 보기
          </a>
        </div>
        <ul className="grid w-full grid-cols-2 gap-2 text-left">
          {PERKS.map(([icon, title, sub]) => (
            <li
              key={title}
              className="flex flex-col gap-0.5 rounded-2xl bg-brand-50 p-3"
            >
              <span className="text-xl">{icon}</span>
              <span className="text-sm font-bold text-zinc-900">{title}</span>
              <span className="text-xs text-zinc-500">{sub}</span>
            </li>
          ))}
        </ul>
        <div className="-mx-7 w-[calc(100%+3.5rem)] border-y border-slate-200 bg-slate-50 py-2">
          <ReviewMarquee />
        </div>
        <div id="signup" className="w-full scroll-mt-6">
          <FreeSignupForm from={(from ?? "").slice(0, 30)} />
        </div>
        <Link href="/login" className="text-xs text-zinc-500 underline">
          이미 가입했어요 · 로그인
        </Link>
      </main>
      <div
        id="reviews"
        className="flex w-full max-w-4xl scroll-mt-6 flex-col items-center gap-5 rounded-3xl bg-slate-50 p-5 shadow-xl shadow-brand-900/20"
      >
        <ReviewWall tone="light" />
        <a
          href="#signup"
          className="rounded-2xl border-b-4 border-amber-500 bg-[#ffd23f] px-6 py-3 text-base font-extrabold text-zinc-900 shadow-lg"
        >
          🎁 나도 무료로 받고 시작하기
        </a>
      </div>
    </div>
  );
}
