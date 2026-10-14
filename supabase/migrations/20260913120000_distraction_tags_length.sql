-- sessions.distraction_tags 원소 길이에 DB 레벨 제약이 없어 클라이언트 UI만 믿고 있던 문제 수정.
-- 값은 types/schemas.ts INPUT_LIMITS.DISTRACTION_TAG_MAX_LENGTH와 동일하게 맞춘다.

create function public.check_tag_lengths(tags text[])
returns boolean
language sql
immutable
as $$
  select coalesce(bool_and(char_length(t) <= 20), true)
  from unnest(tags) as t;
$$;

alter table public.sessions
  add constraint sessions_distraction_tags_length
    check (public.check_tag_lengths(distraction_tags));
