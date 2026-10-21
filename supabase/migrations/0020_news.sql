-- 뉴스로 공부하기: 호주 뉴스 헤드라인 → 쉬운 요약·핵심 표현·퀴즈. 여러 번 실행해도 안전하다.
-- 기사 본문은 저장하지 않는다 (제목·링크만, 요약은 직접 쓴 글).
create table if not exists news_lessons (
  id uuid primary key default gen_random_uuid(),
  source_url text not null unique,
  source_name text not null default 'ABC News',
  source_title text not null,
  title_ko text not null,
  topic text not null default '📰 뉴스',
  level text not null default '보통',        -- 쉬움 · 보통 · 어려움
  published_on date not null default current_date,
  summary_en text not null,
  summary_ko text not null,
  expressions jsonb not null default '[]',   -- [{phrase, meaning, example, example_ko, note?}]
  quiz jsonb not null default '[]',          -- [{question, choices[], answer, explain}]
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists news_lessons_recent_idx on news_lessons (published_on desc, created_at desc);
alter table news_lessons enable row level security;

-- 학생이 읽음·퀴즈 완료한 기록
create table if not exists news_reads (
  news_id uuid not null references news_lessons(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  quiz_score integer,
  created_at timestamptz not null default now(),
  primary key (news_id, student_id)
);
alter table news_reads enable row level security;
