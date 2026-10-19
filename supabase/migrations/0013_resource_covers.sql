-- 자료실 표지 이미지. 표지는 홍보용이라 공개 버킷. 여러 번 실행해도 안전하다.
alter table resources add column if not exists cover_path text;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('covers', 'covers', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
