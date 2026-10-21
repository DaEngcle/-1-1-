-- AI 면접·대화 시뮬레이션 기록 (하루 횟수 제한에도 쓴다). 여러 번 실행해도 안전하다.
create table if not exists interview_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  scenario text not null,
  transcript jsonb not null default '[]',   -- [{role: "ai"|"me", text}]
  feedback jsonb,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);
create index if not exists interview_sessions_student_idx on interview_sessions (student_id, created_at desc);
alter table interview_sessions enable row level security;
