import Link from "next/link";
import { BUSINESS } from "@/lib/business";

/** 사업자 정보 + 약관 링크 (결제 화면·약관 페이지 아래) */
export function BusinessFooter({ className = "" }: { className?: string }) {
  const rows = [
    `상호 ${BUSINESS.name}`,
    `대표 ${BUSINESS.ceo}`,
    `사업자등록번호 ${BUSINESS.regNo}`,
    BUSINESS.mailOrderNo && `통신판매업 신고 ${BUSINESS.mailOrderNo}`,
    BUSINESS.address && `주소 ${BUSINESS.address}`,
    BUSINESS.phone && `전화 ${BUSINESS.phone}`,
    `이메일 ${BUSINESS.email}`,
  ].filter(Boolean);
  return (
    <footer className={`flex flex-col gap-2 text-[11px] leading-relaxed text-zinc-400 ${className}`}>
      <nav className="flex flex-wrap gap-x-3 gap-y-1 font-semibold text-zinc-500">
        <Link href="/terms" className="underline">이용약관</Link>
        <Link href="/privacy" className="underline">개인정보 처리방침</Link>
        <Link href="/terms#refund" className="underline">환불 규정</Link>
        <a href={BUSINESS.kakao} target="_blank" rel="noopener" className="underline">카카오톡 문의</a>
      </nav>
      <p>{rows.join(" · ")}</p>
    </footer>
  );
}

/** 약관·개인정보 페이지 틀 */
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-1 justify-center bg-slate-50 px-5 py-10">
      <main className="flex w-full max-w-2xl flex-col gap-6 rounded-3xl bg-white p-6 text-sm leading-relaxed text-zinc-700 shadow-sm sm:p-10">
        <div className="flex flex-col gap-1">
          <Link href="/" className="text-xs font-bold text-brand-700">← {BUSINESS.service}</Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">{title}</h1>
          <p className="text-xs text-zinc-400">시행일 {BUSINESS.termsEffective}</p>
        </div>
        <div className="legal flex flex-col gap-5 [&_h2]:text-base [&_h2]:font-extrabold [&_h2]:text-zinc-900 [&_li]:ml-5 [&_li]:list-disc [&_ol>li]:list-decimal [&_section]:flex [&_section]:flex-col [&_section]:gap-2 [&_table]:w-full [&_td]:border [&_td]:border-slate-200 [&_td]:p-2 [&_td]:align-top [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-2 [&_th]:text-left">
          {children}
        </div>
        <BusinessFooter className="border-t border-slate-100 pt-5" />
      </main>
    </div>
  );
}
