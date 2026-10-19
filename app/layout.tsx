import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { NavProgress } from "./_ui/nav-progress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // 카톡·문자 링크 미리보기 이미지가 전체 주소로 나가도록
  metadataBase: new URL("https://dingle-classroom.vercel.app"),
  title: "다잉클 데일리 | 1일 1영어표현 카톡 구독",
  description:
    "워킹홀리데이에서 바로 쓰는 영어 표현을 매일 아침 9시 카카오톡으로 받아보세요. 3일 무료체험.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <NavProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
