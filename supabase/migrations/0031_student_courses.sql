-- 선생님이 직접 고른 과정 (plan='custom'일 때). null이면 수강권 기본 과정
alter table students add column if not exists courses text[];
