import { expect, test } from "@playwright/test";

test("records a weight-only measurement on this device", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add a pet" }).first().click();
  await page.getByLabel("Name").fill("Moss");
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "View journal" }).click();
  await page.getByRole("button", { name: "Add measurement" }).click();
  await page.getByLabel("Weight", { exact: true }).fill("420");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("420 g").first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("Moss")).toBeVisible();
});
