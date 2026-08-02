import { test, expect } from '@playwright/test';

test.describe('작업 관리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('작업 생성', async ({ page }) => {
    await page.getByRole('button', { name: '작업 관리' }).click();

    const taskModal = page.getByRole('dialog', { name: '작업 관리' });
    await expect(taskModal).toBeVisible();

    await taskModal.getByRole('button', { name: '새 작업 추가' }).click();

    const addModal = page.getByRole('dialog', { name: '새 작업 추가' });
    await expect(addModal).toBeVisible();

    await addModal.getByPlaceholder('예) 알고리즘 문제 풀기').fill('E2E 테스트 작업');
    await addModal.getByRole('button', { name: '추가' }).click();

    await expect(addModal).not.toBeVisible();
    await expect(taskModal.getByText('E2E 테스트 작업')).toBeVisible();

    // 정리 — 다음 테스트와 이름이 겹치지 않도록 생성한 작업을 삭제
    const taskRow = taskModal.getByText('E2E 테스트 작업').locator('xpath=ancestor::div[1]');
    await taskRow.getByRole('button', { name: '삭제' }).click();
    const confirm = page.getByRole('alertdialog');
    await confirm.getByRole('button', { name: '삭제' }).click();
    await expect(taskModal.getByText('E2E 테스트 작업')).not.toBeVisible();
  });

  test('작업 선택 후 타이머 연결', async ({ page }) => {
    // 설정 페이지에서 작업 생성
    await page.getByRole('button', { name: '작업 관리' }).click();
    const taskModal = page.getByRole('dialog', { name: '작업 관리' });
    await taskModal.getByRole('button', { name: '새 작업 추가' }).click();
    const addModal = page.getByRole('dialog', { name: '새 작업 추가' });
    await addModal.getByPlaceholder('예) 알고리즘 문제 풀기').fill('E2E 테스트 작업');
    await addModal.getByRole('button', { name: '추가' }).click();
    await expect(addModal).not.toBeVisible();

    // 타이머 화면에서 세션 시작 시 작업 선택
    await page.goto('/');
    await page.getByRole('button', { name: '시작' }).click();
    const startModal = page.getByRole('dialog', { name: '세션 시작' });
    await startModal.getByText('E2E 테스트 작업').click();
    await startModal.getByRole('button', { name: '시작' }).click();

    // 메인 화면에 선택된 작업 표시
    await expect(page.getByText('E2E 테스트 작업')).toBeVisible();
  });
});
