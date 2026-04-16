import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("home loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Introducing the Deadlock Collegiate Series/i })).toBeVisible();
  });

  test("news index loads", async ({ page }) => {
    await page.goto("/news");
    await expect(page.getByRole("heading", { name: /news and insights/i })).toBeVisible();
  });

  test("news article loads", async ({ page }) => {
    await page.goto("/news/what-is-deadlock");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/deadlock/i);
  });

  test("404 page", async ({ page }) => {
    await page.goto("/this-route-should-not-exist-12345");
    await expect(page.getByRole("heading", { name: /page not found/i })).toBeVisible();
  });

  test("privacy page", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: /^Privacy$/i })).toBeVisible();
  });
});
