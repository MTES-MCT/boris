import { expect, test } from "@playwright/test";

test("admin can switch OFS after filtering the selector", async ({ page }) => {
  await page.goto("/ofs/ofs-a/simulations");
  await page.waitForFunction(() => "dsfr" in window);
  const switcher = page.getByLabel("Sélectionner un OFS", { exact: true });
  await expect(switcher).toHaveText("OFS Alpha");
  await switcher.click();
  await page.getByRole("searchbox", { name: "Rechercher un OFS" }).fill("Beta");
  await page.getByRole("link", { name: "OFS Beta", exact: true }).click();

  await expect(page).toHaveURL("/ofs/ofs-b/simulations");
  await expect(switcher).toHaveText("OFS Beta");
  await expect(
    page
      .getByRole("navigation", { name: "Navigation principale OFS" })
      .getByRole("link", { name: "Profil", exact: true }),
  ).toHaveAttribute("href", "/ofs/ofs-b/profil");
  await expect(page.locator("details")).not.toHaveAttribute("open", "");

  await switcher.click();
  await expect(
    page.getByRole("searchbox", { name: "Rechercher un OFS" }),
  ).toHaveValue("");
  await page.getByRole("link", { name: "OFS Alpha", exact: true }).click();
  await expect(page).toHaveURL("/ofs/ofs-a/simulations");
  await expect(switcher).toHaveText("OFS Alpha");
});
