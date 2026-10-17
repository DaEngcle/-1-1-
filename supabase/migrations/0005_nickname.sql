-- 다잉클 클래스룸: 랭킹에 실명 대신 보여줄 닉네임
-- 0004_engagement.sql 적용 후 실행한다. 여러 번 실행해도 안전하다.

alter table students add column if not exists nickname text;

-- 대소문자 구분 없이 같은 닉네임은 한 명만
create unique index if not exists students_nickname_unique_idx
  on students (lower(nickname)) where nickname is not null;
