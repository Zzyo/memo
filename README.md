# memo

一个基于 pwa 的备忘录。

## 项目配置文件

config/index.js 与 config/alioss.js (git已忽略) 是两个配置文件，配置信息如下：

```
// config/index.js
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

// config/alioss.js
module.exports = {
  region: '',
  accessKeyId: '',
  accessKeySecret: '',
  bucket: '',
  prefix: '', // 上传到alioss添加的前缀
  publicPath: '', // 静态资源前缀
};
```

## 使用方法

```
// 安装依赖包
npm install

// 启动开发环境
npm run dev

// 编译第三方模块
npm run build:dll

// 编译
npm run build

// 启动生产服务器
npm run start

// 使用pm2启动生产服务器
pm2 start
```

## 文档地址

* [【memo】项目搭建笔记：概述](https://zzyo.github.io/2019/01/06/%E3%80%90memo%E3%80%91%E9%A1%B9%E7%9B%AE%E6%90%AD%E5%BB%BA%E7%AC%94%E8%AE%B0%EF%BC%9A%E6%A6%82%E8%BF%B0/)
* [【memo】项目搭建笔记一：react环境](https://zzyo.github.io/2019/01/06/%E3%80%90memo%E3%80%91%E9%A1%B9%E7%9B%AE%E6%90%AD%E5%BB%BA%E7%AC%94%E8%AE%B0%E4%B8%80%EF%BC%9Areact%E7%8E%AF%E5%A2%83/)
* [【memo】项目搭建笔记二：webpack配置](https://zzyo.github.io/2019/01/07/%E3%80%90memo%E3%80%91%E9%A1%B9%E7%9B%AE%E6%90%AD%E5%BB%BA%E7%AC%94%E8%AE%B0%E4%BA%8C%EF%BC%9Awebpack%E9%85%8D%E7%BD%AE/)
* [【memo】项目搭建笔记三：typescript配置](https://zzyo.github.io/2019/01/07/%E3%80%90memo%E3%80%91%E9%A1%B9%E7%9B%AE%E6%90%AD%E5%BB%BA%E7%AC%94%E8%AE%B0%E4%B8%89%EF%BC%9Atypescript%E9%85%8D%E7%BD%AE/)
* [【memo】项目搭建笔记四：服务器](https://zzyo.github.io/2019/01/08/%E3%80%90memo%E3%80%91%E9%A1%B9%E7%9B%AE%E6%90%AD%E5%BB%BA%E7%AC%94%E8%AE%B0%E5%9B%9B%EF%BC%9A%E6%9C%8D%E5%8A%A1%E5%99%A8/)
* [【memo】项目搭建笔记五：生产环境部署](https://zzyo.github.io/2019/01/08/%E3%80%90memo%E3%80%91%E9%A1%B9%E7%9B%AE%E6%90%AD%E5%BB%BA%E7%AC%94%E8%AE%B0%E4%BA%94%EF%BC%9A%E7%94%9F%E4%BA%A7%E7%8E%AF%E5%A2%83%E9%83%A8%E7%BD%B2/)
* [【memo】项目搭建笔记六：pwa](https://zzyo.github.io/2019/01/08/%E3%80%90memo%E3%80%91%E9%A1%B9%E7%9B%AE%E6%90%AD%E5%BB%BA%E7%AC%94%E8%AE%B0%E5%85%AD%EF%BC%9Apwa/)
