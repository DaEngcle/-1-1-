-- 자료실에 파일 대신 링크(노션 체크리스트 등)도 넣을 수 있게. 여러 번 실행해도 안전하다.
alter table resources add column if not exists link_url text;
alter table resources alter column file_path drop not null;
alter table resources alter column file_name drop not null;
