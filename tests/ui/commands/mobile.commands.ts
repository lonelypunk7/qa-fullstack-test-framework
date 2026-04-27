import { Page } from "@playwright/test";

export async function mockMobilePromoPopup(page: Page): Promise<void> {
  // Disable smart banner chunk that renders install-app promo popup.
  await page.route("**/smart-banner.component-*.js", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript; charset=utf-8",
      body: "export {};",
    });
  });

  // Disable adriver promo assets often used by mobile banner placements.
  await page.route("**/content.adriver.ru/**", async (route) => {
    await route.abort();
  });
}

export async function closeMobileAppPromoIfPrompted(page: Page): Promise<void> {
  const closePromoButton = page
    .locator("button.insider-banner-close-button, button[aria-label='Закрыть']")
    .first();

  const isVisible = await closePromoButton
    .isVisible({ timeout: 3000 })
    .catch(() => false);

  if (isVisible) {
    await closePromoButton.click();
  }
}

export async function closeMobileBlockingOverlays(page: Page): Promise<void> {
  await page.waitForTimeout(400);

  for (let i = 0; i < 6; i += 1) {
    const confirmCityButton = page.locator("mvid-location-confirm .location-confirm").first();
    if (await confirmCityButton.isVisible({ timeout: 1200 }).catch(() => false)) {
      await confirmCityButton.click({ force: true });
      await page.waitForTimeout(200);
      continue;
    }

    const cookieBottomButton = page
      .locator(".modal-wrapper--bottom-popup button", { hasText: "Понятно" })
      .first();
    if (await cookieBottomButton.isVisible({ timeout: 1200 }).catch(() => false)) {
      await cookieBottomButton.click();
      await page.waitForTimeout(200);
      continue;
    }

    const closePromoButton = page
      .locator("button.insider-banner-close-button, button[aria-label='Закрыть']")
      .first();
    if (await closePromoButton.isVisible({ timeout: 1200 }).catch(() => false)) {
      await closePromoButton.click();
      await page.waitForTimeout(200);
      continue;
    }

    const closeCityIcon = page.locator("mvid-location-confirm .location-close-icon").first();
    if (await closeCityIcon.isVisible({ timeout: 1200 }).catch(() => false)) {
      await closeCityIcon.click({ force: true });
      await page.waitForTimeout(200);
      continue;
    }

    break;
  }
}

export async function closeMobileModalLayoutIfPrompted(page: Page): Promise<void> {
  const closeModalButton = page.locator(".modal-layout__close").first();
  const isVisible = await closeModalButton
    .isVisible({ timeout: 2500 })
    .catch(() => false);

  if (isVisible) {
    await closeModalButton.click({ force: true });
  }
}
