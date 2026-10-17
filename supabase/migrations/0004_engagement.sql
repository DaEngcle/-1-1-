-- 다잉클 클래스룸: 학습 달력 · 레벨테스트
-- 0003_progress_security.sql 적용 후 실행한다. 여러 번 실행해도 안전하다.

-- 하루 단위 영상 시청 시간 (학습 달력·주간 랭킹용). 쉐도잉은 submissions에서 센다.
create table if not exists daily_activity (
  student_id uuid not null references students(id) on delete cascade,
  day date not null,
  watched_seconds integer not null default 0,
  -- 마지막으로 시간을 더한 시각 (부풀리기 방지용)
  updated_at timestamptz not null default now(),
  primary key (student_id, day)
);

-- 레벨테스트 (수강 전 pre / 수강 후 post 각 1회)
create table if not exists level_tests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  kind text not null check (kind in ('pre', 'post')),
  speaking_score integer,
  listening_score integer,
  total_score integer,
  level integer,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  unique (student_id, kind)
);

-- 레벨테스트 문항별 답 (문제 내용은 코드 lib/classroom/level-test.ts에 있음)
create table if not exists level_test_answers (
  test_id uuid not null references level_tests(id) on delete cascade,
  question_id text not null,
  score integer not null check (score between 0 and 100),
  -- 말하기: 녹음 파일 (shadowing 버킷), 듣기: 고른 보기 번호
  audio_path text,
  choice integer,
  created_at timestamptz not null default now(),
  primary key (test_id, question_id)
);

-- 선생님 설정 (예: 사후 레벨테스트 열기)
create table if not exists classroom_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table daily_activity enable row level security;
alter table level_tests enable row level security;
alter table level_test_answers enable row level security;
alter table classroom_settings enable row level security;
