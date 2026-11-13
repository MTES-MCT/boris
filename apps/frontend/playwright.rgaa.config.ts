import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: 'rgaa.spec.ts',
  timeout: 60000,
  use: {
    baseURL: 'http://127.0.0.1:4174',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 1000 },
      },
    },
  ],
  webServer: [
    {
      command: 'node tests/fixtures/rgaa-api.mjs',
      url: 'http://127.0.0.1:3181/api/ofss',
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        'npm run build && npm run preview -- --host 127.0.0.1 --port 4174',
      url: 'http://127.0.0.1:4174/plan-du-site',
      env: { API_URL: 'http://127.0.0.1:3181/api', API_KEY: 'rgaa-test' },
      reuseExistingServer: !process.env.CI,
      timeout: 5 * 60 * 1000,
    },
  ],
});
