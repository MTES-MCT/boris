import { expect, test } from "@playwright/test";

test("create, reveal once, refresh and revoke an API key", async ({
  page,
  request,
}) => {
  await request.post("http://127.0.0.1:3029/test/reset");
  const response = await page.goto("/acces-api");
  expect(response?.headers()["cache-control"]).toContain("no-store");
  await expect(
    page.getByText("Aucune clé API.", { exact: false }),
  ).toBeVisible();
  await page.getByLabel("Nom de la clé").fill("CRM principal");
  await page.getByRole("button", { name: "Créer une clé API" }).click();
  await expect(page.getByLabel("Clé API : CRM principal")).toHaveValue(
    /^boris_live_[a-f0-9]{64}$/,
  );
  await expect(
    page.getByRole("cell", { name: "CRM principal", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "Jamais utilisée" }),
  ).toBeVisible();
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByLabel("Clé API : CRM principal")).toHaveCount(0);
  await expect(
    page.getByRole("cell", { name: "CRM principal", exact: true }),
  ).toBeVisible();
  page.once("dialog", (dialog) => dialog.dismiss());
  await page
    .getByRole("button", { name: "Supprimer la clé CRM principal" })
    .click();
  await expect(
    page.getByRole("cell", { name: "CRM principal", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "/private/tmp/boris-api-keys.png",
    fullPage: true,
  });
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Supprimer la clé CRM principal" })
    .click();
  await expect(page.getByRole("status")).toContainText("Clé supprimée");
  await expect(
    page.getByRole("cell", { name: "CRM principal", exact: true }),
  ).toHaveCount(0);
});
