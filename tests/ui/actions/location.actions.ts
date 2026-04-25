import { Page } from "@playwright/test";

export async function confirmMoscowCityIfPrompted(page: Page): Promise<void> {
  const confirmCityButton = page.getByRole("button", { name: "Все верно" });
  const isVisible = await confirmCityButton.isVisible({ timeout: 4000 }).catch(() => false);

  if (isVisible) {
    await confirmCityButton.click();
  }
}
