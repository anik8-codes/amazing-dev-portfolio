import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Add each new page here as it lands.
const pages = ['/', '/kit', '/experience/unjob/', '/play/'];

for (const path of pages) {
  test(`${path} renders with one h1 and no axe violations`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(violations).toEqual([]);
  });
}
