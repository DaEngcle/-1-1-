# 다잉클 데일리 (Dingle Daily)

카카오톡 기반 1일1영어표현 구독 서비스. 완전 자동화 운영을 목표로 한다.

## 서비스 흐름

1. 랜딩페이지에서 이름/전화번호 입력 → 3일 무료체험 시작 (`subscribers.status = 'trial'`)
2. 매일 09:00 KST, trial/active 구독자에게 오늘의 영어 표현 카톡 발송
3. 무료체험 3일차: 결제 안내 카톡 자동 발송
4. 토스페이먼츠 빌링키 결제 완료 시 유료 구독 전환 (`status = 'active'`)
5. 결제 실패/해지 시 자동으로 발송 리스트에서 제거 (`status = 'cancelled'`)

## 기술 스택

- **Frontend/Backend**: Next.js (App Router)
- **DB/Auth**: Supabase (PostgreSQL)
- **결제**: 토스페이먼츠 빌링 API (정기결제, 웹훅)
- **카톡 발송**: 솔라피(Solapi) 알림톡 API
- **스케줄러**: Vercel Cron
- **배포**: Vercel

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
