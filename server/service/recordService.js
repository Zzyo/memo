const fs = require('fs');
const path = require('path');

const { getFilesUtil, getRecordUtil, getFileUtil, insertRecordIntoFileUtil } = require('../utils/fileUtil');

const getRecords = async (query) => {
  const keywords = query.keywords || '';
  const paths = fs.readdirSync(path.resolve('server', 'records')).filter(name => name !== 'README.md');
  const files = await getFilesUtil(paths);
  const records = files.filter(file => file.content.indexOf(keywords) > -1);
  return records;
};

const getRecord = async (query) => {
  const { id } = query;
  const paths = fs.readdirSync(path.resolve('server', 'records')).filter(name => name !== 'README.md');
  const record = await getRecordUtil(paths, id);
  return record;
};

const postRecord = async (body) => {
  const { id, date, content, tag } = body;
  const filename = `${date}.json`;
  const file = await getFileUtil(filename);
  let result;
  if (file === false) { // 文件不存在，则创建新文件新记
    const obj = {};
    obj[String(id)] = { id, date, content, tag };
    result = await insertRecordIntoFileUtil(filename, obj);
  } else { // 文件存在，则在文件里添加记录
    file[String(id)] = { id, date, content, tag };
    result = await insertRecordIntoFileUtil(filename, file);
  }
  return result;
};

const putRecord = async (body) => {
  const { id, date, content, tag } = body;
  const filename = `${date}.json`;
  const file = await getFileUtil(filename);
  file[String(id)] = { id, date, content, tag };
  const result = await insertRecordIntoFileUtil(filename, file);
  return result;
};

module.exports = {
  getRecords,
  getRecord,
  postRecord,
  putRecord,
};
