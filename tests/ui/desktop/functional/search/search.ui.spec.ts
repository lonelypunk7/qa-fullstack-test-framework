import { test } from "@playwright/test";
import { confirmMoscowCityIfPrompted } from "../../../actions/location.actions";
import { openHomePage } from "../../../commands/navigation.commands";
import { SearchPom } from "../../../pom/search/search.pom";

let searchPom: SearchPom;

test.beforeEach(async ({ page }) => {
  searchPom = new SearchPom(page);
  await openHomePage(page);
  await confirmMoscowCityIfPrompted(page);
});

test("@TID-SEARCH-001 Поиск на Поиск товара на главной странице", async () => {
  await searchPom.searchInput.click();
  await searchPom.searchInput.fill("телефон");
  await searchPom.searchButton.click();

  // TODO: implement search flow and assertions
});
