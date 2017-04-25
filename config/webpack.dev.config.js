var path = require('path')
var autoprefixer = require('autoprefixer')
var precss = require('precss')

module.exports = {
  devtool: 'source-map',
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:5002',
      'webpack/hot/only-dev-server',
      './frontend/index.js'
    ]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/static/js/'
  },
  externals: { 'react': 'React', 'react-dom': 'ReactDOM', 'graphiql': 'GraphiQL' },
  plugins: [],
  resolve: {
    alias: {
      _: path.resolve(__dirname, '../frontend')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['es2015', { 'modules': false }],
              'react'
            ],
            plugins: [
              'react-hot-loader/babel',
              'es6-promise',
              'transform-object-rest-spread',
              'transform-object-assign'
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]-[local]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  precss,
                  autoprefixer
                ]
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: './images/[name].[ext]'
            }
          }
        ]
      }
    ]
  }
}
