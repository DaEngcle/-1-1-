-- 보카 게임 점수도 리그(랭킹) 포인트에 넣기. 여러 번 실행해도 안전하다.
alter table daily_activity add column if not exists voca_points integer not null default 0;
