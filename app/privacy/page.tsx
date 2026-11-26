import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보 처리방침 | 다잉클 클래스룸",
  description: "다잉클 클래스룸이 어떤 정보를 왜 모으고, 어디에 맡기며, 언제 지우는지 안내합니다.",
};

// 로그인 없이 볼 수 있는 공개 페이지 (가입 동의 문구에서 링크)
const UPDATED = "2026년 11월 27일";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="text-base font-extrabold text-zinc-900">{title}</h2>
      <div className="flex flex-col gap-1.5 text-sm leading-relaxed text-zinc-700">{children}</div>
    </section>
  );
}

const VENDORS: { name: string; job: string; where: string }[] = [
  { name: "Supabase", job: "회원·학습 기록·녹음 파일 저장", where: "대한민국(서울)" },
  { name: "Vercel", job: "앱 서버 운영", where: "대한민국(서울)" },
  { name: "Microsoft Azure", job: "쉐도잉 녹음 발음 채점, 원어민 음성 생성", where: "호주" },
  { name: "Anthropic", job: "AI 피드백·코스 추천 문장 생성 (이름·연락처는 보내지 않음)", where: "미국" },
  { name: "PostHog", job: "앱 이용 기록 분석, 세션 다시보기", where: "미국" },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900">개인정보 처리방침</h1>
        <p className="mt-1 text-sm text-zinc-500">다니엘잉글리시(다잉클) · 시행일 {UPDATED}</p>
      </div>

      <Section title="1. 모으는 정보">
        <p>• 가입 정보: 이름, 휴대폰 번호, 닉네임, 비밀번호(암호화해 저장)</p>
        <p>• 학습 기록: 강의 시청, 쉐도잉 녹음과 채점 결과, 숙제·연습·레벨테스트 결과, 출석</p>
        <p>
          • 앱 이용 기록: 어떤 화면을 열고 무엇을 눌렀는지, 접속 기기·브라우저 종류, 대략적인 접속 지역, 화면 움직임을 다시
          볼 수 있는 세션 기록
        </p>
        <p className="text-xs text-zinc-500">
          세션 기록에서 입력한 글자(비밀번호, 답안 등)는 가려져 저장되지 않아요. 이용 기록은 이름·연락처 없이 앱 내부 번호로만
          구분해요.
        </p>
      </Section>

      <Section title="2. 쓰는 목적">
        <p>• 수강생 확인과 로그인</p>
        <p>• 학습 관리: 진도·점수·피드백 제공, 숙제 확인, 학습 알림</p>
        <p>• 서비스 개선: 학생들이 어려워하거나 자주 멈추는 화면을 찾아 고치고, 오류를 해결하기 위해</p>
      </Section>

      <Section title="3. 보관 기간">
        <p>• 가입 정보·학습 기록: 수강 종료(무료회원은 마지막 이용) 후 1년 뒤, 또는 삭제 요청 시 바로 지워요.</p>
        <p>• 앱 이용 기록: 수집일로부터 1년 이내에 지워요.</p>
        <p>• 법령에 따라 보관해야 하는 결제 기록은 그 기간 동안 보관해요.</p>
      </Section>

      <Section title="4. 처리를 맡기는 곳 · 해외로 보내는 정보">
        <p>앱 운영을 위해 아래 업체에 정보 처리를 맡겨요. 일부는 해외 서버에서 처리돼요(인터넷으로 전송).</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-xs">
            <thead className="text-zinc-500">
              <tr>
                <th className="py-1.5 pr-2 font-semibold">업체</th>
                <th className="py-1.5 pr-2 font-semibold">맡기는 일</th>
                <th className="py-1.5 font-semibold">처리 국가</th>
              </tr>
            </thead>
            <tbody>
              {VENDORS.map((v) => (
                <tr key={v.name} className="border-t border-zinc-100">
                  <td className="py-1.5 pr-2 font-semibold text-zinc-800">{v.name}</td>
                  <td className="py-1.5 pr-2">{v.job}</td>
                  <td className="py-1.5">{v.where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-500">
          해외로 보내는 정보는 각 일에 필요한 것(녹음, 학습 문장, 앱 이용 기록)뿐이고, 보관 기간은 위 3번과 같아요. 해외 전송을
          원하지 않으면 아래 문의처로 알려 주세요. 다만 녹음 채점처럼 해외 처리가 꼭 필요한 기능은 쓸 수 없게 될 수 있어요.
        </p>
      </Section>

      <Section title="5. 내 정보에 대한 권리">
        <p>언제든 내 정보를 보거나, 고치거나, 지우거나, 처리를 멈춰 달라고 요청할 수 있어요. 요청하면 지체 없이 처리해요.</p>
      </Section>

      <Section title="6. 문의처">
        <p>개인정보 보호 책임자: 다니엘 (다니엘잉글리시 대표)</p>
        <p>문의: 카카오톡 채널 「다잉클」</p>
      </Section>

      <p className="text-center text-xs text-zinc-400">이 방침이 바뀌면 앱 공지로 미리 알려 드려요.</p>
      <Link href="/login" className="text-center text-sm font-semibold text-brand-600">
        ← 다잉클 클래스룸으로
      </Link>
    </div>
  );
}
