-- AI 면접 리포트 따라 말하기 채점 횟수 (면접 한 번에 30번까지)
alter table interview_sessions add column if not exists practice_count integer not null default 0;
