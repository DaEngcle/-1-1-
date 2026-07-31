-- 다잉클 데일리: 초기 스키마
-- Supabase 대시보드 SQL 에디터에 붙여넣어 실행하거나 `supabase db push`로 적용한다.

create extension if not exists pgcrypto;

-- 구독자
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  status text not null default 'trial'
    check (status in ('trial', 'active', 'cancelled', 'expired')),
  trial_start_date date not null default current_date,
  subscription_start_date date,
  content_day_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists subscribers_status_idx on subscribers (status);

-- 콘텐츠 (표현 60~90개 순환용)
create table if not exists contents (
  id uuid primary key default gen_random_uuid(),
  day_order integer not null unique,
  expression text not null,
  pronunciation_tip text,
  example_sentence text,
  situation_note text,
  created_at timestamptz not null default now()
);

-- 결제 이력
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references subscribers(id) on delete cascade,
  toss_billing_key text,
  amount integer not null,
  status text not null
    check (status in ('success', 'failed', 'cancelled')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists payments_subscriber_id_idx on payments (subscriber_id);

-- 발송 이력 (중복발송 방지용: 구독자당 하루 1건)
create table if not exists send_logs (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references subscribers(id) on delete cascade,
  content_id uuid references contents(id),
  sent_at timestamptz not null default now(),
  status text not null
    check (status in ('sent', 'failed'))
);

create unique index if not exists send_logs_subscriber_per_day_idx
  on send_logs (subscriber_id, (sent_at::date));

-- RLS 활성화: 모든 접근은 서버(service role)를 통해서만 이루어진다.
-- anon/authenticated 키에는 별도 정책을 부여하지 않는다 (기본 차단).
alter table subscribers enable row level security;
alter table contents enable row level security;
alter table payments enable row level security;
alter table send_logs enable row level security;
