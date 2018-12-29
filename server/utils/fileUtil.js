const fs = require('fs');
const path = require('path');
const EventProxy = require('eventproxy');

const proxy = new EventProxy();
const prepath = path.resolve('server', 'records');

// 将查询到的文件排序
const orderDatas = (options) => {
  const { datas, resolve } = options;
  let files = [];
  datas.forEach((data) => {
    files = files.concat(Object.values(JSON.parse(data)));
  });
  files.sort((f1, f2) => (f1.id < f2.id ? 1 : -1));
  resolve(files);
};

// 查询多个文件工具
const getFilesUtil = filenames => new Promise((resolve) => {
  proxy.after('data', filenames.length, (datas) => {
    orderDatas({ datas, resolve });
  });
  filenames.forEach((filename) => {
    fs.readFile(path.join(prepath, filename), 'utf-8', (err, data) => {
      if (err) {
        console.log('read file batch error', err);
        return;
      }
      proxy.emit('data', data);
    });
  });
});

// 查询单个文件工具
const getFileUtil = filename => new Promise((resolve) => {
  const isExists = fs.existsSync(path.join(prepath, filename));
  if (isExists) {
    fs.readFile(path.join(prepath, filename), 'utf-8', (err, data) => {
      if (err) {
        console.log('read file error', err);
        return;
      }
      resolve(JSON.parse(data));
    });
  } else {
    resolve(false);
  }
});

// 将记录添加到文件工具
const insertRecordIntoFileUtil = (filename, file) => new Promise((resolve) => {
  fs.writeFile(path.join(prepath, filename), JSON.stringify(file, null, 2), 'utf8', (err) => {
    if (err) {
      console.log('insert record into file error', err);
      return;
    }
    resolve(true);
  });
});

module.exports = {
  getFilesUtil,
  getFileUtil,
  insertRecordIntoFileUtil,
};
