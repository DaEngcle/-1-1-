-- 고양이 마을 채팅: 마을 지도에서 학생끼리 주고받는 짧은 말 (최근 24시간 중 20개만 보여 준다).
-- 앱은 Supabase Auth를 쓰지 않고 서버(service role)에서만 읽고 쓴다. 그래서 다른 표처럼
-- RLS만 켜고 정책은 두지 않는다 (anon/authenticated 키로는 아무것도 못 읽고 못 쓴다).
-- 여러 번 실행해도 안전하다.
create table if not exists village_chat (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  name text not null,
  breed text,
  text text not null check (char_length(text) between 1 and 80),
  created_at timestamptz not null default now()
);
create index if not exists village_chat_created_idx on village_chat (created_at desc);
create index if not exists village_chat_student_idx on village_chat (student_id, created_at desc);
alter table village_chat enable row level security;
