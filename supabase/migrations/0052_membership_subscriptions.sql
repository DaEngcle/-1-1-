-- 앱 멤버십 정기결제 (토스페이먼츠 자동결제)
-- 강의(웨비나 과정)는 포함하지 않는다. 결제되면 students.plan = 'app', access_until = 이용 마지막 날

create table if not exists membership_subscriptions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  -- 토스 customerKey: 추측할 수 없는 값이어야 해서 따로 만든다
  customer_key text not null unique default ('dingle_' || replace(gen_random_uuid()::text, '-', '')),
  billing_key text,
  card_label text,                      -- 화면 표시용 (예: 신한 1234)
  amount integer not null check (amount > 0),
  status text not null default 'pending'
    check (status in ('pending', 'active', 'past_due', 'ended')),
  cancel_at_period_end boolean not null default false,
  current_period_end date,              -- 이용 마지막 날 (이 날 다음 결제를 시도한다)
  failed_count integer not null default 0,
  cancelled_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 학생 한 명당 살아 있는 구독은 하나만
create unique index if not exists membership_subscriptions_one_live
  on membership_subscriptions (student_id) where status in ('active', 'past_due');
create index if not exists membership_subscriptions_due
  on membership_subscriptions (current_period_end) where status in ('active', 'past_due');

create table if not exists membership_payments (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references membership_subscriptions(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  order_id text not null unique,        -- 같은 결제를 두 번 하지 않도록 기간마다 하나
  payment_key text,
  amount integer not null,
  status text not null default 'pending'
    check (status in ('pending', 'done', 'failed', 'cancelled')),
  period_end date,                      -- 이 결제로 이용할 수 있는 마지막 날
  receipt_url text,
  failure_message text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists membership_payments_student on membership_payments (student_id, created_at desc);

alter table membership_subscriptions enable row level security;
alter table membership_payments enable row level security;
-- 정책 없음: 서버(service role)만 접근

-- 약관·정기결제 동의 시각 (전자상거래법 기록 보관용)
alter table students add column if not exists terms_agreed_at timestamptz;
