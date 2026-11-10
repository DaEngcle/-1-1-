-- 상황극 연습(대본 미션): 시나리오별 최고 별점과 오늘 시작한 시나리오.
-- 앱은 Supabase Auth를 쓰지 않고 서버(service role)에서만 읽고 쓴다. 그래서 다른 표처럼
-- RLS만 켜고 정책은 두지 않는다. 여러 번 실행해도 안전하다.
create table if not exists roleplay_progress (
  student_id uuid not null references students(id) on delete cascade,
  scenario text not null,
  stars smallint not null default 0,
  plays integer not null default 0,
  -- 포인트를 마지막으로 준 날 (시나리오마다 하루 한 번)
  paid_day date,
  updated_at timestamptz not null default now(),
  primary key (student_id, scenario)
);
alter table roleplay_progress enable row level security;

-- 무료회원 하루 3개 제한용: 그날 시작한 시나리오 id
create table if not exists roleplay_daily (
  student_id uuid not null references students(id) on delete cascade,
  day date not null,
  scenarios text[] not null default '{}',
  primary key (student_id, day)
);
alter table roleplay_daily enable row level security;

-- AI 면접 '다시 시도' 횟수 (면접 한 번에 몇 번까지)
alter table interview_sessions add column if not exists retries integer not null default 0;
