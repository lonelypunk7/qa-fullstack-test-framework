import { Locator, Page } from "@playwright/test";

export class CatalogPom {
  readonly firstProductCard: Locator;
  readonly firstProductAddToCartButton: Locator;
  readonly firstProductAddedStateButton: Locator;

  constructor(private readonly page: Page) {
    this.firstProductCard = this.page.locator("mvid-plp-product-card").first();
    this.firstProductAddToCartButton = this.firstProductCard
      .getByRole("button", { name: /В корзину|Добавить в корзину/i })
      .first();
    this.firstProductAddedStateButton = this.firstProductCard
      .getByRole("button", { name: /В корзине|Перейти в корзину|Оформить/i })
      .first();
  }

  getProductCardByName(productName: string): Locator {
    return this.page
      .getByText(productName)
      .locator("xpath=ancestor::mvid-plp-product-card[1]")
      .first();
  }

  getAddToCartButtonByProductName(productName: string): Locator {
    return this.getProductCardByName(productName)
      .locator("button.cart-action-button")
      .first();
  }

  getAddedStateButtonByProductName(productName: string): Locator {
    return this.getProductCardByName(productName)
      .getByRole("button", { name: /В корзине|Перейти в корзину|Оформить/i })
      .first();
  }
}
