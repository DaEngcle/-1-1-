-- 수강생 한정 자료: 이 과정을 듣는 학생만 보고 받는다 (null이면 모두)
alter table resources add column if not exists required_course text;
