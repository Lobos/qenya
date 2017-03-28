const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
let config = require('../config/webpack.config')

config = Object.assign({}, config, {
  devtool: 'cheap-module-source-map',
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:5001',
      'webpack/hot/only-dev-server',
      './frontend/index.js'
    ]
  }
})

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

