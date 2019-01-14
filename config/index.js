module.exports = {
  host: '192.168.36.182', // 启动服务器主机或域名
  port: 4900, // 后端服务器端口
  devPort: 4901, // 前端服务器端口
  useAlioss: false, // 是否使用alioss保存，如果true则编译时上传静态资源并访问server/static下的html，false则访问assetsRoot配置的文件夹
  assetsRoot: 'dist', // 打包后的文件夹名称
  compile_vendors: [ // 需要抽离的第三方模块包
    'react',
    'react-dom',
    'react-router-dom',
    'redux',
    'react-redux',
    'redux-saga',
    'prop-types',
    'regenerator-runtime',
    'whatwg-fetch',
  ],
};
