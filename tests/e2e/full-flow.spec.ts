import { test, expect } from '@playwright/test';

const TASK_TITLE = 'E2E 풀플로우 작업';
const SESSION_NOTE = 'E2E 풀플로우 메모';

test('작업 생성 → 타이머 완료 → 메모 작성 → journal/dashboard 반영', async ({ page }) => {
  await page.goto('/');

  // 1. 세션 시작 모달 열기
  await page.getByRole('button', { name: '시작' }).click();
  const startModal = page.getByRole('dialog', { name: '세션 시작' });
  await expect(startModal).toBeVisible();

  // 2. 모달 내에서 새 작업 생성 (자동 선택됨)
  await startModal.getByRole('button', { name: '새 작업 만들기' }).click();
  await startModal.getByPlaceholder('작업 제목').fill(TASK_TITLE);
  await startModal.getByRole('button', { name: '추가' }).click();

  // 3. 이번 세션 설정 — 집중 5분(최솟값), 사이클 1회로 낮춰서 대기 시간 최소화
  const decreaseButtons = startModal.getByRole('button', { name: '감소' });
  for (let i = 0; i < 4; i++) await decreaseButtons.nth(0).click(); // 집중 25→5분
  for (let i = 0; i < 3; i++) await decreaseButtons.nth(1).click(); // 사이클 4→1회

  // 4. 타이머 시작 전 클록 설치 — 이후부터 가상 시간으로 통제
  await page.clock.install();

  // 5. 시작
  await startModal.getByRole('button', { name: '시작' }).click();
  await expect(startModal).not.toBeVisible();
  await expect(page.getByRole('button', { name: '일시정지' })).toBeVisible();

  // 6. 집중 5분 + 여유 1초 만큼 가상 시간 전진 → 마지막(유일한) 사이클이라 휴식 없이 바로 세션 종료
  await page.clock.fastForward('05:01');

  // 7. 세션 기록 모달에서 메모 작성 후 저장
  const recordModal = page.getByRole('dialog', { name: '세션 기록' });
  await expect(recordModal).toBeVisible();
  await recordModal.getByPlaceholder(/무엇을 집중해서 했나요/).fill(SESSION_NOTE);
  await recordModal.getByRole('button', { name: '기록 완료' }).click();

  const saveConfirm = page.getByRole('alertdialog');
  await expect(saveConfirm).toBeVisible();
  await saveConfirm.getByRole('button', { name: '저장' }).click();
  await expect(recordModal).not.toBeVisible();

  // 8. journal에 작업 제목이 반영되는지 확인
  await page.goto('/journal');
  await expect(page.getByText(TASK_TITLE).first()).toBeVisible();

  // 9. dashboard 집계에 새 세션이 반영되는지 확인
  // (RecentSessions 컴포넌트는 어디서도 import되지 않아 실제로 렌더링되지 않으므로,
  //  세션 상세가 아니라 집계 수치로 데이터 연동을 검증한다)
  await page.goto('/dashboard');
  await expect(page.getByText('이번 주 세션').first()).toBeVisible();
  await expect(page.getByText('1세션', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('연속 집중일').first()).toBeVisible();
  await expect(page.getByText('1일', { exact: true }).first()).toBeVisible();
});
