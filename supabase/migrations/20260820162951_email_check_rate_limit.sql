-- check-email-provider Edge Function이 인증 없이 임의 이메일의 가입 여부·가입 방식을
-- 알려줄 수 있어(이메일 나열 공격) IP 기반 rate limit을 추가한다.
-- 카운트 체크 + 오래된 행 정리 + 기록을 함수 하나(RPC)로 묶어 select-then-insert 레이스를 피한다.
create table public.email_check_rate_limits (
  id uuid primary key default gen_random_uuid(),
  ip text not null,
  created_at timestamptz not null default now()
);
create index email_check_rate_limits_ip_created_at_idx
  on public.email_check_rate_limits(ip, created_at desc);

alter table public.email_check_rate_limits enable row level security;
-- 정책을 하나도 만들지 않아 anon/authenticated는 전부 거부된다 — service_role(RLS 우회) 클라이언트만 접근

create function public.check_and_record_email_rate_limit(
  p_ip text,
  p_limit int,
  p_window_seconds int
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  delete from public.email_check_rate_limits
    where created_at < now() - (p_window_seconds || ' seconds')::interval;

  select count(*) into v_count from public.email_check_rate_limits
    where ip = p_ip and created_at > now() - (p_window_seconds || ' seconds')::interval;

  if v_count >= p_limit then
    return false;
  end if;

  insert into public.email_check_rate_limits (ip) values (p_ip);
  return true;
end;
$$;
