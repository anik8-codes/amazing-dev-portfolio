import { defineConfig, devices } from '@playwright/test';

// Smoke tests run against the built static site in out/ (run `pnpm build` first).
export default defineConfig({
  testDir: 'e2e',
  testMatch: '*.e2e.ts', // not *.spec.ts, so Vitest never picks these up
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    launchOptions: { args: ['--enable-unsafe-swiftshader'] },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: 'pnpm preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
