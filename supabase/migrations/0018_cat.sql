-- 학생이 고른 응원 고양이 (gray·cheese·russian·fold·siamese·ragdoll). 여러 번 실행해도 안전하다.
alter table students add column if not exists cat_breed text;
