import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from '@zerodevx/svelte-img/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    modulePreload: false,
  },
  plugins: [
    sveltekit(),
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: 'boris',
        project: 'client',
        url: 'https://sentry.incubateur.net/',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
      adapter: 'node',
    }),
    imagetools({
      profiles: {
        run: new URLSearchParams('w=448;768;992;1248;1920&format=webp;jpg'),
      },
    }),
  ],
  test: {
    include: ['tests/unit/**/*.{test,spec}.{js,ts}'],
  },
});
