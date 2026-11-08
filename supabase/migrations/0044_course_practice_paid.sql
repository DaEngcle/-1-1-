-- 오늘의 연습 포인트를 서버 기록(맞힌 표현) 기준으로 주기 위한 마지막 지급 시각
alter table student_course add column if not exists practice_paid_at timestamptz;
