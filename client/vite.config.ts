import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { sentrySvelteKit } from '@sentry/sveltekit';

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: 'boris',
        project: 'client',
        url: 'https://sentry.incubateur.net',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
      adapter: 'node',
    }),
    sveltekit(),
  ],
  test: {
    include: ['tests/unit/**/*.{test,spec}.{js,ts}'],
  },
});
