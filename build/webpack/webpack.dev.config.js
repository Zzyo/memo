const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('../../config/index');

module.exports = merge(require('./webpack.base'), ({
  mode: 'development',

  devtool: 'cheap-module-eval-source-map',

  devServer: {
    hot: true, // dev server 的配置要启动 hot，或者在命令行中带参数开启
  },

  entry: [
    'eventsource-polyfill',
    `webpack-dev-server/client/index.js?http://${config.host}:${config.devPort}`,
    'webpack/hot/dev-server.js',
    path.resolve('client', 'index.js'),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          path.resolve('client'),
        ],
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.scss$/,
        include: [
          path.resolve('client'),
        ],
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('public', 'index.html'),
      favicon: path.resolve('public', 'favicon.ico'),
      title: 'a pwa memo',
      path: '',
    }),
    new webpack.NamedModulesPlugin(), // 用于启动 HMR 时可以显示模块的相对路径
    new webpack.HotModuleReplacementPlugin(), // Hot Module Replacement 的插件
  ],
}));
