import { Locator, Page } from "@playwright/test";

export class CatalogPom {
  readonly firstProductCard: Locator;

  constructor(private readonly page: Page) {
    this.firstProductCard = this.page.getByText("Аэрогриль FELFRI FF-AF-035.0");
  }
}
