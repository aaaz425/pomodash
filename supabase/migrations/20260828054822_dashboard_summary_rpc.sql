-- 대시보드 요약 통계(스트릭/월간 히트맵/이전 기간 비교/가장 바쁜 요일)를 서버에서 한 번에 계산한다.
-- PostgREST 집계 파라미터로는 연속 날짜(스트릭), 월간 zero-fill 히트맵, 요일별 최댓값을 표현할 수 없어 RPC로 작성.
-- security invoker(기본값) — 기존 RLS(sessions_select_own)가 그대로 적용되므로 auth.uid()로만 필터링.
-- 첫 번째로 일반 인증 사용자가 브라우저에서 직접 호출하는 RPC (기존 check_and_record_email_rate_limit은 service_role 전용).
-- p_timezone은 클라이언트의 IANA 타임존 문자열(예: 'Asia/Seoul') — 날짜 경계를 서버 시계가 아닌 사용자 로컬 기준으로 계산하기 위함.
create or replace function public.get_dashboard_summary(p_timezone text)
returns jsonb
language plpgsql
stable
as $$
declare
  v_uid uuid := auth.uid();
  v_today date := (now() at time zone p_timezone)::date;
  v_month_start date := date_trunc('month', v_today)::date;
  v_month_end date := (date_trunc('month', v_today) + interval '1 month - 1 day')::date;
  v_result jsonb;
begin
  with sess as (
    select started_at, focus_seconds,
      (started_at at time zone p_timezone)::date as local_date
    from public.sessions
    where user_id = v_uid
  ),
  local_days as (
    select distinct local_date from sess
  ),
  -- gaps-and-islands: 연속된 날짜를 (날짜 - 순번)으로 그룹핑하면 같은 그룹 = 연속 구간
  islands as (
    select local_date,
      local_date - (row_number() over (order by local_date))::int as grp
    from local_days
  ),
  island_sizes as (
    select grp, count(*) as sz, max(local_date) as last_day
    from islands
    group by grp
  ),
  month_days as (
    select d::date as day
    from generate_series(v_month_start, v_month_end, interval '1 day') d
  ),
  month_totals as (
    select month_days.day,
      coalesce(sum(sess.focus_seconds), 0) as day_seconds
    from month_days
    left join sess on sess.local_date = month_days.day
    group by month_days.day
  ),
  dow_totals as (
    select extract(dow from local_date)::int as dow, sum(focus_seconds) as s
    from sess
    where local_date between v_month_start and v_month_end
    group by dow
    order by s desc
    limit 1
  ),
  prev_day as (
    select coalesce(sum(focus_seconds), 0) as focus_seconds, count(*) as cnt
    from sess where local_date = v_today - 1
  ),
  prev_week as (
    select coalesce(sum(focus_seconds), 0) as focus_seconds, count(*) as cnt
    from sess
    where local_date >= (date_trunc('week', v_today::timestamp) - interval '7 day')::date
      and local_date < date_trunc('week', v_today::timestamp)::date
  ),
  prev_month as (
    select coalesce(sum(focus_seconds), 0) as focus_seconds, count(*) as cnt
    from sess
    where local_date >= (date_trunc('month', v_today::timestamp) - interval '1 month')::date
      and local_date < date_trunc('month', v_today::timestamp)::date
  )
  select jsonb_build_object(
    'streakDays', coalesce((select sz from island_sizes where last_day = v_today), 0),
    'maxStreakDays', coalesce((select max(sz) from island_sizes), 0),
    'monthlyActivity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'date', to_char(day, 'YYYY-MM-DD'),
        -- 1분 미만 집중도 캘린더에서 사라지지 않도록 반올림 대신 최소 1분 보장 (getMonthlyActivityData와 동일 규칙)
        'focusMinutes', case when day_seconds = 0 then 0 else greatest(1, round(day_seconds / 60.0)) end
      ) order by day)
      from month_totals
    ), '[]'::jsonb),
    'monthFocusSeconds', (select coalesce(sum(day_seconds), 0) from month_totals),
    'busiestDay', (select (array['일','월','화','수','목','금','토'])[dow + 1] || '요일' from dow_totals),
    'firstSessionDate', (select min(started_at) from sess),
    'prevDay', (select jsonb_build_object('focusSeconds', focus_seconds, 'count', cnt) from prev_day),
    'prevWeek', (select jsonb_build_object('focusSeconds', focus_seconds, 'count', cnt) from prev_week),
    'prevMonth', (select jsonb_build_object('focusSeconds', focus_seconds, 'count', cnt) from prev_month)
  ) into v_result;

  return v_result;
end;
$$;

grant execute on function public.get_dashboard_summary(text) to authenticated;
