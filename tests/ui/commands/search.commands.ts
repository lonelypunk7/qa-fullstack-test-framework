import { expect, Locator } from "@playwright/test";

type SearchPomLike = {
  searchInput: Locator;
  suggest: {
    root: Locator;
  };
};

export async function openSearchSuggestWithQuery(
  searchPom: SearchPomLike,
  query: string,
): Promise<void> {
  await expect(searchPom.searchInput).toBeInViewport();
  await searchPom.searchInput.click();
  await expect(searchPom.searchInput).toHaveValue("");
  await searchPom.searchInput.fill(query);
  await expect(searchPom.searchInput).toHaveValue(query);
  await expect(searchPom.suggest.root).toBeVisible();
}
