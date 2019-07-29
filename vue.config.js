const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

// TODO: Closure One day...
// const ClosurePlugin = require('closure-webpack-plugin');

module.exports = {

  css: {
    sourceMap: false,
    extract: false
  },

  configureWebpack: {

    performance: {
      hints: 'warning',
      maxAssetSize: 1024 * 300,     // int (in bytes)
      maxEntrypointSize: 1024 * 600 // int (in bytes)
    },
    plugins: [
      new CopyPlugin([
        {
          from: path.join(__dirname, 'src/views/static/*.*'),
          to: path.join(__dirname, 'dist/static'),
          flatten: true
        },
        {
          from: path.join(__dirname, 'robots.txt'),
          to: path.join(__dirname, 'dist'),
          flatten: true
        }
      ])
    ],
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