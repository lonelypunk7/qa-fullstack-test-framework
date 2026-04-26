import { Locator, Page } from "@playwright/test";

export class SearchPom {
  readonly searchRoot: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly clearSearch: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = this.page.getByRole("searchbox", { name: "Поиск в М.Видео" });
    this.searchRoot = this.searchInput.locator("xpath=ancestor-or-self::mvid-main-search[1]");
    this.searchButton = this.searchRoot.locator("button.main-search__submit.main-search__submit--desktop");
    this.clearSearch = this.searchRoot.getByRole("button", { name: "Очистить" });
  }

  getProductCardByName(productName: string): Locator {
    return this.page.getByText(productName).first();
  }
}
