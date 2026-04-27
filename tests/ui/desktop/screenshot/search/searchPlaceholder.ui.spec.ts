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
import { SearchPom } from "../../../pom/desktop/search/search.pom";

test("@TID-SEARCH-018 Скриншот плейсхолдера поискового инпута desktop", async ({
  page,
}) => {
  const objectMocker = new ObjectMocker(page);
  await objectMocker.mock(
    "https://www.mvideo.ru/bff/structure*",
    getStructureMock(),
  );
  await objectMocker.mock(
    "https://www.mvideo.ru/bff/products*",
    getProductsMock(),
  );
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

  const searchPom = new SearchPom(page);
  const searchInput = searchPom.searchInput;

  await expect(searchInput).toBeVisible();
  await expect(searchInput).toHaveAttribute("placeholder", "Поиск в М.Видео");

  await page.waitForTimeout(1000);

  await expect(searchInput).toHaveScreenshot(
    "desktop-search-input-placeholder.png",
    {
      animations: "disabled",
    },
  );
});
