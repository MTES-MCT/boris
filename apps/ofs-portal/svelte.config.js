import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      $assets: 'src/assets',
      $components: "src/lib/components",
      $lib: "src/lib",
      $routes: "src/routes",
    },
  },
};

export default config;
