import { expect, test } from "@playwright/test";
import { acceptCookiesIfPrompted } from "../../../actions/cookie.actions";
import { confirmMoscowCityIfPrompted } from "../../../actions/location.actions";
import { openHomePage } from "../../../commands/navigation.commands";
import {
  getFirstMockedProductName,
  getProductsMock,
  getShelfProductSetsHitsMock,
  getStructureMock,
  ObjectMocker,
} from "../../../mocks/sharedMock";
import { SearchPom } from "../../../pom/search/search.pom";

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
  await openHomePage(page);
  await acceptCookiesIfPrompted(page);
  await confirmMoscowCityIfPrompted(page);
});

test("@TID-SEARCH-001 Поиск на Поиск товара на главной странице", async ({
  page,
}) => {
  const searchInput = searchPom.searchInput;
  const searchButton = searchPom.searchButton;
  const firstMockedProductName = getFirstMockedProductName();
  const firstMockedProduct = searchPom.getProductCardByName(firstMockedProductName);

  await test.step("Ввод поискового запроса на главной странице", async () => {
    await expect(searchInput).toBeInViewport();

    await searchInput.click();

    await expect(searchInput).toHaveValue("");

    await searchInput.fill("телефон");

    await expect(searchInput).toHaveValue("телефон");

    await searchButton.click();
    await page.waitForURL("**/search**");
  });
  await test.step("Переход в поисковую выдачу по введенному запросу", async () => {
    await expect(searchInput).toHaveValue("телефон");
    await expect(firstMockedProduct).toBeVisible();
    await expect(firstMockedProduct).toContainText(firstMockedProductName);
  });
});
