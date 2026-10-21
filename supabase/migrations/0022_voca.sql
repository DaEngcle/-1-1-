-- 보카(단어 게임) 진도: 세트별 최고 점수·별·플레이 횟수·틀린 단어. 여러 번 실행해도 안전하다.
create table if not exists voca_progress (
  student_id uuid not null references students(id) on delete cascade,
  deck text not null,                 -- 예: verbs-1
  best integer not null default 0,    -- 최고 정답률(%)
  stars integer not null default 0,   -- 0~3
  plays integer not null default 0,
  wrong jsonb not null default '[]',  -- 마지막 판에서 틀린 동사
  updated_at timestamptz not null default now(),
  primary key (student_id, deck)
);
alter table voca_progress enable row level security;
