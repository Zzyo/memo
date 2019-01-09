module.exports = {
  host: 'www.xiaojiachen.com', // 启动服务器主机或域名
  port: 443, // 后端服务器端口
  devPort: 4901, // 前端服务器端口
  useAlioss: true, // 是否使用alioss保存，如果true则编译时上传静态资源并访问server/static下的html，false则访问assetsRoot配置的文件夹
  assetsRoot: 'dist', // 打包后的文件夹名称
  compile_vendors: [ // 需要抽离的第三方模块包
    'react',
    'react-dom',
    'react-router-dom',
    'mobx',
    'mobx-react',
    'prop-types',
    'regenerator-runtime',
    'whatwg-fetch',
  ],
};
