import { Page } from "@playwright/test";

export async function acceptCookiesIfPrompted(page: Page): Promise<void> {
  const acceptCookieButton = page.getByRole("button", { name: "Понятно" });
  const isVisible = await acceptCookieButton.isVisible({ timeout: 4000 }).catch(() => false);

  if (isVisible) {
    await acceptCookieButton.click();
  }
}
