-- 회원가입 시 닉네임 기본값을 채운다.
-- 카카오 로그인은 raw_user_meta_data.nickname(카카오 프로필 닉네임)을,
-- 이메일 가입은 이메일 로컬 파트를 기본값으로 사용한다. 20자 제한(check 제약)에 맞춰 자른다.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.settings (user_id, nickname, motivational_messages)
    values (
      new.id,
      left(coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1)), 20),
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
