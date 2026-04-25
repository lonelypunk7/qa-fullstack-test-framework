import { test } from "@playwright/test";

test.describe("Desktop Search", () => {
  test("@TID-SEARCH-001 user can find products by search query", async ({
    page,
  }) => {
    await page.goto("https://www.mvideo.ru/");

    // TODO: implement search flow and assertions
  });
});
