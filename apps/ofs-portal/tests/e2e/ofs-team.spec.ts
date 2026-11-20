import { expect, test } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  await request.post("http://127.0.0.1:3029/test/reset");
});
test("directory, invite, resend and cancel with support-only removal", async ({
  page,
}) => {
  await page.goto("/ofs/ofs-a/equipe");
  await expect(
    page.getByRole("heading", { name: "Équipe de OFS Alpha" }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "Alice", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "alice@example.test" }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "Non renseigné", exact: true }),
  ).toHaveCount(2);
  await expect(
    page.getByRole("button", { name: /supprimer|retirer/i }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "contactez l’administration BoRiS" }),
  ).toHaveAttribute("href", /^mailto:/);
  await page
    .getByLabel("Adresse e-mail du collègue")
    .fill("colleague@example.test");
  await page.getByRole("button", { name: "Envoyer l’invitation" }).click();
  await expect(page.getByRole("status")).toContainText("Invitation envoyée");
  await page.getByRole("button", { name: /Renvoyer l’invitation/ }).click();
  await expect(page.getByRole("status")).toContainText(
    "précédent lien est invalidé",
  );
  await page.screenshot({ path: "/tmp/boris-ofs-team.png", fullPage: true });
  await page.getByRole("button", { name: /Annuler l’invitation/ }).click();
  await expect(
    page.getByRole("cell", { name: "Annulée", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Renvoyer l’invitation/ }),
  ).toHaveCount(0);
});
test("new OFS colleague supplies their name and password", async ({ page }) => {
  await page.goto("/invitation-ofs?token=new");
  await page.getByLabel("Prénom", { exact: true }).fill("Camille");
  await page.getByLabel("Nom", { exact: true }).fill("Dupont");
  await page.getByLabel("Mot de passe").fill("long-password-example");
  await page
    .getByRole("button", { name: "Accepter et créer mon compte" })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Votre compte OFS a été créé",
  );
});
test("existing account accepts without changing password", async ({ page }) => {
  await page.goto("/invitation-ofs?token=existing");
  await expect(page.getByLabel("Mot de passe")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Accepter l’invitation", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("rejoint l’équipe");
});
test("expired invitation cannot be accepted", async ({ page }) => {
  await page.goto("/invitation-ofs?token=expired");
  await expect(page.getByRole("alert")).toContainText("expirée");
  await expect(page.getByRole("button", { name: /Accepter/ })).toHaveCount(0);
});
test("account identity is editable", async ({ page }) => {
  await page.goto("/mon-compte");
  await page.getByLabel("Prénom", { exact: true }).fill("Camille");
  await page.getByLabel("Nom", { exact: true }).fill("Dupont");
  await page.getByRole("button", { name: "Enregistrer mon identité" }).click();
  await expect(
    page.getByText("Votre prénom et votre nom ont été enregistrés."),
  ).toBeVisible();
});

test("OFS invitation submissions reject cross-site origins", async ({
  request,
}, testInfo) => {
  test.skip(
    !testInfo.config.metadata.production,
    "CSRF checks are disabled in dev mode",
  );
  const response = await request.post("/invitation-ofs?token=existing", {
    headers: { origin: "https://external.example.test" },
    form: { token: "existing" },
  });
  expect(response.status()).toBe(403);
});
