/* eslint-disable no-dupe-keys */
/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = (ctx) => ({
  plugins: {
    'postcss-easy-import'        : null,
    'postcss-css-variables'      : null,
    'autoprefixer'               : null,
    'postcss-custom-media'       : null,
    'postcss-sort-media-queries' : { sort: 'desktop-first'},

    'cssnano' :
      ctx.env == 'production'
        ? { preset: 'advanced' }
        : { preset: 'default' },
  }
});