import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Add each new page here as it lands.
const pages = ['/', '/kit', '/experience/unjob/', '/projects/undrift/', '/play/'];

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

// SEO/GEO: valid JSON-LD and a reachable Markdown twin on every content page.
for (const path of ['/', '/projects/undrift/', '/experience/maxcode/', '/resume/']) {
  test(`${path} has parseable JSON-LD and a Markdown twin`, async ({ page, request }) => {
    await page.goto(path);
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length).toBeGreaterThan(0);
    for (const b of blocks) expect(() => JSON.parse(b)).not.toThrow();
    const twin = await page
      .locator('link[rel="alternate"][type="text/markdown"]')
      .getAttribute('href');
    const res = await request.get(new URL(twin!).pathname);
    expect(res.ok()).toBe(true);
    expect(await res.text()).toMatch(/^# /);
  });
}

test('public pages publish fetchable Open Graph and X share images', async ({ page, request }) => {
  for (const path of ['/', '/projects/undrift/', '/experience/maxcode/', '/resume/', '/play/']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const openGraph = page.locator('head meta[property="og:image"]');
    await expect(openGraph, path).toHaveCount(1);
    const image = new URL((await openGraph.getAttribute('content'))!);
    expect(image.origin).toBe('https://anik8.codes');
    expect(image.pathname).toBe(`${path}opengraph-image`);
    await expect(page.locator('head meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      image.href,
    );

    const response = await request.get(`${image.pathname}${image.search}`);
    expect(response.ok(), image.href).toBe(true);
    const png = await response.body();
    expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  }
});
