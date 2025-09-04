import postcssCustomMedia from 'postcss-custom-media';
import postcssGlobalData from '@csstools/postcss-global-data';
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

export default {
  plugins,
};
