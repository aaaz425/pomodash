-- motivational_messages(개수 1-20, 원소 길이 1-200)와 카테고리 개수(유저당 10개)에
-- DB 레벨 제약이 전혀 없어 클라이언트 UI만 믿고 있던 문제 수정.
-- 값은 types/schemas.ts INPUT_LIMITS.MESSAGE_COUNT_MIN/MAX, MESSAGE_LENGTH_MIN/MAX, CATEGORIES_MAX와 동일하게 맞춘다.

alter table public.settings
  add constraint settings_motivational_messages_count
    check (array_length(motivational_messages, 1) between 1 and 20);

alter table public.settings
  add constraint settings_motivational_messages_length
    check (
      coalesce(
        (select bool_and(char_length(m) between 1 and 200) from unnest(motivational_messages) as m),
        true
      )
    );

-- 카테고리 개수는 여러 행에 걸친 집계라 CHECK로 표현할 수 없어 트리거로 강제한다.
create function public.enforce_category_count_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.categories where user_id = new.user_id) >= 10 then
    raise exception 'category count limit exceeded';
  end if;
  return new;
end;
$$;

create trigger categories_count_limit
  before insert on public.categories
  for each row execute function public.enforce_category_count_limit();
