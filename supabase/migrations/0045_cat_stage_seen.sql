-- 고양이 성장 단계: 학생이 마지막으로 본 단계 (단계가 오르면 한 번만 축하 화면을 띄운다). 여러 번 실행해도 안전하다.
alter table students add column if not exists cat_stage_seen smallint;
