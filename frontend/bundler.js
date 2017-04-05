const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
let config = require('../config/webpack.dev.config')

config.plugins.unshift(new webpack.HotModuleReplacementPlugin())

module.exports = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  quiet: false,
  noInfo: true,
  stats: {
    colors: true
  }
})

