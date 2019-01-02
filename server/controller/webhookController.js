const webhookService = require('../service/webhookService');

// 接受webhook消息，执行shell
const postRestart = async (ctx) => {
  const result = await webhookService.postRestart();
  ctx.body = { result };
};

module.exports = {
  'POST /restart': postRestart,
};
