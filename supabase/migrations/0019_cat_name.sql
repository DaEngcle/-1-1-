-- 학생이 지어준 고양이 이름. 여러 번 실행해도 안전하다.
alter table students add column if not exists cat_name text;
