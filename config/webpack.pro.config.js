var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var precss = require('precss')

module.exports = {
  entry: {
    app: [
      './frontend/index.js'
    ]
  },
  output: {
    path: path.join(__dirname, '../static/js'),
    filename: '[name].js',
    publicPath: '/static/js/'
  },
  externals: { 'react': 'React', 'react-dom': 'ReactDOM', 'graphiql': 'GraphiQL' },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
        drop_console: true,
        collapse_vars: true
      }
    })
  ],
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
            presets: [
              ['es2015', { 'modules': false }],
              'react'
            ],
            plugins: [
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
