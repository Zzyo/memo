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

module.exports = {
  'GET /records': getRecords,
  'POST /record': postRecord,
  'PUT /record': putRecord,
};
