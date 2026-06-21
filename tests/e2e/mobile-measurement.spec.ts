import { expect, test } from "@playwright/test";

test("keeps the measurement form usable at a narrow mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto("/");

  const jakeCard = page.getByRole("article").filter({ hasText: "Jake" });
  await expect(jakeCard).toBeVisible();
  await jakeCard.getByRole("button", { name: "View journal" }).click();
  await page.getByRole("button", { name: "Add measurement" }).click();

  const measurementScreen = page.getByRole("dialog", {
    name: "Add measurement",
  });
  await expect(measurementScreen).toBeVisible();
  await expect(
    measurementScreen.getByRole("button", { name: "Save" }),
  ).toBeVisible();
  await expect(
    measurementScreen.locator('button[aria-label="Cancel"]'),
  ).toBeVisible();

  const layout = await page.evaluate(() => {
    const screenElement = document.querySelector('[role="dialog"]');
    const bounds = screenElement?.getBoundingClientRect();
    const dateBounds = document
      .querySelector<HTMLInputElement>('input[type="date"]')
      ?.getBoundingClientRect();
    return {
      viewportWidth: window.innerWidth,
      pageWidth: document.documentElement.scrollWidth,
      dialogLeft: bounds?.left,
      dialogRight: bounds?.right,
      dateLeft: dateBounds?.left,
      dateRight: dateBounds?.right,
    };
  });

  expect(layout.pageWidth).toBe(layout.viewportWidth);
  expect(layout.dialogLeft).toBeGreaterThanOrEqual(0);
  expect(layout.dialogRight).toBeLessThanOrEqual(layout.viewportWidth);
  expect(layout.dateLeft).toBeGreaterThan(layout.dialogLeft ?? 0);
  expect(layout.dateRight).toBeLessThan(layout.dialogRight ?? 0);
});
