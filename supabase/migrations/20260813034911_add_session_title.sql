-- 세션별 자유 제목(title) 추가.
-- taskId와 독립된 오버레이 라벨 — 세션 목록/상세에서 taskId(카테고리 배지·통계용)
-- 대신 사람이 보는 이름으로 쓰인다. Task를 프리셋으로 골라도 되고 자유 텍스트를
-- 입력해도 된다. taskId 같은 FK 결합을 의도적으로 두지 않는다 — 연결된 Task가
-- 나중에 이름이 바뀌거나 삭제돼도 세션에 남긴 title은 독립적으로 유지되어야 한다.
alter table public.sessions
  add column title text check (char_length(title) <= 100);
