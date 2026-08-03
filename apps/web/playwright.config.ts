import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

// Next.js dev 서버(webServer로 띄우는 자식 프로세스)는 .env.local을 알아서 읽지만,
// Playwright 테스트 실행 프로세스 자체는 별도라 명시적으로 로드해야 함
config({ path: '.env.local' });

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  // Supabase 왕복이 실제로 생겨서(로컬보다 느린 CI 러너 기준) 기본 5초보다 여유를 둠
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
