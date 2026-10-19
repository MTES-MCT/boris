import { expect, test } from "@playwright/test";

test("contacts group locations while preserving separate simulations and recipients", async ({
  page,
}) => {
  await page.goto("/ofs/ofs-a/simulations");
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await expect(page.locator("caption")).toHaveText("2 contact(s)");
  await expect(page.getByRole("cell", { name: /Alice Martin/ })).toHaveCount(2);
  await expect(page.getByText(/1 nouveau\(x\) contact/)).toBeVisible();
  const first = page.locator("tbody tr").first();
  await expect(first.locator("summary")).toContainText("Rennes, Saint-Malo");
  await expect(first.locator("summary")).toContainText("3 autre(s)");
  await expect(first.getByText("Code INSEE : 35236")).not.toBeVisible();
  await first.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(first.locator(".contact-locations__list > li")).toHaveCount(5);
  await expect(
    first.locator(".contact-locations__list > li").last(),
  ).toContainText("35236");
  await expect(
    first.locator(".contact-locations__list > li").first(),
  ).toContainText("Habitat Rennes");
  await expect(
    first.locator(".contact-locations__list > li").nth(1),
  ).toContainText("Habitat Côte");
  await first.getByLabel("Action", { exact: true }).selectOption("RECONTACTED");
  await expect(first.getByLabel("Action", { exact: true })).toBeEnabled();
  await expect(first.getByLabel("Action", { exact: true })).toHaveValue(
    "RECONTACTED",
  );
  await page.screenshot({
    path: test.info().outputPath("grouped-contacts.png"),
    fullPage: true,
  });
});

test("location details open on touch-sized screens, including missing cities", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ofs/ofs-a/simulations");
  const last = page.locator("tbody tr").last();
  await last.locator("summary").click();
  await expect(last.locator(".contact-locations__list")).toContainText(
    "Département 35",
  );
  await expect(last.locator(".contact-locations__list")).toContainText(
    "Aucun commercialisateur",
  );
});
