const path = require('path');

module.exports = {
  productionSourceMap: false,

  chainWebpack: config => {
    const apiClientLocation = process.env.API_TYPE // mock or server
    config.resolve.alias
      .set('client-api', path.resolve(__dirname, `src/api/${apiClientLocation}`))
  },

  css: {
    sourceMap: true,
    extract: false
  },

  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  parallel: undefined
}