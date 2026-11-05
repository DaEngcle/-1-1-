-- 고양이 마을 말하기 채점 횟수 (학생당 하루 한도)
create table if not exists village_speak_usage (
  student_id uuid not null references students(id) on delete cascade,
  day date not null,
  count integer not null default 0,
  primary key (student_id, day)
);
alter table village_speak_usage enable row level security;
