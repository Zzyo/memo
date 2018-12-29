const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const config = require('../../config/index');

module.exports = {
  entry: {
    vendors: config.compile_vendors,
  },

  output: {
    path: path.resolve(config.assetsRoot),
    filename: 'public/[name].js',
    library: '[name]_[hash]',
  },

  plugins: [
    new BundleAnalyzerPlugin({ analyzerMode: 'static' }), // 生成分析报告
    new webpack.DllPlugin({ // 生成第三方库路径描述文件[name]-manifest.json
      path: path.resolve(config.assetsRoot, 'public', '[name]-manifest.json'),
      name: '[name]_[hash]',
      context: __dirname,
    }),
  ],
};
