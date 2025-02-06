import postcssCustomMedia from 'postcss-custom-media';
import postcssGlobalData from '@csstools/postcss-global-data';
import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';
import cssNano from 'cssnano';

const plugins = [
  postcssGlobalData({
    files: ['src/assets/styles/_vars.css'],
  }),
  postcssCustomMedia(),
  cssNano({
    preset: 'default',
  }),
];

if (process.env.NODE_ENV !== 'development') {
  plugins.push(
    purgeCSSPlugin({
      content: ['./src/**/*.svelte', './src/**/*.html'],
      safelist: [/svelte-/, /placement/, /modal/, /global/],
    }),
  );
}

export default {
  plugins,
};
