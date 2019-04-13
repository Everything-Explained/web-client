const path = require('path');

module.exports = {
  css: {
    sourceMap: true,
    extract: false
  },

  chainWebpack: config => {
    const apiClientLocation = process.env.API_TYPE // mock or server
    config.resolve.alias
      .set('client-api', path.resolve(__dirname, `src/api/${apiClientLocation}`))
  },

  publicPath: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined
}