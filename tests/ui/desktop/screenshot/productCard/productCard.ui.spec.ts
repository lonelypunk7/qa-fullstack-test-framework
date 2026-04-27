import { expect, test } from "@playwright/test";
import { acceptCookiesIfPrompted } from "../../../actions/cookie.actions";
import { confirmMoscowCityIfPrompted } from "../../../actions/location.actions";
import { prepareHomePage } from "../../../commands/navigation.commands";
import {
  getProductsMock,
  getSearchSuggestMock,
  getShelfProductSetsHitsMock,
  getStructureMock,
  ObjectMocker,
} from "../../../mocks/sharedMock";
import { CatalogPom } from "../../../pom/desktop/search/сatalog/catalog.pom";

test("@TID-SEARCH-021 Скриншот карточки товара", async ({ page }) => {
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

  await prepareHomePage(page);
  await confirmMoscowCityIfPrompted(page);
  await acceptCookiesIfPrompted(page);
  await confirmMoscowCityIfPrompted(page);
  await page
    .locator("mvid-location-confirm .location-interactive")
    .waitFor({ state: "hidden", timeout: 3000 })
    .catch(() => {});
  await page
    .locator(".modal-wrapper--bottom-popup")
    .waitFor({ state: "hidden", timeout: 3000 })
    .catch(() => {});

  const catalogPom = new CatalogPom(page);
  const firstMockedProduct = catalogPom.firstProductCard;

  await expect(firstMockedProduct).toBeVisible();
  await page.waitForTimeout(1000);
  await expect(firstMockedProduct).toHaveScreenshot("desktop-product-card.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.02,
  });
});
