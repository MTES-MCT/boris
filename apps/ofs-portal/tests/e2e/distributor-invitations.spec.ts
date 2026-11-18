import { expect, test } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  await request.post("http://127.0.0.1:3029/test/reset");
});

test("existing reseller selection links without offering an email field", async ({
  page,
}) => {
  await page.goto("/ofs/ofs-a/commercialisateurs");
  await page.getByLabel("Nom du commercialisateur").fill("Habitat");
  await expect(
    page.getByRole("heading", { name: "Commercialisateurs existants" }),
  ).toBeVisible();
  await expect(
    page.getByLabel("Adresse e-mail du premier compte commercialisateur"),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Rattacher", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "Aucun compte ni invitation",
  );
  await expect(
    page.getByText("Habitat Solidaire", { exact: true }),
  ).toBeVisible();
});

test("linked reseller names unfold to show only account emails", async ({
  page,
}) => {
  await page.goto("/ofs/ofs-a/commercialisateurs");
  await page.getByLabel("Nom du commercialisateur").fill("Habitat");
  await page.getByRole("button", { name: "Rattacher", exact: true }).click();
  const details = page
    .locator("details")
    .filter({ hasText: "Habitat Solidaire" });
  await expect(details).toBeVisible();
  await expect(
    details.getByText("alice@habitat.test", { exact: true }),
  ).toBeHidden();
  await details.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(details.locator("li")).toHaveText([
    "alice@habitat.test",
    "bob@habitat.test",
  ]);
  await expect(
    details.getByText("alice@habitat.test", { exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "/tmp/boris-commercialisateur-emails.png",
    fullPage: true,
  });
  await details.locator("summary").click();
  await expect(
    details.getByText("alice@habitat.test", { exact: true }),
  ).toBeHidden();
  await page.reload();
  await details.locator("summary").click();
  await expect(
    details.getByText("bob@habitat.test", { exact: true }),
  ).toBeVisible();
});

test("invite, resend and cancel from the OFS portal", async ({ page }) => {
  await page.goto("/ofs/ofs-a/commercialisateurs");
  await page.getByLabel("Nom du commercialisateur").fill("Nouveau partenaire");
  await page
    .getByRole("button", { name: "Inviter un nouveau commercialisateur" })
    .click();
  await page
    .getByLabel("Adresse e-mail du premier compte commercialisateur")
    .fill("person@example.test");
  await page.getByRole("button", { name: "Envoyer l’invitation" }).click();
  await expect(page.getByRole("status")).toContainText("Invitation envoyée");
  await expect(
    page.getByRole("cell", { name: "En attente", exact: false }),
  ).toBeVisible();
  await page.screenshot({
    path: "/tmp/boris-commercialisateurs.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Renvoyer" }).click();
  await expect(page.getByRole("status")).toContainText("Invitation renvoyée");
  await page.getByRole("button", { name: "Annuler" }).click();
  await expect(
    page.getByRole("cell", { name: "Annulée", exact: false }),
  ).toBeVisible();
});

test("explains why an existing OFS email cannot receive a reseller invitation", async ({
  page,
}) => {
  await page.goto("/ofs/ofs-a/commercialisateurs");
  await page.getByLabel("Nom du commercialisateur").fill("Nouveau partenaire");
  await page
    .getByRole("button", { name: "Inviter un nouveau commercialisateur" })
    .click();
  await page
    .getByLabel("Adresse e-mail du premier compte commercialisateur")
    .fill("ofs@example.test");
  await page.getByRole("button", { name: "Envoyer l’invitation" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "compte OFS ou administrateur",
  );
});

test("acceptance creates a reseller account and remains accessible while logged in", async ({
  page,
}) => {
  await page.goto("/invitation-commercialisateur?token=new");
  await page.getByLabel("Mot de passe").fill("long-password-example");
  await page
    .getByRole("button", { name: "Accepter et créer mon compte" })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "compte commercialisateur a été créé",
  );
});

test("a suggestion at acceptance links without creating an account", async ({
  page,
}) => {
  await page.goto("/invitation-commercialisateur?token=matches");
  await page.screenshot({
    path: "/tmp/boris-invitation-acceptance.png",
    fullPage: true,
  });
  const submission = page.waitForRequest(
    (request) =>
      request.method() === "POST" &&
      new URL(request.url()).pathname === "/invitation-commercialisateur",
  );
  await page
    .getByRole("button", { name: "Rattacher cette organisation" })
    .click();
  expect((await submission).headers().origin).toBe(new URL(page.url()).origin);
  await expect(page.getByRole("status")).toContainText(
    "Aucun compte n’a été créé",
  );
});

test("invitation pages do not leak tokens to external sites", async ({
  page,
}) => {
  await page.goto("/invitation-commercialisateur?token=matches");
  await page.route("https://external.example.test/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "External page" }),
  );
  const navigation = page.waitForRequest("https://external.example.test/");
  await page.evaluate(() => {
    const link = document.createElement("a");
    link.href = "https://external.example.test/";
    document.body.append(link);
    link.click();
  });
  expect((await navigation).headers().referer).toBeUndefined();
});

test("cross-site invitation submissions remain forbidden", async ({
  request,
}, testInfo) => {
  test.skip(
    !testInfo.config.metadata.production,
    "CSRF checks are disabled in dev mode",
  );
  const response = await request.post(
    "/invitation-commercialisateur?token=matches",
    {
      headers: { origin: "https://external.example.test" },
      form: { token: "matches", distributorId: "existing" },
    },
  );
  expect(response.status()).toBe(403);
  expect(await response.text()).toContain(
    "Cross-site POST form submissions are forbidden",
  );
});

test("an expired invitation offers no account creation form", async ({
  page,
}) => {
  await page.goto("/invitation-commercialisateur?token=expired");
  await expect(page.getByRole("alert")).toContainText("expirée");
  await expect(page.getByLabel("Mot de passe")).toHaveCount(0);
});
