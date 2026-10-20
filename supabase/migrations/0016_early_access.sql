-- 준비 중인 과정을 특정 학생에게만 미리 열어주기 (예: Level 2.0을 현재 수강 중인 학생). 여러 번 실행해도 안전하다.
alter table students add column if not exists early_courses text[] not null default '{}';
