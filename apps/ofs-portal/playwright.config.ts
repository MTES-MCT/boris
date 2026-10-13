import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:5189",
    viewport: { width: 1440, height: 1000 },
  },
  webServer: [
    {
      command: "node tests/e2e/fixtures/backend.mjs",
      url: "http://127.0.0.1:3029/api/portal/auth/me",
    },
    {
      command: "npm run start:dev -- --host 127.0.0.1 --port 5189 --strictPort",
      url: "http://127.0.0.1:5189",
      env: { BACKEND_API_URL: "http://127.0.0.1:3029" },
    },
  ],
});
