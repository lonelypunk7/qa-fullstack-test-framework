import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.UI_BASE_URL ?? "https://www.mvideo.ru";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "ui-chromium",
      testMatch: /.*\.ui\.spec\.ts/,
      use: {
        browserName: "chromium",
        headless: true,
      },
    },
    {
      name: "ui-mobile-chromium",
      testMatch: /.*\.ui\.spec\.ts/,
      use: {
        ...devices["iPhone 12 Pro"],
        browserName: "chromium",
        headless: true,
      },
    },
    {
      name: "api",
      testMatch: /.*\.api\.spec\.ts/,
    },
  ],
});
