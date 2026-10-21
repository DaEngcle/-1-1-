-- AI 면접 패스 (무료회원 유료 판매): 열린 기간 + 구매 신청. 여러 번 실행해도 안전하다.
alter table students add column if not exists talk_until date;
create table if not exists talk_requests (
  student_id uuid primary key references students(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table talk_requests enable row level security;
