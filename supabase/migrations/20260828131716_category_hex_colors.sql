-- categories.color를 프리셋 키(Tailwind 클래스 문자열, 'bg-blue-500' 등)에서
-- 실제 hex 값('#3b82f6')으로 전환한다. 커스텀 색상 입력을 지원하려면 임의의 값을
-- 저장할 수 있어야 하는데, 프리셋 키 체계로는 표현이 불가능하기 때문.

-- 1) 기존 'bg-' 형식만 허용하던 CHECK 제약을 먼저 없애야 아래 UPDATE가 통과한다
alter table public.categories drop constraint if exists categories_color_check;

-- 2) 기존 데이터를 hex로 변환
update public.categories set color = case color
  when 'bg-blue-500' then '#3b82f6'
  when 'bg-green-500' then '#22c55e'
  when 'bg-orange-500' then '#f97316'
  when 'bg-purple-500' then '#a855f7'
  when 'bg-gray-500' then '#6b7280'
  when 'bg-red-500' then '#ef4444'
  when 'bg-pink-500' then '#ec4899'
  when 'bg-yellow-500' then '#eab308'
  when 'bg-teal-500' then '#14b8a6'
  when 'bg-indigo-500' then '#6366f1'
  else '#6b7280'
end
where color ~ '^bg-';

-- 3) CHECK 제약을 hex 형식으로 새로 추가
alter table public.categories add constraint categories_color_check check (color ~ '^#[0-9a-fA-F]{6}$');

-- 4) 신규 유저 기본 카테고리 시드를 hex로 갱신
create or replace function public.handle_new_user()
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
    (new.id, '공부', '#3b82f6', 0),
    (new.id, '업무', '#22c55e', 1),
    (new.id, '운동', '#f97316', 2),
    (new.id, '독서', '#a855f7', 3),
    (new.id, '기타', '#6b7280', 4);

  return new;
end;
$$;
