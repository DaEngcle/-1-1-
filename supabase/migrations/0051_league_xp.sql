-- 리그 순위: 학생별 포인트 합계를 DB에서 계산 (이번 달 기록 전체를 서버로 가져오지 않게)
-- 포인트 = 시청 분 + 보카 포인트 + 제출당 p_per_sub + (채점 p_high점 이상이면 p_bonus)
-- 코드: lib/classroom/engagement.ts computeRanking

create index if not exists submissions_created_at_idx on public.submissions (created_at) include (student_id, status, overall_score);
create index if not exists daily_activity_day_idx on public.daily_activity (day) include (student_id, watched_seconds, voca_points);

create or replace function public.league_xp(p_start_day date, p_start_ts timestamptz, p_per_sub int, p_high int, p_bonus int)
returns table (student_id uuid, xp bigint)
language sql stable
set search_path = public
as $$
  select student_id, sum(xp)::bigint from (
    select d.student_id, (floor(d.watched_seconds / 60.0) + coalesce(d.voca_points, 0))::bigint as xp
      from daily_activity d where d.day >= p_start_day
    union all
    select s.student_id, (p_per_sub + case when s.status = 'scored' and s.overall_score >= p_high then p_bonus else 0 end)::bigint
      from submissions s where s.created_at >= p_start_ts
  ) t group by student_id
$$;
revoke all on function public.league_xp(date, timestamptz, int, int, int) from public, anon, authenticated;
grant execute on function public.league_xp(date, timestamptz, int, int, int) to service_role;
