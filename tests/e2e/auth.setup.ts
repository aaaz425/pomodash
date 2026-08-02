import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('이메일', { exact: true }).fill(process.env.E2E_TEST_EMAIL!);
  await page.getByLabel('비밀번호', { exact: true }).fill(process.env.E2E_TEST_PASSWORD!);
  await page.getByRole('button', { name: '로그인', exact: true }).click();
  await page.waitForURL('/');
  await page.context().storageState({ path: authFile });
});
