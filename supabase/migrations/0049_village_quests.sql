-- 고양이 마을 오늘의 의뢰 3개 (가게 대화 · 강의 문장 · 어제 복습). 하루 한 줄, 끝낸 의뢰 이름을 모은다.
-- 3개를 다 한 날이 이어지면 연속 기록(발자국)이 된다. 츄르: 의뢰 하나 5, 3개 다 하면 보너스 10.
create table if not exists village_quests (
  student_id uuid not null references students(id) on delete cascade,
  day date not null,
  done text[] not null default '{}',
  primary key (student_id, day)
);
alter table village_quests enable row level security;
