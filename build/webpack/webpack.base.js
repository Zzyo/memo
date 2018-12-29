const path = require('path');
const webpack = require('webpack');

const config = require('../../config/index');

module.exports = {
  output: {
    path: path.resolve(config.assetsRoot), // 指定打包后的文件夹
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[hash:8].js', // 指定分离出来的代码文件的名称
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(ts|tsx)$/,
        include: [
          path.resolve('client'),
        ],
        use: 'tslint-loader',
      },
      {
        test: /\.(ts|tsx)$/,
        include: [
          path.resolve('client'),
        ],
        use: 'awesome-typescript-loader',
      },
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        include: [
          path.resolve('client'),
        ],
        use: 'eslint-loader',
      },
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve('client'),
        ],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015', 'stage-0', 'react'] },
        }],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 500,
          name: 'img/[name].[ext]',
        },
      },
      {
        test: /\.ico$/,
        loader: 'file-loader',
        query: {
          name: 'img/[name].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 500,
          name: 'fonts/[name].[ext]',
        },
      },
    ],
  },

  plugins: [
    new webpack.DllReferencePlugin({ // 第三方库配置
      context: __dirname,
      manifest: require(`../../${config.assetsRoot}/public/vendors-manifest.json`),
    }),
  ],

  optimization: {
    splitChunks: { // 公共模块抽离成文件vendor.[hash:8].js
      chunks: 'all',
      name() {
        return 'vendor';
      },
    },
  },
};
