import postcssCustomMedia from 'postcss-custom-media';
import postcssGlobalData from '@csstools/postcss-global-data';

export default {
  plugins: [
    postcssGlobalData({
      files: ['src/assets/styles/_vars.css'],
    }),
    postcssCustomMedia(),
  ],
};
