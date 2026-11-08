-- 처음 들어온 학생에게 보여 주는 '앱 사용법' 안내를 봤는지 (한 번 보면 다시 안 뜬다. 더보기에서 다시 볼 수 있다)
-- student_course 줄은 코스를 만들기 전에도 생길 수 있다 (answers는 비어 있음). 여러 번 실행해도 안전하다.
alter table student_course add column if not exists guide_seen_at timestamptz;
