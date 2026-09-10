-- task.title / category.name에 길이 제약이 어느 레이어에도 없어 무제한으로 저장되던 문제 수정.
-- CHECK 값은 types/schemas.ts INPUT_LIMITS.TITLE_MAX_LENGTH(100)/NICKNAME_MAX_LENGTH(20)와 동일하게 맞춘다 (이중 방어용, Zod보다 엄격하게 만들지 않음).

alter table public.tasks
  add constraint tasks_title_length check (char_length(title) <= 100);

alter table public.categories
  add constraint categories_name_length check (char_length(name) <= 20);
