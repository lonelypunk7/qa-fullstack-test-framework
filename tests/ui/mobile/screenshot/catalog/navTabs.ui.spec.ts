import { expect, test } from "@playwright/test";
import {
  closeMobileBlockingOverlays,
  closeMobileModalLayoutIfPrompted,
  mockMobilePromoPopup,
} from "../../../commands/mobile.commands";
import { openHomePage } from "../../../commands/navigation.commands";
import {
  getProductsMock,
  getSearchSuggestMock,
  getShelfProductSetsHitsMock,
  getStructureMock,
  ObjectMocker,
} from "../../../mocks/sharedMock";

test("@TID-SEARCH-017 Скриншот нижней навигации mobile", async ({ page }) => {
  await mockMobilePromoPopup(page);

  const objectMocker = new ObjectMocker(page);
  await objectMocker.mock("https://www.mvideo.ru/bff/structure*", getStructureMock());
  await objectMocker.mock("https://www.mvideo.ru/bff/products*", getProductsMock());
  await objectMocker.mock(
    "https://www.mvideo.ru/bff/settings/shelf-product-sets?tags=hits*",
    getShelfProductSetsHitsMock(),
  );
  await objectMocker.mock(
    "https://www.mvideo.ru/bff/search/tips-full*",
    getSearchSuggestMock(),
  );

  await openHomePage(page);
  await closeMobileBlockingOverlays(page);
  await closeMobileModalLayoutIfPrompted(page);

  const navTabs = page.locator(".nav-tabs").first();
  await expect(navTabs).toBeVisible();
  await page.waitForTimeout(1000);
  await expect(navTabs).toHaveScreenshot("mobile-nav-tabs.png", {
    animations: "disabled",
  });
});
