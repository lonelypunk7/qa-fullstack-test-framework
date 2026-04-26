import { expect, test } from "@playwright/test";
import { prepareHomePage } from "../../../../commands/navigation.commands";
import {
  closeMobileBlockingOverlays,
  closeMobileModalLayoutIfPrompted,
} from "../../../../commands/mobile.commands";
import { openSearchSuggestWithQuery } from "../../../../commands/search.commands";
import {
  getProductsMock,
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
  await prepareHomePage(page);
  await closeMobileBlockingOverlays(page);
  await closeMobileModalLayoutIfPrompted(page);
});

test("@TID-SEARCH-002 Появление и выбор саджеста при клике на поисквую строку", async ({
  page,
}) => {
  const searchInput = searchPom.searchInput;
  const suggestRoot = searchPom.suggest.root;
  const firstSuggestItem = searchPom.suggest.firstSuggestItem;

  await test.step("Тап на поисковую строку", async () => {
    await expect(searchInput).toBeInViewport();
    await expect(suggestRoot).not.toBeVisible();

    await searchInput.click();

    await expect(searchInput).toHaveValue("");
    await expect(suggestRoot).toBeVisible();
    await expect(firstSuggestItem).toBeVisible();
  });

  await test.step("Тап 1 саджест", async () => {
    await firstSuggestItem.click();

    await page.waitForURL("**/search**");
    await expect(searchInput).toHaveValue("телефон");
    await expect(suggestRoot).not.toBeVisible();
    await expect(firstSuggestItem).not.toBeVisible();
  });
});

test("@TID-SEARCH-003 Тап на саджест при введенном поисковом запросе на главной странице", async ({
  page,
}) => {
  const suggestRoot = searchPom.suggest.root;
  const firstSuggestItem = searchPom.suggest.firstSuggestItem;
  const searchInput = searchPom.searchInput;

  await test.step("Тап на поисковую строку", async () => {
    await expect(suggestRoot).not.toBeVisible();

    await openSearchSuggestWithQuery(searchPom, "карманный");

    await expect(suggestRoot).toBeVisible();
    await expect(firstSuggestItem).toBeVisible();
  });

  await test.step("Тап на саджест", async () => {
    await firstSuggestItem.click();

    await page.waitForURL("**/search**");
    await expect(searchInput).toHaveValue("телефон");
    await expect(suggestRoot).not.toBeVisible();
    await expect(firstSuggestItem).not.toBeVisible();
  });
});
