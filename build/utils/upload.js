const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const config = require('../../config/index');
const aliConfig = require('../../config/alioss');

module.exports = () => {
  const client = new OSS({
    region: aliConfig.region,
    accessKeyId: aliConfig.accessKeyId,
    accessKeySecret: aliConfig.accessKeySecret,
    bucket: aliConfig.bucket,
  });

  const filePath = path.resolve(config.assetsRoot);

  console.log(chalk.green(`正在上传文件至阿里云oss，文件目录${filePath}`));
  console.log(chalk.yellow('------------------------'));

  function readDir(fPath) {
    fs.readdir(fPath, (err, files) => {
      if (err) {
        console.log(chalk.yellow(`[Warning]: ${err}`));
      } else {
        files.forEach((filename) => {
          const filedir = path.join(fPath, filename);
          fs.stat(filedir, (eror, stats) => {
            if (eror) {
              console.log(chalk.yellow(`[Warning]: 获取文件${filename}信息失败`));
            } else {
              const isFile = stats.isFile(); // 文件
              const isDir = stats.isDirectory(); // 文件夹
              if (filename === 'index.html') { // 将index.html移动到server/static目录下
                fs.rename(filedir, path.resolve('server', 'static', 'index.html'));
              } else if (filename === '.DS_Store' || filename === 'report.html') { // 删除.DS_Store和report.html
                fs.unlinkSync(filedir);
              } else if (isFile) { // 文件上传
                const name = filedir.slice(filePath.length + 1);
                client.put(`${aliConfig.prefix}/${name}`, path.join(filePath, name)).then(() => {
                  console.log(chalk.green(`文件上传成功：${aliConfig.publicPath}${name}`));
                  if (filename !== 'vendors-manifest.json' && filename !== 'vendors.js') {
                    fs.unlinkSync(filedir);
                  }
                });
              }
              if (isDir) {
                readDir(filedir); // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
              }
            }
          });
        });
      }
    });
  }

  readDir(filePath);
};
