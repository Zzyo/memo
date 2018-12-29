const webpack = require('webpack');
const WebpackDerServer = require('webpack-dev-server');
const opn = require('opn');

const devConfig = require('../build/webpack/webpack.dev.config');
const config = require('../config/index');

new WebpackDerServer(webpack(devConfig), {
  hot: true,
  quiet: false,
  host: config.host,
  contentBase: '../client',
  historyApiFallback: true,
  proxy: {
    '/api/*': {
      target: `http://${config.host}:${config.port}`,
      pathRewrite: { '^/api': '' },
    },
    '/public/vendors.js': {
      target: `http://${config.host}:${config.port}`,
    },
  },
}).listen(config.devPort, config.host, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Webpack Server Listening at http://${config.host}:${config.devPort}`);
  opn(`http://${config.host}:${config.devPort}`);
});
