// TODO: refacto, using a better architecture with 'beforeAll', 'describe'

import { XMLParser } from 'fast-xml-parser';
import { expect, test } from '@playwright/test';

import AxeBuilder from '@axe-core/playwright';

test('error page a11y', async ({ page }) => {
  const response = await page.goto(
    'http://localhost:4173/page-inexistante-pour-test-accessibilite',
  );

  expect(response?.status()).toBe(404);

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  const violationIds = accessibilityScanResults.violations.map(
    (violation) => violation.id,
  );

  expect(violationIds).not.toContain('document-title');
  expect(violationIds).not.toContain('nested-interactive');
  expect(violationIds).not.toContain('page-has-heading-one');
});

test('a11y', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('boris-cookies-consent', 'false');
  });

  const response = await fetch('http://localhost:4173/sitemap.xml');
  const data = await response.text();
  const parser = new XMLParser();
  const xml = parser.parse(data);
  const urls = xml.urlset.url.map((url: { loc: string }) => url.loc);

  for (const url of urls) {
    console.log(url);

    if (
      url.includes('questionnaire') ||
      url.includes('logements-brs-disponibles')
    ) {
      continue;
    }

    await page.goto(url);
    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude('iframe[src*="youtube.com"]')
      .exclude('iframe[src*="youtube-nocookie.com"]')
      .analyze();

    // await page.screenshot({ path: `${(new Date().getTime())}.png` });
    expect(accessibilityScanResults.violations).toEqual([]);
  }
});
