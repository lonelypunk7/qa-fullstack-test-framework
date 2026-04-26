import { expect, test } from "@playwright/test";
import { closeMobileBlockingOverlays } from "../../../../commands/mobile.commands";
import { openSearchPage } from "../../../../commands/navigation.commands";
import { openSearchSuggestWithQuery } from "../../../../commands/search.commands";
import {
  getFirstRenamedMockedProductName,
  getProductsMock,
  getProductsMockWithRenamedSingleItem,
  getSearchSuggestMock,
  getShelfProductSetsHitsMock,
  getStructureMock,
  ObjectMocker,
} from "../../../../mocks/sharedMock";
import { SearchPom } from "../../../../pom/mobile/search/search.pom";

let searchPom: SearchPom;

test.beforeEach(async ({ page }) => {
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

test("@TID-SEARCH-004 Тап на саджест при введенном поисковом запросе на странице поиска", async ({
  page,
}) => {
  const objectMocker = new ObjectMocker(page);
  const suggestRoot = searchPom.suggest.root;
  const firstSuggestItem = searchPom.suggest.firstSuggestItem;
  const searchInput = searchPom.searchInput;
  const firstMockedProductName = getFirstRenamedMockedProductName();
  const firstMockedProduct = searchPom.getProductCardByName(
    firstMockedProductName,
  );

  await test.step("Тап на поисковую строку", async () => {
    await expect(suggestRoot).not.toBeVisible();

    await openSearchSuggestWithQuery(searchPom, "карманный");

    await expect(suggestRoot).toBeVisible();
    await expect(firstSuggestItem).toBeVisible();
  });

  await test.step("Тап на саджест", async () => {
    await objectMocker.mock(
      "https://www.mvideo.ru/bff/products*",
      getProductsMockWithRenamedSingleItem(),
    );
    await firstSuggestItem.click();

    await page.waitForURL("**/search**");
    await expect(searchInput).toHaveValue("телефон");
    await expect(firstMockedProduct).toBeVisible();
    await expect(firstMockedProduct).toContainText(firstMockedProductName);
    await expect(suggestRoot).not.toBeVisible();
  });
});

test("@TID-SEARCH-005 Ввод поискового запроса в поисковую строку на странице поиска", async ({
  page,
}) => {
  const objectMocker = new ObjectMocker(page);
  const suggestRoot = searchPom.suggest.root;
  const searchInput = searchPom.searchInput;
  const firstMockedProductName = getFirstRenamedMockedProductName();
  const firstMockedProduct = searchPom.getProductCardByName(
    firstMockedProductName,
  );

  await test.step("Ввод поискового запроса в поисковую строку", async () => {
    await expect(searchInput).toBeInViewport();
    await searchInput.click();
    await searchInput.fill("карманный телефон");
    await expect(searchInput).toHaveValue("карманный телефон");
  });

  await test.step("Обновление выдачи через ввод поискового запроса", async () => {
    await objectMocker.mock(
      "https://www.mvideo.ru/bff/products*",
      getProductsMockWithRenamedSingleItem(),
    );
    await searchInput.press("Enter");

    await page.waitForURL("**/search**");
    await expect(searchInput).toHaveValue("карманный телефон");
    await expect(firstMockedProduct).toBeVisible();
    await expect(firstMockedProduct).toContainText(firstMockedProductName);
    await expect(suggestRoot).not.toBeVisible();
  });
});
