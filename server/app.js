const Koa = require('koa');
const https = require('https');
const bodyParser = require('koa-bodyparser');
const proxy = require('koa-server-http-proxy');
const serve = require('koa-static');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const router2controller = require('./router2controller');
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

if (env === 'development') {
  // 开发环境，检查静态资源目录下是否有DllPlugin编译出来的文件
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
} else {
  // 生产环境，启动api代理服务器
  app.use(proxy('/api', {
    target: `http://${config.host}:${config.port}`,
    pathRewrite: { '^/api': '' },
  }));

  // 启动静态资源服务器
  if (config.useAlioss) {
    app.use(serve(path.resolve('server', 'views')));
  } else {
    app.use(serve(config.assetsRoot));
  }

  // 启动后端服务器
  https.createServer(options, app.callback()).listen(config.port, (err) => {
    if (err) {
      return;
    }
    console.log(`服务器启动成功，端口号：${config.port}`);
  });
}

module.exports = app;
