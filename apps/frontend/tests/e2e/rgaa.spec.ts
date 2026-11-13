import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const open = async (page: Page, path: string) => {
  await page.goto(path);
  await page
    .locator('button[data-fr-js-modal-button]')
    .first()
    .waitFor({ state: 'attached' });
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('boris-cookies-consent', 'false');
  });
});

test('les erreurs des champs sont associées à une zone de messages unique', async ({
  page,
}) => {
  await open(page, '/simulateur-acquisition');
  await page.getByRole('button', { name: /Étape suivante/ }).click();
  const price = page.getByLabel(/Prix du logement/);
  const messagesId = await price.getAttribute('aria-describedby');
  expect(messagesId).toBeTruthy();
  await expect(page.locator(`[id="${messagesId}"]`)).toHaveCount(1);
  await expect(page.locator(`[id="${messagesId}"]`)).toContainText(
    'Veuillez remplir',
  );
});

test('les suggestions de ville fonctionnent au clavier sans soumettre le formulaire', async ({
  page,
}) => {
  await page.route(
    'https://data.geopf.fr/geocodage/search?*',
    async (route) => {
      await route.fulfill({
        json: {
          features: [
            {
              properties: {
                name: 'Rennes',
                city: 'Rennes',
                postcode: '35000',
                context: '35, Ille-et-Vilaine, Bretagne',
                citycode: '35238',
                label: 'Rennes',
              },
              geometry: { coordinates: [-1.68, 48.11] },
            },
            {
              properties: {
                name: 'Rennes',
                city: 'Rennes',
                postcode: '47000',
                context: '47, Lot-et-Garonne, Nouvelle-Aquitaine',
                citycode: '47200',
                label: 'Rennes',
              },
              geometry: { coordinates: [0.6, 44.1] },
            },
          ],
        },
      });
    },
  );
  await open(page, '/simulateur-acquisition');
  const city = page.getByRole('combobox');
  await city.fill('Rennes');
  const options = page.getByRole('option');
  await expect(options).toHaveCount(2);
  await expect(options.first()).toHaveAttribute('aria-posinset', '1');
  const listboxId = await city.getAttribute('aria-controls');
  await expect(page.locator(`[id="${listboxId}"]`)).toHaveAttribute(
    'role',
    'listbox',
  );
  await city.press('ArrowDown');
  await expect(city).toHaveAttribute(
    'aria-activedescendant',
    (await options.nth(1).getAttribute('id'))!,
  );
  await city.press('Enter');
  await expect(city).toHaveAttribute('aria-expanded', 'false');
  await expect(city).not.toHaveAttribute('aria-activedescendant');
  await expect(
    page.getByText('Veuillez remplir ce champs.', { exact: true }),
  ).toHaveCount(0);
});

test('les graphiques donnent accès aux mêmes données dans des tableaux nommés', async ({
  page,
}) => {
  await open(page, '/statistiques');
  const disclosures = page.locator('main details');
  await expect(disclosures).toHaveCount(4);
  await expect(page.locator('main [role="img"]')).toHaveCount(4);
  for (const disclosure of await disclosures.all()) {
    const summary = disclosure.locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(disclosure.getByRole('table')).toBeVisible();
    await expect(disclosure.getByRole('table')).toHaveAccessibleName(/.+/);
    await expect(disclosure.getByRole('columnheader').first()).toBeVisible();
    expect(await disclosure.getByRole('rowheader').count()).toBeGreaterThan(0);
  }
  const monthly = page.getByRole('table', {
    name: 'Nombre de simulations d’éligibilité au BRS par mois',
    exact: true,
  });
  await expect(
    monthly.getByRole('row', { name: /janvier 2025 10/ }),
  ).toBeVisible();
  await expect(
    monthly.getByRole('row', { name: /janvier 2026 30/ }),
  ).toBeVisible();
  await expect(
    page.getByRole('row', { name: 'Bretagne 42', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('row', { name: 'Ille-et-Vilaine (35) 42', exact: true }),
  ).toBeVisible();
  const duplicates = await page
    .locator('[id]')
    .evaluateAll((elements) =>
      elements
        .map((e) => e.id)
        .filter((id, index, ids) => ids.indexOf(id) !== index),
    );
  expect(duplicates).toEqual([]);
});

test('le plan HTML couvre les pages du sitemap XML et le pied de page y mène', async ({
  page,
  request,
}) => {
  await open(page, '/plan-du-site');
  await expect(
    page.getByRole('heading', { name: 'Plan du site', exact: true }),
  ).toBeVisible();
  await expect(
    page
      .locator('footer')
      .getByRole('link', { name: 'Plan du site', exact: true }),
  ).toHaveAttribute('href', '/plan-du-site');
  const response = await request.get(`/sitemap.xml`);
  const xml = await response.text();
  const paths = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname)
    .filter((path) => path !== '/plan-du-site');
  expect(paths).toContain('/simulateur-acquisition');
  for (const path of paths) {
    await expect(page.locator(`main a[href="${path}"]`)).toHaveCount(1);
  }
});

test('les statuts des OFS restent disponibles sans CSS', async ({ page }) => {
  await open(page, '/organismes-de-foncier-solidaire');
  await page.evaluate(() => {
    document
      .querySelectorAll('link[rel="stylesheet"],style')
      .forEach((element) => element.remove());
  });
  await expect(
    page.getByText('Propose des logements en BRS à vendre :', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Agréé, sans logement en BRS à vendre :', { exact: true }),
  ).toBeVisible();
});

test('les marqueurs sont nommés, activables au clavier, et les résultats sont annoncés', async ({
  page,
}) => {
  await open(page, '/logements-brs-disponibles');
  await expect(
    page.getByRole('heading', { name: 'Filtres', level: 2 }),
  ).toBeVisible();
  const marker = page.getByRole('button', {
    name: 'Les Jardins de BoRiS — Rennes',
    exact: true,
  });
  await expect(marker).toBeVisible();
  await marker.focus();
  await page.keyboard.press('Space');
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: '1 résultat dans la zone affichée sur la carte.' }),
  ).toHaveCount(1);
  await page.getByRole('button', { name: 'Liste', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Liste', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  // Le retour à la carte doit recréer un seul conteneur Leaflet fonctionnel.
  await page.getByRole('button', { name: 'Carte', exact: true }).click();
  await expect(page.locator('.leaflet-container')).toHaveCount(1);
  await expect(marker).toBeVisible();
});

test('les champs personnels déclarent leur finalité sans envoyer de coordonnées', async ({
  page,
}) => {
  await page.route('**/api/eligibility-simulations{,/*}', async (route) => {
    await route.fulfill({
      json: { id: 'simulation-test', ...route.request().postDataJSON() },
    });
  });
  await open(page, '/simulateur-eligibilite/steps');
  await page.locator('main select').first().selectOption('1');
  await page.locator('main select').nth(1).selectOption('false');
  await page.getByRole('button', { name: /Étape suivante/ }).click();
  await page.locator('main input').first().fill('25000');
  await page.getByRole('button', { name: /Étape suivante/ }).click();
  await page
    .locator('main select')
    .selectOption({ label: "Locataire d'un logement privé" });
  await page.getByRole('button', { name: /Étape suivante/ }).click();
  await page.getByRole('button', { name: /Étape suivante/ }).click();
  for (const [label, purpose] of [
    [/Prénom/, 'given-name'],
    [/Nom de famille/, 'family-name'],
    [/Adresse email/, 'email'],
    [/Numéro de téléphone/, 'tel'],
  ] as const) {
    await expect(page.getByLabel(label)).toHaveAttribute(
      'autocomplete',
      purpose,
    );
  }
  await expect(page.getByLabel(/Adresse email/)).toHaveAttribute(
    'type',
    'email',
  );
});

test('une ancienne suggestion ne reste pas exposée pendant une nouvelle recherche', async ({
  page,
}) => {
  await page.route(
    'https://data.geopf.fr/geocodage/search?*',
    async (route) => {
      const query = new URL(route.request().url()).searchParams.get('q');
      if (query !== 'Rennes')
        await new Promise((resolve) => setTimeout(resolve, 300));
      await route.fulfill({
        json: {
          features:
            query === 'Rennes'
              ? [
                  {
                    properties: {
                      name: 'Rennes',
                      context: '35, Ille-et-Vilaine, Bretagne',
                    },
                    geometry: { coordinates: [-1.68, 48.11] },
                  },
                ]
              : [],
        },
      });
    },
  );
  await open(page, '/simulateur-acquisition');
  const city = page.getByRole('combobox');
  await city.fill('Rennes');
  await expect(page.getByRole('option')).toHaveCount(1);
  await city.fill('Aucuneville');
  await expect(city).not.toHaveAttribute('aria-activedescendant');
  await expect(
    page.getByText("Aucun lieu correspondant n'a été trouvé."),
  ).toBeVisible();
  await expect(city).not.toHaveAttribute('aria-activedescendant');
  await expect(city).toHaveAttribute('aria-expanded', 'false');
});

test('les documents hôtes du plan du site passent les contrôles WCAG automatisables', async ({
  page,
  request,
}) => {
  test.setTimeout(5 * 60 * 1000);
  const xml = await (await request.get('/sitemap.xml')).text();
  const paths = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname,
  );
  expect(paths.length).toBeGreaterThan(30);
  for (const path of paths) {
    await open(page, path);
    const unnamedVectors = await page.locator('svg').evaluateAll((elements) =>
      elements
        .filter((element) => {
          if (element.closest('[aria-hidden="true"]')) return false;
          return (
            element.getAttribute('role') !== 'img' ||
            !(
              element.getAttribute('aria-label') ||
              element.getAttribute('aria-labelledby') ||
              element.querySelector('title')?.textContent?.trim()
            )
          );
        })
        .map((element) => element.outerHTML.slice(0, 200)),
    );
    expect(
      unnamedVectors,
      `SVG sans traitement accessible sur ${path}`,
    ).toEqual([]);
    // Les lecteurs tiers sont hors du contrôle de ce lot ; leurs titres hôtes restent testés ci-dessous.
    const scan = await new AxeBuilder({ page })
      .exclude('iframe')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(scan.violations, `Violations sur ${path}`).toEqual([]);
    for (const frame of await page.locator('iframe').all()) {
      await expect(frame).toHaveAttribute('title', /.+/);
      await expect(frame).not.toHaveAttribute('title', 'YouTube video player');
    }
  }
});
