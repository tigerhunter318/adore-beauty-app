/* eslint-disable */
const webpack = require('webpack')
const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
// const GitRevisionPlugin = require('git-revision-webpack-plugin')
// const gitRevisionPlugin = new GitRevisionPlugin()

const config = {
  entry: ['@babel/polyfill'],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.join(__dirname, '../')
    }
  },
  output: {
    path: path.join(__dirname, '../bundles'),
    publicPath: '/',
    filename: '[name].js'
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['*.js, *.html']
    }),
    new HtmlWebpackPlugin({
      inlineSource: '.(js|css)$', // embed all javascript and css inline,
      template: path.join(__dirname, 'template.html')
    }),
    new webpack.BannerPlugin({
      banner: `\n[file]\nhash:[chunkhash]\nBuild date ${new Date(Date.now())}\n`,
    }),
    new HtmlWebpackInlineSourcePlugin()
  ],
  optimization: {
    // runtimeChunk: 'single',
    // minimize: false,
    // splitChunks: {
    //   cacheGroups: {
    //     vendor: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: 'vendors',
    //       chunks: 'all'
    //     }
    //   }
    // }
    // minimizer: [new UglifyJsPlugin()],
  },
}

module.exports = {
  ...config
}
