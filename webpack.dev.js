const merge = require('webpack-merge')
const common = require('./webpack.common.js')

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { NamedModulesPlugin, HotModuleReplacementPlugin } = require('webpack')

module.exports = merge(common, {
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: path.resolve('./dist'),
    historyApiFallback: true,
    quiet: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('./src/app/index.html'),
      inject: 'body',
    }),
    new NamedModulesPlugin(),
    new HotModuleReplacementPlugin(),
  ],
})
