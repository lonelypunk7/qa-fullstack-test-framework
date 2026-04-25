import { Locator, Page } from "@playwright/test";

export class SearchPom {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly clearSearch: Locator;

  constructor(page: Page) {
    this.searchInput = page.getByRole("searchbox", { name: "Поиск в М.Видео" });
    const searchRoot = this.searchInput.locator("xpath=ancestor-or-self::mvid-main-search[1]");
    this.searchButton = searchRoot.locator("button.main-search__submit.main-search__submit--desktop");
    this.clearSearch = searchRoot.getByRole("button", { name: "Очистить" });
  }
}
