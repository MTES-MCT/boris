import { expect, test } from "@playwright/test";

test("enrolls from Mon compte with QR, manual key, verification and one-time recovery codes", async ({
  page,
  context,
}, testInfo) => {
  await page.goto("/mon-compte");
  await page
    .getByRole("link", { name: "Activer la double authentification" })
    .click();
  await page.getByLabel("Confirmez votre mot de passe").fill("wrong-password");
  await page
    .getByRole("button", { name: "Commencer la configuration" })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "Vérifiez votre mot de passe",
  );
  await page
    .getByLabel("Confirmez votre mot de passe")
    .fill("correct-password");
  await page
    .getByRole("button", { name: "Commencer la configuration" })
    .click();
  const key = await page.getByLabel("Clé de configuration").inputValue();
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: "Copier la clé" }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(key);
  await expect(
    page.getByRole("img", { name: "QR code de configuration", exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "QR code de configuration", exact: false }),
  ).toHaveAttribute("src", /^data:image\/png;base64,/);
  await page.reload();
  await expect(page.getByLabel("Clé de configuration")).toHaveValue(key);
  await page.waitForFunction(() => "dsfr" in window);
  await page.getByLabel("Code de vérification").fill("000000");

  await page.getByRole("button", { name: "Vérifier et activer" }).click();
  await expect(page.getByRole("alert")).toContainText("Code invalide");
  await expect(
    page.getByText("codes permettent de vous connecter", { exact: false }),
  ).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: testInfo.outputPath("setup-mobile.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByLabel("Code de vérification").fill("123456");
  await page.getByRole("button", { name: "Vérifier et activer" }).click();
  await expect(
    page.getByRole("heading", { name: "Conservez vos codes de récupération" }),
  ).toBeVisible();
  await expect(page.locator(".recovery-codes li")).toHaveCount(10);
  await expect(page.getByLabel("Clé de configuration")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Terminer", exact: true }),
  ).toBeDisabled();
  await page.screenshot({
    path: testInfo.outputPath("recovery-mobile.png"),
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: testInfo.outputPath("recovery-desktop.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Copier les codes" }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("00000000-abcdefab-12345678-abcdefab");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Télécharger les codes" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "boris-codes-recuperation.txt",
  );
  await page.locator('label[for="saved"]').click();
  await expect(
    page.getByLabel("J’ai enregistré mes codes de récupération"),
  ).toBeChecked();
  await page.getByRole("button", { name: "Terminer", exact: true }).click();
  await expect(page).toHaveURL("/mon-compte");
  await expect(page.getByText("Activée", { exact: true })).toBeVisible();
  await page.goto("/configuration-double-authentification");
  await expect(
    page.getByRole("heading", { name: "Double authentification activée" }),
  ).toBeVisible();
  await expect(page.locator(".recovery-codes")).toHaveCount(0);
});

test("cancels a pending setup without activation", async ({ page }) => {
  await page.goto("/configuration-double-authentification");
  await page
    .getByLabel("Confirmez votre mot de passe")
    .fill("correct-password");
  await page
    .getByRole("button", { name: "Commencer la configuration" })
    .click();
  await page.getByRole("button", { name: "Annuler la configuration" }).click();
  await expect(page).toHaveURL("/mon-compte");
  await expect(
    page.getByRole("link", { name: "Activer la double authentification" }),
  ).toBeVisible();
  await page.goto("/configuration-double-authentification");
  await expect(page.getByLabel("Clé de configuration")).toHaveCount(0);
});

test("non-admin accounts can disable with password and OTP confirmation", async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: "setup-enabled", value: "1", url: "http://127.0.0.1:5189" },
    { name: "setup-non-admin", value: "1", url: "http://127.0.0.1:5189" },
  ]);
  await page.goto("/mon-compte");
  await page.waitForFunction(() => "dsfr" in window);
  await page
    .getByText("Désactiver la double authentification", { exact: true })
    .click();
  await page
    .getByLabel("Mot de passe actuel pour désactiver")
    .fill("correct-password");
  await page.getByLabel("Code de vérification").fill("000000");
  await page
    .getByRole("button", { name: "Confirmer la désactivation" })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "Désactivation impossible",
  );
  await page
    .getByLabel("Mot de passe actuel pour désactiver")
    .fill("correct-password");
  await page.getByLabel("Code de vérification").fill("654321");
  await page
    .getByRole("button", { name: "Confirmer la désactivation" })
    .click();
  await expect(page).toHaveURL("/connexion");
});

test("admins see the mandatory policy without a disable action", async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: "setup-enabled", value: "1", url: "http://127.0.0.1:5189" },
  ]);
  await page.goto("/mon-compte");
  await expect(
    page.getByText(
      "La double authentification est obligatoire pour les administrateurs",
      { exact: false },
    ),
  ).toBeVisible();
  await expect(
    page.getByText("Désactiver la double authentification", { exact: true }),
  ).toHaveCount(0);
});
