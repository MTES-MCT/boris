import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: 'boris',
        project: 'client',
        url: 'https://sentry.incubateur.net/',
      },
      adapter: 'node',
    }),
    sveltekit(),
  ],
  test: {
    include: ['tests/unit/**/*.{test,spec}.{js,ts}'],
  },
});
