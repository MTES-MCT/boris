import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    { name: "two-factor-test", value: "1", url: "http://127.0.0.1:5189" },
  ]);
});

test("admin completes the separate code step, retains pending session on reload and returns to the requested page", async ({
  page,
}, testInfo) => {
  await page.goto("/connexion?returnTo=%2Fselection-ofs");
  await page.waitForFunction(() => "dsfr" in window);
  await page.getByLabel("Adresse email").fill("admin@example.test");
  await page
    .getByLabel("Mot de passe", { exact: true })
    .fill("correct-password");
  await page.getByRole("button", { name: "Connexion", exact: true }).click();
  await expect(page).toHaveURL(/\/double-authentification\?returnTo=/);
  await expect(
    page.getByRole("heading", { name: "Vérifiez votre identité" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Vérifiez votre identité" }),
  ).toBeVisible();
  await page.getByLabel("Code de vérification").fill("wrong");
  await page.getByRole("button", { name: "Vérifier et se connecter" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Code invalide ou déjà utilisé",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: testInfo.outputPath("two-factor-mobile.png"),
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: testInfo.outputPath("two-factor-desktop.png"),
    fullPage: true,
  });
  await page.getByLabel("Code de vérification").fill("123456");
  await page.getByRole("button", { name: "Vérifier et se connecter" }).click();
  await expect(page).toHaveURL("/selection-ofs");
  // Visiting an old challenge URL must not clear the authenticated session.
  await page.goto("/double-authentification");
  await expect(page).toHaveURL("/selection-ofs");
  await page.reload();
  await expect(page).toHaveURL("/selection-ofs");
});

test("allows a recovery code and rejects an unsafe return destination", async ({
  page,
}) => {
  await page.goto("/connexion?returnTo=https%3A%2F%2Fexample.com");
  await page.waitForFunction(() => "dsfr" in window);
  await page.getByLabel("Adresse email").fill("admin@example.test");
  await page
    .getByLabel("Mot de passe", { exact: true })
    .fill("correct-password");
  await page.getByRole("button", { name: "Connexion", exact: true }).click();
  await expect(page).toHaveURL("/double-authentification");
  await page
    .getByLabel("Code de vérification")
    .fill("12345678-abcdefab-12345678-abcdefab");
  await page.getByRole("button", { name: "Vérifier et se connecter" }).click();
  await expect(page).toHaveURL("/selection-ofs");
});

test("lets an unprovisioned admin set up 2FA before entering the portal", async ({
  page,
}) => {
  await page.goto("/connexion");
  await page.waitForFunction(() => "dsfr" in window);
  await page.getByLabel("Adresse email").fill("unprovisioned@example.test");
  await page
    .getByLabel("Mot de passe", { exact: true })
    .fill("correct-password");
  await page.getByRole("button", { name: "Connexion", exact: true }).click();
  await expect(page).toHaveURL("/configuration-double-authentification");
  await expect(
    page.getByRole("heading", {
      name: "Configurer la double authentification",
    }),
  ).toBeVisible();
  await page
    .getByLabel("Confirmez votre mot de passe")
    .fill("correct-password");
  await page
    .getByRole("button", { name: "Commencer la configuration" })
    .click();
  await expect(page.getByLabel("Clé de configuration")).toBeVisible();
  await page.getByLabel("Code de vérification").fill("123456");
  await page.getByRole("button", { name: "Vérifier et activer" }).click();
  await expect(
    page.getByRole("heading", { name: "Conservez vos codes de récupération" }),
  ).toBeVisible();
  await page.locator('label[for="saved"]').click();
  await expect(
    page.getByLabel("J’ai enregistré mes codes de récupération"),
  ).toBeChecked();
  await page.getByRole("button", { name: "Terminer", exact: true }).click();
  await expect(page).toHaveURL("/mon-compte");
});

test("redirects a missing challenge to login", async ({ page }) => {
  await page.goto("/double-authentification");
  await expect(page).toHaveURL("/connexion");
});
