import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

// Exercise the production-only CSRF checks, which Vite's dev server skips.
export default defineConfig({
  ...config,
  testMatch: "distributor-invitations.spec.ts",
  workers: 1,
  metadata: { production: true },
  webServer: [
    {
      command: "node tests/e2e/fixtures/backend.mjs",
      url: "http://127.0.0.1:3029/api/portal/auth/me",
    },
    {
      command:
        "npm run build && npm run preview -- --host 127.0.0.1 --port 5189 --strictPort",
      url: "http://127.0.0.1:5189",
      env: { BACKEND_API_URL: "http://127.0.0.1:3029" },
    },
  ],
});
