const Koa = require('koa');
const https = require('https');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const enforceHttps = require('koa-sslify');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const router2controller = require('./middleware/routerToControllerMiddleware');
const historyFallback = require('./middleware/historyFallbackMiddleware');
const config = require('../config/index');

const options = {
  key: fs.readFileSync(path.resolve('server', 'key', '1626481_www.xiaojiachen.com.key')),
  cert: fs.readFileSync(path.resolve('server', 'key', '1626481_www.xiaojiachen.com.pem')),
};

const env = process.env.NODE_ENV;
const app = new Koa();

// 配置ctx.body解析中间件
app.use(bodyParser());

// 配置自动检查controller
app.use(router2controller());

if (env === 'development') { // 开发环境
  // 检查静态资源目录下是否有DllPlugin编译出来的文件
  const isExists = fs.existsSync(`./${config.assetsRoot}/public/vendors.js`) && fs.existsSync(`./${config.assetsRoot}/public/vendors-manifest.json`);
  if (!isExists) {
    console.log(require('chalk').red('[Error]: 请先执行 npm run build:dll 生成vendors.js及vendors-manifest.json'));
    process.exit(0);
  }

  // 启动后端服务器
  app.listen(config.port, (err) => {
    if (err) {
      return;
    }
    console.log(`API Server Listening at http://${config.host}:${config.port}`);
  });

  // 启动静态资源服务器
  app.use(serve(config.assetsRoot));

  // 启动前端服务器
  const devServer = exec('node ./server/devServer.js');
  devServer.stdout.on('data', (stats) => {
    process.stdout.write(`${stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    })}\n`);
  });
} else if (config.useAlioss) { // 生产环境，使用阿里云
  // 刷新浏览器重定向，使所有浏览器操作都指向index.html
  app.use(historyFallback());

  // 启动静态资源服务器
  app.use(serve(path.resolve('server', 'static')));

  app.use(enforceHttps());

  // 启动后端服务器
  https.createServer(options, app.callback()).listen(config.port, (err) => {
    if (err) {
      return;
    }
    console.log(`Https Server Listening at https://${config.host}`);
  });
} else { // 生产环境，本地
  // 刷新浏览器重定向，使所有浏览器操作都指向index.html
  app.use(historyFallback());

  // 启动静态资源服务器
  app.use(serve(config.assetsRoot));

  // 启动后端服务器
  app.listen(config.port, (err) => {
    if (err) {
      return;
    }
    console.log(`Http Server Listening at http://${config.host}:${config.port}`);
  });
}

module.exports = app;
