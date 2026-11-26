import type { Metadata } from "next";
import { LegalPage } from "@/app/_ui/legal";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "개인정보 처리방침 | 다잉클 클래스룸",
  description: "다잉클 클래스룸이 어떤 정보를 왜 모으고, 어디에 맡기며, 언제 지우는지 안내합니다.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="개인정보 처리방침">
      <p>
        {BUSINESS.name}(이하 &quot;회사&quot;)는 {BUSINESS.service} 이용자의 개인정보를 개인정보 보호법에 따라 안전하게 다룹니다.
      </p>

      <section>
        <h2>1. 모으는 정보와 목적</h2>
        <table>
          <thead>
            <tr><th>구분</th><th>항목</th><th>목적</th></tr>
          </thead>
          <tbody>
            <tr><td>가입(필수)</td><td>이름, 휴대폰 번호, 비밀번호(암호화), 닉네임</td><td>본인 확인, 로그인, 수강 관리</td></tr>
            <tr><td>학습(필수)</td><td>녹음한 음성, 발음 점수, 학습·출석 기록, AI 면접 대화 내용</td><td>발음 채점, AI 피드백, 진도 관리</td></tr>
            <tr><td>결제(멤버십)</td><td>카드사 이름과 끝 4자리, 결제 일시·금액, 결제 키</td><td>정기결제, 환불, 거래 기록 보관</td></tr>
            <tr><td>선택</td><td>출국 예정일, 희망 도시·직업 등 상담 정보, 마케팅 수신 동의</td><td>맞춤 학습 안내, 이벤트 안내</td></tr>
            <tr><td>자동 수집</td><td>접속 기록, 어떤 화면을 열고 무엇을 눌렀는지, 기기·브라우저 종류, 대략적인 접속 지역, 화면 움직임을 다시 볼 수 있는 세션 기록, 알림 구독 정보</td><td>보안, 오류 확인, 어려워하는 화면을 찾아 고치기, 학습 알림</td></tr>
          </tbody>
        </table>
        <p>카드번호 전체는 회사가 받거나 저장하지 않으며, 결제대행사(토스페이먼츠)가 보관합니다.</p>
        <p>세션 기록에서 입력한 글자(비밀번호, 답안 등)는 가려져 저장되지 않으며, 이용 기록은 이름·연락처 없이 앱 내부 번호로만 구분합니다.</p>
      </section>

      <section>
        <h2>2. 보관 기간</h2>
        <ul>
          <li>회원 정보·학습 기록: 수강 종료(무료회원은 마지막 이용) 후 1년 뒤, 또는 삭제 요청 시 바로 지웁니다.</li>
          <li>앱 이용 기록(분석·세션 기록): 수집일로부터 1년 이내에 지웁니다.</li>
          <li>계약·결제·환불 기록: 5년 (전자상거래법)</li>
          <li>소비자 불만·분쟁 처리 기록: 3년 (전자상거래법)</li>
          <li>접속 기록: 3개월 (통신비밀보호법)</li>
        </ul>
      </section>

      <section>
        <h2>3. 처리를 맡기는 곳 (위탁)</h2>
        <table>
          <thead>
            <tr><th>받는 곳</th><th>맡기는 일</th></tr>
          </thead>
          <tbody>
            <tr><td>토스페이먼츠(주)</td><td>카드 결제·정기결제</td></tr>
            <tr><td>(주)솔라피</td><td>카카오 알림톡·문자 발송</td></tr>
            <tr><td>Supabase Inc.</td><td>데이터베이스·녹음 파일 보관 (서버: 대한민국 서울)</td></tr>
            <tr><td>Vercel Inc.</td><td>웹 서비스 운영 (서버: 대한민국 서울)</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>4. 국외 이전</h2>
        <p>발음 채점과 AI 피드백을 위해 아래와 같이 정보가 해외 서버로 전송됩니다. 전송된 정보는 처리 후 해당 회사의 정책에 따라 보관·삭제됩니다.</p>
        <table>
          <thead>
            <tr><th>받는 곳 (국가)</th><th>항목</th><th>목적·시점</th></tr>
          </thead>
          <tbody>
            <tr><td>Microsoft Corporation (호주, Azure)</td><td>녹음한 음성, 연습 문장</td><td>발음 채점, 원어민 음성 생성 · 녹음을 제출할 때마다 암호화 통신</td></tr>
            <tr><td>Anthropic PBC (미국)</td><td>발음 점수, 연습 문장, AI 면접·레벨테스트 답변 글</td><td>한국어 코칭·면접 피드백 생성 · 기능을 쓸 때마다 암호화 통신</td></tr>
            <tr><td>PostHog Inc. (미국)</td><td>앱 이용 기록, 세션 기록 (이름·연락처 제외)</td><td>이용 분석, 오류 확인 · 앱을 쓰는 동안</td></tr>
            <tr><td>Google LLC (미국, YouTube)</td><td>강의 영상 재생 정보</td><td>강의 영상 재생</td></tr>
          </tbody>
        </table>
        <p>이름과 휴대폰 번호는 위 회사로 보내지 않습니다. 국외 이전을 원하지 않으면 해당 AI 기능을 쓰지 않으면 되며, 이 경우 발음 채점·AI 피드백은 받을 수 없습니다.</p>
      </section>

      <section>
        <h2>5. 제3자 제공</h2>
        <p>회사는 법령에 따른 경우를 빼고는 이용자 동의 없이 개인정보를 다른 곳에 제공하지 않습니다.</p>
      </section>

      <section>
        <h2>6. 이용자의 권리</h2>
        <p>
          언제든 내 정보의 열람, 정정, 삭제, 처리 정지, 동의 철회(마케팅 수신 거부 포함)를 요청할 수 있습니다. 카카오톡 채널이나 이메일로 요청하면 10일 이내에
          처리합니다.
        </p>
      </section>

      <section>
        <h2>7. 안전 조치</h2>
        <ul>
          <li>비밀번호는 복호화할 수 없는 방식으로 암호화해 저장합니다.</li>
          <li>모든 통신은 암호화(HTTPS)하며, 데이터베이스는 서버에서만 접근할 수 있게 막아 둡니다.</li>
          <li>개인정보를 다루는 사람을 최소한으로 제한합니다.</li>
        </ul>
      </section>

      <section>
        <h2>8. 개인정보 보호책임자</h2>
        <p>
          책임자: {BUSINESS.privacyOfficer} ({BUSINESS.name} 대표)
          <br />
          이메일: {BUSINESS.email}
          <br />
          카카오톡 채널:{" "}
          <a href={BUSINESS.kakao} target="_blank" rel="noopener" className="underline">
            다니엘 잉글리시 클럽
          </a>
        </p>
        <p className="text-xs text-zinc-500">
          개인정보 침해 신고·상담: 개인정보침해신고센터(privacy.kisa.or.kr, 국번 없이 118), 개인정보분쟁조정위원회(kopico.go.kr, 1833-6972)
        </p>
      </section>

      <section>
        <h2>9. 변경</h2>
        <p>이 방침을 바꾸면 시행 7일 전부터 앱에 알립니다.</p>
      </section>
    </LegalPage>
  );
}
