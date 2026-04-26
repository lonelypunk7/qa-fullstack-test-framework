import { Locator } from "@playwright/test";

export class SuggestPom {
  readonly root: Locator;
  readonly items: Locator;
  readonly clearHistoryButton: Locator;
  readonly firstSuggestItem: Locator;

  constructor(searchRoot: Locator) {
    this.root = searchRoot.locator(".main-search__dropdown");
    this.items = this.root.locator(".main-search__suggestion-item");
    this.clearHistoryButton = this.root.getByRole("button", { name: "Очистить" });
    this.firstSuggestItem = this.root.getByRole("button").nth(0);
  }

  getItemByText(text: string): Locator {
    return this.root.getByRole("button", { name: text }).first();
  }
}
