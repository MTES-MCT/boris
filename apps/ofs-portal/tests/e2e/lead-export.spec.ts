import { expect, test } from "@playwright/test";

for (const format of ["csv", "xlsx"]) {
  test(`exports ${format} from the same export dialog with active filters`, async ({
    page,
  }) => {
    await page.goto("/ofs/ofs-a/simulations?location=35&contact=Alice");
    await page.waitForFunction(() => "dsfr" in window);
    await expect(
      page.getByRole("button", { name: "Exporter", exact: true }),
    ).toHaveCount(1);
    await page.getByRole("button", { name: "Exporter", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Exporter des lignes" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("Format du fichier")).toHaveValue("csv");
    await dialog.getByLabel("Format du fichier").selectOption(format);
    await dialog.getByLabel("Date de début").fill("2026-01-01");
    await dialog.getByLabel("Date de fin").fill("2026-11-25");
    if (format === "xlsx") {
      await page.screenshot({
        path: test.info().outputPath("excel-export-dialog.png"),
      });
    }
    let exportUrl: URL | undefined;
    await page.route("**/simulations/export?**", async (route) => {
      exportUrl = new URL(route.request().url());
      await route.fulfill({
        headers: {
          "content-type": "application/octet-stream",
          "content-disposition": `attachment; filename="simulations.${format}"`,
        },
        body: "export fixture",
      });
    });
    const downloadPromise = page.waitForEvent("download");
    await dialog
      .getByRole("button", {
        name:
          format === "xlsx"
            ? "Télécharger le fichier Excel"
            : "Télécharger le CSV",
      })
      .click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(`simulations.${format}`);
    expect(Object.fromEntries(exportUrl!.searchParams)).toEqual({
      format,
      location: "35",
      contact: "Alice",
      startDate: "2026-01-01",
      endDate: "2026-11-25",
    });
    await expect(dialog).not.toBeVisible();
  });
}
