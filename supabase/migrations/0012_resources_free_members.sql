-- 자료실(전자책 PDF 등) + 웨비나 무료회원. 0011 적용 후 실행. 여러 번 실행해도 안전하다.

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_path text not null,          -- storage 'resources' 버킷 안 경로
  file_name text not null,          -- 내려받을 때 파일 이름
  size_bytes bigint,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table resources enable row level security;

create table if not exists resource_downloads (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references resources(id) on delete cascade,
  student_id uuid references students(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists resource_downloads_resource_idx on resource_downloads (resource_id, created_at desc);
alter table resource_downloads enable row level security;

-- 마케팅(혜택·이벤트 안내) 수신 동의 — 개인정보 수집 동의와 따로 받는다
alter table students add column if not exists marketing_agreed_at timestamptz;

-- 비공개 버킷 (내려받기는 서버가 만든 1분짜리 서명 링크로만)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resources', 'resources', false, 52428800, array['application/pdf'])
on conflict (id) do nothing;
