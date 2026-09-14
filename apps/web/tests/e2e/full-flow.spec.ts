import { test, expect } from '@playwright/test';
import { uniqueName } from './testUtils';

const TASK_TITLE = uniqueName('E2E 풀플로우 작업');
const SESSION_NOTE = 'E2E 풀플로우 메모';

test('작업 생성 → 타이머 완료 → 메모 작성 → journal/dashboard 반영', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: '시작' }).click();
  const startModal = page.getByRole('dialog', { name: '타이머 시작' });
  await expect(startModal).toBeVisible();

  await startModal.getByRole('button', { name: '새 작업 추가' }).click();
  const addModal = page.getByRole('dialog', { name: '새 작업 추가' });
  await addModal.getByPlaceholder('예) 알고리즘 문제 풀기').fill(TASK_TITLE);
  await addModal.getByRole('button', { name: '추가' }).click();
  await expect(addModal).not.toBeVisible();

  const decreaseButtons = startModal.getByRole('button', { name: '감소' });
  for (let i = 0; i < 4; i++) await decreaseButtons.nth(0).click(); // 집중 25→5분
  for (let i = 0; i < 3; i++) await decreaseButtons.nth(1).click(); // 사이클 4→1회

  await page.clock.install();

  await startModal.getByRole('button', { name: '시작' }).click();
  await expect(startModal).not.toBeVisible();
  await expect(page.getByRole('button', { name: '정지' })).toBeVisible();

  await page.clock.fastForward('05:01');

  const recordModal = page.getByRole('dialog', { name: '기록 작성' });
  await expect(recordModal).toBeVisible();
  await recordModal.getByPlaceholder(/무엇을 집중해서 했나요/).fill(SESSION_NOTE);
  await recordModal.getByRole('button', { name: '기록 완료' }).click();

  const saveConfirm = page.getByRole('alertdialog');
  await expect(saveConfirm).toBeVisible();
  await saveConfirm.getByRole('button', { name: '저장' }).click();
  await expect(recordModal).not.toBeVisible();

  await page.goto('/journal');
  await expect(page.getByText(TASK_TITLE).first()).toBeVisible();

  await page.goto('/dashboard');
  await expect(page.getByText('이번 주 기록').first()).toBeVisible();
  await expect(page.getByText('1건', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('연속 집중일').first()).toBeVisible();
  await expect(page.getByText('1일', { exact: true }).first()).toBeVisible();
});
