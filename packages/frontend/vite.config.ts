import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from '@zerodevx/svelte-img/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    modulePreload: false,
  },
  plugins: [
    sveltekit(),
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
