const path = require('path')

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { WatchIgnorePlugin } = require('webpack')
const isDev = process.argv.indexOf('-p') === -1
let removeNull = array => array.filter(e => e !== null)

const ASSETS_PATH = [path.resolve('./src/assets'), path.resolve('./poke-assets')]

let urlLoaderOptions = Object.assign(
  {
    limit: 16 * 1024,
  },
  isDev
    ? {
        // use full path in development for better readability
        name: '[path][name].[ext]',
      }
    : {
        outputPath: 'assets/',
      },
)

module.exports = {
  entry: './src/app/index.ts',
  output: {
    path: path.resolve('./dist'),
    filename: 'bundle.js',
    publicPath: '',
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js',
      '.jsx',
      '.json',
      isDev ? '.dev.tsx' : '.prod.tsx',
      isDev ? '.dev.js' : '.prod.js',
    ],
    modules: ['node_modules', path.resolve('./src'), path.resolve('./poke-assets')],
  },
  devtool: 'source-map',
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new WatchIgnorePlugin([/sass\.d\.ts$/]),
    new FriendlyErrorsWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        include: path.resolve('./src'),
        use: [
          { loader: 'cache-loader' },
          {
            loader: 'thread-loader',
            options: {
              // there should be 1 cpu for the fork-ts-checker-webpack-plugin
              workers: require('os').cpus().length - 1,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true, // use transpileOnly mode to speed-up compilation
              happyPackMode: true, // use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
            },
          },
        ],
      },
      {
        test: /\.(xml|blk)$/,
        include: ASSETS_PATH,
        use: [
          {
            loader: 'raw-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        include: ASSETS_PATH,
        use: [
          {
            loader: 'url-loader',
            options: urlLoaderOptions,
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        include: ASSETS_PATH,
        use: [
          {
            loader: 'sizeof-loader',
            options: urlLoaderOptions,
          },
        ],
      },
      {
        test: /\.(css)$/,
        include: [path.resolve('./src'), path.resolve('./node_modules')],
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.global\.(scss|sass)$/,
        include: path.resolve('./src'),
        use: removeNull([
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve('./src/styles')],
            },
          },
        ]),
      },
      {
        // match only files that do not contain word '.global'
        test: /^(?!.*(\.global)).*\.(scss|sass)$/,
        include: path.resolve('./src'),
        use: removeNull([
          'style-loader',
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              localIdentName: isDev
                ? '[name]_[local]_[hash:base64:3]'
                : '[hash:base64:10]',
              modules: true,
              importLoaders: 1,
              namedExport: true,
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve('./src/styles')],
              sourceMap: false,
            },
          },
        ]),
      },
    ],
  },
}
