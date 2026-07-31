-- Phase 7: 로그인 필수 전환에 따른 초기 스키마.
-- id는 앱이 생성하지 않고 DB가 생성한다 (generateId()의 비보안 컨텍스트 폴백이 non-UUID라 uuid 컬럼과 충돌하는 것을 방지).
-- CHECK 제약은 types/schemas.ts의 TIMER_LIMITS/INPUT_LIMITS/SOUND_LIMITS와 동일한 범위만 반영한다 (이중 방어용, Zod보다 엄격하게 만들지 않음).

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null check (color ~ '^bg-'),
  position integer not null default 0,
  created_at timestamptz not null default now()
);
create index categories_user_id_idx on public.categories(user_id, position);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  title text not null,
  target_focus_minutes integer not null default 25 check (target_focus_minutes between 5 and 120),
  target_cycles integer not null default 4 check (target_cycles between 1 and 10),
  target_break_minutes integer not null default 5 check (target_break_minutes between 0 and 60),
  completed boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);
create index tasks_user_id_idx on public.tasks(user_id, position);
create index tasks_category_id_idx on public.tasks(category_id);

-- focus_periods는 정규화하지 않고 jsonb로 내장한다 — 항상 부모 세션과 함께만 조회/집계되고
-- (lib/focusPeriods.ts, lib/dashboard.ts) 독립 쿼리 대상이 아니라 별도 테이블화 이득이 없음.
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  mode text not null default 'pomodoro' check (mode in ('pomodoro', 'free')),
  started_at timestamptz not null,
  ended_at timestamptz not null,
  completed_cycles integer not null default 0 check (completed_cycles >= 0),
  total_cycles integer not null default 0 check (total_cycles >= 0),
  focus_seconds integer not null default 0 check (focus_seconds >= 0),
  paused_seconds integer not null default 0 check (paused_seconds >= 0),
  focus_periods jsonb not null default '[]'::jsonb
    check (jsonb_array_length(focus_periods) <= 100),
  note text check (char_length(note) <= 500),
  focus_rating smallint check (focus_rating in (1, 2, 3)),
  distraction_tags text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index sessions_user_id_started_at_idx on public.sessions(user_id, started_at desc);
create index sessions_task_id_idx on public.sessions(task_id);

-- 유저당 한 행 (localStorage의 단일 settings 객체와 동일한 형태) — user_id가 곧 PK.
create table public.settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null default '' check (char_length(nickname) <= 20),
  browser_notification boolean not null default true,
  sound_alert boolean not null default true,
  sound_type text not null default 'sine' check (sound_type in ('sine', 'chime', 'bell', 'digital')),
  sound_volume smallint not null default 70 check (sound_volume between 0 and 100),
  sound_repeat_count smallint not null default 2 check (sound_repeat_count between 1 and 5),
  motivational_messages text[] not null default '{}',
  default_focus_minutes integer not null default 25 check (default_focus_minutes between 5 and 120),
  default_short_break_minutes integer not null default 5 check (default_short_break_minutes between 0 and 60),
  default_total_cycles integer not null default 4 check (default_total_cycles between 1 and 10),
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.tasks enable row level security;
alter table public.sessions enable row level security;
alter table public.settings enable row level security;

create policy "categories_select_own" on public.categories for select using (auth.uid() = user_id);
create policy "categories_insert_own" on public.categories for insert with check (auth.uid() = user_id);
create policy "categories_update_own" on public.categories for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "categories_delete_own" on public.categories for delete using (auth.uid() = user_id);

create policy "tasks_select_own" on public.tasks for select using (auth.uid() = user_id);
create policy "tasks_insert_own" on public.tasks for insert with check (auth.uid() = user_id);
create policy "tasks_update_own" on public.tasks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks_delete_own" on public.tasks for delete using (auth.uid() = user_id);

create policy "sessions_select_own" on public.sessions for select using (auth.uid() = user_id);
create policy "sessions_insert_own" on public.sessions for insert with check (auth.uid() = user_id);
create policy "sessions_update_own" on public.sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sessions_delete_own" on public.sessions for delete using (auth.uid() = user_id);

create policy "settings_select_own" on public.settings for select using (auth.uid() = user_id);
create policy "settings_insert_own" on public.settings for insert with check (auth.uid() = user_id);
create policy "settings_update_own" on public.settings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "settings_delete_own" on public.settings for delete using (auth.uid() = user_id);

-- "automatically expose new tables" 옵션을 껐기 때문에 authenticated 롤에 명시적으로 권한을 줘야
-- PostgREST가 이 테이블들을 인식한다. 로그인이 필수라 anon에는 아무 권한도 주지 않는다.
grant select, insert, update, delete on public.categories, public.tasks, public.sessions, public.settings to authenticated;

-- 신규 계정 생성 시 기본 카테고리 5개 + 기본 settings 1행을 원자적으로 시딩한다.
-- "Confirm email"을 켜도 auth.users 행은 signUp() 시점에 바로 생성되므로,
-- 이메일 인증 전에도 이 트리거는 이미 실행된 상태다 (의도된 동작).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.settings (user_id, motivational_messages)
    values (
      new.id,
      array[
        '지금 이 순간에 집중하세요',
        '작은 진전도 진전입니다',
        '완벽보다 완료가 먼저예요',
        '시작이 반입니다, 이미 절반 왔어요',
        '오늘의 집중이 내일의 여유를 만듭니다',
        '잠깐의 몰입이 큰 차이를 만들어요',
        '한 번에 하나씩, 천천히 확실하게',
        '지금 집중한 시간은 사라지지 않아요'
      ]
    );

  insert into public.categories (user_id, name, color, position) values
    (new.id, '공부', 'bg-blue-500', 0),
    (new.id, '업무', 'bg-green-500', 1),
    (new.id, '운동', 'bg-orange-500', 2),
    (new.id, '독서', 'bg-purple-500', 3),
    (new.id, '기타', 'bg-gray-500', 4);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
