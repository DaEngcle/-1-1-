-- 고양이 집 (미니룸): 산 아이템 · 방 배치 · 꾹꾹이(좋아요). 여러 번 실행해도 안전하다.
-- 츄르는 따로 저장하지 않고 공부 기록(daily_activity·submissions)에서 계산한 값 - 산 아이템 값.
create table if not exists cat_items (
  student_id uuid not null references students(id) on delete cascade,
  item_id text not null,
  price integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (student_id, item_id)
);
alter table cat_items enable row level security;

create table if not exists cat_rooms (
  student_id uuid primary key references students(id) on delete cascade,
  layout jsonb not null default '{}'::jsonb,
  likes integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table cat_rooms enable row level security;

create table if not exists cat_room_likes (
  owner_id uuid not null references students(id) on delete cascade,
  liker_id uuid not null references students(id) on delete cascade,
  day date not null,
  primary key (owner_id, liker_id, day)
);
alter table cat_room_likes enable row level security;
