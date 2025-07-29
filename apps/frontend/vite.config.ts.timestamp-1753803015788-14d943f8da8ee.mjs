// vite.config.ts
import { sentrySvelteKit } from 'file:///Users/fuzz/beta.gouv/boris/node_modules/@sentry/sveltekit/build/cjs/index.server.js';
import { sveltekit } from 'file:///Users/fuzz/beta.gouv/boris/node_modules/@sveltejs/kit/src/exports/vite/index.js';
import { imagetools } from 'file:///Users/fuzz/beta.gouv/boris/node_modules/@zerodevx/svelte-img/dist/vite.js';
import { defineConfig } from 'file:///Users/fuzz/beta.gouv/boris/node_modules/vitest/dist/config.js';
var vite_config_default = defineConfig({
  build: {
    modulePreload: false,
  },
  plugins: [
    sveltekit(),
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: 'boris',
        project: 'apps/client',
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
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZnV6ei9iZXRhLmdvdXYvYm9yaXMvYXBwcy9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2Z1enovYmV0YS5nb3V2L2JvcmlzL2FwcHMvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2Z1enovYmV0YS5nb3V2L2JvcmlzL2FwcHMvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBzZW50cnlTdmVsdGVLaXQgfSBmcm9tICdAc2VudHJ5L3N2ZWx0ZWtpdCc7XG5pbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tICdAc3ZlbHRlanMva2l0L3ZpdGUnO1xuaW1wb3J0IHsgaW1hZ2V0b29scyB9IGZyb20gJ0B6ZXJvZGV2eC9zdmVsdGUtaW1nL3ZpdGUnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJ1aWxkOiB7XG4gICAgbW9kdWxlUHJlbG9hZDogZmFsc2UsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICBzdmVsdGVraXQoKSxcbiAgICBzZW50cnlTdmVsdGVLaXQoe1xuICAgICAgc291cmNlTWFwc1VwbG9hZE9wdGlvbnM6IHtcbiAgICAgICAgb3JnOiAnYm9yaXMnLFxuICAgICAgICBwcm9qZWN0OiAnYXBwcy9jbGllbnQnLFxuICAgICAgICB1cmw6ICdodHRwczovL3NlbnRyeS5pbmN1YmF0ZXVyLm5ldC8nLFxuICAgICAgICBhdXRoVG9rZW46IHByb2Nlc3MuZW52LlNFTlRSWV9BVVRIX1RPS0VOLFxuICAgICAgfSxcbiAgICAgIGFkYXB0ZXI6ICdub2RlJyxcbiAgICB9KSxcbiAgICBpbWFnZXRvb2xzKHtcbiAgICAgIHByb2ZpbGVzOiB7XG4gICAgICAgIHJ1bjogbmV3IFVSTFNlYXJjaFBhcmFtcygndz00NDg7NzY4Ozk5MjsxMjQ4OzE5MjAmZm9ybWF0PXdlYnA7anBnJyksXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICB0ZXN0OiB7XG4gICAgaW5jbHVkZTogWyd0ZXN0cy91bml0LyoqLyoue3Rlc3Qsc3BlY30ue2pzLHRzfSddLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZTLFNBQVMsdUJBQXVCO0FBQzdVLFNBQVMsaUJBQWlCO0FBQzFCLFNBQVMsa0JBQWtCO0FBQzNCLFNBQVMsb0JBQW9CO0FBRTdCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxFQUNqQjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsVUFBVTtBQUFBLElBQ1YsZ0JBQWdCO0FBQUEsTUFDZCx5QkFBeUI7QUFBQSxRQUN2QixLQUFLO0FBQUEsUUFDTCxTQUFTO0FBQUEsUUFDVCxLQUFLO0FBQUEsUUFDTCxXQUFXLFFBQVEsSUFBSTtBQUFBLE1BQ3pCO0FBQUEsTUFDQSxTQUFTO0FBQUEsSUFDWCxDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxVQUFVO0FBQUEsUUFDUixLQUFLLElBQUksZ0JBQWdCLHlDQUF5QztBQUFBLE1BQ3BFO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osU0FBUyxDQUFDLHFDQUFxQztBQUFBLEVBQ2pEO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
