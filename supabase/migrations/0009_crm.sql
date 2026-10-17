-- 다잉클 클래스룸: 상담·고객 관리(CRM) + 학생 프로필 + 기수 + 결제 기록
-- 0008_teacher_notes.sql 적용 후 실행한다. 여러 번 실행해도 안전하다.

-- 기수 (예: 부트캠프 4기)
create table if not exists cohorts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  course_id text references courses(id),
  starts_on date,
  note text,
  created_at timestamptz not null default now()
);
alter table cohorts enable row level security;

-- 상담만 한 사람(lead)도 같은 표에서 관리. lead는 로그인할 수 없다
alter table students drop constraint if exists students_approval_check;
alter table students add constraint students_approval_check
  check (approval in ('lead', 'pending', 'approved', 'rejected'));

-- 고객 단계: 상담 예정 → 상담 완료 → 등록 / 미등록
alter table students add column if not exists stage text not null default 'enrolled'
  check (stage in ('lead', 'consulted', 'enrolled', 'lost'));
alter table students add column if not exists cohort_id uuid references cohorts(id) on delete set null;

-- 상담 때 받는 프로필
alter table students add column if not exists age integer;
alter table students add column if not exists departure text;      -- 출국 예정 (예: 2027.04)
alter table students add column if not exists korea_city text;     -- 사는 지역
alter table students add column if not exists aus_city text;       -- 호주 희망 도시
alter table students add column if not exists current_job text;
alter table students add column if not exists major text;
alter table students add column if not exists hope_job text;       -- 호주에서 희망하는 일
alter table students add column if not exists future_job text;     -- 미래 희망 직군
alter table students add column if not exists mbti text;
alter table students add column if not exists test_grade text;     -- 상담 레벨테스트 등급 (A-, C+ …)
alter table students add column if not exists star_speaking smallint check (star_speaking between 0 and 5);
alter table students add column if not exists star_listening smallint check (star_listening between 0 and 5);
alter table students add column if not exists star_confidence smallint check (star_confidence between 0 and 5);
alter table students add column if not exists buy_probability smallint check (buy_probability between 0 and 100);
alter table students add column if not exists source text;         -- 유입 (웨비나, 크몽, 프롬오지 …)
alter table students add column if not exists consulted_on date;
alter table students add column if not exists called boolean not null default false;
alter table students add column if not exists link_sent boolean not null default false;
alter table students add column if not exists free_vod boolean not null default false;
alter table students add column if not exists lost_reason text;    -- 미등록 사유
alter table students add column if not exists gift_sent text;      -- 보낸 선물·혜택

create index if not exists students_stage_idx on students (stage);

-- 결제 기록 (매출 시트)
create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete set null,
  buyer_name text not null,
  paid_on date,
  amount integer,
  source text,
  method text,
  product text,
  starts_on date,
  ends_on date,
  kind text,   -- 신규 / 수강연장 / 챌린지연장
  note text,
  created_at timestamptz not null default now()
);
create index if not exists purchases_student_idx on purchases (student_id);
alter table purchases enable row level security;
