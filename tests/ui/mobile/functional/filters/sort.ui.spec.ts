import { expect, test } from "@playwright/test";
import {
  closeMobileBlockingOverlays,
  mockMobilePromoPopup,
} from "../../../commands/mobile.commands";
import { openSearchPage } from "../../../commands/navigation.commands";
import {
  getProductsMock,
  getSearchSuggestMock,
  getShelfProductSetsHitsMock,
  getStructureMock,
  ObjectMocker,
} from "../../../mocks/sharedMock";
import { SearchPom } from "../../../pom/mobile/search/search.pom";

let searchPom: SearchPom;

test.beforeEach(async ({ page }) => {
  await mockMobilePromoPopup(page);
  searchPom = new SearchPom(page);
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

  await openSearchPage(page);
  await closeMobileBlockingOverlays(page);
});

test("@TID-SEARCH-FILTERS-001 Открытие сортировки и проверка выбранного значения по умолчанию", async () => {
  const sortPopularButton = searchPom.sortPopularButton;
  const sortBottomSheetTitle = searchPom.sortBottomSheetTitle;
  const sortPopularRadio = searchPom.sortPopularRadio;

  await test.step("Тап на сортировку", async () => {
    await expect(sortPopularButton).toBeVisible();
    await sortPopularButton.click();
  });

  await test.step("Проверка bottom sheet сортировки и выбранного первого фильтра", async () => {
    await expect(sortBottomSheetTitle).toBeVisible();
    await expect(sortPopularRadio).toBeChecked();
  });
});
