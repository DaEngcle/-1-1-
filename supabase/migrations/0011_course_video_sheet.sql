-- 과정별 강의 링크 구글 시트 (VOD를 시트에 넣으면 앱 레슨 영상이 자동으로 바뀜)
-- 시트 주소는 공개 저장소가 아닌 DB에만 둔다. 여러 번 실행해도 안전하다.
alter table courses add column if not exists video_sheet text;
