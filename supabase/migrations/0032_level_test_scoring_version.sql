-- 레벨테스트 채점 기준 버전 (기준이 바뀌면 예전 결과를 다시 채점)
alter table level_tests add column if not exists scoring_version integer not null default 2;
