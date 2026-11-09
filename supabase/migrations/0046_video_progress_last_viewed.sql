-- 마지막으로 본 시각 (다시 보기도 포함). 강의 목록에서 "이어 보기"에 쓴다
alter table video_progress add column if not exists last_viewed_at timestamptz;
update video_progress set last_viewed_at = updated_at where last_viewed_at is null;
