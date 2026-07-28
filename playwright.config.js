import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:8791",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --port 8791",
    url: "http://127.0.0.1:8791/api/health",
    reuseExistingServer: false,
    timeout: 30_000,
  },
  projects: [
    {
      name: "phone",
      use: {
        viewport: {
          height: 844,
          width: 390,
        },
      },
    },
    {
      name: "tablet",
      use: {
        viewport: {
          height: 1024,
          width: 768,
        },
      },
    },
    {
      name: "desktop",
      use: {
        viewport: {
          height: 1000,
          width: 1440,
        },
      },
    },
  ],
});

