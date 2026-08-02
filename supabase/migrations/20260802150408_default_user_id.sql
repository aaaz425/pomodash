-- insert 시 클라이언트가 user_id를 직접 넣지 않아도 되도록 DB 기본값으로 채운다.
-- (settings 브랜치에서만 당장 쓰지만, tasks/categories/sessions 전환 때도 바로 쓸 수 있게 한 번에 적용)
alter table public.categories alter column user_id set default auth.uid();
alter table public.tasks alter column user_id set default auth.uid();
alter table public.sessions alter column user_id set default auth.uid();
alter table public.settings alter column user_id set default auth.uid();
