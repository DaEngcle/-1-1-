-- 내 워홀 코스 2단계: 고른 토픽 · AI 대화 기록 · 하루 AI 횟수, 그리고 표현 하나하나의 복습 일정.
-- answers는 질문을 다 끝내기 전(AI 대화 중)에도 줄이 생길 수 있어서 비워 둘 수 있게 한다.
-- 서버(service role)에서만 읽고 쓴다: RLS만 켜고 정책은 두지 않는다. 여러 번 실행해도 안전하다.
alter table student_course alter column answers drop not null;
alter table student_course add column if not exists topics jsonb;
alter table student_course add column if not exists ai jsonb;
alter table student_course add column if not exists ai_day date;
alter table student_course add column if not exists ai_count integer not null default 0;
alter table student_course add column if not exists ai_calls integer not null default 0;

-- 표현 연습 (빈칸 타이핑): phrase_key = 덱:세트:번호 (예: survival:2:0)
-- box 0 = 틀림/아직, 1~4 = 맞힌 횟수 단계 (복습 간격 1·3·7·14일)
create table if not exists student_phrase (
  student_id uuid not null references students(id) on delete cascade,
  phrase_key text not null check (char_length(phrase_key) <= 40),
  box smallint not null default 0,
  due_at timestamptz not null default now(),
  last_result text not null check (last_result in ('right', 'wrong')),
  reps integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (student_id, phrase_key)
);
create index if not exists student_phrase_due_idx on student_phrase (student_id, due_at);
alter table student_phrase enable row level security;
