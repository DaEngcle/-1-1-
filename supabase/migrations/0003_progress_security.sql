-- 다잉클 클래스룸: 영상 수강률 + 로그인 보안
-- 0002_classroom.sql 적용 후 실행한다. 여러 번 실행해도 안전하다.

-- 코드 재발급 시 기존 로그인을 끊기 위한 세션 버전
alter table students
  add column if not exists session_version integer not null default 1;

-- 로그인 실패 기록 (IP별 시도 횟수 제한용)
create table if not exists login_attempts (
  id bigint generated always as identity primary key,
  key text not null,
  created_at timestamptz not null default now()
);

create index if not exists login_attempts_key_created_idx
  on login_attempts (key, created_at desc);

-- 레슨(교재 영상) 시청 기록. 10초 구간 단위로 실제 재생한 구간만 기록한다.
create table if not exists video_progress (
  student_id uuid not null references students(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  watched_segments integer[] not null default '{}',
  duration_seconds integer not null,
  percent integer not null default 0 check (percent between 0 and 100),
  -- 90% 이상 처음 달성한 시각
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (student_id, lesson_id)
);

create index if not exists video_progress_lesson_idx on video_progress (lesson_id);

alter table login_attempts enable row level security;
alter table video_progress enable row level security;
