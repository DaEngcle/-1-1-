-- 교재 영상(원어민 대화 클립): storage clips 버킷(공개) 안 경로
alter table lessons add column if not exists clip_path text;
