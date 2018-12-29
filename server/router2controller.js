// 遍历文件夹(默认controller)下的controller
const fs = require('fs');
const path = require('path');
const router = require('koa-router')();

function addMapping(route, mapping) {
  for (const url in mapping) {
    if (url.startsWith('GET ')) {
      const getPath = url.substring(4);
      route.get(getPath, mapping[url]); // GET路由：router.get('/categories')
    } else if (url.startsWith('POST ')) {
      const postPath = url.substring(5);
      route.post(postPath, mapping[url]);
    } else if (url.startsWith('PUT ')) {
      const putPath = url.substring(4);
      route.put(putPath, mapping[url]);
    } else if (url.startsWith('DELETE ')) {
      const delPath = url.substring(7);
      route.del(delPath, mapping[url]);
    } else {
      console.log(`invalid URL: ${url}`);
    }
  }
}

function addControllers(route, dir) {
  fs.readdirSync(path.resolve(__dirname, dir)).filter(f => f.endsWith('.js')).forEach((f) => {
    const mapping = require(path.resolve(__dirname, dir, f));
    addMapping(route, mapping);
  });
}

module.exports = (dir) => {
  const controllersDir = dir || 'controller';
  addControllers(router, controllersDir);
  return router.routes();
};
