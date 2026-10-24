-- 고양이 집: 주간 깜짝 상자 (무료, 주 1회). 여러 번 실행해도 안전하다.
create table if not exists cat_boxes (
  student_id uuid not null references students(id) on delete cascade,
  week date not null,
  item_id text,
  churu integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (student_id, week)
);
alter table cat_boxes enable row level security;
