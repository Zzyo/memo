module.exports = {
  plugins: {
    autoprefixer: { // 自动添加前缀
      browsers: ['last 2 versions', 'iOS >= 8'],
    },
    'postcss-px-to-viewport': { // 兼容750px宽度的设计稿
      viewportWidth: 750,
      viewportUnit: 'vw',
    },
  },
};
