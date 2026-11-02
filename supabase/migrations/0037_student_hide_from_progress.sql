-- 진도표에서 숨길 학생 (지인 등). 학생 상세 화면에서 켜고 끈다. 수강에는 영향 없음.
alter table students add column if not exists hide_from_progress boolean not null default false;
