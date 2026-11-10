import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Add each new page here as it lands.
const pages = ['/', '/kit', '/experience/unjob/', '/play/'];

for (const path of pages) {
  test(`${path} renders with one h1 and no axe violations`, async ({ page }, testInfo) => {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(violations).toEqual([]);
    if (process.env.CAPTURE_LAUNCH_DEMO && path === '/experience/unjob/') {
      await page.screenshot({
        path: testInfo.outputPath('experience.png'),
        animations: 'disabled',
      });
    }
  });
}

// Deferred layout must still honor direct links into lower home sections.
for (const id of ['projects', 'workspace', 'player', 'skills', 'faq']) {
  test(`home #${id} remains reachable`, async ({ page }, testInfo) => {
    await page.goto(`/#${id}`);
    const section = page.locator(`#${id}`);
    await expect(section).toBeInViewport();
    await expect(section.locator('h2').first()).toBeVisible();
    if (process.env.CAPTURE_LAUNCH_DEMO) {
      if (id === 'workspace') {
        await section
          .getByRole('region', { name: 'my setup', exact: true })
          .scrollIntoViewIfNeeded();
        await expect(
          section.getByRole('button', { name: 'use computer', exact: true }),
        ).toBeEnabled({ timeout: 20000 });
        await expect(
          page
            .frameLocator('iframe')
            .first()
            .getByRole('button', { name: /open resume/ }),
        ).toBeVisible({ timeout: 20000 });
      }
      await page.screenshot({ path: testInfo.outputPath(`${id}.png`), animations: 'disabled' });
    }
  });
}
