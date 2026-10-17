-- 다잉클 클래스룸: 학생별 선생님 상담·관리 기록
-- 0007_courses_signup.sql 적용 후 실행한다. 여러 번 실행해도 안전하다.

create table if not exists teacher_notes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists teacher_notes_student_idx on teacher_notes (student_id, created_at desc);

alter table teacher_notes enable row level security;
