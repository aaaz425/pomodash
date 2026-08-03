import { test, expect } from '@playwright/test';

test.describe('대시보드', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('통계 페이지 렌더링', async ({ page }) => {
    await expect(page.getByRole('button', { name: '오늘' })).toBeVisible();
    await expect(page.getByRole('button', { name: '이번 주' })).toBeVisible();
    await expect(page.getByRole('button', { name: '이번 달' })).toBeVisible();
    await expect(page.getByRole('button', { name: '전체' })).toBeVisible();
    await expect(page.getByText('연속 집중일')).toBeVisible();
    await expect(page.getByText('세션 평균')).toBeVisible();
  });

  test('기간 탭 전환', async ({ page }) => {
    // 기본값은 이번 주 — 같은 텍스트가 여러 요소에 렌더링되므로 first() 사용
    await expect(page.getByText('이번 주 집중 시간').first()).toBeVisible();

    await page.getByRole('button', { name: '이번 달' }).click();
    await expect(page.getByText('이번 달 집중 시간').first()).toBeVisible();

    await page.getByRole('button', { name: '전체' }).click();
    await expect(page.getByText('전체 집중 시간').first()).toBeVisible();
  });
});
