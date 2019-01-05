const recordService = require('../service/recordService');

// 查询记录
const getRecords = async (ctx) => {
  const { query } = ctx;
  const records = await recordService.getRecords(query);
  ctx.body = {
    result: true,
    data: records,
  };
};

// 获取单条记录
const getRecord = async (ctx) => {
  const { query } = ctx;
  const record = await recordService.getRecord(query);
  ctx.body = {
    result: true,
    data: record,
  };
};

// 新增记录
const postRecord = async (ctx) => {
  const { body } = ctx.request;
  const result = await recordService.postRecord(body);
  ctx.body = { result };
};

// 修改记录
const putRecord = async (ctx) => {
  const { body } = ctx.request;
  const result = await recordService.putRecord(body);
  ctx.body = { result };
};

// 修改记录
const deleteRecord = async (ctx) => {
  const { body } = ctx.request;
  const result = await recordService.deleteRecord(body);
  ctx.body = { result };
};

module.exports = {
  'GET /records': getRecords,
  'GET /record': getRecord,
  'POST /record': postRecord,
  'PUT /record': putRecord,
  'DELETE /record': deleteRecord,
};
