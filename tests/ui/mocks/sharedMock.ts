import { Page, Route } from "@playwright/test";
import productsMockResponse from "./fixtures/products.mock.full.json";
import shelfProductSetsHitsMockResponse from "./fixtures/shelf-product-sets.hits.one-item.json";
import structureMockResponse from "./fixtures/structure.mock.full.json";

type MockResponseOptions = {
  status?: number;
  headers?: Record<string, string>;
  delayMs?: number;
};

/**
 * Shared helper for mocking JSON API responses in UI tests.
 * Reuse this for common endpoints across multiple specs.
 */
export async function mockJsonResponse<T>(
  page: Page,
  urlPattern: string | RegExp,
  responseBody: T,
  options: MockResponseOptions = {}
): Promise<void> {
  const { status = 200, headers = {}, delayMs = 0 } = options;

  await page.route(urlPattern, async (route: Route) => {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    await route.fulfill({
      status,
      headers: {
        "content-type": "application/json; charset=utf-8",
        ...headers,
      },
      body: JSON.stringify(responseBody),
    });
  });
}

export class ObjectMocker {
  constructor(private readonly page: Page) {}

  async mock<T>(
    urlPattern: string | RegExp,
    responseBody: T,
    options: MockResponseOptions = {}
  ): Promise<void> {
    await mockJsonResponse(this.page, urlPattern, responseBody, options);
  }
}

export function getStructureMock() {
  return structureMockResponse;
}

export function getProductsMock() {
  return productsMockResponse;
}

export function getFirstMockedProductName() {
  return productsMockResponse.body.items[0].name;
}

export function getShelfProductSetsHitsMock() {
  return shelfProductSetsHitsMockResponse;
}
