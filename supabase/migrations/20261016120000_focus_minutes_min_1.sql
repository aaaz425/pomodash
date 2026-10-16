alter table public.settings drop constraint if exists settings_default_focus_minutes_check;
alter table public.settings add constraint settings_default_focus_minutes_check
  check (default_focus_minutes between 1 and 120);

alter table public.tasks drop constraint if exists tasks_target_focus_minutes_check;
alter table public.tasks add constraint tasks_target_focus_minutes_check
  check (target_focus_minutes between 1 and 120);
