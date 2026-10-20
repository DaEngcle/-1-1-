-- 학습 알림(웹 푸시): 기기별 구독 + 보낸 기록. 여러 번 실행해도 안전하다.
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists push_subscriptions_student_idx on push_subscriptions (student_id);
alter table push_subscriptions enable row level security;

create table if not exists push_log (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  kind text not null,          -- reminder / paused / teacher / test
  title text,
  body text,
  sent_at timestamptz not null default now()
);
create index if not exists push_log_student_idx on push_log (student_id, sent_at desc);
alter table push_log enable row level security;
