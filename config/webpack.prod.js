const merge = require('webpack-merge')
const common = require('./webpack.common.js')

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const { UglifyJsPlugin } = require('webpack').optimize

module.exports = merge(common, {
  devtool: 'nosources-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('./src/app/index.html'),
      inject: 'body',
    }),
    new UglifyJsPlugin({
      sourceMap: true,
      comments: false,
    }),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
})
