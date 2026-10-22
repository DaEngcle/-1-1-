-- 학생 의견 (앱 쓰다가 가끔 뜨는 질문에 답한 것). 여러 번 실행해도 안전하다.
create table if not exists student_feedback (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete set null,
  kind text not null default 'idea', -- inconvenient | idea | praise
  message text not null,
  page text,
  done boolean not null default false,
  created_at timestamptz not null default now()
);
alter table student_feedback enable row level security;
create index if not exists student_feedback_created on student_feedback (created_at desc);
