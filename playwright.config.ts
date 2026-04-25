import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
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
      name: "api",
      testMatch: /.*\.api\.spec\.ts/,
    },
  ],
});
