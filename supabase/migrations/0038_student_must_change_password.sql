-- 선생님이 비밀번호를 초기화한 학생: 로그인하면 새 비밀번호를 정하는 창을 띄운다
alter table students add column if not exists must_change_password boolean not null default false;
