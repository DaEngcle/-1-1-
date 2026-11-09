-- 소리로 듣기 (화면 꺼도 재생): 강의 음성 파일 경로 (lesson-audio 버킷 안, 예: level1/day05.m4a)
-- 비어 있으면 레슨 화면에 듣기 카드가 안 보인다
alter table lessons add column if not exists audio_path text;

-- 유료 강의라 공개 URL 없이 비공개 버킷. 서버에서 서명 URL(6시간)로만 재생한다
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lesson-audio', 'lesson-audio', false, 52428800, array['audio/mp4', 'audio/x-m4a', 'audio/aac'])
on conflict (id) do nothing;
