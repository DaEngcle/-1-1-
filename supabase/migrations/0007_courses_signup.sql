-- 다잉클 클래스룸: 과정(코스) 나누기 + 학생 직접 가입·선생님 승인·수강권 기간
-- 0006_level_test_v2.sql 적용 후 실행한다. 여러 번 실행해도 안전하다.

-- 과정: 부트캠프 / Level 1.0 / 2.0 / 3.0
create table if not exists courses (
  id text primary key,
  title text not null,
  subtitle text,
  sort_order integer not null,
  -- 촬영·제작 중이면 학생 화면에 '준비 중'으로 보임
  status text not null default 'preparing' check (status in ('open', 'preparing'))
);

insert into courses (id, title, subtitle, sort_order, status) values
  ('bootcamp', '워홀영어 60일 부트캠프', '워홀러 필수 강의', 1, 'open'),
  ('level1', 'Level 1.0 탄탄한 기초 회화의 시작', '촬영 중', 2, 'preparing'),
  ('level2', 'Level 2.0 영어가 입에서 툭 나온다', '커리큘럼 제작 중', 3, 'preparing'),
  ('level3', 'Level 3.0 영어 이젠 나도 고급자', '다음 달 제작 예정', 4, 'preparing')
on conflict (id) do nothing;

alter table courses enable row level security;

-- 기존 레슨은 모두 부트캠프
alter table lessons add column if not exists course_id text not null default 'bootcamp' references courses(id);

-- 순서·Day 번호는 과정 안에서만 겹치지 않으면 된다
alter table lessons drop constraint if exists lessons_sort_order_key;
alter table lessons drop constraint if exists lessons_day_number_key;
create unique index if not exists lessons_course_sort_idx on lessons (course_id, sort_order);
create unique index if not exists lessons_course_day_idx on lessons (course_id, day_number);

-- 학생: 직접 가입(전화번호+비밀번호) → 승인 대기 → 선생님이 수강권 부여
alter table students alter column login_code_hash drop not null;
alter table students add column if not exists password_hash text;
-- 기존(선생님이 등록한) 학생은 승인된 상태
alter table students add column if not exists approval text not null default 'approved'
  check (approval in ('pending', 'approved', 'rejected'));
-- 수강권: bootcamp(3개월) / kit12(12개월) / allinone(18개월). 코드 lib/classroom/plans.ts
alter table students add column if not exists plan text;
alter table students add column if not exists requested_plan text;
alter table students add column if not exists access_until date;
alter table students add column if not exists privacy_agreed_at timestamptz;

-- 기존 학생은 부트캠프반으로
update students set plan = 'bootcamp' where plan is null and approval = 'approved';

create unique index if not exists students_phone_unique_idx on students (phone) where phone is not null;

-- 주차별 수업 영상도 과정별로 (Week 1이 과정마다 따로 있음)
alter table class_recordings add column if not exists course_id text not null default 'bootcamp' references courses(id);
