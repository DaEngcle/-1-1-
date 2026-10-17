-- 다잉클 클래스룸: 레벨테스트 v2 (듣기·문법·자유 말하기)
-- 0005_nickname.sql 적용 후 실행한다. 여러 번 실행해도 안전하다.

alter table level_tests add column if not exists version integer not null default 1;
alter table level_tests add column if not exists grammar_score integer;
-- 듣기·문법·발음·유창성·말한 양 5가지 실력 점수
alter table level_tests add column if not exists skills jsonb;

-- 받아쓰기·빈칸 답, 자유 말하기 받아쓴 문장과 세부 점수
alter table level_test_answers add column if not exists text_answer text;
alter table level_test_answers add column if not exists detail jsonb;

-- v1(읽기 테스트) 결과는 v2와 비교할 수 없으므로 지운다 (출시 전 테스트 데이터뿐)
delete from level_tests where version < 2;
alter table level_tests alter column version set default 2;
