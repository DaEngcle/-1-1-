-- 고양이 집 방명록: 친구 방에 영어 한 줄 남기기 (방마다 하루 한 번). 여러 번 실행해도 안전하다.
create table if not exists cat_guestbook (
  id bigint generated always as identity primary key,
  owner_id uuid not null references students(id) on delete cascade,
  writer_id uuid not null references students(id) on delete cascade,
  day date not null,
  message text not null check (char_length(message) between 2 and 80),
  created_at timestamptz not null default now(),
  unique (owner_id, writer_id, day)
);
create index if not exists cat_guestbook_owner_idx on cat_guestbook (owner_id, created_at desc);
alter table cat_guestbook enable row level security;
