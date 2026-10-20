-- 유료 자료(전자책 판매): 가격·미리보기·구매 신청·열어준 사람. 여러 번 실행해도 안전하다.
alter table resources add column if not exists price integer;        -- 판매가 (원). null이면 무료
alter table resources add column if not exists list_price integer;   -- 정가 (할인 전)
alter table resources add column if not exists preview_dir text;     -- 미리보기 이미지 폴더 (예: /previews/barista-2026)
alter table resources add column if not exists preview_count integer not null default 0;

-- 구매 신청 (학생이 누르면 선생님이 결제 안내 → 확인 후 열어줌)
create table if not exists resource_requests (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references resources(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (resource_id, student_id)
);
alter table resource_requests enable row level security;

-- 결제 확인 후 열어준 사람
create table if not exists resource_access (
  resource_id uuid not null references resources(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  granted_at timestamptz not null default now(),
  primary key (resource_id, student_id)
);
alter table resource_access enable row level security;

update resources
set price = 19000, list_price = 49000, preview_dir = '/previews/barista-2026', preview_count = 10
where title like '%바리스타%';
