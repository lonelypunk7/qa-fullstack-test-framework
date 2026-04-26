import { expect, test } from "@playwright/test";
import { acceptCookiesIfPrompted } from "../../../../actions/cookie.actions";
import { confirmMoscowCityIfPrompted } from "../../../../actions/location.actions";
import { openHomePage } from "../../../../commands/navigation.commands";
import { openSearchSuggestWithQuery } from "../../../../commands/search.commands";
import {
  getFirstMockedProductName,
  getProductsMock,
  getSearchSuggestMock,
  getShelfProductSetsHitsMock,
  getStructureMock,
  ObjectMocker,
} from "../../../../mocks/sharedMock";
import { SearchPom } from "../../../../pom/desktop/search/search.pom";

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
  await openHomePage(page);
  await acceptCookiesIfPrompted(page);
  await confirmMoscowCityIfPrompted(page);
});

test("@TID-SEARCH-008 Поиск на Поиск товара на главной странице", async ({
  page,
}) => {
  const searchInput = searchPom.searchInput;
  const searchButton = searchPom.searchButton;
  const firstMockedProductName = getFirstMockedProductName();
  const firstMockedProduct = searchPom.getProductCardByName(
    firstMockedProductName,
  );

  await test.step("Ввод поискового запроса на главной странице", async () => {
    await expect(searchInput).toBeInViewport();

    await searchInput.click();
    await expect(searchInput).toHaveValue("");

    await searchInput.fill("телефон");

    await expect(searchInput).toHaveValue("телефон");
  });

  await test.step("Переход в поисковую выдачу по введенному запросу", async () => {
    await searchButton.click();
    await page.waitForURL("**/search**");

    await expect(searchInput).toHaveValue("телефон");
    await expect(firstMockedProduct).toBeVisible();
    await expect(firstMockedProduct).toContainText(firstMockedProductName);
  });
});

test("@TID-SEARCH-009 Удаление запроса по кнопке очистки в поисковой строке", async () => {
  const searchInput = searchPom.searchInput;
  const clearSearchButton = searchPom.clearSearch;

  await test.step("Ввод поискового запроса", async () => {
    await searchInput.click();
    await searchInput.fill("телефон");

    await expect(searchInput).toHaveValue("телефон");
    await expect(clearSearchButton).toBeVisible();
  });

  await test.step("Очистка поискового запроса по кнопке очистки", async () => {
    await clearSearchButton.click();

    await expect(searchInput).toHaveValue("");
    await expect(clearSearchButton).not.toBeVisible();
  });
});

test("@TID-SEARCH-010 Посимвольное удаление запроса системной кнопкой", async () => {
  const searchInput = searchPom.searchInput;

  await test.step("Ввод поискового запроса", async () => {
    await searchInput.click();
    await openSearchSuggestWithQuery(searchPom, "карманный");

    await expect(searchInput).toHaveValue("карманный");
  });

  await test.step("Удаление одного символа системной кнопкой", async () => {
    await searchInput.press("Backspace");

    await expect(searchInput).toHaveValue("карманны");
  });
});
