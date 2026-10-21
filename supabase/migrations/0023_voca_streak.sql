-- 보카 게임도 연속 학습일에 넣기: 그날 보카를 몇 판 했는지. 여러 번 실행해도 안전하다.
alter table daily_activity add column if not exists voca_plays integer not null default 0;
