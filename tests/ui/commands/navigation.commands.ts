import { expect, Page } from "@playwright/test";
import { acceptCookiesIfPrompted } from "../actions/cookie.actions";
import { confirmMoscowCityIfPrompted } from "../actions/location.actions";

export async function openHomePage(page: Page): Promise<void> {
  await page.goto("/");
  await expect(page).toHaveURL(/https:\/\/www\.mvideo\.ru\/?/);
}

export async function openSearchPage(page: Page): Promise<void> {
  await page.goto("/search");
  await expect(page).toHaveURL(/\/search(\?.*)?$/);
}

export async function prepareHomePage(page: Page): Promise<void> {
  await openHomePage(page);
  await acceptCookiesIfPrompted(page);
  await confirmMoscowCityIfPrompted(page);
}
