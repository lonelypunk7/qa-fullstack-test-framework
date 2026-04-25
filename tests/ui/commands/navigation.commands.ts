import { expect, Page } from "@playwright/test";

export async function openHomePage(page: Page): Promise<void> {
  await page.goto("/");
  await expect(page).toHaveURL(/https:\/\/www\.mvideo\.ru\/?/);
}
