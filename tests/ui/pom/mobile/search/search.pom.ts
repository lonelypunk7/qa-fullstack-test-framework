import { Locator, Page } from "@playwright/test";
import { SuggestPom } from "./suggest/suggest.pom";

export class SearchPom {
  readonly searchRoot: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly clearSearch: Locator;
  readonly sortPopularButton: Locator;
  readonly sortBottomSheetTitle: Locator;
  readonly sortPopularRadio: Locator;
  readonly suggest: SuggestPom;

  constructor(private readonly page: Page) {
    this.searchInput = this.page.getByRole("searchbox", { name: "Поиск в М.Видео" });
    this.searchRoot = this.searchInput.locator("xpath=ancestor-or-self::mvid-main-search[1]");
    this.searchButton = this.searchRoot.locator("button.main-search__submit.main-search__submit--desktop");
    this.clearSearch = this.searchRoot.locator("button.main-search__clear");
    this.sortPopularButton = this.page.getByRole("button", { name: "Популярные" });
    this.sortBottomSheetTitle = this.page.getByRole("heading", { name: "Сортировка" });
    this.sortPopularRadio = this.page.getByRole("radio", { name: "Популярные" });
    this.suggest = new SuggestPom(this.searchRoot);
  }

  getProductCardByName(productName: string): Locator {
    return this.page.getByText(productName).first();
  }
}
