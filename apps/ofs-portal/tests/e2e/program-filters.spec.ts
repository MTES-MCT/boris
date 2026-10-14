import { expect, test } from "@playwright/test";

test("programme filters combine, survive reload and reset", async ({
  page,
}) => {
  await page.goto("/ofs/ofs-a/programmes");
  await expect(page.getByRole("status")).toContainText("3 programme(s)");
  await page.getByRole("searchbox", { name: "Code postal" }).fill("35");
  await page.getByRole("searchbox", { name: "Ville", exact: true }).fill("REN");
  await page
    .getByRole("searchbox", { name: "Commercialisateur", exact: true })
    .fill("cooperative");
  await page.getByRole("button", { name: "Filtrer", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("1 programme(s)");
  await expect(page.getByRole("cell", { name: /^Les Jardins/ })).toBeVisible();
  await expect(
    page.getByRole("cell", { name: /Les Terrasses|Les Rives/ }),
  ).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("searchbox", { name: "Commercialisateur", exact: true }),
  ).toHaveValue("cooperative");
  await page.getByRole("link", { name: "Effacer les filtres" }).click();
  await expect(page).toHaveURL("/ofs/ofs-a/programmes");
  await expect(page.getByRole("status")).toContainText("3 programme(s)");
  await page.screenshot({
    path: test.info().outputPath("program-filters-desktop.png"),
    fullPage: true,
  });
});

test("unmatched programme filters show a useful empty state on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ofs/ofs-a/programmes?city=Inconnue");
  await expect(
    page.getByRole("heading", {
      name: "Aucun programme ne correspond à vos filtres",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Ajouter un programme" }),
  ).toBeVisible();
  await page.screenshot({
    path: test.info().outputPath("program-filters-mobile.png"),
    fullPage: true,
  });
  await page.getByRole("link", { name: "Effacer les filtres" }).click();
  await expect(page.getByRole("status")).toContainText("3 programme(s)");
});
