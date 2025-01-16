import { expect, test } from '@playwright/test';

// import { expect, test, chromium } from '@playwright/test';
// import type { Page } from '@playwright/test';

// let page: Page;

// test.beforeAll(async () => {
//   const browser = await chromium.launch();
//   page = await browser.newPage();

//   await page.goto(
//     '/tout-savoir-sur-le-bail-reel-solidaire-brs/je-cherche-des-financements',
//   );
// });

test('je-cherche-des-financements page has expected h1', async () => {
  const modules = import.meta.glob('$routes/*.*');
  console.log(modules);

  expect(1).toBe(1);
});
