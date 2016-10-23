var path = require('path')
var autoprefixer = require('autoprefixer')
var precss = require('precss')

module.exports = {
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/static/js/'
  },
  externals: {'react': 'React', 'react-dom': 'ReactDOM'},
  plugins: [],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel'
      },
      {
        test: /\.(css|less)$/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader'
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader?modules&localIdentName=[hash:base64:8]',
          'postcss-loader',
          'sass-loader'
        ]
      },
      { test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader?limit=10000&name=./images/[name].[ext]'
      }
    ]
  },
  postcss: function () {
    return [autoprefixer, precss]
  }
}
