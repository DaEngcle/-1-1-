-- 강의 영상이 Live 수업 녹화본인지 (VOD가 준비되면 교체 예정 안내용). 여러 번 실행해도 안전하다.
alter table lessons add column if not exists video_live boolean not null default false;
-- Level 1.0: VOD가 있는 Day 01~06, Day 01~05 드릴 말고는 Live 녹화
update lessons set video_live = true
where course_id = 'level1'
  and not (kind = 'day' and day_number <= 6)
  and not (kind = 'drill' and title like 'Day 01~05%');
