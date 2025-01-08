import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
    alias: {
      $assets: 'src/assets',
      $components: 'src/lib/components',
      $routes: 'src/routes',
      $tests: 'tests/',
    },
    prerender: {
      handleHttpError: ({ path, message }) => {
        // ignore deliberate link to shiny 404 page
        if (path.includes('/blog')) {
          return;
        }

        // otherwise fail the build
        throw new Error(message);
      },
    },
  },
  onwarn: (warning, handler) => {
    if (warning.code === 'a11y_no_redundant_roles') return;
    handler(warning);
  },
};

export default config;
