# 다잉클 데일리 (Dingle Daily)

카카오톡 기반 1일1영어표현 구독 서비스. 완전 자동화 운영을 목표로 한다.

## 서비스 흐름

1. 랜딩페이지에서 이름/전화번호 입력 → 3일 무료체험 시작 (`subscribers.status = 'trial'`)
2. 매일 09:00 KST, trial/active 구독자에게 오늘의 영어 표현 카톡 발송
3. 무료체험 3일차: 결제 안내 카톡 자동 발송
4. 토스페이먼츠 빌링키 결제 완료 시 유료 구독 전환 (`status = 'active'`)
5. 결제 실패/해지 시 자동으로 발송 리스트에서 제거 (`status = 'cancelled'`)

## 다잉클 클래스룸 (부트캠프 수강생용)

수강생이 부트캠프 60일 커리큘럼을 복습하고, 쉐도잉을 녹음·제출하면 AI가 발음·억양을 채점해주는 웹앱.

- **학생** (`/student`): 교재 영상·수업 영상 시청, 문장별 원어민 음성(보통/천천히/반복/단어별) 듣기,
  녹음 제출 → Azure 발음 평가 점수 + Claude 한국어 코칭 피드백, 발음 가이드(th·r·l·f/v·z·호주식 t),
  내 성과(연속 학습일, 점수 추이, 자주 틀리는 단어, 출결)
- **선생님** (`/teacher`): 학생 등록·로그인 코드 발급, 진도 공개, 레슨별 쉐도잉 문장 관리,
  주차별 수업 영상 등록, 출결 체크, 학생별 성과·제출 녹음 확인
- 로그인: 학생은 선생님이 발급한 8자리 코드, 선생님은 `ADMIN_PASSWORD`

### 처음 설정

1. Supabase SQL 에디터에서 `supabase/migrations/0002_classroom.sql` 실행 (Storage 버킷 `shadowing`, `tts` 포함)
2. `.env.local`에 `SESSION_SECRET`, `ADMIN_PASSWORD`, `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`, `ANTHROPIC_API_KEY` 입력
3. `npm run seed:bootcamp` → 부트캠프 12주/60일 + drill 레슨과 Day별 영상 링크 등록
4. `/login?role=teacher` 로그인 → 학생 등록 → 진도 공개 → 레슨별로 교재 문장 붙여넣기

Azure 키가 없으면 원어민 음성은 브라우저 내장 음성으로 대체되고, 제출은 "채점 대기"로 저장된다.

## 기술 스택

- **Frontend/Backend**: Next.js (App Router)
- **DB/Auth**: Supabase (PostgreSQL)
- **결제**: 토스페이먼츠 빌링 API (정기결제, 웹훅)
- **카톡 발송**: 솔라피(Solapi) 알림톡 API
- **스케줄러**: Vercel Cron
- **배포**: Vercel
- **클래스룸**: Azure AI Speech (en-AU 신경망 TTS, 발음 평가), Claude API (코칭 피드백), jose (세션)

## 폴더 구조

```
/app        Next.js App Router (페이지, API 라우트)
/lib        공용 로직 (Supabase 클라이언트, Solapi 발송 함수 등)
/scripts    1회성 운영 스크립트 (시드 데이터 등)
/content    콘텐츠 원본 데이터 (표현 시드)
```

## 로컬 개발

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev
```

`.env.local`에 필요한 값은 `.env.example` 참고. 실제 API 키(Supabase, Solapi, Toss)는 각 서비스에서 발급 후 채워 넣는다.
