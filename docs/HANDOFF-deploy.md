# 다잉클 클래스룸 배포 인수인계

이 문서는 클라우드 세션에서 개발을 마친 뒤, 배포를 이어서 할 Claude 세션(데스크톱 앱, 브라우저 사용 가능)을 위한 인수인계 메모다.

## 지금까지 된 것

- 저장소: `daengcle/-1-1-`, 브랜치 `claude/dingle-daily-kakao-subscription-amguiy` (모든 코드 푸시 완료)
- 기존 "다잉클 데일리"(카톡 1일1표현 구독) 프로젝트에 **다잉클 클래스룸**을 추가함
  - 학생(`/student`): 부트캠프 60일 복습(교재 영상·수업 영상), 원어민 TTS(보통/천천히/반복/단어별),
    쉐도잉 녹음 제출 → Azure 발음 평가 + Claude 한국어 피드백, 발음 가이드(th·r·l·f/v·z·호주식 t), 성과 대시보드
  - 선생님(`/teacher`): 학생 등록·로그인 코드 발급, 진도 공개, 문장 관리, 수업 영상 등록, 출결, 학생별 성과
- 스택: Next.js 16 (App Router) + Supabase + Vercel. 자세한 내용은 `README.md`의 "다잉클 클래스룸" 섹션
- `next build`와 lint 통과. 가짜 DB로 화면 확인까지 완료. **실제 Supabase/Azure/Claude 연동은 아직 미검증**

## 남은 일: 배포 (브라우저로 진행)

### 1. Supabase
1. supabase.com 에서 새 프로젝트 생성 (Region: Northeast Asia (Seoul))
2. SQL Editor에서 아래 파일을 **순서대로** 실행 (저장소의 위 브랜치 기준)
   1. `supabase/migrations/0001_init.sql`
   2. `supabase/migrations/0002_classroom.sql` (Storage 버킷 `shadowing`, `tts` 포함)
   3. `supabase/seed/bootcamp.sql` (부트캠프 12주/60일 + drill, 영상 링크, 기본 문장)
3. Project Settings → API 에서 **Project URL**과 **service_role 키** 확인

### 2. Vercel
- 사용자의 Vercel 팀: **bg-school** (기존 프로젝트: daingkle-7days, webinar-signup, hongyeon)
- 클라우드 세션의 Vercel 커넥터는 이 팀에 쓰기 권한이 없어 403으로 실패했음 → 브라우저로 진행
1. Add New → Project → `daengcle/-1-1-` Import (프로젝트 이름 예: `dingle-classroom`)
2. 프로덕션 브랜치가 `claude/dingle-daily-kakao-subscription-amguiy`인지 확인 (저장소에 이 브랜치만 있음)
3. Environment Variables
   - `NEXT_PUBLIC_SUPABASE_URL` = Supabase Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role 키 (비밀, 채팅에 노출 금지)
   - `SESSION_SECRET` = 새 랜덤 문자열 (`openssl rand -base64 32` 등으로 생성)
   - `ADMIN_PASSWORD` = 사용자가 정한 선생님 비밀번호
   - (선택) `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION=australiaeast` — 원어민 음성·발음 채점
   - (선택) `ANTHROPIC_API_KEY` — 한국어 코칭 피드백
4. Deploy → 완료 후 `https://<도메인>/login?role=teacher` 접속 확인

### 3. 배포 후 확인
- 선생님 로그인 → 레슨 탭에 Week 1~12 목록이 보이는지 (seed 확인)
- "여기까지 공개" → 학생 등록 → 발급된 코드로 `/login` 학생 로그인 → 레슨 화면·원어민 듣기 동작
- 마이크 녹음 제출 (Azure 키 없으면 "채점 대기"로 저장되는 게 정상)

## 알아둘 점
- 교재 PDF(드라이브 `부트캠프 교재 Day 01-30.pdf`, `Day 31-60.pdf`)는 이미지 PDF라 텍스트 추출이 안 됐음.
  현재 쉐도잉 문장은 Day 제목 표현 1개씩만 들어가 있음. 교재 문장은 선생님 화면 → 레슨 → "문장 추가"에
  `영어 문장 | 해석` 형식으로 붙여넣거나, 교재 페이지 이미지를 보고 옮겨 넣어야 함.
- 커리큘럼 원본: 구글 시트 `📘부트캠프 6기` (Week/Day/유튜브 링크)
- 사용자는 비개발자. 단계마다 쉬운 한국어로 안내할 것.
