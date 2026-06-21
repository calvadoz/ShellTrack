import { expect, test } from "@playwright/test";

test("shows the ShellTrack foundation", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/ShellTrack/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Local by design")).toBeVisible();
});
