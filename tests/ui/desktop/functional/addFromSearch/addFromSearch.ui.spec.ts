import { expect, test } from "@playwright/test";
import { acceptCookiesIfPrompted } from "../../../actions/cookie.actions";
import { confirmMoscowCityIfPrompted } from "../../../actions/location.actions";
import { prepareHomePage } from "../../../commands/navigation.commands";
import {
  getProductsMock,
  getSearchSuggestMock,
  getShelfProductSetsHitsMock,
  getStructureMock,
  mockCartBeforeAndAfterAdd,
  ObjectMocker,
} from "../../../mocks/sharedMock";
import { CatalogPom } from "../../../pom/desktop/search/сatalog/catalog.pom";

test("@TID-SEARCH-022 Добавление товара в корзину из каталога", async ({
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
  await mockCartBeforeAndAfterAdd(page, "https://www.mvideo.ru/bff/cart*");

  await prepareHomePage(page);
  await confirmMoscowCityIfPrompted(page);
  await acceptCookiesIfPrompted(page);

  const catalogPom = new CatalogPom(page);
  const productCard = catalogPom.firstProductCard;
  const addToCartButton = catalogPom.firstProductAddToCartButton;
  const addedStateButton = catalogPom.firstProductAddedStateButton;

  await test.step("Товар отображается в каталоге", async () => {
    await expect(productCard).toBeVisible();
    await expect(addToCartButton).toBeVisible();
    await expect(addedStateButton).not.toBeVisible();
  });

  await test.step("Нажимаем кнопку добавления и проверяем новый текст кнопки", async () => {
    await addToCartButton.click();

    await expect(addToCartButton).not.toBeVisible();
    await expect(addedStateButton).toBeVisible();
  });
});
