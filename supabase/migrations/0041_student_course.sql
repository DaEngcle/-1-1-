-- 내 워홀 코스: 1분 질문 답(answers)과 오늘 할 것(today), 오늘 다 하면 받는 츄르 보너스 날짜(bonus_day).
-- 단계 완료 여부는 이미 있는 기록(보카·문법 별, AI 면접, 쉐도잉 제출, 고양이 마을 말하기)에서 읽는다.
-- 앱은 Supabase Auth를 쓰지 않고 서버(service role)에서만 읽고 쓴다. 그래서 다른 표처럼
-- RLS만 켜고 정책은 두지 않는다. 여러 번 실행해도 안전하다.
create table if not exists student_course (
  student_id uuid primary key references students(id) on delete cascade,
  answers jsonb not null,
  today jsonb,
  bonus_day date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table student_course enable row level security;
