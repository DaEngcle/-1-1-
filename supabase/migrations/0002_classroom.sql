-- 다잉클 클래스룸: 수강생 복습·쉐도잉·출결 관리
-- 0001_init.sql 적용 후 실행한다.

-- 수강생 (선생님이 직접 등록, 로그인 코드는 해시로만 저장)
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  memo text,
  login_code_hash text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 레슨: 부트캠프 커리큘럼 (Day 01~60 + 주차별 drill)
create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  -- 전체 정렬 순서 (Day/drill 섞어서 1부터)
  sort_order integer not null unique,
  week_number integer not null,
  week_title text not null,
  kind text not null default 'day' check (kind in ('day', 'drill')),
  -- kind='day'일 때 Day 번호 (drill은 null)
  day_number integer unique,
  title text not null,
  video_url text,
  description text,
  -- 기수 진도에 맞춰 선생님이 공개
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists lessons_week_idx on lessons (week_number, sort_order);

-- 레슨별 쉐도잉 문장
create table if not exists lesson_items (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  item_order integer not null,
  sentence text not null,
  translation text,
  note text,
  -- 데일리 표현을 재사용한 경우 원본 참조
  content_id uuid references contents(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (lesson_id, item_order)
);

-- 주차별 수업 영상 (줌 라이브 녹화본 등)
create table if not exists class_recordings (
  id uuid primary key default gen_random_uuid(),
  week_number integer not null,
  title text not null,
  video_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists class_recordings_week_idx on class_recordings (week_number);

-- 쉐도잉 제출 + AI 평가 결과
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  lesson_item_id uuid not null references lesson_items(id) on delete cascade,
  audio_path text not null,
  status text not null default 'pending'
    check (status in ('pending', 'scored', 'failed')),
  -- 발음 평가 점수 (0~100)
  overall_score numeric(5, 2),
  accuracy_score numeric(5, 2),
  fluency_score numeric(5, 2),
  completeness_score numeric(5, 2),
  prosody_score numeric(5, 2),
  -- 단어/음소 단위 상세 결과 (평가 API 원본)
  word_details jsonb,
  -- 학생에게 보여줄 한국어 코칭 피드백
  feedback_text text,
  created_at timestamptz not null default now(),
  scored_at timestamptz
);

create index if not exists submissions_student_id_idx
  on submissions (student_id, created_at desc);
create index if not exists submissions_lesson_item_id_idx
  on submissions (lesson_item_id);

-- 출결
create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  class_date date not null,
  status text not null
    check (status in ('present', 'late', 'absent', 'excused')),
  note text,
  created_at timestamptz not null default now(),
  unique (student_id, class_date)
);

create index if not exists attendance_class_date_idx on attendance (class_date desc);

-- 녹음 파일 저장소 (비공개, 서버에서 signed URL로만 접근)
insert into storage.buckets (id, name, public)
values ('shadowing', 'shadowing', false)
on conflict (id) do nothing;

-- 원어민 TTS 음성 캐시 (같은 문장은 한 번만 생성)
insert into storage.buckets (id, name, public)
values ('tts', 'tts', false)
on conflict (id) do nothing;

-- RLS: 0001과 동일하게 서버(service role) 전용
alter table students enable row level security;
alter table lessons enable row level security;
alter table lesson_items enable row level security;
alter table submissions enable row level security;
alter table attendance enable row level security;
alter table class_recordings enable row level security;
