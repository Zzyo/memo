const webpack = require('webpack');
const chalk = require('chalk');
const del = require('delete');
const fs = require('fs');

const config = require('../../config/index');
const Spinner = require('../libs/spinner');

// // 检查静态资源目录下是否有DllPlugin编译出来的文件
console.log(chalk.blue(`正在检查${config.assetsRoot}目录下的静态文件`));
const isExists = fs.existsSync(`./${config.assetsRoot}/public/vendors.js`) && fs.existsSync(`./${config.assetsRoot}/public/vendors-manifest.json`);
if (!isExists) {
  console.log(chalk.red('[Error]: 请先执行 npm run build:dll 生成vendors.js及vendors-manifest.json'));
  process.exit(0);
}

// // 删除静态资源目录下的文件
console.log(chalk.blue(`正在删除${config.assetsRoot}目录下的静态资源`));
del.sync([`./${config.assetsRoot}/css/**`, `./${config.assetsRoot}/fonts/**`, `./${config.assetsRoot}/img/**`, `./${config.assetsRoot}/js/**`, `./${config.assetsRoot}/*.html`]);

const spinner = new Spinner('Building...\n');

webpack(require('../webpack/webpack.prod.config.js'), (err, stats) => {
  spinner.stop();

  if (err) throw err;

  process.stdout.write(`${stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  })}\n`);

  if (config.useAlioss) { // 静态资源上传阿里云，index.html文件移动
    require('../utils/upload')();
  }
});
