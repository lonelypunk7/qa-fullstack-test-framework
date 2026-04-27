import { expect, test } from "@playwright/test";
import {
  closeMobileBlockingOverlays,
  closeMobileModalLayoutIfPrompted,
  mockMobilePromoPopup,
} from "../../../commands/mobile.commands";
import { openHomePage } from "../../../commands/navigation.commands";
import { openSearchSuggestWithQuery } from "../../../commands/search.commands";
import {
  getProductsMock,
  getSearchSuggestMock,
  getShelfProductSetsHitsMock,
  getStructureMock,
  ObjectMocker,
} from "../../../mocks/sharedMock";
import { SearchPom } from "../../../pom/mobile/search/search.pom";

test("@TID-SEARCH-016 Скриншот блока саджестов", async ({ page }) => {
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

  const searchPom = new SearchPom(page);
  await openSearchSuggestWithQuery(searchPom, "карманный");

  const suggestRoot = searchPom.suggest.root;
  await expect(suggestRoot).toBeVisible();
  await page.waitForTimeout(1000);
  await expect(suggestRoot).toHaveScreenshot("search-suggest-block.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.02,
  });
});
