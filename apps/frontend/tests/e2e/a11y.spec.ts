// TODO: refacto, using a better architecture with 'beforeAll', 'describe'

import { XMLParser } from 'fast-xml-parser';
import { expect, test } from '@playwright/test';

import AxeBuilder from '@axe-core/playwright';

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

    if (url.includes('questionnaire')) {
      continue;
    }

    await page.goto(url);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  }
});
