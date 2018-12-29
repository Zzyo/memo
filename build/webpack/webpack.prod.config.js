const path = require('path');
const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const autoprefixer = require('autoprefixer');
const postcssPxToViewport = require('postcss-px-to-viewport');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('../../config/index');
const aliConfig = require('../../config/alioss');

const postcssLoader = {
  loader: require.resolve('postcss-loader'),
  options: {
    plugins: () => [
      postcssFlexbugsFixes,
      autoprefixer({ // 自动添加前缀
        browsers: ['last 2 versions', 'iOS >= 8'],
      }),
      postcssPxToViewport({ // 兼容750px宽度的设计稿
        viewportWidth: 750,
        viewportUnit: 'vw',
      }),
    ],
  },
};

module.exports = merge(require('./webpack.base'), ({
  mode: 'production',

  entry: [
    path.resolve('client', 'index.js'),
  ],

  output: {
    publicPath: config.useAlioss ? aliConfig.publicPath : '',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          path.resolve('client'),
        ],
        use: ExtractTextPlugin.extract({
          fallback: [
            'style-loader',
          ],
          use: [
            'css-loader',
            postcssLoader,
          ],
        }),
      },
      {
        test: /\.scss$/,
        include: [
          path.resolve('client'),
        ],
        use: ExtractTextPlugin.extract({
          fallback: [ // 提取之前处理
            'style-loader',
          ],
          use: [ // 提取之后处理
            'css-loader', // css转为commonjs
            postcssLoader,
            'sass-loader', // 将sass编译为css，默认使用node-sass
          ],
        }),
      },
    ],
  },

  performance: {
    hints: false,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('public', 'index.html'),
      favicon: path.resolve('public', 'favicon.ico'),
      title: 'a pwa memo',
      path: config.useAlioss ? aliConfig.publicPath : '',
    }),
    new ExtractTextPlugin({ // 抽离出样式文件
      filename: getPath => getPath('css/[name].[hash:8].css').replace('css/js', 'css'),
      allChunks: true,
    }),
    new BundleAnalyzerPlugin({ analyzerMode: 'static' }), // 生成分析报告
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin(), // 压缩 css 文件
      new UglifyJsPlugin({
        test: /\.js$/,
        exclude: /\/node_modules/,
        parallel: true, // 并行打包
        cache: true, // 开启缓存
        uglifyOptions: {
          compress: {
            drop_console: true, // 去掉所有console.*
            reduce_vars: true, // 把使用多次的静态值自动定义为变量
          },
        },
      }),
    ],
  },

}));
