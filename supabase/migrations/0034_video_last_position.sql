-- 영상 이어 보기: 마지막으로 본 위치(초)
alter table video_progress add column if not exists last_position integer;
