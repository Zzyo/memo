import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';

// 倒入字体图标
import './iconfont/iconfont.css';

// bundle模型用来异步加载组件
import Record from 'bundle-loader?lazy&name=record!./components/Record/index.tsx';
import Bundle from './bundle';

// 同步引入
import List from './components/List/index.tsx';

// 加载store
import RecordStore from './stores/RecordStore';

// 注册serviceWorker服务;
if ('serviceWorker' in navigator) {
  const { serviceWorker } = navigator;
  serviceWorker.register('./service-worker.js');
  serviceWorker.addEventListener('message', (e) => {
    if (e.data === 'sw.post') {
      window.alert('无网不支持新增请求');
    } else if (e.data === 'sw.put') {
      window.alert('无网不支持修改请求');
    } else if (e.data === 'sw.delete') {
      window.alert('无网不支持删除请求');
    } else {
      window.alert(`获取资源${e.data}失败`);
    }
  });
}

const store = {
  recordStore: new RecordStore(),
};

// 生成懒加载组件
const generateLazyComponent = el => () => (
  <Bundle load={el}>
    {Component => <Component />}
  </Bundle>
);

ReactDOM.render(
  <Provider {...store}>
    <BrowserRouter basename="/">
      <div>
        <Route exact path="/" component={List} />
        <Route path="/record" component={generateLazyComponent(Record)} />
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('app'),
);
