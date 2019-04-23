const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  css: {
    sourceMap: true,
    extract: false
  },

  configureWebpack: {
    resolve: {
      alias: {
        moment: path.join(__dirname, 'node_modules/moment/min/moment.min.js')
      }
    },
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